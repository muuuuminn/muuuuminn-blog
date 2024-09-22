---
title: "App RunnerでNext.jsをデプロイするときの構築コマンドと開始コマンドの注意点"
description: "構築コマンドでinstall、開始コマンドでbuildとstartするとエラーになったのであった。"
date: "2023-05-07T06:59:19.978Z"
coverImage: "/post/app-runner-build-and-start/thumbnail.jpeg"
ogImageUrl: "/post/app-runner-build-and-start/thumbnail.jpeg"
category: "0"
tags: "1,22,23"
---

## _結論_

それぞれのコマンドを下記のように設定したら、問題なくデプロイできた。

構築コマンド

```bash
npm install && npm run build
```

（`npm run build` は `next build` を指す）

開始コマンド

```bash
npm run start
```

（`npm run start` は `next start` を指す）

## _失敗までの経緯_

### App Runner の設定値

#### ソースおよびデプロイの設定

- ソースコードリポジトリを利用。
  - 既存のリポジトリを指定しており、SSR、API Routes や様々なライブラリを含んでいる。
- デプロイトリガー：手動

#### 構築設定（今回は、ここの設定が原因っぽい）

- ランタイム：Node.js 16
- 構築コマンド：`npm install`
- 開始コマンド：`npm run build` && `npm run start`
- ポート：3000

#### サービス設定

- サービス名：任意の名前
- 仮想 CPU とメモリ：1 vCPU & 2 GB
- 環境変数：いくつか設定している。

その他の設定項目は、特段変わったものはないので省略。

### なんでなん？

色々な記事やチュートリアルの通りに設定して試したが、失敗続きでした。
しかし create-next-app だけしたシンプルな構成をターゲットにしてデプロイしたら、これは成功しました。
数時間悩んだ末、構築コマンドで install と build をし、開始コマンドでは start だけするようにしてみた。すると不思議なことにデプロイは成功した。
リポジトリの規模が大きめであるなら、構築コマンド内で install と build するといいのかもしれない。
結局根本原因は掴めていない…。
