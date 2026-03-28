import type { CSSProperties, ReactNode } from "react"
import { FolderTree, RepoFolderTree, type FolderTreeNode } from "react-folder-tree"

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

/** 深めのツリー（初期折りたたみ・Repo 用の見た目確認） */
const deepDemoRoot: FolderTreeNode = {
  name: "my-app/",
  children: [
    {
      name: "packages/",
      children: [
        {
          name: "ui/",
          children: [{ name: "package.json" }, { name: "src/", children: [{ name: "index.ts" }] }],
        },
        { name: "core/", children: [{ name: "src/", children: [] }] },
      ],
    },
    { name: "apps/", children: [{ name: "web/", children: [{ name: "page.tsx" }] }] },
    { name: "turbo.json" },
  ],
}

const headingStyle: CSSProperties = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#71717a",
  marginBottom: "0.5rem",
}

const groupTitleStyle: CSSProperties = {
  ...headingStyle,
  marginTop: 0,
  marginBottom: "0.25rem",
  fontSize: "0.6875rem",
  color: "#52525b",
}

const groupTitleWithRuleStyle: CSSProperties = {
  ...groupTitleStyle,
  paddingTop: "0.5rem",
  borderTop: "1px solid #e4e4e7",
}

const plainShellStyle: CSSProperties = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #e4e4e7",
}

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "1.5rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  alignItems: "start",
}

function GroupTitle({ children, showTopRule = false }: { children: ReactNode; showTopRule?: boolean }) {
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <h2 style={showTopRule ? groupTitleWithRuleStyle : groupTitleStyle}>{children}</h2>
    </div>
  )
}

function DemoSection({
  id,
  title,
  description,
  children,
  plainShell = false,
}: {
  id: string
  title: string
  description?: ReactNode
  children: ReactNode
  plainShell?: boolean
}) {
  const body = plainShell ? <div style={plainShellStyle}>{children}</div> : children
  return (
    <section aria-labelledby={id}>
      <h3 id={id} style={headingStyle}>
        {title}
      </h3>
      {description ? (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#71717a",
            marginTop: "-0.25rem",
            marginBottom: "0.5rem",
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
      ) : null}
      {body}
    </section>
  )
}

export function App() {
  const rootPath = demoRoot.name.replace(/\/$/, "")

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f4f5",
        padding: "2rem",
        paddingBottom: "3rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        FolderTree プレイグラウンド
      </h1>
      <p style={{ color: "#52525b", marginBottom: "0.75rem", maxWidth: "48rem", lineHeight: 1.55 }}>
        <code>react-folder-tree</code> の主要な props の組み合わせです。子リストの開閉は既定で CSS アニメーション（
        <code>expandCollapseAnimation</code>
        ）。シェブロン列は <code>showDisclosureUI</code> で on/off できます。OS の「視差効果を減らす」に合わせてアニメは自動で即時切り替えになります。ルートで{" "}
        <code>npm run dev</code> するか、パッケージを <code>npm run build</code> してからプレイグラウンドをビルドすると最新の{" "}
        <code>dist/</code> が反映されます。
      </p>

      <div style={gridStyle}>
        <GroupTitle>レイアウト・密度</GroupTitle>

        <DemoSection
          id="demo-framed-default"
          title="framed · default 密度 · 接続線 · 開閉"
          description="カード枠・既定行高。子フォルダ行のクリックで開閉。"
        >
          <FolderTree root={demoRoot} aria-label="framed 既定" />
        </DemoSection>

        <DemoSection
          id="demo-plain-compact-lines"
          title="plain · compact · 接続線 · 開閉"
          description="親の白いパネルに埋め込む想定。小さめの行。"
          plainShell
        >
          <FolderTree
            root={demoRoot}
            variant="plain"
            density="compact"
            showConnectorLines
            aria-label="plain コンパクト・線あり・開閉"
          />
        </DemoSection>

        <DemoSection
          id="demo-framed-compact"
          title="framed · compact · 接続線"
          description="枠付きのまま高密度。"
        >
          <FolderTree
            root={demoRoot}
            variant="framed"
            density="compact"
            aria-label="framed コンパクト"
          />
        </DemoSection>

        <DemoSection
          id="demo-plain-no-lines"
          title="plain · compact · 接続線オフ · 開閉なし"
          description={
            <>
              <code>{`collapsible={false}`}</code> で常時全展開。
            </>
          }
          plainShell
        >
          <FolderTree
            root={demoRoot}
            variant="plain"
            density="compact"
            showConnectorLines={false}
            collapsible={false}
            aria-label="開閉なし"
          />
        </DemoSection>

        <GroupTitle showTopRule>ルート行の出し方</GroupTitle>

        <DemoSection
          id="demo-no-root"
          title="showRoot false"
          description="ルートラベルを出さず、子だけ表示。ルート行の開閉はなし。"
        >
          <FolderTree root={demoRoot} showRoot={false} aria-label="ルート行なし" />
        </DemoSection>

        <DemoSection
          id="demo-hide-root-icon"
          title="hideRootIcon"
          description="ルート行は出すが、ルートのアイコンだけ非表示。"
        >
          <FolderTree
            root={demoRoot}
            hideRootIcon
            aria-label="ルートアイコンなし"
          />
        </DemoSection>

        <GroupTitle showTopRule>アイコン・開閉の初期状態</GroupTitle>

        <DemoSection
          id="demo-no-icons"
          title="showIcons false"
          description="ファイル／フォルダアイコンなし。開閉はそのまま。"
        >
          <FolderTree
            root={demoRoot}
            showIcons={false}
            aria-label="アイコン非表示"
          />
        </DemoSection>

        <DemoSection
          id="demo-collapsed-paths"
          title="defaultCollapsedPaths"
          description={
            <>
              例: <code>playground/src</code> で src を初期閉じ。ルート直下は{" "}
              <code>{`__ft_root__:${rootPath}`}</code>。
            </>
          }
        >
          <FolderTree
            root={demoRoot}
            defaultCollapsedPaths={["playground/src"]}
            aria-label="初期で src 閉じ"
          />
        </DemoSection>

        <DemoSection
          id="demo-collapsed-root"
          title="defaultCollapsedPaths（ルート直下）"
          description="マウント直後はルートの子リストだけ閉じた状態。"
        >
          <FolderTree
            root={demoRoot}
            defaultCollapsedPaths={[`__ft_root__:${rootPath}`]}
            aria-label="初期でルート直下閉じ"
          />
        </DemoSection>

        <GroupTitle showTopRule>開閉 UI・アニメーション</GroupTitle>

        <DemoSection
          id="demo-no-disclosure"
          title="showDisclosureUI false"
          description={
            <>
              シェブロンと葉のスペーサーなし。フォルダ行全体のボタンで開閉（<code>aria-expanded</code> はそのまま）。
            </>
          }
        >
          <FolderTree
            root={demoRoot}
            showDisclosureUI={false}
            aria-label="シェブロンなし開閉"
          />
        </DemoSection>

        <DemoSection
          id="demo-no-expand-animation"
          title="expandCollapseAnimation false"
          description="子リストの表示／非表示をトランジションなしで即時に切り替え。"
        >
          <FolderTree
            root={demoRoot}
            expandCollapseAnimation={false}
            aria-label="開閉アニメーションなし"
          />
        </DemoSection>

        <DemoSection
          id="demo-no-disclosure-no-animation"
          title="showDisclosureUI false · アニメーション off"
          description="ミニマルな行＋即時の開閉。"
          plainShell
        >
          <FolderTree
            root={demoRoot}
            variant="plain"
            density="compact"
            showDisclosureUI={false}
            expandCollapseAnimation={false}
            aria-label="シェブロンなし・即時開閉"
          />
        </DemoSection>

        <GroupTitle showTopRule>深いツリー・記事用データ</GroupTitle>

        <DemoSection
          id="demo-deep"
          title="深い階層（別データ）"
          description="packages / apps など多段の開閉確認用。"
        >
          <FolderTree root={deepDemoRoot} aria-label="深いデモツリー" />
        </DemoSection>

        <DemoSection
          id="demo-deep-collapsed"
          title="深い階層 + 初期折りたたみ"
          description={
            <>
              <code>my-app/packages/ui</code> と <code>my-app/apps</code> を初期閉じ。
            </>
          }
        >
          <FolderTree
            root={deepDemoRoot}
            defaultCollapsedPaths={["my-app/packages/ui", "my-app/apps"]}
            aria-label="深いツリー・一部初期閉じ"
          />
        </DemoSection>

        <DemoSection
          id="demo-repo"
          title="RepoFolderTree"
          description="記事用の固定データ。開閉・スクロールの確認向け。"
        >
          <RepoFolderTree aria-label="サンプルリポジトリ構成" />
        </DemoSection>

        <DemoSection
          id="demo-repo-compact"
          title="RepoFolderTree · plain · compact"
          description="同じデータをコンパクトに。白パネル埋め込み想定。"
          plainShell
        >
          <RepoFolderTree
            variant="plain"
            density="compact"
            aria-label="Repo コンパクト"
          />
        </DemoSection>
      </div>
    </main>
  )
}
