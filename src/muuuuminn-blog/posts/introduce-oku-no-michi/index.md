---
title: 'ちょっとしたゲーム「億の道」を作ってみた'
description: '息抜きとして開発したミニゲーム「億の道」を紹介します。開発についても軽く触れます。'
date: '2024-12-18T07:17:30.666Z'
coverImage: '/post/introduce-oku-no-michi/thumbnail.png'
ogImageUrl: '/post/introduce-oku-no-michi/thumbnail.png'
category: '3'
tags: '44,45,46,47'
---

## はじめに

https://qiita.com/advent-calendar/2024/kuso-app

[qiita.com](https://qiita.com/advent-calendar/2024/kuso-app#:~:text=28-,Series%204,-Sun)

この投稿はアドベントカレンダーの 20 日目の記事となります。

最近は Flutter で開発していたのですが、息抜きがてらに別の技術スタックでミニゲームを作ってみました。  
バックエンドの勉強が主目的です。

## ゲーム紹介

[億の道](https://number-riches.pages.dev/intro)という数字取り？ゲームを作りました。

### ゲームの流れ

1. プレイヤーは、1 から 100,000 までの数字を 1 つ選ぶ
2. 翌日、プレイヤーの選んだ数字が他のプレイヤーが選んだ数字と被っているかどうかを集計される
3. 数字が他のプレイヤーと被らなければ、プレイヤーは選んだ数字と同じ金額を獲得する

プレイヤーはこれを毎日繰り返して、累計獲得金額**億**を目指そうというゲームです。
（※実際にお金が手に入るわけではありません）

![「億の道」トップ画面の画像](/post/introduce-oku-no-michi/1.png)
_「億の道」トップ画面_

### アクセント

- プレイヤーは選んだ数字を当日に限り、何度でも変更できる
- その日にプレイヤーの選んだ数字がランダムで公開される  
  それを見たプレイヤーは、自身の数字を変えてもよし、そのままでもよし。多少の駆け引きが発生する…はず
- **統計情報**  
  - 前日の頻出数字 TOP5 が見れる
  - 歴代の頻出数字 TOP5 が見れる
  - 累計獲得金額が多いユーザー TOP5 が見れる
- ユーザー名を変更できる

## 開発あれこれ

### 技術スタック

運用費が一切かからないようにしました。

- **Next.js (App Router)** on Cloudflare Pages  
  - CSS modules  
  - （一部）Radix UI
- **Hono** on Cloudflare Workers
- **TiDB**
- **Firebase Authentication**

### 構成と運用

- **フロントとサーバーを分離**  
  ポリレポ構成になっている
- **Cron Triggers を利用した自動処理**  
  - 集計処理  
  - Cloudflare Pages にデプロイフックを使用してデプロイ
- **初回ログイン時の処理**  
  Firebase Authentication でログイン後にサーバーサイドで初期データを投入している  
  Cloud Functions でも同様のことが可能ですが、処理が分散すると管理が煩雑になるため、Workers に集約  
  初回ログイン時のデータ投入ってみなさんはどうしていますか？

### 小話

- Cron Triggers を日本時間 00:00 に実行したいので、15:00 を設定
- ローカル環境と Workers でタイムゾーンの違いがあり、ハマりまくった。ローカル環境の環境変数に TZ=UTC を設定して Workers と合わせた。野生の勘で DB も UTC にしておいた。あとから変更するってなったとき、きっと大変になる
- Canva で favicon を作った。デザインセンス皆無
- ライトモードとダークモードの切り替えは実装せず、もとからダークモード寄りの配色にした。ライトモードは眩しくて目が痛いんだ

## 懸念

- **報酬設計**  
  - 獲得したお金をゲーム内で使えるようにしたい  
  - ゲーム内で得たお金と、バフが得られるアイテムを交換する仕組みを考案中
- **通知設定がない**  
  - ゲームの存在を思い出させる仕掛けがない  
  - お金を得たかどうかを知る方法が画面上の確認に限定されている
- **規模拡大時のリスク**  
  - 万が一規模が大きくなると、集計処理で負荷が増大し、運用に支障をきたす可能性がある
- **技術の有効活用不足**  
  - Hono で OpenAPI を生成しているが、有効活用できていない。  
  - Valibot でスキーマを定義しているが、サーバーサイドでしか使用しておらず、フロントエンドで共有していない。
- **グローバル展開の未対応**  
  - 現在は日本基準で全てを運用しているが、海外プレイヤーを増やす場合は、タイムゾーン対応やサーバー選択の仕組みが必要

## おわりに

遊び方を考える時間が一番楽しかったです。  
Cloudflare 最高。  
Hono とっつきやすくていいね。  

何かしらの問い合わせがある場合は、[問い合わせフォーム](https://docs.google.com/forms/d/e/1FAIpQLScZxBtUpLG4CHjRMi-po6nwKihIdiZcwQtszZ6H__ly4gUjSA/viewform)からお願いします！
