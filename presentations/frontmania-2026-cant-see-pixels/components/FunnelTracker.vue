<script setup lang="ts">
const props = defineProps<{ stage: number }>()
const stages = ['Discover', 'Compare', 'Decide', 'Checkout', 'Confirm']
</script>

<template>
  <nav class="funnel-tracker" :aria-label="`Customer journey progress: stage ${props.stage} of 5, ${stages[props.stage - 1]}`">
    <ol>
      <li
        v-for="(name, i) in stages" :key="name"
        :class="{ current: i + 1 === props.stage, done: i + 1 < props.stage }"
        :aria-current="i + 1 === props.stage ? 'step' : undefined"
      >
        {{ name }}
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.funnel-tracker ol {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.funnel-tracker li {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #3b4252;
  color: #9aa4b2;
  background: rgb(20 22 28 / 85%);
}
.funnel-tracker li.done { color: #69db7c; border-color: #2f5e3f; }
.funnel-tracker li.done::before { content: '✓ '; }
.funnel-tracker li.current {
  color: #fff;
  background: #2f3a52;
  border-color: #74c0fc;
  outline: 2px solid #74c0fc;
  outline-offset: 2px;
}
</style>
