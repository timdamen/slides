---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: Your Biggest New Customer Can't See Pixels
info: |
  ## Your Biggest New Customer Can't See Pixels
  Agentic Engineering Days 2026 · Tim Damen · 20 Nov 2026, Zürich Marriott Hotel, Zurich

  AI agents are browsing, comparing and buying on behalf of users — and they
  consume your site through the same accessibility tree screen readers do.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 25min
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
  <p class="cover-kicker">Agentic Engineering Days · Zurich 2026</p>
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

/* Zurich. The Alps behind the old town: Fraumünster spire, St. Peter's clock
   tower and the Grossmünster twin towers. Static, it does not float. */
.skyline {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.skyline-back {
  height: 250px;
  background: linear-gradient(to top, #26304a, #3d4c6b);
  opacity: 0.6;
  clip-path: polygon(0% 100%, 0% 64%, 5% 54%, 9% 58%, 15% 40%, 19% 47%, 25% 30%, 29% 39%, 33% 34%, 39% 50%, 45% 41%, 51% 24%, 54% 31%, 57% 27%, 63% 43%, 69% 35%, 75% 20%, 79% 30%, 85% 39%, 91% 29%, 96% 42%, 100% 38%, 100% 100%);
}
.skyline-front {
  height: 170px;
  background: linear-gradient(to top, #151924, #1c2333);
  clip-path: polygon(0% 100%, 0% 76%, 4% 76%, 4% 68%, 7% 62%, 10% 68%, 10% 74%, 14% 74%, 14% 66%, 18% 66%, 18% 72%, 21% 72%, 21% 36%, 21.4% 36%, 21.8% 4%, 22.2% 36%, 22.6% 36%, 22.6% 66%, 26% 66%, 26% 60%, 29% 54%, 31.4% 60%, 31.4% 30%, 32.1% 16%, 32.8% 30%, 32.8% 64%, 37% 64%, 37% 70%, 41% 70%, 41% 62%, 45% 62%, 45% 68%, 49% 68%, 49% 56%, 53.6% 56%, 53.6% 24%, 53.9% 19%, 54.3% 16.5%, 54.45% 16%, 54.45% 9%, 54.55% 9%, 54.55% 16%, 54.7% 16.5%, 55.1% 19%, 55.4% 24%, 55.4% 44%, 56.6% 44%, 56.6% 24%, 56.9% 19%, 57.3% 16.5%, 57.45% 16%, 57.45% 9%, 57.55% 9%, 57.55% 16%, 57.7% 16.5%, 58.1% 19%, 58.4% 24%, 58.4% 46%, 64% 46%, 64% 64%, 68% 64%, 68% 58%, 71% 52%, 74% 58%, 74% 70%, 79% 70%, 79% 62%, 84% 62%, 84% 70%, 89% 70%, 89% 60%, 93% 60%, 93% 68%, 97% 68%, 97% 74%, 100% 74%, 100% 100%);
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
