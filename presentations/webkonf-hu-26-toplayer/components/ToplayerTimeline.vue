<template>
  <div class="toplayer-timeline">
    <div class="timeline-container">
      <h1 class="timeline-title mb-10">The Evolution of Layers on the Web</h1>
      <p class="timeline-subtitle mt-3">
        From z-index clashes to native browser solutions
      </p>

      <!-- Timeline line -->
      <div class="timeline-line"></div>

      <!-- Timeline items -->
      <div
        v-for="(item, index) in timelineItems"
        :key="item.id"
        class="timeline-item"
        :class="[
          `timeline-${item.side}`,
          { 'is-visible': visibleItems.includes(index) },
        ]"
        :style="{ animationDelay: `${index * 0.3}s` }"
      >
        <div class="timeline-marker">
          <div class="timeline-icon" :class="item.iconClass">
            {{ item.emoji }}
          </div>
        </div>

        <div class="timeline-content">
          <div class="timeline-period">{{ item.period }}</div>
          <h2 class="timeline-event">{{ item.title }}</h2>
          <ul v-if="item.d" class="timeline-features">
            <li v-for="feature in item.d" :key="feature">{{ feature }}</li>
          </ul>
          <p class="timeline-description">{{ item.description }}</p>

          <!-- Code snippet for technical milestones -->
          <div v-if="item.code" class="timeline-code">
            <pre><code>{{ item.code }}</code></pre>
          </div>

          <!-- Key features list -->
          <ul v-if="item.features" class="timeline-features">
            <li v-for="feature in item.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Utah Connection -->
      <div class="utah-connection">
        <div class="mountain-silhouette"></div>
        <div class="connection-content">
          <h2>🏔️ Utah's Toplayer</h2>
          <p>
            Just like how the layers of rock in Utah's national
            parks tell the story of time, the toplayer represents decades of web development evolution.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visibleItems = ref([]);

const timelineItems = ref([
  {
    id: 1,
    period: "1998",
    title: "The birth of z-index",
    description:
      "The z-index CSS property was introduced in 1998 as part of the CSS Level 2 (CSS2) specification. It was part of the original positioned layout system that included position: absolute, position: relative, and the concept of stacking contexts.",
    emoji: "🆕",
    iconClass: "new",
    side: "left",
    code: `z-index: 1;
position: absolute;
position: relative;`,
    features: [],
  },
  {
    id: 2,
    period: "Early 2000s-2010s",
    title: "The z-index clashes begin",
    description:
      "Developers struggled with overlapping content and modal dialogs, resorting to high z-index values and complex workarounds.",
    emoji: "⚔️",
    iconClass: "war",
    side: "right",
    code: "z-index: 99999; /* Please work! */",
    features: [
      "z-index clashes",
      "Complex stacking context hierarchies",
      "Accessibility nightmares",
      "Libraries like SweetAlert implementing custom stacking",
    ],
  },
  {
    id: 2.5,
    period: "2007-2017",
    title: "Orgin of the Toplayer",
    d: [
      "2007: Devs at Opera started to look into full screen functionality for the video element",
      "2010: Mozilla devs began working on a proposal to allow any element, not just video, to go fullscreen",
      "2012-2015: Prefixed implementations for fullscreen in all major browsers",
      "2016-2017: Prefixes began being dropped in favor of standard requestFullscreen()",
    ],
    code: `// Chrome
element.requestFullscreen()

// Safari
element.webkitRequestFullScreen()

// Firefox
element.mozRequestFullScreen()

// IE11
element.msRequestFullscreen()`,
    emoji: "📽️",
    iconClass: "war",
    side: "left",
    features: [],
  },
  {
    id: 3,
    period: "2014",
    title: "HTML5.2 Dialog Element",
    description:
      "The dialog element was added to HTML, introducing the first hint of elements that could escape normal document flow.",
    emoji: "💬",
    iconClass: "dialog",
    side: "right",
    code: "<dialog>\n  <p>First native modal!</p>\n</dialog>",
    features: [
      "Native modal dialogs",
      "Escape key handling",
      "Limited browser support initially",
      "A lot of custom JS and CSS needed for correct functionality",
      "NOT implemented in the top-layer yet",
    ],
  },
  {
    id: 5.5,
    period: "2022",
    title: "<dailog> in Toplayer",
    description:
      "When Firefox and Safari finally shipped <dialog> in March 2022, they implemented dialog correctly from the start using toplayer, while Chrome had (by then) fixed their retrofit. This is why March 2022 became the 'it finally works everywhere' moment.",
    emoji: "🪄",
    iconClass: "launch",
    side: "left",
    code: "dialog.showModal()",
    features: [
      "Top layer support in Chrome DevTools (Chrome 105)",
      "Firefox's Bug #1637307: 'convert our fullscreen stack into top layer stack, and handle both fullscreen and modal dialog there'",
    ],
  },
  {
    id: 4,
    period: "2020-2022",
    title: "Open UI Groups Popover API",
    description:
      "W3C Open UI community group develops Popover API concepts, defining the need for native top-layer functionality.",
    emoji: "🏗️",
    iconClass: "development",
    side: "right",
    features: [
      "Systematic approach to overlay UI",
      "Focus on accessibility, performance and developer experience",
      "Implemented in the top-layer",
      "Cross-browser standardization efforts",
    ],
  },
  {
    id: 5,
    period: "Early 2023",
    title: "Chrome Ships Popover API",
    description:
      "Chrome 114 becomes the first browser to ship native toplayer support with the Popover API.",
    emoji: "🚀",
    iconClass: "launch",
    side: "left",
    code: '<div popover="auto">\n  <p>I live in the toplayer!</p>\n</div>',
    features: [
      "First native toplayer implementation",
      "No JavaScript required for basic popovers",
      "Built-in light dismiss behavior",
    ],
  },
  {
    id: 6,
    period: "Late 2023",
    title: "Safari Joins the Movement",
    description:
      "Safari 17 adds full Popover API support, bringing toplayer functionality to iOS and macOS.",
    emoji: "🍎",
    iconClass: "apple",
    side: "right",
    features: [
      "Cross-platform consistency",
      "Mobile device support",
      "WebKit implementation",
      "Better developer adoption",
    ],
  },
  {
    id: 7,
    period: "2024-Present",
    title: "Toplayer Goes Mainstream",
    description:
      "The toplayer becomes fundamental to modern web development, with widespread framework integration.",
    emoji: "📈",
    iconClass: "growth",
    side: "left",
    features: [
      "Usages of Popover API increases",
      "Design system adoption",
      "Performance optimizations",
      "Developer tooling improvements",
    ],
  },
]);

let observer = null;

const setupIntersectionObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          if (!visibleItems.value.includes(index)) {
            visibleItems.value.push(index);
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  // Observe all timeline items
  setTimeout(() => {
    document.querySelectorAll(".timeline-item").forEach((item, index) => {
      item.dataset.index = index;
      observer.observe(item);
    });
  }, 100);
};

onMounted(() => {
  setupIntersectionObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.toplayer-timeline {
  min-height: 100vh;
  color: white;
  padding: 2rem 0;
}

.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.timeline-title {
  font-size: 3.5rem;
  line-height: 4rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline-subtitle {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0.9;
  font-weight: 300;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 200px;
  bottom: 200px;
  width: 4px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #ffd700 10%,
    #ffed4a 50%,
    #f59e0b 90%,
    transparent 100%
  );
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.timeline-item {
  position: relative;
  margin-bottom: 6rem;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-left {
  padding-right: calc(50% + 4rem);
}

.timeline-right {
  padding-left: calc(50% + 4rem);
}

.timeline-marker {
  position: absolute;
  top: 0;
  width: 80px;
  height: 80px;
}

.timeline-left .timeline-marker {
  right: calc(50% - 40px);
}

.timeline-right .timeline-marker {
  left: calc(50% - 40px);
}

.timeline-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

.timeline-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.timeline-icon.new {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.war {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.dialog {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.development {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.launch {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.apple {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-icon.growth {
  background: linear-gradient(135deg, #817323, #6a621d);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
}

.timeline-left .timeline-content::after {
  content: "";
  position: absolute;
  top: 30px;
  right: -20px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid rgba(255, 255, 255, 0.1);
}

.timeline-right .timeline-content::after {
  content: "";
  position: absolute;
  top: 30px;
  left: -20px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid rgba(255, 255, 255, 0.1);
}

.timeline-period {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.4rem;
}

.timeline-event {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: white;
}

.timeline-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.timeline-code {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-left: 4px solid #ffd700;
}

.timeline-code pre {
  margin: 0;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 0.9rem;
  color: #00ff88;
}

.timeline-features {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.timeline-features li {
  position: relative;
  padding-left: 2rem;
  line-height: 1.4em;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.timeline-features li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #ffd700;
  font-weight: bold;
}

.utah-connection {
  margin-top: 6rem;
  text-align: center;
  position: relative;
}

.mountain-silhouette {
  height: 100px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.8) 50%,
    transparent 100%
  );
  clip-path: polygon(
    0% 100%,
    15% 60%,
    25% 80%,
    35% 40%,
    45% 70%,
    55% 30%,
    65% 65%,
    75% 45%,
    85% 75%,
    100% 50%,
    100% 100%
  );
  margin-bottom: 2rem;
}

.connection-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  max-width: 650px;
  margin: 0 auto;
}

.connection-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.connection-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .timeline-title {
    font-size: 2.5rem;
  }

  .timeline-subtitle {
    font-size: 1.2rem;
  }

  .timeline-line {
    left: 2rem;
  }

  .timeline-left,
  .timeline-right {
    padding-left: 5rem;
    padding-right: 1rem;
  }

  .timeline-left .timeline-marker,
  .timeline-right .timeline-marker {
    left: -40px;
  }

  .timeline-left .timeline-content::after,
  .timeline-right .timeline-content::after {
    left: -20px;
    border-right: 20px solid rgba(255, 255, 255, 0.1);
    border-left: none;
  }

  .timeline-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}

/* Animation for timeline items appearing */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px) translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px) translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}
</style>
