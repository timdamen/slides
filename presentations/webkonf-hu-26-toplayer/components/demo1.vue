





<!-- 
=============================================================================
INDIVIDUAL VUE COMPONENTS FOR SLIDEV SLIDES
=============================================================================
Copy these components directly into your Slidev slides for interactive demos
-->

<!-- ============= SLIDE 1: The Frustration Demo ============= -->
<template>
  <div class="demo-container">
    <h3>The Z-Index Frustration</h3>
    
    <div class="controls">
      <button @click="showModal" class="btn">Show Broken Modal</button>
      <button @click="hideModal" class="btn-secondary" :disabled="!isVisible">Hide</button>
      <button @click="toggleContent" class="btn-secondary">
        {{ showContent ? 'Hide' : 'Show' }} Blocking Content
      </button>
    </div>

    <div class="broken-container">
      <div v-show="showContent" class="blocking-content">
        High Z-Index Content (z-index: 10)
      </div>
      <Transition name="fade">
        <div v-show="isVisible" class="broken-modal">
          <h4>I'm a "Modal" 😢</h4>
          <p>Z-index: 5 (appears behind!)</p>
          <button @click="hideModal" class="btn">Close</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const showContent = ref(true)

const showModal = () => isVisible.value = true
const hideModal = () => isVisible.value = false
const toggleContent = () => showContent.value = !showContent.value
</script>

<style scoped>
.demo-container {
  padding: 1rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

.broken-container {
  position: relative;
  height: 200px;
  background: #f5f5f5;
  margin: 1rem 0;
  border-radius: 4px;
  overflow: hidden;
}

.blocking-content {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 150px;
  height: 80px;
  background: #3182ce;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  z-index: 10;
  font-size: 0.8rem;
  text-align: center;
}

.broken-modal {
  position: absolute;
  top: 60px;
  left: 80px;
  width: 200px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 5; /* Lower than blocking content! */
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn, .btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn {
  background: #3182ce;
  color: white;
}

.btn-secondary {
  background: #718096;
  color: white;
}

.btn:disabled, .btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>