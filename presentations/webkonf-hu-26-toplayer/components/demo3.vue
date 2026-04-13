<!-- Component 3: Interactive Stacking Demo -->
<template>
  <div class="stacking-demo">
    <h3>Z-Index vs Toplayer</h3>
    
    <div class="demo-controls">
      <label>
        <input 
          v-model="useTopLayer" 
          type="checkbox"
        >
        Use Toplayer
      </label>
      <button @click="addLayer">Add Layer</button>
    </div>

    <div class="stacking-context">
      <div 
        v-for="layer in layers" 
        :key="layer.id"
        class="layer"
        :class="{ 'in-toplayer': useTopLayer && layer.promoted }"
        :style="getLayerStyles(layer)"
        @click="promoteLayer(layer.id)"
      >
        Layer {{ layer.id }}
        <br>
        <small>z: {{ layer.zIndex }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const useTopLayer = ref(false)
const layers = ref([
  { id: 1, zIndex: 1, promoted: false, color: '#e53e3e' },
  { id: 2, zIndex: 5, promoted: false, color: '#3182ce' },
  { id: 3, zIndex: 10, promoted: false, color: '#38a169' }
])

let nextId = 4

const addLayer = () => {
  layers.value.push({
    id: nextId++,
    zIndex: Math.floor(Math.random() * 20) + 1,
    promoted: false,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })
}

const promoteLayer = (id) => {
  const layer = layers.value.find(l => l.id === id)
  if (layer) {
    layer.promoted = !layer.promoted
  }
}

const getLayerStyles = (layer) => {
  const baseStyles = {
    backgroundColor: layer.color,
    zIndex: useTopLayer.value && layer.promoted ? 999999 : layer.zIndex,
    transform: layer.promoted && useTopLayer.value ? 'scale(1.1)' : 'scale(1)'
  }
  
  return baseStyles
}
</script>

<style scoped>
.stacking-context {
  position: relative;
  height: 300px;
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
}

.layer {
  position: absolute;
  width: 100px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.layer:nth-child(1) { top: 20px; left: 20px; }
.layer:nth-child(2) { top: 60px; left: 80px; }
.layer:nth-child(3) { top: 100px; left: 140px; }
.layer:nth-child(n+4) { 
  top: calc(20px + var(--index) * 40px); 
  left: calc(200px + var(--index) * 30px); 
}

.in-toplayer {
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  outline: 2px solid #ff6b6b;
}

.demo-controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
