---
title: "IconButtonの余白をなくして隣接要素にぴったりくっつける方法"
description: "FlutterのIconButtonの余白を最小限にし、隣接要素と密着させる技術を解説します。"
date: "2024-08-29T14:34:01.945Z"
coverImage: "/post/akira_thumbnail.png"
ogImageUrl: "/post/akira_thumbnail.png"
category: "0"
tags: "29"
---

## はじめに

Flutter の IconButton はデフォルトでは余白があり、他の要素とぴったり隣接させるのが難しいです。
この記事では、IconButton の余白を最小限にする方法を紹介します。

## 解決方法

以下のコードで IconButton の余白を最小限にできます。

```dart
IconButton(
  style: const ButtonStyle(
    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
  ),
  padding: EdgeInsets.zero,
  constraints: const BoxConstraints(),
  icon: const Icon(Icons.add),
  onPressed: () {},
),
```

### コードの説明

1. `tapTargetSize`を`MaterialTapTargetSize.shrinkWrap`に設定してタップ領域を最小化
2. `padding`: `EdgeInsets.zero`で`padding`をゼロに設定
3. `constraints`: 空の`BoxConstraints()`を設定し、ボタンのサイズ制約を解除

## 動作確認

このコードの動作を確認するには、以下の DartPad リンクを使用してください。

[DartPad で確認する](https://dartpad.dev/?id=a4f73a9368f99c6f140da2d529d2514e&theme=dark)

🚨 ③ のパターンでは、DartPad とエミュレーターで結果が変わりました。
原因は掴めていないです。
![エミュレーターでの結果の画像](/post/icon-button-with-minmum-padding/1.png)
_エミュレーターでの結果_

## まとめ

IconButton の余白を最小限にして、隣接する要素とするなりなんなりできるようになりました。
ただしタップ領域が小さくなるため、ユーザビリティと相談しながら使いましょう。

## 参考資料

- [IconButton の padding を取り除く方法（Flutter 逆引き辞典）](https://zenn.dev/pressedkonbu/books/flutter-reverse-lookup-dictionary/viewer/008-remove-padding-from-icon-button)
- [ボタンの余白をなくす方法（monlog tech）](https://monlog.jp/tech/supless-button-margin/)
- [Flutter の constraints について理解する（週刊 Flutter 大学）](https://blog.flutteruniv.com/flutter-understanding-constraints/)
