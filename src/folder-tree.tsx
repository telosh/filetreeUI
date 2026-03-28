import {
  useCallback,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

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

/** 開閉用シェブロン（currentColor）。`aria-hidden` 付き — 親ボタンの `aria-expanded` を使う */
export function FolderTreeChevronIcon({ className, expanded }: { className?: string; expanded: boolean }) {
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
      data-expanded={expanded ? "" : undefined}
    >
      <path
        d="m9 6 6 6-6 6"
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

  /**
   * 子を持つフォルダを開閉する（既定: true）。
   * false のときは常に全展開で、開閉 UI も出しません。
   */
  collapsible?: boolean

  /**
   * 開閉の装飾 UI（シェブロン列・葉での幅合わせスペーサー）を表示する（既定: true）。
   * `collapsible` が true のときだけ有効。false のときは行全体のボタンで開閉のみ（シェブロンなし）。
   */
  showDisclosureUI?: boolean

  /**
   * 子リストの開閉を CSS でアニメーションする（既定: true）。
   * false のときは即時に表示／非表示します。`collapsible` が false のときは無視されます。
   */
  expandCollapseAnimation?: boolean

  /**
   * 初期状態で折りたたむノードのパス。
   * キーは `pathPrefix/node.name` の連結（先頭の pathPrefix は `root.name` の末尾 `/` を除いたもの）。
   * ルート行直下のリストを閉じるキーは `__ft_root__:<rootPath>`（例: `__ft_root__:playground`）。
   */
  defaultCollapsedPaths?: readonly string[]
}

function DefaultNodeIcon({ isDirectory }: { isDirectory: boolean }) {
  return isDirectory ? (
    <FolderTreeDefaultFolderIcon className="ft-icon" />
  ) : (
    <FolderTreeDefaultFileIcon className="ft-icon" />
  )
}

/** grid-template-rows の遷移で子ブロックの高さをアニメーション。閉じ完了後にアンマウント */
function CollapsiblePanel({
  open,
  animate,
  panelClassName,
  innerClassName,
  children,
}: {
  open: boolean
  animate: boolean
  panelClassName?: string
  innerClassName?: string
  children: ReactNode
}) {
  const [reduceMotion, setReduceMotion] = useState(false)
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const motionOn = animate && !reduceMotion

  const [mounted, setMounted] = useState(open)
  const [visualOpen, setVisualOpen] = useState(open)

  useLayoutEffect(() => {
    if (!motionOn) {
      setMounted(open)
      setVisualOpen(open)
      return
    }
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisualOpen(true))
      })
      return () => cancelAnimationFrame(id)
    }
    setVisualOpen(false)
  }, [open, motionOn])

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!motionOn) return
    if (e.target !== e.currentTarget) return
    if (e.propertyName !== "grid-template-rows") return
    if (!open) setMounted(false)
  }

  if (!motionOn) {
    if (!open) return null
    return <div className={innerClassName}>{children}</div>
  }

  if (!mounted) return null

  return (
    <div
      className={cx("ft-collapse", visualOpen && "ft-collapse--open", panelClassName)}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={cx("ft-collapse-inner", innerClassName)}>{children}</div>
    </div>
  )
}

function TreeRow({
  node,
  depth,
  showIcons,
  renderIcon,
  rowClassName,
  getRowClassName,
  collapsible,
  showDisclosureUI,
  hasChildren,
  expanded,
  onToggle,
}: {
  node: FolderTreeNode
  depth: number
  showIcons: boolean
  renderIcon?: (args: FolderTreeRenderIconArgs) => ReactNode
  rowClassName?: string
  getRowClassName?: (node: FolderTreeNode, depth: number) => string | undefined
  collapsible: boolean
  showDisclosureUI: boolean
  hasChildren: boolean
  expanded: boolean
  onToggle?: () => void
}) {
  const dir = isDirectory(node)
  const custom = renderIcon?.({ node, isDirectory: dir, depth })
  const icon =
    !showIcons ? null : custom !== undefined ? (
      custom
    ) : (
      <DefaultNodeIcon isDirectory={dir} />
    )

  const canToggle = collapsible && hasChildren
  const showChevron = canToggle && showDisclosureUI
  const leafSpacer = collapsible && !hasChildren && showDisclosureUI
  const rowClass = cx("ft-row", rowClassName, getRowClassName?.(node, depth), canToggle && "ft-row--branch")

  const inner = (
    <>
      {showChevron ? (
        <span className="ft-chevron-slot">
          <FolderTreeChevronIcon className="ft-chevron" expanded={expanded} />
        </span>
      ) : leafSpacer ? (
        <span className="ft-chevron-slot ft-chevron-slot--spacer" aria-hidden />
      ) : null}
      {icon}
      <span className="ft-label" translate="no">
        {node.name}
      </span>
    </>
  )

  if (canToggle && onToggle) {
    return (
      <button
        type="button"
        className={cx(rowClass, "ft-row--toggle")}
        data-depth={depth}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        {inner}
      </button>
    )
  }

  return (
    <div className={rowClass} data-depth={depth}>
      {inner}
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
  collapsible,
  showDisclosureUI,
  expandCollapseAnimation,
  collapsedPaths,
  toggleCollapsed,
}: {
  nodes: readonly FolderTreeNode[]
  pathPrefix: string
  depth: number
  showIcons: boolean
  listClassName?: string
  rowClassName?: string
  getRowClassName?: (node: FolderTreeNode, depth: number) => string | undefined
  renderIcon?: (args: FolderTreeRenderIconArgs) => ReactNode
  collapsible: boolean
  showDisclosureUI: boolean
  expandCollapseAnimation: boolean
  collapsedPaths: ReadonlySet<string>
  toggleCollapsed: (path: string) => void
}) {
  return (
    <ul className={cx("ft-list", listClassName)}>
      {nodes.map((node) => {
        const key = `${pathPrefix}/${node.name}`
        const childList = node.children
        const hasChildren = Boolean(childList && childList.length > 0)
        const expanded = !collapsible || !collapsedPaths.has(key)

        const branchInner = childList ? (
          <TreeList
            nodes={childList}
            pathPrefix={key}
            depth={depth + 1}
            showIcons={showIcons}
            listClassName={listClassName}
            rowClassName={rowClassName}
            getRowClassName={getRowClassName}
            renderIcon={renderIcon}
            collapsible={collapsible}
            showDisclosureUI={showDisclosureUI}
            expandCollapseAnimation={expandCollapseAnimation}
            collapsedPaths={collapsedPaths}
            toggleCollapsed={toggleCollapsed}
          />
        ) : null

        return (
          <li key={key} className="ft-item">
            <TreeRow
              node={node}
              depth={depth}
              showIcons={showIcons}
              renderIcon={renderIcon}
              rowClassName={rowClassName}
              getRowClassName={getRowClassName}
              collapsible={collapsible}
              showDisclosureUI={showDisclosureUI}
              hasChildren={hasChildren}
              expanded={expanded}
              onToggle={hasChildren ? () => toggleCollapsed(key) : undefined}
            />
            {hasChildren && childList ? (
              <CollapsiblePanel
                open={expanded}
                animate={collapsible && expandCollapseAnimation}
                innerClassName="ft-children ft-branch"
              >
                {branchInner}
              </CollapsiblePanel>
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
 *
 * **開閉**: `collapsible` が true（既定）のとき、子を持つフォルダ行とルート行は `button` になり `aria-expanded` が付きます。`collapsible={false}` で常時全展開です。`showDisclosureUI={false}` でシェブロンなしの行クリック開閉にできます。子リストの開閉は既定で CSS アニメーション（`expandCollapseAnimation`）します。
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
  collapsible = true,
  showDisclosureUI = true,
  expandCollapseAnimation = true,
  defaultCollapsedPaths,
}: FolderTreeProps) {
  const rootPath = root.name.replace(/\/$/, "")
  const children = root.children
  const hasChildren = Boolean(children && children.length > 0)

  const [collapsedPaths, setCollapsedPaths] = useState(() => new Set(defaultCollapsedPaths ?? []))

  const toggleCollapsed = useCallback((path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  /** ルート行に紐づく「直下の子リスト」の開閉キー（ツリー内パスと重複しないよう専用） */
  const rootChildrenCollapseKey = `__ft_root__:${rootPath}`
  const rootChildrenExpanded = !collapsible || !collapsedPaths.has(rootChildrenCollapseKey)
  const rootListVisible = !showRoot || !collapsible || rootChildrenExpanded

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

  const rootRowCollapsible = Boolean(collapsible && hasChildren && showRoot)
  const rootRowInner = (
    <>
      {rootRowCollapsible && showDisclosureUI ? (
        <span className="ft-chevron-slot">
          <FolderTreeChevronIcon className="ft-chevron" expanded={rootChildrenExpanded} />
        </span>
      ) : null}
      {rootIconEl}
      <span className="ft-root-label" translate="no">
        {renderRootLabel ? renderRootLabel(root) : root.name}
      </span>
    </>
  )

  const rootChildrenClass = cx(
    "ft-root-children",
    "ft-branch",
    showRoot && "ft-root-children--after-root",
    !showRoot && "ft-root-children--solo"
  )

  const treeList =
    hasChildren && children ? (
      <TreeList
        nodes={children}
        pathPrefix={rootPath}
        depth={0}
        showIcons={showIcons}
        listClassName={listClassName}
        rowClassName={rowClassName}
        getRowClassName={getRowClassName}
        renderIcon={renderIcon}
        collapsible={collapsible}
        showDisclosureUI={showDisclosureUI}
        expandCollapseAnimation={expandCollapseAnimation}
        collapsedPaths={collapsedPaths}
        toggleCollapsed={toggleCollapsed}
      />
    ) : null

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
        collapsible && "ft--collapsible",
        collapsible && showDisclosureUI && "ft--disclosure-ui",
        collapsible && expandCollapseAnimation && "ft--expand-animate",
        className
      )}
      style={style}
      {...a11y}
    >
      {showRoot ? (
        rootRowCollapsible ? (
          <button
            type="button"
            className="ft-root-row ft-root-row--toggle"
            aria-expanded={rootChildrenExpanded}
            onClick={() => toggleCollapsed(rootChildrenCollapseKey)}
          >
            {rootRowInner}
          </button>
        ) : (
          <div className="ft-root-row">{rootRowInner}</div>
        )
      ) : null}

      {hasChildren && children && treeList ? (
        showRoot && collapsible && expandCollapseAnimation ? (
          <CollapsiblePanel open={rootChildrenExpanded} animate innerClassName={rootChildrenClass}>
            {treeList}
          </CollapsiblePanel>
        ) : rootListVisible ? (
          <div className={rootChildrenClass}>{treeList}</div>
        ) : null
      ) : null}
    </div>
  )
}
