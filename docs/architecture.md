# アーキテクチャ

## ディレクトリと責務

| パス | 責務 |
|------|------|
| `src/folder-tree.tsx` | `FolderTree`、型、既定アイコン、ツリー描画ロジック |
| `src/folder-tree.css` | `.ft-*` スタイル。ビルド後 `dist/folder-tree.css` にコピー |
| `src/repo-folder-tree.tsx` | サンプルデータ `REPO_TREE_ROOT`、`RepoFolderTree` |
| `src/index.ts` | 公開エントリ（ここからのみ npm 利用者向け API を export） |
| `playground/` | Vite アプリ。ローカル検証・見た目確認 |
| `scripts/copy-css.mjs` | CSS を `dist/` へコピー |

## ビルド

- **Bundler**: `tsup`（`tsup.config.ts`）— JS / CJS / 型生成
- **CSS**: `copy-css.mjs` で `dist/folder-tree.css` を配置。`package.json` の `exports["./styles.css"]` がこれを指す

## 公開境界

- 利用者が import するのは **`src/index.ts` の export と `styles.css` のみ**を前提にする
- 内部モジュールを増やす場合も、index 経由でないシンボルは「非公開」とみなす

## スタイルの考え方

- クラス接頭辞は `ft-`（[feature-matrix.md](./feature-matrix.md) ST-4）
- テーマは CSS 変数で上書き。コンポーネント props で色を増やしすぎない

## 関連ドキュメント

- 機能一覧: [feature-matrix.md](./feature-matrix.md)
- スコープ外の判断: [product-scope.md](./product-scope.md)
