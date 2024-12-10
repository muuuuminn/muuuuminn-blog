---
title: '【自分用メモ】App router × Cloudflare pagesの環境においてNextAuth v5のOAuth認証が動作しなかった'
description: 'App router × Cloudflare pagesの環境においてNextAuth v5のOAuth認証が動作しなかった。自分用のメモです。'
date: '2024-12-05T06:14:01.691Z'
coverImage: '/post/akira_thumbnail.png'
ogImageUrl: '/post/akira_thumbnail.png'
category: '0'
tags: '1,39,40,41'
---

## 追記（2024年12月10日）

[Issueのコメント](https://github.com/nextauthjs/next-auth/issues/11999#issuecomment-2529107507)にて `@cloudflare/next-on-pages` のバージョンを `1.13.6` から `1.13.7` に上げたら動作したという情報があった。  
早速試したところ、動作した。  
そのため当記事で紹介した不具合に遭遇した人は、 `@cloudflare/next-on-pages` のバージョンを上げてみてほしい。

## 現状まとめ

Next.js（App router）で NextAuth v5 の Google と GitHub 認証を使用したミニマムなアプリケーションを用意した。そして 4 つの環境下で検証した。  
結果としては、 Cloudflare Pages 環境下では動作しなかった。Vercel では動作した。

- [ ] Cloudflare Pages
- [ ] ローカル環境`wrangler pages dev`
- [x] Vercel
- [x] ローカル環境`next dev`

[再現リポジトリ](https://github.com/muuuuminn/nextauthv5-clouadflare)を用意している。  
環境変数と GitHub および Google Cloud の設定は各自で実施する必要がある。

## 開発環境

Node.js version: 20.13.1

```json:package.json
"dependencies": {
  "@cloudflare/next-on-pages": "^1.13.6",
  "next": "^15.0.3",
  "next-auth": "^5.0.0-beta.25",
  "react": "latest",
  "react-dom": "latest",
  "wrangler": "^3.91.0"
},
"devDependencies": {
  "@types/node": "latest",
  "@types/react": "latest",
  "@types/react-dom": "latest",
  "typescript": "latest"
}
```

```toml:wrangler.toml
name = "nextauthv5-clouadflare"
pages_build_output_dir = ".vercel/output/static"
compatibility_date = "2024-11-29"

[env.production]
compatibility_flags = [ "nodejs_compat" ]

[env.production.vars]
AUTH_GITHUB_ID = ""
AUTH_GITHUB_SECRET = ""
AUTH_SECRET = ""
GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
NEXTAUTH_URL = ""
AUTH_TRUST_HOST = "true"
```

## エラーログ

`wrangler pages dev` で動作確認したときのエラーログを載せておく。

```bash:error_log
[wrangler:inf] Ready on http://localhost:8788
[wrangler:inf] GET / 200 OK (143ms)
[wrangler:inf] GET / 200 OK (14ms)
[wrangler:inf] GET /favicon.ico 304 Not Modified (15ms)
[wrangler:inf] POST / 303 See Other (27ms)
✘ [ERROR] TypeError: Illegal invocation: function called with incorrect `this` reference. See https://developers.cloudflare.com/workers/observability/errors/#illegal-invocation-errors for details.

      at K.waitUntil
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/__next-on-pages-dist__/functions/auth/[...nextauth].func.js:2:826)
      at Ne.handler
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/__next-on-pages-dist__/functions/auth/[...nextauth].func.js:2:23931)
      at async et
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/__next-on-pages-dist__/functions/auth/[...nextauth].func.js:2:4302)
      at async Module.<anonymous>
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/__next-on-pages-dist__/functions/auth/[...nextauth].func.js:8:3805)
      at async E
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/index.js:40:14667)
      at async ke
  (file:///Users/test/Documents/products/auth-app/.vercel/output/static/_worker.js/index.js:40:25857)
      at async jsonError
  (file:///Users/test/Documents/products/auth-app/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts:22:10)
      at async drainBody
  (file:///Users/test/Documents/products/auth-app/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts:5:10)
[wrangler:inf] GET /auth/callback/github 500 Internal Server Error (1074ms)
```

## 試したこと

- 環境変数を env ファイルではなく Cloudflare 側で設定
- `NEXTAUTH_URL`を 指定
- `signin` の `redirectTo` で `/`を指定
- provider の設定で`customFetch`を指定
- production 環境では`debug`を off にする
- nextauth の callbacks の各 function を定義

他にも試したけど、忘れてしまった。  
これらを色々な組み合わせで検証していた。

## 参考

- [NextAuth v5のドキュメント](https://authjs.dev/)
- 関連がありそうな Issue
  - https://github.com/nextauthjs/next-auth/issues/11999

## おわりに

今回の技術構成でアプリケーションを運用してそうな人が SNS でいたので、自分が何かを見落としている可能性がある。  
GitHub や Google Cloud 側の設定は、合っているはずだけどなあ…。

もし同じ現象に遭遇して解決策を知っていれば[再現リポジトリ](https://github.com/muuuuminn/nextauthv5-clouadflare)に Issue 立てたり、[お問い合わせ](https://docs.google.com/forms/d/e/1FAIpQLSeXNfr1rEd0Cf_55yIlk2mOjrC4Rs00gA5jw0POoQ7pQOPo7A/viewform)から教えてくれたら助かります。
