---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: One change. Three hundred repositories. Nobody reports to me.
info: |
  ## Utilising the JavaScript AST for Automated Frontend Lifecycle Management
  Commit Your Code 2026 · Plano TX · Tim Damen

  How a five-person platform team keeps roughly three hundred frontend
  applications current, and the small part of that job where a parser is the
  only safe way to edit somebody else's file.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 30min
drawings:
  persist: false
---

<div class="repo-field" aria-hidden="true"></div>
<div class="repo-live" aria-hidden="true"></div>
<div class="repo-echo repo-echo-1" aria-hidden="true"></div>
<div class="repo-echo repo-echo-2" aria-hidden="true"></div>

<div class="cover-wrap cover-front">
  <p class="cover-kicker">Commit Your Code 2026 · Plano, TX</p>
  <h1 class="cover-title"><span>One change</span><br>300 repositories</h1>
  <p class="cover-byline">Tim Damen · <span class="cover-url">talks.timdamen.io</span></p>
  <p class="cover-programme">Utilising the JavaScript AST for Automated Frontend Lifecycle Management</p>
</div>

<style>
/* Decorations use position: fixed, not absolute: the theme's cover layout wraps
   slide content in a small positioned box that would capture absolute elements,
   while fixed resolves against the slide's scaled container — the full canvas. */
.cover-front {
  position: relative;
  z-index: 5;
}

/* The estate: a faint grid of repositories, strongest away from the title. */
.repo-field {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(116, 192, 252, 0.16) 1.5px, transparent 2.2px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 48% 68% at 79% 30%, black 30%, transparent 88%);
  mask-image: radial-gradient(ellipse 48% 68% at 79% 30%, black 30%, transparent 88%);
}

/* The one repo the change just landed in. Positions sit on the grid's
   26px centres (13 + 26n), so the lit squares read as part of the field. */
.repo-live,
.repo-echo {
  position: fixed;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background-color: var(--blue);
}
.repo-live {
  left: 788.5px;
  top: 112.5px;
  box-shadow: 0 0 10px rgba(116, 192, 252, 0.7);
  animation: repo-pulse 3.2s ease-in-out infinite;
}
.repo-echo { opacity: 0.35; }
.repo-echo-1 { left: 892.5px; top: 242.5px; }
.repo-echo-2 { left: 684.5px; top: 60.5px; }

@keyframes repo-pulse {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 5px rgba(116, 192, 252, 0.35); }
  50% { opacity: 1; box-shadow: 0 0 14px rgba(116, 192, 252, 0.85); }
}

/* The change itself, bottom-right. */
.cover-diff {
  position: fixed;
  right: 3.2rem;
  bottom: 2.6rem;
  z-index: 5;
  font-family: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.82rem;
  line-height: 1.6;
  background-color: var(--panel);
  border: 1px solid #2b3340;
  border-radius: 8px;
  padding: 0.65rem 0.95rem;
}
.diff-del { color: var(--red); }
.diff-add { color: var(--green); }

@media (prefers-reduced-motion: reduce) {
  .repo-live { animation: none; }
}
</style>

---
src: ./pages/01-mandate.md
---

---
src: ./pages/02-mechanism.md
---

---
src: ./pages/03-landing.md
---

---
src: ./pages/05-ast.md
---

---
src: ./pages/06-thesis.md
---
