import { FolderTree, RepoFolderTree, type FolderTreeNode } from "folder-tree-ui"

const demoRoot: FolderTreeNode = {
  name: "playground/",
  children: [
    { name: "README.md" },
    {
      name: "src/",
      children: [
        { name: "main.tsx" },
        { name: "App.tsx" },
        { name: "styles/", children: [] },
      ],
    },
    { name: "package.json" },
  ],
}

export function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f4f5",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
        FolderTree プレイグラウンド
      </h1>
      <p style={{ color: "#52525b", marginBottom: "1.5rem", maxWidth: "40rem" }}>
        各カードは異なる props の例です。ルートの <code>folder-tree-ui</code> を編集したあと、
        <code>npm run build</code> で <code>dist/</code> を更新すると反映されます（またはルートで{" "}
        <code>npm run dev</code> がビルド込み）。
      </p>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          alignItems: "start",
        }}
      >
        <section aria-labelledby="demo-framed-heading">
          <h2
            id="demo-framed-heading"
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#71717a",
              marginBottom: "0.5rem",
            }}
          >
            framed / 既定
          </h2>
          <FolderTree root={demoRoot} aria-label="デモツリー（カード表示）" />
        </section>

        <section aria-labelledby="demo-plain-heading">
          <h2
            id="demo-plain-heading"
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#71717a",
              marginBottom: "0.5rem",
            }}
          >
            plain · compact · 線なし
          </h2>
          <div
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
            }}
          >
            <FolderTree
              root={demoRoot}
              variant="plain"
              density="compact"
              showConnectorLines={false}
              aria-label="プレーン・コンパクト・接続線なし"
            />
          </div>
        </section>

        <section aria-labelledby="demo-no-icons-heading">
          <h2
            id="demo-no-icons-heading"
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#71717a",
              marginBottom: "0.5rem",
            }}
          >
            アイコンオフ
          </h2>
          <FolderTree
            root={demoRoot}
            showIcons={false}
            showRoot
            aria-label="アイコン非表示のツリー"
          />
        </section>

        <section aria-labelledby="demo-repo-heading">
          <h2
            id="demo-repo-heading"
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#71717a",
              marginBottom: "0.5rem",
            }}
          >
            RepoFolderTree（記事用データ）
          </h2>
          <RepoFolderTree aria-label="サンプルリポジトリ構成" />
        </section>
      </div>
    </main>
  )
}
