<template>
  <div class="speak-button-container">
    <button 
      @click="speakNumber"
      :disabled="isLoading || !isSpeechSupported"
      class="speak-button"
      :class="{ 
        'loading': isLoading,
        'unsupported': !isSpeechSupported,
        'speaking': isSpeaking 
      }"
    >
      <span v-if="isLoading">🔄</span>
      <span v-else-if="isSpeaking">🔊</span>
      <span v-else-if="!isSpeechSupported">❌</span>
      <span v-else>🔊</span>
      
      <span class="button-text">
        {{ buttonText }}
      </span>
    </button>
    
    <p class="number-display">{{ formattedNumber }}</p>
    
    <div v-if="!isSpeechSupported" class="error-message">
      Speech synthesis is not supported in your browser
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// The magic number - max 32-bit signed integer
const targetNumber = 2147483647

// Reactive state
const isLoading = ref(false)
const isSpeaking = ref(false)
const isSpeechSupported = ref(false)

// Check if speech synthesis is supported
onMounted(() => {
  isSpeechSupported.value = 'speechSynthesis' in window
})

// Computed properties
const buttonText = computed(() => {
  if (!isSpeechSupported.value) return 'Speech Not Supported'
  if (isLoading.value) return 'Loading...'
  if (isSpeaking.value) return 'Speaking...'
  return 'Speak the Number'
})

const formattedNumber = computed(() => {
  return targetNumber.toLocaleString()
})

// Speech function
const speakNumber = async () => {
  if (!isSpeechSupported.value) {
    console.warn('Speech synthesis not supported')
    return
  }

  if (isLoading.value || isSpeaking.value) return

  try {
    isLoading.value = true
    
    // Stop any ongoing speech
    speechSynthesis.cancel()
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(targetNumber.toString())
    
    // Configure speech settings
    utterance.rate = 0.8 // Slightly slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    // Event handlers
    utterance.onstart = () => {
      isLoading.value = false
      isSpeaking.value = true
    }
    
    utterance.onend = () => {
      isSpeaking.value = false
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      isLoading.value = false
      isSpeaking.value = false
    }
    
    // Wait for voices to load (some browsers need this)
    const voices = speechSynthesis.getVoices()
    if (voices.length === 0) {
      // Wait for voices to load
      await new Promise(resolve => {
        speechSynthesis.onvoiceschanged = resolve
      })
    }
    
    // Speak the number
    speechSynthesis.speak(utterance)
    
  } catch (error) {
    console.error('Error speaking number:', error)
    isLoading.value = false
    isSpeaking.value = false
  }
}

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (speechSynthesis) {
    speechSynthesis.cancel()
  }
})
</script>

<style scoped>
.speak-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.speak-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  min-width: 200px;
  justify-content: center;
}

.speak-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.speak-button:active:not(:disabled) {
  transform: translateY(0);
}

.speak-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.speak-button.loading {
  background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
}

.speak-button.speaking {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  animation: pulse 1.5s ease-in-out infinite;
}

.speak-button.unsupported {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.button-text {
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.number-display {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin: 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #fed7d7;
  border-radius: 6px;
  border: 1px solid #feb2b2;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .number-display {
    background: #2d3748;
    color: #f7fafc;
    border-color: #4a5568;
  }
  
  .error-message {
    background: #742a2a;
    color: #fed7d7;
    border-color: #c53030;
  }
}
</style>