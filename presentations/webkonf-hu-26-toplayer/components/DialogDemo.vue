<template>
  <div class="dialog-demo">
    <div class="demo-container">
      <h2>HTML Dialog Element Demo</h2>
      
      <div class="button-group">
        <button 
          @click="showSurveyDialog" 
          class="demo-button survey-btn"
        >
     Survey dialog
        </button>
        
        <button 
          @click="showSessionDialog" 
          class="demo-button session-btn"
        >
          Session extend
        </button>
        
        <!-- <button 
          @click="showUnsavedDialog" 
          class="demo-button warning-btn"
        >
         Unsaved changes
        </button> -->
      </div>
    </div>

    <!-- Survey Dialog (Non-modal) -->
    <dialog 
      ref="surveyDialog" 
      class="survey-dialog"
      @close="handleSurveyClose"
    >
      <div class="dialog-content survey-content">
        <div class="dialog-header">
          <h2>📋 Quick Survey</h2>
          <button 
            @click="closeSurveyDialog" 
            class="close-btn"
            aria-label="Close survey"
          >
            ✕
          </button>
        </div>
        
        <div class="dialog-body">
          <p>How satisfied are you with our service?</p>
          <p class="dialog-subtitle">This will only take 30 seconds</p>
        </div>
        
        <div class="dialog-actions">
          <button @click="participateInSurvey" class="btn btn-primary">
            Take Survey
          </button>
          <button @click="closeSurveyDialog" class="btn btn-secondary">
            Maybe Later
          </button>
        </div>
      </div>
    </dialog>

    <!-- Session Expiry Dialog (Modal) -->
    <dialog 
      ref="sessionDialog" 
      class="session-dialog"
      @close="handleSessionClose"
    >
      <div class="dialog-content session-content">
        <div class="dialog-header">
          <div class="session-icon">🔒</div>
          <h2>Session About to Expire</h2>
        </div>
        
        <div class="dialog-body">
          <p>Your login session will expire in <strong>{{ sessionTimeLeft }}</strong>.</p>
          <p>Would you like to stay logged in?</p>
        </div>
        
        <div class="dialog-actions">
          <button @click="extendSession" class="btn btn-primary">
            Stay Logged In
          </button>
          <button @click="logoutNow" class="btn btn-secondary">
            Logout Now
          </button>
        </div>
      </div>
    </dialog>

    <!-- Unsaved Changes Dialog (Modal) -->
    <dialog 
      ref="unsavedDialog" 
      class="unsaved-dialog"
      @close="handleUnsavedClose"
    >
      <div class="dialog-content warning-content">
        <div class="dialog-header">
          <div class="warning-icon">⚠️</div>
          <h2>Unsaved Changes</h2>
        </div>
        
        <div class="dialog-body">
          <p>You have unsaved changes that will be lost if you close this window.</p>
          <div class="changes-list">
            <ul>
              <li>Profile information updated</li>
              <li>2 new comments added</li>
              <li>Settings modified</li>
            </ul>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button @click="saveAndClose" class="btn btn-primary">
            Save & Continue
          </button>
          <button @click="discardChanges" class="btn btn-danger">
            Discard Changes
          </button>
          <button @click="cancelClose" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </dialog>

    <!-- Demo Status Messages -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Template refs
const surveyDialog = ref(null)
const sessionDialog = ref(null)
const unsavedDialog = ref(null)

// Reactive state
const statusMessage = ref('')
const statusType = ref('info')
const sessionTimeLeft = ref('2:30')

// Timer for session countdown
let sessionTimer = null

// Survey Dialog Functions
const showSurveyDialog = () => {
  if (surveyDialog.value) {
    surveyDialog.value.show() // Non-modal
  }
}

const closeSurveyDialog = () => {
  if (surveyDialog.value) {
    surveyDialog.value.close()
  }
}

const participateInSurvey = () => {
  closeSurveyDialog()
}

const handleSurveyClose = () => {
}

// Session Dialog Functions
const showSessionDialog = () => {
  if (sessionDialog.value) {
    sessionDialog.value.showModal() // Modal
    startSessionCountdown()
  }
}

const startSessionCountdown = () => {
  let seconds = 150 // 2:30
  sessionTimer = setInterval(() => {
    seconds--
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    sessionTimeLeft.value = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    
    if (seconds <= 0) {
      clearInterval(sessionTimer)
      logoutNow()
    }
  }, 1000)
}

const extendSession = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
  }
  sessionDialog.value?.close()
}

const logoutNow = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
  }
  sessionDialog.value?.close()
}

const handleSessionClose = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
  }
}

// Unsaved Changes Dialog Functions
const showUnsavedDialog = () => {
  if (unsavedDialog.value) {
    unsavedDialog.value.showModal() // Modal
  }
}

const saveAndClose = () => {
  unsavedDialog.value?.close()
}

const discardChanges = () => {
  unsavedDialog.value?.close()
}

const cancelClose = () => {
  unsavedDialog.value?.close()
}

const handleUnsavedClose = () => {
}

// Utility Functions
const showStatus = (message, type = 'info') => {
  statusMessage.value = message
  statusType.value = type
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// Cleanup
onUnmounted(() => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
  }
})
</script>

<style scoped>
.dialog-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.demo-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.demo-container h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.demo-container p {
  color: #4a5568;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.demo-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  position: relative;
}

.demo-button small {
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.8;
}

.survey-btn {
  background: linear-gradient(135deg, #48BB78 0%, #38A169 100%);
  color: white;
}

.session-btn {
  background: linear-gradient(135deg, #4299E1 0%, #3182CE 100%);
  color: white;
}

.warning-btn {
  background: linear-gradient(135deg, #F56565 0%, #E53E3E 100%);
  color: white;
}

.demo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Dialog Styles */
dialog {
  border: none;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  max-width: 400px !important;
  width: 90vw;
}

dialog::backdrop {
  background: rgba(0,0,0,0.7);
  animation: backdropFade 0.3s ease;
}

@keyframes backdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content {
  padding: 0;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2d3748;
}

.dialog-body {
  background-color: white;
  padding: 1rem 1.5rem;
}

.dialog-body p {
  margin: 0 0 1rem;
  color: #4a5568;
  line-height: 1.5;
}

.dialog-subtitle {
  font-size: 0.9rem;
  color: #718096 !important;
  font-style: italic;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  background-color: #262624;
  border: solid 5px white;
}

/* Survey Dialog Specific */
.survey-dialog {
  position: fixed;
  bottom: 20px;
  left: 20px;
  margin: 0;
  max-width: 320px;
}

.survey-content {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.survey-content .dialog-header {
  background: #48BB78;
  color: white;
  border-bottom: none;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.2);
}

/* Session Dialog Specific */
.session-content .dialog-header {
  background: #4299E1;
  color: white;
  border-bottom: none;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
}

.session-icon {
  font-size: 2rem;
}

/* Warning Dialog Specific */
.warning-content .dialog-header {
  background: #F56565;
  color: white;
  border-bottom: none;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
}

.warning-icon {
  font-size: 2rem;
}

.changes-list {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.changes-list ul {
  margin: 0;
  padding-left: 1.5rem;
}

.changes-list li {
  color: #c53030;
  margin-bottom: 0.25rem;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: #4299E1;
  color: white;
}

.btn-primary:hover {
  background: #3182CE;
}

.btn-secondary {
  background: #E2E8F0;
  color: #4A5568;
}

.btn-secondary:hover {
  background: #CBD5E0;
}

.btn-danger {
  background: #F56565;
  color: white;
}

.btn-danger:hover {
  background: #E53E3E;
}

/* Status Messages */
.status-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1000;
  max-width: 300px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.status-message.info {
  background: #BEE3F8;
  color: #2B6CB0;
  border: 1px solid #90CDF4;
}

.status-message.success {
  background: #C6F6D5;
  color: #25855A;
  border: 1px solid #9AE6B4;
}

.status-message.warning {
  background: #FEFCBF;
  color: #B7791F;
  border: 1px solid #F6E05E;
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .demo-button {
    min-width: auto;
    width: 100%;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .survey-dialog {
    bottom: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .status-message {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>