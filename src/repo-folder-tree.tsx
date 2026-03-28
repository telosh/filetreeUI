import type { CSSProperties } from "react"
import { FolderTree, type FolderTreeNode } from "./folder-tree"

/** @deprecated 新規コードでは `FolderTreeNode` を使用してください。 */
export type RepoTreeNode = FolderTreeNode

/**
 * tech-stack 記事用。リポジトリの主要パス（設定・生成物は省略）。
 */
export const REPO_TREE_ROOT: RepoTreeNode = {
  name: "telosh.xyz/",
  children: [
    {
      name: "app/",
      children: [
        { name: "layout.tsx" },
        { name: "page.tsx" },
        { name: "globals.css" },
        { name: "actions/", children: [{ name: "contact.ts" }] },
        {
          name: "about/",
          children: [{ name: "page.tsx" }, { name: "_components/", children: [] }],
        },
        {
          name: "works/",
          children: [{ name: "page.tsx" }, { name: "_components/", children: [] }],
        },
        {
          name: "contact/",
          children: [
            { name: "page.tsx" },
            { name: "_components/", children: [] },
            { name: "_hooks/", children: [] },
            { name: "_lib/", children: [] },
          ],
        },
        {
          name: "tech-stack/",
          children: [{ name: "page.tsx" }, { name: "_components/", children: [] }],
        },
        {
          name: "admin/",
          children: [
            { name: "layout.tsx" },
            { name: "actions.ts" },
            { name: "_components/", children: [] },
            { name: "contact-inbox/", children: [] },
          ],
        },
        { name: "robots.ts" },
        { name: "sitemap.ts" },
        { name: "manifest.ts" },
      ],
    },
    {
      name: "components/",
      children: [
        { name: "header.tsx" },
        { name: "footer.tsx" },
        { name: "scroll-progress.tsx" },
        { name: "sections/", children: [{ name: "hero-section/", children: [] }] },
        { name: "mochifuwa/", children: [] },
        { name: "ui/", children: [] },
        { name: "providers/", children: [] },
      ],
    },
    {
      name: "lib/",
      children: [
        { name: "db/", children: [{ name: "index.ts" }, { name: "schema.ts" }] },
        { name: "validations/", children: [] },
        { name: "admin-auth.ts" },
        { name: "require-admin.ts" },
        { name: "rate-limit.ts" },
        { name: "logger.ts" },
        { name: "animations.ts" },
        { name: "utils.ts" },
      ],
    },
    { name: "stores/", children: [{ name: "contact-form.ts" }] },
    { name: "drizzle.config.ts" },
    { name: "public/", children: [] },
  ],
}

export type RepoFolderTreeProps = {
  className?: string
  style?: CSSProperties
  id?: string
  "aria-label"?: string
  variant?: "framed" | "plain"
  showRoot?: boolean
  showIcons?: boolean
  hideRootIcon?: boolean
  showConnectorLines?: boolean
  density?: "default" | "compact"
  collapsible?: boolean
  showDisclosureUI?: boolean
  expandCollapseAnimation?: boolean
  defaultCollapsedPaths?: readonly string[]
}

/**
 * 記事向けの既定データ付きラッパー。`react-folder-tree/styles.css` を読み込むこと。
 *
 * 任意のツリーは `<FolderTree root={...} />` を直接使用。
 */
export function RepoFolderTree({
  className,
  style,
  id,
  "aria-label": ariaLabel,
  variant = "framed",
  showRoot = true,
  showIcons = true,
  hideRootIcon = false,
  showConnectorLines = true,
  density = "default",
  collapsible,
  showDisclosureUI,
  expandCollapseAnimation,
  defaultCollapsedPaths,
}: RepoFolderTreeProps) {
  return (
    <FolderTree
      root={REPO_TREE_ROOT}
      className={className}
      style={style}
      id={id}
      aria-label={ariaLabel}
      variant={variant}
      showRoot={showRoot}
      showIcons={showIcons}
      hideRootIcon={hideRootIcon}
      showConnectorLines={showConnectorLines}
      density={density}
      collapsible={collapsible}
      showDisclosureUI={showDisclosureUI}
      expandCollapseAnimation={expandCollapseAnimation}
      defaultCollapsedPaths={defaultCollapsedPaths}
    />
  )
}
