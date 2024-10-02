---
title: "OGPをX(Twitter)で表示させるときは画像を相対パスではなく絶対パスにしよう"
description: "OGPをX(Twitter)で表示させるときは画像を絶対パスにすると表示できます"
date: "2024-09-18T05:34:21.613Z"
coverImage: "/post/akira_thumbnail.png"
ogImageUrl: "/post/akira_thumbnail.png"
category: "0"
tags: "38"
---

弊ブログは OGP を設けています。しかし X に投稿したとき画像が表示されていませんでした。
結論としては X においては相対パスだと表示されない、**絶対パスだと表示される**ようになります。

Slack や Facebook 上では相対パスであっても問題なく表示できていたため、原因の特定に時間がかかりました。
X で OGP が表示できているサイトと弊ブログの meta タグを比較して、og:image の content の内容の違いを発見して解決に至りました。

ちなみに弊ブログでは
`<meta property="og:image" content="" />`を使用しており
`<meta name="twitter:image" content="" />`は使用していません。
また X で OGP が表示されなくなったら、このあたりを疑ってみようと思います。
