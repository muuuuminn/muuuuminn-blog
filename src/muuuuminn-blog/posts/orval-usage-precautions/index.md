---
title: "OrvalでuseInfiniteQueryを自動生成するときに、特定のAPI定義に絞り込んで自動生成したいんだ"
description: "OrvalでuseInfiniteQueryを生成する際の注意点と回避方法を解説します。特定のAPI定義に絞り込んで自動生成する方法を紹介します。"
date: "2024-09-10T11:38:13.374Z"
coverImage: "/post/akira_thumbnail.png"
ogImageUrl: "/post/akira_thumbnail.png"
category: "0"
tags: "36, 37"
---

## はじめに

OpenAPI を使っており、そしてフロントで Tanstack Query や MSW などを使う予定があるなら
コードジェネレーターとして[Orval](https://orval.dev/)は選択肢に入ると思います。
※ 最近では[Zod](https://orval.dev/guides/client-with-zod)が自動生成の対象となったようです。Valibot も選択肢に加わると喜ぶ人が多そうですね。

## useInfiniteQuery を生成する際の注意点

非常に便利なライブラリなのですが、Tanstack Query の`useInfiniteQuery`を利用したカスタムフックを自動生成する際に注意点があります。**それは余分に生成してしまうことです**。

どういうことか説明します。
「一覧取得 API」「詳細取得 API」が定義されていたとして、一覧取得 API の`useInfiniteQuery`のカスタムフックを生成したいと思います。
Orval の設定は以下のようになるでしょう。

```js:orval.config.js
module.exports = {
   petstore: {
     output: {
       ...
       override: {
         query: {
           useQuery: true,
           useInfinite: true,
           useInfiniteQueryParam: 'your-custom-query-param',
         },
       },
     },
     ...
   },
 };
```

そして自動生成してみると「一覧取得 API」「詳細取得 API」の useInfiniteQuery を利用したカスタムフックが 2 つ生成されてしまいます。
OpenAPI をしっかり定義している場合は、詳細取得 API の生成されたコード内で TS エラーがおそらく発生していることでしょう。
一覧 API の`useInfiniteQuery`だけがほしいのに詳細取得 API の分も生成されてしまうのが、今回紹介したかった注意点となります。

## 回避方法：useInfiniteQuery 用の Orval の設定を追加する

Orval の設定を useInfiniteQuery 用とそうではないもので分けます。
useInfiniteQuery 用の設定では`transformer`を使い、自動生成対象となる OpenAPI 内の API 定義を絞りこみます。
さらに生成されたファイルには`.infinite.ts`という suffix をつけています。

```js:orval.config.js
module.exports = {
  petstore: {
    output: {
      mode: "tags-split",
      target: "src/generated",
      schemas: "src/generated/model",
      client: "react-query",
      override: {
        query: {
          useQuery: true,
        },
      },
    },
    ...
  },
  petstore_infinite: {
    output: {
      mode: "tags-split",
      target: "src/generated",
      schemas: "src/generated/model",
      client: "react-query",
      override: {
        query: {
          useQuery: false, // 明示的にfalseと設定する
          useInfinite: true,
          useInfiniteQueryParam: "your-custom-query-param",
        },
      },
      fileExtension: ".infinite.ts", // 生成ファイルが上書きされてしまうので、設定している
    }
  },
  input: {
    ...
    override: {
      transformer: "src/transformer.js", // transformer.jsで生成対象の定義を絞り込んでいる
    },
  },
};
```

`transformer.js`には型定義は無さそうだったので JS ファイルとなっています。
そのためこの`transformer.js`は、ログを仕込んで動かしてみて…というのを繰り返して作成しました。
やっていることとしては api の path と method で絞り込んでいます。

```js:transformer.js
module.exports = (inputSchema) => ({
  ...inputSchema,
  paths: filterPaths(inputSchema.paths),
});

function filterPaths(paths) {
  return Object.fromEntries(
    Object.entries(paths)
      .filter(([path]) => TARGET_PATHS.includes(path))
      .map(([path, pathItem]) => [path, { [TARGET_METHOD]: pathItem[TARGET_METHOD] }]),
  );
}

const TARGET_PATHS = ["/pet", "/user"]; // ペット一覧とユーザー一覧APIを対象とする
const TARGET_METHOD = "get"; // 取得APIは大抵getだと思うので、今回はgetのみを対象とする
```

以上の設定内容で、特定の API 用の useInfiniteQuery を生成しつつ、他もいつもどおり生成するということが可能になり、余分なコードが生成されるのを防げます。

## もっと簡単な方法はあるのか

一応あります。
Orval の input のオプションで[filters](https://orval.dev/reference/configuration/input#filters)があり、その中に tags というのがあります。
この tags は OpenAPI の tags を指定する設定であり、一致する定義に filter つまり絞り込んで自動生成してくれます。

```js:Orval.config.js
module.exports = {
  petstore: {
    ...
  },
  petstore_infinite: {
    ...
    input: {
      filters: {
        tags: ["pet", "user"], // petとuserのタグがついた定義のみが対象となる
      },
    },
  },
};
```

なぜこの方法を先に紹介しなかったというと、

1. 余分に自動生成される問題が解決できない可能性がある
2. OpenAPI の tags を編集しなければならない可能性がある

からです。

まず 1 から。
`tags` で `pet` に絞り込んだとしても、`pet` の`tag` がついた詳細 API が存在するならば、自動生成の対象になります。
つまりはじめに述べた問題が発生します。

では`useInfiniteQuery`用に OpenAPI の `tags` に何かしらの tags を追加します。(2 を指します)
OpenAPI のタグに`infinite`とつけるとしましょう。これなら Orval 側で`tags: ['infinite']`とすれば絞り込めますし、1 の問題も解消できそうです。
しかしそもそもフロントのコードジェネレーター都合で OpenAPI 側を編集したくないと思っちゃいます。
プロジェクト内の同意が得られればいいのかもしれませんが、なんとなくイケてない感はありそうです。

## まとめ（めんどうなので ChatGPT に記載してもらった）

Orval を使用して `useInfiniteQuery` を自動生成する際は、不要なコードが生成される可能性があります。この問題を回避するには、`transformer` を使用して特定の API 定義に絞り込むか、OpenAPI の tags を利用する方法があります。プロジェクトの要件に応じて適切な方法を選択することが重要です。
