# `md-to-pdf` で `Could not find Chrome` が出たときの原因と対応

## 起きたこと

`md-to-pdf` を使って Markdown から PDF を生成しようとした。

```json
{
  "scripts": {
    "generate:resume-pdf": "md-to-pdf src/app/resume/resume-for-pdf.md --config-file src/app/resume/pdf-config.js"
  },
  "dependencies": {
    "md-to-pdf": "5.2.5"
  }
}
```

実行すると、次のエラーが出た。

```text
Could not find Chrome (ver. 146.0.7680.153).

This can occur if either
1. you did not perform an installation before running the script
2. your cache path is incorrectly configured
```

## 原因

`md-to-pdf` は、単体で PDF を生成しているわけではない。

内部的にはおおまかに次の流れで動く。

```text
Markdown
  ↓
HTML
  ↓
Puppeteer
  ↓
Headless Chrome
  ↓
PDF
```

つまり、`md-to-pdf` は PDF 出力時に **Puppeteer 経由で Chrome を起動する**。

今回のエラーは、`md-to-pdf` の設定ミスや Markdown の文法ミスではなく、**Puppeteer が使う Chrome 実行ファイルを見つけられなかった**ことが原因。

特に重要なのはこの部分。

```text
Could not find Chrome
```

これは、PDF変換処理そのものに到達する前に、ブラウザ起動で失敗しているという意味。

## なぜ Chrome が必要なのか

PDF生成は、単なるテキスト変換ではない。

HTML/CSS を解釈して、実際のページとしてレンダリングし、その結果を PDF として出力する必要がある。

そのため、`md-to-pdf` は Chrome の印刷機能に近い仕組みを使う。

CSS の余白、フォント、改ページ、背景色、リンク、見出しなどは、Chrome が HTML を描画した結果として PDF に反映される。

## 解決策は大きく2つある

### 方法1: Puppeteer 用の Chrome をインストールする

Puppeteer が管理する Chrome を入れる方法。

```bash
pnpm exec puppeteer browsers install chrome
```

その後、再実行する。

```bash
pnpm run generate:resume-pdf
```

これは再現性が高い方法。

CI や別PCでも同じように動かしやすい。

### 方法2: macOS に既に入っている Chrome を使う

ローカルの Google Chrome を直接使う方法。

`src/app/resume/pdf-config.js` に `launch_options.executablePath` を追加する。

```js
module.exports = {
  launch_options: {
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
};
```

既存の設定がある場合は、消さずに追加する。

```js
module.exports = {
  stylesheet: ["src/app/resume/pdf.css"],

  pdf_options: {
    format: "A4",
    printBackground: true,
    margin: {
      top: "16mm",
      right: "14mm",
      bottom: "16mm",
      left: "14mm",
    },
  },

  launch_options: {
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
};
```

実行コマンドは変えなくてよい。

```bash
pnpm run generate:resume-pdf
```

## 今回選ぶならどちらか

今回の用途が、

```text
自分のMacで履歴書PDFを生成する
```

だけなら、**macOS の既存 Chrome を使う方法で十分**。

つまり、変更するのは基本的に `pdf-config.js` だけでよい。

ただし、これはローカル環境依存になる。

たとえば次の環境では壊れる可能性がある。

```text
- GitHub Actions
- Cloudflare のビルド環境
- 別のPC
- Google Chrome が入っていないMac
- Chrome のインストール先が違う環境
```

## 確認コマンド

Chrome の実体があるか確認する。

```bash
ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

存在すれば、この設定で動く可能性が高い。

## 今回の結論

今回のエラーは、`md-to-pdf` の使い方自体の問題ではない。

本質はこれ。

```text
md-to-pdf は Puppeteer / Chrome に依存している。
Puppeteer が Chrome を見つけられないと PDF は生成できない。
```

ローカル専用なら、`pdf-config.js` にこれを追加すればよい。

```js
module.exports = {
  launch_options: {
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  },
};
```

## 覚えておくべき判断基準

```text
ローカルで自分だけが使う
→ 既存 Chrome の executablePath 指定でよい

CI や他の環境でも同じように動かしたい
→ pnpm exec puppeteer browsers install chrome の方がよい
```

## 一言でまとめる

`md-to-pdf` は Markdown 変換ツールに見えるが、実際には **ChromeでHTMLをレンダリングしてPDF化するツール**。
そのため、Chrome が見つからないと PDF 生成は始まらない。
