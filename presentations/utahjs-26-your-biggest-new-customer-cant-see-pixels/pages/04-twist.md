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

---

# Honest note

<v-clicks>

- 🧪 **Agents are hybrid.** Vision + DOM + AX tree. The tree is the *fastest, cheapest, most reliable* path — not the only one.
- 🚧 **WCAG-compliant ≠ agent-reachable.** Bot walls and CAPTCHAs block agents — and have always been an accessibility nightmare. (W3C is openly discussing agents as user agents — <a href="https://github.com/w3c/wcag3/issues/636" target="_blank" rel="noopener noreferrer">wcag3#636</a>.)
- 📦 **Agents want more than WCAG.** Structured data, stable layouts, and now site-declared tools — WebMCP (Chrome origin trial, near-zero deployment).

</v-clicks>

<p v-click class="punch">Accessibility is necessary, not sufficient.</p>
