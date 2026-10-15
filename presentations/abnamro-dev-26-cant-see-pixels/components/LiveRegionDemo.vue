<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { snippets, wrapSnippet } from '../snippets/demos'

const variant = ref<'broken' | 'fixed'>('broken')
const frame = ref<HTMLIFrameElement>()
const frameKey = ref(0)
const announcements = ref<string[]>([])

const docHtml = computed(() => wrapSnippet(snippets['confirm-toast'][variant.value]))

let observer: MutationObserver | undefined

function onLoad() {
  observer?.disconnect()
  const doc = frame.value?.contentDocument
  if (!doc)
    return
  // Mirror live-region semantics: a mutation only "announces" when it
  // happens inside role=status/alert or aria-live.
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // nodeType check instead of instanceof: iframe nodes are from another realm
      const target = mutation.target.nodeType === 1
        ? mutation.target as Element
        : mutation.target.parentElement
      const region = target?.closest('[role="status"], [role="alert"], [aria-live]')
      const text = region?.textContent?.trim()
      if (text)
        announcements.value.push(`🔊 status: "${text}"`)
    }
  })
  observer.observe(doc.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['hidden'],
  })
}

function setVariant(v: 'broken' | 'fixed') {
  variant.value = v
  announcements.value = []
  frameKey.value++
}

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="live-demo">
    <div class="ld-toolbar" role="group" aria-label="Toast variant">
      <button
        type="button" :class="{ active: variant === 'broken' }"
        :aria-pressed="variant === 'broken'" @click="setVariant('broken')"
      >
        Visual-only toast
      </button>
      <button
        type="button" :class="{ active: variant === 'fixed' }"
        :aria-pressed="variant === 'fixed'" @click="setVariant('fixed')"
      >
        role="status"
      </button>
    </div>
    <div class="ld-panes">
      <div class="ld-pane">
        <div class="ld-pane-title">What humans see</div>
        <iframe
          ref="frame" :key="frameKey" class="ld-preview" :srcdoc="docHtml"
          title="Order confirmation demo — press Place order inside the frame"
          @load="onLoad"
        />
      </div>
      <div class="ld-pane">
        <div class="ld-pane-title">What reaches the accessibility tree</div>
        <div class="ld-log" role="log" aria-label="Live region announcements">
          <div v-for="(line, i) in announcements" :key="i" class="ld-line">{{ line }}</div>
          <div v-if="!announcements.length" class="ld-silence">…(silence)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-demo {
  font-size: 0.74rem;
  border: 1px solid #3b4252;
  border-radius: 10px;
  padding: 8px;
  background: #14161c;
}
.ld-toolbar { display: flex; gap: 6px; margin-bottom: 8px; }
.ld-toolbar button {
  font: inherit;
  font-weight: 600;
  color: #cdd3dd;
  background: #232733;
  border: 1px solid #3b4252;
  border-radius: 6px;
  padding: 3px 12px;
  cursor: pointer;
}
.ld-toolbar button.active {
  background: #2f3a52;
  color: #fff;
  outline: 2px solid #74c0fc;
  outline-offset: 1px;
}
.ld-toolbar button:focus-visible { outline: 3px solid #ffd43b; outline-offset: 2px; }
.ld-panes { display: grid; grid-template-columns: 1fr 1.2fr; gap: 8px; }
.ld-pane-title {
  font-weight: 700;
  color: #9aa4b2;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.62rem;
  margin-bottom: 4px;
}
.ld-preview {
  width: 100%;
  height: 240px;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #16181d;
}
.ld-log {
  height: 240px;
  overflow: auto;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #0e1015;
  padding: 8px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  line-height: 1.6;
}
.ld-line { color: #69db7c; font-weight: 600; }
.ld-silence { color: #9aa4b2; font-style: italic; }
</style>
