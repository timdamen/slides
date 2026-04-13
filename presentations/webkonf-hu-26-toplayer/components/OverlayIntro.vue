<template>
  <div class="overlapping-content-demo">
    <div class="slide-container">
      <h1 class="title">Today, the web can overlap</h1>
      
      <div class="content-layout">
        <!-- Regular page content -->
        <div class="content-block full"></div>
        <div class="content-block large"></div>
        
        <div class="content-row">
          <div class="content-block"></div>
          <div class="content-block"></div>
          <div class="content-block"></div>
        </div>
        
        <div class="content-block medium"></div>
        <div class="content-block small"></div>
        
        <div class="content-row">
          <div class="content-block"></div>
          <div class="content-block"></div>
        </div>
        
        <div class="content-block full"></div>
        <div class="content-block large"></div>
        
        <!-- The overlapping element -->
        <div class="overlay-element" @mouseenter="handleOverlayHover" @mouseleave="handleOverlayLeave">
          <div class="overlay-content">
            <div class="overlay-title">Toplayer Content</div>
            <div class="overlay-subtitle">Always on top!</div>
          </div>
        </div>
        
        <!-- Dialog/Modal backdrop -->
        <div class="dialog-backdrop"></div>
        
        <!-- Dialog/Modal element - APPEARS FIRST -->
        <div 
          class="demo-dialog" 
          @click="handleDialogClick"
          ref="dialogElement"
        >
          <div class="dialog-content">
            <div class="dialog-title">Modal</div>
          </div>
        </div>
        
        <!-- Popover element - APPEARS SECOND -->
        <div 
          class="demo-popover" 
          @mouseenter="handlePopoverHover" 
          @mouseleave="handlePopoverLeave"
          ref="popoverElement"
        >
          <div class="popover-content">
            <div class="popover-title">Popover</div>
          </div>
        </div>
        
        <!-- Floating particles -->
        <div 
          v-for="particle in particles" 
          :key="particle.id"
          class="particle"
          :style="particle.style"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const dialogElement = ref(null)
const popoverElement = ref(null)
const particles = ref([])
const intervalIds = ref([])

let particleCounter = 0

// Methods
const handleOverlayHover = (event) => {
  event.target.style.transform = 'scale(1.05) rotate(1deg)'
  event.target.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.6)'
}

const handleOverlayLeave = (event) => {
  event.target.style.transform = 'scale(1) rotate(0deg)'
  event.target.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.4)'
}

const handlePopoverHover = (event) => {
  if (event.target.style.opacity !== '0') {
    event.target.style.transform = 'scale(1.1) translateY(-5px)'
    event.target.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.6)'
  }
}

const handlePopoverLeave = (event) => {
  if (event.target.style.opacity !== '0') {
    event.target.style.transform = 'scale(1) translateY(0)'
    event.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)'
  }
}

const handleDialogClick = () => {
  if (dialogElement.value) {
    dialogElement.value.style.transform = 'translate(-50%, -50%) scale(1.05)'
    setTimeout(() => {
      if (dialogElement.value) {
        dialogElement.value.style.transform = 'translate(-50%, -50%) scale(1)'
      }
    }, 200)
  }
}

const createFloatingElement = () => {
  const id = ++particleCounter
  const particle = {
    id,
    style: {
      position: 'absolute',
      width: '8px',
      height: '8px',
      background: 'rgba(255, 215, 0, 0.8)',
      borderRadius: '50%',
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      animation: 'float 3s ease-in-out infinite',
      pointerEvents: 'none',
      zIndex: 5
    }
  }
  
  particles.value.push(particle)
  
  // Remove after animation
  setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
  }, 3000)
}

const createDialogParticles = () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const id = ++particleCounter
      const particle = {
        id,
        style: {
          position: 'absolute',
          width: '6px',
          height: '6px',
          background: 'rgba(239, 68, 68, 0.8)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          animation: 'float 2s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 31
        }
      }
      
      particles.value.push(particle)
      
      setTimeout(() => {
        const index = particles.value.findIndex(p => p.id === id)
        if (index > -1) {
          particles.value.splice(index, 1)
        }
      }, 2000)
    }, i * 500)
  }
}

const createPopoverGlow = () => {
  if (popoverElement.value) {
    popoverElement.value.style.filter = 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))'
    
    // Pulsing glow effect for popover since it stays visible
    const glowInterval = setInterval(() => {
      if (popoverElement.value) {
        popoverElement.value.style.filter = 'drop-shadow(0 0 30px rgba(59, 130, 246, 1))'
        setTimeout(() => {
          if (popoverElement.value) {
            popoverElement.value.style.filter = 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))'
          }
        }, 1000)
      }
    }, 3000)
    
    intervalIds.value.push(glowInterval)
  }
}

// Lifecycle hooks
onMounted(() => {
  // Create additional floating elements for visual interest
  setTimeout(() => {
    // createFloatingElement()
  }, 5000)
  
  // Add dialog-specific effects when it appears
  setTimeout(() => {
    createDialogParticles()
  }, 6000)
  
  // Add popover-specific effects when it appears
  setTimeout(() => {
    createPopoverGlow()
  }, 7000)
})

onUnmounted(() => {
  // Clean up intervals
  intervalIds.value.forEach(id => clearInterval(id))
})
</script>

<style scoped>
.overlapping-content-demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  overflow: hidden;
}

.slide-container {
  width: 90%;
  max-width: 1200px;
  height: 70vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-align: center;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.content-layout {
  position: relative;
  width: 800px;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  overflow: hidden;
}

/* Regular page content blocks */
.content-block {
  background: #868990;
  border-radius: 6px;
  margin-bottom: 1rem;
  opacity: 0;
  animation: slideInContent 0.6s ease-out forwards;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.content-block:hover {
  background: #5a6374;
  transform: translateY(-2px);
}

/* Different sizes for content blocks to simulate real layout */
.content-block.full { width: 100%; height: 3rem; animation-delay: 1s; }
.content-block.large { width: 85%; height: 2.5rem; animation-delay: 1.2s; }
.content-block.medium { width: 60%; height: 2rem; animation-delay: 1.4s; }
.content-block.small { width: 40%; height: 2rem; animation-delay: 1.6s; }

/* Row layouts */
.content-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  animation-delay: 1.8s;
}

.content-row .content-block {
  flex: 1;
  height: 2rem;
  margin-bottom: 0;
}

.content-row .content-block:nth-child(1) { animation-delay: 1.8s; }
.content-row .content-block:nth-child(2) { animation-delay: 2s; }
.content-row .content-block:nth-child(3) { animation-delay: 2.2s; }

/* The overlapping element - the star of the show */
.overlay-element {
  position: absolute;
  top: 30%;
  right: 10%;
  width: 280px;
  height: 200px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 50%, #f59e0b 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.3);
  
  /* Start hidden and animate in */
  opacity: 0;
  transform: scale(0.3) translateY(50px);
  animation: overlayAppear 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3s forwards;
  
  /* Add the arrow pointing to content */
  position: relative;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-element::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid #ffd700;
  filter: drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.2));
}

.overlay-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.overlay-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #7c2d12;
  margin-bottom: 0.5rem;
}

.overlay-subtitle {
  font-size: 1rem;
  color: #a16207;
  font-weight: 500;
}

/* Dialog backdrop */
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: 0;
  animation: backdropSequence 3s ease-in-out 4s forwards;
  z-index: 25;
  pointer-events: none;
}

/* Dialog/Modal element - APPEARS FIRST AT 4s */
.demo-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 200px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 16px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.5);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
  animation: dialogSequence 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards;
  z-index: 30;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  z-index: 31;
}

.dialog-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dialog-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

/* Popover element - APPEARS SECOND AT 10s */
.demo-popover {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 220px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  animation: popoverAppearStay 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 10s forwards,
             popoverBounce 2s ease-in-out 11.5s infinite;
  z-index: 20;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-popover::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #3b82f6;
}

.popover-content {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.popover-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.popover-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Floating particles for extra visual interest */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 215, 0, 0.6);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
  pointer-events: none;
}

/* Z-index indicator */
.z-index-indicator {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 4s forwards;
}

/* Pulsing glow effect on overlay */
.overlay-element::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  border-radius: 20px;
  z-index: -1;
  animation: pulse 2s ease-in-out infinite 4s;
  opacity: 0;
}

/* Animations */
@keyframes fadeInTitle {
  from { 
    opacity: 0; 
    transform: translateY(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slideInContent {
  from { 
    opacity: 0; 
    transform: translateX(-50px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
  }
}

@keyframes overlayAppear {
  0% { 
    opacity: 0; 
    transform: scale(0.3) translateY(50px) rotate(-10deg);
  }
  70% { 
    transform: scale(1.1) translateY(-10px) rotate(2deg);
  }
  100% { 
    opacity: 1; 
    transform: scale(1) translateY(0) rotate(0deg);
  }
}

@keyframes dialogSequence {
  0% { 
    opacity: 0; 
    transform: translate(-50%, -50%) scale(0.3);
  }
  25% { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1.2);
  }
  45% { 
    transform: translate(-50%, -50%) scale(0.95);
  }
  55% { 
    transform: translate(-50%, -50%) scale(1.05);
  }
  65% { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1);
  }
  90% { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1);
  }
  100% { 
    opacity: 0; 
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@keyframes backdropSequence {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes popoverAppearStay {
  0% { 
    opacity: 0; 
    transform: scale(0.8) translateY(20px);
  }
  60% { 
    opacity: 1; 
    transform: scale(1.1) translateY(-5px);
  }
  100% { 
    opacity: 1; 
    transform: scale(1) translateY(0);
  }
}

@keyframes popoverBounce {
  0%, 100% { 
    transform: scale(1) translateY(0);
  }
  50% { 
    transform: scale(1.05) translateY(-6px);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0;
    transform: scale(1);
  }
  50% { 
    opacity: 0.3;
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .content-layout {
    width: 95%;
    height: 400px;
  }
  
  .overlay-element {
    width: 220px;
    height: 160px;
    top: 25%;
    right: 5%;
  }
  
  .title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  .demo-dialog {
    width: 280px;
    height: 160px;
  }
  
  .demo-popover {
    width: 180px;
    height: 100px;
  }
}

/* Add subtle background animation */
.content-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 215, 0, 0.03) 50%, 
    transparent 70%);
  animation: backgroundShimmer 8s ease-in-out infinite;
  border-radius: 12px;
}

@keyframes backgroundShimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}
</style>
