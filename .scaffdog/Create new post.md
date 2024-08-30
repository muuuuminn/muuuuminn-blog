---
name: "Create a new markdown file for post"
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
  category:
    message: "Please enter the category unique id."
    initial: "0"
  tags:
    message: "Please enter the tag unique id. You can tagging multiple like 1,2"
---

# {{ inputs.filename }}/index.md

```markdown
---
title: '{{ inputs.title }}'
description: '{{ inputs.description }}'
date: '{{ 'new Date().toISOString()' | eval }}'
coverImage: '{{ inputs.image }}'
ogImageUrl: '{{ inputs.image }}'
category: '{{ inputs.category }}'
tags: '{{ inputs.tags }}'
---
```
