<template>
  <form class="form-container">
    <div class="input-group">
      <label for="email">Email Address</label>
      <div class="input-with-hint">
        <input
          type="email"
          id="email"
          name="email"
        />
        <button 
          type="button" 
          class="hint-button" 
          ref="emailHintButton"
          @click="togglePopover('email')"
          popovertarget="emailPopov"
        >
          ?
        </button>
      </div>
    </div>
    <div 
        id="emailPopov"
      ref="emailPopover"
      popover="auto"
      class="tooltip" 
      :class="{ 'tooltip-visible': visiblePopovers.email }"
      :style="popoverStyles.email"
    >
      <p>
        This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint.
      </p>
    </div>

    <div class="input-group">
      <label for="password">Password</label>
      <div class="input-with-hint">
        <input
          type="password"
          id="password"
          name="password"
        />
        <button 
          type="button" 
          class="hint-button" 
          ref="passwordHintButton"
            popovertarget="passwordPopov"
          @click="togglePopover('password')"
        >
          ?
        </button>
      </div>
    </div>
    <div 
    id="passwordPopov"
      ref="passwordPopover"
      class="tooltip password" 
      popover="auto"
      :class="{ 'tooltip-visible': visiblePopovers.password }"
      :style="popoverStyles.password"
    >
      <p>
        This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint. This is a long hint.
      </p>
    </div>
  </form>
</template>

<script>
import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom'

export default {
  name: 'FormWithHints',
  data() {
    return {
      visiblePopovers: {
        email: false,
        password: false
      },
      popoverStyles: {
        email: {},
        password: {}
      }
    }
  },
  mounted() {
    // Close popovers when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async togglePopover(type) {
    

    },

    async updatePopoverPosition(type) {
      const button = this.$refs[`${type}HintButton`]
      const popover = this.$refs[`${type}Popover`]

      console.log('Updating popover position for:', type)
      console.log('Button:', button)
        console.log('Popover:', popover)

      if (!button || !popover) return

      const { x, y } = await computePosition(button, popover, {
        placement: 'right-start',
        middleware: [
          offset(0), // 8px gap from the button
          flip(), // Flip to opposite side if no space
          shift({ padding: 8 }) // Keep popover in viewport with 8px padding
        ]
      })

      this.popoverStyles[type] = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 1000
      }
    },
  }
}
</script>

<style scoped>
button {
  background: #ddd;
  font-size: 1rem;
  font-weight: 800;
  font-family: monospace;
  border-radius: 100%;
  aspect-ratio: 1/1;
  width: 1.5rem;
  line-height: 0;
  border: 2px solid black;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label {
  font-family: system-ui, sans-serif;
  font-weight: 500;
  color: #ffffff;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

.hint-button {
  background: #4caf50;
  color: white;
  font-size: 0.875rem;
  font-weight: 800;
  font-family: monospace;
  border-radius: 100%;
  aspect-ratio: 1/1;
  width: 1.25rem;
  line-height: 0;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.hint-button:hover {
  background: #45a049;
}

.tooltip {
  font-family: system-ui, sans-serif;
  background: #333;
  color: white;
  font-weight: 400;
  padding: 1rem;
  max-width: 200px;
  line-height: 1.5;
  border-radius: 6px;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.tooltip {
  font-family: system-ui, sans-serif;
  background: #333;
  color: white;
  font-weight: 400;
  padding: 1rem;
  max-width: 200px;
  line-height: 1.5;
  border-radius: 6px;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.tooltip {
  font-family: system-ui, sans-serif;
  background: #575757;
  color: white;
  font-weight: 400;
  padding: 1rem;
  max-width: 200px;
  line-height: 1.5;
  border-radius: 6px;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.tooltip.password {
  font-family: system-ui, sans-serif;
  background: #cf0909;
  color: white;
  font-weight: 400;
  padding: 1rem;
  max-width: 200px;
  line-height: 1.5;
  border-radius: 6px;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}
</style>