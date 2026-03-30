<!-- Component 2: Popover with Anchor Positioning -->
<template>
  <div class="popover-demo">
    <button 
      ref="anchorBtn"
      @click="togglePopover"
      class="anchor-btn"
    >
      Click for Popover
    </button>
    
    <div 
      v-show="isOpen"
      ref="popoverEl"
      class="popover"
      :style="popoverStyles"
    >
      <h4>Positioned Popover</h4>
      <p>I'm positioned relative to the button!</p>
      <button @click="closePopover">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const anchorBtn = ref(null)
const popoverEl = ref(null)

const popoverStyles = computed(() => {
  // Simple positioning logic
  return {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '8px'
  }
})

const togglePopover = () => {
  isOpen.value = !isOpen.value
}

const closePopover = () => {
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (popoverEl.value && !popoverEl.value.contains(event.target) &&
      !anchorBtn.value.contains(event.target)) {
    closePopover()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.popover-demo {
  position: relative;
}

.anchor-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.popover {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
}
</style>