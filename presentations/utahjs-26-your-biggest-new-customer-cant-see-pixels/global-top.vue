<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import FunnelTracker from './components/FunnelTracker.vue'

const { currentSlideRoute } = useNav()
const stage = computed<number | undefined>(
  () => (currentSlideRoute.value?.meta?.slide?.frontmatter as any)?.funnel,
)
</script>

<template>
  <FunnelTracker v-if="stage" :stage="stage" class="funnel-global" />
</template>

<style scoped>
.funnel-global {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 40;
}
</style>
