<script setup lang="ts">
/**
 * Reusable thank-you / outro slide for every deck.
 *
 * Left: title, name, talks.timdamen.io and the same social links (same
 * icons) as the talks site. Right: QR code linking to
 * https://talks.timdamen.io/link — the hub page with all social, open
 * source and website links. Deck-specific footnotes go in the default slot.
 *
 * Colors ride on the supa11y theme variables with fallbacks, so the slide
 * also works in decks on other themes.
 */
// Imported rather than referenced as a public/ path, so the photo ships with
// the addon instead of needing a copy in every deck that uses this slide.
import headshot from '../assets/ev-tim-damen-headshot.jpg'

withDefaults(defineProps<{
  title?: string
  /** Overrides the bundled headshot. Any URL a deck can serve. */
  photo?: string
  /** Describe the headshot for anyone who cannot see it. */
  photoAlt?: string
}>(), {
  title: 'Thanks, I would love to stay connected',
  photo: headshot,
  photoAlt: 'Tim Damen, smiling, in a dark blue half-zip jumper.',
})

interface SocialLink {
  name: string
  /** visible label: the handle / username / email on that platform */
  handle: string
  href: string
  viewBox: string
  /** tabler outline icons stroke; brand marks fill */
  mode: 'stroke' | 'fill'
  paths: string[]
}

// Same icon set as talks.timdamen.io (tabler outline + brand marks)
const socials: SocialLink[] = [
  {
    name: 'GitHub',
    handle: 'timdamen',
    href: 'https://github.com/timdamen',
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5'],
  },
  {
    name: 'X',
    handle: '@timdamen_io',
    href: 'https://twitter.com/timdamen_io',
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M4 4l11.733 16h4.267l-11.733 -16z', 'M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772'],
  },
  {
    name: 'Bluesky',
    handle: '@timdamen.io',
    href: 'https://bsky.app/profile/timdamen.io',
    viewBox: '0 0 24 24',
    mode: 'fill',
    paths: ['M12 11.388c-.906-1.761-3.372-5.044-5.665-6.662c-2.197-1.55-3.034-1.283-3.583-1.033C2.116 3.978 2 4.955 2 5.528c0 .575.315 4.709.52 5.4c.68 2.28 3.094 3.05 5.32 2.803c-3.26.483-6.157 1.67-2.36 5.898c4.178 4.325 5.726-.927 6.52-3.59c.794 2.663 1.708 7.726 6.444 3.59c3.556-3.59.977-5.415-2.283-5.898c2.225.247 4.64-.523 5.319-2.803c.205-.69.52-4.825.52-5.399c0-.575-.116-1.55-.752-1.838c-.549-.248-1.386-.517-3.583 1.033c-2.293 1.621-4.76 4.904-5.665 6.664'],
  },
  {
    name: 'LinkedIn',
    handle: 'Tim Damen',
    href: 'https://www.linkedin.com/in/tim-damen-20a1b4106/',
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M8 11v5', 'M8 8v.01', 'M12 16v-5', 'M16 16v-3a2 2 0 1 0 -4 0', 'M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z'],
  },
  {
    name: 'Sessionize',
    handle: 'timdamen',
    href: 'https://sessionize.com/timdamen/',
    viewBox: '0 0 48 48',
    mode: 'fill',
    paths: ['M24 0c13.255 0 24 10.745 24 24v20a4 4 0 01-4 4H29l-.003-.338c-.097-5.789-2.694-9.804-7.417-11.92L48 24l-.639-.218C41.644 21.784 36.857 18.857 33 15c-3.857-3.857-6.784-8.644-8.782-14.361L24 0 8 36c0 1.333.333 2.333 1 3 .667.667 1.667 1 3 1l.374.002C19.915 40.082 23 42.592 23 48H4a4 4 0 01-4-4V4a4 4 0 014-4h20zm14.414 9.586c-1.562-1.562-3.461-2.195-4.242-1.414-.781.78-.148 2.68 1.414 4.242 1.562 1.562 3.461 2.195 4.242 1.414.781-.78.148-2.68-1.414-4.242z'],
  },
  {
    name: 'Mail',
    handle: 'hello@timdamen.io',
    href: 'mailto:hello@timdamen.io',
    viewBox: '0 0 24 24',
    mode: 'stroke',
    paths: ['M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z', 'M3 7l9 6l9 -6'],
  },
]

/** The sites, beside the handles. Written without the scheme; the href adds it. */
const sites: string[] = [
  'timdamen.io',
  'talks.timdamen.io',
  'slides.timdamen.io',
]

/** tabler `link`, drawn the same way as the social marks above. */
const LINK_ICON: string[] = [
  'M9 15l6 -6',
  'M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464',
  'M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463',
]
</script>

<template>
  <div class="outro">
    <div class="outro-main">
      <h1 class="outro-title">{{ title }}</h1>

      <div class="outro-id">
        <img class="outro-photo" :src="photo" :alt="photoAlt">
        <div class="outro-idtext">
          <p class="outro-name">Tim Damen</p>
          <a class="outro-site" href="https://talks.timdamen.io" target="_blank" rel="noopener">talks.timdamen.io</a>
        </div>
      </div>

      <div class="outro-lists">
        <ul class="outro-socials">
          <li v-for="s in socials" :key="s.name">
            <a
              :href="s.href" class="outro-social" target="_blank" rel="noopener"
              :aria-label="`${s.handle} on ${s.name}`"
            >
              <svg
                class="outro-icon" :viewBox="s.viewBox" width="23" height="23" aria-hidden="true"
                :fill="s.mode === 'fill' ? 'currentColor' : 'none'"
                :stroke="s.mode === 'stroke' ? 'currentColor' : 'none'"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <path v-for="(d, i) in s.paths" :key="i" :d="d" />
              </svg>
              <span>{{ s.handle }}</span>
            </a>
          </li>
        </ul>

        <ul class="outro-sites">
          <li v-for="site in sites" :key="site">
            <a class="outro-sitelink" :href="`https://${site}`" target="_blank" rel="noopener">
              <svg
                class="outro-icon" viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"
                fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <path v-for="(d, i) in LINK_ICON" :key="i" :d="d" />
              </svg>
              <span>{{ site }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="outro-extra">
        <slot />
      </div>
    </div>

    <a
      class="outro-qr" href="https://talks.timdamen.io/link" target="_blank" rel="noopener"
      aria-label="All links in one place: talks.timdamen.io/link"
    >
      <svg class="outro-qr-code" viewBox="0 0 41 41" shape-rendering="crispEdges" role="img" aria-label="QR code for talks.timdamen.io/link"><path fill="#ffffff" d="M0 0h41v41H0z" /><path stroke="#000000" d="M4 4.5h7m1 0h1m3 0h2m4 0h1m1 0h1m1 0h3m1 0h7M4 5.5h1m5 0h1m3 0h3m2 0h1m3 0h1m1 0h3m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m3 0h1m2 0h1m2 0h2m4 0h3m1 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m1 0h2m1 0h2m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m2 0h1m1 0h2m3 0h1m4 0h2m1 0h1m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m4 0h1m1 0h2m3 0h2m1 0h1m1 0h2m1 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M13 11.5h3m2 0h1m1 0h2m1 0h1m1 0h3M6 12.5h1m1 0h3m1 0h2m2 0h2m1 0h1m2 0h1m2 0h1m2 0h2m3 0h1m2 0h1M7 13.5h1m3 0h1m2 0h3m5 0h1m5 0h1m1 0h1m4 0h2M4 14.5h4m1 0h3m1 0h1m1 0h1m1 0h1m3 0h1m3 0h1m2 0h1m3 0h1m1 0h3M5 15.5h1m1 0h1m1 0h1m1 0h2m1 0h1m2 0h2m1 0h3m5 0h1m1 0h1m4 0h1M4 16.5h2m1 0h1m2 0h1m4 0h4m3 0h1m4 0h1m1 0h2m4 0h2M4 17.5h3m4 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h1m3 0h1m1 0h1m3 0h3M4 18.5h1m1 0h1m3 0h1m1 0h1m1 0h2m3 0h1m4 0h2m2 0h3m3 0h3M4 19.5h1m2 0h1m6 0h1m2 0h2m1 0h3m2 0h2m1 0h1m3 0h1m2 0h2M4 20.5h1m2 0h1m1 0h5m1 0h5m2 0h2m1 0h3m1 0h2m4 0h1M4 21.5h4m1 0h1m2 0h1m1 0h1m4 0h1m3 0h2m4 0h2m2 0h4M4 22.5h2m1 0h1m2 0h8m1 0h2m1 0h1m1 0h1m1 0h1m4 0h2m1 0h3M5 23.5h2m1 0h2m3 0h2m3 0h2m5 0h2m3 0h1m1 0h1m3 0h1M5 24.5h4m1 0h1m3 0h2m2 0h2m1 0h2m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1M6 25.5h1m1 0h2m1 0h4m2 0h4m1 0h1m4 0h3m3 0h1m1 0h2M4 26.5h1m1 0h1m2 0h2m3 0h3m1 0h2m1 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h5M5 27.5h1m3 0h1m4 0h1m1 0h2m3 0h6m1 0h2m2 0h1M4 28.5h1m2 0h5m3 0h1m1 0h1m4 0h2m1 0h8m2 0h1M12 29.5h4m2 0h2m5 0h1m1 0h2m3 0h2m2 0h1M4 30.5h7m3 0h1m2 0h1m6 0h1m1 0h3m1 0h1m1 0h5M4 31.5h1m5 0h1m1 0h1m2 0h1m1 0h4m1 0h7m3 0h1m3 0h1M4 32.5h1m1 0h3m1 0h1m1 0h1m2 0h2m1 0h2m2 0h1m3 0h1m1 0h5m2 0h1M4 33.5h1m1 0h3m1 0h1m2 0h1m5 0h1m3 0h2m1 0h3m3 0h3M4 34.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h1m1 0h3m4 0h2m1 0h1m1 0h4m1 0h1M4 35.5h1m5 0h1m3 0h2m1 0h1m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1m3 0h1M4 36.5h7m2 0h2m1 0h4m1 0h1m1 0h2m1 0h1m1 0h2m1 0h2m2 0h2" /></svg>
      <span class="outro-qr-caption">Scan for all links<br><strong>talks.timdamen.io/link</strong></span>
    </a>
  </div>
</template>

<style scoped>
.outro {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}
.outro-main { min-width: 0; }
/* 2.5rem, not 3rem: sized so "Thank you, let's stay connected" sits on one
   line in the space left beside the QR. Deliberately not `white-space: nowrap`
   — a longer title should wrap rather than run under the QR code. */
.outro-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 0.6rem;
}
/* Photo and name together: the headshot is here to put a face to the name, so
   it belongs beside it rather than off in a column of its own. */
.outro-id {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.4rem;
}
.outro-idtext { min-width: 0; }
.outro-photo {
  flex: none;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  object-fit: cover;
  /* The source is a 4:5 portrait with the head high in the frame; a centred
     square crop would cut the forehead and fill the circle with jumper. */
  object-position: center 18%;
}
.outro-name {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.1rem;
}
.outro-site {
  display: inline-block;
  font-size: 1.18rem;
  font-weight: 600;
  color: inherit;
  border-bottom: none;
}
.outro-site:hover { color: var(--supa11y-link, #74c0fc); }
/* Handles on the left, sites on the right. Two columns rather than one long
   list: nine links stacked would run past the bottom of the slide. */
.outro-lists {
  display: flex;
  align-items: flex-start;
  gap: 2.6rem;
}
.outro-socials,
.outro-sites {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.outro-socials li,
.outro-sites li { margin: 0; }
/* Same geometry as .outro-social so the two columns share a baseline grid. */
.outro-sitelink {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.08rem;
  font-weight: 600;
  color: inherit;
  border-bottom: none;
  padding: 0.2rem 0.1rem;
}
.outro-sitelink:hover { color: var(--supa11y-link, #74c0fc); }
.outro-social {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.08rem;
  font-weight: 600;
  color: inherit;
  border-bottom: none;
  padding: 0.2rem 0.1rem;
}
.outro-social:hover { color: var(--supa11y-link, #74c0fc); }
.outro-icon { flex: none; }
.outro-extra { margin-top: 1.3rem; font-size: 0.7rem; color: var(--supa11y-muted, #9aa4b2); }
.outro-extra :deep(p) { margin: 0.2rem 0; }

.outro-qr {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  border-bottom: none;
  color: inherit;
}
.outro-qr-code {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  /* white quiet zone is part of the SVG; keep a crisp edge on dark decks */
  outline: 1px solid var(--supa11y-code-border, #3b4252);
}
.outro-qr-caption {
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--supa11y-muted, #9aa4b2);
}
.outro-qr-caption strong { color: var(--supa11y-fg, inherit); }
</style>
