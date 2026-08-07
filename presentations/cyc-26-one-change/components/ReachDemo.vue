<script setup lang="ts">
/**
 * REACH — example two, over markup.
 *
 * A graded arena. Pick a fixture, edit it live if you want, and watch two
 * implementations of the same change argue with each other:
 *
 *   text tool        — one regular expression over the file as text
 *   template parser  — @vue/compiler-sfc, walking the template AST
 *
 * Nothing in the grid is authored. Every cell is `gradeVueFixtures()` running
 * both implementations over the fixture as it currently stands (including the
 * speaker's live edits) and grading the OUTPUT with an independent verifier.
 * If the regex accidentally gets one right, the grid turns that cell green —
 * which is the only reason the red ones mean anything.
 *
 * Deterministic: no clocks, no randomness, no Slidev click bindings. Driven by
 * its own buttons, resettable at any point.
 *
 * The demo is too much for one slide, so `phase` splits it up. The arena, the
 * diffs and the survived list all read the same computed state.
 *
 *   all      — everything, one slide (unchanged)
 *   plain    — THE STARTING POINT: the file, its tree, and the element readout
 *   migrate  — the TEMPLATE TREE, and the two questions you can ask an element
 *   outcome  — THE RESULT: what OUR migration did to each of the five shapes
 *
 * `outcome` is beat four, and there is no second implementation on it. The
 * question it answers is the one beat one asked — "add one class to specific
 * elements, change nothing else" — across the five shapes beat two showed, and
 * the only tool in the room is the code from beat three. So there is no column
 * to compare against, no verdict and no score: each row says what happened to
 * that shape, which for two of the five is that the correct action was to leave
 * something exactly where it was. Both halves of every row are read off a live
 * run of `vueTagClasses()` — the count from its edit list, the note from a
 * parse of the same source — so a live edit rewrites them.
 *
 * `plain` is the beat-two slide the deck actually runs. It is deliberately not
 * an argument: a component, its template tree, and — when you click a node —
 * the element that owns it, its range, and the attribute list it holds, each
 * attribute with a range of its own. That single observation is the whole beat,
 * so the two questions, the disagreement pill and the diff are all absent and
 * the room they took goes to the source and the tree.
 *
 * `migrate` is the older, louder version of the same beat, kept as a stage
 * fallback. It teaches REACH rather than showing two diffs. The tree is the
 * star: an element node OWNS its attribute list, so
 *
 *     "does this element have class h1"
 *
 * is a LOOKUP on that list. The text tool cannot do a lookup — it can only ask
 * "does the string h1 appear near here", and `class="my-h1"` answers yes. Both
 * questions are put to the SAME element, live, and the answers are computed:
 * nothing in that panel is authored per fixture.
 */
import { computed, reactive, ref } from 'vue'
import AstInspector from './AstInspector.vue'
import { changedLineCount, collapse, diffLines } from '../utils/diff'
import { parseVueTemplate } from '../utils/ast'
import type { TemplateParseResult, TreeNode } from '../utils/ast'
import {
  TARGET_TAGS,
  TARGET_TAG_LIST,
  VUE_FIXTURES,
  gradeVueFixtures,
  hasExactClass,
  substringTraps,
  vueSurvived,
  vueTagClasses,
  vueTagClassesRegex,
} from '../utils/transforms'
import type { TransformResult, VueFixture, VueGrade } from '../utils/transforms'

type EngineKey = 'regex' | 'ast'
type Phase = 'all' | 'migrate' | 'outcome' | 'plain'

const props = withDefaults(
  defineProps<{
    /** Defaults to every fixture in the library, control included. */
    fixtures?: VueFixture[]
    /** Unchanged lines kept either side of a change in the diffs. */
    context?: number
    /** Which half of the demo this slide shows. `all` is the original slide. */
    phase?: Phase
  }>(),
  { fixtures: () => VUE_FIXTURES, context: 0, phase: 'all' },
)

/** The editable source and BOTH engine panes. The original one-slide demo. */
const showEngines = computed(() => props.phase === 'all')
/** The template tree, the two questions, and one engine's diff. */
const showTree = computed(() => props.phase === 'migrate')
/** The starting point: the same file and tree, with nothing to argue about. */
const showPlain = computed(() => props.phase === 'plain')
/** Source + tree + element readout — shared by both teaching beats. */
const showInspector = computed(() => showTree.value || showPlain.value)
/**
 * The "did not touch" panel, which both result phases carry.
 *
 * Spelled out rather than `!== 'migrate'`: a new phase has to opt in to the
 * verdict panels, not inherit them by not being one particular string.
 */
const showOutcome = computed(() => props.phase === 'all' || props.phase === 'outcome')
/** The graded two-engine arena. Only the original one-slide demo has one. */
const showArena = computed(() => props.phase === 'all')
/** Beat four: the per-shape report and our migration's diff. */
const showReport = computed(() => props.phase === 'outcome')

/**
 * Slide budget for `migrate`, which carries a short <h1>: 385 px total, spent
 * as bar 22 + gap 9 + tree 220 + gap 9 + the bottom row 125. The tree needs a
 * definite pixel height — a percentage has nothing to resolve against — so the
 * number lives here and the grid template below is written from it.
 *
 * 220 rather than a round 224 because a tree row is 21px: this shows ten of
 * them whole, instead of nine and a sliver that reads as a rendering fault.
 */
const TREE_HEIGHT = 220

/**
 * The same budget, spent on two panels instead of four: bar 22 + gap 9 + tree
 * 283 + gap 9 + the readout's 62. The diff pane and the two questions are gone
 * from this phase, so the file and the tree take everything they were using —
 * the tree is 63px taller here than it is on `migrate`.
 *
 * 283 for the same reason 220 was chosen above. The tree pane's own chrome is
 * 10px (1px border either side, 4px padding either side), a row is 21px, and
 * 283 − 10 = 273 = thirteen whole rows.
 */
const PLAIN_TREE_HEIGHT = 283

const ENGINES: { key: EngineKey; title: string; sub: string }[] = [
  { key: 'regex', title: 'text tool', sub: 'vueTagClassesRegex()' },
  { key: 'ast', title: 'template parser', sub: 'vueTagClasses()' },
]

// --- state ----------------------------------------------------------------

const activeIndex = ref(0)
/** Live edits, keyed by fixture name, so switching tabs keeps your typing. */
const drafts = reactive<Record<string, string>>({})
/** Which arena cell the speaker last pointed at. Highlights that panel. */
const spotlight = ref<{ name: string; engine: EngineKey } | null>(null)

const fixtures = computed(() => (props.fixtures.length ? props.fixtures : VUE_FIXTURES))
const active = computed(
  () => fixtures.value[Math.min(activeIndex.value, fixtures.value.length - 1)],
)

const source = computed<string>({
  get: () => drafts[active.value.name] ?? active.value.source,
  set: (value: string) => {
    drafts[active.value.name] = value
  },
})
const edited = computed(() => source.value !== active.value.source)

// --- nothing below here is allowed to throw on stage ----------------------

interface Attempt<T> {
  value: T
  error: string | null
}

function attempt<T>(run: () => T, fallback: T): Attempt<T> {
  try {
    return { value: run(), error: null }
  } catch (error: any) {
    return { value: fallback, error: error?.message ?? String(error) }
  }
}

/** The fixture list as it stands right now, live edits folded in. */
const liveFixtures = computed<VueFixture[]>(() =>
  fixtures.value.map((fixture) => ({ ...fixture, source: drafts[fixture.name] ?? fixture.source })),
)

const graded = computed(() => attempt(() => gradeVueFixtures(liveFixtures.value), [] as VueGrade[]))
const grades = computed(() => graded.value.value)
const activeGrade = computed(
  () => grades.value.find((grade) => grade.name === active.value.name) ?? null,
)

const regexRun = computed(() => attempt(() => vueTagClassesRegex(source.value), source.value))

const astRun = computed<TransformResult>(() => {
  const run = attempt(() => vueTagClasses(source.value), null as TransformResult | null)
  if (run.value) return run.value
  return {
    code: source.value,
    matches: [],
    edits: [],
    error: run.error ?? 'the transform threw',
    nodeCount: 0,
    ok: false,
    note: '',
  }
})

const traps = computed(() => attempt(() => substringTraps(source.value), [] as string[]).value)

const survived = computed(
  () => attempt(() => vueSurvived(source.value, astRun.value), [] as string[]).value,
)

/** `"<p class=…> — why it was left alone"` split into its two halves. */
const survivedItems = computed(() =>
  survived.value.map((line) => {
    const at = line.indexOf(' — ')
    return at === -1
      ? { code: line, why: '' }
      : { code: line.slice(0, at), why: line.slice(at + 3) }
  }),
)

// --- diffs ----------------------------------------------------------------

const SIGN: Record<string, string> = { add: '+', del: '−', same: ' ' }

interface Row {
  kind: 'same' | 'add' | 'del' | 'gap'
  text: string
}

function buildDiff(before: string, after: string) {
  const raw = diffLines(before, after)
  const rows: Row[] = collapse(raw, props.context).map((row: any) =>
    row.kind === 'gap'
      ? { kind: 'gap' as const, text: `  ⋯ ${row.count} unchanged lines` }
      : { kind: row.kind as Row['kind'], text: `${SIGN[row.kind]} ${row.text}` },
  )
  return {
    rows,
    changed: changedLineCount(raw),
    adds: raw.filter((line) => line.kind === 'add').length,
    dels: raw.filter((line) => line.kind === 'del').length,
  }
}

/**
 * Pull this engine's share of the verifier's complaint out of `whatWentWrong`.
 * The prefixes are written by `gradeVueFixtures`, not by this component: the
 * text below is the verifier's, only routed to the column it belongs to.
 */
function reasonsFor(grade: VueGrade | null, engine: EngineKey): string[] {
  if (!grade) return []
  const ok = engine === 'regex' ? grade.regexOk : grade.astOk
  if (ok) return []
  const parts = grade.whatWentWrong.split(' · ')
  const mine = parts
    .filter((part) =>
      engine === 'regex'
        ? part.startsWith('regex: ') || part.startsWith('the regex matched nothing')
        : part.startsWith('AST: '),
    )
    .map((part) => part.replace(/^(?:regex|AST): /, ''))
  return mine.length ? mine : [grade.whatWentWrong]
}

/**
 * A grid-sized label for one of the verifier's complaints.
 *
 * The verdict is never touched — this only compresses the verifier's own
 * sentence into something readable from the back of a room. The full sentence
 * stays under the panel above and in the button's accessible name.
 */
function shorten(problem: string): string {
  const tag = problem.match(/^<([a-z0-9]+)/i)?.[1] ?? '?'
  if (problem.startsWith('the regex matched nothing')) return 'matched nothing'
  if (/still has no class attribute/.test(problem)) return `missed <${tag}>`
  if (/is missing the/.test(problem)) return `missed <${tag}>`
  if (/has a duplicated token/.test(problem)) return `doubled <${tag}>`
  if (/its class attribute changed/.test(problem)) return `hit <${tag}>`
  if (/<script> block was rewritten/.test(problem)) return 'hit <script>'
  if (/<style> block was rewritten/.test(problem)) return 'hit <style>'
  if (/HTML comment .* was rewritten/.test(problem)) return 'hit a comment'
  if (/element structure changed/.test(problem)) return 'broke the markup'
  if (/no longer parses/.test(problem)) return 'output broken'
  if (/did not parse/.test(problem)) return 'input broken'
  if (/<template> block went missing/.test(problem)) return 'no <template>'
  if (/the transform errored/.test(problem)) return 'errored'
  return problem.length > 16 ? `${problem.slice(0, 15)}…` : problem
}

/** The specific complaint, not the "matched nothing" preamble. Fits one line. */
function headlineOf(reasons: string[]): string {
  return reasons.find((r) => !r.startsWith('the regex matched nothing')) ?? reasons[0] ?? ''
}

const panels = computed(() =>
  ENGINES.map((engine) => {
    const after = engine.key === 'regex' ? regexRun.value.value : astRun.value.code
    const error = engine.key === 'regex' ? regexRun.value.error : astRun.value.error
    const grade = activeGrade.value
    const ok = grade ? (engine.key === 'regex' ? grade.regexOk : grade.astOk) : null
    const diff = error ? { rows: [] as Row[], changed: 0, adds: 0, dels: 0 } : buildDiff(source.value, after)
    const reasons = reasonsFor(grade, engine.key)
    return {
      ...engine,
      error,
      ok,
      ...diff,
      reason: headlineOf(reasons),
      /** Everything the verifier said, for the polite live region. */
      reasonFull: reasons.join(' · '),
      focused:
        spotlight.value?.name === active.value.name && spotlight.value?.engine === engine.key,
    }
  }),
)

// --- the template tree, and the two questions -----------------------------
//
// Everything below is measured off a real parse of the fixture on screen. The
// element ranges, the attribute ranges, both answers and the disagreement are
// all computed; none of them is written down per fixture.
// ---------------------------------------------------------------------------

/** Vue's `NodeTypes`, spelled out rather than imported as an enum. */
const V_ELEMENT = 1
const V_ATTRIBUTE = 6
const V_DIRECTIVE = 7

/** One attribute of an element — a node of its own, with its own two numbers. */
interface AttrView {
  name: string
  /** The attribute exactly as it appears in the file, whitespace collapsed. */
  raw: string
  start: number
  end: number
  bound: boolean
}

interface ElementView {
  tag: string
  start: number
  end: number
  /** End of the open tag. `start`–`end` covers the children too, which is the
   *  wrong range to ask "was this element rewritten": a parent contains every
   *  edit made to its descendants. */
  openEnd: number
  /** The open tag only, collapsed to one line — what a text tool would grep. */
  openTag: string
  attrs: AttrView[]
  /** The static class list, or null when the element has no `class` at all. */
  classValue: string | null
  /** One of h1–h4, p, label: the tags this change is allowed to touch. */
  target: boolean
}

const template = computed<TemplateParseResult>(() => {
  const run = attempt(() => parseVueTemplate(source.value), null as TemplateParseResult | null)
  return run.value ?? { ast: null, error: run.error ?? 'the template could not be parsed' }
})

function attrView(prop: any, src: string): AttrView {
  const start = prop.loc?.start?.offset ?? 0
  const end = prop.loc?.end?.offset ?? start
  const bound = prop.type === V_DIRECTIVE
  return {
    name: bound ? (prop.rawName ?? `v-${prop.name}`) : prop.name,
    raw: String(prop.loc?.source ?? src.slice(start, end)).replace(/\s+/g, ' ').trim(),
    start,
    end,
    bound,
  }
}

function elementView(node: any, src: string): ElementView {
  const start = node.loc.start.offset
  const close = src.indexOf('>', start)
  const openEnd = close === -1 ? node.loc.end.offset : close + 1
  const props = node.props ?? []
  const classAttr = props.find((prop: any) => prop.type === V_ATTRIBUTE && prop.name === 'class')
  return {
    tag: node.tag,
    start,
    end: node.loc.end.offset,
    openEnd,
    // Collapsed, because the four-line fixture's open tag is four lines long
    // and this reads back as one. The offsets are still the file's.
    openTag: src.slice(start, openEnd).replace(/\s+/g, ' ').replace(/\s+([/>])/g, '$1'),
    attrs: props.map((prop: any) => attrView(prop, src)),
    // `value` is absent for a bare `class`, present and empty for `class=""`.
    classValue: classAttr ? (classAttr.value?.content ?? '') : null,
    target: TARGET_TAGS.has(node.tag),
  }
}

/**
 * Every element in one component, in document order.
 *
 * A function rather than a computed, because beat four asks the same question
 * of all five fixtures at once and only one of them is the one on screen.
 */
function elementsOf(src: string): ElementView[] {
  return attempt(() => {
    const parsed = parseVueTemplate(src)
    const out: ElementView[] = []
    const visit = (node: any) => {
      if (node?.type === V_ELEMENT && node.loc) out.push(elementView(node, src))
      for (const child of node?.children ?? []) if (child && typeof child === 'object') visit(child)
    }
    if (parsed.ast) visit(parsed.ast)
    return out
  }, [] as ElementView[]).value
}

/** Every element in the template on screen, in document order. */
const elements = computed<ElementView[]>(() => elementsOf(source.value))

function escapeForRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * The strongest question a text tool can ask about one element — and still the
 * wrong one. `class="my-h1"` matches it, and `my-h1` is not the class `h1`.
 */
function classProbe(token: string): RegExp {
  return new RegExp(`class="[^"]*${escapeForRegex(token)}[^"]*"`)
}

function textSaysDone(element: ElementView, token: string): boolean {
  return classProbe(token).test(element.openTag)
}

/** Exactly the condition `vueTagClasses()` uses before it writes an edit. */
function parserChanges(element: ElementView): boolean {
  return element.target && (element.classValue === null || !hasExactClass(element.classValue, element.tag))
}

/** The parser would edit this element and a text search thinks it is done. */
function clashOf(element: ElementView): boolean {
  return parserChanges(element) && textSaysDone(element, element.tag)
}

/**
 * Where the beat opens: the first element the two questions disagree about,
 * else the first element the change applies to, else whatever is there.
 */
const focusElement = computed<ElementView | null>(
  () =>
    elements.value.find(clashOf) ??
    elements.value.find((element) => element.target) ??
    elements.value[0] ??
    null,
)

/**
 * `<AstInspector>` draws the tree and owns the selection. We read it back here
 * so the panel underneath can answer for whatever the speaker clicked.
 */
const inspector = ref<{ selected: TreeNode | null; reset: () => void } | null>(null)

/**
 * The element that owns the selected node.
 *
 * Clicking an Attribute, a Text node or the element itself all land on the same
 * element, which is the point: an attribute is not loose text, it belongs to
 * something. Joined on offsets, because that is all a node is.
 */
const selectedElement = computed<ElementView | null>(() => {
  const at = inspector.value?.selected?.start
  if (at === undefined) return focusElement.value
  let best: ElementView | null = null
  for (const element of elements.value) {
    if (at < element.start || at >= element.end) continue
    if (!best || element.end - element.start <= best.end - best.start) best = element
  }
  return best ?? focusElement.value
})

/**
 * Pre-focus the inspector on the element this fixture is about.
 *
 * `initialPath` also takes a node id, and `toTemplateTree` builds ids from the
 * child index at every level (`0.c1.c0`), so the id of an element is its own
 * path through `children`. Mirrored here rather than guessed: if it ever fails
 * to resolve, the inspector simply opens with nothing selected and the panel
 * below falls back to `focusElement`.
 */
const focusPath = computed(() => {
  const wanted = focusElement.value
  if (!wanted || !template.value.ast) return ''
  let found = ''
  const visit = (node: any, id: string) => {
    if (found) return
    if (node?.type === V_ELEMENT && node.loc?.start?.offset === wanted.start) {
      found = id
      return
    }
    ;(node?.children ?? []).forEach((child: any, index: number) => {
      if (child && typeof child === 'object') visit(child, `${id}.c${index}`)
    })
  }
  visit(template.value.ast, '0')
  return found
})

interface Question {
  /** The question as code, short enough to read from the back of the room. */
  ask: string
  /** The answer and what the tool does with it. */
  say: string
  /** The same question in words, for the live region. */
  spoken: string
}

interface Reading {
  element: ElementView
  parser: Question
  text: Question
  clash: boolean
  foot: string
  warn: boolean
}

const reading = computed<Reading | null>(() => {
  const element = selectedElement.value
  if (!element) return null

  const { tag, classValue, target } = element
  // A non-target element is still worth asking about: the text tool has no idea
  // it is a <div>, so search for whichever class token it would trip over here.
  const token = target ? tag : (TARGET_TAG_LIST.find((t) => textSaysDone(element, t)) ?? tag)
  const hit = textSaysDone(element, token)
  const boundClass = element.attrs.some((attr) => attr.bound && /(^|:)class$/.test(attr.name))

  const parser: Question = !target
    ? {
        ask: `TARGET_TAGS.has("${tag}")`,
        say: 'false — never opens it',
        spoken: `the tag is looked up in the target list, and ${tag} is not in it`,
      }
    : classValue === null
      ? {
          ask: 'props → no class',
          say: `adds class="${tag}"`,
          spoken: 'the attribute list has no class attribute, so one is added',
        }
      : hasExactClass(classValue, tag)
        ? {
            ask: `props.class = "${classValue}"`,
            say: `has "${tag}" — leaves it`,
            spoken: `the class attribute already carries the ${tag} token, so it is left alone`,
          }
        : {
            ask: `props.class = "${classValue}"`,
            say: `no "${tag}" token — appends it`,
            spoken: `the class list is split into tokens, none of them is ${tag}, so ${tag} is appended`,
          }

  const text: Question = {
    ask: `/class="[^"]*${token}[^"]*"/`,
    say: hit
      ? target
        ? 'matches — skips it'
        : 'matches — stops here'
      : target
        ? 'no match — adds it'
        : 'no match — walks past',
    spoken: `a text search for a class attribute containing ${token} ${hit ? 'matches, so it is skipped' : 'finds nothing'}`,
  }

  const clash = clashOf(element)
  const foot = clash
    ? `"${classValue}" contains "${tag}" and is not "${tag}".`
    : !target && hit
      ? `a text search for "${token}" stops here — and this is a <${tag}>.`
      : boundClass
        ? ':class is an expression, not a class list.'
        : target && classValue !== null && hasExactClass(classValue, tag)
          ? `already carries "${tag}" — both of them leave it alone.`
          : 'both answer the same on this element.'

  return { element, parser, text, clash, foot, warn: clash || (!target && hit) }
})

/** Which implementation's diff the one remaining diff pane is showing. */
const engine = ref<EngineKey>('ast')
const enginePanel = computed(
  () => panels.value.find((panel) => panel.key === engine.value) ?? panels.value[0],
)
/**
 * The changed lines only.
 *
 * `⋯ 2 unchanged lines` is the outcome slide's story — what the codemod did
 * not touch — and on this slide those markers push the edit itself off a pane
 * that is now one third of the height it used to be.
 */
const engineRows = computed(() => enginePanel.value.rows.filter((row) => row.kind !== 'gap'))

// --- beat four: what our migration did to each shape ----------------------
//
// One column, five rows, and not a verdict in sight. The interesting content
// is not whether a row passes — it is what the change did to that shape, and
// on every one of the five that includes something it correctly refused to do.
// Both halves of a row are computed: the count is `vueTagClasses()`'s own edit
// list, and the note is read off a parse of the same source and the ranges
// that run actually wrote. Nothing is written down per fixture.
// ---------------------------------------------------------------------------

/** Vue's comment node type. Spelled out, like the three above. */
const V_COMMENT = 3

interface ShapeNote {
  /** The part that is code, set in mono. Empty when there is nothing to name. */
  code: string
  /** The part that is prose. */
  why: string
}

/** The first template comment a human would read as markup, named by its tag. */
function markupComment(src: string): ShapeNote | null {
  const parsed = attempt(() => parseVueTemplate(src), null as TemplateParseResult | null).value
  if (!parsed?.ast) return null
  let found: ShapeNote | null = null
  const visit = (node: any) => {
    if (found) return
    if (node?.type === V_COMMENT) {
      const content = String(node.content ?? '')
      const tag = TARGET_TAG_LIST.find((name) => content.includes(`<${name}`))
      if (tag) found = { code: `<!-- <${tag}> -->`, why: 'left alone' }
    }
    for (const child of node?.children ?? []) if (child && typeof child === 'object') visit(child)
  }
  visit(parsed.ast)
  return found
}

/**
 * The one thing worth saying about what this run left where it was.
 *
 * Priority order, and every branch is a question put to the parse and to the
 * run's own edit ranges. "Did nothing" is as computed as "did something": the
 * rules that fire on the substring and bound-class shapes are the same rules
 * that find the untouched `<article>` on the control.
 */
function keptNote(src: string, result: TransformResult): ShapeNote {
  const edits = result.edits ?? []
  const touched = (start: number, end: number) =>
    edits.some((edit) => edit.start < end && edit.end > start)
  /** Was the element's own open tag rewritten? Its children do not count. */
  const rewritten = (el: ElementView) => touched(el.start, el.openEnd)
  const els = elementsOf(src)

  // 1. A class that merely CONTAINS a tag name, on an element this change was
  //    never about. The trap the substring shape is named after.
  for (const el of els) {
    if (el.target || el.classValue === null || rewritten(el)) continue
    const trap = TARGET_TAG_LIST.find(
      (tag) => el.classValue!.includes(tag) && !hasExactClass(el.classValue!, tag),
    )
    if (trap) return { code: `<${el.tag} class="${el.classValue}">`, why: 'left alone' }
  }

  // 2. A bound class: an expression, not a class list. Nothing static to add
  //    to, and the run did not go near the range it occupies.
  for (const el of els) {
    const bound = el.attrs.find((attr) => attr.bound && /(^|:)class$/.test(attr.name))
    if (bound && !touched(bound.start, bound.end)) {
      return { code: ':class', why: 'is computed at runtime' }
    }
  }

  // 3. Markup to a human, a comment node to the parser.
  const comment = markupComment(src)
  if (comment) return comment

  // 4. The neighbours of an attribute the run DID rewrite. One attribute's
  //    range moved; the ones on the lines around it did not.
  for (const el of els) {
    if (!rewritten(el)) continue
    const others = el.attrs.filter(
      (attr) => attr.name !== 'class' && !touched(attr.start, attr.end),
    )
    if (others.length) {
      return { code: others.map((attr) => attr.name).join(', '), why: 'left alone' }
    }
  }

  // 5. A target that already carries its own tag. The run read the attribute
  //    list, found the token and wrote nothing — which is idempotency.
  for (const el of els) {
    if (!el.target || el.classValue === null || rewritten(el)) continue
    if (hasExactClass(el.classValue, el.tag)) {
      return { code: `<${el.tag} class="${el.classValue}">`, why: 'already correct' }
    }
  }

  // 6. Anything else the change was never about.
  for (const el of els) {
    if (!el.target && !rewritten(el)) return { code: `<${el.tag}>`, why: 'left alone' }
  }

  return { code: '', why: '' }
}

/** The count, in words. Never a verdict — a count and a unit. */
function didLine(count: number, error: string | null): string {
  if (error) return 'did not parse — nothing written'
  if (count === 0) return 'nothing changed'
  return `${count} element${count === 1 ? '' : 's'} got a class`
}

const shapeRows = computed(() =>
  liveFixtures.value.map((fixture) => {
    const run = attempt(() => vueTagClasses(fixture.source), null as TransformResult | null)
    const result = run.value
    const error = result?.error ?? run.error
    const changed = error || !result ? 0 : result.edits.length
    const short = shortName(fixture.name)
    return {
      name: fixture.name,
      short,
      file: short.replace(/ /g, '-'),
      /** The fixture's own one-line description. The short names are shorthand
       *  the room will have half-forgotten three slides after they were set. */
      label: fixture.label.replace(/^Control: /, ''),
      active: fixture.name === active.value.name,
      edited: drafts[fixture.name] !== undefined && drafts[fixture.name] !== originalOf(fixture.name),
      changed,
      did: didLine(changed, error),
      note: error || !result ? { code: '', why: '' } : keptNote(fixture.source, result),
      error,
    }
  }),
)

const activeShape = computed(
  () => shapeRows.value.find((row) => row.active) ?? shapeRows.value[0] ?? null,
)

/** `substring` → `substring.vue`, the name over the diff. */
const activeFile = computed(() => shortName(active.value.name).replace(/ /g, '-'))

/**
 * Our migration's diff for the shape on screen — the only diff this beat has.
 *
 * Built straight off `astRun` rather than off `panels`, so the text tool is not
 * merely hidden on this phase but absent from its data path.
 */
const ourDiff = computed(() => {
  const error = astRun.value.error
  if (error) return { rows: [] as Row[], changed: 0, adds: 0, dels: 0, error }
  return { ...buildDiff(source.value, astRun.value.code), error: null as string | null }
})
/** The changed lines only: `⋯ 2 unchanged lines` costs a line the pane has not got. */
const ourRows = computed(() => ourDiff.value.rows.filter((row) => row.kind !== 'gap'))

// --- the arena ------------------------------------------------------------

const arenaRows = computed(() =>
  grades.value.map((grade) => ({
    name: grade.name,
    short: shortName(grade.name),
    file: shortName(grade.name).replace(/ /g, '-'),
    /** The fixture's own one-line description. The short name alone is shorthand
     *  the room will not remember three slides after it was introduced. */
    label: (VUE_FIXTURES.find((f) => f.name === grade.name)?.label ?? '').replace(/^Control: /, ''),
    active: grade.name === active.value.name,
    edited: drafts[grade.name] !== undefined && drafts[grade.name] !== originalOf(grade.name),
    cells: ENGINES.map((engine) => {
      const reasons = reasonsFor(grade, engine.key)
      // Prefer the specific complaint over the "matched nothing" preamble:
      // "missed <label>" tells the room more than "matched nothing" five times.
      const specific = headlineOf(reasons)
      return {
        key: engine.key,
        title: engine.title,
        ok: engine.key === 'regex' ? grade.regexOk : grade.astOk,
        /** Fits a grid cell. The panel above carries the whole complaint. */
        headline: specific ? shorten(specific) : '',
        reason: reasons.join(' · '),
        pressed: spotlight.value?.name === grade.name && spotlight.value?.engine === engine.key,
      }
    }),
  })),
)

function originalOf(name: string): string {
  return fixtures.value.find((fixture) => fixture.name === name)?.source ?? ''
}

const score = computed(() => ({
  regex: grades.value.filter((grade) => grade.regexOk).length,
  ast: grades.value.filter((grade) => grade.astOk).length,
  total: grades.value.length,
}))

function shortName(name: string): string {
  return name.replace(/^VUE_/, '').toLowerCase().replace(/_/g, ' ')
}

// --- controls -------------------------------------------------------------

function select(index: number) {
  activeIndex.value = index
  spotlight.value = null
}

/** Beat four's rows retarget the diff. No engine to spotlight — there is one. */
function selectShape(name: string) {
  const index = fixtures.value.findIndex((fixture) => fixture.name === name)
  if (index !== -1) select(index)
}

function pick(name: string, engine: EngineKey) {
  const index = fixtures.value.findIndex((fixture) => fixture.name === name)
  if (index !== -1) activeIndex.value = index
  spotlight.value = { name, engine }
}

function reset() {
  for (const key of Object.keys(drafts)) delete drafts[key]
  activeIndex.value = 0
  spotlight.value = null
  engine.value = 'ast'
  // The tree keeps its own folds and selection; hand it back too.
  inspector.value?.reset()
}
</script>

<template>
  <div class="reach" :class="`reach--${phase}`">
    <!-- ── fixture tabs ────────────────────────────────────────────────── -->
    <div class="bar">
      <div class="tabs" role="group" aria-label="Choose a .vue fixture">
        <button
          v-for="(fixture, index) in fixtures"
          :key="fixture.name"
          type="button"
          class="tab"
          :class="{ 'tab--on': index === activeIndex }"
          :aria-pressed="index === activeIndex"
          @click="select(index)"
        >
          <span>{{ shortName(fixture.name) }}</span>
          <span class="sr-only">: {{ fixture.label }}</span>
        </button>
      </div>
      <p class="bar__label">{{ active.label }}</p>
      <button type="button" class="btn" @click="reset">Reset</button>
    </div>

    <!--
      One persistent polite region for the whole demo. Two competing live
      panels would talk over each other; this says the verdict once.
    -->
    <p v-if="showEngines" class="sr-only" aria-live="polite">
      {{ shortName(active.name) }}:
      <template v-for="panel in panels" :key="panel.key">
        {{ panel.title }} {{ panel.ok ? 'passes' : 'fails' }}{{ panel.reasonFull ? ` — ${panel.reasonFull}` : '' }}.
      </template>
    </p>

    <!--
      Beat four says what happened, not who won: the shape, what the change did
      to it, and the one thing it deliberately left where it was.
    -->
    <p v-else-if="showReport" class="sr-only" aria-live="polite">
      <template v-if="activeShape">
        {{ activeShape.short }}, {{ activeShape.label }}: {{ activeShape.did }}.
        <template v-if="activeShape.note.why">
          {{ activeShape.note.code }} {{ activeShape.note.why }}.
        </template>
        Its diff: {{ ourDiff.adds }} line{{ ourDiff.adds === 1 ? '' : 's' }} added,
        {{ ourDiff.dels }} removed.
      </template>
    </p>

    <!-- The same job on the teaching slide, where the selection is what moves. -->
    <p v-else-if="showTree" class="sr-only" aria-live="polite">
      <template v-if="reading">
        {{ reading.element.openTag }}, characters {{ reading.element.start }} to
        {{ reading.element.end }}, {{ reading.element.attrs.length }} attribute{{ reading.element.attrs.length === 1 ? '' : 's' }}.
        The parser: {{ reading.parser.spoken }}. A text tool: {{ reading.text.spoken }}.
        {{ reading.foot }}
      </template>
      Showing the {{ enginePanel.title }} diff: {{ enginePanel.ok ? 'pass' : 'fail' }},
      {{ enginePanel.adds }} added, {{ enginePanel.dels }} removed.
    </p>

    <!--
      Beat two says one thing, so this says one thing: which element you are on,
      the range it owns, and how many attributes hang off it. No verdict — there
      is nothing on this slide to pass or fail.
    -->
    <p v-else class="sr-only" aria-live="polite">
      <template v-if="reading">
        {{ reading.element.openTag }}, characters {{ reading.element.start }} to
        {{ reading.element.end }}, holding {{ reading.element.attrs.length }}
        attribute{{ reading.element.attrs.length === 1 ? '' : 's' }}.
      </template>
    </p>

    <!-- ── the template tree ───────────────────────────────────────────── -->
    <AstInspector
      v-if="showInspector"
      ref="inspector"
      class="tree"
      lang="vue"
      :source="source"
      :height="showPlain ? PLAIN_TREE_HEIGHT : TREE_HEIGHT"
      :initial-path="focusPath"
      compact
    >
      <!--
        The blank-line count belongs to example three, and the room it takes
        goes to the tree here. Overridden rather than left off: an empty slot
        falls back to the default. The count still reaches a screen reader,
        and an out-of-flow span is not a flex item, so it costs no pixels.
      -->
      <template #fact="counts">
        <span class="sr-only">{{ counts.nodes }} nodes in this template.</span>
      </template>
    </AstInspector>

    <!-- ── one element: what it is, where it is, what it holds ─────────── -->
    <section
      v-if="showInspector"
      class="pane pane--ask"
      :aria-label="showTree ? 'The selected element, asked two ways' : 'The selected element'"
    >
      <template v-if="reading">
        <div class="ask__head">
          <code class="ask__tag">{{ reading.element.openTag }}</code>
          <span class="ask__at">{{ reading.element.start }}–{{ reading.element.end }}</span>
          <span v-if="showTree && reading.clash" class="pill pill--fail">they disagree</span>
        </div>

        <!--
          The attribute list the element owns. Names and ranges rather than the
          whole attribute: the open tag above already shows the values, and
          three of these have to fit on one line without scrolling.
        -->
        <p class="ask__attrs">
          <span class="ask__label">props</span>
          <span
            v-for="attr in reading.element.attrs"
            :key="attr.start"
            class="chip"
            :class="{ 'chip--bound': attr.bound }"
          ><code>{{ attr.name }}</code><span class="sr-only">, characters {{ attr.start }} to {{ attr.end }}. </span><span
            class="chip__at"
            aria-hidden="true"
          >{{ attr.start }}–{{ attr.end }}</span></span>
          <span v-if="!reading.element.attrs.length" class="ask__none">the list is empty — not missing</span>
        </p>

        <table v-if="showTree" class="q">
          <caption class="sr-only">The same element, asked two ways.</caption>
          <tbody>
            <tr>
              <th scope="row" class="q__who">parser</th>
              <td class="q__ask"><code>{{ reading.parser.ask }}</code></td>
              <td class="q__say">{{ reading.parser.say }}</td>
            </tr>
            <tr>
              <th scope="row" class="q__who">text</th>
              <td class="q__ask"><code>{{ reading.text.ask }}</code></td>
              <td class="q__say" :class="{ 'q__say--warn': reading.warn }">{{ reading.text.say }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="showTree" class="ask__foot" :class="{ 'ask__foot--warn': reading.warn }">{{ reading.foot }}</p>
      </template>

      <p v-else-if="template.error" class="err">
        <span aria-hidden="true">■</span> {{ template.error }}
      </p>
      <p v-else class="nochange">no elements in this template — click a node in the tree.</p>
    </section>

    <!-- ── one engine's diff ───────────────────────────────────────────── -->
    <section
      v-if="showTree"
      class="pane pane--out pane--engine"
      :aria-label="`${enginePanel.title} diff`"
    >
      <div class="pane__head">
        <div class="tabs" role="group" aria-label="Whose diff to show">
          <button
            v-for="option in panels"
            :key="option.key"
            type="button"
            class="tab tab--sm"
            :class="{ 'tab--on': option.key === engine }"
            :aria-pressed="option.key === engine"
            @click="engine = option.key"
          >{{ option.title }}<span class="sr-only">, {{ option.sub }}</span></button>
        </div>
        <span
          v-if="enginePanel.ok !== null"
          class="pill"
          :class="enginePanel.ok ? 'pill--pass' : 'pill--fail'"
        >{{ enginePanel.ok ? 'pass' : 'fail' }}</span>
      </div>

      <p v-if="enginePanel.error" class="err" role="status">
        <span aria-hidden="true">■</span> {{ enginePanel.error }} — nothing was written.
      </p>
      <p v-else-if="enginePanel.changed === 0" class="nochange">
        byte-identical output — this tool matched nothing in this file.
      </p>
      <pre v-else class="diff scrolls" tabindex="0" role="group" :aria-label="`${enginePanel.title} diff, changed lines only`"><code><span
        v-for="(row, index) in engineRows"
        :key="index"
        :class="['row', `row--${row.kind}`]"
      >{{ row.text }}
</span></code></pre>
    </section>

    <!-- ── source ──────────────────────────────────────────────────────── -->
    <section v-if="showEngines" class="pane pane--src" aria-label="Fixture source, editable">
      <div class="pane__head">
        <p class="pane__title">{{ shortName(active.name).replace(/ /g, '-') }}.vue</p>
        <!-- The grid is not on this slide when the demo is split in two. -->
        <p class="pane__sub">{{ phase === 'migrate' ? 'edit it — both engines re-run' : 'edit it — both engines and the grid re-run' }}</p>
        <span v-if="edited" class="pill pill--edit">edited</span>
      </div>
      <textarea
        v-model="source"
        class="src scrolls"
        spellcheck="false"
        autocapitalize="off"
        autocorrect="off"
        aria-label="Fixture source — edit it and both engines re-run"
      ></textarea>
      <p v-if="traps.length" class="trap">
        <span aria-hidden="true">⚠</span>
        <span>{{ traps[0] }}<template v-if="traps.length > 1"> (+{{ traps.length - 1 }} more)</template></span>
      </p>
    </section>

    <!-- ── the two engines ─────────────────────────────────────────────── -->
    <div v-if="showEngines" class="stack">
      <section
        v-for="panel in panels"
        :key="panel.key"
        class="pane pane--out"
        :class="{ 'pane--focus': panel.focused, 'pane--grow': panel.changed > 0 }"
        :aria-label="`${panel.title} output`"
      >
        <div class="pane__head">
          <p class="pane__title">{{ panel.title }}</p>
          <p class="pane__sub">{{ panel.sub }}</p>
          <span
            v-if="panel.ok !== null"
            class="pill"
            :class="panel.ok ? 'pill--pass' : 'pill--fail'"
          >{{ panel.ok ? 'pass' : 'fail' }}</span>
          <span v-if="!panel.error" class="stat">
            <span class="stat--add">+{{ panel.adds }}</span>
            <span class="stat--del">−{{ panel.dels }}</span>
          </span>
        </div>

        <p v-if="panel.error" class="err" role="status">
          <span aria-hidden="true">■</span> {{ panel.error }} — nothing was written.
        </p>
        <p v-else-if="panel.changed === 0 && !panel.reason" class="nochange">
          byte-identical output — this tool matched nothing in this file.
        </p>
        <pre v-else-if="panel.changed > 0" class="diff scrolls" tabindex="0" role="group" :aria-label="`${panel.title} diff`"><code><span
          v-for="(row, index) in panel.rows"
          :key="index"
          :class="['row', `row--${row.kind}`]"
        >{{ row.text }}
</span></code></pre>

        <p v-if="panel.reason" class="why">{{ panel.reason }}</p>
      </section>
    </div>

    <!-- ── the arena ───────────────────────────────────────────────────── -->
    <section v-if="showArena" class="pane pane--arena" aria-label="The arena">
      <div class="pane__head">
        <p class="pane__title">the arena</p>
        <span class="pane__note">graded live by <code>gradeVueFixtures()</code></span>
      </div>

      <p v-if="graded.error" class="err">
        <span aria-hidden="true">■</span> the grader could not run: {{ graded.error }}
      </p>

      <div v-else class="arena__scroll">
        <table class="arena">
          <caption class="sr-only">
            Each fixture run through both implementations and graded against a fresh parse of the
            output. Text tool correct on {{ score.regex }} of {{ score.total }}; template parser
            correct on {{ score.ast }} of {{ score.total }}.
          </caption>
          <thead>
            <tr>
              <th scope="col">fixture</th>
              <th v-for="column in ENGINES" :key="column.key" scope="col">{{ column.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in arenaRows" :key="row.name" :class="{ 'is-active': row.active }">
              <th scope="row">
                <span class="row-name">{{ row.file }}</span>
                <span v-if="row.edited" class="row-edit" title="edited live">*</span>
                <span v-if="row.edited" class="sr-only">, edited</span>
                <span class="row-label">{{ row.label }}</span>
              </th>
              <td v-for="cell in row.cells" :key="cell.key">
                <button
                  type="button"
                  class="cell"
                  :class="cell.ok ? 'cell--pass' : 'cell--fail'"
                  :aria-pressed="cell.pressed"
                  @click="pick(row.name, cell.key)"
                >
                  <span class="cell__glyph" aria-hidden="true">{{ cell.ok ? '✓' : '✕' }}</span>
                  <span class="sr-only">{{ cell.ok ? 'pass' : 'fail' }}, {{ row.short }} fixture, {{ cell.title }}. </span>
                  <span class="cell__verdict">{{ cell.ok ? 'pass' : cell.headline || 'fail' }}</span>
                  <span v-if="cell.reason" class="sr-only"> — {{ cell.reason }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ── beat four: what the change did, shape by shape ──────────────── -->
    <section
      v-if="showReport"
      class="pane pane--report"
      aria-label="What the migration did to each of the five shapes"
    >
      <div class="pane__head">
        <p class="pane__title pane__title--report">what the migration did</p>
        <span class="pane__note">every row computed live</span>
      </div>

      <ul class="report">
        <li v-for="row in shapeRows" :key="row.name">
          <!--
            An explicit name, because the row's own text is five spans and a
            middle dot and reads back as one run-on word. Same words, punctuated.
          -->
          <button
            type="button"
            class="shape"
            :aria-label="`${row.short}, ${row.label}. ${row.did}${row.note.why ? `. ${row.note.code} ${row.note.why}` : ''}.`"
            :aria-pressed="row.active"
            @click="selectShape(row.name)"
          >
            <span class="shape__top">
              <span class="shape__name">{{ row.file }}</span>
              <span v-if="row.edited" class="shape__edit" aria-hidden="true">*</span>
              <span v-if="row.edited" class="sr-only">, edited</span>
              <span class="shape__label">{{ row.label }}</span>
            </span>
            <span class="shape__out">
              <span class="shape__did" :class="{ 'shape__did--none': row.changed === 0 }">{{ row.did }}</span>
              <template v-if="row.note.why">
                <span class="shape__sep" aria-hidden="true">·</span>
                <span class="shape__kept"><code v-if="row.note.code">{{ row.note.code }}</code> {{ row.note.why }}</span>
              </template>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <!-- ── our migration's diff, for the shape on screen ───────────────── -->
    <section
      v-if="showReport"
      class="pane pane--diff"
      :aria-label="`${activeFile} dot vue, what the migration wrote`"
    >
      <div class="pane__head">
        <p class="pane__title pane__title--diff">{{ activeFile }}.vue</p>
        <span v-if="!ourDiff.error" class="stat">
          <span class="stat--add">+{{ ourDiff.adds }}</span>
          <span class="stat--del">−{{ ourDiff.dels }}</span>
        </span>
      </div>

      <p v-if="ourDiff.error" class="err" role="status">
        <span aria-hidden="true">■</span> {{ ourDiff.error }} — nothing was written.
      </p>
      <p v-else-if="ourDiff.changed === 0" class="nochange">
        byte-identical — there was nothing in this file to change.
      </p>
      <!--
        `diff--wrap` when two rows leave room for four: the bound-class shape
        writes its new attribute 45 characters into a 78-character line, and
        cutting the line at the pane's edge hides the only thing that changed.
        Above two rows there is no room to wrap into, so it scrolls instead —
        and those lines all carry their edit near the front.
      -->
      <pre
        v-else
        class="diff scrolls"
        :class="{ 'diff--wrap': ourRows.length <= 2 }"
        tabindex="0"
        role="group"
        :aria-label="`${activeFile} dot vue, the lines the migration changed`"
      ><code><span
        v-for="(row, index) in ourRows"
        :key="index"
        :class="['row', `row--${row.kind}`]"
      >{{ row.text }}
</span></code></pre>
    </section>

    <!-- ── survived ────────────────────────────────────────────────────── -->
    <section v-if="showOutcome" class="pane pane--kept" aria-label="What the codemod did not touch">
      <div class="pane__head pane__head--kept">
        <p class="pane__title pane__title--kept">did not touch</p>
        <p class="pane__sub pane__sub--plain">the other half of the review</p>
        <span class="pill pill--kept">{{ survivedItems.length }}</span>
      </div>

      <!--
        A tab stop only where the list can actually run past the panel: the
        nested fixture leaves eight things alone and beat four's panel shows
        about six of them. On the original one-slide demo the attribute is
        absent, because a tab stop on a region that never scrolls is noise.
      -->
      <div
        class="kept-wrap scrolls"
        aria-live="polite"
        :tabindex="showReport ? 0 : undefined"
      >
        <ul v-if="survivedItems.length" class="kept">
          <li v-for="(item, index) in survivedItems" :key="index">
            <span class="kept__glyph" aria-hidden="true">✓</span>
            <p class="kept__body"><code class="kept__code">{{ item.code }}</code><span
              v-if="item.why"
              class="kept__why"
            > — {{ item.why }}</span></p>
          </li>
        </ul>
        <p v-else class="nochange">
          nothing recorded — this file has no template the parser could walk.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reach {
  /* Definite height, not 100%: the slide's content box is auto-height, so a
     percentage never resolves and the inner flex chain grows unbounded. */
  height: 470px;
  max-height: 470px;
  --r-bg: var(--bg, #0f1115);
  --r-panel: var(--panel, #171a21);
  --r-text: var(--text, #e9ecef);
  --r-dim: var(--dim, #adb5bd);
  --r-blue: var(--blue, #74c0fc);
  --r-yellow: var(--yellow, #ffd43b);
  --r-red: var(--red, #ff8787);
  --r-green: var(--green, #69db7c);
  --r-purple: var(--purple, #b197fc);
  --r-border: var(--border, #39404d);
  --r-mono: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1.12fr) minmax(0, 1fr);
  gap: 7px 10px;
  min-height: 0;
  color: var(--r-text);
  font-size: 15px;
  line-height: 1.4;
}

/* ---- phases -------------------------------------------------------------
   Same demo, split across two slides. Both carry a short <h1>, so the budget
   is 860 × 385. Definite height again, for the same reason as above. */
.reach--migrate,
.reach--outcome,
.reach--plain {
  height: 385px;
  max-height: 385px;
  gap: 9px 12px;
}
/*
 * outcome: beat four.
 *
 * Three panels on 385, spent as bar 22 + 9 + report 227 + 9 + diff 118. The
 * diff track is a definite pixel height for the same reason the tree's is —
 * a percentage has nothing to resolve against here — and 118 is what four diff
 * rows need: two changed lines is a `−` and a `+` each, and the shape the
 * slide opens on has two.
 *
 * The columns are all but an even split, against the old 1.18/0.82. The
 * comparison paid for that extra width; with it gone the panel on the right
 * goes from 351px to 407 and spans both rows, because "change nothing else" is
 * half the goal and so "did not touch" is half the slide. The 0.05 the left
 * column keeps is what the longest outcome line needs to stay off the ellipsis.
 */
.reach--outcome {
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  grid-template-rows: auto minmax(0, 1fr) 118px;
}
.reach--outcome .pane--report {
  grid-column: 1;
  grid-row: 2;
}
.reach--outcome .pane--diff {
  grid-column: 1;
  grid-row: 3;
}
/*
 * migrate: the tree spans the whole width on row two, because the two things
 * it has to show — a template line and a row like
 * `Element <p class data-testid :title>` — are both wide, and an ellipsis
 * through an attribute list would cut the only sentence this slide is making.
 * Row three is what is left: 385 − bar − 9 − tree 224 − 9. Keep TREE_HEIGHT
 * and this template in step.
 */
.reach--migrate {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  grid-template-rows: auto 220px minmax(0, 1fr);
}
.reach--migrate .tree {
  grid-column: 1 / -1;
  grid-row: 2;
}
/*
 * The inspector's own bar and readout are trimmed here, and only here.
 * Its bar carries a second Reset — one demo, one Reset — and its readout
 * spells out `source.slice(start, end)`, which is the anatomy slide's lesson
 * and is said again by the panel below in the terms this slide needs: the
 * element, its attribute list, and the ranges. Both panes get the room back.
 * If either class ever moves, the parts reappear and nothing breaks.
 */
.reach--migrate .tree :deep(.ai__bar),
.reach--migrate .tree :deep(.ai__read) {
  display: none;
}
.reach--migrate .pane--ask {
  grid-column: 1;
  grid-row: 3;
}
.reach--migrate .pane--engine {
  grid-column: 2;
  grid-row: 3;
}
/*
 * plain: the starting point, and nothing else.
 *
 * One column, because there is no longer a second thing to put beside the
 * first. The whole width goes to the file and its tree, and the readout under
 * them gets the full 860 too — which is what stops the longest open tag in the
 * library, `<p class="lede" data-testid="intro" :title="tooltip">`, from being
 * ellipsised on the one slide whose job is to show it whole.
 *
 * bar 22 + 9 + tree 283 + 9 + readout 62 = 385. The readout's own content is
 * 56 of that 62, so the last track takes the rounding rather than the tree.
 * Keep PLAIN_TREE_HEIGHT and the middle track in step.
 */
.reach--plain {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 283px minmax(0, 1fr);
}
.reach--plain .tree,
.reach--plain .pane--ask {
  grid-column: 1 / -1;
}
.reach--plain .tree {
  grid-row: 2;
}
.reach--plain .pane--ask {
  grid-row: 3;
}
/* One demo, one Reset — and the inspector's own readout spells out
   `source.slice(start, end)`, which is the anatomy slide's line. The panel
   below says the same thing in this slide's terms. Same trim as `migrate`. */
.reach--plain .tree :deep(.ai__bar),
.reach--plain .tree :deep(.ai__read) {
  display: none;
}
/* The file is the subject of this slide, so it is read at the deck's normal
   code size rather than the sub-panel size `compact` drops it to. 15/1.5 is
   22.5px a line: the longest fixture that is not the nested one fits whole. */
.reach--plain .tree :deep(.ai__src) {
  font-size: 15px !important;
  line-height: 1.5 !important;
  padding: 7px 9px;
}

/* ---- plain: one element, calmly ------------------------------------------
   Two lines, both measured off the fixture: the open tag with the range it
   owns, and the attribute list it holds with a range on each. Explicit line
   boxes for the same reason as `migrate` — mono and sans on one baseline make
   a line box taller than either font, and this row is on a 56px budget. */
.reach--plain .pane--ask {
  gap: 1px;
  padding: 5px 12px 6px;
  border-left: 4px solid var(--r-blue);
}
.reach--plain .ask__head,
.reach--plain .ask__attrs {
  height: 21px;
}
.reach--plain .ask__tag,
.reach--plain .ask__at {
  font-size: 16px;
}
.reach--plain .ask__attrs {
  gap: 6px;
}
.reach--plain .ask__label,
.reach--plain .ask__none,
.reach--plain .chip code {
  font-size: 15px;
}
.reach--plain .chip {
  padding: 0 5px;
}
.reach--plain .chip__at {
  font-size: 14px;
}

.reach--outcome .pane--kept {
  grid-column: 2;
  grid-row: 2 / span 2;
}

/* Panels breathe. */
.reach--migrate .pane {
  padding: 7px 10px 8px;
}
.reach--outcome .pane {
  padding: 9px 12px 10px;
}
.reach--outcome .pane__head {
  margin-bottom: 8px;
}

/* ---- migrate: one element, two questions --------------------------------
   Four lines, and every one of them is measured off the fixture: the element
   and its range, its attribute list with a range each, the two questions, and
   the sentence the disagreement makes. */
.reach--migrate .pane--ask {
  gap: 1px;
  padding: 5px 10px 6px;
  border-left: 4px solid var(--r-blue);
}
/* Explicit line boxes, centred rather than baseline-aligned. Mono and sans on
   one baseline make a line box taller than either font, and every one of these
   rows is spending a fixed 121px budget. */
.ask__head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 19px;
  min-width: 0;
}
.ask__tag {
  flex: 0 1 auto;
  min-width: 0;
  font-family: var(--r-mono);
  font-size: 14px;
  line-height: 1.3;
  font-weight: 700;
  color: var(--r-blue);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ask__at {
  flex: none;
  font-family: var(--r-mono);
  font-size: 14px;
  line-height: 1.3;
  color: var(--r-yellow);
}
.ask__head .pill {
  margin-left: auto;
  font-size: 13.6px;
  padding: 1px 6px;
}
/* One line. Names and ranges are narrow enough that the widest fixture — three
   attributes on a <p> — fits with room to spare, and the source on this slide
   cannot be edited, so the list cannot grow underneath us. `hidden` and not
   `auto` deliberately: a scrollable region has to be focusable to pass axe, and
   a tab stop on a row that never scrolls is noise on stage.
   Centred, not baseline-aligned: two font sizes on a baseline make the line
   box taller than either of them, and this row is on a 125px budget. */
.ask__attrs {
  margin: 0;
  flex: none;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 19px;
  min-width: 0;
  overflow: hidden;
}
.ask__label {
  flex: none;
  font-family: var(--r-mono);
  font-size: 14px;
  line-height: 1.3;
  color: var(--r-dim);
}
.ask__none {
  flex: none;
  font-size: 14px;
  line-height: 1.3;
  color: var(--r-dim);
  font-style: italic;
}
.chip {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 4px;
  border-radius: 4px;
  padding: 0 4px;
  background-color: var(--r-bg);
}
.chip code {
  font-family: var(--r-mono);
  font-size: 14px;
  line-height: 1.3;
  color: var(--r-green);
  white-space: nowrap;
}
.chip--bound code {
  color: var(--r-purple);
}
.chip__at {
  font-family: var(--r-mono);
  font-size: 13.6px;
  line-height: 1.3;
  color: var(--r-dim);
}
.q {
  flex: none;
  width: 100%;
  border-collapse: collapse;
  margin-top: 2px;
}
/* A px line-height, not a ratio: the strut and the mono <code> inside the cell
   then share one line box, and a row is 19px instead of 22. */
.q th,
.q td {
  text-align: left;
  vertical-align: middle;
  padding: 0;
  border: 0;
  line-height: 19px;
  white-space: nowrap;
}
.q__who {
  width: 1%;
  padding-right: 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--r-dim);
}
.q__ask {
  width: 1%;
  padding-right: 12px;
}
.q__ask code {
  font-family: var(--r-mono);
  font-size: 14px;
  line-height: inherit;
  color: var(--r-text);
}
.q__say {
  font-size: 14px;
  color: var(--r-text);
  overflow: hidden;
  text-overflow: ellipsis;
}
.q__say--warn {
  color: var(--r-yellow);
}
.ask__foot {
  margin: 2px 0 0;
  flex: none;
  font-size: 14px;
  line-height: 1.3;
  color: var(--r-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ask__foot--warn {
  color: var(--r-yellow);
}

/* ---- migrate: the one diff that is left ---------------------------------
   Still the real output of the real implementation, still graded by the same
   verifier — just one pane with a switch, because the tree is the argument
   now and this is the line back to the outcome slide. */
/* Four diff rows have to fit under the switch, so this pane runs tighter than
   the panel beside it. */
.reach--migrate .pane--engine {
  padding: 6px 10px 7px;
}
.reach--migrate .pane--engine .pane__head {
  gap: 6px;
  margin-bottom: 3px;
}
.reach--migrate .pane--engine .pill {
  font-size: 13.6px;
  padding: 2px 6px;
}
/* Specificity, not source order: `.tab` is declared further down. */
.reach--migrate .tab--sm {
  font-size: 13.5px;
  padding: 2px 7px;
}
.reach--migrate .diff {
  font-size: 14px !important;
  line-height: 1.3 !important;
  padding: 3px 7px;
}
.reach--migrate .nochange {
  font-size: 14px;
}

/* ---- outcome: the per-shape report --------------------------------------
 *
 * Five rows on a 227px panel, so a row is two lines and both of them run the
 * full width of the column. That is not a preference: the longest fixture
 * label is 296px at 13.6px and the longest outcome sentence is about 390, and
 * neither survives being put in a column beside the other. So the row reads
 * downwards — what this shape is, then what happened to it — and the list
 * distributes whatever height the panel has between its five items.
 */
.reach--outcome .pane--report {
  padding: 8px 11px 9px;
}
.reach--outcome .pane--report .pane__head {
  margin-bottom: 5px;
}
/* Specificity, not source order: `.pane__title` is declared further down. */
.reach--outcome .pane--report .pane__title--report {
  font-size: 17px;
}
/* The head's two halves on one explicit line box. Baseline-aligning 17px and
   15px makes the box taller than either, and this row is spending a 25px
   budget so that all five report rows clear their two lines. */
.reach--outcome .pane--report .pane__title--report,
.reach--outcome .pane--report .pane__note {
  line-height: 20px;
}
.report {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.report li {
  margin: 0;
  /* `1 1 0` and not `auto`: five equal rows however tall the panel ends up. */
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  border-bottom: 1px solid #232833;
}
.report li:last-child {
  border-bottom: 0;
}
.shape {
  font: inherit;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding: 0 4px;
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: transparent;
  color: var(--r-text);
  cursor: pointer;
}
.shape:hover {
  border-color: var(--r-border);
  background-color: var(--r-bg);
}
.shape:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: -1px;
}
.shape[aria-pressed='true'] {
  border-color: var(--r-blue);
  background-color: var(--r-bg);
}
/* Explicit line boxes: mono and sans on one baseline make a line box taller
   than either font, and two of these rows share a 37px budget. */
.shape__top,
.shape__out {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  line-height: 17px;
}
.shape__name {
  flex: none;
  font-family: var(--r-mono);
  font-size: 15px;
  font-weight: 700;
}
.shape__edit {
  flex: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--r-yellow);
}
.shape__label {
  flex: 0 1 auto;
  min-width: 0;
  font-size: 13.6px;
  color: var(--r-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Blue for what moved, green for what did not — the same green the panel on
   the right is bordered in. Not a pass and a fail: a change and a non-change. */
.shape__did {
  flex: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--r-blue);
}
.shape__did--none {
  color: var(--r-dim);
}
.shape__sep {
  flex: none;
  font-size: 15px;
  color: var(--r-dim);
}
.shape__kept {
  flex: 0 1 auto;
  min-width: 0;
  font-size: 13.6px;
  color: var(--r-green);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* `color: inherit` because the deck stylesheet paints bare <code> yellow, and
   ligatures off because Fira Code turns `<!--` into a single long arrow — the
   one glyph this note cannot afford to lose. */
.shape__kept code {
  font-family: var(--r-mono);
  font-size: 13.6px;
  color: inherit;
  font-variant-ligatures: none;
}

/* ---- outcome: the one diff ----------------------------------------------
   Four rows of 14px/1.3 is 73px, which is what the 118px track was sized for:
   118 − 13 padding − 21 head − 6 of the pre's own border and padding = 78. */
.reach--outcome .pane--diff {
  padding: 6px 10px 7px;
}
.reach--outcome .pane--diff .pane__head {
  gap: 8px;
  margin-bottom: 3px;
}
/* Specificity, not source order, again. */
.reach--outcome .pane--diff .pane__title--diff {
  font-size: 15px;
  line-height: 18px;
  font-family: var(--r-mono);
}
.reach--outcome .pane--diff .stat {
  font-size: 14px;
}
.reach--outcome .pane--diff .diff {
  font-size: 14px !important;
  line-height: 1.3 !important;
  padding: 2px 6px;
}
.reach--outcome .pane--diff .diff--wrap {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.reach--outcome .pane--diff .nochange {
  font-size: 14px;
}

/* ---- outcome: the survived list, read from the back of the room ---------
   The co-star, and the widest it has ever been. Tighter between items than
   the old two-column slide could afford, because the nested fixture leaves
   eight things alone and all eight are worth reading. */
.reach--outcome .kept {
  gap: 4px;
}
.reach--outcome .kept li {
  gap: 9px;
  padding-bottom: 4px;
}
.reach--outcome .kept-wrap:focus-visible {
  outline: 2px solid var(--r-green);
  outline-offset: -2px;
}
/* Fira Code renders `<!--` as one long arrow, which turns the best line in
   this panel — an HTML comment the parser refused to treat as markup — into a
   glyph nobody can read. Scoped to this phase, like everything else here. */
.reach--outcome .kept__code {
  font-variant-ligatures: none;
}
.reach--outcome .kept__glyph,
.reach--outcome .kept__body {
  font-size: 16.5px;
  line-height: 1.45;
}

/* Several panes hold more than they can show. An overlay scrollbar fades out
   and, on a projector, reads as "that is all there is" — so scrollable panes
   also carry a blue edge that appears only while there is more in that
   direction. Pure CSS: the two `local` layers scroll with the content and
   cover the two `scroll` layers when you reach the end.
   Set --edge to the pane's own background colour. */
.scrolls {
  --edge: var(--r-bg);
  background-image:
    linear-gradient(to top, var(--edge), rgba(0, 0, 0, 0)),
    linear-gradient(to top, rgba(116, 192, 252, 0.9), rgba(116, 192, 252, 0));
  background-position: bottom, bottom;
  background-size: 100% 14px, 100% 5px;
  background-repeat: no-repeat;
  /* The `local` cover travels with the content and hides the blue bar once
     you have reached the end — or immediately, if nothing is hidden. */
  background-attachment: local, scroll;
}
.reach ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.reach ::-webkit-scrollbar-thumb {
  background-color: #5a6472;
  border-radius: 4px;
}
.reach ::-webkit-scrollbar-track {
  background-color: transparent;
}
.reach * {
  scrollbar-width: thin;
  scrollbar-color: #5a6472 transparent;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ---- top bar ---- */
.bar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.bar__kicker {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--r-dim);
  flex: none;
}
.bar__label {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  font-size: 15px;
  color: var(--r-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tabs {
  display: flex;
  gap: 5px;
  min-width: 0;
  flex: none;
}
.tab {
  font: inherit;
  font-family: var(--r-mono);
  font-size: 15px;
  line-height: 1.2;
  padding: 4px 9px;
  border: 1px solid var(--r-border);
  border-radius: 6px;
  background-color: var(--r-panel);
  color: var(--r-text);
  cursor: pointer;
}
.tab:hover {
  border-color: var(--r-blue);
}
.tab:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: 2px;
}
.tab--on {
  background-color: var(--r-blue);
  border-color: var(--r-blue);
  color: #0f1115;
  font-weight: 700;
}
.btn {
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  flex: none;
  padding: 4px 13px;
  border: 1px solid var(--r-border);
  border-radius: 6px;
  background-color: #232833;
  color: var(--r-text);
  cursor: pointer;
}
.btn:hover {
  border-color: var(--r-text);
}
.btn:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: 2px;
}

/* ---- panels ---- */
.pane {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--r-border);
  border-radius: 8px;
  background-color: var(--r-panel);
  padding: 6px 9px 7px;
  overflow: hidden;
}
.pane__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: none;
  margin-bottom: 6px;
}
.pane__title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  white-space: nowrap;
  flex: none;
}
.pane__sub {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  font-size: 15px;
  line-height: 1.2;
  color: var(--r-dim);
  font-family: var(--r-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pane__sub--plain {
  font-family: inherit;
}
.pane__note {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 15px;
  color: var(--r-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pane__note code {
  font-family: var(--r-mono);
  font-size: 15px;
  color: var(--r-purple);
}

.pill {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 5px;
  flex: none;
}
.pill--edit {
  background-color: #3a3212;
  color: var(--r-yellow);
  border: 1px solid var(--r-yellow);
}
.pill--pass {
  background-color: #122a19;
  color: var(--r-green);
  border: 1px solid var(--r-green);
}
.pill--fail {
  background-color: #331f1f;
  color: var(--r-red);
  border: 1px solid var(--r-red);
}
.pill--kept {
  background-color: #122a19;
  color: var(--r-green);
  border: 1px solid var(--r-green);
  font-family: var(--r-mono);
}
.stat {
  margin-left: auto;
  display: flex;
  gap: 8px;
  font-family: var(--r-mono);
  font-size: 15px;
  font-weight: 700;
  flex: none;
}
.stat--add {
  color: var(--r-green);
}
.stat--del {
  color: var(--r-red);
}

/* ---- source ---- */
.pane--src {
  grid-column: 1;
  grid-row: 2;
}
.src {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  resize: none;
  border: 1px solid var(--r-border);
  border-radius: 6px;
  background-color: var(--r-bg);
  color: var(--r-text);
  font-family: var(--r-mono);
  font-size: 15px;
  line-height: 1.45;
  padding: 6px 8px;
  white-space: pre;
  overflow: auto;
  tab-size: 2;
}
.src:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: 1px;
}
.trap {
  margin: 6px 0 0;
  display: flex;
  gap: 6px;
  flex: none;
  font-size: 15px;
  line-height: 1.3;
  color: var(--r-yellow);
}
.trap > span:last-child {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* ---- engine stack ---- */
.stack {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
/* Flexible rather than a 50/50 split: when one engine produces a
   byte-identical file its panel collapses and the other gets the room. */
.pane--out {
  flex: 0 1 auto;
  min-height: 71px;
}
/* The panel that actually produced a diff absorbs the leftover room. */
.pane--grow {
  flex-grow: 1;
}
.pane--focus {
  border-color: var(--r-blue);
  box-shadow: inset 0 0 0 1px var(--r-blue);
}
.diff {
  flex: 1 1 auto;
  min-height: 0;
  margin: 0;
  padding: 5px 7px;
  border: 1px solid var(--r-border);
  border-radius: 6px;
  background-color: var(--r-bg);
  font-family: var(--r-mono);
  /* !important because deck stylesheets like to shout at bare <pre>:
     `.slidev-layout pre { font-size: 1.15rem !important }` would blow this
     panel's line budget and hide the added lines below the fold. */
  font-size: 15px !important;
  line-height: 1.35 !important;
  white-space: pre;
  overflow: auto;
}
.diff:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: 1px;
}
.row {
  display: block;
  color: var(--r-dim);
}
.row--add {
  color: var(--r-green);
  background-color: rgba(105, 219, 124, 0.12);
}
.row--del {
  color: var(--r-red);
  background-color: rgba(255, 135, 135, 0.12);
}
.row--gap {
  color: var(--r-dim);
  font-style: italic;
}
.why {
  margin: 5px 0 0;
  flex: none;
  font-size: 15px;
  line-height: 1.3;
  color: var(--r-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.err {
  margin: 0;
  flex: none;
  font-size: 15px;
  line-height: 1.35;
  color: var(--r-red);
  border: 1px solid var(--r-red);
  border-radius: 6px;
  padding: 6px 8px;
  background-color: #2a1a1c;
}
.nochange {
  margin: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 1.35;
  color: var(--r-dim);
  font-style: italic;
}

/* ---- arena ---- */
.pane--arena {
  grid-column: 1;
  grid-row: 3;
}
/* Every row of the grid has to be on screen at once — it is the argument. */
.pane--arena .pane__head {
  margin-bottom: 3px;
}
.arena tbody tr:last-child th,
.arena tbody tr:last-child td {
  border-bottom: 0;
}
.arena__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
.arena {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 15px;
}
.arena th,
.arena td {
  text-align: left;
  vertical-align: middle;
  padding: 0 3px;
  border-bottom: 1px solid var(--r-border);
}
.arena thead th {
  font-size: 17px;
  font-weight: 700;
  color: var(--r-text);
  padding-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arena thead th:first-child,
.arena tbody th {
  width: 25%;
}
.arena tbody th {
  font-size: 15px;
  font-weight: 700;
  color: var(--r-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 6px;
}
.arena tbody tr.is-active th {
  color: var(--r-text);
}
.arena tbody tr.is-active {
  background-color: #1d222c;
}

/* The short name is shorthand introduced two slides earlier; the label is what
   makes each row legible on its own. Kept dim so the verdicts still lead. */
.row-name { display: block; }
.row-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
  line-height: 1.25;
  color: var(--r-dim, #adb5bd);
}
.cell {
  font: inherit;
  display: flex;
  align-items: baseline;
  gap: 5px;
  width: 100%;
  text-align: left;
  padding: 1px 3px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
}
.cell:hover {
  border-color: var(--r-border);
  background-color: var(--r-bg);
}
.cell:focus-visible {
  outline: 2px solid var(--r-blue);
  outline-offset: 1px;
}
.cell[aria-pressed='true'] {
  border-color: var(--r-blue);
  background-color: var(--r-bg);
}
.cell__glyph {
  font-size: 16px;
  line-height: 1.3;
  flex: none;
}
/* One line, ellipsised. The full complaint lives under the panel above. */
.cell__verdict {
  flex: 1 1 auto;
  min-width: 0;
  font-weight: 700;
  font-size: 15px;
  line-height: 1.3;
  font-family: var(--r-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-edit {
  font-size: 17px;
  font-weight: 700;
  color: var(--r-yellow);
}
.cell--pass {
  color: var(--r-green);
}
.cell--fail {
  color: var(--r-red);
}
.tally {
  font-family: var(--r-mono);
  font-size: 17px;
  font-weight: 700;
  margin-left: 4px;
}
.tally--pass {
  color: var(--r-green);
}
.tally--fail {
  color: var(--r-red);
}

/* ---- survived ---- */
.pane--kept {
  grid-column: 2;
  grid-row: 3;
  border-color: var(--r-green);
  border-left-width: 5px;
}
.pane__head--kept {
  align-items: center;
}
.pane__title--kept {
  font-size: 21px;
  color: var(--r-green);
  text-transform: lowercase;
}
.kept-wrap {
  --edge: var(--r-panel);
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
.kept {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kept li {
  margin: 0;
  display: flex;
  gap: 7px;
  align-items: flex-start;
  padding-bottom: 4px;
  border-bottom: 1px solid #232833;
}
.kept li:last-child {
  border-bottom: 0;
}
.kept__glyph {
  color: var(--r-green);
  font-size: 15px;
  line-height: 1.35;
  flex: none;
}
.kept__body {
  margin: 0;
  min-width: 0;
  font-size: 15px;
  line-height: 1.35;
}
.kept__code {
  font-family: var(--r-mono);
  color: var(--r-text);
  word-break: break-word;
}
.kept__why {
  color: var(--r-dim);
}
</style>
