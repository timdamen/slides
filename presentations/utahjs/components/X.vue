<template>
  <div class="tweet-container">
    <blockquote 
      ref="tweetRef"
      class="twitter-tweet" 
      data-theme="dark" 
      data-dnt="true" 
      align="center"
    >
      <p lang="en" dir="ltr">
        Browsing the web, 2021 
        <a href="https://t.co/VKJ7OkZ3nr">pic.twitter.com/VKJ7OkZ3nr</a>
      </p>
      &mdash; Andrej Karpathy (@karpathy) 
      <a href="https://twitter.com/karpathy/status/1435827240286109702?ref_src=twsrc%5Etfw">
        September 9, 2021
      </a>
    </blockquote>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TwitterTweet',
  setup() {
    const tweetRef = ref(null)

    const loadTwitterWidgets = () => {
      return new Promise((resolve, reject) => {
        // Check if Twitter widgets script is already loaded
        if (window.twttr && window.twttr.widgets) {
          resolve(window.twttr)
          return
        }

        // Create script element
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.charset = 'utf-8'
        script.async = true
        
        script.onload = () => {
          // Wait for twttr to be available
          const checkTwitter = () => {
            if (window.twttr && window.twttr.widgets) {
              resolve(window.twttr)
            } else {
              setTimeout(checkTwitter, 100)
            }
          }
          checkTwitter()
        }
        
        script.onerror = reject
        
        // Only add script if it doesn't already exist
        if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
          document.head.appendChild(script)
        }
      })
    }

    onMounted(async () => {
      try {
        const twttr = await loadTwitterWidgets()
        // Process the tweet widget
        if (tweetRef.value) {
          twttr.widgets.load(tweetRef.value)
        }
      } catch (error) {
        console.error('Failed to load Twitter widgets:', error)
      }
    })

    return {
      tweetRef
    }
  }
}
</script>

<style scoped>
.tweet-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Fallback styling for when Twitter widgets haven't loaded */
.twitter-tweet {
  max-width: 550px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  background-color: #15202b;
  color: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
}

.twitter-tweet a {
  color: #1da1f2;
  text-decoration: none;
}

.twitter-tweet a:hover {
  text-decoration: underline;
}
</style>