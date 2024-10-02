---
title: "Next.js / Chakra UIを使ってMarkdownで管理するブログを作成した話"
description: "Next.js / Chakra UIを使ってMarkdownで管理するブログを作成してみた感想とこれから実装したい機能を書きました。"
date: "2022-12-04T08:57:04.913Z"
coverImage: "/post/about-muuuuminn-blog/thumbnail.jpeg"
ogImageUrl: "/post/about-muuuuminn-blog/thumbnail.jpeg"
category: "0"
tags: "0,1,6"
---

## **作成した理由**

- Chakra UI をしっかり使ってみたい
- 自分でレイアウトを考えながら実装してみたい。
- 実験場いわゆる Sandbox として色々試せる場が欲しい。

## **感想**

- 個人ブログや企業ブログ、medium などの投稿型のサイトを中心にみてまわり、手書きでワイヤーを書いて実装にあたった。この情報集めの時間とレイアウトを考える時間が楽しい。
- Chakra UI の Layout に分類される Box コンポーネントなどは非常に使いやすかった。
- Chakra の Theme をカスタマイズするのは難しい。厳密に言うとメンテナンスを考慮できた作りにするのが大変。デザインシステムの知識が必要だと思う。
- コンポーネントごとにスタイルを変更できるのも思ったようにいかなくて、手間取る。Button と IconButton が設定を共有してるのを知らず、数時間詰まった…。
- Chakra UI の Link / LinkOverlay / Next.js の Link をうまいこと噛み合わせるには、工夫が必要。

https://zenn.dev/micronn/articles/de136645d18f7d

- favicon でダークモードに対応させるの地味に面倒。

https://coliss.com/articles/build-websites/operation/work/how-to-favicon.html

- 仮想リストを使いこなすのは難しい。ちなみに今回は [react-window](https://github.com/bvaughn/react-window) を使ってみた。

  - 仮想リスト内でスクロール位置を保存しておくのは、大変だった。

  なぜ

  - Next config 内で scrollRestoration を true は window のスクロール位置を復元してくれる。仮想リストライブラリはリストをラップする要素を描画して、この要素でスクロールを可能にしていることが大半、つまり window のスクロールではないということ。そのため scrollRestoration と仮想リストではスクロール位置は復元できない。

  対応策

  - 仮想リストライブラリの API のうち、描画されている要素の index を取得できる API がおそらく用意されている。これを使って index を取得し recoil-sync-next で保持しておく。スクロールを復元するときは保持された index を使って scroll 位置を計算し initialScrollOffset 的な props に渡せばよい。

  ```ts
  const initialScrollOffset = useMemo(() => {
    // 投稿カードコンポーネントの高さは固定にしている
    return virtualStartIndexState * POST_CARD_HEIGHT;
  }, [virtualStartIndexState]);
  ```

  課題

  - スクロール位置取得に使っている API は onItemsRendered というもので、実行頻度が高い。この処理内で recoil の state を更新して initialScrollOffset を計算する関数が再計算されるので再描画が走る。結果として投稿カード内のコンポーネントが高い頻度でちらつく。

@[card](https://tmegos.hatenablog.jp/entry/react-virtualized-list-libraries)

- [Scaffdog](https://scaff.dog/) はとても便利
  - Markdown でテンプレートファイルを作成できるため、とっつきやすい。
- フォルダ構造にいつも悩まされる。[bulletproof-react](https://github.com/alan2207/bulletproof-react)を大いに参考にした。
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) を導入したがチェックする頻度は少なかった。
- タグを表示している箇所は [Intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) を使用している。読みづらいコードになってしまっている。

## **これから実装したい機能**

- タグによる投稿の絞り込み
  - UI としては表示しており、クリックすると遷移もする。ただ機能は後回しにしてしまったので、優先度高めで対応する。
- Markdown 内のスタイル
  - ダークモード時のリンクが特にみづらい。
- ナビゲーションの PC レイアウト
  - みだりにハンバーガーメニューを使用したくないので。
- リンク、投稿カードの Hover 時のスタイル
  - 無いとクリックできるのかわからんよね。
- お問合せページ
  - Google form でサクッと作成する。
- 404 ページ
  - カスタマイズしてトップページ、問い合わせ、SNS へのリンクを置いて、404 ページに来ちゃったユーザーを迷子にさせないようにしたい。
- カテゴリ表示コンポーネントの改良
  - Chakra UI の [Badge コンポーネント](https://chakra-ui.com/docs/components/badge)を使用している。なんだか味気ないので [Dribble](https://dribbble.com/) を回遊して良い感じの UI をみつけたい。
- 関連する投稿を表示
  - 一つの投稿から少しでも他の投稿への興味を持たせたい。
- 目次を表示
  - パッと見で投稿内容を掴めるような体験をとどけたい。
- 要約を表示
  - 同上

出来立てホヤホヤのブログなので、訪問してくれるユーザーはそんなにいないはず。ユーザーが少ないなかで下記機能は効果を発揮しづらいのでは？と考え優先度低めにしている。

- SNS 共有
- タグ一覧ページ
- カテゴリ一覧ページ
- 投稿へのいいね
- [Algolia](https://www.algolia.com/) による投稿への検索
- カテゴリとタグ両方による投稿の絞り込み
- 個人開発した成果物一覧ページ
- 自分の SNS ヘのリンク
- 欲しいものリスト公開
- プロフィール
- パンくずリスト
  - 階層が深くなる予定がないのもあって、優先度低め。
- PWA 対応

## **最後に**

ブログ作成は、ToDo 管理アプリを作成するのと同じくらい勉強になるのでは？と感じる。CRUD のうち Read が大半を占めるので、そこは意識しておきたいところではあるが。

## **余談**

[Mantine UI](https://mantine.dev/) に興味を持った。
最近話題の [ChatGPT](https://chat.openai.com/chat) を相談相手になにかしらの web アプリを作ってみたいとも思っている。
