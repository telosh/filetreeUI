# npm 公開のためのチェックリスト

`package.json` の `name`（既定: `react-folder-tree`）を、npm で未使用の名前（または [スコープ](https://docs.npmjs.com/about-organization-packages-and-scope) 付き `@your-org/react-folder-tree`）にしてください。

## 公開前

1. **メタデータ**  
   `repository.url`（`git+https://...` 形式）、`homepage`、`bugs.url` を実リポジトリに合わせる。

2. **ライセンス**  
   `LICENSE` の Copyright 行を更新する。

3. **バージョン**  
   [セマンティックバージョニング](https://semver.org/lang/ja/)に従い、`CHANGELOG.md` を更新したうえで `npm version patch|minor|major` など。

4. **ビルド**  
   `npm run build` で `dist/` に `index.js` / `index.cjs` / `index.d.ts` / `index.d.cts` / `folder-tree.css` があることを確認する。

5. **自動チェック**  
   ```bash
   npm run check
   ```  
   型チェック、publint（`exports` と `files`）、[Are The Types Wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io)（`attw --pack .`）、プレイグラウンドビルドが通ること。

6. ** tarball 確認**  
   ```bash
   npm pack --dry-run
   ```  
   `dist` のみ＋ npm 既定ファイル以外が混ざっていないか目視する。

7. **ローカル検証（任意）**  
   `npm pack` した `.tgz` を別プロジェクトで `npm install ./react-folder-tree-0.1.0.tgz` し、`import "react-folder-tree/styles.css"` と `import { FolderTree } from "react-folder-tree"` を試す。

## 公開

1. [npm アカウント](https://www.npmjs.com/signup)と `npm login`。
2. 2FA を有効にする（推奨）。
3. ルートで実行:
   ```bash
   npm publish --access public
   ```
   スコープ付きパッケージで初回のみ `--access public` が必要な場合があります。

## 公開後

- GitHub Releases と `CHANGELOG.md` の内容を揃えると追いやすいです。
- 問題報告用に `bugs.url` が有効であることを確認してください。
