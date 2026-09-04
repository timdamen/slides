---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: Your Biggest New Customer Can't See Pixels
info: |
  ## Your Biggest New Customer Can't See Pixels
  UtahJS 2026 · Tim Damen · Focusring

  AI agents are browsing, comparing and buying on behalf of users — and they
  consume your site through the same accessibility tree screen readers do.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 40min
drawings:
  persist: false
---

<div class="cover-glow" aria-hidden="true"></div>
<div class="mountains mountains-back" aria-hidden="true"></div>
<div class="mountains mountains-front" aria-hidden="true"></div>

<div class="float-chip chip-agent" aria-hidden="true">🤖</div>
<div class="float-chip chip-code" aria-hidden="true"><span class="chip-mono">&lt;/&gt;</span></div>

<div class="cover-code" aria-hidden="true">
  <span class="code-dim">// what the agent reads</span><br>
  heading "Trail running shoes"<br>
  button "Add to cart" <span class="code-wave">👋</span>
</div>

<div class="cover-wrap cover-center">
  <p class="cover-kicker">UtahJS 2026</p>
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

/* Utah. Static — the mountains do not float. */
.mountains {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.mountains-back {
  height: 170px;
  background: linear-gradient(to top, #1a2233, #232f4a);
  opacity: 0.55;
  clip-path: polygon(0% 100%, 0% 58%, 10% 34%, 20% 60%, 31% 22%, 42% 52%, 52% 30%, 63% 58%, 74% 26%, 86% 56%, 100% 38%, 100% 100%);
}
.mountains-front {
  height: 110px;
  background: linear-gradient(to top, #12151d, #1a2130);
  clip-path: polygon(0% 100%, 0% 48%, 14% 70%, 26% 36%, 39% 66%, 53% 42%, 68% 72%, 81% 44%, 92% 64%, 100% 52%, 100% 100%);
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
.chip-code { top: 238px; right: 236px; animation-delay: 2.6s; }
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
