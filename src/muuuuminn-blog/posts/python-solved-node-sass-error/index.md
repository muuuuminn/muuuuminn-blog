---
title: "node16系でnuxt2.15.0,node-sass6.0.1が入った環境にてyarn installをするとエラーになる"
description: "node16.14.0, nuxt2.15.0, node-sass6.0.1を含んだ環境でyarn installをするとエラーになる。homebrew経由でpyenvを入れpythonを使用できるようにした状態でyarn install --forceを実行して解決した。"
date: "2023-01-23T06:59:19.978Z"
coverImage: "https://user-images.githubusercontent.com/38467746/213995987-41f0473e-c76c-4127-b8be-98cbca38bcae.jpeg"
ogImageUrl: "https://user-images.githubusercontent.com/38467746/213995987-41f0473e-c76c-4127-b8be-98cbca38bcae.jpeg"
category: "0"
tags: "15,16"
---

## 背景

ある日突然フロントローカル環境において yarn install をするとエラーが出るようになってしまった 🥲

## 結論

python2 系を使える状態にして`yarn install --force`または`npm rebuild`することでエラーは解消され、無事処理が成功した。

## 詳細

### 使用端末

mac M1 Max

### フロントの環境

node の version: `16.14.0`
Nuxt: `2.15.0`
node-sass: `6.0.1`

### エラー内容

一部だけ抜粋しました。

```shell
Building: /Users/hgoe/.anyenv/envs/nodenv/versions/16.14.0/bin/node /Users/hoge/Documents/fuga/node_modules/node-gyp/bin/node-gyp.js rebuild --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
gyp info it worked if it ends with ok
gyp verb cli [
gyp verb cli   '/Users/hoge/.anyenv/envs/nodenv/versions/16.14.0/bin/node',
gyp verb cli   '/Users/hoge/Documents/fuga/node_modules/node-gyp/bin/node-gyp.js',
gyp verb cli   'rebuild',
gyp verb cli   '--verbose',
gyp verb cli   '--libsass_ext=',
gyp verb cli   '--libsass_cflags=',
gyp verb cli   '--libsass_ldflags=',
gyp verb cli   '--libsass_library='
gyp verb cli ]
gyp info using node-gyp@7.1.2
gyp info using node@16.14.0 | darwin | arm64
gyp verb command rebuild []
gyp verb command clean []
gyp verb clean removing "build" directory
gyp verb command configure []
gyp verb find Python Python is not set from command line or npm configuration
gyp verb find Python Python is not set from environment variable PYTHON
gyp verb find Python checking if "python3" can be used
gyp verb find Python - executing "python3" to get executable path
gyp verb find Python - executable path is "/Library/Developer/CommandLineTools/usr/bin/python3"
gyp verb find Python - executing "/Library/Developer/CommandLineTools/usr/bin/python3" to get version
gyp verb find Python - version is "3.9.6"
gyp info find Python using Python version 3.9.6 found at "/Library/Developer/CommandLineTools/usr/bin/python3"
gyp verb get node dir no --target version specified, falling back to host node version: 16.14.0
gyp verb command install [ '16.14.0' ]
gyp verb install input version string "16.14.0"
gyp verb install installing version: 16.14.0
gyp verb install --ensure was passed, so won't reinstall if already installed
gyp verb install version is already installed, need to check "installVersion"
gyp verb got "installVersion" 9
```

### 解決手順

1. Homebrew 経由で pyenv を導入。[^1]
2. pyenv 経由で python2, 3 を導入。[^2]
3. フロントの環境で`yarn install --force`または`npm rebuild`を実行する。[^3]

[^1]: 導入方法はネットにゴロゴロ落ちているのでスキップします。`bash_profile`または`.zshrc`にパスを記載するのを忘れないようにする。
[^2]: pyenv の使い方は詳細を省きます。
[^3]: [npm と yarn のコマンド比較表](https://chore-update--yarnpkg.netlify.app/ja/docs/migrating-from-npm#:~:text=npm%20rebuild,yarn%20install%20%2D%2Dforce)
