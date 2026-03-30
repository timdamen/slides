<template>
  <div class="stack-visualization">
    <div class="viz-container">      
      <!-- 3D Stack Visualization -->
      <div class="stack-3d" ref="stackContainer">
        
        <!-- Layer 3: The Toplayer -->
        <div class="layer toplayer" :class="{ 'highlight': highlightedLayer === 'toplayer' }">
          <div class="layer-label">
            <h2><code>#top-layer</code></h2>
            <p>On top of z-index stacking</p>
          </div>
          <div class="layer-content">
            <div 
              v-for="element in toplayerElements" 
              :key="element.id"
              class="stack-element toplayer-element"
              :class="element.type"
              :style="{ 
                left: element.x + '%', 
                top: element.y + '%',
                animationDelay: element.delay
              }"
              @click="highlightElement(element)"
            >
              <span class="element-label">{{ element.label }}</span>
              <span class="element-type">{{ element.type }}</span>
            </div>
          </div>
        </div>

        <!-- Layer 2: Z-Index Stack (1 to ∞) -->
        <div class="layer z-index-layer" :class="{ 'highlight': highlightedLayer === 'z-index' }">
          <div class="layer-label">
            <h2><code>z-index</code></h2>
            <p>z-index: 1 → <span class="">2147483647</span></p>
          </div>
          <div class="layer-content">
            <div 
              v-for="element in zIndexElements" 
              :key="element.id"
              class="stack-element z-index-element"
              :style="{ 
                left: element.x + '%', 
                top: element.y + '%',
                zIndex: element.zIndex,
                animationDelay: element.delay,

              }"
              @click="promoteToToplayer(element)"
            >
              <span class="element-label">{{ element.label }}</span>
              <span class="element-z-index">z: {{ element.zIndex }}</span>
            </div>
          </div>
        </div>

        <!-- Layer 1: Normal Document Flow -->
        <div class="layer document-flow" :class="{ 'highlight': highlightedLayer === 'document' }">
          <div class="layer-label">
            <h2><code>document</code></h2>
            <p>z-index: auto</p>
          </div>
          <div class="layer-content">
            <div 
              v-for="element in documentElements" 
              :key="element.id"
              class="stack-element document-element"
              :style="{ 
                left: element.x + '%', 
                top: element.y + '%',
                animationDelay: element.delay
              }"
              @click="promoteToZIndex(element)"
            >
              <span class="element-label">{{ element.label }}</span>
              <span class="element-type">{{ element.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls and Information -->
      <div class="controls-panel">
        <div class="layer-controls">
          <button 
            v-for="layer in layers" 
            :key="layer.id"
            class="layer-button"
            :class="{ active: highlightedLayer === layer.id }"
            @click="highlightLayer(layer.id)"
          >
            {{ layer.icon }} {{ layer.name }}
          </button>
        </div>
        
        <div class="interaction-hints">
          <p><strong>💡 Try clicking elements to promote them between layers!</strong></p>
          <div class="hint-list">
            <div class="hint">🖱️ Click document elements → Add z-index</div>
            <div class="hint">🖱️ Click z-index elements → Promote to toplayer</div>
            <div class="hint">🎯 Click layer buttons → Highlight layers</div>
          </div>
        </div>
      </div>

      <!-- Layer Details -->
      <div class="layer-details" v-if="selectedElement">
        <h4>{{ selectedElement.label }}</h4>
        <div class="element-info">
          <div class="info-item">
            <strong>Layer:</strong> {{ getLayerName(selectedElement.layer) }}
          </div>
          <div class="info-item" v-if="selectedElement.zIndex">
            <strong>Z-Index:</strong> {{ selectedElement.zIndex }}
          </div>
          <div class="info-item">
            <strong>Type:</strong> {{ selectedElement.type }}
          </div>
          <div class="info-item">
            <strong>Behavior:</strong> {{ getElementBehavior(selectedElement) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Reactive state
const highlightedLayer = ref(null)
const selectedElement = ref(null)
const stackContainer = ref(null)

// Layer definitions
const layers = reactive([
  { id: 'document', name: 'Document Flow', icon: '📄' },
  { id: 'z-index', name: 'Z-Index Stack', icon: '📚' },
  { id: 'toplayer', name: 'Toplayer', icon: '🚀' }
])

// Document flow elements (bottom layer)
const documentElements = reactive([
  { id: 'd1', label: 'Header', type: 'header', x: 50, y: 10, delay: '0.1s', layer: 'document' },
  { id: 'd2', label: 'Navigation', type: 'nav', x: 60, y: 15, delay: '0.2s', layer: 'document' },
  { id: 'd3', label: 'Content', type: 'main', x: 35, y: 20, delay: '0.3s', layer: 'document' },
  { id: 'd4', label: 'Sidebar', type: 'aside', x: 70, y: 45, delay: '0.4s', layer: 'document' },
  { id: 'd5', label: 'Footer', type: 'footer', x: 30, y: 70, delay: '0.5s', layer: 'document' }
])

// Z-index elements (middle layer)
const zIndexElements = reactive([
  { id: 'z1', label: 'Dropdown', type: 'dropdown', x: 35, y: 5, zIndex: 10, delay: '0.6s', layer: 'z-index' },
  { id: 'z2', label: 'Tooltip', type: 'tooltip', x: 50, y: 30, zIndex: 100, delay: '0.7s', layer: 'z-index' },
  { id: 'z3', label: 'Overlay', type: 'overlay', x: 30, y: 50, zIndex: 1000, delay: '0.8s', layer: 'z-index' },
  { id: 'z4', label: 'Notification', type: 'notification', x: 70, y: 25, zIndex: 9999, delay: '0.9s', layer: 'z-index' }
])

// Toplayer elements (top layer)
const toplayerElements = reactive([
  { id: 't1', label: '<dialog>', type: 'dialog', x: 35, y: 35, delay: '1.0s', layer: 'toplayer' },
  { id: 't2', label: '[popover]', type: 'popover', x: 65, y: 50, delay: '1.1s', layer: 'toplayer' },
  { id: 't3', label: 'requestFullscreen()', type: 'fullscreen', x: 50, y: 20, delay: '1.2s', layer: 'toplayer' }
])

// Methods
const highlightLayer = (layerId) => {
  highlightedLayer.value = highlightedLayer.value === layerId ? null : layerId
  selectedElement.value = null
}

const highlightElement = (element) => {
  selectedElement.value = element
  highlightedLayer.value = null
}

const promoteToZIndex = (element) => {
  // Remove from document elements
  const index = documentElements.findIndex(el => el.id === element.id)
  if (index > -1) {
    documentElements.splice(index, 1)
    
    // Add to z-index elements with a random z-index
    const newZIndex = Math.floor(Math.random() * 1000) + 1
    zIndexElements.push({
      ...element,
      zIndex: newZIndex,
      layer: 'z-index',
      id: `z${Date.now()}`
    })
  }
}

const promoteToToplayer = (element) => {
  // Remove from z-index elements
  const index = zIndexElements.findIndex(el => el.id === element.id)
  if (index > -1) {
    zIndexElements.splice(index, 1)
    
    // Add to toplayer elements
    toplayerElements.push({
      ...element,
      layer: 'toplayer',
      type: 'promoted',
      id: `t${Date.now()}`
    })
  }
}

const getLayerName = (layer) => {
  const layerMap = {
    'document': 'Document Flow',
    'z-index': 'Z-Index Stack', 
    'toplayer': 'Toplayer'
  }
  return layerMap[layer] || layer
}

const getElementBehavior = (element) => {
  const behaviors = {
    'document': 'Normal document flow, can be scrolled with page',
    'z-index': 'Positioned element, stacks according to z-index value',
    'toplayer': 'Always on top, manages own stacking context'
  }
  return behaviors[element.layer] || 'Unknown behavior'
}

// Auto-demo sequence
const startAutoDemo = () => {
  const sequence = [
    () => highlightLayer('document'),
    () => highlightLayer('z-index'),
    () => highlightLayer('toplayer'),
    () => highlightLayer(null)
  ]
  
  sequence.forEach((action, index) => {
    setTimeout(action, (index + 1) * 2000)
  })
}

onMounted(() => {
  // Start auto-demo after a short delay
  setTimeout(startAutoDemo, 3000)
})
</script>

<style scoped>
.stack-visualization {
  /* background: linear-gradient(135deg, #2d3e2f 0%, #4a5d3a 25%, #6b4423 50%, #8b5a3c 75%, #5a4a3a 100%); */
  min-height: 100vh;
  color: white;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  padding: 2rem;
  overflow-x: hidden;
}

.viz-container {
  max-width: 1400px;
  margin: 0 auto;
}

.viz-title {
  font-size: 3.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.viz-subtitle {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: 300;
}

.stack-3d {
  position: relative;
  height: 600px;
}

.layer {
  position: absolute;
  width: 100%;
  height: 150px;
  border-radius: 16px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Layer positioning and styling */
.toplayer {
  top: 0;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.4));
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
  z-index: 30;
}

.z-index-layer {
  top: 170px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.4));
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  z-index: 20;
}

.document-flow {
  top: 340px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.4));
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
  z-index: 10;
}

.layer.highlight {
  transform: scale(1.02);
  border-color: #ffd700;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
}

.layer-label {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  z-index: 100;
}

.layer-label h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.layer-label p {
  font-size: 0.9rem;
  font-family: 'SF Mono', Monaco, monospace;
}

.layer-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.stack-element {
  position: absolute;
  width: 120px;
  height: 80px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: elementAppear 0.6s ease-out;
  animation-fill-mode: both;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.stack-element:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.stack-element:active {
  transform: scale(0.95);
}

.element-label {
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.element-type,
.element-z-index {
  font-size: 0.7rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  font-family: 'SF Mono', Monaco, monospace;
  text-align: center;
}

/* Element type specific styling */
.document-element {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.z-index-element {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.toplayer-element.dialog {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.toplayer-element.popover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.toplayer-element.fullscreen {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  width: 150px;
}

.toplayer-element.promoted {
  background: linear-gradient(135deg, #ec4899, #db2777);
  animation: promote 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3rem;
  align-items: center;
}

.layer-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.layer-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.layer-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.layer-button.active {
  background: #ffd700;
  color: #1a1a1a;
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.interaction-hints {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.hint-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.hint {
  background: rgba(255, 215, 0, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #ffd700;
  font-size: 0.9rem;
}

.layer-details {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.layer-details h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.element-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.info-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #ffd700;
}

/* Animations */
@keyframes elementAppear {
  from {
    opacity: 0;
    transform: scale(0.3) translateY(50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes promote {
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.3) translateY(-100px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .viz-title {
    font-size: 2.5rem;
  }
  
  .stack-3d {
    height: 500px;
  }
  
  .layer {
    height: 150px;
  }
  
  .toplayer {
    top: 0;
  }
  
  .z-index-layer {
    top: 160px;
  }
  
  .document-flow {
    top: 320px;
  }
  
  .stack-element {
    width: 100px;
    height: 70px;
  }
  
  .element-label {
    font-size: 0.8rem;
  }
  
  .element-type,
  .element-z-index {
    font-size: 0.6rem;
  }
  
  .layer-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .hint-list {
    grid-template-columns: 1fr;
  }
}
</style>