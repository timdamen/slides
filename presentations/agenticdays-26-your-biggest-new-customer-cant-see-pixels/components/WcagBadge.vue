<script setup lang="ts">
defineProps<{
  sc: string
  name: string
}>()
</script>

<template>
  <span class="wcag-badge">
    <span class="wcag-sc">WCAG {{ sc }}</span>
    <span class="wcag-name">{{ name }}</span>
  </span>
</template>

<style scoped>
.wcag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #2f5e3f;
  border-radius: 8px;
  padding: 3px 10px;
  background: rgb(43 138 62 / 15%);
  outline: 2px solid #69db7c;
  outline-offset: 2px;
  font-size: 0.7rem;
  transform: rotate(-1deg);
}
.wcag-sc { font-weight: 700; color: #69db7c; white-space: nowrap; }
.wcag-name { color: #d8dee9; }
</style>
