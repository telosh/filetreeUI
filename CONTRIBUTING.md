# Contributing

## 開発環境

- Node.js 18 以上
- ルートで `npm install`

## よく使うコマンド

| コマンド | 内容 |
|----------|------|
| `npm run build` | `dist/` を生成（JS / CJS / 型 / CSS） |
| `npm run dev` | ビルド後にプレイグラウンド（Vite）を起動 |
| `npm run check` | 型チェック・ビルド・publint・attw（`./styles.css` サブパスは CSS のため検査対象から除外）・プレイグラウンドビルド |

## プルリクエスト

1. `npm run check` が通る状態にしてください。
2. 挙動や API を変える場合は `README.md` と `CHANGELOG.md`（[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) 形式）を更新してください。
3. 機能の追加・変更にあわせて [docs/feature-matrix.md](./docs/feature-matrix.md) を更新し、スコープや将来案に触れる場合は [docs/product-scope.md](./docs/product-scope.md) または [docs/backlog.md](./docs/backlog.md) も整合させてください。

## 公開権限について

npm への `publish` はメンテナのみが行います。バージョンは `npm version` で上げ、`git tag` とリリースノートを揃えることを推奨します。
