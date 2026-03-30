<template>
  <div class="demo-container">

    <div class="button-group">
      <button 
        class="toast-button success-btn"
        popovertarget="success-toast"
      >
        Show Success
      </button>

      <button 
        class="toast-button warning-btn"
        popovertarget="warning-toast"
      >
        Show Warning
      </button>

      <button 
        class="toast-button error-btn"
        popovertarget="error-toast"
      >
        Show Error
      </button>
    </div>

    <!-- Toast Elements -->
    <div id="success-toast" class="toast success-toast" popover="auto">
      <div class="toast-icon">✅</div>
      <div class="toast-content">
        <div class="toast-title">Success!</div>
        <div class="toast-message">Operation completed successfully!</div>
      </div>
    </div>

    <div id="warning-toast" class="toast warning-toast" popover="auto">
      <div class="toast-icon">⚠️</div>
      <div class="toast-content">
        <div class="toast-title">Warning</div>
        <div class="toast-message">Please review your input data.</div>
      </div>
    </div>

    <div id="error-toast" class="toast error-toast" popover="auto">
      <div class="toast-icon">❌</div>
      <div class="toast-content">
        <div class="toast-title">Error</div>
        <div class="toast-message">Something went wrong. Please try again.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No JavaScript needed for the popover functionality!
// This demonstrates the power of the HTML popover API
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
  padding: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-subtitle {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 700px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.toast-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.toast-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.toast-button:hover::before {
  width: 300px;
  height: 300px;
}

.toast-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.success-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.warning-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.error-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.toast {
  position: fixed;
  top: -300px;
  right: 24px;
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 380px;
  z-index: 1000;
  align-items: flex-start;
  gap: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  animation: slideInToast 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.95);
}

@keyframes slideInToast {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 700;
  margin-bottom: 0.375rem;
  color: #1a1a1a;
  font-size: 1.05rem;
}

.toast-message {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.success-toast .toast-title {
  color: #059669;
}

.warning-toast .toast-title {
  color: #d97706;
}

.error-toast .toast-title {
  color: #dc2626;
}

.code-example {
  margin-top: 3rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  position: relative;
}

.code-example::before {
  content: 'HTML';
  position: absolute;
  top: -12px;
  left: 20px;
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.code-example pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #334155;
  overflow-x: auto;
  line-height: 1.6;
}

.code-example code {
  color: #0ea5e9;
}

/* Fallback for browsers without popover support */
@supports not (anchor-name: --test) {
  .toast[popover] {
    position: fixed !important;
    top: 24px !important;
    right: 24px !important;
  }
}

/* Slidev specific adjustments */
@media (max-width: 768px) {
  .demo-container {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .toast-button {
    width: 100%;
    max-width: 200px;
  }
  
  .toast {
    right: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>