---
title: "next/font/googleでDotGothic16を読み込んでMantineのコンポーネントに適用する"
description: "next/font/googleでDotGothic16を読み込んで、Mantineのテーマ設定でfont-familyをinheritにした"
date: "2023-05-27T06:59:19.978Z"
coverImage: "/post/next-font-with-mantine/thumbnail.jpeg"
ogImageUrl: "/post/next-font-with-mantine/thumbnail.jpeg"
category: "0"
tags: "1,24,25"
---

## _結論_

next/font/google で DotGothic16 を読み込んで、
Mantine のテーマ設定で font-family を inherit にすることで
全ての Mantine コンポーネントに DotGothic16 を適用させました。
ただしこれが正解のやり方なのかは、確証を持てていないです。

## _詳細_

まず`next/font/google`から`DotGothic16`を読み込んで、適用させたい範囲のコンポーネントに`className`を指定します。
下のコードは`BaseLayout`コンポーネント内の children に`DotGothic16`を適用させたい！という例です。

```tsx
// 色々省略してます。
import { DotGothic16 } from "next/font/google";

import { SimpleGrid } from "@mantine/core";

const font = DotGothic16({ weight: "400", subsets: ["latin"] });

export const BaseLayout = (props) => {
  return <SimpleGrid className={font.className}>{props.children}</SimpleGrid>;
};
```

最後に Mantine テーマ内で`fontFamily`に`inherit`を指定して、完了です。
全ての Mantine コンポーネントで`fontFamily`が設定されているのを確認できるでしょう。

```tsx
import { MantineProvider } from "@mantine/core";

function Demo() {
  return (
    <MantineProvider
      theme={{
        fontFamily: "inherit",
      }}
    >
      <Button>ボタン</Button>
    </MantineProvider>
  );
}
```

## _参考_

https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts

https://mantine.dev/theming/typography/#load-custom-fonts
