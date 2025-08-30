# Hiroshima Bombing Map

本プロジェクトは、1945年に広島市に投下された原子爆弾による被害範囲を視覚的に表現することを目的とした、Webベースの地図アプリケーションです。  
地図上に爆心地を中心とした同心円を描画し、爆風や熱線の影響範囲を示します。

## 概要

以下の情報を地図上に表示します：

- 爆風範囲（半径2km）：建物の全焼・倒壊が想定される領域
- 熱線範囲（半径3km）：火傷や建物の自然発火が想定される領域
- 被爆後の空中写真（1945-50）
- 被爆前の空中写真：任意で表示の切り替えが可能
- 広島市公表の被爆建物一覧をマッピング表示

各範囲は GeoJSON 形式で生成し、MapLibre GL JS 上にベクトルレイヤーとして描画されます。

## デモ
[GitHub Pagesで公開中](https://hirofumikanda.github.io/hiroshima-bombing-map/)

## 技術構成

| 技術        | 用途                            |
|-------------|---------------------------------|
| React       | UI構築・状態管理               |
| TypeScript  | 型安全な開発                    |
| MapLibre GL JS | 地図描画・スタイル定義       |
| Turf.js     | 爆心地からの円形GeoJSON生成     |
| Vite        | 開発・ビルドツール              |

## 機能

- 爆風・熱線の影響範囲の同心円表示
- 円上にラベル（範囲種別・距離・被害内容）を配置
- 被爆前空中写真レイヤーの表示・非表示切り替え（チェックボックスによる制御）
- 被爆建物の詳細情報のポップアップ表示、広島市HPへのリンク掲載

## ディレクトリ構成

```

src/
├── components/
│   └── MapView/                # 地図表示およびUI構成
├── utils/
│   ├── map/
│   │   ├── useMap.ts           # 地図の初期化処理
│   │   ├── blastCircles.ts     # 円形GeoJSON生成ロジック
│   │   ├── layers.ts           # レイヤー追加・表示切り替え
│   │   └── types.ts            # 型定義
│   └── popup/
│       └── setupPopupHandler.ts # ポップアップ制御

````

## セットアップ手順

以下のコマンドでローカル環境にて起動できます。

```bash
git clone https://github.com/hirofumikanda/hiroshima-bombing-map.git
cd hiroshima-bombing-map
npm install
npm run dev
````

ブラウザで `http://localhost:5173` にアクセスすることでアプリケーションを確認できます。

## 使用データ・出典

* 空中写真(1945-50年)レイヤー：[国土地理院地理院タイル](https://maps.gsi.go.jp/development/ichiran.html#ort_USA10)、[被爆前空中写真](https://www.gsi.go.jp/chugoku/use-19450725.html)
* 爆風・熱線範囲：Turf.js により生成した円形ポリゴン
* 被爆建物一覧：[広島市被爆建物リスト一覧](https://www.city.hiroshima.lg.jp/atomicbomb-peace/fukko/1021101/1026920/1026921/1003420.html)

## 注意事項

本プロジェクトは、歴史的事実をもとにした教育的・平和啓発的な目的で作成しました。
被害状況の範囲や影響については[厚労省HPにおける見解](https://www.mhlw.go.jp/bunya/kenkou/genbaku09/15e.html)に基づいた一般的な推定に基づいており、正確な被害状況を保証するものではありません。

## ライセンス

MIT License
本リポジトリのコードは自由に利用・改変可能ですが、データソースに含まれる外部素材には各ライセンスの順守をお願いいたします。

