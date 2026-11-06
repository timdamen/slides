<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  tweetId?: string
  postUrl?: string
  fallback?: string
  alt?: string
  mode?: 'auto' | 'online' | 'offline'
}>(), {
  mode: 'auto',
})

// Conference wifi is where live embeds die: only go online when forced.
const useLive = computed(() => props.mode === 'online' && !!props.tweetId)
</script>

<template>
  <div class="post-embed">
    <Tweet v-if="useLive" :id="tweetId!" />
    <template v-else-if="fallback">
      <img :src="fallback" :alt="alt ?? 'Screenshot of a social media post'">
      <a v-if="postUrl" :href="postUrl" target="_blank" class="post-link">{{ postUrl }}</a>
    </template>
    <div v-else class="post-placeholder">
      <p>📌 Post screenshot missing</p>
      <p v-if="postUrl" class="post-link">{{ postUrl }}</p>
    </div>
  </div>
</template>

<style scoped>
.post-embed img {
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid #3b4252;
}
.post-link {
  display: block;
  font-size: 0.6rem;
  color: #9aa4b2;
  margin-top: 4px;
  word-break: break-all;
}
.post-placeholder {
  border: 1px dashed #3b4252;
  border-radius: 10px;
  padding: 16px;
  color: #9aa4b2;
  font-size: 0.75rem;
  text-align: center;
}
</style>
