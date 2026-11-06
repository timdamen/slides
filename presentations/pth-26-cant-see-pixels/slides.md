---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: Your Biggest New Customer Can't See Pixels
info: |
  ## Your Biggest New Customer Can't See Pixels
  Porto Tech Hub Conference · 10 Nov 2026 · Tim Damen

  AI agents are browsing, comparing and buying on behalf of users — and they
  consume your site through the same accessibility tree screen readers do.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 50min
drawings:
  persist: false
---

<div class="cover-glow" aria-hidden="true"></div>
<svg class="porto-skyline" viewBox="0 0 980 170" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="porto-back" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#1a2233" />
      <stop offset="1" stop-color="#232f4a" />
    </linearGradient>
  </defs>
  <path class="porto-city" d="M520 170V112l14-14 14 14h10V94l13-13 13 13h12v-14l15-15 15 15h6V48h7V30h5V16l3-8 3 8v14h5v18h7v32h10l14-14 14 14h14V92l12-12 12 12h16l14-14 14 14h12V76l15-15 15 15h14v14l14-14 14 14h24l14-14 14 14h14l12-12 12 12H980V170z" />
  <path class="porto-bank" d="M0 170v-32h46l22 32zM470 170l24-44h486v44z" />
  <g class="porto-bridge" fill="none">
    <path class="porto-arch" d="M40 170Q270-30 500 170" />
    <path class="porto-deck" d="M0 68H520" />
    <path class="porto-deck" d="M55 142H485" />
    <path class="porto-post" d="M80 68V138M120 68V113M160 68V93M200 68V79M340 68V79M380 68V93M420 68V113M460 68V138M500 68V170" />
    <path class="porto-post" d="M120 113V142M160 93V142M200 79V142M240 71V142M300 71V142M340 79V142M380 93V142M420 113V142" />
  </g>
</svg>

<div class="float-chip chip-agent" aria-hidden="true">🤖</div>
<div class="float-chip chip-code" aria-hidden="true"><span class="chip-mono">&lt;/&gt;</span></div>

<div class="cover-code" aria-hidden="true">
  <span class="code-dim">// what the agent reads</span><br>
  heading "Trail running shoes"<br>
  button "Add to cart" <span class="code-wave">👋</span>
</div>

<div class="cover-wrap cover-center">
  <p class="cover-kicker">Porto Tech Hub Conference · 10 Nov 2026</p>
  <h1 class="cover-title">Your biggest new customer<br><span class="ring-accent">can't see pixels</span></h1>
  <p class="cover-byline">Tim Damen · <span class="cover-url">talks.timdamen.io</span></p>
</div>

<style>
/* Decorations use position: fixed, not absolute: the theme's cover layout wraps
   slide content in a small positioned box that would capture absolute elements,
   while fixed resolves against the slide's scaled container — the full canvas. */
.cover-center {
  position: relative;
  z-index: 5;
}

.cover-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 60% 55% at 38% 30%, rgba(116, 192, 252, 0.12), transparent 70%);
}

/* Porto. The Dom Luís I bridge, and the Ribeira houses with the Clérigos tower. */
.porto-skyline {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 170px;
}
.porto-city {
  fill: url(#porto-back);
  opacity: 0.55;
}
.porto-bank {
  fill: #12151d;
}
.porto-bridge {
  stroke: #2b3853;
}
.porto-arch {
  stroke-width: 9;
}
.porto-deck {
  stroke-width: 5;
}
.porto-post {
  stroke-width: 2.5;
}

/* Floating chips wear the deck's focus-ring motif. */
.float-chip {
  position: fixed;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  background-color: var(--fm-panel);
  border: 1px solid var(--fm-border);
  border-radius: 14px;
  outline: 2px solid var(--fm-ring);
  outline-offset: 3px;
  animation: chip-float 7s ease-in-out infinite;
}
.chip-agent { top: 70px; right: 120px; }
.chip-code { top: 250px; right: 60px; animation-delay: 2.6s; }
.chip-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--fm-ring);
}

@keyframes chip-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cover-code {
  position: fixed;
  right: 3rem;
  bottom: 3rem;
  z-index: 4;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.65;
  text-align: left;
  color: #cdd3dd;
  background-color: rgba(20, 22, 28, 0.88);
  border: 1px solid var(--fm-border);
  border-radius: 10px;
  padding: 0.7rem 1rem;
}
.code-dim { color: var(--fm-muted); }

@media (prefers-reduced-motion: reduce) {
  .float-chip { animation: none; }
}
</style>

---
src: ./pages/01-open.md
---

---
src: ./pages/02-how-agents-see.md
---

---
src: ./pages/03-funnel.md
---

---
src: ./pages/04-twist.md
---

---
src: ./pages/05-business.md
---

---
src: ./pages/06-ending.md
---
