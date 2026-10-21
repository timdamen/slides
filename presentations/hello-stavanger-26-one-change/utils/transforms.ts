/**
 * The pure-function core behind every demo in this deck.
 *
 * No Vue runtime, no reactivity, no DOM, no clocks, no randomness. Every
 * function here is deterministic: the same input always produces the same
 * output, which is what makes it safe to run live on a stage.
 *
 * Three families, one argument each:
 *
 *   FIND   — a hand-rolled line scanner vs. a parser, on the same router file.
 *            The scanner does not fail loudly. It fails *plausibly*.
 *   REACH  — a regex vs. a real template AST, on adversarial .vue components.
 *            The verdicts are computed by an independent verifier, not authored.
 *   PRINT  — the same correct edit, printed back to disk three ways.
 *            Only one of them keeps the file a human wrote.
 *
 * Parsers used, all offline: `acorn` for JavaScript, `@vue/compiler-sfc` for
 * single-file components, `astring` for the re-print comparison.
 */
import { parse as parseSfc } from '@vue/compiler-sfc'
import { generate } from 'astring'
import { applyEdits, countBlankLines, excerpt, parseJs, walk } from './ast'
import type { AstNode, Edit, Match } from './ast'
import { changedLineCount, diffLines } from './diff'

/* Blank lines are a fact about the text rather than about a transform, so the
   counter lives in ./ast next to the trees it is the counter-example to. It is
   re-exported here because that is where this deck's components already import
   it from. */
export { countBlankLines }

/**
 * The shape every transform returns.
 *
 * `matches`/`edits`/`nodeCount` let the stepper show the whole pipeline
 * (parse → visit → edit → print) rather than just a diff.
 *
 * `ok` and `note` are the tool's *own verdict on itself*. For the AST
 * transforms that verdict is trustworthy. For the hand-rolled line counter it
 * deliberately is not — the whole point of Family 1 is that a tool can report
 * success while having done half the job.
 */
export interface TransformResult {
  code: string
  matches: Match[]
  edits: Edit[]
  /** Set when the source could not be parsed. A codemod that cannot parse
   *  must fail loudly rather than write a best guess to 300 repositories. */
  error: string | null
  nodeCount: number
  /** What the tool believes about its own run. Not independently verified. */
  ok: boolean
  /** What the tool believes it did, in its own words. */
  note: string
}

function failed(error: string, source: string, note?: string): TransformResult {
  return {
    code: source,
    matches: [],
    edits: [],
    error,
    nodeCount: 0,
    ok: false,
    note: note ?? error,
  }
}

/** Byte offset of the first character of every line. */
function lineOffsets(lines: string[]): number[] {
  const starts: number[] = []
  let at = 0
  for (const line of lines) {
    starts.push(at)
    at += line.length + 1
  }
  return starts
}

/** The line a byte offset falls on, as text. Used by the narrow TS pre-pass. */
function lineTextAt(source: string, offset: number): string {
  const start = source.lastIndexOf('\n', offset - 1) + 1
  const end = source.indexOf('\n', offset)
  return source.slice(start, end === -1 ? source.length : end)
}

/** Turn a set of rewritten lines back into byte-range edits, for the UI. */
function editsFromLines(before: string[], after: string[], starts: number[], reason: string): Edit[] {
  const edits: Edit[] = []
  for (let i = 0; i < before.length; i += 1) {
    if (before[i] === after[i]) continue
    edits.push({ start: starts[i], end: starts[i] + before[i].length, text: after[i], reason })
  }
  return edits
}

// ===========================================================================
// FAMILY 1 — FIND
//
// The change: a routes array needs its type assertion turned into a type
// annotation on the declaration.
//
//   const routes = [ … ] as RouteRecordRaw[]     →     const routes: RouteRecordRaw[] = [ … ]
//
// Two implementations over the same four files. One counts brackets. One
// parses.
// ===========================================================================

export const ROUTES_CLEAN = `import type { RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('../views/ArchiveView.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
  },
] as RouteRecordRaw[]

export default routes`

/**
 * Hazard 1 — a `]` inside a string literal.
 * To a human this is a page title. To a bracket tally it is the end of the array.
 */
export const ROUTES_BRACKET_IN_STRING = `import type { RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/archive',
    name: 'archive',
    meta: { title: 'Archive ] old' },
    component: () => import('../views/ArchiveView.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
  },
] as RouteRecordRaw[]

export default routes`

/**
 * Hazard 2 — a `]` inside a `//` comment.
 * Same failure, and this one was written by a colleague being helpful.
 */
export const ROUTES_BRACKET_IN_COMMENT = `import type { RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  // order matters: /archive ] has to resolve before the catch-all below
  {
    path: '/archive',
    name: 'archive',
    component: () => import('../views/ArchiveView.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
  },
] as RouteRecordRaw[]

export default routes`

/**
 * Hazard 3 — the array is not in this file at all.
 * The declaration probe misses, and the tool congratulates itself.
 */
export const ROUTES_IMPORTED = `import type { RouteRecordRaw } from 'vue-router'
import routes from './routes.generated'

// The archive team generates this table at build time. It still needs the
// same annotation change as the forty-two hand-written tables.
export default routes as RouteRecordRaw[]`

export interface RoutesFixture {
  key: string
  label: string
  source: string
}

export const ROUTES_FIXTURES: RoutesFixture[] = [
  { key: 'clean', label: 'The file the codemod was written against', source: ROUTES_CLEAN },
  { key: 'string', label: 'A "]" inside a string literal', source: ROUTES_BRACKET_IN_STRING },
  { key: 'comment', label: 'A "]" inside a // comment', source: ROUTES_BRACKET_IN_COMMENT },
  { key: 'imported', label: 'The array lives in another file', source: ROUTES_IMPORTED },
]

/** The only thing the shipped tool knew about JavaScript. */
const DECL_PROBE = /(const|let|var)\s+routes\s*=/
/** `<anything> as SomeType[]` at the end of a line. */
const ASSERTION_LINE = /^(.*?)\s+as\s+([A-Za-z_$][\w$.]*(?:\s*\[\s*\])*)\s*(;?)\s*$/

/**
 * (a) The shipped hand-rolled approach, reproduced faithfully.
 *
 * It reads the file as lines of text. It finds the declaration with a regex,
 * tallies `[` and `]` characters to work out where the array closes, strips the
 * trailing `as X[]` assertion, and inserts `: X[]` after the declared name.
 *
 * It is roughly forty lines of code, it passed review, and it ran across the
 * estate. The failure it has is not that it crashes. The failure is that the
 * strip pass and the annotate pass are independent: the strip runs on whatever
 * line carries the assertion, while the annotate only fires if the bracket
 * tally agrees that the array closed on that same line. When a `]` hides in a
 * string or a comment, the tally closes early, the two passes disagree, and the
 * tool removes the assertion without adding the annotation.
 *
 * The result still parses. It still looks like a routes file. `routes` is now
 * inferred instead of annotated, and nothing anywhere says so.
 */
export function routesLineCounter(source: string): TransformResult {
  const lines = source.split('\n')
  const starts = lineOffsets(lines)

  const declLine = lines.findIndex((line) => DECL_PROBE.test(line))
  if (declLine === -1) {
    // Hazard 3. The probe knows one shape of declaration and this file has a
    // different one, so the tool decides there is nothing here and moves on.
    return {
      code: source,
      matches: [],
      edits: [],
      error: null,
      nodeCount: 0,
      ok: true,
      note: 'no `const routes = [ … ]` in this file — nothing to migrate.',
    }
  }

  // --- the bracket tally --------------------------------------------------
  let depth = 0
  let opened = false
  let closeLine = -1
  let closeCol = -1
  for (let i = declLine; i < lines.length && closeLine === -1; i += 1) {
    const line = lines[i]
    for (let c = 0; c < line.length; c += 1) {
      const ch = line[c]
      if (ch === '[') {
        depth += 1
        opened = true
      } else if (ch === ']') {
        depth -= 1
        if (opened && depth === 0) {
          closeLine = i
          closeCol = c
          break
        }
      }
    }
  }

  if (!opened) {
    return {
      code: source,
      matches: [],
      edits: [],
      error: null,
      nodeCount: 0,
      ok: false,
      note: 'found the declaration but no `[` after it.',
    }
  }

  const out = [...lines]

  // --- pass 1: strip the assertion ---------------------------------------
  // Runs from the declaration to the end of the file, independently of where
  // the tally thinks the array closed. This is the half that always fires.
  let assertionLine = -1
  let assertedType = ''
  for (let i = declLine; i < out.length; i += 1) {
    const match = out[i].match(ASSERTION_LINE)
    if (!match) continue
    assertionLine = i
    assertedType = match[2].replace(/\s+/g, '')
    out[i] = `${match[1]}${match[3]}`
    break
  }

  // --- pass 2: annotate the declaration ----------------------------------
  // Only fires when the tally agrees. This is the half that goes missing.
  let annotated = false
  if (assertionLine !== -1 && assertionLine === closeLine) {
    out[declLine] = out[declLine].replace(
      /((?:const|let|var)\s+routes)(\s*)=/,
      `$1: ${assertedType}$2=`,
    )
    annotated = true
  }

  const matches: Match[] = [
    {
      type: 'text match',
      start: starts[declLine],
      end: starts[declLine] + lines[declLine].length,
      excerpt: lines[declLine].trim(),
      reason: 'matched /(const|let|var)\\s+routes\\s*=/',
    },
    {
      type: 'bracket tally',
      start: starts[closeLine] + closeCol,
      end: starts[closeLine] + closeCol + 1,
      excerpt: lines[closeLine].trim(),
      reason: `the "]" that brought the tally back to zero (line ${closeLine + 1})`,
    },
  ]

  // What the tool believes. It never checks that both halves ran, so in the
  // hazard cases it reports a success it did not have.
  const note = annotated
    ? `moved "as ${assertedType}" onto the declaration; array closed on line ${closeLine + 1}.`
    : assertionLine !== -1
      ? `removed the "as ${assertedType}" assertion; array closed on line ${closeLine + 1}.`
      : 'no type assertion found; `routes` is already annotated.'

  return {
    code: out.join('\n'),
    matches,
    edits: editsFromLines(lines, out, starts, 'line rewritten by the scanner'),
    error: null,
    // Zero. Nothing was ever parsed. That is the entire story.
    nodeCount: 0,
    ok: true,
    note,
  }
}

// ---------------------------------------------------------------------------
// The narrow TypeScript pre-pass
// ---------------------------------------------------------------------------

type RemovalKind = 'assertion' | 'importType'

interface Removal {
  kind: RemovalKind
  originalStart: number
  originalEnd: number
  text: string
  /** The type named by an assertion, e.g. `RouteRecordRaw[]`. */
  type: string
  /** Where this removal's cut point lands in the stripped string. */
  strippedStart: number
}

const IMPORT_TYPE = /^([ \t]*import)([ \t]+type)(?=[ \t])/gm
const AS_ASSERTION =
  /([\]})\w"'`])([ \t]+as[ \t]+(?:const\b|[A-Za-z_$][\w$.]*(?:[ \t]*\[[ \t]*\])*))/g

/**
 * acorn parses JavaScript. It cannot parse `as RouteRecordRaw[]`, and it cannot
 * parse `import type`. Rather than reach for a TypeScript parser we do not have
 * offline, we cut those two constructs out *before* parsing and record exactly
 * where each cut was.
 *
 * Be honest about what this is: it is a text-level step, and it is the one part
 * of `routesAst` that is not structural. That is why it is kept as narrow as it
 * can be — two anchored patterns, nothing else — and why every offset it removes
 * is written down.
 *
 * It is also a real technique, not a shortcut for a slide. Stripping a syntax a
 * parser does not speak, doing the structural work on what remains, and then
 * splicing the result back into the untouched original is how you get a
 * single-language parser to operate safely on a superset. The important part is
 * the last step: the edits are applied to the ORIGINAL string, so the assertion
 * text, the `import type`, the comments and the formatting all survive.
 */
function stripTypeSyntax(source: string): { code: string; removals: Removal[] } {
  const raw: Omit<Removal, 'strippedStart'>[] = []

  for (const match of source.matchAll(IMPORT_TYPE)) {
    const start = (match.index ?? 0) + match[1].length
    raw.push({
      kind: 'importType',
      originalStart: start,
      originalEnd: start + match[2].length,
      text: match[2],
      type: '',
    })
  }

  for (const match of source.matchAll(AS_ASSERTION)) {
    const start = (match.index ?? 0) + match[1].length
    const line = lineTextAt(source, start)
    // `import { a as b } from '…'` and `export { a as b } from '…'` are
    // renames, not assertions. Leave them for acorn, which understands them.
    if (/^\s*(?:import|export)\b/.test(line) && /\bfrom\b/.test(line)) continue
    raw.push({
      kind: 'assertion',
      originalStart: start,
      originalEnd: start + match[2].length,
      text: match[2],
      type: match[2].replace(/^[ \t]+as[ \t]+/, '').replace(/\s+/g, ''),
    })
  }

  raw.sort((a, b) => a.originalStart - b.originalStart)

  const removals: Removal[] = []
  let code = ''
  let cursor = 0
  let delta = 0
  for (const item of raw) {
    if (item.originalStart < cursor) continue // overlapping match; keep the first
    code += source.slice(cursor, item.originalStart)
    removals.push({ ...item, strippedStart: item.originalStart - delta })
    delta += item.originalEnd - item.originalStart
    cursor = item.originalEnd
  }
  code += source.slice(cursor)

  return { code, removals }
}

/**
 * Map an offset in the stripped string back to the original string.
 *
 * The comparison is strict (`<`, not `<=`) on purpose: an offset that lands
 * exactly on a cut point belongs *before* the removed text. That is precisely
 * the case for the end of the routes array, which sits on the `]` immediately
 * followed by ` as RouteRecordRaw[]`.
 */
function mapBack(offset: number, removals: Removal[]): number {
  let delta = 0
  for (const removal of removals) {
    if (removal.strippedStart < offset) delta += removal.originalEnd - removal.originalStart
    else break
  }
  return offset + delta
}

/**
 * (b) The same change, with a parser.
 *
 * The array's start and end come from `init.start` / `init.end` on a real
 * `ArrayExpression`. There is no counting, so there is nothing for a `]` in a
 * string or a comment to confuse. The edits are spliced into the original
 * string; the file is never regenerated.
 *
 * And when it cannot find the declaration, it says so and stops. Refusing is
 * the feature. A tool that can refuse can be trusted with three hundred
 * repositories; a tool that always reports success cannot.
 */
export function routesAst(source: string): TransformResult {
  const { code: stripped, removals } = stripTypeSyntax(source)
  const { ast, error } = parseJs(stripped)
  if (!ast) return failed(error ?? 'parse error', source)

  let declarator: AstNode | null = null
  let nodeCount = 0

  walk(ast, (node: AstNode) => {
    nodeCount += 1
    if (declarator) return
    if (
      node.type === 'VariableDeclarator' &&
      node.id?.type === 'Identifier' &&
      node.id.name === 'routes' &&
      node.init?.type === 'ArrayExpression'
    ) {
      declarator = node
    }
  })

  if (!declarator) {
    return {
      code: source,
      matches: [],
      edits: [],
      error: null,
      nodeCount,
      ok: false,
      note: 'could not locate the routes declaration; refusing to guess',
    }
  }

  const found = declarator as AstNode
  const idEnd = mapBack(found.id.end, removals)
  const arrayStart = mapBack(found.init.start, removals)
  const arrayEnd = mapBack(found.init.end, removals)

  // The assertion we removed, if it was attached to this array. "Attached"
  // means: nothing but whitespace between the `]` and the `as`.
  const assertion = removals.find(
    (removal) =>
      removal.kind === 'assertion' &&
      removal.originalStart >= arrayEnd &&
      source.slice(arrayEnd, removal.originalStart).trim() === '',
  )

  const matches: Match[] = [
    {
      type: 'VariableDeclarator',
      start: found.start,
      end: found.end,
      excerpt: excerpt(source, arrayStart, Math.min(arrayStart + 40, source.length)),
      reason: `id.name === "routes", init is an ArrayExpression (bytes ${arrayStart}–${arrayEnd})`,
    },
  ]

  if (!assertion) {
    return {
      code: source,
      matches,
      edits: [],
      error: null,
      nodeCount,
      ok: true,
      note: '`routes` carries no type assertion — nothing to move.',
    }
  }

  const edits: Edit[] = [
    {
      start: idEnd,
      end: idEnd,
      text: `: ${assertion.type}`,
      reason: `annotate the declared name (byte ${idEnd})`,
    },
    {
      start: assertion.originalStart,
      end: assertion.originalEnd,
      text: '',
      reason: `drop the trailing assertion (bytes ${assertion.originalStart}–${assertion.originalEnd})`,
    },
  ]

  return {
    code: applyEdits(source, edits),
    matches,
    edits,
    error: null,
    nodeCount,
    ok: true,
    note: `array bounds ${arrayStart}–${arrayEnd} came from the parse, not a tally; moved "as ${assertion.type}" onto the declaration.`,
  }
}

// ===========================================================================
// FAMILY 2 — REACH
//
// The change: every h1–h4, p and label in a template must carry its own tag
// name as a class.
// ===========================================================================

export const TARGET_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'label'])
export const TARGET_TAG_LIST = [...TARGET_TAGS]

/** Vue's AST node types, spelled out rather than imported as an enum. */
const NODE_ELEMENT = 1
const NODE_COMMENT = 3
const ATTR_STATIC = 6
const ATTR_DIRECTIVE = 7

/**
 * Token equality, not substring containment.
 *
 * `'my-h1'.includes('h1')` is true. `hasExactClass('my-h1', 'h1')` is false,
 * which is the answer the change actually needs.
 */
export function hasExactClass(classList: string, className: string): boolean {
  return classList.split(/\s+/).includes(className)
}

/**
 * Adds the tag name as a class to typographic elements, so a design-system
 * change lands in every repository without anyone opening a `.vue` file.
 *
 * Notice what it cannot touch, for free, because it is walking a template AST
 * and not the file: markup inside HTML comments, selectors in `<style>`, and
 * the word `<p>` in a `<script>` comment.
 */
export function vueTagClasses(source: string): TransformResult {
  let descriptor
  try {
    descriptor = parseSfc(source).descriptor
  } catch (error: any) {
    return failed(error?.message ?? 'SFC parse error', source)
  }

  if (!descriptor.template) {
    return failed('no <template> block in this single-file component', source)
  }

  const template = descriptor.template
  const matches: Match[] = []
  const edits: Edit[] = []
  let nodeCount = 0

  // `@vue/compiler-sfc` reports template offsets relative to the whole file,
  // so these ranges can be spliced straight into the original source.
  const visit = (node: any) => {
    nodeCount += 1
    if (node.type === NODE_ELEMENT && TARGET_TAGS.has(node.tag)) {
      const classAttr = node.props?.find((prop: any) => prop.type === ATTR_STATIC && prop.name === 'class')

      if (classAttr?.value && !hasExactClass(classAttr.value.content, node.tag)) {
        const start = classAttr.loc.start.offset
        const end = classAttr.loc.end.offset
        matches.push({
          type: `<${node.tag}> with class`,
          start,
          end,
          excerpt: `class="${classAttr.value.content}"`,
          reason: `static class attribute missing the "${node.tag}" token`,
        })
        edits.push({
          start,
          end,
          text: `class="${classAttr.value.content} ${node.tag}"`,
          reason: `append "${node.tag}" to the existing class list`,
        })
      } else if (!classAttr) {
        // Insert just before the tag's closing `>`.
        const open = node.loc.start.offset
        const close = source.indexOf('>', open)
        if (open !== -1 && close !== -1) {
          matches.push({
            type: `<${node.tag}>`,
            start: open,
            end: close + 1,
            excerpt: excerpt(source, open, close + 1),
            reason: 'element has no static class attribute',
          })
          edits.push({
            start: close,
            end: close,
            text: ` class="${node.tag}"`,
            reason: `add class="${node.tag}"`,
          })
        }
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }

  ;(template.ast?.children ?? []).forEach(visit)

  return {
    code: applyEdits(source, edits),
    matches,
    edits,
    error: null,
    nodeCount,
    ok: true,
    note: `${edits.length} element${edits.length === 1 ? '' : 's'} rewritten from the template AST.`,
  }
}

/** The regex version. It cannot tell a template from a comment or a stylesheet. */
export function vueTagClassesRegex(source: string): string {
  return source.replace(/<(h1|h2|h3|h4|p|label)>/g, (_match, tag) => `<${tag} class="${tag}">`)
}

// ---------------------------------------------------------------------------
// Adversarial fixtures
// ---------------------------------------------------------------------------

/**
 * A different element carries `class="my-h1"`, and the heading itself carries a
 * class whose text *contains* `h1` without containing the token `h1`. Any
 * implementation that reaches for `includes('h1')` decides the work is already
 * done and skips the file.
 */
export const VUE_SUBSTRING = `<template>
  <div class="my-h1">
    <h1 class="my-h1">Quarterly report</h1>
    <p class="lede">Everything shipped between April and June.</p>
  </div>
</template>`

/** A `<p>` whose attributes are spread over four lines. */
export const VUE_MULTILINE = `<template>
  <section>
    <p
      class="lede"
      data-testid="intro"
      :title="tooltip"
    >
      Orders are settled nightly.
    </p>
  </section>
</template>`

/** An element with a bound class and no static class attribute at all. */
export const VUE_BOUND_CLASS = `<template>
  <form>
    <label :class="{ required: isRequired }">Email address</label>
    <input id="email" type="email" />
  </form>
</template>`

/**
 * Headings nested inside other elements, one self-closing tag, one heading
 * that is already correct, plus two things that look like markup and are not:
 * an HTML comment and a `<script>` comment.
 */
export const VUE_NESTED = `<script setup lang="ts">
// TODO: drop the <p> wrapper once the design system ships
const orders = []
</script>

<template>
  <section class="card">
    <header>
      <h2>Recent orders</h2>
      <img src="/icon.svg" alt="" />
    </header>
    <!-- <label>Legacy opt-in</label> -->
    <div class="body">
      <h3 class="h3">Today</h3>
      <p class="muted">No orders yet.</p>
    </div>
  </section>
</template>

<style scoped>
h1,
h2 {
  margin-block: 0;
}
</style>`

/**
 * The control. Bare tags, nothing adversarial. Both implementations should get
 * this right — and the grader has to be able to say so, or it is not a grader.
 */
export const VUE_CONTROL = `<template>
  <article>
    <h2>Weekly digest</h2>
    <p>Three new orders since Monday.</p>
  </article>
</template>`

export interface VueFixture {
  name: string
  label: string
  source: string
}

export const VUE_FIXTURES: VueFixture[] = [
  { name: 'VUE_SUBSTRING', label: 'A class that contains "h1" but is not "h1"', source: VUE_SUBSTRING },
  { name: 'VUE_MULTILINE', label: 'Attributes spread over four lines', source: VUE_MULTILINE },
  { name: 'VUE_BOUND_CLASS', label: 'A bound :class and no static class', source: VUE_BOUND_CLASS },
  { name: 'VUE_NESTED', label: 'Nested headings, a comment, a script comment', source: VUE_NESTED },
  { name: 'VUE_CONTROL', label: 'Control: plain bare tags', source: VUE_CONTROL },
]

// ---------------------------------------------------------------------------
// An independent verifier
// ---------------------------------------------------------------------------

interface ElementInfo {
  tag: string
  staticClass: string | null
  boundClassRange: [number, number] | null
  openStart: number
  openEnd: number
}

function staticClassOf(node: any): string | null {
  const attr = node.props?.find((prop: any) => prop.type === ATTR_STATIC && prop.name === 'class')
  if (!attr) return null
  return attr.value?.content ?? ''
}

function boundClassRangeOf(node: any): [number, number] | null {
  const dir = node.props?.find(
    (prop: any) => prop.type === ATTR_DIRECTIVE && prop.name === 'bind' && prop.arg?.content === 'class',
  )
  if (!dir) return null
  return [dir.loc.start.offset, dir.loc.end.offset]
}

function collectElements(root: any, source: string): ElementInfo[] {
  const out: ElementInfo[] = []
  const visit = (node: any) => {
    if (node?.type === NODE_ELEMENT) {
      const openStart = node.loc.start.offset
      const close = source.indexOf('>', openStart)
      out.push({
        tag: node.tag,
        staticClass: staticClassOf(node),
        boundClassRange: boundClassRangeOf(node),
        openStart,
        openEnd: close === -1 ? openStart : close + 1,
      })
    }
    if (Array.isArray(node?.children)) node.children.forEach(visit)
  }
  ;(root?.children ?? []).forEach(visit)
  return out
}

const HTML_COMMENT = /<!--[\s\S]*?-->/g

export interface VerifyResult {
  ok: boolean
  problems: string[]
}

/**
 * Checks the post-conditions of the change against a fresh parse of the OUTPUT.
 *
 * This never looks at which implementation produced the output, so it cannot
 * flatter either one. Every rule here is something the change is supposed to
 * guarantee:
 *
 *   1. the output is still a parseable SFC
 *   2. `<script>` is untouched
 *   3. `<style>` is untouched
 *   4. HTML comments in the template are untouched
 *   5. the element structure is unchanged
 *   6. every target element carries its tag name as a class token
 *   7. no class list gained a duplicate token
 *   8. no non-target element's class changed
 */
export function verifyTagClasses(before: string, after: string): VerifyResult {
  const problems: string[] = []

  let b
  let a
  try {
    b = parseSfc(before).descriptor
  } catch (error: any) {
    return { ok: false, problems: [`the input did not parse: ${error?.message ?? error}`] }
  }
  try {
    a = parseSfc(after).descriptor
  } catch (error: any) {
    return { ok: false, problems: [`the output no longer parses: ${error?.message ?? error}`] }
  }

  const scriptOf = (d: any) => `${d.script?.content ?? ''} ${d.scriptSetup?.content ?? ''}`
  if (scriptOf(b) !== scriptOf(a)) problems.push('the <script> block was rewritten')

  const stylesOf = (d: any) => (d.styles ?? []).map((s: any) => s.content).join(' ')
  if (stylesOf(b) !== stylesOf(a)) problems.push('a <style> block was rewritten')

  if (!b.template || !a.template) {
    problems.push('the <template> block went missing')
    return { ok: false, problems }
  }

  const commentsOf = (content: string) => (content.match(HTML_COMMENT) ?? []).join(' ')
  if (commentsOf(b.template.content) !== commentsOf(a.template.content)) {
    problems.push('an HTML comment in the template was rewritten')
  }

  const beforeEls = collectElements(b.template.ast, before)
  const afterEls = collectElements(a.template.ast, after)

  if (beforeEls.length !== afterEls.length || beforeEls.some((el, i) => el.tag !== afterEls[i].tag)) {
    problems.push('the element structure changed')
    return { ok: false, problems }
  }

  afterEls.forEach((el, i) => {
    if (TARGET_TAGS.has(el.tag)) {
      if (el.staticClass === null) {
        problems.push(`<${el.tag}> still has no class attribute`)
        return
      }
      if (!hasExactClass(el.staticClass, el.tag)) {
        problems.push(`<${el.tag} class="${el.staticClass}"> is missing the "${el.tag}" token`)
        return
      }
      const tokens = el.staticClass.split(/\s+/).filter(Boolean)
      if (new Set(tokens).size !== tokens.length) {
        problems.push(`<${el.tag} class="${el.staticClass}"> has a duplicated token`)
      }
    } else if (beforeEls[i].staticClass !== el.staticClass) {
      problems.push(`<${el.tag}> is not a typography tag but its class attribute changed`)
    }
  })

  return { ok: problems.length === 0, problems }
}

/**
 * Class attributes in the source that would fool a substring check.
 * Computed from the source, not authored per fixture.
 */
export function substringTraps(source: string): string[] {
  const out: string[] = []
  for (const match of source.matchAll(/class="([^"]*)"/g)) {
    const value = match[1]
    for (const tag of TARGET_TAG_LIST) {
      if (value.includes(tag) && !hasExactClass(value, tag)) {
        out.push(`class="${value}" contains "${tag}" but not as a class token — includes() would skip it`)
      }
    }
  }
  return [...new Set(out)]
}

export interface VueGrade {
  name: string
  label: string
  regexOk: boolean
  astOk: boolean
  regexOut: string
  astOut: string
  whatWentWrong: string
}

/**
 * Runs both implementations over every fixture and grades them with
 * `verifyTagClasses`.
 *
 * The verdicts are computed. Nothing in this function is written down in
 * advance, which is the only reason the numbers on the slide mean anything.
 */
export function gradeVueFixtures(fixtures: VueFixture[] = VUE_FIXTURES): VueGrade[] {
  return fixtures.map((fixture) => {
    const regexOut = vueTagClassesRegex(fixture.source)
    const astResult = vueTagClasses(fixture.source)
    const astOut = astResult.code

    const regexCheck = verifyTagClasses(fixture.source, regexOut)
    const astCheck = astResult.error
      ? { ok: false, problems: [`the transform errored: ${astResult.error}`] }
      : verifyTagClasses(fixture.source, astOut)

    const parts: string[] = []
    if (!regexCheck.ok) {
      if (regexOut === fixture.source) {
        parts.push('the regex matched nothing — every target tag carries attributes or spans lines')
      }
      parts.push(...regexCheck.problems.map((problem) => `regex: ${problem}`))
    }
    if (!astCheck.ok) parts.push(...astCheck.problems.map((problem) => `AST: ${problem}`))
    parts.push(...substringTraps(fixture.source))

    return {
      name: fixture.name,
      label: fixture.label,
      regexOk: regexCheck.ok,
      astOk: astCheck.ok,
      regexOut,
      astOut,
      whatWentWrong: parts.length === 0 ? 'nothing — both implementations produced a correct template' : parts.join(' · '),
    }
  })
}

/**
 * Everything in the template the codemod correctly did NOT touch.
 *
 * Grounded in the actual edit ranges the run produced, so it stays true if the
 * transform changes. This is the other half of reviewing a codemod: not what it
 * changed, but what it left alone on purpose.
 */
export function vueSurvived(source: string, result: TransformResult): string[] {
  let descriptor
  try {
    descriptor = parseSfc(source).descriptor
  } catch {
    return []
  }
  if (!descriptor.template) return []

  const edits = result.edits ?? []
  const touched = (start: number, end: number) =>
    edits.some((edit) => edit.start < end && edit.end > start)

  const out: string[] = []

  const visit = (node: any) => {
    if (node?.type === NODE_ELEMENT) {
      const openStart = node.loc.start.offset
      const close = source.indexOf('>', openStart)
      const openEnd = close === -1 ? openStart : close + 1

      const bound = boundClassRangeOf(node)
      if (bound && !touched(bound[0], bound[1])) {
        out.push(`<${node.tag}> ${source.slice(bound[0], bound[1])} — the bound expression is untouched`)
      }

      if (!touched(openStart, openEnd)) {
        const cls = staticClassOf(node)
        if (TARGET_TAGS.has(node.tag)) {
          if (cls !== null && hasExactClass(cls, node.tag)) {
            out.push(`<${node.tag} class="${cls}"> — already carries "${node.tag}", left alone`)
          }
        } else {
          out.push(`<${node.tag}> — not a typography tag`)
        }
      }
    }

    if (node?.type === NODE_COMMENT) {
      const content = String(node.content ?? '').trim()
      if (TARGET_TAG_LIST.some((tag) => content.includes(`<${tag}`))) {
        out.push(`<!-- ${content} --> — markup to a human, a comment node to the parser`)
      }
    }

    if (Array.isArray(node?.children)) node.children.forEach(visit)
  }

  ;(descriptor.template.ast?.children ?? []).forEach(visit)

  const scriptContent = `${descriptor.script?.content ?? ''}\n${descriptor.scriptSetup?.content ?? ''}`
  for (const tag of TARGET_TAG_LIST) {
    if (scriptContent.includes(`<${tag}>`)) {
      out.push(`<script> mentions <${tag}> — outside the template AST, never visited`)
      break
    }
  }

  const styleContent = (descriptor.styles ?? []).map((style: any) => style.content).join('\n')
  for (const tag of TARGET_TAG_LIST) {
    if (new RegExp(`(^|[\\s,{])${tag}\\b`).test(styleContent)) {
      out.push(`<style> selector "${tag}" — a different language, never visited`)
      break
    }
  }

  return [...new Set(out)]
}

// ===========================================================================
// FAMILY 3 — PRINT
//
// One correct edit. Three ways back to disk. Only one of them produces a diff
// a human will review.
// ===========================================================================

export const PRINT_CALLEE = 'registerFeatureFlags'
export const PRINT_NEW_ARG = 'flagDefaults'

/** Exactly 11 blank lines. The counter on the slide is reading this file. */
export const PRINT_SOURCE = `import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import RootShell from './RootShell.vue'
import { routeTable } from './routes'

import { createTelemetry } from './telemetry'
import { flagDefaults, registerFeatureFlags } from './flags'

// The shell is mounted once per micro-frontend host, so every step below
// has to stay idempotent when a second host boots on the same page.

const router = createRouter({
  history: createWebHistory(),
  routes: routeTable,
})

const app = createApp(RootShell)

app.use(router)

const telemetry = createTelemetry({
  endpoint: '/api/telemetry',
  sampleRate: 0.25,
})

app.provide('telemetry', telemetry)

registerFeatureFlags(app)

router.isReady().then(() => {
  app.mount('#shell')
})

export { app, router }`

export interface PrintStrategy {
  key: 'reprint' | 'format' | 'splice'
  label: string
  code: string
  /** Empty lines in this output. */
  blankLines: number
  /** Lines this output changed relative to the input. */
  changedLines: number
  /** Set only when the input could not be parsed. */
  error?: string
}

/** Locate the single-argument call this family edits. */
function findTargetCall(ast: AstNode): AstNode | null {
  let found: AstNode | null = null
  walk(ast, (node: AstNode) => {
    if (found) return
    if (
      node.type === 'CallExpression' &&
      node.callee?.type === 'Identifier' &&
      node.callee.name === PRINT_CALLEE &&
      Array.isArray(node.arguments) &&
      node.arguments.length === 1
    ) {
      found = node
    }
  })
  return found
}

/**
 * The same correct edit, printed three ways.
 *
 * The edit is not in question. All three outputs call
 * `registerFeatureFlags(app, flagDefaults)`. What differs is everything the
 * source file said that the AST does not carry: blank lines, comments, and the
 * shape a person gave it.
 *
 * The middle strategy is the one worth stopping on. Running the formatter
 * afterwards restores the indentation, which is the part reviewers notice, and
 * does nothing at all about the blank lines, which is the part that makes the
 * diff unreviewable.
 */
export function printStrategies(source: string): PrintStrategy[] {
  const labels: Record<PrintStrategy['key'], string> = {
    reprint: 'Re-print the tree (astring, 4-space indent)',
    format: 'Re-print, then run the repo formatter (2-space indent)',
    splice: 'Splice the new argument into the original string',
  }

  const bail = (message: string): PrintStrategy[] =>
    (['reprint', 'format', 'splice'] as const).map((key) => ({
      key,
      label: labels[key],
      code: source,
      blankLines: countBlankLines(source),
      changedLines: 0,
      error: message,
    }))

  // --- reprint / format ---------------------------------------------------
  const reprintParse = parseJs(source)
  if (!reprintParse.ast) return bail(reprintParse.error ?? 'parse error')
  const reprintCall = findTargetCall(reprintParse.ast)
  if (!reprintCall) return bail(`no single-argument call to ${PRINT_CALLEE}() in this file`)
  // Mutate the tree, then print it. Comments were never in the tree to begin
  // with, and blank lines were never anywhere near it.
  reprintCall.arguments.push({ type: 'Identifier', name: PRINT_NEW_ARG })

  const reprint = generate(reprintParse.ast as any, { indent: '    ' })
  const formatted = generate(reprintParse.ast as any, { indent: '  ' })

  // --- splice -------------------------------------------------------------
  const spliceParse = parseJs(source)
  if (!spliceParse.ast) return bail(spliceParse.error ?? 'parse error')
  const spliceCall = findTargetCall(spliceParse.ast)
  if (!spliceCall) return bail(`no single-argument call to ${PRINT_CALLEE}() in this file`)
  const lastArg = spliceCall.arguments[spliceCall.arguments.length - 1] as AstNode
  const spliced = applyEdits(source, [
    {
      start: lastArg.end,
      end: lastArg.end,
      text: `, ${PRINT_NEW_ARG}`,
      reason: `insert the new argument after the last one (byte ${lastArg.end})`,
    },
  ])

  const build = (key: PrintStrategy['key'], code: string): PrintStrategy => ({
    key,
    label: labels[key],
    code,
    blankLines: countBlankLines(code),
    changedLines: changedLineCount(diffLines(source, code)),
  })

  return [build('reprint', reprint), build('format', formatted), build('splice', spliced)]
}
