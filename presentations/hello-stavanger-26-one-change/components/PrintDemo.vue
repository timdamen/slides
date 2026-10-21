<script setup lang="ts">
/**
 * AST example three — PRINT.
 *
 * One file. One correct edit. Three ways of getting it back onto disk.
 *
 * Everything on screen is computed from `printStrategies()` at render time.
 * There is not a single number written down in this component: the blank-line
 * counts, the changed-line counts, the indent width and the comment count are
 * all read off the real outputs of the real transform.
 *
 * The rhetorical shape the slide has to support:
 *
 *   the tree    the file beside the tree built from it, and a search that
 *               fails to find the blank lines or the comment anywhere in it
 *   button 1    the tree is re-printed  →  the room thinks "just run Prettier"
 *   button 2    Prettier is run         →  the indentation comes back, the
 *                                          blank-line counter does not move
 *   button 3    parse to locate, splice →  the file survives
 *
 * The first beat is the one the speaker asked for. Everything after it is a
 * consequence the room can derive rather than a claim it has to accept: the
 * blank lines vanish from the re-print because they were never in the tree,
 * and you watched a walk over every node fail to find one.
 *
 * The counter keeps the history of presses so that sequence reads 11 → 0 → 0 → 11,
 * and the step that did not move is flagged in the warning colour.
 *
 * Nothing here binds to Slidev's click state. The demo is driven by its own
 * buttons, and Reset puts it back exactly where it started.
 */
import { computed, ref } from 'vue'
import { PRINT_SOURCE, countBlankLines, printStrategies } from '../utils/transforms'
import type { PrintStrategy } from '../utils/transforms'
import { collapse, diffLines } from '../utils/diff'
import type { DiffLine } from '../utils/diff'
import { countTree, parseJs, toTree } from '../utils/ast'
import type { TreeNode } from '../utils/ast'
import AstInspector from './AstInspector.vue'

type Key = PrintStrategy['key']

/**
 * Which beat of the story this instance is carrying.
 *
 *   all       everything on one slide — the original, unchanged
 *   plain     the starting point: the file, the tree, and what is not in it
 *   migrate   the three ways back to disk: source, buttons, diff
 *   outcome   the verdict: the blank-line journey and what each way cost
 *
 * Each phase is a subset of the same panels driven by the same computed state.
 * A phase mounts fresh on its own slide, so neither one depends on the other
 * having been visited.
 *
 * `plain` is `migrate`'s opening beat and nothing else. It is the slide that
 * says "here is the file, here is its tree, and the blank lines you can see on
 * the left are not in it" — no comparison, no verdict, no way forward. The three
 * strategies, the diff and the counter chain all belong to the beats after it,
 * so this phase never mounts them and hands their space to the two panels that
 * stayed. `migrate` is untouched and stays available as a stage fallback.
 */
type Phase = 'all' | 'plain' | 'migrate' | 'outcome'

const props = withDefaults(
  defineProps<{
    /** Shown in the source pane header. The transform does not care. */
    filename?: string
    /** Unchanged lines kept either side of a hunk in the diff. */
    context?: number
    /** Which panels to render. Defaults to the single-slide original. */
    phase?: Phase
  }>(),
  { filename: 'src/entry.ts', context: 2, phase: 'all' },
)

/* -- the three buttons, in the order the talk needs them ------------------ */

/*
 * The one-line hint each button used to carry ("exactly what half the room is
 * already thinking", …) is narration, not data: it cost two wrapped lines per
 * button on a 470px canvas. The speaker says it out loud instead.
 */
const BUTTONS: { key: Key; ordinal: string; label: string }[] = [
  { key: 'reprint', ordinal: '1', label: 'reprint the tree' },
  { key: 'format', ordinal: '2', label: 'reprint, then run the formatter' },
  { key: 'splice', ordinal: '3', label: 'parse to locate, splice the bytes' },
]

/** Short caption under each number in the counter chain. */
const CHIP_LABEL: Record<Key, string> = {
  reprint: 'reprint',
  format: 'formatter',
  splice: 'splice',
}

/* -- the run -------------------------------------------------------------- */

/**
 * A parse error, or anything else the library throws, has to render as a red
 * message inside the panel. On a stage an unhandled throw blanks the slide.
 */
const run = computed<{ list: PrintStrategy[]; crash: string | null }>(() => {
  try {
    return { list: printStrategies(PRINT_SOURCE), crash: null }
  } catch (error: any) {
    return { list: [], crash: error?.message ?? String(error) }
  }
})

const sourceBlanks = computed(() => {
  try {
    return countBlankLines(PRINT_SOURCE)
  } catch {
    return 0
  }
})

const sourceLineCount = computed(() => PRINT_SOURCE.split('\n').length)

/** Narrowest run of leading spaces in a file — its indent unit. */
function indentUnit(code: string): number | null {
  let smallest: number | null = null
  for (const line of code.split('\n')) {
    const lead = /^ +/.exec(line)
    if (!lead) continue
    if (smallest === null || lead[0].length < smallest) smallest = lead[0].length
  }
  return smallest
}

function commentLineCount(code: string): number {
  return code.split('\n').filter((line) => line.trim().startsWith('//')).length
}

const sourceIndent = computed(() => indentUnit(PRINT_SOURCE))
const sourceComments = computed(() => commentLineCount(PRINT_SOURCE))

/* -- state ---------------------------------------------------------------- */

interface Step {
  /** Null for the starting point: the file as a person wrote it. */
  key: Key | null
  label: string
  blanks: number
}

/**
 * The outcome phase is a verdict, not a control panel: it opens on the finished
 * journey so the chain reads 11 → 0 → 0 → 11 the moment the slide mounts, with
 * no button ever pressed. The steps are read off `printStrategies()` in the
 * order the talk runs them, so the numbers stay live and Reset returns here.
 */
const INITIAL: Step[] =
  props.phase === 'outcome'
    ? run.value.list
        .filter((strategy) => !strategy.error)
        .map((strategy) => ({
          key: strategy.key,
          label: CHIP_LABEL[strategy.key],
          blanks: strategy.blankLines,
        }))
    : []
const selected = ref<Key | null>(null)
const presses = ref<Step[]>([...INITIAL])

const strategyFor = (key: Key): PrintStrategy | null =>
  run.value.list.find((entry) => entry.key === key) ?? null

const current = computed<PrintStrategy | null>(() =>
  selected.value ? strategyFor(selected.value) : null,
)

/** Cap the visible chain so a nervous stage press cannot overflow the band. */
const MAX_STEPS = 6

function press(key: Key): void {
  selected.value = key
  const strategy = strategyFor(key)
  // A strategy that could not run does not get to move the counter.
  if (!strategy || strategy.error) return
  const last = presses.value[presses.value.length - 1]
  // Two taps on the same button are one press, so the chain stays honest.
  if (last && last.key === key) return
  const next = [...presses.value, { key, label: CHIP_LABEL[key], blanks: strategy.blankLines }]
  if (next.length > MAX_STEPS) next.splice(0, next.length - MAX_STEPS)
  presses.value = next
}

function reset(): void {
  selected.value = null
  presses.value = [...INITIAL]
  asked.value = null
  probeAt.value = { blank: 0, comment: 0 }
  inspector.value?.reset()
}

/* -- the two beats of the migrate slide ----------------------------------- */

/**
 * `tree` is where the slide opens: the file beside the tree built from it, and
 * a search over that tree that comes back empty. Pressing any of the three
 * strategies moves to `diff`, and Reset comes back here.
 *
 * Derived, not stored: there is exactly one piece of state (has a strategy been
 * pressed) and it already exists. `plain` IS this stage — it renders no button
 * that could leave it, so it is pinned here rather than merely starting here.
 * The other two phases never see `tree`.
 */
const stage = computed<'tree' | 'diff'>(() =>
  props.phase === 'plain' || (props.phase === 'migrate' && !selected.value) ? 'tree' : 'diff',
)

/* -- the tree, and what is not in it -------------------------------------- */

/**
 * The same parse, on the same string, with the same functions the inspector
 * next to it uses — so "190 nodes" is one number and not two opinions.
 */
const printParse = computed(() => {
  try {
    return parseJs(PRINT_SOURCE)
  } catch (error: any) {
    return {
      ast: null,
      error: error?.message ?? String(error),
      comments: [] as { start: number; end: number }[],
    }
  }
})

const printTree = computed<TreeNode | null>(() =>
  printParse.value.ast ? toTree(printParse.value.ast) : null,
)

const treeError = computed(() => printParse.value.error)

/** Rows in the tree on the right — counted off the tree, not guessed at. */
const treeNodeCount = computed(() => countTree(printTree.value))

/** A range of characters in the file, and the line it starts on. */
interface Span {
  start: number
  end: number
  line: number
}

function lineAt(offset: number): number {
  return PRINT_SOURCE.slice(0, offset).split('\n').length
}

/**
 * Every empty line, as the range of characters it occupies — which for an empty
 * line is a range of length zero. That is the first half of the joke: there is
 * nothing there for a node to cover.
 *
 * The trailing-newline strip mirrors `countBlankLines`, so this list can never
 * be a different length from the number in the counter band.
 */
const blankSpans = computed<Span[]>(() => {
  const out: Span[] = []
  let at = 0
  PRINT_SOURCE.replace(/\n$/, '')
    .split('\n')
    .forEach((text, index) => {
      if (text.trim() === '') out.push({ start: at, end: at + text.length, line: index + 1 })
      at += text.length + 1
    })
  return out
})

/**
 * Where the comments are.
 *
 * Note where this comes from: `parseJs` hands them back on the SIDE, next to
 * the tree rather than inside it, because an ESTree has nowhere to put one.
 */
const commentSpans = computed<Span[]>(() =>
  printParse.value.comments.map((comment) => ({
    start: comment.start,
    end: comment.end,
    line: lineAt(comment.start),
  })),
)

interface Search {
  /** Nodes actually visited by the walk below. */
  visited: number
  /** Nodes whose TYPE names the thing we are looking for. */
  named: number
  /** Nodes that BEGIN inside one of the ranges we are looking at. */
  begins: number
  hits: number
}

/**
 * Walk the whole tree and ask it, twice, for something that is not in it.
 *
 * Both questions are the ones a codemod would really ask — is there a node of
 * this kind, and is there a node at this position — and both are answered by
 * visiting every node. Nothing here is written down in advance: if acorn ever
 * started emitting a node for a blank line, this would say so.
 */
function searchTree(spans: Span[], words: string[]): Search {
  let visited = 0
  let named = 0
  let begins = 0
  const visit = (node: TreeNode) => {
    visited += 1
    const type = node.type.toLowerCase()
    if (words.some((word) => type.includes(word))) named += 1
    if (spans.some((span) => node.start >= span.start && node.start <= span.end)) begins += 1
    node.children.forEach(visit)
  }
  if (printTree.value) visit(printTree.value)
  return { visited, named, begins, hits: named + begins }
}

type ProbeKey = 'blank' | 'comment'

interface Probe extends Search {
  key: ProbeKey
  /** Button text. */
  label: string
  spans: Span[]
  /** What the walk found, in numbers. */
  says: string
  /** What that means, in one clause. Only ever shown when hits is zero. */
  so: string
}

const blankProbe = computed<Probe>(() => {
  const spans = blankSpans.value
  const found = searchTree(spans, ['blank', 'empty', 'whitespace', 'newline'])
  return {
    key: 'blank',
    label: 'find the blank lines',
    spans,
    ...found,
    says:
      `Walked all ${found.visited} nodes: ${found.named} typed as a blank line, ` +
      `${found.begins} beginning on any of the ${spans.length} empty lines.`,
    so: 'They were never in here to be thrown away.',
  }
})

const commentProbe = computed<Probe>(() => {
  const spans = commentSpans.value
  const found = searchTree(spans, ['comment'])
  return {
    key: 'comment',
    label: 'find the comment',
    spans,
    ...found,
    says:
      `Walked all ${found.visited} nodes: ${found.named} typed as a comment, ` +
      `${found.begins} beginning inside the ${spans.length} comment lines.`,
    so: 'acorn hands it back on the side, outside the tree.',
  }
})

const probes = computed<Probe[]>(() => [blankProbe.value, commentProbe.value])

/** Which question was asked last, and which of its ranges we walked to. */
const asked = ref<ProbeKey | null>(null)
const probeAt = ref<Record<ProbeKey, number>>({ blank: 0, comment: 0 })

const inspector = ref<InstanceType<typeof AstInspector> | null>(null)

const answer = computed<Probe | null>(() =>
  asked.value ? (probes.value.find((probe) => probe.key === asked.value) ?? null) : null,
)

/**
 * Ask the tree, and take the inspector to the place we asked about.
 *
 * Pressing the same button again steps to the next range, so the speaker can
 * walk the room down all eleven blank lines and get the same answer eleven
 * times. Index arithmetic only — deterministic, and Reset puts it back to one.
 */
function ask(key: ProbeKey): void {
  const probe = probes.value.find((entry) => entry.key === key)
  if (!probe) return
  const count = probe.spans.length
  if (asked.value === key && count > 0) {
    probeAt.value = { ...probeAt.value, [key]: (probeAt.value[key] + 1) % count }
  }
  asked.value = key
  const span = probe.spans[probeAt.value[key]]
  // The inspector then says, in its own words, that the smallest node
  // containing this character is whatever merely surrounds it.
  if (span) inspector.value?.pickOffset(span.start)
}

/** Which one of N the inspector is currently sitting on. */
const askedAt = computed(() => (asked.value ? probeAt.value[asked.value] + 1 : 0))

/**
 * The hole in the numbers.
 *
 * Every node is a label and two offsets. Take the node that ENDS before this
 * range and the node that BEGINS after it, and the characters in between are
 * covered by nothing — which is the same hole you can read straight off the
 * tree on the right, where one statement ends at 278 and the next starts at
 * 424. Both ends are found by walking; neither is written down.
 */
interface Gap {
  before: number
  after: number
  unowned: number
  line: number
}

function gapAround(span: Span): Gap | null {
  if (!printTree.value) return null
  let before = -1
  let after = Number.POSITIVE_INFINITY
  const visit = (node: TreeNode) => {
    if (node.end <= span.start && node.end > before) before = node.end
    if (node.start >= span.end && node.start < after) after = node.start
    node.children.forEach(visit)
  }
  visit(printTree.value)
  if (before < 0 || !Number.isFinite(after)) return null
  return { before, after, unowned: after - before, line: span.line }
}

const gap = computed<Gap | null>(() => {
  const probe = answer.value
  if (!probe) return null
  const span = probe.spans[probeAt.value[probe.key]]
  return span ? gapAround(span) : null
})

/* Definite pixel height for the inspector: 385 of slide, less the probe bar
   above it and the gap between them. A percentage never resolves.

   `plain` runs a shorter bar (44px, since it lost the button on the end) and a
   tighter gap, and it hides the inspector's own header row — between them the
   file and the tree get about forty more pixels than the migrate slide gives
   them. Change either number here and change the matching CSS below. */
const TREE_H = computed(() => (props.phase === 'plain' ? 385 - 44 - 6 : 385 - 46 - 8))

/* -- the counter chain ---------------------------------------------------- */

type Tone = 'start' | 'good' | 'warn' | 'bad'

interface Chip extends Step {
  tone: Tone
  unchanged: boolean
}

const chain = computed<Chip[]>(() => {
  const steps: Step[] = [
    { key: null, label: 'as written', blanks: sourceBlanks.value },
    ...presses.value,
  ]
  return steps.map((step, index) => {
    if (index === 0) return { ...step, tone: 'start' as Tone, unchanged: false }
    const previous = steps[index - 1].blanks
    if (step.blanks === previous) return { ...step, tone: 'warn' as Tone, unchanged: true }
    return { ...step, tone: step.blanks < previous ? ('bad' as Tone) : ('good' as Tone), unchanged: false }
  })
})

/** One sentence, composed from the numbers, never authored per strategy. */
const verdict = computed<{ tone: Tone | 'idle'; text: string }>(() => {
  if (run.value.crash) {
    return { tone: 'bad', text: `the transform threw: ${run.value.crash}` }
  }
  const strategy = current.value
  if (!strategy) {
    return {
      tone: 'idle',
      text: `nothing has run yet — the file on the left has ${sourceBlanks.value} blank lines in it`,
    }
  }
  if (strategy.error) return { tone: 'bad', text: strategy.error }

  const tail = chain.value[chain.value.length - 1]
  if (tail?.unchanged) {
    return {
      tone: 'warn',
      text: `still ${tail.blanks} — the blank-line count did not move`,
    }
  }
  if (strategy.blankLines === sourceBlanks.value) {
    return { tone: 'good', text: `all ${sourceBlanks.value} blank lines are still there` }
  }
  const lost = sourceBlanks.value - strategy.blankLines
  return {
    tone: 'bad',
    text: `${lost} of the author's ${sourceBlanks.value} blank lines are gone, and nothing can put them back`,
  }
})

/* -- source pane ---------------------------------------------------------- */

const sourceRows = computed(() =>
  PRINT_SOURCE.split('\n').map((text, index) => ({
    n: index + 1,
    text,
    blank: text.trim() === '',
  })),
)

/* -- diff pane ------------------------------------------------------------ */

interface Row {
  kind: 'same' | 'add' | 'del' | 'gap'
  sign: string
  text: string
}

const SIGN: Record<string, string> = { add: '+', del: '-', same: ' ', gap: ' ' }

const diffRows = computed<Row[]>(() => {
  const strategy = current.value
  if (!strategy || strategy.error) return []
  try {
    return collapse(diffLines(PRINT_SOURCE, strategy.code), props.context).map((row) =>
      row.kind === 'gap'
        ? { kind: 'gap' as const, sign: ' ', text: `⋯ ${(row as { count: number }).count} unchanged lines` }
        : {
            kind: (row as DiffLine).kind,
            sign: SIGN[(row as DiffLine).kind] ?? ' ',
            text: (row as DiffLine).text,
          },
    )
  } catch {
    return []
  }
})

/** The library's own count, not a recount of the rows we happen to render. */
const changedLines = computed(() => current.value?.changedLines ?? 0)

/** Red when the output lost blank lines, green when it kept them. */
const changedTone = computed<Tone>(() => {
  const strategy = current.value
  if (!strategy) return 'start'
  return strategy.blankLines < sourceBlanks.value ? 'bad' : 'good'
})

interface Fact {
  term: string
  value: string
  tone: Tone
}

const facts = computed<Fact[]>(() => {
  const strategy = current.value
  if (!strategy || strategy.error) return []
  const indent = indentUnit(strategy.code)
  const comments = commentLineCount(strategy.code)
  return [
    {
      term: 'indent',
      value: indent === null ? 'none' : `${indent} spaces`,
      tone: indent === sourceIndent.value ? 'good' : 'bad',
    },
    {
      term: 'comment lines',
      value: `${comments} of ${sourceComments.value}`,
      tone: comments === sourceComments.value ? 'good' : 'bad',
    },
    {
      term: 'blank lines',
      value: `${strategy.blankLines} of ${sourceBlanks.value}`,
      tone: strategy.blankLines === sourceBlanks.value ? 'good' : 'bad',
    },
  ]
})

/* -- the ledger (outcome phase) ------------------------------------------- */

interface LedgerRow {
  key: Key
  ordinal: string
  label: string
  changed: number
  blanks: number
  tone: Tone
  /** The beat the talk turns on, and only when the outputs still say so. */
  note: string | null
}

/**
 * All three strategies at once, side by side, every figure taken from the same
 * `printStrategies()` run the buttons use. The middle row's note is derived,
 * not authored: it appears only while that output really did get its indent
 * back and really is still missing blank lines.
 */
const ledger = computed<LedgerRow[]>(() =>
  BUTTONS.flatMap((button) => {
    const strategy = strategyFor(button.key)
    if (!strategy || strategy.error) return []
    const keptIndent = indentUnit(strategy.code) === sourceIndent.value
    const lostBlanks = strategy.blankLines < sourceBlanks.value
    return [
      {
        key: button.key,
        ordinal: button.ordinal,
        label: button.label,
        changed: strategy.changedLines,
        blanks: strategy.blankLines,
        tone: (lostBlanks ? (keptIndent ? 'warn' : 'bad') : 'good') as Tone,
        note: lostBlanks && keptIndent ? 'indentation restored, blank lines still gone' : null,
      },
    ]
  }),
)

</script>

<template>
  <div class="pd" :class="[`pd--${phase}`, `pd--at-${stage}`]">
    <!-- ── beat one: ask the tree for the things that are not in it ────── -->
    <section v-if="stage === 'tree'" class="probe" aria-label="Search the tree">
      <h2 class="probe__h">Is it in the tree?</h2>
      <button
        v-for="probe in probes"
        :key="probe.key"
        type="button"
        class="probe__btn"
        :class="{ 'probe__btn--on': asked === probe.key }"
        :aria-pressed="asked === probe.key"
        @click="ask(probe.key)"
      >
        {{ probe.label }}
      </button>
      <button type="button" class="reset reset--probe" @click="reset()">Reset</button>
      <!-- The transition, and the same press the ways row's first button is:
           the room has just watched the search fail, so the next thing to do is
           print the tree and see the consequence.

           Not on the `plain` slide. There the file and its tree are the whole
           point, and the consequence of printing one is two beats away. -->
      <button v-if="phase !== 'plain'" type="button" class="probe__go" @click="press('reprint')">
        <span class="probe__gon" aria-hidden="true">1</span>
        <span>now print the tree</span>
        <span aria-hidden="true">→</span>
      </button>
    </section>

    <!-- ── the counter band ────────────────────────────────────────────── -->
    <section v-if="stage !== 'tree'" class="band">
      <h2 class="band__title">Blank lines</h2>

      <div class="band__meter" aria-live="polite">
        <div class="chain">
          <template v-for="(chip, index) in chain" :key="index">
            <span v-if="index > 0" class="chain__arrow" aria-hidden="true">→</span>
            <span class="chip" :class="`chip--${chip.tone}`">
              <span class="chip__n">{{ chip.blanks }}</span>
              <span class="chip__cap">{{ chip.label }}</span>
              <span v-if="chip.unchanged" class="chip__flag">unchanged</span>
            </span>
          </template>
        </div>
        <!-- The verdict sentence exists to carry the whole argument on a single
             slide. Split in two, the migrate slide has the chain plus the diff's
             own blank-line fact, and the outcome slide is the verdict. -->
        <p v-if="phase === 'all'" class="verdict" :class="`verdict--${verdict.tone}`">{{ verdict.text }}</p>
      </div>

      <button type="button" class="reset" @click="reset()">Reset</button>
    </section>

    <!-- ── the file, and the tree built from it ────────────────────────── -->
    <AstInspector
      v-if="stage === 'tree'"
      ref="inspector"
      class="tree"
      :source="PRINT_SOURCE"
      lang="js"
      :height="TREE_H"
      :initial-depth="1"
    >
      <!-- The inspector's own footer fact, replaced by the one this slide is
           about. Every figure in it was measured a moment ago. -->
      <template #fact>
        <div class="probe__foot">
          <p v-if="treeError" class="bad-note">it could not parse: {{ treeError }}</p>
          <template v-else>
            <p class="probe__counts">
              {{ sourceLineCount }} lines of text
              <span class="probe__dot" aria-hidden="true">·</span>
              <span class="probe__hot">{{ sourceBlanks }} blank</span>
              <span class="probe__dot" aria-hidden="true">·</span>
              {{ sourceComments }} comment lines
              <span class="probe__dot" aria-hidden="true">·</span>
              {{ treeNodeCount }} nodes in the tree
              <span class="probe__dot" aria-hidden="true">·</span>
              <span class="probe__hot">{{ blankProbe.hits }}</span> of them a blank line
              <span class="probe__dot" aria-hidden="true">·</span>
              <span class="probe__hot">{{ commentProbe.hits }}</span> a comment
            </p>
            <p class="probe__out" aria-live="polite">
              <template v-if="answer">
                <span class="probe__says">{{ answer.says }}</span>
                <span v-if="answer.hits === 0" class="probe__so">{{ answer.so }}</span>
                <!-- The hole, in the same two numbers every node is made of.
                     Both ends of it are visible in the tree on the right. -->
                <span v-if="gap" class="probe__gap">
                  <span class="probe__which">#{{ askedAt }} of {{ answer.spans.length }}</span>
                  <!-- "in the gap between" and not "between": two blank lines
                       either side of the comment really do share one hole, and
                       the wording has to survive seeing the same pair twice. -->
                  line {{ gap.line }} falls in the gap
                  <strong>{{ gap.before }}–{{ gap.after }}</strong>:
                  {{ gap.unowned }} characters no node covers.
                </span>
              </template>
              <span v-else class="probe__idle">
                Don't take my word for it — press a button and the walk happens in front of
                you. Or click any line on the left and see which node claims it.
              </span>
            </p>
          </template>
        </div>
      </template>
    </AstInspector>

    <!-- ── the three ways back to disk ─────────────────────────────────── -->
    <div
      v-if="phase !== 'outcome' && stage !== 'tree'"
      class="ways"
      role="group"
      aria-label="Three ways to write the edited tree back to disk"
    >
      <button
        v-for="button in BUTTONS"
        :key="button.key"
        type="button"
        class="way"
        :class="{ 'way--on': selected === button.key }"
        :aria-pressed="selected === button.key"
        @click="press(button.key)"
      >
        <span class="way__n" aria-hidden="true">{{ button.ordinal }}</span>
        <span class="way__label">{{ button.label }}</span>
      </button>
    </div>

    <!-- ── source | diff ───────────────────────────────────────────────── -->
    <div v-if="phase !== 'outcome' && stage !== 'tree'" class="panes">
      <section class="pane">
        <header class="pane__head">
          <h3 class="pane__h">The file a person wrote</h3>
          <p class="pane__meta">
            {{ filename }} · {{ sourceLineCount }} lines ·
            <span class="pane__meta-hot">{{ sourceBlanks }} blank</span>
          </p>
        </header>
        <pre
          class="code"
          tabindex="0"
          role="group"
          :aria-label="`Source of ${filename}, read only`"
        ><code class="code__inner"><span v-for="row in sourceRows" :key="row.n" class="sline" :class="{ 'sline--blank': row.blank }"><span class="sline__n" aria-hidden="true">{{ row.n }}</span><span class="sline__t">{{ row.text }}</span></span></code></pre>
      </section>

      <section class="pane">
        <header class="pane__head pane__head--diff" aria-live="polite">
          <div class="pane__headline">
            <h3 class="pane__h">The diff a reviewer sees</h3>
            <p class="pane__meta">{{ current ? current.label : 'press one of the three buttons above' }}</p>
          </div>
          <p v-if="current && !current.error" class="count" :class="`count--${changedTone}`">
            <span class="count__n">{{ changedLines }}</span>
            <span class="count__l">changed<br />lines</span>
          </p>
        </header>

        <p v-if="facts.length" class="facts">
          <span v-for="fact in facts" :key="fact.term" class="fact">
            <span class="fact__t">{{ fact.term }}</span>
            <span class="fact__v" :class="`fact__v--${fact.tone}`">{{ fact.value }}</span>
          </span>
        </p>

        <p v-if="run.crash" class="bad-note">{{ run.crash }}</p>
        <p v-else-if="current && current.error" class="bad-note">{{ current.error }}</p>
        <p v-else-if="!current" class="idle-note">
          One correct edit, three ways back to disk. The transform is right every time — watch
          what happens to everything the parser threw away.
        </p>
        <pre
          v-else
          class="code code--diff"
          tabindex="0"
          role="group"
          :aria-label="`Diff for: ${current.label}`"
        ><code class="code__inner"><span v-for="(row, index) in diffRows" :key="index" class="drow" :class="[`drow--${row.kind}`, { 'drow--empty': row.text === '' }]"><span class="drow__s" aria-hidden="true">{{ row.sign }}</span><span class="drow__t">{{ row.text }}</span></span></code></pre>
      </section>
    </div>

    <!-- ── what each one cost ──────────────────────────────────────────── -->
    <section
      v-if="phase === 'outcome'"
      class="ledger"
      aria-label="What each way back to disk cost"
    >
      <p v-if="run.crash" class="bad-note">{{ run.crash }}</p>
      <article v-for="row in ledger" :key="row.key" class="led" :class="`led--${row.tone}`">
        <div class="led__name">
          <span class="led__n" aria-hidden="true">{{ row.ordinal }}</span>
          <span class="led__text">
            <span class="led__label">{{ row.label }}</span>
            <span v-if="row.note" class="led__note">{{ row.note }}</span>
          </span>
        </div>
        <p class="led__stat">
          <span class="led__v">{{ row.changed }}</span>
          <span class="led__k">changed<br />lines</span>
        </p>
        <p class="led__stat">
          <span class="led__v" :class="`led__v--${row.tone}`">{{ row.blanks }} of {{ sourceBlanks }}</span>
          <span class="led__k">blank<br />lines</span>
        </p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.pd {
  /* Definite height, not 100%: the slide's content box is auto-height, so a
     percentage never resolves and the inner flex chain grows unbounded. */
  height: 470px;
  max-height: 470px;
  --pd-bg: var(--bg, #0f1115);
  --pd-panel: var(--panel, #171a21);
  --pd-head: #12151b;
  --pd-text: var(--text, #e9ecef);
  --pd-dim: var(--dim, #adb5bd);
  --pd-blue: var(--blue, #74c0fc);
  --pd-yellow: var(--yellow, #ffd43b);
  --pd-red: var(--red, #ff8787);
  --pd-green: var(--green, #69db7c);
  --pd-border: var(--border, #39404d);
  --pd-mono: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  color: var(--pd-text);
  font-size: 0.95rem;
  line-height: 1.3;
}

/* ── counter band ───────────────────────────────────────────────────────── */

.band {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  padding: 5px 9px;
  border: 1px solid var(--pd-border);
  border-radius: 8px;
  background-color: var(--pd-panel);
}
.band__title {
  flex: none;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.01em;
  white-space: nowrap;
  color: var(--pd-text);
}
.band__meter {
  flex: 1;
  min-width: 0;
}
.chain {
  display: flex;
  align-items: stretch;
  gap: 3px;
  /* Sized so all MAX_STEPS + 1 chips fit without scrolling; the auto is only a
     last-resort valve if the caption text ever gets longer. */
  overflow-x: auto;
}
.chain__arrow {
  align-self: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--pd-dim);
  flex: none;
}
.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: none;
  /* Held at the height of a chip that is carrying the "unchanged" flag, so the
     band does not resize — and shove the panes down — on the second press. */
  min-height: 66px;
  min-width: 58px;
  padding: 1px 4px;
  border: 2px solid var(--pd-border);
  border-radius: 7px;
  background-color: var(--pd-head);
}
.chip__n {
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.chip__cap {
  font-size: 0.8rem;
  line-height: 1.15;
  color: var(--pd-dim);
}
.chip__flag {
  padding: 0 5px;
  border-radius: 999px;
  background-color: var(--pd-yellow);
  color: #0f1115;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
}
.chip--start .chip__n {
  color: var(--pd-text);
}
.chip--good {
  border-color: var(--pd-green);
}
.chip--good .chip__n {
  color: var(--pd-green);
}
.chip--bad {
  border-color: var(--pd-red);
}
.chip--bad .chip__n {
  color: var(--pd-red);
}
.chip--warn {
  border-color: var(--pd-yellow);
}
.chip--warn .chip__n {
  color: var(--pd-yellow);
}
.verdict {
  margin: 2px 0 0;
  font-size: 0.9rem;
  line-height: 1.2;
  color: var(--pd-dim);
}
.verdict--warn {
  color: var(--pd-yellow);
  font-weight: 700;
}
.verdict--bad {
  color: var(--pd-red);
  font-weight: 700;
}
.verdict--good {
  color: var(--pd-green);
  font-weight: 700;
}

.reset {
  flex: none;
  align-self: center;
  padding: 6px 13px;
  border: 2px solid var(--pd-border);
  border-radius: 7px;
  background-color: var(--pd-head);
  color: var(--pd-text);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}
.reset:hover {
  border-color: var(--pd-blue);
  color: var(--pd-blue);
}

/* ── the three buttons ──────────────────────────────────────────────────── */

.ways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  flex: none;
}
.way {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 54px;
  padding: 6px 10px;
  border: 2px solid var(--pd-border);
  border-radius: 8px;
  background-color: var(--pd-panel);
  color: var(--pd-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.way:hover {
  border-color: var(--pd-blue);
}
.way__n {
  flex: none;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--pd-head);
  border: 1px solid var(--pd-border);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pd-blue);
}
.way__label {
  min-width: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.15;
}
.way--on {
  background-color: var(--pd-blue);
  border-color: var(--pd-blue);
  color: #0f1115;
}
.way--on .way__n {
  background-color: #0f1115;
  border-color: #0f1115;
  color: var(--pd-blue);
}

.reset:focus-visible,
.way:focus-visible {
  outline: 3px solid var(--pd-yellow);
  outline-offset: 2px;
}

/* ── panes ──────────────────────────────────────────────────────────────── */

.panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 6px;
  flex: 1;
  min-height: 0;
}
.pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--pd-border);
  border-radius: 8px;
  background-color: var(--pd-panel);
  overflow: hidden;
}
.pane__head {
  flex: none;
  padding: 4px 9px;
  border-bottom: 1px solid var(--pd-border);
  background-color: var(--pd-head);
}
.pane__head--diff {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.pane__headline {
  min-width: 0;
}
.pane__h {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--pd-text);
}
.pane__meta {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.2;
  color: var(--pd-dim);
}
.pane__meta-hot {
  color: var(--pd-yellow);
  font-weight: 700;
}
.count {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}
.count__n {
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.count__l {
  font-size: 0.8rem;
  line-height: 1.1;
  color: var(--pd-dim);
}
.count--bad .count__n {
  color: var(--pd-red);
}
.count--good .count__n {
  color: var(--pd-green);
}
.count--start .count__n {
  color: var(--pd-text);
}

.facts {
  flex: none;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  padding: 3px 9px;
  border-bottom: 1px solid var(--pd-border);
  background-color: var(--pd-head);
  font-size: 0.85rem;
  line-height: 1.2;
}
.fact__t {
  color: var(--pd-dim);
}
.fact__v {
  margin-left: 6px;
  font-family: var(--pd-mono);
  font-weight: 700;
}
.fact__v--good {
  color: var(--pd-green);
}
.fact__v--bad {
  color: var(--pd-red);
}

.idle-note,
.bad-note {
  margin: 0;
  padding: 8px 10px;
  font-size: 0.9rem;
  line-height: 1.35;
}
.idle-note {
  color: var(--pd-dim);
}
.bad-note {
  color: var(--pd-red);
  font-family: var(--pd-mono);
  font-weight: 700;
  border-left: 4px solid var(--pd-red);
}

/* ── code / diff bodies ─────────────────────────────────────────────────── */

.code {
  margin: 0;
  flex: 1;
  min-height: 0;
  /* Safety net: if the slide layout ever hands this component an auto height,
     the panes still cannot grow past the canvas and push the counter off-slide.
     Under the normal flex layout the pane is shorter than this, so it never
     binds; it only catches the auto-height case. */
  max-height: none;
  overflow: auto;
  padding: 2px 0;
  font-family: var(--pd-mono);
  font-size: 0.95rem;
  line-height: 1.35;
  white-space: pre;
  tab-size: 2;
}
.code:focus-visible {
  outline: 3px solid var(--pd-yellow);
  outline-offset: -3px;
}
/* Stretch every row to the full scroll width so the blank-line bands do not
   stop short when the pane is scrolled sideways. */
.code__inner {
  display: inline-block;
  min-width: 100%;
}

.sline {
  display: block;
  min-height: 1.35em;
  padding-right: 10px;
  color: var(--pd-text);
  border-left: 3px solid transparent;
}
.sline__n {
  display: inline-block;
  width: 2.5ch;
  margin-right: 1.2ch;
  text-align: right;
  color: var(--pd-dim);
  user-select: none;
}
.sline--blank {
  background-color: rgba(255, 212, 59, 0.12);
  border-left-color: var(--pd-yellow);
}

.drow {
  display: block;
  min-height: 1.35em;
  padding-right: 10px;
  color: var(--pd-dim);
}
.drow__s {
  display: inline-block;
  width: 2ch;
  padding-left: 0.6ch;
  font-weight: 700;
  user-select: none;
}
.drow--add {
  background-color: rgba(105, 219, 124, 0.13);
  color: var(--pd-green);
}
.drow--del {
  background-color: rgba(255, 135, 135, 0.13);
  color: var(--pd-red);
}
.drow--gap {
  color: var(--pd-dim);
  font-style: italic;
}
/* A removed or added *blank* line is the whole point of this slide, so it gets
   a marker of its own rather than reading as an empty row. */
.drow--empty.drow--del,
.drow--empty.drow--add {
  outline: 1px dashed currentColor;
  outline-offset: -2px;
}

/* ── phase: shared ──────────────────────────────────────────────────────── */

/* The split phases sit under a short <h1>, which leaves 385px, not 470px.
   Definite height for the same reason as .pd — the slide's content box is
   auto-height, so a percentage never resolves. */
.pd--plain,
.pd--migrate,
.pd--outcome {
  height: 385px;
  max-height: 385px;
  gap: 8px;
}

/* ── phase: migrate, beat one — the tree ────────────────────────────────── */

/*
 * The probe bar takes the counter band's place at the top of the slide, at the
 * same height, so pressing "now print the tree" swaps the strip in place rather
 * than shunting the rest of the slide up. Its 46px is the number `TREE_H`
 * subtracts, so if you change it, change that too.
 */
.probe {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  height: 46px;
  padding: 0 12px;
  border: 1px solid var(--pd-border);
  border-radius: 8px;
  background-color: var(--pd-panel);
}
.probe__h {
  flex: none;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.15;
  white-space: nowrap;
  color: var(--pd-text);
}
.probe__btn {
  flex: none;
  padding: 5px 12px;
  border: 2px solid var(--pd-border);
  border-radius: 7px;
  background-color: var(--pd-head);
  color: var(--pd-text);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
}
.probe__btn:hover {
  border-color: var(--pd-blue);
}
.probe__btn--on {
  background-color: var(--pd-blue);
  border-color: var(--pd-blue);
  color: #0f1115;
}
/* Pushed to the far end, away from the two search buttons: it is the answer to
   a different question, and a stage press must never land on the wrong one. */
.reset--probe {
  margin-left: auto;
}
.probe__go {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 13px;
  border: 2px solid var(--pd-yellow);
  border-radius: 7px;
  background-color: var(--pd-head);
  color: var(--pd-yellow);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
}
.probe__go:hover {
  background-color: var(--pd-yellow);
  color: #0f1115;
}
.probe__gon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 0.85rem;
}
.probe__btn:focus-visible,
.probe__go:focus-visible {
  outline: 3px solid var(--pd-yellow);
  outline-offset: 2px;
}
.probe__go:focus-visible {
  outline-color: var(--pd-blue);
}

/* The inspector's own definite height comes from `TREE_H` as a prop, so this
   only has to stop the flex parent from stretching it. */
.tree {
  flex: none;
}

/* ---- the footer that replaces the inspector's own fact line ---- */

.probe__foot {
  display: flex;
  flex-direction: column;
  gap: 2px;
  /* Held at the height of the tallest of the three answers, so pressing a
     button never resizes the panes above it. Every answer is written to fit on
     two lines at this width; lengthen one and the panes above will jump. */
  min-height: 56px;
}
.probe__counts {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.25;
  color: var(--pd-dim);
}
.probe__hot {
  color: var(--pd-yellow);
  font-weight: 700;
}
.probe__dot {
  padding: 0 4px;
}
.probe__out {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.25;
}
.probe__idle {
  color: var(--pd-dim);
}
.probe__says {
  font-family: var(--pd-mono);
  color: var(--pd-text);
}
.probe__so {
  margin-left: 8px;
  color: var(--pd-yellow);
  font-weight: 700;
}
.probe__gap {
  margin-left: 8px;
  color: var(--pd-dim);
}
.probe__gap strong {
  font-family: var(--pd-mono);
  font-weight: 700;
  color: var(--pd-blue);
}
.probe__which {
  margin-right: 5px;
  color: var(--pd-text);
  font-weight: 700;
}

/* One Reset on the slide, not two: the probe bar's own button resets both this
   component and the inspector inside it, so the inspector's is redundant. */
.pd--at-tree :deep(.ai__reset) {
  display: none;
}

/* ── phase: plain — the starting point ──────────────────────────────────── */

/*
 * Same two panels as the migrate slide's opening beat, with everything that
 * argued a case taken off. What is left is a file, a tree, and two honest
 * questions — so the file and the tree get the pixels back.
 *
 * Where the forty pixels come from, since the tree beat already filled the
 * slide: 2 off the probe bar (it lost the button on its right-hand end), 2 off
 * the gap under it, and the inspector's own header row, which was a hint, a
 * node count the counts strip below already carries, and a Reset this slide
 * hides anyway.
 */
.pd--plain {
  gap: 6px;
}
.pd--plain .probe {
  height: 44px;
  gap: 12px;
  padding: 0 14px;
}
.pd--plain .probe__h {
  font-size: 1.1rem;
}
.pd--plain .probe__btn {
  padding: 6px 14px;
  font-size: 1rem;
}
.pd--plain .reset--probe {
  font-size: 0.95rem;
  padding: 7px 15px;
}

/* The header row the two panels are getting their height from. Everything in
   it is either restated in the counts strip or hidden already. */
.pd--plain :deep(.ai__bar) {
  display: none;
}
/* Nothing above the panels any more, so the inspector's internal gap is only
   the one under them. */
.pd--plain :deep(.ai) {
  gap: 7px;
}
/* A little more air between the file and the tree now that both are wider than
   the text they hold. */
.pd--plain :deep(.ai__grid) {
  gap: 11px;
}
/* The one panel in here that can eat the file's rows: a long node's text is
   scrollable, so capping it shorter costs nothing and buys two lines of source
   on every selection. */
.pd--plain :deep(.ai__slice) {
  max-height: 50px;
}
/* Both panels read as the thing on the slide, not as a sub-panel of one. */
.pd--plain :deep(.ai__src),
.pd--plain :deep(.ai__slice) {
  font-size: 16px !important;
}
.pd--plain :deep(.ai__type),
.pd--plain :deep(.ai__detail) {
  font-size: 16px;
}
.pd--plain :deep(.ai__range) {
  font-size: 15px;
}
.pd--plain .probe__counts,
.pd--plain .probe__out {
  font-size: 0.9rem;
}

/* ── phase: migrate ─────────────────────────────────────────────────────── */

/* Half the panels are gone, so the ones that stayed get the room: the counter
   band drops to a single strip of chips and hands its height to the code. */
.pd--migrate .band {
  padding: 5px 12px;
  gap: 14px;
}
.pd--migrate .chip {
  flex-direction: row;
  align-items: baseline;
  gap: 7px;
  /* Never squeezed: a clipped chip is a wrong number on a stage. */
  flex: none;
  min-height: 0;
  min-width: 0;
  padding: 3px 9px;
}
.pd--migrate .chip__n {
  font-size: 1.35rem;
}
.pd--migrate .chip__cap,
.pd--migrate .chip__flag {
  font-size: 0.85rem;
}
.pd--migrate .reset {
  font-size: 0.95rem;
  padding: 7px 15px;
}

.pd--migrate .ways {
  gap: 8px;
}
.pd--migrate .way {
  min-height: 56px;
  padding: 8px 12px;
  gap: 11px;
}
.pd--migrate .way__label {
  font-size: 1.05rem;
  line-height: 1.2;
}

.pd--migrate .panes {
  /* A little more of the width to the diff, so its three facts stay on one
     line: wrapping them costs the diff body a whole row of code. */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 8px;
}
.pd--migrate .pane__head {
  padding: 6px 12px;
}
.pd--migrate .pane__h {
  font-size: 1.05rem;
}
.pd--migrate .pane__meta,
.pd--migrate .count__l {
  font-size: 0.85rem;
}
.pd--migrate .facts {
  gap: 3px 16px;
  padding: 5px 12px;
  font-size: 0.85rem;
}
.pd--migrate .idle-note,
.pd--migrate .bad-note {
  padding: 10px 12px;
  font-size: 0.95rem;
}
.pd--migrate .code {
  padding: 4px 0;
  font-size: 1rem;
  line-height: 1.45;
}
.pd--migrate .sline,
.pd--migrate .drow {
  min-height: 1.45em;
  padding-right: 14px;
}

/* ── phase: outcome ─────────────────────────────────────────────────────── */

/* Here the chain is the slide. Nothing competes with it. */
.pd--outcome .band {
  padding: 8px 16px;
  gap: 16px;
}
.pd--outcome .band__title {
  font-size: 1.15rem;
}
.pd--outcome .chain {
  gap: 6px;
  overflow-x: visible;
}
.pd--outcome .chain__arrow {
  font-size: 1.15rem;
}
.pd--outcome .chip {
  min-height: 94px;
  min-width: 104px;
  gap: 3px;
  padding: 6px 12px;
}
.pd--outcome .chip__n {
  font-size: 2rem;
}
.pd--outcome .chip__cap {
  font-size: 0.95rem;
}
.pd--outcome .chip__flag {
  font-size: 0.85rem;
}
.pd--outcome .reset {
  font-size: 0.95rem;
  padding: 8px 16px;
}

.ledger {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  gap: 8px;
}
.led {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px 196px;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  border: 2px solid var(--pd-border);
  border-radius: 8px;
  background-color: var(--pd-panel);
}
.led--bad {
  border-color: var(--pd-red);
}
.led--warn {
  border-color: var(--pd-yellow);
}
.led--good {
  border-color: var(--pd-green);
}
.led__name {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}
.led__n {
  flex: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--pd-head);
  border: 1px solid var(--pd-border);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pd-blue);
}
.led__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.led__label {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
}
/* The beat the whole talk turns on. */
.led__note {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--pd-yellow);
}
.led__stat {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 9px;
}
.led__v {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.led__k {
  font-size: 0.85rem;
  line-height: 1.15;
  color: var(--pd-dim);
}
.led__v--bad {
  color: var(--pd-red);
}
.led__v--warn {
  color: var(--pd-yellow);
}
.led__v--good {
  color: var(--pd-green);
}
</style>
