<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { snippets, wrapSnippet } from '../snippets/demos'
import { buildTree, type TreeNode } from '../utils/a11y'
import { useColumnResize, useHeightResize } from '../utils/resizable'

const props = withDefaults(defineProps<{
  snippet?: string
  code?: string
  variant?: 'broken' | 'fixed'
  editable?: boolean
  height?: string
  showStates?: boolean
  showSource?: boolean
}>(), {
  variant: 'broken',
  editable: true,
  height: '390px',
  showStates: true,
  showSource: true,
})

const activeVariant = ref<'broken' | 'fixed'>(props.variant)

function sourceFor(variant: 'broken' | 'fixed'): string {
  if (props.code)
    return props.code
  if (props.snippet && snippets[props.snippet])
    return snippets[props.snippet][variant]
  return '<p>Unknown snippet</p>'
}

const code = ref(sourceFor(activeVariant.value))
const docHtml = ref(wrapSnippet(code.value))
const frame = ref<HTMLIFrameElement>()
const nodes = ref<TreeNode[]>([])
const warnings = ref(0)

let timer: ReturnType<typeof setTimeout> | undefined
function scheduleRender() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    docHtml.value = wrapSnippet(code.value)
  }, 300)
}
onBeforeUnmount(() => clearTimeout(timer))

function computeTree() {
  const body = frame.value?.contentDocument?.body
  if (!body)
    return
  const result = buildTree(body)
  nodes.value = result.nodes
  warnings.value = result.warnings
}

function setVariant(variant: 'broken' | 'fixed') {
  activeVariant.value = variant
  code.value = sourceFor(variant)
  docHtml.value = wrapSnippet(code.value)
}

watch(() => props.variant, setVariant)

const hasPair = computed(() => !props.code && !!props.snippet)
const ok = computed(() => nodes.value.length > 0 && warnings.value === 0)

const columns = useColumnResize(props.showSource ? [1.1, 1, 1.2] : [1, 1.2])
const heightCtl = useHeightResize(Number.parseInt(props.height, 10) || 390)
const dragging = computed(() => columns.dragging.value || heightCtl.dragging.value)
</script>

<template>
  <div class="agent-view" :class="{ dragging }" :style="{ '--av-height': `${heightCtl.heightPx.value}px` }">
    <div v-if="hasPair" class="av-toolbar" role="group" aria-label="Snippet variant">
      <button
        type="button" :class="{ active: activeVariant === 'broken' }"
        :aria-pressed="activeVariant === 'broken'" @click="setVariant('broken')"
      >
        Broken
      </button>
      <button
        type="button" :class="{ active: activeVariant === 'fixed' }"
        :aria-pressed="activeVariant === 'fixed'" @click="setVariant('fixed')"
      >
        Fixed
      </button>
      <span class="av-status" role="status">
        <span v-if="ok" class="ok">✓ agent-readable</span>
        <span v-else-if="warnings" class="warn">⚠ {{ warnings }} problem{{ warnings === 1 ? '' : 's' }}</span>
      </span>
      <button type="button" aria-label="Equal pane widths" @click="columns.equalize()">
        Equal
      </button>
    </div>

    <div class="av-panes" :style="{ gridTemplateColumns: columns.gridTemplate.value }">
      <div v-if="showSource" class="av-pane">
        <div class="av-pane-title">
          <span>HTML</span>
          <button
            type="button" class="av-max" :class="{ active: columns.maximized.value === 0 }"
            :aria-pressed="columns.maximized.value === 0" aria-label="Maximize HTML pane"
            @click="columns.maximize(0)"
          >⤢</button>
        </div>
        <textarea
          v-model="code" class="av-editor" :readonly="!editable"
          aria-label="HTML source (editable)" spellcheck="false" @input="scheduleRender"
        />
      </div>
      <div
        v-if="showSource"
        class="av-divider" role="separator" tabindex="0" aria-orientation="vertical"
        aria-label="Resize HTML and preview panes" :aria-valuenow="columns.percent(0)"
        aria-valuemin="0" aria-valuemax="100"
        @pointerdown="columns.startDrag(0, $event)" @keydown="columns.onKey(0, $event)"
      >
        <span class="av-grip" aria-hidden="true" />
      </div>
      <div class="av-pane">
        <div class="av-pane-title">
          <span>What humans see</span>
          <button
            type="button" class="av-max" :class="{ active: columns.maximized.value === (showSource ? 1 : 0) }"
            :aria-pressed="columns.maximized.value === (showSource ? 1 : 0)" aria-label="Maximize preview pane"
            @click="columns.maximize(showSource ? 1 : 0)"
          >⤢</button>
        </div>
        <iframe
          ref="frame" class="av-preview" :srcdoc="docHtml"
          title="Rendered preview of the demo snippet" @load="computeTree"
        />
      </div>
      <div
        class="av-divider" role="separator" tabindex="0" aria-orientation="vertical"
        aria-label="Resize preview and accessibility tree panes"
        :aria-valuenow="columns.percent(showSource ? 1 : 0)"
        aria-valuemin="0" aria-valuemax="100"
        @pointerdown="columns.startDrag(showSource ? 1 : 0, $event)"
        @keydown="columns.onKey(showSource ? 1 : 0, $event)"
      >
        <span class="av-grip" aria-hidden="true" />
      </div>
      <div class="av-pane">
        <div class="av-pane-title">
          <span>What the agent sees <span class="av-sub">(accessibility tree)</span></span>
          <button
            type="button" class="av-max" :class="{ active: columns.maximized.value === (showSource ? 2 : 1) }"
            :aria-pressed="columns.maximized.value === (showSource ? 2 : 1)" aria-label="Maximize accessibility tree pane"
            @click="columns.maximize(showSource ? 2 : 1)"
          >⤢</button>
        </div>
        <div class="av-tree" role="img" aria-label="Computed accessibility tree of the snippet">
          <div
            v-for="(node, i) in nodes" :key="i" class="av-row"
            :class="{ 'has-warning': node.warning, 'is-text': node.role === 'text' }"
            :style="{ paddingLeft: `${node.depth * 14 + 8}px` }"
          >
            <span class="av-role">{{ node.role }}</span>
            <span class="av-name">"{{ node.name }}"</span>
            <span v-if="showStates && node.states.length" class="av-states">({{ node.states.join(', ') }})</span>
            <div v-if="node.warning" class="av-warning">⚠ {{ node.warning }}</div>
          </div>
          <div v-if="!nodes.length" class="av-row is-text">
            <span class="av-name">(empty tree)</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="av-hresize" role="separator" tabindex="0" aria-orientation="horizontal"
      aria-label="Resize demo height" :aria-valuenow="Math.round(heightCtl.heightPx.value)"
      :aria-valuemin="heightCtl.min" :aria-valuemax="heightCtl.max"
      @pointerdown="heightCtl.startDrag($event)" @keydown="heightCtl.onKey($event)"
    >
      <span class="av-grip" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.agent-view {
  font-size: 0.72rem;
  border: 1px solid #3b4252;
  border-radius: 10px;
  padding: 8px;
  background: #14161c;
}
.av-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.av-toolbar button {
  font: inherit;
  font-weight: 600;
  color: #cdd3dd;
  background: #232733;
  border: 1px solid #3b4252;
  border-radius: 6px;
  padding: 3px 12px;
  cursor: pointer;
}
.av-toolbar button.active {
  background: #2f3a52;
  color: #fff;
  outline: 2px solid #74c0fc;
  outline-offset: 1px;
}
.av-toolbar button:focus-visible {
  outline: 3px solid #ffd43b;
  outline-offset: 2px;
}
.av-status { margin-left: auto; font-weight: 600; }
.av-status .ok { color: #69db7c; }
.av-status .warn { color: #ffa94b; }
.av-panes {
  display: grid;
  /* columns come from useColumnResize via inline style */
}
.av-pane { display: flex; flex-direction: column; min-width: 0; }
.av-divider {
  cursor: col-resize;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.av-divider .av-grip { width: 4px; height: 44px; }
.av-hresize {
  cursor: ns-resize;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12px;
  margin-top: 4px;
  border-radius: 4px;
}
.av-hresize .av-grip { height: 4px; width: 56px; }
.av-grip { background: #6a7484; border-radius: 2px; }
.av-divider:hover .av-grip,
.av-hresize:hover .av-grip,
.av-divider:focus-visible .av-grip,
.av-hresize:focus-visible .av-grip { background: #74c0fc; }
.av-divider:focus-visible,
.av-hresize:focus-visible { outline: 3px solid #ffd43b; outline-offset: 1px; }
.agent-view.dragging { user-select: none; }
.av-pane-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-weight: 700;
  color: #9aa4b2;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.62rem;
  margin-bottom: 4px;
}
.av-max {
  font: inherit;
  line-height: 1;
  color: #cdd3dd;
  background: #232733;
  border: 1px solid #3b4252;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
}
.av-max.active {
  background: #2f3a52;
  color: #fff;
  outline: 2px solid #74c0fc;
  outline-offset: 1px;
}
.av-max:focus-visible { outline: 3px solid #ffd43b; outline-offset: 2px; }
.av-sub { text-transform: none; letter-spacing: 0; font-weight: 400; }
.av-editor {
  flex: none;
  height: var(--av-height);
  resize: none;
  background: #0e1015;
  color: #d8dee9;
  border: 1px solid #3b4252;
  border-radius: 8px;
  padding: 8px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  line-height: 1.45;
  white-space: pre;
}
.av-editor:focus-visible { outline: 3px solid #74c0fc; outline-offset: 2px; }
.av-preview {
  flex: none;
  height: var(--av-height);
  width: 100%;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #16181d;
}
.av-tree {
  flex: none;
  height: var(--av-height);
  overflow: auto;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #0e1015;
  padding: 6px 4px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  line-height: 1.5;
}
.av-row { padding-top: 1px; padding-bottom: 1px; }
.av-role { color: #74c0fc; font-weight: 700; }
.av-row.is-text .av-role { color: #9aa4b2; font-weight: 400; }
.av-name { color: #e5e9f0; }
.av-states { color: #b5a1e5; }
.av-warning { color: #ffa94b; font-weight: 600; }
.av-row.has-warning .av-role { color: #ffa94b; }
</style>
