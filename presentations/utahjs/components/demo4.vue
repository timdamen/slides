<!-- Component 4: Toast Notification System -->
<template>
  <div class="toast-system">
    <div class="controls">
      <button 
        v-for="type in toastTypes" 
        :key="type.name"
        @click="() => createToast(type)"
        :class="['toast-btn', type.name]"
      >
        {{ type.label }}
      </button>
    </div>

    <Teleport to="body">
      <div class="toast-container">
        <TransitionGroup name="toast" tag="div">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="['toast', toast.type]"
          >
            <div class="toast-content">
              <strong>{{ toast.title }}</strong>
              <p>{{ toast.message }}</p>
            </div>
            <button 
              @click="removeToast(toast.id)"
              class="toast-close"
            >
              ×
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastCounter = 0

const toastTypes = [
  { name: 'success', label: 'Success', title: 'Success!', color: '#10b981' },
  { name: 'warning', label: 'Warning', title: 'Warning', color: '#f59e0b' },
  { name: 'error', label: 'Error', title: 'Error', color: '#ef4444' },
  { name: 'info', label: 'Info', title: 'Info', color: '#3b82f6' }
]

const createToast = (type) => {
  const id = ++toastCounter
  const toast = {
    id,
    type: type.name,
    title: type.title,
    message: `This is a ${type.name} notification message.`,
    color: type.color
  }
  
  toasts.value.push(toast)
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}
</script>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
}

.toast-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.toast-btn.success { background: #10b981; }
.toast-btn.warning { background: #f59e0b; }
.toast-btn.error { background: #ef4444; }
.toast-btn.info { background: #3b82f6; }
</style>

<style>
/* Global toast styles */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid;
  pointer-events: auto;
  max-width: 300px;
}

.toast.success { border-left-color: #10b981; }
.toast.warning { border-left-color: #f59e0b; }
.toast.error { border-left-color: #ef4444; }
.toast.info { border-left-color: #3b82f6; }

.toast-content {
  flex: 1;
}

.toast-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.toast-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  margin-left: 1rem;
}

.toast-close:hover {
  color: #6b7280;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>