<script setup lang="ts">
/**
 * The teaching visual for the whole AST act.
 *
 * Every other demo in this deck shows that a parser WINS. This one shows HOW,
 * and it only has one thing to say:
 *
 *     A node is a label plus two numbers that point back into your text.
 *
 * So both panes are the same information. Click a node in the tree and the
 * exact character range lights up in the source. Click into the source and the
 * smallest node containing that character is selected in the tree. The readout
 * underneath does the arithmetic out loud: `source.slice(start, end)` and the
 * text that comes back, which is always — with no cleverness — that node's text.
 *
 * That is the whole mechanism a codemod runs on:
 *
 *     PARSE  text → tree
 *     FIND   walk the tree asking a STRUCTURAL question
 *     EDIT   take the node's start/end and splice the ORIGINAL string
 *
 * And it is why the footer counts blank lines. There is no node for one. The
 * tree cannot give back what it never held, which is the entire content of the
 * third example.
 *
 * Nothing binds to Slidev's click state. Nothing is pre-baked: every offset on
 * screen came out of acorn or @vue/compiler-sfc a moment ago.
 */
import { computed, nextTick, ref, useId, watch } from 'vue'
import {
  countBlankLines,
  countTree,
  parseJs,
  parseVueTemplate,
  toTemplateTree,
  toTree,
} from '../utils/ast'
import type { TreeNode } from '../utils/ast'

/**
 * Short enough that the whole tree fits without scrolling, long enough to have
 * a nested object in it — the audience needs to see a node inside a node.
 */
const DEFAULT_JS = `const routes = [
  { path: '/', component: Home },
]`

/**
 * `my-h1` contains the letters `h1` and is not the class `h1`. That collision
 * is example two's opening move, and here you can see why the parser is immune:
 * the <h1> element node owns a list of attributes, so the question is a lookup.
 */
const DEFAULT_VUE = `<template>
  <div class="my-h1">
    <h1 class="title">Quarterly report</h1>
  </div>
</template>`

const props = withDefaults(
  defineProps<{
    /** The code to inspect. Defaults per `lang`. */
    source?: string
    lang?: 'js' | 'vue'
    /** Definite pixel height. 385 is a slide with an <h1>; 552 is a bare one. */
    height?: number
    /**
     * Open pre-focused on a node. Four spellings, tried in this order:
     *
     *   '0.body0.declarations0'  an exact node id
     *   'VariableDeclarator'     the first node of that type, in document order
     *   'Identifier#2'           the 2nd node of that type (1-based)
     *   'Identifier=routes'      the first of that type whose detail matches
     *
     * Anything that does not resolve simply selects nothing. A slide that
     * mistypes this still renders.
     */
    initialPath?: string
    /**
     * Fold the tree to this depth on open. The root is depth 0, so `1` shows
     * the root and its children, collapsed — for a whole file that is the list
     * of top-level statements and nothing else, which is the view example three
     * needs: 35 lines of text, fourteen statements, and no row for a blank one.
     *
     * Infinity, the default, folds nothing and opens the tree whole.
     */
    initialDepth?: number
    /** Drop the byline and the help text, to sit inside another demo. */
    compact?: boolean
  }>(),
  {
    source: '',
    lang: 'js',
    height: 385,
    initialPath: '',
    initialDepth: Number.POSITIVE_INFINITY,
    compact: false,
  },
)

const code = computed(() => props.source || (props.lang === 'vue' ? DEFAULT_VUE : DEFAULT_JS))

// ---------------------------------------------------------------------------
// parse
//
// Two parsers, one TreeNode shape, one renderer. A throw from either one
// becomes a red line inside the tree panel; it never reaches the slide.
// ---------------------------------------------------------------------------

interface Parsed {
  root: TreeNode | null
  error: string | null
  /** Ranges the parser saw and did not keep. Empty for a template, where a
   *  comment really is a node. */
  comments: { start: number; end: number }[]
}

const parsed = computed<Parsed>(() => {
  try {
    if (props.lang === 'vue') {
      const { ast, error } = parseVueTemplate(code.value)
      if (!ast) return { root: null, error: error ?? 'the template could not be parsed', comments: [] }
      return { root: toTemplateTree(ast), error: null, comments: [] }
    }
    const { ast, error, comments } = parseJs(code.value)
    if (!ast) return { root: null, error: error ?? 'the source could not be parsed', comments: [] }
    return { root: toTree(ast), error: null, comments }
  } catch (error: any) {
    return { root: null, error: error?.message ?? String(error), comments: [] }
  }
})

interface FlatNode extends TreeNode {
  depth: number
  parentId: string | null
}

/** Every node, in document order, with its depth and its parent. */
const flat = computed<FlatNode[]>(() => {
  const out: FlatNode[] = []
  const visit = (node: TreeNode, depth: number, parentId: string | null) => {
    out.push({ ...node, depth, parentId })
    node.children.forEach((child) => visit(child, depth + 1, node.id))
  }
  if (parsed.value.root) visit(parsed.value.root, 0, null)
  return out
})

const byId = computed(() => new Map(flat.value.map((node) => [node.id, node])))

/** Counted off the built tree, so "N nodes" counts the rows you can see. */
const nodeCount = computed(() => countTree(parsed.value.root))

// ---------------------------------------------------------------------------
// selection
// ---------------------------------------------------------------------------

const selectedId = ref<string | null>(null)
const hoverId = ref<string | null>(null)
/**
 * Why the offset that produced this selection has no node of its own.
 *
 * Blank lines and comments both land here, and for the same reason: the parser
 * never made a node for either, so the smallest thing containing them is
 * whatever statement happens to surround them. This is the sentence example
 * three is built on, and here you can produce it by clicking.
 */
const voidReason = ref<string | null>(null)
/** Caret in the source pane, for arrow-key browsing. */
const caret = ref<number | null>(null)
const collapsed = ref(new Set<string>())

const listRef = ref<HTMLElement | null>(null)
const srcRef = ref<HTMLElement | null>(null)
const treeId = `ai-tree-${useId()}`

const selected = computed(() => (selectedId.value ? (byId.value.get(selectedId.value) ?? null) : null))
const hovered = computed(() => (hoverId.value ? (byId.value.get(hoverId.value) ?? null) : null))

const sliceText = computed(() =>
  selected.value ? code.value.slice(selected.value.start, selected.value.end) : '',
)

/** Ancestors of a node, outermost first. */
function ancestorsOf(id: string): string[] {
  const chain: string[] = []
  let current = byId.value.get(id)?.parentId ?? null
  while (current) {
    chain.unshift(current)
    current = byId.value.get(current)?.parentId ?? null
  }
  return chain
}

/**
 * Scroll the selected row into the tree's own scrollport.
 *
 * Deliberately not `scrollIntoView`: that walks every scrollable ancestor, and
 * on a Slidev canvas the nearest one it finds can be the deck itself.
 */
function scrollTo(box: HTMLElement, top: number, height: number) {
  const bottom = top + height
  if (top < box.scrollTop) box.scrollTop = top
  else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight
}

/**
 * Bring a node into view in both panes.
 *
 * `at` is the character the person actually asked about, which is not always
 * the node's first one: click into a comment and the node you get back is the
 * Program that surrounds it, and scrolling the source to character 0 would take
 * you away from the very thing you clicked. When it is given, the source pane
 * goes there instead.
 */
async function reveal(id: string, at?: number) {
  await nextTick()
  const list = listRef.value
  const row = list?.querySelector<HTMLElement>(`[data-row="${CSS.escape(id)}"]`)
  if (list && row) scrollTo(list, row.offsetTop, row.offsetHeight)

  // And the other pane: a band highlighted below the fold teaches nothing.
  const box = srcRef.value
  const node = byId.value.get(id)
  const offset = at ?? node?.start
  /* Any element carrying that offset will do. A blank line has no characters,
     so the only thing standing at its offset is its own gutter number — which
     is exactly the row we need to scroll to. */
  const first = box?.querySelector<HTMLElement>(`[data-off="${offset}"]`)
  if (box && first) scrollTo(box, first.offsetTop, first.offsetHeight)
}

function selectNode(id: string, reason: string | null = null, at?: number) {
  if (!byId.value.has(id)) return
  // Reveal it: a node found from the source may be inside folded ancestors.
  const next = new Set(collapsed.value)
  ancestorsOf(id).forEach((ancestor) => next.delete(ancestor))
  collapsed.value = next
  selectedId.value = id
  voidReason.value = reason
  reveal(id, at)
}

/**
 * The smallest node whose range contains this offset.
 *
 * "Smallest" is the whole point: every offset is inside Program, and inside the
 * declaration, and inside the declarator. The innermost one is the answer,
 * which is the same walk a codemod does when it asks a structural question.
 *
 * When nothing contains the offset — a blank line between two statements, the
 * whitespace outside a template's root element — the nearest node wins, and the
 * readout says so rather than pretending a node was found.
 */
function nodeAtOffset(offset: number): FlatNode | null {
  let best: FlatNode | null = null
  for (const node of flat.value) {
    if (offset < node.start || offset >= node.end) continue
    if (!best || node.end - node.start <= best.end - best.start) best = node
  }
  if (best) return best

  let nearest: FlatNode | null = null
  let nearestGap = Infinity
  for (const node of flat.value) {
    const gap = offset < node.start ? node.start - offset : offset - node.end
    if (gap < nearestGap) {
      nearestGap = gap
      nearest = node
    }
  }
  return nearest
}

function pickOffset(offset: number) {
  const clamped = Math.max(0, Math.min(offset, code.value.length))
  caret.value = clamped
  const node = nodeAtOffset(clamped)
  if (node) selectNode(node.id, voidReasonAt(clamped), clamped)
}

/** Is the offset on a line with nothing but whitespace on it? */
function isBlankLineAt(offset: number): boolean {
  const text = code.value
  const start = text.lastIndexOf('\n', Math.max(0, offset - 1)) + 1
  const end = text.indexOf('\n', offset)
  return text.slice(start, end === -1 ? text.length : end).trim() === ''
}

/** The two things a parser sees and does not keep. Nothing else gets a line. */
function voidReasonAt(offset: number): string | null {
  /* One line each, deliberately: the hint appears and disappears as the speaker
     clicks around, and a message that wraps would move the panel under it. */
  if (parsed.value.comments.some((c) => offset >= c.start && offset < c.end)) {
    return 'a comment is not a node — this is just what surrounds it.'
  }
  if (isBlankLineAt(offset)) {
    return 'a blank line is not a node — this is just what surrounds it.'
  }
  return null
}

// ---------------------------------------------------------------------------
// the source pane
// ---------------------------------------------------------------------------

interface SourceLine {
  no: number
  start: number
  end: number
  /** Nothing but whitespace on it — the one kind of line no tree has a node for. */
  blank: boolean
  /* `split('')` and not `[...text]`: parser offsets are UTF-16 code units, and
     iterating code points would drift the moment anyone pastes an emoji. */
  chars: { ch: string; off: number }[]
}

const lines = computed<SourceLine[]>(() => {
  const out: SourceLine[] = []
  let at = 0
  /* A single trailing newline terminates the last line; it does not open
     another one. Keeping it would paint an empty numbered row that the blank
     line count — which drops it — does not agree exists. */
  const body = code.value.endsWith('\n') ? code.value.slice(0, -1) : code.value
  body.split('\n').forEach((text, index) => {
    out.push({
      no: index + 1,
      start: at,
      end: at + text.length,
      blank: text.trim() === '',
      chars: text.split('').map((ch, i) => ({ ch, off: at + i })),
    })
    at += text.length + 1
  })
  return out
})

/** Inclusive-exclusive membership, so a band ends where the next node begins. */
function inRange(offset: number, node: TreeNode | null): boolean {
  return !!node && offset >= node.start && offset < node.end
}

/**
 * The accessible name of a tree row.
 *
 * The visible row is three spans with no whitespace between them — Vue's
 * compiler drops the newlines — so its text content reads as
 * "Identifierpath21–25". Naming it explicitly is the difference between a row
 * a screen reader can say and one it spells.
 */
function rowLabel(node: TreeNode): string {
  const detail = node.detail ? ` ${node.detail}` : ''
  return `${node.type}${detail}, characters ${node.start} to ${node.end}`
}

function onSourceClick(event: MouseEvent) {
  const el = (event.target as HTMLElement | null)?.closest?.('[data-off]')
  if (el instanceof HTMLElement) pickOffset(Number(el.dataset.off))
}

const SOURCE_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'])

/**
 * Arrow-key browsing of the source, which is the keyboard half of the lesson:
 * sweep the caret across a line and watch the selected node change under it.
 *
 * `stopPropagation` is load-bearing. Slidev suspends its own arrow shortcuts
 * while focus is on a BUTTON or an INPUT, and a <pre> is neither — without this
 * the first press would advance the slide.
 */
function onSourceKey(event: KeyboardEvent) {
  if (!SOURCE_KEYS.has(event.key)) return
  event.preventDefault()
  event.stopPropagation()

  const at = caret.value ?? selected.value?.start ?? 0
  const row = lines.value.find((line) => at >= line.start && at <= line.end) ?? lines.value[0]
  const index = lines.value.indexOf(row)
  const column = at - row.start

  if (event.key === 'ArrowLeft') return pickOffset(at - 1)
  if (event.key === 'ArrowRight') return pickOffset(at + 1)
  if (event.key === 'Home') return pickOffset(row.start)
  if (event.key === 'End') return pickOffset(row.end)
  const next = lines.value[index + (event.key === 'ArrowDown' ? 1 : -1)]
  if (next) pickOffset(next.start + Math.min(column, next.end - next.start))
}

function onSourceFocus() {
  if (caret.value === null) caret.value = selected.value?.start ?? 0
}

// ---------------------------------------------------------------------------
// the tree pane
// ---------------------------------------------------------------------------

interface TreeRow extends FlatNode {
  hasChildren: boolean
  open: boolean
}

/** Everything is open until somebody folds it: on a teaching slide the whole
 *  tree is the point, and folding is a thing the speaker does deliberately. */
const rows = computed<TreeRow[]>(() => {
  const out: TreeRow[] = []
  const visit = (node: TreeNode, depth: number, parentId: string | null) => {
    const hasChildren = node.children.length > 0
    const open = hasChildren && !collapsed.value.has(node.id)
    out.push({ ...node, depth, parentId, hasChildren, open })
    if (open) node.children.forEach((child) => visit(child, depth + 1, node.id))
  }
  if (parsed.value.root) visit(parsed.value.root, 0, null)
  return out
})

function toggle(id: string) {
  const next = new Set(collapsed.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  collapsed.value = next
}

const TREE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])

function focusRow(id: string) {
  nextTick(() => {
    listRef.value?.querySelector<HTMLElement>(`[data-row="${CSS.escape(id)}"]`)?.focus()
  })
}

/** Selection follows focus, so arrowing down the tree walks the highlight down
 *  the source. Left folds or climbs, Right unfolds or descends. */
function onTreeKey(event: KeyboardEvent, row: TreeRow) {
  if (!TREE_KEYS.has(event.key)) return
  event.preventDefault()
  event.stopPropagation()

  const list = rows.value
  const index = list.findIndex((candidate) => candidate.id === row.id)

  if (event.key === 'ArrowRight') {
    if (row.hasChildren && !row.open) return toggle(row.id)
    if (row.hasChildren) return focusRow(row.children[0].id)
    return
  }
  if (event.key === 'ArrowLeft') {
    if (row.hasChildren && row.open) return toggle(row.id)
    if (row.parentId) return focusRow(row.parentId)
    return
  }
  const target =
    event.key === 'Home'
      ? list[0]
      : event.key === 'End'
        ? list[list.length - 1]
        : list[index + (event.key === 'ArrowDown' ? 1 : -1)]
  if (target) focusRow(target.id)
}

// ---------------------------------------------------------------------------
// the fact the print lesson needs
//
// Not a claim, a count. Every number here is measured off the source and off
// the tree that was just built from it.
// ---------------------------------------------------------------------------

const fact = computed(() => ({
  lines: lines.value.length,
  blankLines: countBlankLines(code.value),
  nodes: nodeCount.value,
  /** Nodes any parser emits for a blank line. It is zero. It is always zero. */
  blankLineNodes: 0,
}))

/** "1 line", "11 blank lines" — a stage slide should not read like a log. */
function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

// ---------------------------------------------------------------------------
// opening pre-focused, and getting back there
// ---------------------------------------------------------------------------

/** Resolve `initialPath` against the parsed tree. Never throws, never guesses. */
function resolvePath(path: string): string | null {
  if (!path) return null
  if (byId.value.has(path)) return path

  /* Split on the FIRST '=' only: a template detail is `class="title"`, which
     has one of its own, and splitting on all of them would match nothing. */
  const eq = path.indexOf('=')
  const head = eq === -1 ? path : path.slice(0, eq)
  const detail = eq === -1 ? undefined : path.slice(eq + 1)
  const [type, ordinal] = head.split('#')
  const wanted = Number(ordinal || '1')
  if (!type || !Number.isFinite(wanted) || wanted < 1) return null

  let seen = 0
  for (const node of flat.value) {
    if (node.type !== type) continue
    if (detail !== undefined && node.detail !== detail) continue
    seen += 1
    if (seen === wanted) return node.id
  }
  return null
}

/**
 * Every node at or below `depth` that has children — the fold set that opens
 * the tree at that level. A non-finite depth folds nothing, which is the
 * default and the behaviour every other caller already has.
 */
function foldToDepth(depth: number): Set<string> {
  if (!Number.isFinite(depth)) return new Set<string>()
  return new Set(
    flat.value
      .filter((node) => node.depth >= depth && node.children.length > 0)
      .map((node) => node.id),
  )
}

function reset() {
  collapsed.value = foldToDepth(props.initialDepth)
  hoverId.value = null
  caret.value = null
  voidReason.value = null
  const id = resolvePath(props.initialPath)
  selectedId.value = id
  if (id) reveal(id)
}

/* Runs on mount and again whenever the source or the language changes: node
   ids are positional, so a stale one has to be re-resolved rather than kept. */
watch([code, () => props.lang, () => props.initialPath, () => props.initialDepth], reset, {
  immediate: true,
})

defineExpose({ fact, selected, selectNode, pickOffset, reset })
</script>

<template>
  <div class="ai" :class="{ 'ai--compact': compact }" :style="{ height: `${height}px`, maxHeight: `${height}px` }">
    <!-- bar -------------------------------------------------------------- -->
    <div class="ai__bar">
      <p v-if="!compact" class="ai__lede">
        <span class="ai__strong">Click either side.</span>
        <span class="ai__help">The band in the text is exactly <code>source.slice(start, end)</code>.</span>
      </p>
      <p class="ai__meta">
        <span class="ai__lang">{{ lang === 'vue' ? 'template AST' : 'JavaScript AST' }}</span>
        <span class="ai__count">{{ nodeCount }} nodes</span>
      </p>
      <button type="button" class="ai__reset" @click="reset">Reset</button>
    </div>

    <div class="ai__grid">
      <!-- LEFT: the text, and the arithmetic ----------------------------- -->
      <div class="ai__col">
        <pre
          ref="srcRef"
          class="ai__src"
          tabindex="0"
          role="group"
          aria-label="Source. Click a character, or use the arrow keys, to select the smallest node that contains it."
          @click="onSourceClick"
          @keydown="onSourceKey"
          @focus="onSourceFocus"
        ><span v-for="line in lines" :key="line.no" class="ai__line" :class="{ 'ai__line--blank': line.blank }" :data-off="line.end"><span class="ai__no" :data-off="line.start" aria-hidden="true">{{ line.no }}</span><span class="ai__code"><span v-for="c in line.chars" :key="c.off" class="ai__c" :class="{
              'ai__c--sel': inRange(c.off, selected),
              'ai__c--pre': inRange(c.off, hovered),
              'ai__c--caret': c.off === caret,
            }" :data-off="c.off">{{ c.ch }}</span></span></span></pre>

        <div class="ai__read" aria-live="polite">
          <template v-if="selected">
            <p class="ai__readhead">
              <span class="ai__rtype">{{ selected.type }}</span>
              <span v-if="selected.role" class="ai__rrole">{{ selected.role }}</span>
              <span class="ai__rnums">
                start <strong>{{ selected.start }}</strong>
                <span class="ai__dot" aria-hidden="true">·</span>
                end <strong>{{ selected.end }}</strong>
              </span>
            </p>
            <p v-if="voidReason" class="ai__blank">{{ voidReason }}</p>
            <p class="ai__call" :class="{ 'ai__call--void': voidReason }">
              <span class="ai__callfn">source.slice({{ selected.start }}, {{ selected.end }})</span>
              <span class="ai__arrow" aria-hidden="true">→</span>
              <!--
                For a click that landed on nothing, printing the text back is
                noise: the node that merely surrounds a blank line is usually
                the whole Program, and a scrollbox of the entire file is not the
                lesson. The size of what came back IS the lesson, so say that.
              -->
              <span v-if="voidReason" class="ai__span"
                >all {{ sliceText.length }} characters of {{ selected.type }}</span
              >
              <span v-else class="ai__vh">gives back</span>
            </p>
            <pre
              v-if="!voidReason"
              class="ai__slice"
              tabindex="0"
              role="group"
              aria-label="The text that range gives back"
            >{{ sliceText }}</pre>
          </template>
          <p v-else class="ai__empty">
            Nothing selected. Pick a node on the right, or click into the text above.
          </p>
        </div>
      </div>

      <!-- RIGHT: the tree ------------------------------------------------ -->
      <div class="ai__col ai__col--tree">
        <p v-if="parsed.error" class="ai__err">
          <span aria-hidden="true">✕</span>
          <span>it could not parse: {{ parsed.error }}</span>
        </p>
        <ul v-else :id="treeId" ref="listRef" class="ai__list" @mouseleave="hoverId = null">
          <li
            v-for="row in rows"
            :key="row.id"
            class="ai__li"
            :style="{ paddingLeft: `${row.depth * 0.8}rem` }"
          >
            <button
              v-if="row.hasChildren"
              type="button"
              class="ai__twist"
              :aria-expanded="row.open"
              :aria-controls="treeId"
              @click="toggle(row.id)"
            >
              <span aria-hidden="true">{{ row.open ? '▾' : '▸' }}</span>
              <span class="ai__vh">{{ row.open ? 'Collapse' : 'Expand' }} {{ rowLabel(row) }}</span>
            </button>
            <span v-else class="ai__twist ai__twist--leaf" aria-hidden="true">·</span>
            <button
              type="button"
              class="ai__row"
              :class="{ 'ai__row--on': selectedId === row.id }"
              :data-row="row.id"
              :aria-label="rowLabel(row)"
              :aria-pressed="selectedId === row.id"
              @click="selectNode(row.id)"
              @focus="selectNode(row.id)"
              @mouseenter="hoverId = row.id"
              @keydown="onTreeKey($event, row)"
            >
              <span class="ai__type">{{ row.type }}</span><span v-if="row.role" class="ai__trole">{{ row.role }}</span>
              <span v-if="row.detail" class="ai__detail">{{ row.detail }}</span>
              <span class="ai__range">{{ row.start }}–{{ row.end }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- the fact the print lesson turns on ------------------------------- -->
    <slot name="fact" v-bind="fact">
      <p class="ai__fact">
        {{ plural(fact.lines, 'line') }} of source ·
        {{ plural(fact.nodes, 'node') }}<template v-if="fact.blankLines > 0">
          · <span class="ai__zero">{{ plural(fact.blankLineNodes, 'node') }}</span> for the
          {{ plural(fact.blankLines, 'blank line') }}</template>
      </p>
    </slot>
  </div>
</template>

<style scoped>
/*
 * Self-contained: every custom property is read with a literal fallback, so the
 * component is legible on its own and takes the deck's palette when it has one.
 *
 * Sizes are px against Slidev's 980×552 design space, which is scaled to the
 * projector. 14px is the floor for anything a room has to read.
 */
.ai {
  /* The height comes from the prop as an inline style. Definite, never a
     percentage: the slide's content box is auto-height, so a percentage has
     nothing to resolve against and the inner flex chain grows unbounded. */
  --ai-panel: var(--panel, #171a21);
  --ai-text: var(--text, #e9ecef);
  --ai-dim: var(--dim, #adb5bd);
  --ai-blue: var(--blue, #74c0fc);
  --ai-yellow: var(--yellow, #ffd43b);
  --ai-red: var(--red, #ff8787);
  --ai-green: var(--green, #69db7c);
  --ai-purple: var(--purple, #b197fc);
  --ai-border: var(--border, #39404d);
  --ai-well: #0d1015;
  --ai-mono: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);

  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow: hidden;
  color: var(--ai-text);
}

.ai__vh {
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

/* ---- bar ---- */
.ai__bar {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex: none;
}
.ai__lede {
  margin: 0;
  min-width: 0;
  font-size: 15px;
  line-height: 1.3;
  color: var(--ai-dim);
}
.ai__strong {
  color: var(--ai-text);
  font-weight: 700;
}
.ai__help {
  margin-left: 7px;
}
.ai__help code {
  font-family: var(--ai-mono);
  font-size: 14px;
  color: var(--ai-yellow);
}
.ai__meta {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex: none;
  margin: 0 0 0 auto;
}
.ai__lang {
  font-size: 14px;
  line-height: 1.3;
  color: var(--ai-dim);
}
.ai__count {
  font-family: var(--ai-mono);
  font-size: 14px;
  line-height: 1.3;
  font-weight: 700;
  color: var(--ai-purple);
}
.ai__reset {
  flex: none;
  background-color: #1d222b;
  color: var(--ai-text);
  border: 1px solid var(--ai-border);
  border-radius: 5px;
  padding: 2px 13px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  cursor: pointer;
}
.ai__reset:hover,
.ai__reset:focus-visible {
  background-color: #262d38;
  border-color: var(--ai-blue);
}

/* ---- the two panes ---- */
.ai__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  flex: 1;
  min-height: 0;
}
.ai__col {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 0;
  min-width: 0;
}
.ai__col--tree {
  border: 1px solid var(--ai-border);
  border-radius: 8px;
  background-color: var(--ai-panel);
  padding: 4px 3px 4px 6px;
  overflow: hidden;
}

/* ---- the source ---- */
.ai__src {
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow: auto;
  /* Containing block for `reveal`: without it the offsetTop it measures is
     relative to whatever the deck happens to have positioned further up, and
     the pane scrolls to the wrong line — or to the end of the file. */
  position: relative;
  border: 1px solid var(--ai-border);
  border-radius: 8px;
  background-color: var(--ai-well);
  padding: 6px 8px;
  font-family: var(--ai-mono);
  /* Beats the deck-level `.slidev-layout pre { font-size: … !important }`. */
  font-size: 15px !important;
  line-height: 1.55 !important;
  color: var(--ai-text);
  cursor: text;
}
.ai__src:focus-visible {
  outline: 2px solid var(--ai-blue);
  outline-offset: 1px;
}
/*
 * The row itself carries the end-of-line offset, not the code column. A blank
 * line's code column is an empty flex item and therefore zero pixels tall, so
 * hanging the offset there makes the one line the print lesson is about the one
 * line nobody can click.
 */
.ai__line {
  display: flex;
  align-items: baseline;
}
.ai__no {
  flex: none;
  width: 2.1em;
  padding-right: 0.7em;
  text-align: right;
  color: #7d8794;
  user-select: none;
}
/*
 * A blank line, banded before anything is clicked.
 *
 * `box-shadow` and not `border-left`: the row is a flex line, so a border would
 * shove the gutter three pixels right on blank lines only and the numbers would
 * stop lining up. The number itself goes yellow rather than grey — partly
 * because it is the marker, and partly because grey-on-band measures 4.07:1 and
 * the build fails anything under AA.
 */
.ai__line--blank {
  background-color: rgba(255, 212, 59, 0.12);
  box-shadow: inset 3px 0 0 var(--ai-yellow);
}
.ai__line--blank .ai__no {
  color: var(--ai-yellow);
}
.ai__code {
  flex: 1;
  min-width: 0;
  /* Wrapped, never truncated: a hazard hiding past the right edge of a source
     pane is the one thing this component must not do. */
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
/*
 * Vertical padding on an inline element paints without reflowing, so the band
 * is taller than the glyphs and the layout does not move when it appears.
 */
.ai__c {
  padding: 2px 0;
}
.ai__c--sel {
  background-color: rgba(116, 192, 252, 0.3);
  color: #ffffff;
}
/*
 * An underline rather than only a wash, because the most useful hover is a
 * child of the node already selected — and a background alone would be
 * invisible underneath the selection band.
 */
.ai__c--pre {
  box-shadow: inset 0 -2px 0 var(--ai-purple);
}
.ai__c--pre:not(.ai__c--sel) {
  background-color: rgba(177, 151, 252, 0.19);
}
/* Painted, not laid out: a border here would shift every character after it. */
.ai__c--caret {
  box-shadow: -1px 0 0 0 var(--ai-yellow);
}

/* ---- the readout: the arithmetic, out loud ---- */
.ai__read {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid var(--ai-border);
  border-left: 4px solid var(--ai-blue);
  border-radius: 8px;
  background-color: var(--ai-panel);
  padding: 5px 9px 6px;
}
.ai__readhead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0;
}
.ai__rtype {
  font-family: var(--ai-mono);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--ai-blue);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*
 * A node's type is not what distinguishes it. In `registerFeatureFlags(app)`
 * BOTH the function and its argument are an `Identifier` — only the role in the
 * parent (`callee` vs `arguments[0]`) tells them apart, and the structural
 * queries a codemod writes are phrased in exactly those words.
 */
.ai__rrole,
.ai__trole {
  font-family: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.85rem;
  color: var(--purple, #b197fc);
  margin-left: 0.5ch;
  /* Shrinks before the range does. A role is one unbreakable token, so without
     this a deep row (`VariableDeclarator declarations[0]`) pushes start–end off
     the right edge of the panel — on the slide whose whole claim is that a node
     is a label and two numbers. */
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ai__rnums {
  flex: none;
  font-size: 14px;
  line-height: 1.2;
  color: var(--ai-dim);
}
.ai__rnums strong {
  font-family: var(--ai-mono);
  font-size: 21px;
  font-weight: 700;
  color: var(--ai-yellow);
}
.ai__dot {
  padding: 0 5px;
}
.ai__blank {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  color: var(--ai-yellow);
}
/* The arithmetic on its own line, so the text it gives back gets the whole
   width of the panel and wraps at a word rather than mid-identifier. */
.ai__call {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin: 0;
  font-size: 15px;
  line-height: 1.3;
}
.ai__callfn {
  font-family: var(--ai-mono);
  color: var(--ai-text);
}
.ai__arrow {
  color: var(--ai-blue);
}
/* Void case only: one flowing line rather than three flex columns, because the
   panel is 411px wide and a flex item that narrow breaks `source.slice(0,` off
   from its own closing paren. */
.ai__call--void {
  display: block;
}
.ai__call--void .ai__arrow {
  padding: 0 5px;
}
.ai__span {
  min-width: 0;
  color: var(--ai-dim);
}
.ai__slice {
  margin: 0;
  max-height: 68px;
  overflow: auto;
  border-radius: 5px;
  background-color: var(--ai-well);
  padding: 2px 8px;
  font-family: var(--ai-mono);
  font-size: 15px !important;
  line-height: 1.45 !important;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: var(--ai-green);
}
.ai__slice:focus-visible {
  outline: 2px solid var(--ai-blue);
  outline-offset: 1px;
}
.ai__empty {
  margin: 0;
  font-size: 15px;
  line-height: 1.35;
  color: var(--ai-dim);
}

/* ---- the tree ---- */
.ai__list {
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
.ai__li {
  display: flex;
  align-items: baseline;
  gap: 3px;
  min-width: 0;
}
.ai__twist {
  flex: none;
  position: relative;
  width: 15px;
  background-color: transparent;
  border: 0;
  color: var(--ai-dim);
  font-size: 14px;
  line-height: 1.4;
  padding: 0;
  text-align: center;
  cursor: pointer;
}
.ai__twist:hover,
.ai__twist:focus-visible {
  color: var(--ai-blue);
}
/* Quieter than a twist, but still 5.6:1 on the panel — the build measures the
   contrast of every rendered text node, decorative or not. */
.ai__twist--leaf {
  cursor: default;
  color: #8a939f;
}
.ai__row {
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
  color: var(--ai-text);
}
.ai__row:hover {
  background-color: #1e2531;
}
.ai__row:focus-visible {
  outline: 2px solid var(--ai-blue);
  outline-offset: -1px;
}
.ai__row--on {
  background-color: #1c3247;
}
.ai__type {
  font-family: var(--ai-mono);
  font-size: 15px;
  line-height: 1.4;
  white-space: nowrap;
}
.ai__row--on .ai__type {
  font-weight: 700;
  color: var(--ai-blue);
}
.ai__detail {
  font-family: var(--ai-mono);
  font-size: 15px;
  line-height: 1.4;
  color: var(--ai-green);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ai__range {
  margin-left: auto;
  flex: none;
  font-family: var(--ai-mono);
  font-size: 14px;
  line-height: 1.4;
  color: var(--ai-dim);
}
.ai__row--on .ai__range {
  color: var(--ai-yellow);
}

/* ---- a parse that did not happen ---- */
.ai__err {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  margin: 0;
  /* Sized to the message. A parse failure is a line, not an empty red slab. */
  flex: none;
  max-height: 100%;
  overflow: auto;
  border: 1px solid var(--ai-red);
  border-radius: 6px;
  background-color: rgba(255, 135, 135, 0.12);
  color: var(--ai-red);
  font-size: 15px;
  line-height: 1.35;
  padding: 6px 8px;
}

/* ---- the fact ---- */
.ai__fact {
  flex: none;
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  color: var(--ai-dim);
}
.ai__zero {
  color: var(--ai-yellow);
  font-weight: 700;
}

/* ---- compact: a sub-panel inside another demo ---- */
.ai--compact {
  gap: 5px;
}
.ai--compact .ai__fact {
  font-size: 14px;
}
.ai--compact .ai__src {
  font-size: 14px !important;
}
.ai--compact .ai__rtype {
  font-size: 16px;
}
.ai--compact .ai__rnums strong {
  font-size: 18px;
}
.ai--compact .ai__slice {
  max-height: 44px;
}
</style>
