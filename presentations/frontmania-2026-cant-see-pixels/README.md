# Your Biggest New Customer Can't See Pixels

Frontmania 2026 · AI track · Tim Damen (Focusring) · Slidev deck.

An AI agent walks the classic e-commerce funnel — Discover → Compare →
Decide → Checkout → Confirm — through the accessibility tree, fails on
realistic broken markup, gets fixed live, and every fix lands a WCAG stamp.
All demos are **fully offline**: no LLM calls, no network, real DOM queries.

## Run

```bash
pnpm install                # from the monorepo root
pnpm --filter @supaslidev/frontmania-2026-cant-see-pixels dev      # dev server
pnpm --filter @supaslidev/frontmania-2026-cant-see-pixels build    # static SPA (canonical artifact)
pnpm --filter @supaslidev/frontmania-2026-cant-see-pixels export   # PDF (degraded: demos become static frames)
```

Build with a base path for hosting under talks.timdamen.io:

```bash
pnpm --filter @supaslidev/frontmania-2026-cant-see-pixels build -- --base /frontmania-2026/
```

## Structure

- `slides.md` — headmatter + cover; imports `pages/*.md` per section
- `components/` — `AgentView` (HTML ⇄ preview ⇄ live AX tree), `AgentSim`
  (scripted offline agent, the slide-20 centerpiece), `LiveRegionDemo`
  (role="status" toggle), `FunnelTracker`, `StatCard`, `WcagBadge`,
  `PostEmbed` (offline-first social embeds), `DeckAudit` (bonus slide)
- `snippets/demos.ts` — Veldloper broken/fixed HTML pairs
- `snippets/demoScripts.ts` — all AgentSim reasoning copy (tune the voice here)
- `utils/a11y.ts` — role/name/state computation via `dom-accessibility-api`
- `global-top.vue` — renders `FunnelTracker` on slides with `funnel: N` frontmatter
- `SOURCES.md` — every number in the deck, with source + date + framing rules

## Demo rehearsal checklist

- [ ] Turn wifi **off**, run the deck front to back once
- [ ] Slide 11 (AgentView, product card): tree shows heading/img/button, "✓ agent-readable"
- [ ] Slide 14 (magic-move): div soup → semantic HTML morphs on click
- [ ] Slide 16 (compare table): Broken shows "Click here"×2 + missing-alt warnings; switch to Fixed
- [ ] Slide 18 (add to cart): Broken = 1 generic warning; Fixed → click into preview, **Tab + Enter** works
- [ ] Slide 20 (AgentSim): Run on Broken → aborts; Reset → Fixed → Run → order confirmed via status message
- [ ] Slide 22 (LiveRegionDemo): visual-only = silence; role="status" = announcement
- [ ] Bonus slide (after Thanks): DeckAudit scan shows 0 warnings
- [ ] Presenter mode: notes visible, timing markers sum to ~36 min + Q&A.
      Markers assume the current line-up (slide 9 = OpenClaw, WebMCP hidden);
      un-hiding WebMCP pushes everything after it ~1 min later. Slides 8 and 9
      are both marked cuttable.
- [ ] Keyboard-navigate the whole deck (arrows/space) — no traps

## TODO(Tim)

1. Confirm Frontmania 2026 date + exact slot length (deck assumes 40 min).
2. Record real agent runs for slides 7/22 (Claude in Chrome GIF recorder or
   Playwright MCP traces) + poster frames → `public/`.
3. Pick real X/Bluesky post IDs for slide 7 and capture fallback screenshots
   (or go screenshots-only) → swap the vendor cards for `<PostEmbed>`.
4. ~~Capture the DevTools accessibility-pane screenshot~~ — done: slide 10 now
   shows `public/images/a11y-tree-chrome-devtools.png` (a developer.chrome.com
   capture, full-page a11y tree + Accessibility pane). Swap it for a Veldloper
   capture if you'd rather demo the deck's own shop.
5. Supply Focusring brand assets or approve the current focus-ring defaults.
6. Approve/tune AgentSim reasoning copy in `snippets/demoScripts.ts`.
7. Decide final hosting path on talks.timdamen.io + QR target for the
   Thanks slide (currently a placeholder box).
8. Re-verify Adobe/Salesforce/OpenAI numbers ~2 weeks before the conference
   (see SOURCES.md).
9. Bio/headshot slide wanted? Currently omitted — Frontmania usually intros
   speakers.
10. Decide whether the WebMCP slide comes back. It sits in
    `pages/02-how-agents-see.md` after slide 9 with `hide: true`; if it does,
    re-verify it first — origin-trial window, browser support and the
    `document.modelContext` API surface all moved during 2026 (SOURCES.md §13).
11. Re-pull the OpenClaw and React star counts on slide 9 shortly before the
    talk (SOURCES.md §14 has the one-liner) — OpenClaw gains ~hundreds a day.

## Verification status (2026-07-07)

- ✅ 29 slides (28 + hidden bonus), all render, zero console errors
  ⚠️ 2026-08-14: slides 8 (harness layer) and 9 (OpenClaw) added, plus a
  WebMCP slide parked behind `hide: true` — the deck presents 31 slides
  (30 + hidden bonus). All build, export and pass axe (below); the
  offline/demo rehearsal has not been redone since.
- ✅ AgentSim: broken run aborts with reasoning; fixed run fills all fields
  by role+name, submits, verifies via `role="status"` — dev **and** built SPA
- ✅ LiveRegionDemo: visual-only toast = silence; `role="status"` = announced
- ✅ Fixed add-to-cart button is keyboard-focusable/activatable in the demo
- ✅ Offline: with all non-localhost requests blocked, every demo works; the
  only external request is Google Fonts, which falls back to system fonts
- ✅ axe-core: zero critical/serious violations on the 29 slides built on
  2026-07-07. Re-run on 2026-08-14 for the new slides (built SPA, served with
  history fallback): still 0 critical/serious; they only reproduce the
  moderate `heading-order` (h1 → card h3) and `region` findings the existing
  card slides already have.
  Note: Slidev's own nav renders two controls ("sync settings", "More
  Options") as a button-inside-a-button (upstream `nested-interactive`);
  they are hidden via `style.css` until fixed upstream — prev/next,
  overview, fullscreen and presenter mode remain.
- ✅ `slidev export` completes (PDF is a static degradation; the built SPA
  is the canonical artifact)

## Accuracy guardrails (do not soften)

- The AX tree is "the fastest, cheapest, most reliable path" — never "the
  only way agents see pages" (agents are hybrid: vision + DOM + AX tree).
- WebMCP is a **draft in a W3C community group**, in a Chrome origin trial —
  never "a W3C standard". It is a second, opt-in channel on top of the page,
  and its own explainer says it is not accessibility technology. Never sell it
  as an accessibility feature or as a replacement for the AX tree.
- browser-use (slide 8) reads DOM **merged with the AX tree** (CDP
  `getFullAXTree`) and `use_vision` defaults to `"auto"` — do not call it
  vision-first; that was a drafting error, see SOURCES.md §12.
- OpenClaw (slide 9): its browser tool *defaults* to a text/ARIA snapshot with
  refs and screenshots are opt-in — never "it never looks at pixels". Star
  counts on that slide are dated; re-pull them, don't round upward.
- A11y-CUA (CHI 2026): agent under *assistive-tech-like conditions* — 78.3%
  default vs 41.7% keyboard-only. NOT "accessible vs inaccessible sites".
- Salesforce 20% = orders "touched/influenced by AI", not autonomously placed.
- Every stat slide carries source + date. AgentSim is labeled as a scripted
  simulation on-slide. No 4.1.1 Parsing (removed in WCAG 2.2).
