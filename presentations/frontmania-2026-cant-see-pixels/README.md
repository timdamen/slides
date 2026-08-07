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
  (scripted offline agent, the slide-18 centerpiece), `LiveRegionDemo`
  (role="status" toggle), `FunnelTracker`, `StatCard`, `WcagBadge`,
  `PostEmbed` (offline-first social embeds), `DeckAudit` (bonus slide)
- `snippets/demos.ts` — Veldloper broken/fixed HTML pairs
- `snippets/demoScripts.ts` — all AgentSim reasoning copy (tune the voice here)
- `utils/a11y.ts` — role/name/state computation via `dom-accessibility-api`
- `global-top.vue` — renders `FunnelTracker` on slides with `funnel: N` frontmatter
- `SOURCES.md` — every number in the deck, with source + date + framing rules

## Demo rehearsal checklist

- [ ] Turn wifi **off**, run the deck front to back once
- [ ] Slide 9 (AgentView, product card): tree shows heading/img/button, "✓ agent-readable"
- [ ] Slide 12 (magic-move): div soup → semantic HTML morphs on click
- [ ] Slide 14 (compare table): Broken shows "Click here"×2 + missing-alt warnings; switch to Fixed
- [ ] Slide 16 (add to cart): Broken = 1 generic warning; Fixed → click into preview, **Tab + Enter** works
- [ ] Slide 18 (AgentSim): Run on Broken → aborts; Reset → Fixed → Run → order confirmed via status message
- [ ] Slide 20 (LiveRegionDemo): visual-only = silence; role="status" = announcement
- [ ] Bonus slide (after Thanks): DeckAudit scan shows 0 warnings
- [ ] Presenter mode: notes visible, timing markers sum to ~34 min + Q&A
- [ ] Keyboard-navigate the whole deck (arrows/space) — no traps

## TODO(Tim)

1. Confirm Frontmania 2026 date + exact slot length (deck assumes 40 min).
2. Record real agent runs for slides 7/20 (Claude in Chrome GIF recorder or
   Playwright MCP traces) + poster frames → `public/`.
3. Pick real X/Bluesky post IDs for slide 7 and capture fallback screenshots
   (or go screenshots-only) → swap the vendor cards for `<PostEmbed>`.
4. Capture the DevTools accessibility-pane screenshot of the Veldloper demo
   (slide 8) → `public/devtools-ax.png`.
5. Supply Focusring brand assets or approve the current focus-ring defaults.
6. Approve/tune AgentSim reasoning copy in `snippets/demoScripts.ts`.
7. Decide final hosting path on talks.timdamen.io + QR target for the
   Thanks slide (currently a placeholder box).
8. Re-verify Adobe/Salesforce/OpenAI numbers ~2 weeks before the conference
   (see SOURCES.md).
9. Bio/headshot slide wanted? Currently omitted — Frontmania usually intros
   speakers.

## Verification status (2026-07-07)

- ✅ 29 slides (28 + hidden bonus), all render, zero console errors
- ✅ AgentSim: broken run aborts with reasoning; fixed run fills all fields
  by role+name, submits, verifies via `role="status"` — dev **and** built SPA
- ✅ LiveRegionDemo: visual-only toast = silence; `role="status"` = announced
- ✅ Fixed add-to-cart button is keyboard-focusable/activatable in the demo
- ✅ Offline: with all non-localhost requests blocked, every demo works; the
  only external request is Google Fonts, which falls back to system fonts
- ✅ axe-core: zero critical/serious violations on all 29 built slides.
  Note: Slidev's own nav renders two controls ("sync settings", "More
  Options") as a button-inside-a-button (upstream `nested-interactive`);
  they are hidden via `style.css` until fixed upstream — prev/next,
  overview, fullscreen and presenter mode remain.
- ✅ `slidev export` completes (PDF is a static degradation; the built SPA
  is the canonical artifact)

## Accuracy guardrails (do not soften)

- The AX tree is "the fastest, cheapest, most reliable path" — never "the
  only way agents see pages" (agents are hybrid: vision + DOM + AX tree).
- A11y-CUA (CHI 2026): agent under *assistive-tech-like conditions* — 78.3%
  default vs 41.7% keyboard-only. NOT "accessible vs inaccessible sites".
- Salesforce 20% = orders "touched/influenced by AI", not autonomously placed.
- Every stat slide carries source + date. AgentSim is labeled as a scripted
  simulation on-slide. No 4.1.1 Parsing (removed in WCAG 2.2).
