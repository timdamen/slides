# The new customer journey

<div class="funnel-hero">
<v-clicks>
  <div class="funnel-step">1 · Discover</div>
  <div class="funnel-step">2 · Compare</div>
  <div class="funnel-step">3 · Decide</div>
  <div class="funnel-step">4 · Checkout</div>
  <div class="funnel-step">5 · Confirm</div>
</v-clicks>
</div>

---
funnel: 1
---

# Discover - can it find the product?

<div class="needs-vs">

<div>

**The agent needs**

<v-clicks>

- a real heading hierarchy — `h1`, not `div.h2-style`
- landmarks: `header`, `nav`, `main`
- server-rendered content — not "after you click around"
- a page title that says what this is

</v-clicks>

</div>

<div v-click>

<StatCard value="66%" label="machine-readable share of the average US product page — a third of your money page is invisible" source="Adobe" date="2026" href="https://mohammedshehu.com/agentic-commerce-statistics/" />

</div>

</div>

---
funnel: 1
---

# From div soup to structure

````md magic-move
```html
<div class="page">
  <div class="top">Veldloper</div>
  <div class="links">Trail · Road · Sale</div>
  <div class="content">
    <div class="h2-style">TrailRunner 3000</div>
    <div class="txt">Lightweight trail shoe, grippy sole.</div>
    <div class="txt">€189 · Size 43 · In stock</div>
  </div>
</div>
```

```html
<header>Veldloper</header>
<nav aria-label="Shop">Trail · Road · Sale</nav>
<main>
  <h1>TrailRunner 3000</h1>
  <section aria-labelledby="details">
    <h2 id="details">Details</h2>
    <p>Lightweight trail shoe, grippy sole.</p>
    <p>€189 · Size 43 · In stock</p>
  </section>
</main>
```
````

<div class="badge-row">
  <WcagBadge v-click sc="1.3.1" name="Info and Relationships" />
  <WcagBadge v-click sc="2.4.6" name="Headings and Labels" />
</div>

---
funnel: 2
---

# Compare - can it rank you?

<div class="needs-vs">

<div>

**The agent needs**

<v-clicks>

- accessible names that carry meaning
- alt text on product images
- real `<table>`s with header cells
- link text with purpose — "click here"

</v-clicks>

</div>

<div class="stat-stack">

<StatCard v-click value="46.3%" label="of the top-1M home pages have empty links" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

<StatCard v-click value="53.1%" label="have images with missing alt text" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

</div>

</div>

---
funnel: 2
---

# Live: the comparison table

<AgentView snippet="compare-table" variant="broken" height="300px" />

<div class="badge-row">
  <WcagBadge v-click sc="2.4.4" name="Link Purpose (In Context)" />
  <WcagBadge v-click sc="1.1.1" name="Non-text Content" />
</div>

---
funnel: 3
---

# Decide - can it add to cart?

<div class="needs-vs">

<div>

**The classic anti-pattern**

```html
<div class="btn" onclick="addToCart()">
  <svg><!-- cart icon --></svg>
</div>
```

<v-clicks>

- role: `generic` · name: `""`
- unreachable by keyboard
- bonus (web.dev): keep `cursor: pointer`, stable layouts, big targets

</v-clicks>

</div>

<div v-click>

<StatCard value="30.6%" label="of the top-1M home pages have empty buttons" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

</div>

</div>

---
funnel: 3
---

# Live: the button that isn't

<AgentView snippet="add-to-cart" variant="broken" height="250px" />

<div class="decide-bottom">

<div v-click class="research-note">
  <strong>CHI 2026 (UC Berkeley + U. Michigan):</strong> a state-of-the-art computer-use agent completed <strong>78.3%</strong> of tasks — but only <strong>41.7%</strong> when restricted to keyboard-only navigation.
  <span class="src-note">A11y-CUA · <a href="https://arxiv.org/abs/2602.09310" target="_blank" rel="noopener noreferrer">arxiv 2602.09310</a></span>
</div>

<div class="badge-row">
  <WcagBadge v-click sc="4.1.2" name="Name, Role, Value" />
  <WcagBadge v-click sc="2.1.1" name="Keyboard" />
</div>

</div>

---
funnel: 4
---

# Checkout - can it pay you?

<div class="needs-vs">

<div>

**The agent needs**

<v-clicks>

- programmatic labels — `<label for>`, not placeholder
- `autocomplete` attributes — machine-readable field purpose
- errors tied to fields — `aria-describedby`, not a floating red div

</v-clicks>

</div>

<div v-click>

<StatCard value="51%" label="of the top-1M home pages have inputs with missing form labels" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

</div>

</div>

---
funnel: 4
layout: default
class: centerpiece
---

<AgentSim task="checkout" snippet="checkout-form" variant="broken" height="330px" />

<div class="badge-row badge-row-tight">
  <WcagBadge v-click sc="3.3.2" name="Labels or Instructions" />
  <WcagBadge v-click sc="1.3.5" name="Identify Input Purpose" />
  <WcagBadge v-click sc="3.3.1" name="Error Identification" />
</div>

---
funnel: 5
---

# Confirm - does it know it worked?

<div class="confirm-story">

<v-clicks>

<div class="confirm-step">✅ Payment succeeds. A green toast fades in… <strong>as pixels only.</strong></div>

<div class="confirm-step">🤖 The agent sees nothing change in the tree. Did it work?</div>

<div class="confirm-step fix">The fix is one attribute: <code>role="status"</code> — a polite live region.</div>

</v-clicks>

</div>

<div class="badge-row">
  <WcagBadge v-click sc="4.1.3" name="Status Messages" />
</div>

---
funnel: 5
---

# Live: the silent toast

<LiveRegionDemo />

<!-- TODO(Tim): record a real agent run (Claude in Chrome GIF recorder or Playwright MCP trace) and overlay via <SlidevVideo controls printPoster="/agent-run-poster.png"> with poster frame -->
