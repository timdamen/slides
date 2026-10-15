<script setup lang="ts">
import { ref } from 'vue'
import { buildTree, type TreeNode } from '../utils/a11y'

const nodes = ref<TreeNode[]>([])
const warnings = ref(0)
const scanned = ref(false)

function scan() {
  const root = document.querySelector('#slide-content') ?? document.body
  const result = buildTree(root as Element)
  nodes.value = result.nodes.slice(0, 60)
  warnings.value = result.warnings
  scanned.value = true
}
</script>

<template>
  <div class="deck-audit">
    <div class="da-toolbar">
      <button type="button" @click="scan">🔍 Scan this deck's accessibility tree</button>
      <span v-if="scanned" class="da-status" role="status">
        <span v-if="warnings === 0" class="ok">✓ agent-readable — 0 warnings</span>
        <span v-else class="warn">⚠ {{ warnings }} warning{{ warnings === 1 ? '' : 's' }} found</span>
      </span>
    </div>
    <div v-if="scanned" class="da-tree" role="img" aria-label="Accessibility tree of the current slide">
      <div
        v-for="(node, i) in nodes" :key="i" class="da-row"
        :style="{ paddingLeft: `${node.depth * 12 + 6}px` }"
      >
        <span class="da-role">{{ node.role }}</span>
        <span class="da-name">"{{ node.name }}"</span>
        <span v-if="node.warning" class="da-warn">⚠ {{ node.warning }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deck-audit {
  border: 1px solid #3b4252;
  border-radius: 10px;
  padding: 10px;
  background: #14161c;
  font-size: 0.72rem;
}
.da-toolbar { display: flex; align-items: center; gap: 10px; }
.da-toolbar button {
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: #2f3a52;
  border: 1px solid #74c0fc;
  border-radius: 6px;
  padding: 4px 14px;
  cursor: pointer;
}
.da-toolbar button:focus-visible { outline: 3px solid #ffd43b; outline-offset: 2px; }
.da-status { font-weight: 700; }
.da-status .ok { color: #69db7c; }
.da-status .warn { color: #ffa94b; }
.da-tree {
  margin-top: 8px;
  max-height: 300px;
  overflow: auto;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #0e1015;
  padding: 6px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  line-height: 1.5;
}
.da-role { color: #74c0fc; font-weight: 700; }
.da-name { color: #e5e9f0; }
.da-warn { color: #ffa94b; font-weight: 600; }
</style>
