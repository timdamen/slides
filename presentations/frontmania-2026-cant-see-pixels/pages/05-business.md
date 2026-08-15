# The slide for your exec

<div class="exec-grid">

<StatCard value="+393%" label="AI-referred traffic to US retail, YoY" source="Adobe Analytics" date="Q1 2026" />

<StatCard value="+42%" label="conversion rate vs non-AI traffic" source="Adobe Analytics" date="Mar 2026" />

<StatCard value="~20%" label="of global holiday orders touched by AI" source="Salesforce" date="2025" />

<StatCard value="50M/day" label="shopping queries in ChatGPT" source="OpenAI" date="Feb 2026" />

<StatCard value="$3–5T" label="projected agentic commerce by 2030" source="McKinsey" date="2026" />

</div>

<p class="punch exec-punch">Accessibility is now conversion infrastructure.</p>

<!--
⏱ 36:00 — Section F: the business case. This slide is deliberately screenshot-able: five numbers, five sources, five dates, one sentence. Screenshot it. Send it to whoever owns your roadmap.

For twenty years the accessibility business case was ethics, lawsuits, and "it's about 15 percent of users" — and roadmaps kept not caring. Fine. Here's the version roadmaps understand: traffic almost times-five, converting 42 percent better, a fifth of holiday orders touched by AI, fifty million shopping queries a day, and McKinsey putting three to five trillion on it by 2030.

Every one of those customers reads your site through the accessibility tree first. One sentence for the exec: accessibility is now conversion infrastructure. Not compliance. Not charity. The plumbing your next revenue segment flows through.
-->

---

# What to do Monday

<v-clicks>

1. **Semantic HTML before ARIA** — a `<button>` is worth a thousand `role`s
2. **Label every input programmatically** — and add `autocomplete`
3. **Keyboard-test your money flows** — tab through your own checkout
4. **Open the DevTools accessibility pane on your checkout** — that's your agent's UI
5. **Wire axe-core (or similar) into CI** — regressions caught before they ship
6. **Watch AI/agent referrals in your analytics** — they're customers now

</v-clicks>

<!--
⏱ 37:30 — The Monday-morning list. Six items, none needing a budget meeting.

[click] Semantic HTML first. Half the ARIA on the web is making things worse — we just saw the data. The elements come with the behavior built in.

[click] Real labels, plus autocomplete. Ten minutes per form; you watched what it buys you.

[click] Keyboard-test the flows that make money. Tab through your own checkout once — you'll find something today, I promise.

[click] Open that accessibility pane on your checkout. What you see there is your agent's entire UI. If it's a wall of generics, so is your revenue.

[click] Put axe-core in CI. Free, automated, catches the classics — the 30% empty-buttons kind of bug — before it ships.

[click] And start tagging AI referrals in analytics. You cannot make the case for this customer segment if you can't see it. It's growing either way — the only question is whether it's in your dashboard.
-->

---

# The stakes, in court

<div class="court-card">

**Amazon v. Perplexity** — March 2026, N.D. Cal.

A US judge issued a **preliminary injunction** blocking Perplexity's *Comet* browser from shopping on Amazon.

<p v-click class="punch">Companies are litigating over who gets to <em>be</em> the customer.</p>

</div>

<p class="src-note">Preliminary injunction, N.D. Cal. · Mar 2026 — cuttable slide if running long</p>

<!--
⏱ 39:00 — (Cuttable if over time — check the clock. If behind, skip straight to the ending.)

One more signal, this time from a courtroom. March 2026: a federal judge granted Amazon a preliminary injunction blocking Perplexity's Comet browser from shopping on Amazon on users' behalf.

Set the legal merits aside — the interesting fact is that the case *exists*.

[click] Companies are now litigating over who gets to *be* the customer at the checkout. You don't sue over traffic that doesn't matter. Agentic commerce is valuable enough to fight over in federal court — while most checkouts still can't tell an agent what the pay button is called.
-->
