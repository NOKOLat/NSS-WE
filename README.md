# NSS  -NoKoLAT Scoring System-

## 概要
NSSは、航空研究会における部内大会での得点管理や競技進行をサポートするWebアプリケーションです。  
ReactとTypeScriptで構築されており、WebSocketを使ったQtとのリアルタイム通信に対応しています。

## 主な機能
- 各競技部門（一般部門・マルチコプター部門）の得点・進行管理
- タイマー、カウンター、チェックボックスによる競技状態の記録
- 競技データのJSON形式での保存・WebSocket送信
- シンプルなUIによる操作性

## セットアップ方法

1. リポジトリをクローン
git clone <このリポジトリのURL> cd NSS-WE

2. 必要なパッケージをインストール
npm install

3. ウェブに表示
npm run dev

## ディレクトリ構成例
NSS-WE/　　

├── src/  
│ ├── Pages/  
│ ├── Accordions/  
│ ├── Components/  
│ ├── Data/  
│ └── App.tsx  
├── public/  
├── package.json  
└── README.md　