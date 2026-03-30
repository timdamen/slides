<!-- Component 5: Feature Detection Demo -->
<template>
  <div class="feature-detection">
    <h3>Progressive Enhancement Demo</h3>
    
    <div class="browser-simulation">
      <label>
        <input 
          v-model="modernBrowser" 
          type="checkbox"
        >
        Modern Browser Mode
      </label>
    </div>

    <div class="feature-grid">
      <div 
        v-for="feature in features" 
        :key="feature.name"
        class="feature-card"
      >
        <h4>{{ feature.name }}</h4>
        <div :class="['status', feature.supported ? 'supported' : 'unsupported']">
          {{ feature.supported ? '✅ Supported' : '❌ Fallback' }}
        </div>
        <p class="strategy">{{ feature.strategy }}</p>
      </div>
    </div>

    <div class="demo-area">
      <button @click="showModal" class="demo-button">
        Open Modal ({{ modalStrategy }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const modernBrowser = ref(true)

const features = computed(() => [
  {
    name: 'Dialog Element',
    supported: modernBrowser.value && 'HTMLDialogElement' in window,
    strategy: modernBrowser.value ? 'Native dialog element' : 'Custom modal overlay'
  },
  {
    name: 'Popover API', 
    supported: modernBrowser.value && 'popover' in HTMLElement.prototype,
    strategy: modernBrowser.value ? 'Built-in popover behavior' : 'Manual positioning & focus'
  },
  {
    name: 'CSS :has() Selector',
    supported: modernBrowser.value,
    strategy: modernBrowser.value ? 'Advanced CSS selectors' : 'JavaScript-based styling'
  }
])

const modalStrategy = computed(() => {
  return features.value[0].supported ? 'Native' : 'Polyfill'
})

const showModal = () => {
  if (features.value[0].supported) {
    // Use native dialog
    alert('Native dialog would open here')
  } else {
    // Use fallback
    alert('Fallback modal would open here')
  }
}
</script>

<style scoped>
.browser-simulation {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.feature-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.feature-card h4 {
  margin-top: 0;
  color: #1f2937;
}

.status {
  font-weight: 600;
  margin: 0.5rem 0;
}

.status.supported {
  color: #059669;
}

.status.unsupported {
  color: #dc2626;
}

.strategy {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.demo-area {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.demo-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>