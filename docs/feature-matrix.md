# 機能マトリクス

実装の単一参照用です。利用者向けのコード例はルート [README.md](../README.md) を優先してください。

凡例: ✅ 実装済み · ➖ 意図的に未対応（[product-scope.md](./product-scope.md) 参照） · 🔲 検討中（[backlog.md](./backlog.md)）

## データモデル

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| DM-1 | ツリー構造 `name` + 任意 `children` | ✅ | `FolderTreeNode`（`src/folder-tree.tsx`） |
| DM-2 | ディレクトリ判定（末尾 `/` または子あり） | ✅ | `isDirectory()` 同上 |
| DM-3 | フラットパスからのビルドユーティリティ | 🔲 | backlog |

## 表示・レイアウト

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| LV-1 | `variant`: `framed` / `plain` | ✅ | `FolderTree` |
| LV-2 | `density`: `default` / `compact` | ✅ | CSS: `ft--compact` |
| LV-3 | ルート行の表示切替 `showRoot` | ✅ | |
| LV-4 | 接続線の表示切替 `showConnectorLines` | ✅ | `ft--no-lines` |
| LV-5 | 行に `data-depth` | ✅ | `TreeRow` |

## アイコン・ラベル

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| IC-1 | 既定フォルダ／ファイル SVG | ✅ | `FolderTreeDefaultFolderIcon` / `FolderTreeDefaultFileIcon` |
| IC-2 | `showIcons` / `hideRootIcon` | ✅ | |
| IC-3 | `renderIcon` / `renderRootIcon` / `renderRootLabel` | ✅ | |
| IC-4 | ファイル名 `translate="no"` | ✅ | 機械翻訳でのパス崩れ抑制 |

## スタイリング拡張

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| ST-1 | ルートに `className` / `style` | ✅ | |
| ST-2 | リスト・行クラス `listClassName` / `rowClassName` | ✅ | |
| ST-3 | 行ごと `getRowClassName(node, depth)` | ✅ | |
| ST-4 | テーマ用 CSS 変数 `--ft-*` | ✅ | `src/folder-tree.css` 先頭 |

## アクセシビリティ

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| A11Y-1 | 任意 `aria-label` 時に `role="region"` | ✅ | |
| A11Y-2 | 装飾アイコン `aria-hidden` | ✅ | 既定 SVG |
| A11Y-3 | ネイティブ `ul` / `li` のネスト | ✅ | |
| A11Y-4 | キーボード操作可能な Tree パターン | ➖ | README に明記。backlog で別検討可 |

## 付属データ・ラッパー

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| WR-1 | 記事用サンプル `REPO_TREE_ROOT` | ✅ | `src/repo-folder-tree.tsx` |
| WR-2 | 上記を表示する `RepoFolderTree` | ✅ | `FolderTree` の薄いラッパー |
| WR-3 | 非推奨型エイリアス `RepoTreeNode` | ✅ | `FolderTreeNode` へ移行推奨 |

## パッケージング

| ID | 機能 | 状態 | 実装・メモ |
|----|------|------|------------|
| PKG-1 | ESM + CJS + 型（デュアル） | ✅ | `tsup` / `package.json` exports |
| PKG-2 | `react-folder-tree/styles.css` サブパス | ✅ | |
| PKG-3 | `sideEffects: false` | ✅ | |

---

更新ルール: 新規 props や挙動を追加したら、該当行を追加または ✅ にし、README の表と矛盾がないか確認する。
