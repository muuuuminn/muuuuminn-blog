---
title: "モーダルやシートのヘッダーにおいてタイトルは横幅中央, ボタン等々は左端または右端に配置する"
description: "Flutterでモーダルやシートのヘッダーにおいて、タイトルを中央に、ボタンを左右に配置するレイアウトをStackウィジェットで作成する方法を軽く解説します。"
date: "2024-09-02T10:01:47.261Z"
coverImage: "/post/flutter-modal-header-design-stack-widget/1.png"
ogImageUrl: "/post/flutter-modal-header-design-stack-widget/1.png"
category: "0"
tags: "29"
---

![ヘッダーの実際の画像](/post/flutter-modal-header-design-stack-widget/1.png)

こんな感じのを作ります。
早速コードを提示します。

## コード

```Dart
class Header extends StatelessWidget {
  const Header({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.amber,
      child: Stack(
        alignment: Alignment.center, // 子ウィジェットを中央に配置
        children: [
          Row(
            children: [
              IconButton(
                onPressed: () {}, // 左端のボタン
                icon: Icon(Icons.close),
              ),
              Spacer(), // 左右のボタンの間にスペースを追加
              IconButton(
                onPressed: () {}, // 右端のボタン1
                icon: Icon(Icons.person),
              ),
              IconButton(
                onPressed: () {}, // 右端のボタン2
                icon: Icon(Icons.add),
              ),
            ],
          ),
          // StackのAlignment.centerにより中央に位置するタイトルになる
          Text('Title'),
        ],
      ),
    );
  }
}
```

[→DartPad で確認する](https://dartpad.dev/?id=85a37ef959d5d249cfc98c5290182eb0)

## 解説

- `Stack`でタイトルとボタンを同じレイヤー(`children`)に含める
- ボタン
  - 右または左端にボタンをもつ`Row`をつくる。
    - 中央を余白で埋めたいので、`Spacer`をつかう
    - 左端にボタン：`Spacer Button`、右端にボタン：`Button Spacer`、両端にボタン：`Button Spacer Button`のパターンが実現可能
- タイトル
  - `Stack`の`alignment`を`Alignment.center`に設定することで、タイトルを中央に配置する

## さいごに

この実装で残る懸念は
タイトル部分がボタンに重なってしまう可能性があることです。たとえば長いタイトルになると重なります。

[Material Design](https://m3.material.io/components/dialogs/guidelines#0cff8b6b-d4f3-4442-8194-31212f5d1a12)をみると、モーダル内のタイトルは右寄りになっているので、そもそも中央にするのは避けるべきなのかもしれません。
あるいは AppBar を使えばいいだけの話なのかもしれません。

この記事がなにかのヒントになればと思います。
