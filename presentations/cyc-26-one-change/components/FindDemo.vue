<script setup lang="ts">
/**
 * AST example 1 — FIND.
 *
 * Two beats, two layouts, one set of numbers behind both.
 *
 * phase="migrate" — HOW a parser finds the thing. The file on the left with a
 *   real tree beside it: click a node and its exact character range lights up
 *   in the text, because a node is a label plus two numbers that point back
 *   into your source. Underneath, the same two numbers derived the other way —
 *   by tallying `[` and `]` — so the room can watch the two engines agree on a
 *   clean file and disagree the moment a `]` hides inside a string.
 *
 * phase="plain" — the STARTING POINT beat. The same file and the same tree,
 *   with nothing being compared and nothing being graded: a routing file, its
 *   anatomy, and the fact that the array is a node with a start and an end.
 *   Same layout as 'migrate' minus the bottom strip and minus the counter's
 *   red band, and the room that buys goes into the two panels that remain.
 *
 * phase="outcome" — WHAT that costs. The scanner and the parser side by side:
 *   the middle column reports what the TOOL believes (usually a green chip),
 *   and the line underneath is an independent check of what actually happened
 *   to the type annotation. The gap between those two rows is the whole slide.
 *
 * phase="all" — the original single-slide view, kept so a phase split can be
 *   undone on stage by swapping one attribute.
 *
 * Nothing here binds to Slidev's click state. Every number is computed live.
 */
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import { countNodes, countTree, parseJs, parseTs, toTree } from '../utils/ast'
import type { TreeNode } from '../utils/ast'
import { changedLineCount, diffLines } from '../utils/diff'
import { ROUTES_CLEAN, ROUTES_FIXTURES, routesAst, routesLineCounter } from '../utils/transforms'
import type { TransformResult } from '../utils/transforms'

const props = withDefaults(
  defineProps<{
    /** Seed for the editor and for Reset. */
    initial?: string
    filename?: string
    /** Tree rows deeper than this start folded. */
    treeDepth?: number
    /**
     * Which beat of the story this instance is.
     *
     * 'all'     — every panel, the original single-slide demo.
     * 'plain'   — the starting point: the file, a clickable tree, the readout.
     *             No second engine, no chip, no verdict. The calm beat.
     * 'migrate' — 'plain' plus the bracket counter: the same two numbers
     *             derived by counting, painted onto the file and tabulated
     *             underneath. Kept as the on-stage fallback for beat 2.
     * 'outcome' — what it cost: fixtures, the two outputs, the chips, the
     *             independent check, the changed-line counts, does it parse.
     *
     * 'all' and 'outcome' share one layout and one set of computeds; 'plain'
     * and 'migrate' render a different tree of elements over the same `source`
     * ref, so every phase mounts and reads on its own.
     */
    phase?: 'all' | 'migrate' | 'outcome' | 'plain'
  }>(),
  { initial: ROUTES_CLEAN, filename: 'src/router/index.ts', treeDepth: 3, phase: 'all' },
)

// ---------------------------------------------------------------------------
// composition: which panels this phase renders
// ---------------------------------------------------------------------------

/** The file itself. 'outcome' is about the report, not the input. */
const showEditor = computed(() => props.phase !== 'outcome')
/** The anatomy. It is the teaching moment of 'migrate' and noise in 'outcome'. */
const showTree = computed(() => props.phase !== 'outcome')
/** What the tool believes, and what actually happened: the 'outcome' beat. */
const showVerdict = computed(() => props.phase !== 'migrate')
const showCheck = computed(() => props.phase !== 'migrate')
const showStrip = computed(() => props.phase !== 'migrate')
/** Only 'outcome' compares diff sizes; on the clean file there is nothing to see. */
const showCounts = computed(() => props.phase === 'outcome')
/**
 * The fixture caption exists to say which hazard is loaded. The two live beats
 * open on the clean file and the pressed button already says which one it is;
 * on 'plain' a caption naming a hazard would also pre-empt beat 4.
 */
const showCaption = computed(() => props.phase !== 'migrate' && props.phase !== 'plain')

// ---------------------------------------------------------------------------
// fixtures
// ---------------------------------------------------------------------------

/** Short button labels. The library's longer ones caption the active button. */
const SHORT: Record<string, string> = {
  clean: 'clean',
  string: '] in a string',
  comment: '] in a comment',
  imported: 'imported routes',
}

const fixtures = ROUTES_FIXTURES.map((fixture) => ({
  ...fixture,
  short: SHORT[fixture.key] ?? fixture.key,
}))

const source = ref(props.initial)

const activeKey = computed(() => fixtures.find((f) => f.source === source.value)?.key ?? null)

const activeLabel = computed(
  () =>
    fixtures.find((f) => f.key === activeKey.value)?.label ??
    'Edited live — a shape nobody searched for',
)

function load(key: string) {
  const fixture = fixtures.find((f) => f.key === key)
  if (!fixture) return
  source.value = fixture.source
  // A new file is a new tree: re-anchor on the node that answers the question
  // rather than leaving a stale positional id selected.
  if (isLive.value) void restage()
}

function reset() {
  source.value = props.initial
  overrides.value = new Map()
  treeOpen.value = false
  if (isLive.value) void restage()
}

// ---------------------------------------------------------------------------
// running the two implementations, safely
// ---------------------------------------------------------------------------

/**
 * A transform that throws on stage must not blank the slide. Anything that
 * escapes becomes a red message inside its own panel.
 */
function run(fn: (code: string) => TransformResult, code: string): TransformResult {
  try {
    return fn(code)
  } catch (error: any) {
    return {
      code,
      matches: [],
      edits: [],
      error: error?.message ?? String(error),
      nodeCount: 0,
      ok: false,
      note: 'the transform threw before it finished',
    }
  }
}

/**
 * acorn speaks JavaScript. These three constructs are TypeScript, so they come
 * out before it is asked to parse — a narrow, written-down pre-pass. Everything
 * structural survives.
 */
const TS_IMPORT_TYPE = /^([ \t]*import)([ \t]+type)(?=[ \t])/gm
const TS_ASSERTION = /([\]})\w"'`])([ \t]+as[ \t]+(?:const\b|[A-Za-z_$][\w$.]*(?:[ \t]*\[[ \t]*\])*))/g
const TS_ANNOTATION =
  /((?:const|let|var)[ \t]+[A-Za-z_$][\w$]*)[ \t]*:[ \t]*[A-Za-z_$][\w$.]*(?:[ \t]*\[[ \t]*\])*(?=[ \t]*=)/g

function stripTs(code: string): string {
  return code
    .replace(TS_IMPORT_TYPE, '$1')
    .replace(TS_ASSERTION, '$1')
    .replace(TS_ANNOTATION, '$1')
}

/**
 * Does this still parse? Answered by actually parsing it.
 *
 * It cannot be answered with `routesAst(...).error`: the *correct* output
 * carries a type annotation, which is exactly one of the things acorn does not
 * speak. Asking the transform would report the right answer as a failure.
 */
function parses(code: string): boolean {
  try {
    return parseJs(stripTs(code)).error === null
  } catch {
    return false
  }
}

const textResult = computed(() => run(routesLineCounter, source.value))
const astResult = computed(() => run(routesAst, source.value))

// ---------------------------------------------------------------------------
// what the tool believes about itself
// ---------------------------------------------------------------------------

type Tone = 'good' | 'warn' | 'bad'

function verdict(result: TransformResult): { tone: Tone; label: string } {
  if (result.error) return { tone: 'bad', label: 'parse error' }
  if (!result.ok) return { tone: 'warn', label: 'refused' }
  return { tone: 'good', label: result.edits.length > 0 ? 'migrated' : 'no change' }
}

// ---------------------------------------------------------------------------
// the independent check
//
// Deliberately not derived from either transform's own report. It reads the
// output text and answers one question: does anything still give `routes` a
// type? An annotation counts. A surviving assertion counts as "not done yet".
// Nothing at all is the silent failure.
// ---------------------------------------------------------------------------

const ANNOTATION = /(?:const|let|var)\s+routes\s*:\s*([A-Za-z_$][\w$.]*(?:\s*\[\s*\])*)\s*=/
const AS_TYPE = /([\]})\w"'`])[ \t]+as[ \t]+([A-Za-z_$][\w$.]*(?:[ \t]*\[[ \t]*\])*)/g

function annotationIn(code: string): string | null {
  const match = code.match(ANNOTATION)
  return match ? match[1].replace(/\s+/g, '') : null
}

function assertionIn(code: string): string | null {
  for (const match of code.matchAll(AS_TYPE)) {
    const at = match.index ?? 0
    const lineStart = code.lastIndexOf('\n', at) + 1
    const lineEnd = code.indexOf('\n', at)
    const line = code.slice(lineStart, lineEnd === -1 ? code.length : lineEnd)
    // `import { a as b } from '…'` is a rename, not a type assertion.
    if (/^\s*(?:import|export)\b/.test(line) && /\bfrom\b/.test(line)) continue
    // English contains the word "as" too. A prose comment about the migration
    // is not a type assertion, and reporting `as the` would be a lie.
    const comment = line.indexOf('//')
    if (comment !== -1 && lineStart + comment < at) continue
    return match[2].replace(/\s+/g, '')
  }
  return null
}

type CheckState = 'present' | 'gone' | 'pending' | 'none'

function check(before: string, after: string): { state: CheckState; headline: string; detail: string } {
  const hadAnnotation = annotationIn(before)
  const hadAssertion = assertionIn(before)
  const annotation = annotationIn(after)
  const assertion = assertionIn(after)

  if (annotation) {
    return {
      state: 'present',
      headline: 'annotation present',
      detail: `const routes: ${annotation}`,
    }
  }
  if (hadAnnotation || hadAssertion) {
    if (assertion) {
      return {
        state: 'pending',
        headline: 'not migrated',
        detail: `still says "as ${assertion}"`,
      }
    }
    return {
      state: 'gone',
      headline: 'ANNOTATION GONE',
      detail: `it was ${hadAnnotation ?? hadAssertion}; now nothing types routes`,
    }
  }
  return { state: 'none', headline: 'no type to move', detail: 'nothing here types routes' }
}

// ---------------------------------------------------------------------------
// the output view: the produced code, elided down to the lines that matter
// ---------------------------------------------------------------------------

interface OutRow {
  kind: 'line' | 'gap'
  text: string
  label: string
  changed: boolean
  count: number
}

/** Guard: the LCS diff is O(n·m) and this textarea takes arbitrary paste. */
const DIFF_LINE_LIMIT = 400
/** Short files are shown whole; eliding three lines helps nobody. */
const ALWAYS_WHOLE = 14

/**
 * Lines that stay on screen even when they did not change.
 *
 * This matters more than it looks. The silent failure is a line that SHOULD
 * have changed and did not, so a plain diff view hides the evidence: elide the
 * unchanged runs and `const routes = [` — the declaration with no annotation on
 * it — disappears into "sixteen unchanged lines".
 */
const KEY_LINE =
  /(?:const|let|var)[ \t]+routes[ \t]*[:=]|\bas[ \t]+[A-Z][\w$.]*(?:[ \t]*\[[ \t]*\])*[ \t]*;?[ \t]*$/

function plainRows(lines: string[], isNew: Set<number>): OutRow[] {
  return lines.map((text, index) => ({
    kind: 'line' as const,
    text,
    label: String(index + 1),
    changed: isNew.has(index),
    count: 0,
  }))
}

function outputRows(before: string, after: string): OutRow[] {
  const lines = after.split('\n')
  const tooBig = before.split('\n').length > DIFF_LINE_LIMIT || lines.length > DIFF_LINE_LIMIT

  // Which output lines are new. `del` rows are not in the output at all; the
  // line that replaced them is, and that is the one worth marking.
  const isNew = new Set<number>()
  if (before !== after && !tooBig) {
    diffLines(before, after).forEach((row) => {
      if (row.kind === 'add' && row.after !== null) isNew.add(row.after - 1)
    })
  }

  if (lines.length <= ALWAYS_WHOLE || tooBig) return plainRows(lines, isNew)

  const keep = lines.map((text, index) => isNew.has(index) || KEY_LINE.test(text))
  if (!keep.some(Boolean)) return plainRows(lines, isNew)

  const out: OutRow[] = []
  let run = 0
  lines.forEach((text, index) => {
    if (!keep[index]) {
      run += 1
      return
    }
    // A leading run of unchanged lines needs no marker; the line numbers say so.
    if (run > 0 && out.length > 0) {
      out.push({ kind: 'gap', text: '', label: '', changed: false, count: run })
    }
    run = 0
    out.push({ kind: 'line', text, label: String(index + 1), changed: isNew.has(index), count: 0 })
  })
  return out
}

/**
 * How many lines this run touched, from the same diff the output pane draws.
 * Never a stored number: the punchline is that the broken run is the SMALLER
 * diff, and a hardcoded pair would stop being true the moment anyone types.
 * `null` only when the file is past the diff guard.
 */
function changedCount(before: string, after: string): number | null {
  if (before === after) return 0
  if (before.split('\n').length > DIFF_LINE_LIMIT || after.split('\n').length > DIFF_LINE_LIMIT) {
    return null
  }
  return changedLineCount(diffLines(before, after))
}

// ---------------------------------------------------------------------------
// the two columns, built from one shape so they cannot drift apart
// ---------------------------------------------------------------------------

const columns = computed(() => {
  const build = (
    key: 'text' | 'ast',
    title: string,
    call: string,
    result: TransformResult,
  ) => ({
    key,
    title,
    call,
    result,
    verdict: verdict(result),
    check: check(source.value, result.code),
    rows: outputRows(source.value, result.code),
    parses: parses(result.code),
    changed: changedCount(source.value, result.code),
    /* An unchanged output is stated, not re-printed: a second scrolling copy
       of the file next to the original tells the room nothing. */
    unchanged: result.code === source.value,
  })

  return [
    build('text', 'text tool', 'routesLineCounter', textResult.value),
    build('ast', 'parser', 'routesAst', astResult.value),
  ]
})

// ---------------------------------------------------------------------------
// the tree
//
// Same pre-pass as the parse check, so the byte ranges here are offsets into
// the stripped text rather than into the file on screen. The panel says so.
// ---------------------------------------------------------------------------

/* Per-instance: the phases are separate mounts and the deck keeps both slides
   in the DOM, so a literal id would be a duplicate the moment axe looked. */

interface DiffRow {
  kind: 'same' | 'add' | 'del' | 'gap'
  text: string
  no: string
  mark: string
  count: number
}

/** The gutter mark. `-` is what arrived, `+` is what the migration wrote. */
function markOf(kind: 'same' | 'add' | 'del'): string {
  if (kind === 'add') return '+'
  return kind === 'del' ? '-' : ' '
}

// ---------------------------------------------------------------------------
// phase 'outcome' — what the migration did to each shape
//
// One implementation, four shapes. Rebuilt after the deck dropped the
// regex-versus-parser framing: beat 4 answers the goal from beat 1 rather than
// scoring two techniques against each other. Every number below is computed
// from a live run, so a fixture edited on stage re-reports itself.
// ---------------------------------------------------------------------------

const isOutcome = computed(() => props.phase === 'outcome')

/** The loaded shape's short name, for the diff header. */
const activeShort = computed(
  () => fixtures.find((f) => f.key === activeKey.value)?.short ?? 'edited live',
)

/**
 * Routes are counted by their `path:` key rather than by braces: the goal is
 * "without touching a single route", and a count that survives reformatting is
 * the only kind worth putting on a slide.
 */
function routeCount(code: string): number {
  return (code.match(/\bpath\s*:/g) ?? []).length
}

interface ReportRow {
  key: string
  short: string
  label: string
  outcome: 'migrated' | 'skipped'
  changed: number | null
  facts: { text: string; tone: Tone }[]
  reason: string
}

const report = computed<ReportRow[]>(() =>
  fixtures.map((fixture) => {
    const result = run(routesAst, fixture.source)
    const changed = changedCount(fixture.source, result.code)
    const migrated = !result.error && changed !== 0
    const annotation = annotationIn(result.code)
    const before = routeCount(fixture.source)
    const after = routeCount(result.code)
    return {
      key: fixture.key,
      short: fixture.short,
      label: fixture.label,
      outcome: migrated ? 'migrated' : 'skipped',
      changed,
      facts: [
        annotation
          ? { text: 'annotation present', tone: 'good' as Tone }
          : { text: 'no annotation', tone: 'warn' as Tone },
        assertionIn(result.code)
          ? { text: 'assertion still there', tone: 'warn' as Tone }
          : { text: 'assertion removed', tone: 'good' as Tone },
        {
          text: `${before} routes untouched`,
          tone: (before === after ? 'good' : 'bad') as Tone,
        },
      ],
      reason: result.note,
    }
  }),
)

/** The goal from beat one, as two numbers. */
const totals = computed(() => {
  let routes = 0
  let touched = 0
  for (const fixture of fixtures) {
    const before = routeCount(fixture.source)
    const after = routeCount(run(routesAst, fixture.source).code)
    routes += before
    touched += Math.abs(before - after)
  }
  return { routes, touched }
})

function diffRowsOf(before: string, after: string): DiffRow[] {
  if (before.split('\n').length > DIFF_LINE_LIMIT || after.split('\n').length > DIFF_LINE_LIMIT) {
    return [{ kind: 'gap', text: '', no: '', mark: '', count: before.split('\n').length }]
  }
  /*
   * The whole file, every line, no elision. Tim's call: an elided diff makes the
   * room do arithmetic about what is hidden, and "⋯ 15 lines untouched" is a
   * claim they have to take on trust. The pane scrolls like every other code
   * pane in the deck, so the untouched lines are there to be looked at.
   */
  return diffLines(before, after).map((line) => ({
    kind: line.kind,
    text: line.text,
    no: String(line.before ?? line.after ?? ''),
    mark: markOf(line.kind),
    count: 0,
  }))
}

const diffRows = computed(() => diffRowsOf(source.value, astResult.value.code))
const diffChanged = computed(() => changedCount(source.value, astResult.value.code))

// ---------------------------------------------------------------------------
// the tree
//
// Same pre-pass as the parse check, so the byte ranges here are offsets into
// the stripped text rather than into the file on screen. The panel says so.
// ---------------------------------------------------------------------------

/* Per-instance: the phases are separate mounts and the deck keeps both slides
   in the DOM, so a literal id would be a duplicate the moment axe looked. */
const treePanelId = `fd-tree-${useId()}`

/* Folded on arrival in every phase, as it always was: on 'migrate' the speaker
   opens it as a beat, and what changes there is how much of the slide it takes
   once open — see the phase block in the stylesheet. */
const treeOpen = ref(false)
const overrides = ref(new Map<string, boolean>())

const treeParse = computed(() => {
  try {
    return parseJs(stripTs(source.value))
  } catch (error: any) {
    return { ast: null, error: error?.message ?? String(error) }
  }
})

const treeRoot = computed<TreeNode | null>(() => {
  if (!treeParse.value.ast) return null
  try {
    return toTree(treeParse.value.ast)
  } catch {
    return null
  }
})

const treeNodeCount = computed(() => (treeParse.value.ast ? countNodes(treeParse.value.ast) : 0))

interface TreeRow {
  id: string
  type: string
  detail: string
  start: number
  end: number
  depth: number
  hasChildren: boolean
  open: boolean
}

function isOpen(id: string, depth: number): boolean {
  const override = overrides.value.get(id)
  return override === undefined ? depth < props.treeDepth : override
}

function toggleNode(id: string, depth: number) {
  const next = new Map(overrides.value)
  next.set(id, !isOpen(id, depth))
  overrides.value = next
}

const treeRows = computed<TreeRow[]>(() => {
  const out: TreeRow[] = []
  const visit = (node: TreeNode, depth: number) => {
    const hasChildren = node.children.length > 0
    const open = hasChildren && isOpen(node.id, depth)
    out.push({
      id: node.id,
      type: node.type,
      detail: node.detail,
      start: node.start,
      end: node.end,
      depth,
      hasChildren,
      open,
    })
    if (open) node.children.forEach((child) => visit(child, depth + 1))
  }
  if (treeRoot.value) visit(treeRoot.value, 0)
  return out
})

// ===========================================================================
// THE LIVE PHASES — 'plain' and 'migrate'
//
// Everything from here down is only rendered by those two. They share one job:
// make the mechanism visible instead of asserting it.
//
//   A node is a label plus two numbers that point back into your text.
//
// 'plain' stops exactly there. This is a routing file, this is its tree, and
// the array is a node with a start and an end — click one and the characters
// it owns light up. Nothing is compared and nothing is graded.
//
// 'migrate' takes the same screen and asks ONE question of it — where does the
// routes array start, and where does it end? — then answers it twice, at the
// same time:
//
//   the parser   walks the tree and READS two numbers off a node
//   the counter  tallies '[' and ']' and DERIVES the same two by counting
//
// On the clean file they agree to the character. On a file with a ']' inside a
// string or a comment they do not, and that disagreement is the entire lesson.
// Neither number is written down anywhere: one comes out of acorn, the other
// out of `routesLineCounter`, the scanner we actually shipped.
//
// The counter exists only for 'migrate'. Everything it drives — the red band,
// the stopped-on character, the strip at the bottom — is behind `isMigrate`,
// so on 'plain' none of it is read and none of it is computed.
// ===========================================================================

const isMigrate = computed(() => props.phase === 'migrate')
const isPlain = computed(() => props.phase === 'plain')
/** Both live beats: the editable file, the clickable tree, the readout. */
const isLive = computed(() => isMigrate.value || isPlain.value)

interface Span {
  start: number
  end: number
}

// ---------------------------------------------------------------------------
// A tree whose offsets index the text ON SCREEN
// ---------------------------------------------------------------------------

function lineStartOf(code: string, offset: number): number {
  return code.lastIndexOf('\n', Math.max(0, offset - 1)) + 1
}

/** 1-based line number of an offset. */
function lineNoOf(code: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset && i < code.length; i += 1) if (code[i] === '\n') line += 1
  return line
}

/**
 * The tree, parsed as TypeScript.
 *
 * Offsets here are offsets into the file on screen — there is no pre-pass and
 * nothing is cut out, so every character of `as RouteRecordRaw[]` belongs to a
 * node and clicking it selects that node rather than falling through to
 * Program — which is what this pane used to do, because it cut the type syntax
 * out before handing the text to acorn and then mapped the offsets back.
 *
 * `stripTs` further up survives on purpose: it still feeds the 'outcome'
 * phase's parse check, which is asking a different question.
 */
const mParse = computed(() => parseTs(source.value))

const mRoot = computed<TreeNode | null>(() => {
  if (!mParse.value.ast) return null
  try {
    return toTree(mParse.value.ast)
  } catch {
    return null
  }
})

const mNodeCount = computed(() => countTree(mRoot.value))

// ---------------------------------------------------------------------------
// rows, folding, selection
// ---------------------------------------------------------------------------

interface MFlat extends TreeNode {
  depth: number
  parentId: string | null
}

const mFlat = computed<MFlat[]>(() => {
  const out: MFlat[] = []
  const visit = (node: TreeNode, depth: number, parentId: string | null) => {
    out.push({ ...node, depth, parentId })
    node.children.forEach((child) => visit(child, depth + 1, node.id))
  }
  if (mRoot.value) visit(mRoot.value, 0, null)
  return out
})

const mById = computed(() => new Map(mFlat.value.map((node) => [node.id, node])))

/** Explicit fold state. Anything not in here defaults to `depth < treeDepth`. */
const mFolds = ref(new Map<string, boolean>())

function mIsOpen(id: string, depth: number): boolean {
  const override = mFolds.value.get(id)
  return override === undefined ? depth < props.treeDepth : override
}

function mToggle(id: string, depth: number) {
  const next = new Map(mFolds.value)
  next.set(id, !mIsOpen(id, depth))
  mFolds.value = next
}

interface MRow extends MFlat {
  hasChildren: boolean
  open: boolean
}

const mRows = computed<MRow[]>(() => {
  const out: MRow[] = []
  const visit = (node: TreeNode, depth: number, parentId: string | null) => {
    const hasChildren = node.children.length > 0
    const open = hasChildren && mIsOpen(node.id, depth)
    out.push({ ...node, depth, parentId, hasChildren, open })
    if (open) node.children.forEach((child) => visit(child, depth + 1, node.id))
  }
  if (mRoot.value) visit(mRoot.value, 0, null)
  return out
})

const mSelectedId = ref<string | null>(null)
const mSelected = computed(() =>
  mSelectedId.value ? (mById.value.get(mSelectedId.value) ?? null) : null,
)

/**
 * The accessible name of a tree row.
 *
 * The visible row is three spans with no whitespace between them, so its text
 * content reads as "Identifierroutes47-53". Naming it explicitly is the
 * difference between a row a screen reader can say and one it spells.
 */
function mRowLabel(node: TreeNode): string {
  const detail = node.detail ? ` ${node.detail}` : ''
  return `${node.type}${detail}, characters ${node.start} to ${node.end}`
}

// ---------------------------------------------------------------------------
// the question, answered twice
// ---------------------------------------------------------------------------

/**
 * The parser's answer: walk the tree for the declarator named `routes` whose
 * initialiser is an array, and take that array's two numbers. A structural
 * question — no characters are examined anywhere in here.
 */
const answerNode = computed<MFlat | null>(() => {
  for (const node of mFlat.value) {
    if (node.type !== 'VariableDeclarator') continue
    const named = node.children.some((child) => child.type === 'Identifier' && child.detail === 'routes')
    /* `const routes = [ … ] as RouteRecordRaw[]` puts a TSAsExpression between
       the declarator and its array. The question is still "which array", so
       step through the assertion rather than widening what counts as one. */
    const init = node.children.find((child) => child.type === 'TSAsExpression')
    const array = (init ?? node).children.find((child) => child.type === 'ArrayExpression')
    if (named && array) return mById.value.get(array.id) ?? null
  }
  return null
})

const parserRange = computed<Span | null>(() =>
  answerNode.value ? { start: answerNode.value.start, end: answerNode.value.end } : null,
)

/**
 * The counter's answer, taken from the shipped scanner's own report rather than
 * re-derived here: `routesLineCounter` publishes the declaration line it
 * matched and the `]` that brought its tally back to zero. The opening `[` is
 * the first one at or after that line, which is the same character its loop
 * counts first.
 */
const counterRange = computed<Span | null>(() => {
  const matches = textResult.value.matches
  if (matches.length < 2) return null
  const close = matches[1].start
  if (!Number.isFinite(close) || close < 0) return null
  const open = source.value.indexOf('[', matches[0].start)
  if (open === -1 || open > close) return null
  return { start: open, end: close + 1 }
})

const rangesAgree = computed(() => {
  const parser = parserRange.value
  const counter = counterRange.value
  return !!parser && !!counter && parser.start === counter.start && parser.end === counter.end
})

/** The two rows of the comparison strip, and the chip that grades them. */
const comparison = computed(() => {
  const parser = parserRange.value
  const counter = counterRange.value
  const agree = rangesAgree.value

  const parserHow = parser
    ? 'read off the declarator named routes'
    : mParse.value.ast
      ? 'no declarator named routes — it refuses'
      : 'the file does not parse right now'

  /* Where the tally stopped, not what it stopped on: the character itself is
     marked in red in the source, three inches above this line. */
  const counterHow = !counter
    ? 'no `const routes = [` on any line'
    : agree
      ? 'tallied [ and ] from the declaration'
      : `its tally hit zero on line ${lineNoOf(source.value, counter.end - 1)}`

  const chip = agree
    ? { tone: 'good' as Tone, label: 'same two numbers' }
    : parser || counter
      ? { tone: 'bad' as Tone, label: 'different answer' }
      : { tone: 'warn' as Tone, label: 'neither found it' }

  return {
    agree,
    chip,
    rows: [
      {
        key: 'ast',
        who: 'parser',
        how: parserHow,
        start: parser ? String(parser.start) : '—',
        end: parser ? String(parser.end) : '—',
        offStart: false,
        offEnd: false,
      },
      {
        key: 'text',
        who: 'bracket counter',
        how: counterHow,
        start: counter ? String(counter.start) : '—',
        end: counter ? String(counter.end) : '—',
        // Only the number that actually differs is painted as damage.
        offStart: !!counter && (!parser || counter.start !== parser.start),
        offEnd: !!counter && (!parser || counter.end !== parser.end),
      },
    ],
  }
})

// ---------------------------------------------------------------------------
// the source pane
//
// Two layers in one box: a <pre> that paints the bands, and a transparent
// <textarea> on top of it that stays fully editable. The textarea's caret IS
// the offset — click anywhere and the smallest node containing that character
// is selected — so the two layers must lay text out identically. They share a
// font, a line-height, a wrapping mode and a left inset; the pre's line numbers
// are a hanging indent so that wrapped continuations land in the same column
// the textarea puts them in.
//
// Characters are grouped into runs rather than emitted one span each: a
// twenty-line file is ~1000 characters and this re-renders on every keystroke.
// ---------------------------------------------------------------------------

interface PaintSeg {
  text: string
  sel: boolean
  /** The counter's answer. Never set on 'plain': that beat has no counter. */
  tally: boolean
  /** The single character the counter stopped on, when it stopped in the wrong
   *  place. This is the one glyph the whole example is about. */
  stop: boolean
}

interface PaintLine {
  no: number
  start: number
  segs: PaintSeg[]
}

const paintLines = computed<PaintLine[]>(() => {
  const text = source.value
  const sel = mSelected.value
  /* 'plain' paints one thing: the node you selected. Reading `counterRange`
     here at all would put the second engine back on the slide. */
  const counter = isMigrate.value ? counterRange.value : null
  const stopAt = counter && !rangesAgree.value ? counter.end - 1 : -1

  /* A single trailing newline terminates the last line; it does not open
     another one, and painting an extra numbered row would put the two layers
     one line out of step at the bottom of the file. */
  const body = text.endsWith('\n') ? text.slice(0, -1) : text
  const out: PaintLine[] = []
  let at = 0
  for (const [index, lineText] of body.split('\n').entries()) {
    const segs: PaintSeg[] = []
    /* `split('')`, not `[...text]`: parser offsets are UTF-16 code units, and
       iterating code points would drift the moment anyone pastes an emoji. */
    for (const [column, ch] of lineText.split('').entries()) {
      const off = at + column
      const seg = {
        text: ch,
        sel: !!sel && off >= sel.start && off < sel.end,
        tally: !!counter && off >= counter.start && off < counter.end,
        stop: off === stopAt,
      }
      const last = segs[segs.length - 1]
      if (last && last.sel === seg.sel && last.tally === seg.tally && last.stop === seg.stop) {
        last.text += ch
      } else {
        segs.push(seg)
      }
    }
    out.push({ no: index + 1, start: at, segs })
    at += lineText.length + 1
  }
  return out
})

const paintRef = ref<HTMLElement | null>(null)
const editRef = ref<HTMLTextAreaElement | null>(null)
const mListRef = ref<HTMLElement | null>(null)

/** The paint layer never scrolls itself; it follows the editor, exactly. */
function syncScroll() {
  const paint = paintRef.value
  const edit = editRef.value
  if (!paint || !edit) return
  paint.scrollTop = edit.scrollTop
  paint.scrollLeft = edit.scrollLeft
}

/**
 * Scroll a box just far enough. Deliberately not `scrollIntoView`: that walks
 * every scrollable ancestor, and on a Slidev canvas the nearest one it finds
 * can be the deck itself.
 */
function scrollBox(box: HTMLElement, top: number, height: number) {
  const bottom = top + height
  if (top < box.scrollTop) box.scrollTop = top
  else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight
}

/**
 * The source pane's line box, and the padding above the first one.
 *
 * The line box is a number the stylesheet and this maths have to agree on to
 * the pixel — the reveal snaps onto it — so 'plain', which sets a taller one,
 * is listed here rather than only in the CSS.
 */
const lineBox = computed(() => (isPlain.value ? 22 : 20))
const PANE_PAD = 6

/**
 * Bring the line an offset sits on into the source pane, plus two lines of
 * air after it.
 *
 * The air is the point when the two engines disagree: the line that matters is
 * the one the tally stopped on, and what proves it stopped early is the blue
 * band CONTINUING underneath with no red under it. Landing that line flush
 * against the bottom edge would hide the evidence.
 *
 * The result is then snapped back onto this phase's line grid, so the pane never
 * opens on a half-row.
 */
function revealOffset(offset: number, slack = 2) {
  const paint = paintRef.value
  const edit = editRef.value
  if (!paint || !edit) return
  const at = lineStartOf(source.value, Math.max(0, Math.min(offset, source.value.length)))
  const row = paint.querySelector<HTMLElement>(`[data-at="${at}"]`)
  if (!row) return
  const line = lineBox.value
  scrollBox(edit, row.offsetTop, row.offsetHeight + slack * line)
  // Snap DOWN the scroll offset — never up — so the snap can only reveal more
  // above the target, never push the target back under the fold.
  edit.scrollTop = Math.max(0, Math.floor((edit.scrollTop - PANE_PAD) / line) * line + PANE_PAD)
  syncScroll()
}

/** Bring a tree row into the tree's own scrollport. */
function revealRow(id: string | null) {
  const list = mListRef.value
  if (!list || !id) return
  const row = list.querySelector<HTMLElement>(`[data-row="${CSS.escape(id)}"]`)
  if (row) scrollBox(list, row.offsetTop, row.offsetHeight)
}

function openAncestors(id: string) {
  const next = new Map(mFolds.value)
  let current = mById.value.get(id)?.parentId ?? null
  while (current) {
    next.set(current, true)
    current = mById.value.get(current)?.parentId ?? null
  }
  mFolds.value = next
}

async function mSelect(id: string) {
  if (!mById.value.has(id)) return
  mSelectedId.value = id
  openAncestors(id)
  await nextTick()
  revealRow(id)
  revealOffset(mById.value.get(id)?.start ?? 0)
}

/**
 * The smallest node whose range contains this offset.
 *
 * "Smallest" is the point: every offset is inside Program, and inside the
 * declaration, and inside the declarator. The innermost one is the answer,
 * which is the same walk a codemod does when it asks a structural question.
 */
function mNodeAt(offset: number): MFlat | null {
  let best: MFlat | null = null
  for (const node of mFlat.value) {
    if (offset < node.start || offset >= node.end) continue
    if (!best || node.end - node.start <= best.end - best.start) best = node
  }
  return best
}

/**
 * The caret moved. Select whatever node holds it.
 *
 * Bound to `click` and `keyup` and deliberately NOT to `select`: staging the
 * demo parks the caret with `setSelectionRange`, which fires `select`, and a
 * handler there would re-select whatever tiny node sits at the anchor and
 * quietly undo the anchoring it was helping with.
 */
function onCaret(event: Event) {
  const el = event.target as HTMLTextAreaElement | null
  if (!el) return
  const node = mNodeAt(Math.max(0, Math.min(el.selectionStart ?? 0, source.value.length)))
  if (!node || node.id === mSelectedId.value) return
  mSelectedId.value = node.id
  openAncestors(node.id)
  nextTick(() => revealRow(node.id))
}

// ---------------------------------------------------------------------------
// staging
// ---------------------------------------------------------------------------

/**
 * Put the demo back on its subject: select the array the parser found, and
 * scroll to it.
 *
 * 'migrate' overrides where to land when the two engines disagree — the
 * character the tally stopped on is the thing being talked about there. On
 * 'plain' there is no disagreement to land on, so it is always the
 * declaration.
 *
 * Called on mount, on Reset and on every fixture button. Never on a keystroke:
 * the pane yanking itself around while the speaker types would be its own bug.
 */
async function restage() {
  mFolds.value = new Map()
  await nextTick()
  const id = answerNode.value?.id ?? null
  mSelectedId.value = id
  if (id) openAncestors(id)
  await nextTick()
  let focus = parserRange.value?.start ?? 0
  if (isMigrate.value) {
    const counter = counterRange.value
    if (counter && !rangesAgree.value) focus = counter.end - 1
  }
  /* Park the caret on the thing being talked about. Loading a fixture assigns
     `value`, and that leaves the caret at the end of the file — so the next
     person to tab into the editor would scroll the pane to the bottom before
     they had touched anything. Placing it does not scroll; the reveal below
     does that, deliberately. */
  editRef.value?.setSelectionRange(focus, focus)
  revealOffset(focus)
  revealRow(id)
}

/*
 * Everything above is a lazy computed, so the static phases never build any of
 * it. This watcher is the one thing that would evaluate eagerly — `watch`
 * reads its source once to seed the old value — so it is only registered on a
 * live beat. `phase` is fixed for the life of an instance, so a conditional
 * watcher here creates no reactivity hole.
 *
 * What it repairs: node ids are positional, so typing invalidates them. Rather
 * than blank the readout mid-sentence, fall back to the node that answers the
 * question.
 */
if (isLive.value) {
  watch(mById, (map) => {
    if (mSelectedId.value && !map.has(mSelectedId.value)) {
      mSelectedId.value = answerNode.value?.id ?? null
    }
  })
}

onMounted(() => {
  if (isLive.value) void restage()
})
</script>

<template>
  <div class="fd" :class="[`fd--${phase}`, { 'fd--treeopen': treeOpen }]">
    <!-- controls ------------------------------------------------------- -->
    <div class="fd__bar">
      <div class="fd__fixtures" role="group" aria-label="Load a fixture">
        <button
          v-for="fixture in fixtures"
          :key="fixture.key"
          type="button"
          class="fd__fx"
          :class="{ 'fd__fx--on': activeKey === fixture.key }"
          :aria-pressed="activeKey === fixture.key"
          @click="load(fixture.key)"
        >
          {{ fixture.short }}
        </button>
      </div>
      <p
        v-if="showCaption"
        class="fd__caption"
        :class="{ 'fd__caption--edited': !activeKey }"
        aria-live="polite"
      >
        {{ activeLabel }}
      </p>
      <p v-if="isLive" class="fd__meta">
        <span class="fd__file">{{ filename }}</span>
        <span class="fd__mcount">{{ mNodeCount }} nodes</span>
      </p>
      <button type="button" class="fd__reset" @click="reset">Reset</button>
    </div>

    <!-- =================================================================
         phases 'plain' and 'migrate' — the text and the tree.
         'migrate' adds the counter's band and the strip underneath.
         ================================================================= -->
    <template v-if="isLive">
      <div class="fd__mgrid">
        <!-- LEFT: the file, with both answers painted onto it ------------ -->
        <div class="fd__mcol">
          <p class="fd__read" aria-live="polite">
            <template v-if="mSelected">
              <span class="fd__rtype">{{ mSelected.type }}</span>
              <span class="fd__rnums">
                start <strong>{{ mSelected.start }}</strong>
                <span class="fd__rdot" aria-hidden="true">·</span>
                end <strong>{{ mSelected.end }}</strong>
              </span>
              <span class="fd__rarrow" aria-hidden="true">→</span>
              <span class="fd__rcall">source.slice({{ mSelected.start }}, {{ mSelected.end }})</span>
            </template>
            <span v-else class="fd__rsay">Click a node in the tree, or put the cursor anywhere in the file.</span>
          </p>

          <div class="fd__src">
            <pre
              ref="paintRef"
              class="fd__paint"
              aria-hidden="true"
            ><code><span v-for="line in paintLines" :key="line.no" class="fd__pl" :data-at="line.start"><span class="fd__pno">{{ line.no }}</span><span v-for="(seg, index) in line.segs" :key="index" class="fd__seg" :class="{
              'fd__seg--sel': seg.sel,
              'fd__seg--tally': seg.tally,
              'fd__seg--stop': seg.stop,
            }">{{ seg.text }}</span></span></code></pre>
            <textarea
              ref="editRef"
              v-model="source"
              class="fd__edit"
              aria-label="Router source, editable. The cursor selects the smallest node that contains it."
              spellcheck="false"
              autocapitalize="off"
              autocomplete="off"
              @scroll="syncScroll"
              @click="onCaret"
              @keyup="onCaret"
            ></textarea>
          </div>
        </div>

        <!-- RIGHT: the tree ---------------------------------------------- -->
        <div class="fd__mcol fd__mcol--tree">
          <p v-if="!mRoot" class="fd__err">
            <span aria-hidden="true">✕</span>
            <span>it could not parse: {{ mParse.error ?? 'unknown error' }}</span>
          </p>
          <ul v-else ref="mListRef" class="fd__mlist">
            <li
              v-for="row in mRows"
              :key="row.id"
              class="fd__mli"
              :style="{ paddingLeft: `${row.depth * 0.75}rem` }"
            >
              <button
                v-if="row.hasChildren"
                type="button"
                class="fd__mtwist"
                :aria-expanded="row.open"
                @click="mToggle(row.id, row.depth)"
              >
                <span aria-hidden="true">{{ row.open ? '▾' : '▸' }}</span>
                <span class="fd__vh">{{ row.open ? 'Collapse' : 'Expand' }} {{ mRowLabel(row) }}</span>
              </button>
              <span v-else class="fd__mtwist fd__mtwist--leaf" aria-hidden="true">·</span>
              <button
                type="button"
                class="fd__mrow"
                :class="{ 'fd__mrow--on': mSelectedId === row.id }"
                :data-row="row.id"
                :aria-label="mRowLabel(row)"
                :aria-pressed="mSelectedId === row.id"
                @click="mSelect(row.id)"
              >
                <span class="fd__mtype">{{ row.type }}</span>
                <span v-if="row.detail" class="fd__mdetail">{{ row.detail }}</span>
                <span class="fd__mrange">{{ row.start }}–{{ row.end }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- the same two numbers, derived two ways — 'migrate' only --------- -->
      <div
        v-if="isMigrate"
        class="fd__cmp"
        :class="`fd__cmp--${comparison.chip.tone}`"
        aria-live="polite"
      >
        <p class="fd__vh">
          Where does the routes array start and end? The same two numbers, derived two ways.
        </p>
        <template v-for="row in comparison.rows" :key="row.key">
          <span class="fd__cwho" :class="`fd__cwho--${row.key}`">{{ row.who }}</span>
          <span class="fd__chow">{{ row.how }}</span>
          <span class="fd__cnum">
            <span class="fd__ck">start</span>
            <strong :class="{ 'fd__coff': row.offStart }">{{ row.start }}</strong>
          </span>
          <span class="fd__cnum">
            <span class="fd__ck">end</span>
            <strong :class="{ 'fd__coff': row.offEnd }">{{ row.end }}</strong>
          </span>
        </template>
        <p class="fd__cchip" :class="`fd__cchip--${comparison.chip.tone}`">{{ comparison.chip.label }}</p>
      </div>
    </template>

    <!-- =================================================================
         phase 'outcome' — the result.

         One row per shape saying what the migration did to it, and the diff
         for whichever shape is loaded. One implementation, four shapes, and
         the one it skipped says why in its own words.
         ================================================================= -->
    <template v-else-if="isOutcome">
      <div class="fd__ogrid">
        <!-- LEFT: the report ------------------------------------------- -->
        <ul class="fd__oreport" aria-label="What the migration did to each shape">
          <li
            v-for="row in report"
            :key="row.key"
            class="fd__orow"
            :class="[`fd__orow--${row.outcome}`, { 'fd__orow--on': row.key === activeKey }]"
            :aria-current="row.key === activeKey ? 'true' : undefined"
          >
            <p class="fd__oline">
              <span class="fd__oname">{{ row.short }}</span>
              <span class="fd__opill" :class="`fd__opill--${row.outcome}`">{{ row.outcome }}</span>
              <span v-if="row.outcome === 'skipped'" class="fd__oby">on purpose</span>
              <span class="fd__ochanged">
                <strong>{{ row.changed === null ? '—' : row.changed }}</strong> changed lines
              </span>
            </p>
            <p class="fd__olabel">{{ row.label }}</p>
            <p v-if="row.outcome === 'migrated'" class="fd__ofacts">
              <template v-for="(fact, index) in row.facts" :key="fact.text">
                <span v-if="index" class="fd__odot" aria-hidden="true">·</span>
                <span class="fd__ofact" :class="`fd__ofact--${fact.tone}`">{{ fact.text }}</span>
              </template>
            </p>
            <p v-else class="fd__owhy">{{ row.reason }}</p>
          </li>
        </ul>

        <!-- RIGHT: the diff for the shape that is loaded ---------------- -->
        <div class="fd__odiff">
          <p class="fd__ohead" aria-live="polite">
            <span class="fd__otitle">the diff</span>
            <span class="fd__oshape">{{ activeShort }}</span>
            <!-- Zero is not a smaller number here, it is a different outcome:
                 it picks up the colour of the row that produced it. -->
            <span class="fd__ocount" :class="{ 'fd__ocount--none': diffChanged === 0 }">
              <strong>{{ diffChanged === null ? '—' : diffChanged }}</strong> changed lines
            </span>
          </p>

          <p v-if="astResult.error" class="fd__err">
            <span aria-hidden="true">✕</span>
            <span>it could not run: {{ astResult.error }}</span>
          </p>

          <pre
            v-else
            class="fd__opre"
            tabindex="0"
            role="group"
            :aria-label="`The migration's diff for the ${activeShort} shape`"
          ><code><template v-for="(row, index) in diffRows" :key="index"><span v-if="row.kind === 'gap'" class="fd__oln fd__oln--gap">⋯ {{ row.count }} lines untouched
</span><span v-else class="fd__oln" :class="`fd__oln--${row.kind}`"><span class="fd__ono">{{ row.no }}</span><span class="fd__omark">{{ row.mark }}</span>{{ row.text }}
</span></template></code></pre>
        </div>
      </div>

      <!-- the goal from beat one, as a number ------------------------- -->
      <p class="fd__ofoot">
        <span class="fd__ogoal">Without touching a single route.</span>
        <span class="fd__ostat">
          <strong>{{ totals.routes }}</strong> routes across these {{ report.length }} files
        </span>
        <span
          class="fd__ostat"
          :class="totals.touched === 0 ? 'fd__ostat--kept' : 'fd__ostat--hit'"
        >
          <strong>{{ totals.touched }}</strong> rewritten
        </span>
      </p>
    </template>

    <!-- =================================================================
         phase 'all' — the original single-slide view, unchanged
         ================================================================= -->
    <template v-else>
      <!-- three panes ----------------------------------------------------- -->
      <div class="fd__grid">
        <!-- LEFT: the editable file -->
        <div v-if="showEditor" class="fd__col" role="group" aria-label="Input file">
          <p class="fd__head">
            <span class="fd__title">the file</span>
            <span class="fd__call">{{ filename }}</span>
          </p>
          <label class="fd__editor">
            <span class="fd__vh">Router source, editable</span>
            <textarea
              v-model="source"
              class="fd__area"
              spellcheck="false"
              autocapitalize="off"
              autocomplete="off"
            ></textarea>
          </label>
        </div>

        <!-- MIDDLE + RIGHT: the two implementations -->
        <div
          v-for="col in columns"
          :key="col.key"
          class="fd__col"
          :class="`fd__col--${col.key}`"
          role="group"
          :aria-label="col.title"
        >
          <div class="fd__says" aria-live="polite">
            <p class="fd__head">
              <span class="fd__title">{{ col.title }}</span>
              <template v-if="showVerdict">
                <span class="fd__k">reports</span>
                <span class="fd__chip" :class="`fd__chip--${col.verdict.tone}`">{{ col.verdict.label }}</span>
              </template>
            </p>
            <p class="fd__sub">
              <span class="fd__call">{{ col.call }}()</span>
              <span class="fd__nodes">{{ col.result.nodeCount }} nodes</span>
            </p>
            <!-- Focusable because it can scroll: a scroll region a mouse can
                 reach and a keyboard cannot is an axe failure, and a real one. -->
            <p
              class="fd__note"
              :class="{ 'fd__note--warn': !col.result.ok && !col.result.error }"
              tabindex="0"
              role="group"
              :aria-label="`What ${col.title} says about its own run`"
            >
              {{ col.result.note }}
            </p>
          </div>

          <div v-if="col.result.error" class="fd__err">
            <span aria-hidden="true">✕</span>
            <span>it could not run: {{ col.result.error }}</span>
          </div>

          <p v-else-if="col.unchanged" class="fd__same">
            output identical to the input.<br />
            <strong>not one byte changed.</strong>
          </p>

          <pre
            v-else
            class="fd__out"
            tabindex="0"
            role="group"
            :aria-label="`Output of ${col.title}`"
          ><code><template v-for="(row, index) in col.rows" :key="index"><span v-if="row.kind === 'gap'" class="fd__row fd__row--gap">⋯ {{ row.count }} unchanged
</span><span v-else class="fd__row" :class="{ 'fd__row--changed': row.changed }"><span class="fd__n">{{ row.label }}</span>{{ row.text }}
</span></template></code></pre>

          <div
            v-if="showCheck"
            class="fd__check"
            :class="`fd__check--${col.check.state}`"
            aria-live="polite"
          >
            <p class="fd__checkline">
              <span class="fd__k">independent check</span>
              <span class="fd__checkv">{{ col.check.headline }}</span>
            </p>
            <p class="fd__checkd">{{ col.check.detail }}</p>
          </div>
        </div>
      </div>

      <!-- the one question at the bottom ---------------------------------- -->
      <p v-if="showStrip" class="fd__strip" aria-live="polite">
        <span class="fd__q">does the output still parse?</span>
        <span
          v-for="col in columns"
          :key="col.key"
          class="fd__ans"
          :class="col.parses ? 'fd__ans--yes' : 'fd__ans--no'"
        >
          <span class="fd__anslabel">{{ col.title }}</span>
          <strong>{{ col.parses ? 'yes' : 'no' }}</strong>
        </span>
      </p>

      <!-- the anatomy, folded away ---------------------------------------- -->
      <div v-if="showTree" class="fd__tree">
        <button
          type="button"
          class="fd__disclose"
          :aria-expanded="treeOpen"
          :aria-controls="treePanelId"
          @click="treeOpen = !treeOpen"
        >
          <span class="fd__caret" aria-hidden="true">{{ treeOpen ? '▾' : '▸' }}</span>
          the tree
          <span class="fd__treecount">{{ treeNodeCount }} nodes</span>
        </button>

        <div v-show="treeOpen" :id="treePanelId" class="fd__treepanel">
          <p class="fd__treenote">
            acorn speaks JavaScript, so <code>import type</code>, <code>as T[]</code> and
            <code>: T[]</code> come out first — ranges are offsets into that stripped text.
          </p>
          <p v-if="!treeRoot" class="fd__err">
            <span aria-hidden="true">✕</span>
            <span>it could not parse: {{ treeParse.error ?? 'unknown error' }}</span>
          </p>
          <ul v-else class="fd__treelist">
            <li
              v-for="row in treeRows"
              :key="row.id"
              :style="{ paddingLeft: `${row.depth * 0.8}rem` }"
            >
              <button
                v-if="row.hasChildren"
                type="button"
                class="fd__twist"
                :aria-expanded="row.open"
                @click="toggleNode(row.id, row.depth)"
              >
                <span aria-hidden="true">{{ row.open ? '▾' : '▸' }}</span>
                <span class="fd__vh">{{ row.open ? 'Collapse' : 'Expand' }} {{ row.type }}</span>
              </button>
              <span v-else class="fd__twist fd__twist--leaf" aria-hidden="true">·</span>
              <span class="fd__ttype">{{ row.type }}</span>
              <span v-if="row.detail" class="fd__tdetail">{{ row.detail }}</span>
              <span class="fd__trange">{{ row.start }}–{{ row.end }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/*
 * Self-contained: every custom property is read with a literal fallback so the
 * component survives without the deck's style.css.
 *
 * Sizes are in px against Slidev's 980×552 design space, which is then scaled
 * to the projector. 15px is the floor for anything a room has to read. The
 * <pre> rules carry !important because the deck's global
 * `.slidev-layout pre { font-size: … !important }` would otherwise blow the
 * three-column layout apart; the scoped attribute wins on specificity.
 */
.fd {
  /* Definite height, not 100%: the slide's content box is auto-height, so a
     percentage never resolves and the inner flex chain grows unbounded. */
  height: 470px;
  max-height: 470px;
  --fd-panel: var(--panel, #171a21);
  --fd-text: var(--text, #e9ecef);
  --fd-dim: var(--dim, #adb5bd);
  --fd-blue: var(--blue, #74c0fc);
  --fd-yellow: var(--yellow, #ffd43b);
  --fd-red: var(--red, #ff8787);
  --fd-green: var(--green, #69db7c);
  --fd-purple: var(--purple, #b197fc);
  --fd-border: var(--border, #39404d);
  --fd-well: #0d1015;
  --fd-mono: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow: hidden;
  color: var(--fd-text);
}

.fd__vh {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ---- controls ---- */
.fd__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  flex-wrap: wrap;
}
.fd__fixtures {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.fd__fx {
  background-color: #11141a;
  color: var(--fd-text);
  border: 1px solid var(--fd-border);
  border-radius: 5px;
  padding: 3px 9px;
  font-size: 15px;
  line-height: 1.3;
  cursor: pointer;
  white-space: nowrap;
}
.fd__fx:hover,
.fd__fx:focus-visible {
  border-color: var(--fd-blue);
}
.fd__fx--on {
  background-color: #1c3247;
  border-color: var(--fd-blue);
  color: var(--fd-blue);
  font-weight: 700;
}
.fd__caption {
  margin: 0;
  font-size: 15px;
  line-height: 1.3;
  color: var(--fd-dim);
}
.fd__caption--edited {
  color: var(--fd-yellow);
  font-weight: 700;
}
.fd__reset {
  margin-left: auto;
  flex: none;
  background-color: #1d222b;
  color: var(--fd-text);
  border: 1px solid var(--fd-border);
  border-radius: 5px;
  padding: 3px 14px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  cursor: pointer;
}
.fd__reset:hover,
.fd__reset:focus-visible {
  background-color: #262d38;
  border-color: var(--fd-blue);
}

/* ---- the three panes ---- */
.fd__grid {
  display: grid;
  grid-template-columns: 1fr 1.08fr 1.08fr;
  gap: 7px;
  flex: 1;
  min-height: 0;
}
.fd__col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 5px 7px 6px;
}
.fd__col--ast {
  border-color: #2f4a63;
}
.fd__head {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
  flex-wrap: wrap;
}
.fd__title {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
}
.fd__col--ast .fd__title {
  color: var(--fd-blue);
}
.fd__sub {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
  margin: 0;
}
.fd__call,
.fd__nodes {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
}
/* Label, not prose: 13px is the floor and only these three words sit on it. */
.fd__k {
  font-size: 13px;
  line-height: 1.25;
  color: var(--fd-dim);
}

/* ---- the editor ---- */
.fd__editor {
  display: flex;
  flex: 1;
  min-height: 0;
  /* Contains the visually-hidden label so it cannot escape the panel box. */
  position: relative;
}
.fd__area {
  flex: 1;
  width: 100%;
  min-height: 0;
  resize: none;
  border: 1px solid var(--fd-border);
  border-radius: 6px;
  background-color: var(--fd-well);
  color: var(--fd-text);
  font-family: var(--fd-mono);
  font-size: 15px;
  line-height: 1.45;
  padding: 5px 7px;
  overflow: auto;
  /* Wrap rather than truncate: the hazard lives at the end of a long line. */
  white-space: pre-wrap;
  tab-size: 2;
}
.fd__area:focus-visible {
  outline: 2px solid var(--fd-blue);
  outline-offset: 1px;
}

/* ---- what the tool says about itself ---- */
.fd__says {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: none;
}
.fd__chip {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  border-radius: 999px;
  padding: 1px 10px;
  border: 1px solid transparent;
}
.fd__chip--good {
  background-color: #14301c;
  border-color: var(--fd-green);
  color: var(--fd-green);
}
.fd__chip--warn {
  background-color: #332b12;
  border-color: var(--fd-yellow);
  color: var(--fd-yellow);
}
.fd__chip--bad {
  background-color: #35181b;
  border-color: var(--fd-red);
  color: var(--fd-red);
}
.fd__note {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  color: var(--fd-dim);
  /* Three lines holds the longest note either tool can produce — the parser's
     "array bounds … came from the parse, not a tally; moved …" — whole. */
  max-height: 3.9em;
  overflow: auto;
}
.fd__note:focus-visible {
  outline: 2px solid var(--fd-blue);
  outline-offset: 1px;
}
.fd__note--warn {
  color: var(--fd-yellow);
  font-weight: 700;
}

/* ---- the output ---- */
.fd__out {
  margin: 0;
  flex: 1;
  min-height: 2.6rem;
  overflow: auto;
  border: 1px solid var(--fd-border);
  border-radius: 6px;
  background-color: var(--fd-well);
  padding: 4px 6px;
  font-family: var(--fd-mono);
  /* Beats the deck-level `.slidev-layout pre { font-size: … !important }`. */
  font-size: 15px !important;
  line-height: 1.45 !important;
  /* Wrapped, not truncated: a cut-off declaration hides the whole point. */
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: var(--fd-text);
}
.fd__out:focus-visible {
  outline: 2px solid var(--fd-blue);
  outline-offset: 1px;
}
/* The deck's global `code { color: var(--yellow) }` would otherwise paint
   every unchanged output line as a warning. */
.fd__out code {
  color: inherit;
  font-size: inherit;
}

/* An output nobody wrote to. Stated, not re-printed. */
.fd__same {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  border: 1px dashed var(--fd-border);
  border-radius: 6px;
  background-color: var(--fd-well);
  padding: 6px 9px;
  font-size: 15px;
  line-height: 1.4;
  color: var(--fd-dim);
}
.fd__same strong {
  font-size: 17px;
  font-weight: 700;
  color: var(--fd-text);
}
.fd__row {
  display: block;
  padding-left: 2.4em;
  text-indent: -2.4em;
}
.fd__n {
  display: inline-block;
  width: 1.8em;
  padding-right: 0.6em;
  text-align: right;
  color: #7d8794;
  user-select: none;
}
/* Neutral, not green: on the hazard fixtures the changed line is the damage. */
.fd__row--changed {
  background-color: rgba(116, 192, 252, 0.16);
  color: #d8ecff;
}
.fd__row--changed .fd__n {
  color: var(--fd-blue);
  font-weight: 700;
}
.fd__row--gap {
  color: var(--fd-dim);
  font-style: italic;
  padding-left: 2.4em;
  text-indent: 0;
}

/* ---- the independent check ---- */
.fd__check {
  flex: none;
  border-left: 4px solid var(--fd-border);
  padding: 1px 0 0 7px;
}
.fd__checkline {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  margin: 0;
}
.fd__checkv {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}
.fd__checkd {
  margin: 0;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
}
.fd__check--present {
  border-left-color: var(--fd-green);
}
.fd__check--present .fd__checkv {
  color: var(--fd-green);
}
.fd__check--pending {
  border-left-color: var(--fd-yellow);
}
.fd__check--pending .fd__checkv {
  color: var(--fd-yellow);
}
.fd__check--gone {
  border-left-color: var(--fd-red);
  background-color: rgba(255, 135, 135, 0.12);
}
.fd__check--gone .fd__checkv {
  color: var(--fd-red);
  font-size: 19px;
}
.fd__check--none .fd__checkv {
  color: var(--fd-dim);
}

/* ---- error inside a panel ---- */
.fd__err {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--fd-red);
  border-radius: 6px;
  background-color: rgba(255, 135, 135, 0.12);
  color: var(--fd-red);
  font-size: 14px;
  line-height: 1.35;
  padding: 5px 7px;
}

/* ---- the one question ---- */
.fd__strip {
  display: grid;
  grid-template-columns: 1fr 1.08fr 1.08fr;
  gap: 7px;
  align-items: center;
  flex: none;
  margin: 0;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 3px 9px;
}
.fd__q {
  font-size: 21px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.fd__ans {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.fd__anslabel {
  font-size: 15px;
  color: var(--fd-dim);
}
.fd__ans strong {
  font-size: 21px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.2;
}
.fd__ans--yes strong {
  color: var(--fd-green);
}
.fd__ans--no strong {
  color: var(--fd-red);
}

/* ---- the tree ---- */
.fd__tree {
  flex: none;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  overflow: hidden;
}
.fd__disclose {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  width: 100%;
  background-color: transparent;
  border: 0;
  color: var(--fd-text);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
  padding: 3px 9px;
  cursor: pointer;
}
.fd__disclose:hover,
.fd__disclose:focus-visible {
  background-color: #1d222b;
}
.fd__caret {
  color: var(--fd-blue);
}
.fd__treecount {
  margin-left: auto;
  font-family: var(--fd-mono);
  font-size: 14px;
  color: var(--fd-purple);
  font-weight: 700;
}
/*
 * The panel itself never scrolls and never grows: its note is one line and the
 * row list below carries the only scrollbar in the component.
 */
.fd__treepanel {
  border-top: 1px solid var(--fd-border);
  padding: 4px 9px 5px;
  overflow: hidden;
}
/*
 * Opening the tree takes its space from the grid. Rather than let the columns
 * clip their own conclusions, they compact: the function name and node count
 * step aside, the self-report shortens, and the output pane gives up its
 * floor. The chip and the check line — the two things being compared — are
 * never cut off.
 */
.fd--treeopen .fd__sub {
  display: none;
}
.fd--treeopen .fd__out,
.fd--treeopen .fd__same,
.fd--treeopen .fd__err {
  min-height: 2.1rem;
}
/* One line at the floor size, so the caveat costs a row and not a paragraph. */
.fd__treenote {
  margin: 0 0 3px;
  font-size: 13px;
  line-height: 1.3;
  color: var(--fd-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fd__treenote code {
  font-family: var(--fd-mono);
  font-size: 13px;
  color: var(--fd-yellow);
}
/*
 * The one scroll region the deck allows itself: an AST is arbitrarily deep and
 * every twist is expandable. Four rows, at a fixed height, so opening the tree
 * costs the columns a known amount and never a variable one.
 */
.fd__treelist {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 79px;
  overflow: auto;
  /* Containing block for the twists' visually-hidden labels: without it they
     resolve against the page and paint below the slide. */
  position: relative;
}
.fd__treelist li {
  display: flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
}
.fd__twist {
  flex: none;
  position: relative;
  width: 16px;
  background-color: transparent;
  border: 0;
  color: var(--fd-dim);
  font-size: 14px;
  line-height: 1.4;
  padding: 0;
  text-align: center;
  cursor: pointer;
}
.fd__twist:hover,
.fd__twist:focus-visible {
  color: var(--fd-blue);
}
.fd__twist--leaf {
  cursor: default;
  color: #5d6673;
}
.fd__ttype {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.4;
  color: var(--fd-text);
}
.fd__tdetail {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.4;
  color: var(--fd-blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fd__trange {
  margin-left: auto;
  flex: none;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.4;
  color: var(--fd-dim);
}

/* ===========================================================================
 * The phases.
 *
 * Same panels, fewer of them, on a shorter slide: these slides carry an <h1>,
 * so the box is 385px rather than 470px. The room that buys goes into the
 * panels that remain — code a size up, more padding, and in 'migrate' a tree
 * that is worth opening.
 * ======================================================================== */
.fd--migrate,
.fd--plain,
.fd--outcome {
  /* Definite, for the same reason as above: a percentage never resolves here. */
  height: 385px;
  max-height: 385px;
  gap: 7px;
}

/* ===========================================================================
 * phases: plain and migrate — the file and the tree
 *
 * Vertical budget, against the 385px a slide with an <h1> leaves:
 *
 *   bar                28 + 7 gap
 *   grid                     flex 1
 *   comparison strip   ~58 + 7 gap     ← 'migrate' only
 *
 * The two panes below the bar are the same height by construction, and the
 * only two scrollers in either phase are the source pane and the tree list.
 * 'plain' has no strip, so its panes are ~65px taller; the block at the very
 * bottom of this sheet spends that.
 * ======================================================================== */
.fd--migrate .fd__meta,
.fd--plain .fd__meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 0 6px;
}
.fd__file {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.3;
  color: var(--fd-dim);
}
.fd__mcount {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.3;
  font-weight: 700;
  color: var(--fd-purple);
}

.fd__mgrid {
  display: grid;
  /*
   * The file gets the width. At 14px this pane fits ~56 characters, which is
   * every line of every fixture except the three `component: () => import(…)`
   * lines — and those wrap rather than truncate, because a hazard hiding past
   * the right edge of a source pane is the one thing this must not do.
   * The tree still clears its longest row, `ExportDefaultDeclaration 411–432`.
   */
  grid-template-columns: 1.5fr 1fr;
  gap: 9px;
  flex: 1;
  min-height: 0;
}
.fd__mcol {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 5px 6px 6px;
}
.fd__mcol--tree {
  border-color: #2f4a63;
  padding: 5px 3px 6px 6px;
}

/* ---- the readout: the arithmetic, out loud, in one line ---- */
.fd__read {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex: none;
  margin: 0;
  min-width: 0;
}
.fd__rtype {
  flex: none;
  font-family: var(--fd-mono);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--fd-blue);
  /* Long type names give way before the numbers do: the selected tree row
     spells the name out in full a few inches to the right. */
  max-width: 36%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fd__rnums {
  flex: none;
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
  white-space: nowrap;
}
.fd__rnums strong {
  font-family: var(--fd-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--fd-yellow);
}
.fd__rdot {
  padding: 0 4px;
}
/*
 * The arithmetic, out loud, and never clipped: these two numbers and this call
 * are the claim. Nothing else is needed to close the loop — the type is blue,
 * the call is right above the band, and the band is the only blue run in the
 * file. The prose version of this sentence lives on <AstInspector>'s slide.
 */
.fd__rarrow {
  flex: none;
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-blue);
}
.fd__rcall {
  flex: none;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-text);
  white-space: nowrap;
}
/* The standing invitation, when nothing is selected. */
.fd__rsay {
  min-width: 0;
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- the source: two layers, one box ----
 *
 * The <pre> paints; the <textarea> takes the typing and owns the caret. They
 * must lay text out identically, so both use the same font, the same 20px line
 * box, the same wrapping mode and the same 38px left inset — the pre reaches it
 * with a hanging indent so wrapped lines land where the textarea puts them.
 * The editor is the only scroller; the paint layer follows it.
 */
.fd__src {
  position: relative;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--fd-border);
  border-radius: 6px;
  background-color: var(--fd-well);
  overflow: hidden;
}
.fd__src:focus-within {
  outline: 2px solid var(--fd-blue);
  outline-offset: 1px;
}
.fd__paint,
.fd__edit {
  position: absolute;
  inset: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
  font-family: var(--fd-mono);
  /* Beats the deck-level `.slidev-layout pre { font-size: … !important }`. */
  font-size: 14px !important;
  /* An exact pixel line box, not a ratio: the two layers must never round to
     different heights, and a 20px grid is what the reveal maths assumes. */
  line-height: 20px !important;
  letter-spacing: normal;
  tab-size: 2;
  white-space: pre-wrap;
  /* Break at spaces only. `break-word` is the one setting that could make the
     two layers wrap differently, and Chrome's UA stylesheet sets it on
     textareas — so it is turned off explicitly on both. */
  overflow-wrap: normal;
  word-break: normal;
}
.fd__paint {
  overflow: hidden;
  padding: 6px;
  color: var(--fd-text);
}
.fd__paint code {
  color: inherit;
  font-size: inherit;
}
.fd__pl {
  display: block;
  /* Hanging indent: the number sits in the first line's negative indent, and
     every wrapped continuation starts at 24px — the textarea's text column. */
  padding-left: 24px;
  text-indent: -24px;
  min-height: 20px;
}
.fd__pno {
  display: inline-block;
  width: 24px;
  padding-right: 7px;
  text-align: right;
  color: #7d8794;
  user-select: none;
}
/* Vertical padding on an inline element paints without reflowing, so a band is
   taller than its glyphs and nothing moves when it appears. */
.fd__seg {
  padding: 2px 0;
}
/* The parser's answer: the node you selected, exactly. */
.fd__seg--sel {
  background-color: rgba(116, 192, 252, 0.3);
  color: #ffffff;
}
/* The counter's answer, underlined rather than filled — when the two agree it
   runs the whole length of the blue band, and when they do not you can see
   precisely where it gave up. */
.fd__seg--tally {
  box-shadow: inset 0 -2px 0 var(--fd-red);
}
.fd__seg--tally:not(.fd__seg--sel) {
  background-color: rgba(255, 135, 135, 0.14);
}
/* One character: the `]` the tally stopped on when it stopped in the wrong
   place. This is the glyph the example exists for. */
.fd__seg--stop {
  background-color: rgba(255, 135, 135, 0.5);
  color: #ffffff;
  font-weight: 700;
  box-shadow: inset -2px 0 0 var(--fd-red), inset 0 -2px 0 var(--fd-red);
}
.fd__edit {
  /* 6px of pane padding plus the 24px number column. */
  padding: 6px 6px 6px 30px;
  resize: none;
  overflow: auto;
  /* The glyphs come from the layer underneath; this element contributes the
     caret and the selection. */
  color: transparent;
  caret-color: var(--fd-yellow);
  /* No scrollbar: one would narrow the text column on this layer only, and the
     two layers would stop wrapping in the same places. The textarea still
     scrolls with the mouse wheel and with the caret. */
  scrollbar-width: none;
}
.fd__edit::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.fd__edit::selection {
  background-color: rgba(255, 212, 59, 0.3);
}
.fd__edit:focus-visible {
  outline: none;
}

/* ---- the tree ---- */
.fd__mlist {
  margin: 0;
  padding: 0 3px 0 0;
  list-style: none;
  flex: 1;
  min-height: 0;
  overflow: auto;
  /* Containing block for the twists' visually-hidden labels: without one they
     resolve against the page and paint below the slide. */
  position: relative;
}
.fd__mli {
  display: flex;
  align-items: baseline;
  gap: 3px;
  min-width: 0;
}
.fd__mtwist {
  flex: none;
  position: relative;
  width: 15px;
  background-color: transparent;
  border: 0;
  color: var(--fd-dim);
  font-size: 14px;
  line-height: 1.42;
  padding: 0;
  text-align: center;
  cursor: pointer;
}
.fd__mtwist:hover,
.fd__mtwist:focus-visible {
  color: var(--fd-blue);
}
/* Quieter than a twist and still 5.6:1 on the panel — the build measures the
   contrast of every rendered text node, decorative or not. */
.fd__mtwist--leaf {
  cursor: default;
  color: #8a939f;
}
.fd__mrow {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex: 1;
  min-width: 0;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  padding: 0 5px 0 3px;
  text-align: left;
  cursor: pointer;
  color: var(--fd-text);
}
.fd__mrow:hover {
  background-color: #1e2531;
}
.fd__mrow:focus-visible {
  outline: 2px solid var(--fd-blue);
  outline-offset: -1px;
}
.fd__mrow--on {
  background-color: #1c3247;
}
.fd__mtype {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.42;
  white-space: nowrap;
}
.fd__mrow--on .fd__mtype {
  font-weight: 700;
  color: var(--fd-blue);
}
.fd__mdetail {
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.42;
  color: var(--fd-green);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fd__mrange {
  margin-left: auto;
  flex: none;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.42;
  color: var(--fd-dim);
}
.fd__mrow--on .fd__mrange {
  color: var(--fd-yellow);
}

/* ---- the same two numbers, derived two ways ---- */
.fd__cmp {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: baseline;
  column-gap: 12px;
  row-gap: 1px;
  flex: none;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 4px 10px 5px;
}
.fd__cmp--bad {
  border-color: #6b3438;
}
.fd__cwho {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}
.fd__cwho--ast {
  color: var(--fd-blue);
}
.fd__chow {
  min-width: 0;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.3;
  color: var(--fd-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fd__cnum {
  display: flex;
  align-items: baseline;
  gap: 6px;
  justify-self: end;
}
.fd__ck {
  font-size: 14px;
  line-height: 1.3;
  color: var(--fd-dim);
}
.fd__cnum strong {
  min-width: 2.4em;
  text-align: right;
  font-family: var(--fd-mono);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--fd-yellow);
}
/* Only the number that actually differs is painted as damage. */
.fd__cnum strong.fd__coff {
  color: var(--fd-red);
}
.fd__cchip {
  grid-column: 5;
  grid-row: 1 / span 2;
  align-self: center;
  justify-self: end;
  margin: 0;
  min-width: 158px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  border-radius: 999px;
  padding: 2px 12px;
  border: 1px solid transparent;
}
.fd__cchip--good {
  background-color: #14301c;
  border-color: var(--fd-green);
  color: var(--fd-green);
}
.fd__cchip--warn {
  background-color: #332b12;
  border-color: var(--fd-yellow);
  color: var(--fd-yellow);
}
.fd__cchip--bad {
  background-color: #35181b;
  border-color: var(--fd-red);
  color: var(--fd-red);
}

/* ===========================================================================
 * phase: outcome — the result
 *
 * Vertical budget, against the 385px a slide with an <h1> leaves:
 *
 *   bar                 33 + 7 gap
 *   grid                      flex 1     ← report | diff
 *   the payoff line     33 + 7 gap
 *
 * The report is four equal rows that fill their column, each one three lines
 * of text that are all `nowrap`: a row that wrapped would take its height out
 * of the row below it, and there is no slack here to absorb that.
 * ======================================================================== */
.fd--outcome .fd__fx {
  font-size: 16px;
  padding: 5px 12px;
}

.fd__ogrid {
  display: grid;
  /* The report sets this split. Its longest line — the three facts, with a
     type name in the first of them — needs ~400px at 14px; the diff needs
     ~340 for `const routes: RouteRecordRaw[] = [` plus its gutter. */
  grid-template-columns: 1.08fr 1fr;
  gap: 9px;
  flex: 1;
  min-height: 0;
}

/* ---- the report: one row per shape ---- */
.fd__oreport {
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-height: 0;
  min-width: 0;
}
.fd__orow {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  /* The deck indents list items. These are panels, not bullets, and the ~19px
     it takes is 19px the facts line does not have. */
  margin: 0;
  border: 1px solid var(--fd-border);
  /* The left edge carries the outcome, so the four rows are readable as a
     column before a single word of any of them has been read. */
  border-left: 4px solid #2f4a63;
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 4px 11px 5px;
}
/* Attention, not damage. Skipping this shape is the behaviour we asked for. */
.fd__orow--skipped {
  border-left-color: var(--fd-yellow);
}
/* Selection is an inset ring rather than a border colour, so it can never
   argue with the outcome edge on the left. */
.fd__orow--on {
  background-color: #1a2029;
  box-shadow: inset 0 0 0 1px var(--fd-blue);
}

.fd__oline {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  min-width: 0;
  /* The strut, not the type: the deck's 17.6px base would set a line box four
     pixels taller than anything actually on this line. */
  font-size: 14px;
  line-height: 1.25;
}
.fd__oname {
  flex: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.fd__orow--on .fd__oname {
  color: var(--fd-blue);
}
.fd__opill {
  flex: none;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  border-radius: 999px;
  padding: 1px 10px;
  border: 1px solid transparent;
}
/* Blue, not green: this is a statement of what happened, not a pass mark. */
.fd__opill--migrated {
  background-color: #16283a;
  border-color: var(--fd-blue);
  color: var(--fd-blue);
}
.fd__opill--skipped {
  background-color: #332b12;
  border-color: var(--fd-yellow);
  color: var(--fd-yellow);
}
.fd__oby {
  flex: none;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--fd-yellow);
}
.fd__ochanged {
  margin-left: auto;
  flex: none;
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
  white-space: nowrap;
}
.fd__ochanged strong {
  font-family: var(--fd-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--fd-text);
}

.fd__olabel,
.fd__ofacts,
.fd__owhy {
  margin: 0;
  min-width: 0;
  font-size: 14px;
  line-height: 1.3;
  /* Fixed height per row is the whole layout. Nothing here may wrap. */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fd__olabel {
  color: var(--fd-dim);
}
.fd__ofacts {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--fd-text);
}
.fd__ofact {
  flex: none;
}
.fd__ofact--warn {
  color: var(--fd-yellow);
  font-weight: 700;
}
.fd__odot {
  flex: none;
  color: var(--fd-dim);
}
/* The refusal, in the tool's own words. Yellow, because it is the feature. */
.fd__owhy {
  color: var(--fd-yellow);
}

/* ---- the diff for the shape that is loaded ---- */
.fd__odiff {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #2f4a63;
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 5px 8px 6px;
}
.fd__ohead {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: none;
  margin: 0;
  min-width: 0;
  font-size: 14px;
  line-height: 1.25;
}
.fd__otitle {
  flex: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}
.fd__oshape {
  min-width: 0;
  font-family: var(--fd-mono);
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fd__ocount {
  margin-left: auto;
  flex: none;
  font-size: 14px;
  line-height: 1.25;
  color: var(--fd-dim);
  white-space: nowrap;
}
.fd__ocount strong {
  font-family: var(--fd-mono);
  font-size: 17px;
  font-weight: 700;
  color: var(--fd-text);
}
.fd__ocount--none strong {
  color: var(--fd-yellow);
}
.fd__opre {
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--fd-border);
  border-radius: 6px;
  background-color: var(--fd-well);
  padding: 4px 7px;
  font-family: var(--fd-mono);
  /* Beats the deck-level `.slidev-layout pre { font-size: … !important }`.
     19px is not a ratio: the tallest of the four shapes — the one whose
     comment wraps — is thirteen line boxes, and thirteen of these clear the
     pane. Change the elision rules and re-measure this number. */
  font-size: 15px !important;
  line-height: 19px !important;
  /* Wrapped, not truncated: a hazard past the right edge is the one thing a
     result pane must never do. */
  white-space: pre-wrap;
  overflow-wrap: normal;
  /* Context recedes; the two lines the migration wrote do not. */
  color: var(--fd-dim);
}
.fd__opre code {
  color: inherit;
  font-size: inherit;
}
.fd__opre:focus-visible {
  outline: 2px solid var(--fd-blue);
  outline-offset: 1px;
}
/*
 * Hanging indent: 2.1em of line number, 0.8em of marker, and a wrapped
 * continuation that lands in the same column the code starts in.
 *
 * Two things the deck's reset makes non-obvious, and both of them are silent
 * when you get them wrong:
 *
 *   · `box-sizing: border-box` is global, so the number's 0.5em of air is
 *     INSIDE its 2.1em, not added to it. The two gutter boxes have to sum to
 *     the 2.9em the indent pulls back, or every wrapped line sits off-column.
 *   · `text-indent` inherits, and an inline-block is a block container — so
 *     these two spans would each indent their own contents by -2.9em and
 *     throw the marker glyph off the left of the pane.
 */
.fd__oln {
  display: block;
  padding-left: 2.9em;
  text-indent: -2.9em;
}
.fd__ono {
  display: inline-block;
  width: 2.1em;
  padding-right: 0.5em;
  text-indent: 0;
  text-align: right;
  color: #7d8794;
  user-select: none;
}
.fd__omark {
  display: inline-block;
  width: 0.8em;
  text-indent: 0;
  user-select: none;
}
/* The line the migration wrote. Blue is the parser's colour in this deck; a
   green `+` against a red `-` would grade a diff that has no wrong side. */
.fd__oln--add {
  background-color: rgba(116, 192, 252, 0.16);
  color: #d8ecff;
}
.fd__oln--add .fd__ono,
.fd__oln--add .fd__omark {
  color: var(--fd-blue);
  font-weight: 700;
}
/* The line that went in. Full strength — half of "was this, is now that". */
.fd__oln--del {
  color: var(--fd-text);
}
.fd__oln--del .fd__omark {
  color: var(--fd-yellow);
  font-weight: 700;
}
.fd__oln--gap {
  display: block;
  color: var(--fd-dim);
  font-style: italic;
  padding-left: 2.9em;
  text-indent: 0;
}

/* ---- the goal from beat one, as a number ---- */
.fd__ofoot {
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex: none;
  margin: 0;
  border: 1px solid var(--fd-border);
  border-radius: 8px;
  background-color: var(--fd-panel);
  padding: 3px 12px 4px;
  font-size: 15px;
  line-height: 1.3;
}
.fd__ogoal {
  margin-right: auto;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.fd__ostat {
  font-size: 15px;
  line-height: 1.3;
  color: var(--fd-dim);
  white-space: nowrap;
}
.fd__ostat strong {
  font-family: var(--fd-mono);
  font-size: 21px;
  font-weight: 700;
  color: var(--fd-text);
}
/* The one number on this slide that is allowed to be a verdict, because it is
   the goal restated: zero routes came out different from how they went in. */
.fd__ostat--kept strong {
  color: var(--fd-green);
}
.fd__ostat--hit strong {
  color: var(--fd-red);
}

/* ===========================================================================
 * phase: plain — the starting point
 *
 * Same two panes as 'migrate' with the strip taken off the bottom, and that
 * ~65px spent rather than left as air:
 *
 *              migrate            plain
 *   source     14px / 20px box    15px / 22px box, ~13.7 lines up from ~11.9
 *   tree       14px / 20px row    15px / 22px row
 *   panes      5/6px padding      7/9px padding
 *
 * The line box is the one number that is not free: the paint layer and the
 * textarea must lay text out identically, and `lineBox` in the script snaps
 * the reveal onto the same grid. Change one, change both.
 * ======================================================================== */
.fd--plain .fd__mgrid {
  /*
   * A shade narrower on the left than 'migrate', because the tree grew a point
   * and its longest row — `ExportDefaultDeclaration 411–432` — is what sets
   * this column. The source pane still clears 49 characters, which is the
   * longest line any fixture has that is not one of the three
   * `component: () => import(…)` lines, and those wrap as they always did.
   */
  grid-template-columns: 1.44fr 1fr;
  gap: 10px;
}
.fd--plain .fd__mcol {
  gap: 6px;
  padding: 7px 9px 8px;
}
.fd--plain .fd__mcol--tree {
  padding: 7px 3px 8px 6px;
}

/* ---- the readout ----
 * A caption, not a panel: it keeps 'migrate's type scale so that the two
 * panels can have the extra width. What it does gain is a way to give: the
 * type name may now shrink and ellipsize under pressure, so a long name on a
 * pasted file can never push `source.slice(a, b)` onto a second line. The
 * selected tree row spells the name out in full a few inches to the right. */
.fd--plain .fd__rtype {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 40%;
}

/* ---- the source ----
 * The number column is widened along with the type: at 15px two digits are
 * ~18px wide, and a number that overflows its inline-block would push the
 * first line of text out of step with the textarea underneath it. */
.fd--plain .fd__paint,
.fd--plain .fd__edit {
  font-size: 15px !important;
  line-height: 22px !important;
}
.fd--plain .fd__pl {
  padding-left: 28px;
  text-indent: -28px;
  min-height: 22px;
}
.fd--plain .fd__pno {
  width: 28px;
  padding-right: 8px;
}
.fd--plain .fd__edit {
  /* 6px of pane padding plus the 28px number column. */
  padding-left: 34px;
}

/* ---- the tree ----
 * A point larger, and the row's chrome trimmed to pay for it: at 15px the
 * longest row needs ~13px more than 'migrate' leaves it, and a row that
 * overflows drops the end of its range off the right edge — which is the one
 * number on this slide that has to be readable. */
.fd--plain .fd__mtwist {
  width: 16px;
  font-size: 15px;
  line-height: 1.47;
}
.fd--plain .fd__mli {
  gap: 2px;
}
.fd--plain .fd__mlist {
  padding-right: 0;
}
.fd--plain .fd__mrow {
  gap: 6px;
  padding: 0 3px 0 2px;
}
.fd--plain .fd__mtype,
.fd--plain .fd__mdetail,
.fd--plain .fd__mrange {
  font-size: 15px;
  line-height: 1.47;
}
</style>
