<template>
  <div class="popover-demo">
    <div class="demo-container">
      <h2>HTML Popover API Demo</h2>
      <p>Explore different popover use cases and modes. Click around to see how they interact!</p>
      
      <!-- Form Element Hints Section -->
      <section class="demo-section">
        <h3>💡 Form Element Hints</h3>
        <p class="section-description">Helpful information that appears when you need it</p>
        
        <div class="form-demo">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-with-hint">
              <input 
                id="username" 
                type="text" 
                placeholder="Enter username"
                class="form-input"
              />
              <button 
                popovertarget="username-hint" 
                class="hint-button"
                title="Username requirements"
              >
                ?
              </button>
            </div>
            
            <div id="username-hint" popover="auto" class="hint-popover">
              <h4>Username Requirements</h4>
              <ul>
                <li>3-20 characters long</li>
                <li>Letters, numbers, underscore only</li>
                <li>Must start with a letter</li>
                <li>No spaces allowed</li>
              </ul>
              <div class="popover-tip">💡 Choose something memorable!</div>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-hint">
              <input 
                id="password" 
                type="password" 
                placeholder="Enter password"
                class="form-input"
              />
              <button 
                popovertarget="password-hint" 
                class="hint-button"
                title="Password requirements"
              >
                ?
              </button>
            </div>
            
            <div id="password-hint" popover="auto" class="hint-popover">
              <h4>Strong Password Tips</h4>
              <div class="password-strength">
                <div class="strength-item">
                  <span class="icon">🔒</span>
                  <span>At least 8 characters</span>
                </div>
                <div class="strength-item">
                  <span class="icon">🔤</span>
                  <span>Mix of upper & lowercase</span>
                </div>
                <div class="strength-item">
                  <span class="icon">🔢</span>
                  <span>Include numbers</span>
                </div>
                <div class="strength-item">
                  <span class="icon">🎯</span>
                  <span>Add special characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Menu Section -->
      <section class="demo-section">
        <h3>⚡ Action Menus</h3>
        <p class="section-description">Context-sensitive actions for different scenarios</p>
        
        <div class="action-demo">
          <div class="mock-email">
            <div class="email-header">
              <div class="email-info">
                <strong>📧 Project Update - Q4 Planning</strong>
                <div class="email-meta">From: team@company.com • 2 hours ago</div>
              </div>
              <button 
                popovertarget="email-actions" 
                class="action-menu-btn"
                title="Email actions"
              >
                ⋮
              </button>
            </div>
            
            <div id="email-actions" popover="auto" class="action-menu">
              <button class="menu-item" @click="handleAction('reply')">
                <span class="menu-icon">↩️</span>
                Reply
              </button>
              <button class="menu-item" @click="handleAction('forward')">
                <span class="menu-icon">➡️</span>
                Forward
              </button>
              <button class="menu-item" @click="handleAction('archive')">
                <span class="menu-icon">📦</span>
                Archive
              </button>
              <div class="menu-separator"></div>
              <button class="menu-item danger" @click="handleAction('delete')">
                <span class="menu-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>

          <div class="mock-profile">
            <div class="profile-card">
              <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=667eea&color=fff" alt="Profile" class="profile-avatar" />
              <div class="profile-info">
                <strong>Sarah Johnson</strong>
                <div class="profile-title">Senior Developer</div>
              </div>
              <button 
                popovertarget="profile-actions" 
                class="action-menu-btn"
                title="Profile actions"
              >
                ⋮
              </button>
            </div>
            
            <div id="profile-actions" popover="auto" class="action-menu">
              <button class="menu-item" @click="handleAction('view-profile')">
                <span class="menu-icon">👤</span>
                View Full Profile
              </button>
              <button class="menu-item" @click="handleAction('send-message')">
                <span class="menu-icon">💬</span>
                Send Message
              </button>
              <button class="menu-item" @click="handleAction('schedule-meeting')">
                <span class="menu-icon">📅</span>
                Schedule Meeting
              </button>
              <div class="menu-separator"></div>
              <button class="menu-item" @click="handleAction('add-connection')">
                <span class="menu-icon">➕</span>
                Add Connection
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Teaching UI Section -->
      <section class="demo-section">
        <h3>🎓 Teaching UI / Onboarding</h3>
        <p class="section-description">Guide users through your interface with contextual tips</p>
        
        <div class="teaching-demo">
          <div class="mock-dashboard">
            <div class="dashboard-header">
              <h4>Dashboard</h4>
              <button 
                @click="startTour" 
                class="tour-button"
                :disabled="tourActive"
              >
                {{ tourActive ? 'Tour in Progress...' : '🎯 Start Tour' }}
              </button>
            </div>
            
            <div class="dashboard-grid">
              <div class="dashboard-card" id="analytics-card">
                <h5>📊 Analytics</h5>
                <p>View your performance metrics</p>
                <div class="fake-chart">📈 Chart placeholder</div>
              </div>
              
              <div class="dashboard-card" id="settings-card">
                <h5>⚙️ Settings</h5>
                <p>Customize your experience</p>
                <button class="fake-button">Configure</button>
              </div>
              
              <div class="dashboard-card" id="help-card">
                <h5>❓ Help Center</h5>
                <p>Get support when you need it</p>
                <button class="fake-button">Get Help</button>
              </div>
            </div>
          </div>

          <!-- Teaching Popovers (Manual mode for controlled tour) -->
          <div id="tour-step-1" popover="manual" class="teaching-popover">
            <div class="tour-content">
              <div class="tour-header">
                <span class="tour-step">Step 1 of 3</span>
                <button @click="closeTourStep" class="tour-close">✕</button>
              </div>
              <h4>📊 Analytics Dashboard</h4>
              <p>This is where you'll find all your important metrics and performance data. Click here regularly to track your progress!</p>
              <div class="tour-actions">
                <button @click="nextTourStep" class="tour-next">Next →</button>
              </div>
            </div>
          </div>

          <div id="tour-step-2" popover="manual" class="teaching-popover">
            <div class="tour-content">
              <div class="tour-header">
                <span class="tour-step">Step 2 of 3</span>
                <button @click="closeTourStep" class="tour-close">✕</button>
              </div>
              <h4>⚙️ Personalize Your Experience</h4>
              <p>The settings panel lets you customize everything to match your workflow. Set up notifications, themes, and preferences here.</p>
              <div class="tour-actions">
                <button @click="previousTourStep" class="tour-prev">← Back</button>
                <button @click="nextTourStep" class="tour-next">Next →</button>
              </div>
            </div>
          </div>

          <div id="tour-step-3" popover="manual" class="teaching-popover">
            <div class="tour-content">
              <div class="tour-header">
                <span class="tour-step">Step 3 of 3</span>
                <button @click="closeTourStep" class="tour-close">✕</button>
              </div>
              <h4>❓ Never Get Stuck</h4>
              <p>Our help center has articles, tutorials, and live chat support. Don't hesitate to reach out if you need assistance!</p>
              <div class="tour-actions">
                <button @click="previousTourStep" class="tour-prev">← Back</button>
                <button @click="finishTour" class="tour-finish">Finish Tour 🎉</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Popover Modes Explanation -->
      <section class="demo-section">
        <h3>🔧 Popover Modes Explained</h3>
        <div class="modes-grid">
          <div class="mode-card">
            <h4>popover="auto" (Default)</h4>
            <p>Light dismiss behavior, closes other auto popovers</p>
            <div class="mode-example">
              <button popovertarget="auto-demo" class="mode-btn">Try Auto Mode</button>
              <div id="auto-demo" popover="auto" class="mode-popover">
                <strong>Auto Popover</strong>
                <p>• Closes when clicking outside</p>
                <p>• ESC key closes it</p>
                <p>• Closes other auto popovers</p>
              </div>
            </div>
          </div>

          <div class="mode-card">
            <h4>popover="manual"</h4>
            <p>Must be explicitly closed, doesn't auto-close others</p>
            <div class="mode-example">
              <button @click="toggleManualPopover" class="mode-btn">
                {{ manualOpen ? 'Close Manual' : 'Try Manual Mode' }}
              </button>
              <div id="manual-demo" popover="manual" class="mode-popover">
                <strong>Manual Popover</strong>
                <p>• No light dismiss</p>
                <p>• Must be closed explicitly</p>
                <p>• Doesn't close other popovers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive state
const statusMessage = ref('')
const statusType = ref('info')
const tourActive = ref(false)
const currentTourStep = ref(0)
const manualOpen = ref(false)

// Action menu handler
const handleAction = (action) => {
  const actionMessages = {
    'reply': 'Reply window opened',
    'forward': 'Forward dialog opened', 
    'archive': 'Email archived successfully',
    'delete': 'Email moved to trash',
    'view-profile': 'Opening full profile...',
    'send-message': 'Message composer opened',
    'schedule-meeting': 'Calendar opened for scheduling',
    'add-connection': 'Connection request sent'
  }
  
  showStatus(actionMessages[action] || `Action: ${action}`, 'success')
}

// Tour functionality
const startTour = () => {
  tourActive.value = true
  currentTourStep.value = 1
  showTourStep(1)
  showStatus('Welcome tour started! Follow the highlighted areas.', 'info')
}

const showTourStep = (step) => {
  // Close all tour steps first
  for (let i = 1; i <= 3; i++) {
    const popover = document.getElementById(`tour-step-${i}`)
    if (popover) {
      popover.hidePopover()
    }
  }
  
  // Show current step
  const currentPopover = document.getElementById(`tour-step-${step}`)
  if (currentPopover) {
    currentPopover.showPopover()
    
    // Add highlight to corresponding card
    document.querySelectorAll('.dashboard-card').forEach(card => {
      card.classList.remove('tour-highlight')
    })
    
    const cardIds = ['analytics-card', 'settings-card', 'help-card']
    const targetCard = document.getElementById(cardIds[step - 1])
    if (targetCard) {
      targetCard.classList.add('tour-highlight')
    }
  }
}

const nextTourStep = () => {
  if (currentTourStep.value < 3) {
    currentTourStep.value++
    showTourStep(currentTourStep.value)
  }
}

const previousTourStep = () => {
  if (currentTourStep.value > 1) {
    currentTourStep.value--
    showTourStep(currentTourStep.value)
  }
}

const closeTourStep = () => {
  const currentPopover = document.getElementById(`tour-step-${currentTourStep.value}`)
  if (currentPopover) {
    currentPopover.hidePopover()
  }
  document.querySelectorAll('.dashboard-card').forEach(card => {
    card.classList.remove('tour-highlight')
  })
  tourActive.value = false
  currentTourStep.value = 0
}

const finishTour = () => {
  closeTourStep()
  showStatus('Tour completed! You\'re all set to explore. 🎉', 'success')
}

// Manual popover toggle
const toggleManualPopover = () => {
  const popover = document.getElementById('manual-demo')
  if (popover) {
    if (manualOpen.value) {
      popover.hidePopover()
      manualOpen.value = false
    } else {
      popover.showPopover()
      manualOpen.value = true
    }
  }
}

// Utility function
const showStatus = (message, type = 'info') => {
  statusMessage.value = message
  statusType.value = type
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// Listen for popover events
onMounted(() => {
  document.addEventListener('toggle', (event) => {
    if (event.target.matches('[popover]')) {
      if (event.target.id === 'manual-demo') {
        manualOpen.value = event.newState === 'open'
      }
    }
  })
})
</script>

<style scoped>
.popover-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.demo-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.demo-container h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.demo-container > p {
  color: #4a5568;
  margin-bottom: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.demo-section:last-child {
  border-bottom: none;
}

.demo-section h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #718096;
  margin-bottom: 1.5rem;
  font-style: italic;
}

/* Form Demo Styles */
.form-demo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
}

.input-with-hint {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
}

.hint-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #4299e1;
  background: white;
  color: #4299e1;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.hint-button:hover {
  background: #4299e1;
  color: white;
}

/* Action Demo Styles */
.action-demo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
}

.mock-email, .mock-profile {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f7fafc;
}

.email-header, .profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.email-info, .profile-info {
  flex: 1;
}

.email-meta, .profile-title {
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.25rem;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
}

.action-menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.action-menu-btn:hover {
  background: #e2e8f0;
}

/* Teaching Demo Styles */
.teaching-demo {
  max-width: 600px;
}

.mock-dashboard {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f7fafc;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tour-button {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.tour-button:hover:not(:disabled) {
  background: #3182ce;
}

.tour-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.dashboard-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.dashboard-card.tour-highlight {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  transform: scale(1.02);
}

.dashboard-card h5 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.dashboard-card p {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 1rem;
}

.fake-chart {
  background: #edf2f7;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  color: #718096;
}

.fake-button {
  background: #e2e8f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.fake-button:hover {
  background: #cbd5e0;
}

/* Modes Grid */
.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.mode-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f7fafc;
}

.mode-card h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-family: monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.mode-example {
  margin-top: 1rem;
}

.mode-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.mode-btn:hover {
  background: #3182ce;
}

/* Popover Styles */
[popover] {
  border: none;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  background: white;
  margin: 0;
}

.hint-popover {
  max-width: 280px;
  padding: 1rem;
}

.hint-popover h4 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
}

.hint-popover ul {
  margin: 0 0 1rem 0;
  padding-left: 1.25rem;
}

.hint-popover li {
  margin-bottom: 0.25rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.popover-tip {
  background: #edf2f7;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #4a5568;
  border-left: 3px solid #4299e1;
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.strength-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.strength-item .icon {
  font-size: 1rem;
}

.action-menu {
  min-width: 180px;
  padding: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
  color: #2d3748;
}

.menu-item:hover {
  background: #f7fafc;
}

.menu-item.danger {
  color: #e53e3e;
}

.menu-item.danger:hover {
  background: #fed7d7;
}

.menu-separator {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.teaching-popover {
  max-width: 320px;
  padding: 0;
}

.tour-content {
  padding: 1.5rem;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tour-step {
  background: #4299e1;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tour-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
}

.tour-content h4 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
}

.tour-content p {
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  line-height: 1.5;
}

.tour-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.tour-prev, .tour-next, .tour-finish {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.tour-prev {
  background: #e2e8f0;
  color: #4a5568;
}

.tour-prev:hover {
  background: #cbd5e0;
}

.tour-next, .tour-finish {
  background: #4299e1;
  color: white;
}

.tour-next:hover, .tour-finish:hover {
  background: #3182ce;
}

.mode-popover {
  max-width: 200px;
  padding: 1rem;
}

.mode-popover strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.5rem;
}

.mode-popover p {
  font-size: 0.85rem;
  color: #4a5568;
  margin: 0.25rem 0;
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
  background: #bee3f8;
  color: #2b6cb0;
  border: 1px solid #90cdf4;
}

.status-message.success {
  background: #c6f6d5;
  color: #25855a;
  border: 1px solid #9ae6b4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .modes-grid {
    grid-template-columns: 1fr;
  }
  
  .action-demo {
    max-width: none;
  }
  
  .tour-actions {
    flex-direction: column;
  }
  
  .tour-prev, .tour-next, .tour-finish {
    width: 100%;
  }
}
</style>