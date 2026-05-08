# 📝 レポート：Next.js × OpenNext × Cloudflare Workers でハマったこと

## ■ ゴール

* Next.js（App Router）を Cloudflare Workers で動かす
* Markdownブログ（Zenn形式）を表示
* Workers制約（fs不可）に対応

# 1. ❌ 失敗の本質

## 問題①：Workerで `fs` を使っていた

```ts
fs.readFileSync(...)
```

### 結果

* Workerではファイルが存在しない
* → 404 / 500

### 原因

Worker runtime は **バンドルされたコードしか持たない**



## 問題②：Markdownをruntimeで変換していた

```ts
import markdownToHtml from "zenn-markdown-html";
await markdownToHtml(content)
```

### 結果

```txt
No such module "shiki-xxxx"
```

### 原因

* `zenn-markdown-html` → 内部で **Shiki（外部モジュール）** を使用
* Workerでは dynamic import が解決できない



## 問題③：`dynamicParams = false` による 404

```ts
export const dynamicParams = false;
```

### 結果

```txt
NoFallbackError
```

### 原因

* OpenNext + Workers環境では fallback 解決がうまくいかないケースあり



## 問題④：Cloudflare Assets が先に404を返す

### 結果

* Workerにリクエストが届かない
* `/posts`だけ表示される

### 原因

* assets routing の優先順位



# 2. ✅ 解決戦略（重要）

## ✔ 原則

```text
Workerでは「何も計算しない」
```



# 3. 最終アーキテクチャ

## 🔥 build時に全部やる

```text
Markdown
  ↓ (build時)
HTML変換
  ↓
JSON化
  ↓
Workerに配布
```



## ✔ posts

```text
posts/**/index.md
    ↓
posts.generated.json
```



## ✔ policy / resume

```text
policy.md
resume.md
    ↓
static-pages.generated.json
```



## ✔ runtime

```ts
import postsData from "./posts.generated.json";
import staticPages from "./static-pages.generated.json";
```

👉 **fsなし / markdown変換なし**



# 4. 修正まとめ

## ① buildスクリプト作成

```bash
script/generate-posts.mjs
script/generate-static-pages.mjs
```



## ② package.json

```json
"build": "pnpm generate:contents && next build"
```

## ③ page.tsx 修正

❌ これを消す

```ts
import markdownToHtml from "zenn-markdown-html";
getMarkdownFileByFilename(...)
```

✅ こうする

```ts
const page = getStaticMarkdownPage("policy");
<RichMarkdownContent html={page.html} />
```



## ④ dynamicParams 削除

```ts
// export const dynamicParams = false;
```



## ⑤ wrangler.jsonc

```json
"assets": {
  "directory": ".open-next/assets",
  "binding": "ASSETS",
  "run_worker_first": true
}
```



# 5. デバッグで使った重要ポイント

## ✔ wrangler tail

```bash
npx wrangler tail muuuuminn-blog
```



## ✔ 判定

| 状態               | 意味                   |
| - | -- |
| 404 + x-opennext | Nextが404             |
| 500              | Worker内エラー           |
| NoFallbackError  | dynamicParams問題      |
| shiki error      | markdown runtime変換残り |



# 6. 最重要の教訓

## ❗ WorkerはNodeではない

```text
fs → 使えない
外部module → 制限あり
dynamic import → 不安定
```



## ❗ 正しい設計

```text
build時：重い処理
runtime：データ返すだけ
```



# 7. 今回の完成状態

✔ 投稿一覧 OK
✔ 投稿詳細 OK
✔ policy/resume OK
✔ Cloudflare deploy OK
✔ runtime fs なし
✔ runtime markdown変換なし



# 8. 一言まとめ

```text
「Workersでは全部事前に作れ」
```



# 必要なら

* ISR（再生成）どうするか
* CMS連携（Contentful / microCMS）
* キャッシュ戦略

ここまで一気に設計できます。
