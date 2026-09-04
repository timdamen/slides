<script setup lang="ts">
/**
 * Reusable "who is talking" slide for every deck.
 *
 * Left: the name and the same short bio every talk opens with. Right: the
 * speaking photo. Deck-specific extras go in the default slot, under the bio.
 *
 * Self-contained on purpose, the same way <OutroSlide> is: one tag on a
 * `layout: default` slide, no `image:` frontmatter to keep in sync, and no
 * icon-font classes. The Nuxt mark is inlined as SVG rather than written as
 * `i-logos-nuxt-icon`, because that class only resolves in a deck that both
 * depends on @iconify-json/logos AND has the uno.config.ts workaround for it.
 * One of the two decks using this slide has neither, so the class rendered
 * nothing there. An inline path renders everywhere.
 *
 * Colors ride on the supa11y theme variables with fallbacks, so the slide also
 * works in decks on other themes.
 */
// Imported, not written as '/images/tim-speaking.png': a public/ path resolves
// against whichever deck is building, so every deck needed its own 3.6MB copy
// of the same file. Vite resolves this one out of the addon and emits it into
// the deck's bundle, so the photo travels with the component.
import photo from '../assets/tim-speaking.png'

withDefaults(defineProps<{
  name?: string
  /** Overrides the bundled photo. Any URL a deck can serve. */
  image?: string
  /** Describe the photo for anyone who cannot see it. */
  imageAlt?: string
}>(), {
  name: 'Tim Damen',
  image: photo,
  imageAlt: 'Tim Damen speaking at a conference.',
})

interface BioLine {
  emoji: string
  /** Rendered as-is; the <strong> emphasis is part of the line. */
  text: string
  /** Set on the one line that carries the Nuxt mark. */
  nuxt?: boolean
}

const bio: BioLine[] = [
  { emoji: '🧑‍💻', text: 'Web platform tech lead' },
  { emoji: '🇳🇱', text: 'Working as an engineer in the Netherlands' },
  { emoji: '♿️', text: 'Passionate about making the web work for <strong>everyone</strong>' },
  { emoji: '🧩', text: 'Contributor to <strong>Nuxt</strong>, <strong>@nuxt/a11y</strong>, and more', nuxt: true },
  { emoji: '🔧', text: 'Building <strong>WCAGify</strong> — open source accessibility tooling' },
  { emoji: '🧑‍🧑‍🧒‍🧒', text: 'Pround husband and father of two 👧🏼🧒🏼' },
  { emoji: '🧗🏼‍♂️', text: 'Love to go outdoors and explore' },
]
</script>

<template>
  <div class="intro">
    <div class="intro-main">
      <h1 class="intro-name">{{ name }}</h1>

      <ul class="intro-bio">
        <li v-for="line in bio" :key="line.text" class="intro-line">
          <span class="intro-emoji" aria-hidden="true">{{ line.emoji }}</span>
          <span class="intro-text">
            <svg
              v-if="line.nuxt" class="intro-nuxt" viewBox="0 0 256 168"
              width="18" height="12" role="img" aria-label="Nuxt"
            >
              <path fill="#00dc82" d="M143.618 167.029h95.166c3.023 0 5.992-.771 8.61-2.237a16.96 16.96 0 0 0 6.302-6.115a16.3 16.3 0 0 0 2.304-8.352c0-2.932-.799-5.811-2.312-8.35L189.778 34.6a16.97 16.97 0 0 0-6.301-6.113a17.6 17.6 0 0 0-8.608-2.238c-3.023 0-5.991.772-8.609 2.238a16.96 16.96 0 0 0-6.3 6.113l-16.342 27.473l-31.95-53.724a17 17 0 0 0-6.304-6.112A17.64 17.64 0 0 0 96.754 0c-3.022 0-5.992.772-8.61 2.237a17 17 0 0 0-6.303 6.112L2.31 141.975a16.3 16.3 0 0 0-2.31 8.35c0 2.932.793 5.813 2.304 8.352a16.96 16.96 0 0 0 6.302 6.115a17.6 17.6 0 0 0 8.61 2.237h59.737c23.669 0 41.123-10.084 53.134-29.758l29.159-48.983l15.618-26.215l46.874 78.742h-62.492zm-67.64-26.24l-41.688-.01L96.782 35.796l31.181 52.492l-20.877 35.084c-7.976 12.765-17.037 17.416-31.107 17.416" />
            </svg><span v-html="line.text" />
          </span>
        </li>
      </ul>

      <div class="intro-extra">
        <slot />
      </div>
    </div>

    <img class="intro-photo" :src="image" :alt="imageAlt">
  </div>
</template>

<style scoped>
.intro {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
}
.intro-main { min-width: 0; }
.intro-name {
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.1rem;
}
.intro-bio {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.intro-line {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.35;
}
/* Fixed width so the sentences start on one edge; emoji advance widths vary
   wildly between the flag, the family and the climber. */
.intro-emoji {
  flex: none;
  width: 1.6rem;
}
.intro-text { min-width: 0; }
.intro-nuxt {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.35rem;
}
.intro-extra {
  margin-top: 1.2rem;
  font-size: 0.75rem;
  color: var(--supa11y-muted, #9aa4b2);
}
.intro-extra :deep(p) { margin: 0.2rem 0; }

/* Fills the right half the way `layout: image-right` did, but as part of the
   component so no deck has to carry the path in its frontmatter. */
.intro-photo {
  flex: none;
  width: 42%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
</style>
