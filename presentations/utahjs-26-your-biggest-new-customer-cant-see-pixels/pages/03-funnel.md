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

<!--
⏱ 13:00 — Section C: the funnel.

Classic e-commerce funnel, the one from every marketing deck since 2005. We're going to walk Alex's agent through all five stages, on Veldloper, our fictional trail-running shop.

[click] Discover: can it even find the product? [click] Compare: can it extract facts and rank you against competitors? [click] Decide: can it press the button? [click] Checkout: can it pay you? [click] Confirm: does it know it worked?

At every stage: what the agent needs, realistic broken markup, a live fix, and — watch for it — a WCAG stamp on every fix.

[click] Five moments where the agent picks you or your competitor. That tracker in the corner stays with us so you always know where the money is.
-->

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

<StatCard value="66%" label="machine-readable share of the average US product page" source="Adobe" date="2026" href="https://mohammedshehu.com/agentic-commerce-statistics/" />

</div>

</div>

<!--
⏱ 14:00 — Stage 1: Discover.

The agent lands on your product page and asks one question: what is this page about?

[click] It skims structure first — headings are its table of contents. A div with class "h2-style" is not a heading, it's interior decoration.

[click] Landmarks tell it where the content lives and what's chrome.

[click] If the product only exists after client-side interaction, for a lot of agent traffic it doesn't exist at all.

[click] And the page title is the first thing everything that can't see pixels reads. "Home | Shop" tells it nothing.

[click] Adobe measured this: the average US product page is 66% machine-readable. A third of the page where you make money is invisible to this customer. You wouldn't ship a page where a third of the pixels are broken.
-->

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

<!--
Left: real code. Nobody writes this on purpose — it accumulates. To an agent this page is one anonymous blob: role generic, all the way down.

[click: magic-move] Same pixels, but now: a banner, a nav with a name, a main, a real h1. The agent's first query — "give me the h1" — now returns "TrailRunner 3000" instead of nothing. Discovery went from scraping to a lookup.

[click] And here's the pattern for the rest of the talk: every fix gets a stamp. Info and Relationships — structure must be programmatic, not visual.

[click] Headings and Labels — they must describe the thing. Both criteria are old enough to drink. Remember the stamps; they're building toward something.
-->

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

<!--
⏱ 17:30 — Stage 2: Compare.

Alex's agent has five shops open. It's building a comparison: price, weight, availability. Whoever's data extracts cleanly gets ranked; whoever's doesn't gets skipped.

[click] Names that mean something out of context — the agent reads your link text the way a screen-reader user tabs through a page: without the surrounding paragraph.

[click] Alt text is product data now. No alt, no product in the comparison.

[click] A real table gives it header-to-cell relationships for free. A div grid that *looks* like a table is a word cloud.

[click] "Click here" — a 404 for meaning. Click where? To what? For which shoe?

[click] WebAIM scans the top million home pages every year: 46.3% have links with no text at all. [click] More than half are missing alt text. This is the field you're competing on. The bar is on the floor.
-->

---
funnel: 2
---

# Live: the comparison table

<AgentView snippet="compare-table" variant="broken" height="300px" />

<div class="badge-row">
  <WcagBadge v-click sc="2.4.4" name="Link Purpose (In Context)" />
  <WcagBadge v-click sc="1.1.1" name="Non-text Content" />
</div>

<!--
The broken version — and look at the tree: images with no alt announcing nothing, and two links both named "Click here". Which one is the TrailRunner? The tree genuinely cannot say. If your product data lives in pixels and your links are all called the same thing, you are not in the comparison. You're not ranked low — you're absent.

[demo] Switch to Fixed. Now the tree has a table with a caption, column headers, row headers naming actual shoes, and a link that says what it does: "View TrailRunner 3000 — €189". Every cell means something without seeing the grid.

[click] Link Purpose: the name must say where it goes.

[click] Non-text Content: images carry their information as text. 1.1.1 — the very first rule in WCAG. First for a reason.
-->

---
funnel: 3
---

# Decide - can it add to cart?

<div class="needs-vs">

<div>

**The classic crime**

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

<!--
⏱ 21:00 — Stage 3: Decide.

The agent picked you. It wants to give you money. Between it and your revenue stands one element — and this is what we shipped.

A div with a click handler and an icon. Looks perfect. Hover animation is lovely.

[click] In the tree: role generic, name empty. The agent's query — "button, named something like add-to-cart" — returns nothing. There is no button on this page.

[click] And it's unreachable by keyboard — hold that thought for the research in a minute.

[click] web.dev's agent guidance adds the non-WCAG extras: keep cursor:pointer on interactive things, stable layouts, adequately sized targets. Agents get fooled by the same tricks users do.

[click] Empty buttons: 30.6% of the top million home pages. A third of the web has buttons that, to this customer, do not exist.
-->

---
funnel: 3
---

# Live: the button that isn't

<AgentView snippet="add-to-cart" variant="broken" height="250px" />

<div class="decide-bottom">

<div v-click class="research-note">
  <strong>CHI 2026 (UC Berkeley + U. Michigan):</strong> a state-of-the-art computer-use agent completed <strong>78.3%</strong> of tasks — but only <strong>41.7%</strong> when restricted to keyboard-only navigation. Agents inherit the keyboard fragility we've been warning about.
  <span class="src-note">A11y-CUA · <a href="https://arxiv.org/abs/2602.09310" target="_blank" rel="noopener noreferrer">arxiv 2602.09310</a></span>
</div>

<div class="badge-row">
  <WcagBadge v-click sc="4.1.2" name="Name, Role, Value" />
  <WcagBadge v-click sc="2.1.1" name="Keyboard" />
</div>

</div>

<!--
Broken: the tree shows one generic with a warning — clickable, no role, no name, no keyboard access. That's the whole product page from the agent's perspective: nothing to press.

[demo] Switch to Fixed: one line of thinking — use a button element — and the tree says: button, "Add to cart — €189". Then the part people forget: click into the preview, Tab to it, press Enter. It focuses. It activates. For free. A div needs four attributes and two event handlers to fake this badly.

[click] Why keyboard matters for *agents*: real research, framed precisely because this study is already being misquoted. A state-of-the-art computer-use agent completed 78.3% of everyday tasks — but restricted to keyboard-only navigation, 41.7%. The study measured the agent under assistive-tech-like conditions. Agents share the keyboard fragility of assistive-tech users. Same cliff.

[click] Name, Role, Value — the one criterion that summarizes this entire talk.

[click] And Keyboard — 2.1.1, in the spec since 2008.
-->

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

<!--
⏱ 24:30 — Stage 4: Checkout. The stage where broken markup stops being a philosophy debate and starts being a refund.

[click] A placeholder is not a label. It's a grey hint that evaporates on focus. In the tree, that field has no name — it's an anonymous slot the agent would have to *guess*.

[click] autocomplete="email", "cc-number", "postal-code": literally machine-readable field purpose, a controlled vocabulary, in the HTML spec, for exactly this. Agents didn't need a new standard — we had one.

[click] And when validation fails, an error floating somewhere in red is invisible: nothing connects it to the field it's about.

[click] 51% of home pages have unlabeled inputs. Half the web's forms are guessing games. The agent isn't guessing which field is "postcode". It's leaving.
-->

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

<!--
⏱ 26:00 — THE demo. Minimal talking while it types; let the room read.

[demo] Broken form, press Run. The agent narrates its own funeral: looks for a textbox named "email" — there isn't one, there's an anonymous input with a placeholder. It refuses to guess — "guessing fields is how I order 12 pairs of shoes". Then it looks for a pay button, finds a div cosplaying as one, and aborts. Veldloper lost €189 in four seconds, and this form passes every visual QA check we have.

[demo] Now: Fixed form, Run. Every field found by label. Card number respects the hint — sixteen digits, no spaces, because the hint is *connected* via aria-describedby. Pay button: a real button. And the order confirmation comes back through a status message. Done. Zero guesses.

(pause for the room)

[click] Labels or Instructions. [click] Identify Input Purpose — the autocomplete criterion, in WCAG since 2018. [click] Error Identification. The difference between those two runs was maybe ten lines of HTML. That's the cheapest conversion optimization you will ever ship.
-->

---
funnel: 5
---

# Confirm — does it know it worked?

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

<!--
⏱ 28:30 — Stage 5: Confirm. The stage everyone forgets, with my favorite failure mode.

[click] The purchase worked! Your backend is happy. The toast fades in, in pixels.

[click] But nothing changed in the accessibility tree. From where the agent sits, the click went into the void. Did the order happen?

[click] Now both options are bad: retry — congratulations, Alex owns two pairs; or report failure — Alex opens a support ticket for an order that succeeded. Either way you paid for the sale and bought a problem. Screen-reader users have lived this exact moment for years.

[click] The fix is embarrassingly small: role="status". Content changes get announced — to screen readers, and to anything else listening to the tree.

[click] Status Messages, 4.1.3 — the newest stamp we'll collect, WCAG 2.1, 2018.
-->

---
funnel: 5
---

# Live: the silent toast

<LiveRegionDemo />

<!-- TODO(Tim): record a real agent run (Claude in Chrome GIF recorder or Playwright MCP trace) and overlay via <SlidevVideo controls printPoster="/agent-run-poster.png"> with poster frame -->

<!--
Left pane is the shop; right pane shows only what reaches the accessibility tree — a mutation only appears there if it happens inside a live region. That's the same rule screen readers apply.

[demo] Visual-only toast: click "Place order" in the frame. Toast appears — humans cheer. Right pane: silence. That confirmation number exists only in pixels.

[demo] Switch to role="status", click again. Right pane: status: "Order placed — confirmation #1234". Same pixels for the human, but now the outcome is *verifiable*. The agent can end its loop, tell Alex it's done, and go bother a different website.

That's the funnel — all five stages. Now watch what the stamps we collected add up to.
-->
