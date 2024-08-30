---
name: "Create a new markdown file for post about deck review"
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
title: '【デックレビュー】{{ inputs.title }}【第1弾】'
description: 'デックレビュー第1弾！{{ inputs.description }}'
date: '{{ 'new Date().toISOString()' | eval }}'
coverImage: '{{ inputs.image }}'
ogImageUrl: '{{ inputs.image }}'
category: "2"
tags: "13"
---

### カード名

◆ 感触

◆ ケース

◆ スペードのエース

◆ 絵札

◆ JOKER

◆ バック

◆ ボーダー

◆ ひとこと
```
