<script setup lang="ts">
defineProps<{
  value: string
  label: string
  source: string
  date?: string
}>()
</script>

<template>
  <div class="stat-card">
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
    <div class="stat-source">{{ source }}<template v-if="date"> · {{ date }}</template></div>
  </div>
</template>

<style scoped>
.stat-card {
  border: 1px solid #3b4252;
  border-radius: 12px;
  padding: 16px 18px;
  background: #14161c;
  outline: 2px solid #74c0fc;
  outline-offset: 3px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-value {
  /* Sits at h1 size (1.6rem) rather than above it: the accent colour carries
     the emphasis, not the size. Matches the deck's quiet-heading scale. */
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.1;
  color: #ffd43b;
}
.stat-label {
  font-size: 0.85rem;
  color: #e5e9f0;
  line-height: 1.35;
}
.stat-source {
  margin-top: auto;
  padding-top: 6px;
  font-size: 0.62rem;
  color: #9aa4b2;
}
</style>
