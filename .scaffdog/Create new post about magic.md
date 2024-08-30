---
name: "Create a new markdown file for post about magic"
root: "./src/muuuuminn-blog/posts/"
output: "**/*"
ignore: []
questions:
  filename:
    message: "Please enter the markdown filename. Filename must be unique in this blog"
  title:
    message: "Please enter the title."
  description:
    message: "Please enter the description."
  image:
    message: "Please enter the image file path or url."
    initial: "/post/akira_thumbnail.png"
---

# {{ inputs.filename }}/index.md

```markdown
---
title: '【マジック修行】{{ inputs.title }}'
description: '{{ inputs.description }}'
date: '{{ 'new Date().toISOString()' | eval }}'
coverImage: '{{ inputs.image }}'
ogImageUrl: '{{ inputs.image }}'
category: "2"
tags: "4,14"
---

[ビル・グッドウィン氏が演じる Mistaken Sandwich の動画](https://www.vanishingincmagic.com/card-magic-downloads/mistaken-sandwich/)
こちらのマジックを今回は練習しました。

練習したうちの数回を動画として再生リストに残しておきました。

@[card](https://youtube.com/playlist?list=PLeb-P495b535hv2noz-pNYt5xeNOV-KoL)

## 難しい点

- aaa
  - bbb

## アレンジした点

- ccc
  - 理由
    - ddd

## さいごに

## 余談

## 参考情報
```
