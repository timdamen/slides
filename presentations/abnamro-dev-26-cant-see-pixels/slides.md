---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: Your Biggest New Customer Can't See Pixels
info: |
  ## Your Biggest New Customer Can't See Pixels
  ABN AMRO Developer · The Goodbye Meetup · 15 Oct 2026 · Tim Damen

  AI agents are browsing, comparing and buying on behalf of users — and they
  consume your site through the same accessibility tree screen readers do.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 30min
drawings:
  persist: false
---

<div class="cover-glow" aria-hidden="true"></div>
<div class="canal-houses canal-houses-back" aria-hidden="true"></div>
<div class="canal-houses canal-houses-front" aria-hidden="true"></div>

<div class="float-chip chip-agent" aria-hidden="true">🤖</div>
<div class="float-chip chip-code" aria-hidden="true"><span class="chip-mono">&lt;/&gt;</span></div>

<div class="cover-code" aria-hidden="true">
  <span class="code-dim">// what the agent reads</span><br>
  heading "Trail running shoes"<br>
  button "Add to cart" <span class="code-wave">👋</span>
</div>

<div class="cover-wrap cover-center">
  <p class="cover-kicker">ABN AMRO Developer · The Goodbye Meetup</p>
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

/* Amsterdam. A row of canal-house gables — static, they do not float. */
.canal-houses {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.canal-houses-back {
  height: 150px;
  background: linear-gradient(to top, #1a2233, #232f4a);
  opacity: 0.55;
  clip-path: polygon(0% 100%, 0% 40%, 3% 40%, 5% 22%, 7% 40%, 12% 40%, 12% 30%, 14% 30%, 14% 18%, 16% 18%, 16% 30%, 18% 30%, 18% 40%, 25% 40%, 28% 14%, 31% 40%, 38% 40%, 38% 28%, 40% 28%, 40% 16%, 43% 16%, 43% 28%, 45% 28%, 45% 40%, 52% 40%, 55% 20%, 58% 40%, 64% 40%, 64% 26%, 66% 26%, 66% 12%, 69% 12%, 69% 26%, 71% 26%, 71% 40%, 78% 40%, 81% 18%, 84% 40%, 90% 40%, 90% 30%, 92% 30%, 92% 20%, 95% 20%, 95% 30%, 97% 30%, 97% 40%, 100% 40%, 100% 100%);
}
.canal-houses-front {
  height: 100px;
  background: linear-gradient(to top, #12151d, #1a2130);
  clip-path: polygon(0% 100%, 0% 50%, 4% 50%, 7% 22%, 10% 50%, 16% 50%, 16% 36%, 18% 36%, 18% 24%, 21% 24%, 21% 36%, 23% 36%, 23% 50%, 31% 50%, 34% 18%, 37% 50%, 45% 50%, 48% 26%, 51% 50%, 58% 50%, 58% 34%, 60% 34%, 60% 20%, 63% 20%, 63% 34%, 65% 34%, 65% 50%, 73% 50%, 76% 24%, 79% 50%, 86% 50%, 86% 36%, 88% 36%, 88% 26%, 91% 26%, 91% 36%, 93% 36%, 93% 50%, 100% 50%, 100% 100%);
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
