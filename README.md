# react-folder-tree

リポジトリやプロジェクト構成を **読み取り専用のツリー** として見せるための React コンポーネントです。ASCII の箱罫ではなく、**左側の縦線（コネクタ）＋等幅フォントの行**で階層を表します。ブログの「ディレクトリ構成」、ドキュメントのサンプルツリー、OSS のファイル一覧プレビューなど向けです。

[![npm type: module](https://img.shields.io/badge/npm-ESM%20%2B%20CJS-blue)](https://nodejs.org/api/packages.html#dual-commonjses-module-packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 特徴

- **Tailwind 不要** — スタイルはプレーン CSS（`--ft-*` 変数でテーマ可能）
- **React 18 / 19** — `peerDependencies` のみ。他 UI ライブラリに依存しません
- **デュアルパッケージ** — ESM（`import`）と CJS（`require`）の両方、`exports` に型を分離（publint / Are The Types Wrong 準拠）
- **カスタマイズ** — アイコン差し替え、接続線のオンオフ、カード／プレーン、コンパクト密度など

## インストール

```bash
npm install react-folder-tree
```

> **パッケージ名** `react-folder-tree` が npm で既に使われていないか確認し、衝突する場合は `@scope/react-folder-tree` などに変更してください（`package.json` の `name` とこの README の記載を揃える）。

## 使い方

### 1. CSS を読み込む（必須）

アプリのエントリやレイアウトで **1 回** インポートします。

```tsx
import "react-folder-tree/styles.css"
```

### 2. コンポーネント

```tsx
import { FolderTree, type FolderTreeNode } from "react-folder-tree"

const root: FolderTreeNode = {
  name: "my-app/",
  children: [
    { name: "package.json" },
    {
      name: "src/",
      children: [{ name: "index.ts" }],
    },
  ],
}

export function Example() {
  return (
    <FolderTree
      root={root}
      aria-label="プロジェクト構成"
      variant="framed"
    />
  )
}
```

- 名前が `/` で終わる、または `children` があるノードは **ディレクトリ**（フォルダアイコン）として扱います。
- ファイル名は `translate="no"` を付与しているため、機械翻訳でパスが崩れにくくなります。

### 記事用サンプル

```tsx
import { RepoFolderTree } from "react-folder-tree"
import "react-folder-tree/styles.css"

<RepoFolderTree aria-label="リポジトリ構成" />
```

## 公開 API

| エクスポート | 説明 |
|--------------|------|
| `FolderTree` | メインコンポーネント |
| `FolderTreeNode`, `FolderTreeProps`, `FolderTreeRenderIconArgs` | 型 |
| `FolderTreeDefaultFolderIcon`, `FolderTreeDefaultFileIcon` | 既定 SVG アイコン |
| `RepoFolderTree`, `REPO_TREE_ROOT` | デモ／記事用データとラッパー |
| `RepoFolderTreeProps` | ラッパー用 props |
| `RepoTreeNode` | **非推奨** — `FolderTreeNode` と同じ。新規は `FolderTreeNode` を使用 |

サブパス `react-folder-tree/styles.css` は `package.json` の `exports` で公開されています。

## 主な props（`FolderTree`）

| prop | 型 | 既定 | 説明 |
|------|-----|------|------|
| `root` | `FolderTreeNode` | （必須） | `name` と任意の `children` |
| `variant` | `"framed" \| "plain"` | `"framed"` | カード表示か埋め込み専用か |
| `showRoot` | `boolean` | `true` | ルート行の表示 |
| `showIcons` | `boolean` | `true` | 各行のアイコン |
| `hideRootIcon` | `boolean` | `false` | ルート行だけアイコン非表示 |
| `showConnectorLines` | `boolean` | `true` | 左の縦線（オフでもインデントは維持） |
| `density` | `"default" \| "compact"` | `"default"` | 行の高さ・フォント |
| `renderIcon` | 関数 | — | 行アイコン差し替え。`null` で非表示 |
| `renderRootIcon` | 関数 | — | ルートアイコン差し替え |
| `renderRootLabel` | 関数 | — | ルートラベルのカスタム表示 |
| `listClassName` / `rowClassName` | `string` | — | リスト・行にクラス追加 |
| `getRowClassName` | `(node, depth) => string` | — | 行ごとのクラス |
| `className` / `style` / `id` / `aria-label` | — | — | ルート要素用 |

カスタムアイコンには `className="ft-icon"` を付けるとサイズが揃いやすいです。行要素には `data-depth` が付きます。

## アクセシビリティ

- **`aria-label` を推奨** — ツリー全体の目的が伝わる短いラベルを付けると、`role="region"` と組み合わせて支援技術に読み上げられます。
- **装飾アイコン** — 既定 SVG は `aria-hidden` かつ `focusable="false"` です。
- **リスト構造** — ネストはネイティブの `ul` / `li` で表現しています（行ラベルは `li` 内の行コンテナに配置）。

インタラクティブな開閉やキーボードフォーカスが必要な場合は、本パッケージは対象外です（別途 `tree` ロールとフォーカス管理の実装が必要です）。

## テーマ（CSS 変数）

`styles.css` 内の `:root` で定義。ラッパーにクラスを付けて上書きする例:

```css
.my-docs-theme {
  --ft-bg: #0a0a0a;
  --ft-text: #fafafa;
  --ft-text-muted: #737373;
  --ft-line-color: color-mix(in srgb, #737373 40%, transparent);
  --ft-border: color-mix(in srgb, #fafafa 15%, transparent);
}
```

```tsx
<FolderTree root={root} className="my-docs-theme" />
```

変数の一覧は `src/folder-tree.css` 先頭を参照してください。

## リポジトリ構成

| パス | 説明 |
|------|------|
| `src/folder-tree.tsx` | `FolderTree`・型・既定アイコン |
| `src/folder-tree.css` | スタイル（ビルドで `dist/folder-tree.css` にコピー） |
| `src/repo-folder-tree.tsx` | `REPO_TREE_ROOT` / `RepoFolderTree` |
| `src/index.ts` | パッケージエントリ |
| `playground/` | Vite による検証用アプリ（`react-folder-tree`: `file:..`） |
| `docs/` | 設計・機能整理・公開手順（[索引](./docs/README.md)） |

`npm publish` で tarball に含まれるのは **`files` フィールドの `dist/`** と、npm が自動同梱する `README` / `LICENSE` / `package.json` です。

## ドキュメント（開発者向け）

機能の整理・スコープ・将来案は [docs/README.md](./docs/README.md) から辿れます（[機能マトリクス](./docs/feature-matrix.md)、[バックログ](./docs/backlog.md) など）。

## 開発

```bash
npm install
npm run dev
```

- `npm run dev` はライブラリをビルドしてからプレイグラウンドを起動します。
- ライブラリのみビルド: `npm run build`

### 品質チェック（CI と同じ）

```bash
npm run check
```

`typecheck`（`tsc`）→ ライブラリ `build` → **publint**（`package.json` / `exports`）→ **@arethetypeswrong/cli**（`attw --pack .`、純 CSS の `./styles.css` サブパスは除外）→ プレイグラウンドの `vite build` の順です。

## バージョニング

[Semantic Versioning](https://semver.org/lang/ja/) に従います。変更内容は [CHANGELOG.md](./CHANGELOG.md) に記載します。

## コントリビューション

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## npm で公開する

[docs/PUBLISHING.md](./docs/PUBLISHING.md) にチェックリストがあります。公開前に `package.json` の `repository` / `homepage` / `bugs` を実リポジトリ URL に置き換え、`LICENSE` の Copyright を更新してください。内部ドキュメントの一覧は [docs/README.md](./docs/README.md) を参照してください。

## セキュリティ

[SECURITY.md](./SECURITY.md) を参照してください。

## ライセンス

MIT — [LICENSE](./LICENSE)
