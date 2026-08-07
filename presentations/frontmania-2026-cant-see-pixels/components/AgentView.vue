<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { snippets, wrapSnippet } from '../snippets/demos'
import { buildTree, type TreeNode } from '../utils/a11y'

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
</script>

<template>
  <div class="agent-view" :style="{ '--av-height': height }">
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
    </div>

    <div class="av-panes" :class="{ 'no-source': !showSource }">
      <div v-if="showSource" class="av-pane">
        <div class="av-pane-title">HTML</div>
        <textarea
          v-model="code" class="av-editor" :readonly="!editable"
          aria-label="HTML source (editable)" spellcheck="false" @input="scheduleRender"
        />
      </div>
      <div class="av-pane">
        <div class="av-pane-title">What humans see</div>
        <iframe
          ref="frame" class="av-preview" :srcdoc="docHtml"
          title="Rendered preview of the demo snippet" @load="computeTree"
        />
      </div>
      <div class="av-pane">
        <div class="av-pane-title">What the agent sees <span class="av-sub">(accessibility tree)</span></div>
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
  grid-template-columns: 1.1fr 1fr 1.2fr;
  gap: 8px;
}
.av-panes.no-source { grid-template-columns: 1fr 1.2fr; }
.av-pane { display: flex; flex-direction: column; min-width: 0; }
.av-pane-title {
  font-weight: 700;
  color: #9aa4b2;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.62rem;
  margin-bottom: 4px;
}
.av-sub { text-transform: none; letter-spacing: 0; font-weight: 400; }
.av-editor {
  flex: 1;
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
  flex: 1;
  height: var(--av-height);
  width: 100%;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #16181d;
}
.av-tree {
  flex: 1;
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
