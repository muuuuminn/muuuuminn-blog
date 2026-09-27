# muuuuminn blog is a personal markdown blog.

## Tech stack

### Frontend

- Next.js(App Router)
- TypeScript
- Radix UI

### Backend

- Cloudflare Access（管理画面の認証）
- GitHub Contents API（Markdown記事の保存）
- Cloudflare R2（画像の保存）

### Infrastructure

- Cloudflare Workers

### Related services

- Cloudflare Registrar
- Google Search Console
- Google Tag Manager
- Google Analytics

## CMS

`/admin` に、Markdown記事の作成・編集・プレビュー・下書き保存・公開・非公開化を行う管理画面があります。記事は `src/muuuuminn-blog/posts/{slug}/index.md` としてGitHubへ保存され、mainブランチへのコミットを契機にCloudflare Workers Buildsが静的ページを再生成します。画像はCloudflare R2へ保存します。

`/admin` 自体は静的ページです。記事一覧はビルド時に生成した軽量インデックスから取得し、本文は記事を選択したときだけ認証済みAPI経由でGitHubから取得します。取得済みの本文はCloudflare Cache APIで5分間キャッシュし、保存時には最新のGitHub SHAを取り直したうえでキャッシュを削除します。GitHubトークンがブラウザへ渡ることはありません。

記事の状態はfront matterの `status` で管理します。

```yaml
status: draft # draft | published | archived
```

既存記事との互換性のため、`status`がない記事は`published`として扱います。`published`かつ公開日時を過ぎた記事だけがビルド対象になります。リポジトリが公開の場合、下書きもGitHub上では閲覧できる点に注意してください。

未来の公開日時を指定した記事は、その日時以降にもう一度ビルドが必要です。予約投稿を自動化する場合は、Cloudflare Deploy HookをCron Triggerから呼び出してください。

### 1. GitHubを設定する

対象リポジトリだけにアクセスできるfine-grained personal access tokenを作成し、Repository permissionsの`Contents: Read and write`だけを付与します。次の値をWorker secretsへ登録します。

```sh
pnpm wrangler secret put GITHUB_TOKEN
pnpm wrangler secret put GITHUB_OWNER
pnpm wrangler secret put GITHUB_REPO
pnpm wrangler secret put GITHUB_BRANCH
```

- `GITHUB_OWNER`: `muuuuminn`
- `GITHUB_REPO`: `muuuuminn-blog`
- `GITHUB_BRANCH`: 本番ビルド対象のブランチ（通常は`main`）

GitHubのリポジトリをCloudflare Workers Buildsへ接続します。mainへのpushで自動ビルド・デプロイされるように設定します。

- Build command: `pnpm opennextjs-cloudflare build`
- Deploy command: `pnpm opennextjs-cloudflare deploy`

### 2. R2を設定する

```sh
pnpm wrangler r2 bucket create muuuuminn-blog-assets
pnpm wrangler secret put CMS_ASSET_BASE_URL
```

R2バケットに`assets.muuuuminn.com`をCustom Domainとして接続し、`CMS_ASSET_BASE_URL`には`https://assets.muuuuminn.com`を設定します。CMSはJPEG、PNG、WebP、GIF、AVIFを10MBまでアップロードできます。ファイル名はUUIDになり、長期キャッシュしても上書き競合しません。

### 3. Cloudflare Accessを設定する

Cloudflare Zero Trustの「Access controls > Applications」でSelf-hosted applicationを作り、次の2パスをPublic hostnameに追加します。

- `muuuuminn.com/admin*`
- `muuuuminn.com/api/admin*`

Allowポリシーは `Include > Emails` でohmi本人のメールアドレスを1件だけ指定します。`Everyone`、メールドメイン単位、Bypassは設定しません。Accessはパス単位で保護でき、より具体的なパスのポリシーが優先されます。詳細は[Cloudflare Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)を参照してください。

次に、Access applicationのAUDとチームドメインを含む3値をWorker secretsへ登録します。

```sh
pnpm wrangler secret put ADMIN_EMAIL
pnpm wrangler secret put ACCESS_TEAM_DOMAIN
pnpm wrangler secret put ACCESS_AUD
```

- `ADMIN_EMAIL`: Accessで許可したohmi本人のメールアドレス
- `ACCESS_TEAM_DOMAIN`: `your-team.cloudflareaccess.com` 形式
- `ACCESS_AUD`: Access application overviewに表示されるApplication Audience (AUD) Tag

管理APIはAccessの通過だけに依存せず、`Cf-Access-Jwt-Assertion` の署名・issuer・audience・メールアドレスも検証します。Cloudflareも、ヘッダーの存在確認だけではなくJWT署名を検証するよう案内しています（[Application token](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/)）。

### 4. ローカルで確認する

`.dev.vars.example` を `.dev.vars` にコピーしてGitHubとR2の値を設定します。`CMS_DEV_BYPASS=true`はdevelopment時だけ有効です。

通常の`pnpm dev`ではR2はローカルエミュレーションです。実際のCustom Domainで画像まで確認するときだけ、`wrangler.jsonc`のR2 bindingへ`"remote": true`を一時的に設定してください。この場合、アップロードは本番R2バケットへ書き込まれます。

```sh
cp .dev.vars.example .dev.vars
pnpm generate
pnpm dev
```

`http://localhost:3333/admin` を開きます。本番環境では `CMS_DEV_BYPASS` を登録しないでください。
