# What agents and people need!

<table class="reveal-table">
<thead>
<tr><th>What the user needs</th><th>The spec</th></tr>
</thead>
<tbody>
<v-clicks>
<tr>
  <td>find the product</td>
  <td><WcagBadge sc="1.3.1" name="Info and Relationships" /> <WcagBadge sc="2.4.6" name="Headings and Labels" /></td>
</tr>
<tr>
  <td>extract meaning</td>
  <td><WcagBadge sc="2.4.4" name="Link Purpose" /> <WcagBadge sc="1.1.1" name="Non-text Content" /></td>
</tr>
<tr>
  <td>press the button</td>
  <td><WcagBadge sc="4.1.2" name="Name, Role, Value" /> <WcagBadge sc="2.1.1" name="Keyboard" /></td>
</tr>
<tr>
  <td>fill the form</td>
  <td><WcagBadge sc="3.3.2" name="Labels or Instructions" /> <WcagBadge sc="1.3.5" name="Identify Input Purpose" /> <WcagBadge sc="3.3.1" name="Error Identification" /></td>
</tr>
<tr>
  <td>verify the outcome</td>
  <td><WcagBadge sc="4.1.3" name="Status Messages" /></td>
</tr>
</v-clicks>
</tbody>
</table>

<!--
⏱ 32:00 — Section E: the twist.

Here are the stamps we collected, lined up against what the agent needed at each funnel stage.

[click] Finding the product: structure and headings. [click] Extracting meaning: link purpose, alt text. [click] Pressing the button: name, role, value — plus keyboard. [click] Filling the form: labels, input purpose, error identification. [click] Verifying the outcome: status messages.

Ten success criteria. Every single agent failure we watched tonight had a WCAG number on it, and none of those numbers were invented for AI. The oldest is from 2008, the newest 2018.

[click] You already have the spec. Nobody needs to write "the agent-readiness standard" — it exists, it has a test suite, it has twenty years of documentation, and your accessibility people have been quietly begging you to follow it. The market just renamed "compliance" to "revenue".
-->

---

# Warning

<div class="stat-grid">
<v-clicks>

<StatCard value="95.9%" label="of top-1M home pages have detectable WCAG 2 failures (was 94.8%)" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

<StatCard value="56.1" label="errors per page, +10.1% — the first regression after years of slow improvement" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

<StatCard value="+27%" label="ARIA usage — yet pages with ARIA average 59.1 errors vs 42 without" source="WebAIM Million" date="Feb 2026" href="https://webaim.org/projects/million/" />

</v-clicks>
</div>

<p v-click class="punch danger">AI is breaking the web AI needs.</p>

<!--
So the web is getting ready for its new customer, right? It is not. It's moving backwards, at the worst possible moment.

[click] 95.9% of the top million home pages have detectable WCAG failures. Up from 94.8.

[click] 56 errors per page, up ten percent — the first regression in the history of the WebAIM survey after years of slow, hard-won improvement.

[click] And the bitter one: ARIA usage up 27%, but pages *with* ARIA average significantly *more* errors than pages without. ARIA sprinkled on by tooling and copy-paste is making trees worse, not better. WebAIM points at framework complexity and AI-assisted "vibe coding" as drivers.

[click] Sit with the irony: AI-generated code is degrading the exact interface AI agents depend on. The tool writing your markup can't see pixels either — and it's still shipping div soup. Dramatic irony as a market condition.
-->

---

# Honest note

<v-clicks>

- 🧪 **Agents are hybrid.** Vision + DOM + AX tree. The tree is the *fastest, cheapest, most reliable* path — not the only one.
- 🚧 **WCAG-compliant ≠ agent-reachable.** Bot walls and CAPTCHAs block agents — and have always been an accessibility nightmare. (W3C is openly discussing agents as user agents — <a href="https://github.com/w3c/wcag3/issues/636" target="_blank" rel="noopener noreferrer">wcag3#636</a>.)
- 📦 **Agents want more than WCAG.** Structured data, stable layouts, and now site-declared tools — WebMCP (Chrome origin trial, near-zero deployment).

</v-clicks>

<p v-click class="punch">Accessibility is necessary, not sufficient.</p>

<!--
⏱ 34:30 — The credibility slide. Some of you are accessibility experts, so before anyone quotes me beyond the data, three honest caveats.

[click] One: agents are hybrid. If the tree is empty they fall back to vision — slower, costlier, flakier. Accessibility doesn't gatekeep agents; it decides whether you're served from the fast path or the desperate one.

[click] Two: a perfectly WCAG-compliant site can still be unreachable — bot walls and CAPTCHAs stop agents cold. Those have been torturing disabled users for two decades, and there's an open WCAG 3.0 discussion — issue 636 — about treating autonomous agents as user agents. The definition of "user" is being renegotiated at the W3C right now.

[click] Three: agents also want things WCAG never covered — structured data, stable layouts, and site-declared tools like WebMCP. That is real. It is also additive and opt-in per site, and the explainer says it is not accessibility technology, so it does not replace any of this.

[click] So the honest claim, precisely: necessary, not sufficient — but it's the foundation everything else assumes. Build the floor first.
-->
