/**
 * The default code theme renders comments at 4.4:1 and punctuation at 3:1 on
 * this background, which fails WCAG AA for body text and is genuinely hard to
 * read from the back of a conference room. `github-dark-high-contrast` is the
 * same family with the token colours lifted above 4.5:1.
 *
 * `pnpm audit` (slidev build + scripts/a11y-audit.mjs) measures every rendered
 * text node, so a regression here fails the build rather than going unnoticed.
 *
 * NOTE — deliberately no `import { defineShikiSetup } from '@slidev/types'`.
 * That package is not a dependency of this deck, and pnpm's strict node_modules
 * means the import fails to resolve under `slidev dev`:
 *     Failed to resolve import "@slidev/types" from "setup/shiki.ts"
 * `defineShikiSetup` is only an identity helper for typing, so exporting the
 * function directly behaves identically at runtime and keeps the deck
 * dependency-free. (presentations/utahjs and presentations/webkonf-hu-26-toplayer
 * still carry the broken import and will hit the same error when next run.)
 */
export default () => ({
  themes: {
    dark: 'github-dark-high-contrast',
    light: 'github-light-high-contrast',
  },
})
