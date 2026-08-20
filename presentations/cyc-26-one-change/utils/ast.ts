/**
 * The AST engine behind every demo in this deck.
 *
 * Everything here runs in the browser, offline, on real parsers:
 *   - acorn            → JavaScript / ESM
 *   - @babel/parser     → TypeScript, via @vue/compiler-sfc's re-export
 *   - @vue/compiler-sfc → Vue single-file components
 *
 * Nothing is pre-baked. The diffs you see on stage are computed live from a
 * real parse of the source shown next to them.
 */
import { parse as acornParse } from 'acorn'
import type { Node as AcornNode } from 'acorn'
import { babelParse, parse as parseSfc } from '@vue/compiler-sfc'

export interface AstNode extends AcornNode {
  [key: string]: any
}

export interface Edit {
  start: number
  end: number
  text: string
  /** Why this edit exists — rendered in the "Edit" stage of the stepper. */
  reason: string
}

export interface Match {
  type: string
  start: number
  end: number
  excerpt: string
  reason: string
}

export interface ParseResult {
  ast: AstNode | null
  error: string | null
  /**
   * Where the comments were.
   *
   * Handed back separately because that is the only way a parser CAN hand them
   * back: a comment is not a node, so there is nowhere in the tree for one to
   * live. `<AstInspector>` uses these ranges to say so out loud when you click
   * into a comment and land on the statement that merely surrounds it.
   */
  comments: { start: number; end: number }[]
}

/** Parse as an ES module, keeping byte offsets so we can splice precisely. */
export function parseJs(code: string): ParseResult {
  const comments: { start: number; end: number }[] = []
  try {
    const ast = acornParse(code, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      locations: true,
      ranges: true,
      allowHashBang: true,
      // Comments are not part of the ESTree node graph; collect them so the
      // deck can *show* that a codemod leaves them alone.
      onComment: (_block, _text, start, end) => {
        comments.push({ start, end })
      },
    }) as unknown as AstNode
    return { ast, error: null, comments }
  } catch (error: any) {
    return { ast: null, error: error?.message ?? String(error), comments }
  }
}

/**
 * Parse as TypeScript.
 *
 * acorn does not speak TypeScript, and a routes file is TypeScript: the whole
 * subject of example one is `as RouteRecordRaw[]`, which acorn cannot represent
 * at all. Stripping the type syntax before parsing — which is what the demos
 * used to do — leaves those characters outside every node, so clicking them in
 * the source pane lands on Program and lights up the entire file.
 *
 * `@vue/compiler-sfc` already ships Babel's parser, so no new dependency: the
 * type annotation comes back as a real `TSAsExpression` with real offsets into
 * the text on screen, and the two-numbers claim holds for every character.
 *
 * Comments come back on the File node rather than through a callback.
 */
export function parseTs(code: string): ParseResult {
  try {
    const file: any = babelParse(code, {
      plugins: ['typescript'],
      sourceType: 'module',
      allowReturnOutsideFunction: true,
    })
    const comments = (file.comments ?? []).map((c: any) => ({ start: c.start, end: c.end }))
    return { ast: file.program as AstNode, error: null, comments }
  } catch (error: any) {
    return { ast: null, error: error?.message ?? String(error), comments: [] }
  }
}

const SKIP_KEYS = new Set([
  'type',
  'start',
  'end',
  'loc',
  'range',
  'sourceType',
  // Babel bookkeeping. `extra` carries a re-parsed copy of literals, and the
  // comment arrays would otherwise show up as children of whatever node they
  // happen to touch — a comment is not a node, which is the point elsewhere.
  'extra',
  'leadingComments',
  'trailingComments',
  'innerComments',
  'comments',
  'tokens',
  'errors',
])

/**
 * Depth-first walk over any ESTree-shaped tree.
 *
 * Deliberately hand-rolled rather than `acorn-walk`: the visitors in this deck
 * need the parent node, and a generic walk makes the "an AST is just nested
 * objects" point on the anatomy slide honest.
 */
export function walk(
  node: any,
  visit: (node: AstNode, parent: AstNode | null) => void,
  parent: AstNode | null = null,
): void {
  if (!node || typeof node.type !== 'string') return
  visit(node, parent)
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue
    const value = node[key]
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === 'string') walk(child, visit, node)
      }
    } else if (value && typeof value.type === 'string') {
      walk(value, visit, node)
    }
  }
}

/**
 * Apply edits back-to-front so earlier offsets stay valid.
 *
 * This is the same trick `applyChangesToString` uses in `@nx/devkit`, and the
 * same one the Vue-template migration uses when it rewrites class attributes.
 * Splicing byte ranges (instead of re-printing the tree) is what keeps a
 * codemod's diff small enough for 300 teams to actually review.
 */
export function applyEdits(source: string, edits: Edit[]): string {
  return [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce((code, edit) => code.slice(0, edit.start) + edit.text + code.slice(edit.end), source)
}

/** Collapse whitespace so a matched node fits on one line in the UI. */
export function excerpt(source: string, start: number, end: number, max = 58): string {
  const raw = source.slice(start, end).replace(/\s+/g, ' ').trim()
  return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw
}

// ---------------------------------------------------------------------------
// Tree view model (for <AstExplorer>)
// ---------------------------------------------------------------------------

export interface TreeNode {
  id: string
  type: string
  /**
   * The node's role in its parent — `callee`, `arguments[0]`, `init`, `body[2]`.
   * Two nodes can share a type and mean completely different things: in
   * `registerFeatureFlags(app)` BOTH the function and its argument are an
   * `Identifier`, and only the role tells them apart. The structural queries a
   * codemod writes are phrased in these words, so they belong on screen.
   */
  role: string
  start: number
  end: number
  /** Short scalar summary, e.g. the identifier name or literal value. */
  detail: string
  children: TreeNode[]
}

function nodeDetail(node: AstNode): string {
  if (node.type === 'Identifier') return node.name
  if (node.type === 'Literal') return JSON.stringify(node.value)
  // Babel splits ESTree's single `Literal` into one node type per kind.
  if (node.type === 'StringLiteral') return JSON.stringify(node.value)
  if (node.type === 'NumericLiteral' || node.type === 'BooleanLiteral') return String(node.value)
  // The reason this parser is here at all: name the type the audience clicked.
  if (node.type === 'TSTypeReference') return node.typeName?.name ?? ''
  if (node.type === 'TemplateElement') return JSON.stringify(node.value?.raw ?? '')
  if (node.type === 'ImportDeclaration') return JSON.stringify(node.source?.value)
  return ''
}

export function toTree(node: any, id = '0', role = ''): TreeNode | null {
  if (!node || typeof node.type !== 'string') return null
  const children: TreeNode[] = []
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue
    const value = node[key]
    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const built = toTree(child, `${id}.${key}${index}`, `${key}[${index}]`)
        if (built) children.push(built)
      })
    } else if (value && typeof value.type === 'string') {
      const built = toTree(value, `${id}.${key}`, key)
      if (built) children.push(built)
    }
  }
  return {
    id,
    type: node.type,
    role,
    start: node.start,
    end: node.end,
    detail: nodeDetail(node),
    children,
  }
}

export function countNodes(node: any): number {
  let total = 0
  walk(node, () => {
    total += 1
  })
  return total
}

/** Nodes in a built tree. Equal to what `<AstInspector>` actually renders, so
 *  the count on screen is a count of the rows on screen and not a second
 *  opinion about them. */
export function countTree(node: TreeNode | null): number {
  if (!node) return 0
  return node.children.reduce((total, child) => total + countTree(child), 1)
}

/**
 * Empty lines in a file.
 *
 * Lives here rather than next to the print strategies because it is a fact
 * about the *text*, and the point it exists to make is that no tree in this
 * file has a node for any of them.
 *
 * A single trailing newline is dropped first: it is the terminator of the last
 * line, not a blank line after it. `astring` always emits one, and counting it
 * would show a re-print as having "one blank line left" when it has none.
 */
export function countBlankLines(code: string): number {
  return code
    .replace(/\n$/, '')
    .split('\n')
    .filter((line) => line.trim() === '').length
}

// ---------------------------------------------------------------------------
// Vue template trees
//
// Same TreeNode shape as `toTree`, so one renderer draws both languages. The
// offsets `@vue/compiler-sfc` reports are relative to the whole file, which is
// what makes them spliceable into the original source — and what makes the
// source pane's highlight land in the right place without any adjustment.
// ---------------------------------------------------------------------------

/** Vue's `NodeTypes`, spelled out rather than imported as an enum. */
const V_ROOT = 0
const V_ELEMENT = 1
const V_TEXT = 2
const V_COMMENT = 3
const V_EXPRESSION = 4
const V_INTERPOLATION = 5
const V_ATTRIBUTE = 6
const V_DIRECTIVE = 7

export interface TemplateParseResult {
  /** The template block's root node, or null when there is nothing to show. */
  ast: any | null
  error: string | null
}

/**
 * Parse a single-file component and hand back its TEMPLATE root.
 *
 * Deliberately not the `<script>`: example two is about markup, and the whole
 * argument there is that an element node owns its attribute list.
 */
export function parseVueTemplate(code: string): TemplateParseResult {
  let descriptor: any
  let errors: any[] = []
  try {
    const parsed = parseSfc(code)
    descriptor = parsed.descriptor
    errors = parsed.errors ?? []
  } catch (error: any) {
    return { ast: null, error: error?.message ?? String(error) }
  }
  if (errors.length > 0) {
    return { ast: null, error: errors[0]?.message ?? 'the component could not be parsed' }
  }
  if (!descriptor?.template?.ast) {
    return { ast: null, error: 'no <template> block in this single-file component' }
  }
  return { ast: descriptor.template.ast, error: null }
}

/** Byte range of a Vue node, or null when the parser did not give it one. */
function locRange(node: any): { start: number; end: number } | null {
  const start = node?.loc?.start?.offset
  const end = node?.loc?.end?.offset
  if (typeof start !== 'number' || typeof end !== 'number' || end <= start) return null
  return { start, end }
}

/** `class` for a static attribute, `:class` / `v-if` for a directive. */
function propName(prop: any): string {
  if (prop.type === V_ATTRIBUTE) return prop.name
  if (prop.rawName) return prop.rawName
  if (prop.arg?.content) return `${prop.name === 'bind' ? ':' : `v-${prop.name}:`}${prop.arg.content}`
  return `v-${prop.name}`
}

/** One line of raw source, whitespace collapsed, for a row that must not wrap. */
function rawDetail(node: any, max = 44): string {
  const raw = String(node?.loc?.source ?? '').replace(/\s+/g, ' ').trim()
  return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw
}

function templateDetail(node: any): string {
  switch (node.type) {
    case V_ELEMENT: {
      // The tag AND its attribute names, because "does this have class h1" is
      // a lookup on this list — not a substring search over the file.
      const names = (node.props ?? []).map(propName)
      return `<${[node.tag, ...names].join(' ')}>`
    }
    case V_TEXT:
    case V_COMMENT:
    case V_ATTRIBUTE:
    case V_DIRECTIVE:
    case V_INTERPOLATION:
    case V_EXPRESSION:
      return rawDetail(node)
    default:
      return ''
  }
}

const TEMPLATE_TYPE_NAMES: Record<number, string> = {
  [V_ROOT]: 'Template',
  [V_ELEMENT]: 'Element',
  [V_TEXT]: 'Text',
  [V_COMMENT]: 'Comment',
  [V_EXPRESSION]: 'Expression',
  [V_INTERPOLATION]: 'Interpolation',
  [V_ATTRIBUTE]: 'Attribute',
  [V_DIRECTIVE]: 'Directive',
}

/**
 * A Vue template AST as the same `TreeNode` shape `toTree` produces.
 *
 * An element's props come first and its children second, so the tree reads the
 * way the markup does: the element owns its attributes, and each attribute is a
 * node with its own two numbers.
 */
export function toTemplateTree(node: any, id = '0', role = ''): TreeNode | null {
  if (!node || typeof node.type !== 'number') return null

  const children: TreeNode[] = []

  for (const [index, prop] of (node.props ?? []).entries()) {
    const built = toTemplateTree(prop, `${id}.p${index}`, `props[${index}]`)
    if (built) children.push(built)
  }
  // A directive's expression is a node in its own right: `:class="tone"` owns
  // the range of `tone`, which is the range a codemod would rewrite.
  if (node.type === V_DIRECTIVE && node.exp && locRange(node.exp)) {
    const built = toTemplateTree(node.exp, `${id}.exp`, 'exp')
    if (built) children.push(built)
  }
  // An attribute's value, likewise: the quoted text has its own offsets.
  if (node.type === V_ATTRIBUTE && node.value && locRange(node.value)) {
    const built = toTemplateTree(node.value, `${id}.value`, 'value')
    if (built) children.push(built)
  }
  if (node.type === V_INTERPOLATION && node.content && locRange(node.content)) {
    const built = toTemplateTree(node.content, `${id}.content`, 'content')
    if (built) children.push(built)
  }
  for (const [index, child] of (node.children ?? []).entries()) {
    if (!child || typeof child !== 'object') continue
    const built = toTemplateTree(child, `${id}.c${index}`, `children[${index}]`)
    if (built) children.push(built)
  }

  // The root node reports `0–0`; give it the span of what it actually holds so
  // clicking it highlights the template rather than the first byte of the file.
  const own = locRange(node)
  const start = own
    ? own.start
    : children.length > 0
      ? Math.min(...children.map((child) => child.start))
      : 0
  const end = own
    ? own.end
    : children.length > 0
      ? Math.max(...children.map((child) => child.end))
      : 0

  return {
    id,
    type: TEMPLATE_TYPE_NAMES[node.type] ?? `Node ${node.type}`,
    role,
    start,
    end,
    detail: templateDetail(node),
    children,
  }
}
