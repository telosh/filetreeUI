import type { CSSProperties, ReactNode } from "react"

export type FolderTreeNode = {
  name: string
  children?: readonly FolderTreeNode[]
}

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ")
}

function isDirectory(node: FolderTreeNode): boolean {
  return node.name.endsWith("/") || (node.children !== undefined && node.children.length > 0)
}

/** 既定フォルダアイコン（currentColor） */
export function FolderTreeDefaultFolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 既定ファイルアイコン（currentColor） */
export function FolderTreeDefaultFileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v4a2 2 0 0 0 2 2h4"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type FolderTreeRenderIconArgs = {
  node: FolderTreeNode
  isDirectory: boolean
  depth: number
}

export type FolderTreeProps = {
  root: FolderTreeNode
  className?: string
  style?: CSSProperties
  id?: string
  "aria-label"?: string

  /**
   * framed: 枠・角丸・背景（既定）
   * plain: 余白・枠なし（親レイアウトに埋め込む用）
   */
  variant?: "framed" | "plain"

  /** ルート名のブロックを出す（既定: true） */
  showRoot?: boolean

  /** 各行のアイコン（既定: true） */
  showIcons?: boolean

  /** ルート行のアイコンのみ非表示。showIcons が false のときは無視 */
  hideRootIcon?: boolean

  /** 階層を示す左の縦線（既定: true） */
  showConnectorLines?: boolean

  /** 行の高さ・フォント（既定: default） */
  density?: "default" | "compact"

  /**
   * アイコンを差し替え。null を返すと該当行はアイコンなし。
   * 未指定時は既定 SVG。
   */
  renderIcon?: (args: FolderTreeRenderIconArgs) => ReactNode

  /** ルート行アイコン。null で非表示（showRoot が true かつ showIcons のとき） */
  renderRootIcon?: () => ReactNode

  /** ルートラベル。未指定時は root.name */
  renderRootLabel?: (root: FolderTreeNode) => ReactNode

  listClassName?: string
  /** すべてのツリー行に付与 */
  rowClassName?: string
  /** ノードごとに行クラスを追加 */
  getRowClassName?: (node: FolderTreeNode, depth: number) => string | undefined
}

function DefaultNodeIcon({ isDirectory }: { isDirectory: boolean }) {
  return isDirectory ? (
    <FolderTreeDefaultFolderIcon className="ft-icon" />
  ) : (
    <FolderTreeDefaultFileIcon className="ft-icon" />
  )
}

function TreeRow({
  node,
  depth,
  showIcons,
  renderIcon,
  rowClassName,
  getRowClassName,
}: {
  node: FolderTreeNode
  depth: number
  showIcons: boolean
  renderIcon?: (args: FolderTreeRenderIconArgs) => ReactNode
  rowClassName?: string
  getRowClassName?: (node: FolderTreeNode, depth: number) => string | undefined
}) {
  const dir = isDirectory(node)
  const custom = renderIcon?.({ node, isDirectory: dir, depth })
  const icon =
    !showIcons ? null : custom !== undefined ? (
      custom
    ) : (
      <DefaultNodeIcon isDirectory={dir} />
    )

  return (
    <div
      className={cx("ft-row", rowClassName, getRowClassName?.(node, depth))}
      data-depth={depth}
    >
      {icon}
      <span className="ft-label" translate="no">
        {node.name}
      </span>
    </div>
  )
}

function TreeList({
  nodes,
  pathPrefix,
  depth,
  showIcons,
  listClassName,
  rowClassName,
  getRowClassName,
  renderIcon,
}: {
  nodes: readonly FolderTreeNode[]
  pathPrefix: string
  depth: number
  showIcons: boolean
  listClassName?: string
  rowClassName?: string
  getRowClassName?: (node: FolderTreeNode, depth: number) => string | undefined
  renderIcon?: (args: FolderTreeRenderIconArgs) => ReactNode
}) {
  return (
    <ul className={cx("ft-list", listClassName)}>
      {nodes.map((node) => {
        const key = `${pathPrefix}/${node.name}`
        const childList = node.children
        const hasChildren = Boolean(childList && childList.length > 0)

        return (
          <li key={key} className="ft-item">
            <TreeRow
              node={node}
              depth={depth}
              showIcons={showIcons}
              renderIcon={renderIcon}
              rowClassName={rowClassName}
              getRowClassName={getRowClassName}
            />
            {hasChildren && childList ? (
              <div className="ft-children ft-branch">
                <TreeList
                  nodes={childList}
                  pathPrefix={key}
                  depth={depth + 1}
                  showIcons={showIcons}
                  listClassName={listClassName}
                  rowClassName={rowClassName}
                  getRowClassName={getRowClassName}
                  renderIcon={renderIcon}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * ディレクトリ／ファイルの階層を読み取り専用で表示する UI。
 *
 * **スタイル**: `react-folder-tree/styles.css`（またはビルド後の同等 CSS）をアプリで 1 回インポートしてください。クラス接頭辞は `ft-` です。
 *
 * **アクセシビリティ**: 意味のあるラベルとして `aria-label` の指定を推奨します。指定時はルート要素に `role="region"` が付きます。装飾用の既定アイコンは `aria-hidden` です。
 */
export function FolderTree({
  root,
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
  renderIcon,
  renderRootIcon,
  renderRootLabel,
  listClassName,
  rowClassName,
  getRowClassName,
}: FolderTreeProps) {
  const rootPath = root.name.replace(/\/$/, "")
  const children = root.children
  const hasChildren = Boolean(children && children.length > 0)

  const rootIconEl = (() => {
    if (!showIcons || hideRootIcon) return null
    if (renderRootIcon) {
      const r = renderRootIcon()
      if (r === null || r === undefined) return null
      return <span className="ft-icon ft-icon--root">{r}</span>
    }
    return <FolderTreeDefaultFolderIcon className="ft-icon ft-icon--root" />
  })()

  const a11y = ariaLabel ? ({ role: "region" as const, "aria-label": ariaLabel }) : {}

  return (
    <div
      id={id}
      className={cx(
        "ft",
        variant === "framed" ? "ft--framed" : "ft--plain",
        density === "compact" && "ft--compact",
        !showIcons && "ft--hide-icons",
        hideRootIcon && "ft--hide-root-icon",
        !showConnectorLines && "ft--no-lines",
        className
      )}
      style={style}
      {...a11y}
    >
      {showRoot ? (
        <div className="ft-root-row">
          {rootIconEl}
          <span className="ft-root-label" translate="no">
            {renderRootLabel ? renderRootLabel(root) : root.name}
          </span>
        </div>
      ) : null}

      {hasChildren && children ? (
        <div
          className={cx(
            "ft-root-children",
            "ft-branch",
            showRoot && "ft-root-children--after-root",
            !showRoot && "ft-root-children--solo"
          )}
        >
          <TreeList
            nodes={children}
            pathPrefix={rootPath}
            depth={0}
            showIcons={showIcons}
            listClassName={listClassName}
            rowClassName={rowClassName}
            getRowClassName={getRowClassName}
            renderIcon={renderIcon}
          />
        </div>
      ) : null}
    </div>
  )
}
