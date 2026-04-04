---
title: "ブログに仕込んだGTMとGAが動作せず計測できなかった原因"
description: "環境変数の設定忘れ、アドブロックの有効化が原因でした。"
date: "2023-03-19T06:59:19.978Z"
coverImage: "/post/reasons-behind-non-functioning-gtm-and-ga/thumbnail.jpeg"
ogImageUrl: "/post/reasons-behind-non-functioning-gtm-and-ga/thumbnail.jpeg"
category: "0"
tags: "1,18,19,20"
---

## _導入_

Vercel にデプロイしている Next.js で構築した web サイト（当ブログ）に Google Tag Manager（GTM）と Google Analytics（GA） を仕込んだ。
しかし計測されていない模様。
GTM 上での設定は正しくできていそうなのに、一体何が原因だ…？

## _原因は 2 つありました。_

### _1.環境変数の設定忘れ_

GTM の ID を環境変数で管理して Next.js 内のコードで使用していました。このとき Vercel 側での環境変数の設定を忘れていました。初歩的ですが、意外とやりがちだと思いますので注意しましょう。

### _2.アドブロックをブラウザ内で有効にしている。_

アドブロックが原因で動作しないことがあるようです。試しにアドブロックをしていないブラウザからアクセスすると、正しく計測されました。[こちらの Issue](https://github.com/react-ga/react-ga/issues/101#issuecomment-271769368)から知ることができました。感謝。

## _おまけ_

GTM, GA を設定するうえで参考になった記事を 2 つ列挙します。

https://egashira.dev/blog/nextjs-gtm

https://zenn.dev/keitakn/articles/nextjs-google-tag-manager

## _さらにおまけ_

それと、この投稿のサムネイルの猫ちゃん可愛くないですか？
YouTube でさらに可愛い姿をみれるので要チェック 🐈

@[card](https://www.youtube.com/channel/UCy2j7KoCKRteor7NOkhuvlQ)
