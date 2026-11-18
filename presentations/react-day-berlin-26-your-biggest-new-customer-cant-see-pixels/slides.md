---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: Your Biggest New Customer Can't See Pixels
info: |
  ## Your Biggest New Customer Can't See Pixels
  React Day Berlin 2026 · Tim Damen · 4–7 Dec 2026, Berlin & online

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
<div class="skyline skyline-back" aria-hidden="true"></div>
<div class="skyline skyline-front" aria-hidden="true"></div>

<div class="float-chip chip-agent" aria-hidden="true">🤖</div>
<div class="float-chip chip-code" aria-hidden="true"><span class="chip-mono">&lt;/&gt;</span></div>

<div class="cover-code" aria-hidden="true">
  <span class="code-dim">// what the agent reads</span><br>
  heading "Trail running shoes"<br>
  button "Add to cart" <span class="code-wave">👋</span>
</div>

<div class="cover-wrap cover-center">
  <p class="cover-kicker">React Day Berlin · 2026</p>
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

/* Berlin. A low skyline with the Fernsehturm — static, it does not float. */
.skyline {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.skyline-back {
  height: 230px;
  background: linear-gradient(to top, #1a2233, #232f4a);
  opacity: 0.55;
  clip-path: polygon(0% 100%, 0% 70%, 3% 70%, 3% 62%, 13% 62%, 13% 70%, 17% 70%, 17% 58%, 22% 58%, 22% 66%, 28% 66%, 28% 60%, 32% 54%, 36% 60%, 36% 66%, 42% 66%, 42% 56%, 48% 56%, 48% 64%, 54% 64%, 54% 60%, 59.6% 60%, 59.6% 40%, 58.6% 38.5%, 58.3% 34%, 58.6% 29.5%, 59.4% 27%, 59.85% 26.5%, 59.85% 4%, 60% 0%, 60.15% 4%, 60.15% 26.5%, 60.6% 27%, 61.4% 29.5%, 61.7% 34%, 61.4% 38.5%, 60.4% 40%, 60.4% 60%, 62% 60%, 62% 68%, 66% 68%, 66% 52%, 69% 52%, 69% 46%, 72% 46%, 72% 52%, 75% 52%, 75% 62%, 80% 62%, 80% 56%, 86% 56%, 86% 66%, 92% 66%, 92% 58%, 96% 58%, 96% 68%, 100% 68%, 100% 100%);
}
.skyline-front {
  height: 100px;
  background: linear-gradient(to top, #12151d, #1a2130);
  clip-path: polygon(0% 100%, 0% 52%, 5% 52%, 5% 44%, 9% 44%, 11% 34%, 13% 44%, 17% 44%, 17% 56%, 24% 56%, 24% 40%, 30% 40%, 30% 50%, 36% 50%, 38% 38%, 40% 50%, 46% 50%, 46% 42%, 53% 42%, 53% 54%, 60% 54%, 60% 38%, 64% 38%, 66% 30%, 68% 38%, 72% 38%, 72% 50%, 79% 50%, 79% 42%, 85% 42%, 85% 54%, 91% 54%, 93% 40%, 95% 54%, 100% 54%, 100% 100%);
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
