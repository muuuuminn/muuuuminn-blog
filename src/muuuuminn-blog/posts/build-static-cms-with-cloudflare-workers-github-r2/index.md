---
title: "【AI生成】AIと相談しながらGitHub・Cloudflare Workers・R2で個人ブログ用CMSを作った"
description: "AIと相談しながら、MarkdownをGitHubへ保存し、Cloudflare Workers Buildsで静的ページを生成する個人ブログ用CMSを構築したときの判断と躓きをまとめます。"
date: "2026-09-27T06:00:00.000Z"
coverImage: "/post/akira_thumbnail.png"
ogImageUrl: "/post/akira_thumbnail.png"
category: "0"
tags: "1,35,39,47"
status: "draft"
---

※ この記事は、CMSを構築するまでの自分とAIとのやりとりをもとにAIが生成したものです。内容とコードはAIの出力をそのまま信用せず、公開前に確認する前提です。

## はじめに

このブログに自分だけがアクセスできるCMSを追加した。
記事を管理するためだけに大きなサービスを用意するのは避けたかったので、今あるNext.jsとCloudflare Workersの構成をなるべく崩さない方針にした。

最終的な構成は以下となった。

- 管理画面：Next.jsの`/admin`
- 認証：Cloudflare Access
- 記事：GitHubにMarkdownとして保存
- 画像：Cloudflare R2に保存
- 公開：GitHubの`main`へのコミットをきっかけにWorkers Buildsで再ビルド
- 下書き：Markdownのfront matterにある`status`で管理

記事を保存するとGitHubへコミットされる。そしてCloudflare側で静的ページを再生成する。
かなり素朴な構成だけど、管理者が自分ひとりならこれくらいで良いと思った。

## 最初に考えたこと

要件としては、次のようなものだった。

- 管理画面へアクセスするのは自分だけ
- 他のユーザーはアクセスできない
- インフラはCloudflareを使う
- 記事は最終的に静的ページとして公開したい
- 下書きのたびにGitのブランチを分けたくない

特に重要だったのは、CMSから毎回動的に記事を返すのではなく、**記事を保存したら静的ページを生成する**という点だった。

ブログの記事を読むたびにデータベースへ問い合わせる必要はない。
記事を書いたときだけビルドが走り、その結果を配信する方がこのブログには合っている。

## 記事をGitHubとR2のどちらへ保存するか

最初は記事自体をGitHubへ保存するか、CloudflareのS3のようなサービスであるR2へ保存するかを考えた。

結論としては、次のように分けた。

- Markdown：GitHub
- 画像：R2

MarkdownをGitHubへ置くと、現在のブログが使っているファイル構成をそのまま維持できる。
変更履歴もコミットとして残るし、問題があればGitHub上で直接戻せる。

一方で画像はバイナリなので、GitHubへ増やし続けるよりR2へ置いた方が扱いやすい。
CMSから画像をアップロードするとUUIDを使ったファイル名でR2へ保存され、記事には公開URLを埋め込むようにした。

```text
Markdown: src/muuuuminn-blog/posts/{slug}/index.md
Image:    https://assets.muuuuminn.com/cms/{uuid}.{extension}
```

## 下書きはfront matterで管理する

下書きごとにブランチを作る案もあった。
しかし自分ひとりで記事を書くのに、記事を編集するたびにブランチを意識するのは面倒だと思った。

そこでfront matterへ`status`を追加した。

```yaml
status: draft # draft | published | archived
```

ビルド時に`published`の記事だけを読み込み、`draft`と`archived`は静的ページの生成対象から外している。
既存記事には`status`が無いため、互換性を維持するために未指定の場合は`published`として扱う。

この方法なら同じ`main`ブランチで下書きと公開済みの記事を管理できる。

ただしリポジトリがPublicの場合、`draft`であってもGitHub上ではMarkdownを読める。
Webサイトへ公開されないという意味での下書きであり、非公開情報を保存できるわけではない点には注意が必要となる。

## 保存から公開までの流れ

CMSで記事を保存してから公開されるまでの流れは以下となる。

```text
/adminで記事を編集
  ↓
GitHub Contents APIでMarkdownをmainへ保存
  ↓
GitHubのコミットをWorkers Buildsが検知
  ↓
publishedの記事だけを読み込む
  ↓
Next.jsで静的ページを生成
  ↓
Cloudflare Workersへデプロイ
```

下書きを保存した場合もGitHubへのコミットが発生するため、ビルド自体は動く。
ただし生成対象には含まれない。

ビルド回数を減らしたくなったら改善の余地はあるが、まずは構成を単純にすることを優先した。

## 管理画面を自分だけに制限する

認証にはCloudflare Accessを使った。
CMS用のSelf-hosted Applicationを作り、次の2つを保護している。

```text
muuuuminn.com/admin*
muuuuminn.com/api/admin*
```

Access Policyの`Include`には`Emails`を選び、自分のメールアドレスを1件だけ指定した。
`Everyone`やメールドメイン単位の許可は使用していない。

認証方法は、すでにCloudflare Pages用として作成していたOne-time PINを再利用した。
Identity Providerについては名前にCloudflare Pagesと入っていたが、特定のApplication専用というわけではないので、そのままCMSにも使用できた。

さらにWorker側でも以下を検証している。

- `Cf-Access-Jwt-Assertion`の署名
- issuer
- Access ApplicationのAUD
- JWTに含まれるメールアドレス
- 書き込みリクエストのOrigin

Cloudflare Accessを通過したというだけで信用せず、API側でも自分のメールアドレスと一致することを確認するようにした。

## GitHubトークンの権限

CMSはGitHub Contents APIを使って記事を読み書きする。
Fine-grained personal access tokenを作り、権限は次のように絞った。

```text
Repository: muuuuminn-blogのみ
Contents: Read and write
```

トークン名は`muuuuminn-blog-cms-token`とした。
Cloudflareへ登録するのはこの名前ではなく、GitHubが発行した`github_pat_...`の方となる。

記事を`main`へ直接コミットするので、GitHub側でPull Request必須のBranch protectionを設定している場合は注意が必要となる。

## R2を有効にしていなくてバケットを作れなかった

R2バケットを作成しようとして、最初に以下のエラーとなった。

```text
Please enable R2 through the Cloudflare Dashboard. [code: 10042]
```

実行したコマンドはこちら。

```bash
pnpm wrangler r2 bucket create muuuuminn-blog-assets
```

これはWranglerの認証や権限ではなく、CloudflareアカウントでR2 Subscriptionを有効にしていなかったことが原因だった。
DashboardからR2を有効にしたあと、同じコマンドを実行して作成できた。

作成後にWranglerから設定ファイルへbindingを追加するか聞かれた。
しかし`wrangler.jsonc`にはすでに次の設定を用意していたため、ここでは`n`を選んだ。

```json
{
  "r2_buckets": [
    {
      "binding": "CMS_ASSETS",
      "bucket_name": "muuuuminn-blog-assets"
    }
  ]
}
```

自動追加すると別名のbindingが増えて、CMSが参照している`CMS_ASSETS`と一致しなくなる可能性があった。

## 既存のAccess Applicationがあった

Cloudflare Accessを設定しようとしたところ、すでに以下のApplicationが存在していた。

```text
Name: muuuuminn-blog - Cloudflare Pages
Destination: *.muuuuminn.com
Policy: All authenticated users
```

これをそのままCMSへ流用すると、認証済みのユーザー全員を許可することになる。
また`*.muuuuminn.com`は`assets.muuuuminn.com`にも一致するため、R2の画像までログイン必須になってしまう。

既存設定は変更せず、CMS用のApplicationを別に作成した。
画像用の`assets.muuuuminn.com`には、より具体的なApplicationと`Bypass Everyone`を設定して公開状態にした。

CMSの管理画面ではBypassを使っていない。
画像は公開コンテンツなので、このホスト名だけを限定してBypassしている。

## WorkerのSecretをそのまま更新できなかった

WorkerへSecretを登録しようとしたところ、次のエラーとなった。

```text
Secret edit failed. You attempted to modify a secret,
but the latest version of your Worker isn't currently deployed.
```

Worker Versionsを使っている場合、通常の`wrangler secret put`は新しいバージョンを暗黙的にデプロイする。
Cloudflareが意図しないバージョンのデプロイを防ぐため、処理を止めていたようだった。

今回は`versions secret put`でSecretを含むバージョンを作り、最後にまとめてデプロイした。

```bash
pnpm wrangler versions secret put GITHUB_TOKEN
pnpm wrangler versions secret put ACCESS_AUD
pnpm wrangler versions secret put CMS_ASSET_BASE_URL
pnpm wrangler versions deploy
```

GitHubの`main`が最新であることと、Cloudflare上で選択しているWorker Versionがそのコミットのものかは別の話となる。
ここは少し混乱した。

## ビルドが成功しても設定が完了しているとは限らない

CloudflareのBuild variablesが空でも、ビルド自体は成功していた。

理由としては、Node.jsやpnpmはCloudflare側のデフォルトや`package.json`から解決できること、環境変数が未設定でもコード上で空文字へフォールバックしていたことが挙げられる。

しかしビルドが通ることと、生成されたURLが正しいことは別だった。
RSS、sitemap、robots、OGPなどで利用するため、以下はBuild variableへ設定した。

```text
NEXT_PUBLIC_APP_ROOT_URL=https://muuuuminn.com
```

またGitHubトークンやAccessのAUDはBuild variableではなく、Workerの実行時Secretとなる。
設定場所が2つあるので少しわかりづらい。

## GitHubから記事を取得できなかった

Accessの設定が終わり、ようやく`/admin`へアクセスできた。
しかし既存記事が1件も表示されず、「GitHubから記事を読み込めませんでした」と表示された。

トークンの権限を疑ったが、`wrangler tail`でログを確認すると原因は別だった。

```text
GitHub API request failed (403):
Request forbidden by administrative rules.
Please make sure your request has a User-Agent header
```

GitHub APIへのリクエストに`User-Agent`を付けていなかった。

```ts
const response = await fetch(`https://api.github.com${path}`, {
  headers: {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${config.token}`,
    "user-agent": "muuuuminn-blog-cms",
    "x-github-api-version": "2022-11-28",
  },
});
```

ヘッダーを追加し、ローカルの本番ビルドが通るところまで確認した。
あとはCloudflareへ再デプロイし、既存記事を取得できることを確認する。

画面には共通のエラーメッセージだけを出していたので、`wrangler tail`を使わなかったらGitHubトークンを何度も作り直していたかもしれない。

## 実装してみて気になっていること

現状でも個人用CMSとしては使えるが、いくつか気になるところは残っている。

- 下書きを保存するだけでもWorkers Buildsが動く
- Publicリポジトリでは下書きのMarkdownを読める
- 未来の公開日時を指定しても、その時刻に自動ビルドされない
- 記事で使わなかったR2画像をCMSから削除できない
- GitHubのPersonal Access Tokenには有効期限がある

予約投稿を実現するなら、指定時刻以降にCloudflareのDeploy Hookを呼ぶCronが必要になる。
R2の未使用画像をどう掃除するかも、運用してから考えたい。

## まとめ

最終的に、記事の保存先をGitHub、画像の保存先をR2とするCMSを作成できた。

記事データを新しいデータベースへ移さず、今まで使っていたMarkdownをそのまま利用できるのが良い。
GitHubの履歴が残るので、CMSを使わずに直接編集することも可能となっている。

一方で、CloudflareにはBuild variables、Worker Secrets、Bindings、Access Applications、Identity Providersと設定箇所が複数ある。
それぞれの役割を混ぜないことが大事だと思った。

あと、GitHub APIの`User-Agent`を忘れないようにしたい。

## 参考

- [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [GitHub REST API - Repository contents](https://docs.github.com/en/rest/repos/contents)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
