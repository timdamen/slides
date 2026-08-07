# Sources — "Your Biggest New Customer Can't See Pixels"

Verified 2026-07-07. **Re-verify the Adobe/Salesforce/OpenAI figures ~2 weeks
before the conference — this space moves monthly.** These are the ONLY
approved numbers for the deck; nothing on a slide may cite anything else.

## Market / traffic

1. **Adobe Analytics (via press coverage)** — AI-referred traffic to US retail
   **+393% YoY in Q1 2026**; **+693% YoY** during holiday season Nov–Dec 2025;
   by **March 2026 AI-referred traffic converted 42% better** than non-AI
   traffic (a reversal from March 2025, when it converted 38% *worse*);
   revenue per visit **+37%**.
   - https://elogic.co/blog/chatgpt-commerce-statistics/
   - https://www.paz.ai/agentic-commerce-statistics
   - https://finance.yahoo.com/sectors/technology/articles/ai-traffic-us-retailers-jumps-160141756.html
2. **Adobe** — the average US product page scores **66% machine-readable**;
   roughly a third of decision-page content can't be parsed by agents.
   - https://mohammedshehu.com/agentic-commerce-statistics/
3. **Salesforce** — AI agents **touched ~20% of global online orders during
   holiday 2025** (~$262B; $67B AI-influenced during Cyber Week).
   *Phrasing rule: "touched/influenced", never "autonomously placed".*
   - elogic + paz.ai above.
4. **OpenAI** — ChatGPT handles **~50M shopping queries/day** (~2% of all
   queries); ~900M weekly active users (Feb 2026). — elogic above.
5. **Projections** — McKinsey **$3–5T** global agentic commerce by 2030;
   Bain **15–25% of US e-commerce** by 2030; Morgan Stanley base case
   **$190B US** by 2030. — https://www.paz.ai/agentic-commerce-statistics

## Accessibility state of the web

6. **WebAIM Million 2026** (scan Feb 2026) — **95.9%** of top-1M home pages
   with detectable WCAG 2 failures (2025: 94.8%) · **56.1 errors/page
   (+10.1%)** — first regression in years · avg **1,437 elements/page
   (+22.5%)** · **ARIA +27%**, pages with ARIA avg **59.1 errors vs 42**
   without · low contrast **83.9%** · missing alt **53.1%** · missing form
   labels **51.0%** · empty links **46.3%** · empty buttons **30.6%** ·
   WebAIM attributes worsening partly to framework complexity and
   AI-assisted "vibe coding".
   - https://webaim.org/projects/million/

## Research

7. **A11y-CUA study (CHI 2026, UC Berkeley + U. Michigan)** — 60 everyday
   tasks; a Claude Sonnet 4.5-based computer-use agent completed **78.3%**
   under default conditions, **41.67%** keyboard-only, **28.3%** with a
   magnifier.
   *Framing rule (§7 of the briefing): the study measured an agent under
   assistive-technology-like conditions. It is NOT "accessible sites = 78%,
   inaccessible = 42%". Approved on-slide framing: "A state-of-the-art
   computer-use agent completed 78% of tasks — but only 42% when restricted
   to keyboard-only navigation. Agents inherit the keyboard fragility we've
   been warning about."*
   - https://arxiv.org/abs/2602.09310
   - https://dl.acm.org/doi/10.1145/3772318.3791896

## How agents read pages / vendor receipts

8. Google web.dev, "Build agent-friendly websites" (three modalities;
   semantic HTML, programmatic labels, stable layout, `cursor: pointer`,
   target size) — https://web.dev/articles/ai-agent-site-ux
   · ChatGPT Atlas queries the AX tree; Playwright MCP ships accessibility
   snapshots instead of screenshots; OpenAI CUA is hybrid —
   https://nohacks.co/blog/how-ai-agents-see-your-website
   · AX-tree parsing reported ~93% more token-efficient than raw DOM —
   https://isagentready.com/en/blog/how-ai-agents-see-your-website-the-accessibility-tree-explained
   · Claude in Chrome's page-reading tool documented as returning an
   accessibility-tree representation (Anthropic docs — screenshot for slide 7).

## Legal & standards

9. **Amazon v. Perplexity** — preliminary injunction (March 2026, N.D. Cal.)
   blocking Perplexity's Comet from shopping on Amazon.
   - Yahoo Finance article above · https://www.paz.ai/agentic-commerce
10. **Protocol timeline (context, optional)** — ACP (OpenAI+Stripe, Sep 2025)
    · Google AP2 (Sep 2025) · Google UCP (NRF, Jan 2026) · Visa / Mastercard
    agent-payment programs. — elogic + paz.ai.
11. **W3C** — WCAG 3.0 GitHub issue #636: proposal to treat autonomous agents
    as user agents; a site can be fully WCAG-compliant yet blocked for agents.
    - https://github.com/w3c/wcag3/issues/636

## WCAG success criteria used in the deck

Verify wording against https://www.w3.org/WAI/WCAG22/quickref/ —
1.1.1 Non-text Content · 1.3.1 Info and Relationships · 1.3.5 Identify Input
Purpose · 2.1.1 Keyboard · 2.4.4 Link Purpose (In Context) · 2.4.6 Headings
and Labels · 3.3.1 Error Identification · 3.3.2 Labels or Instructions ·
4.1.2 Name, Role, Value · 4.1.3 Status Messages.

**Never cite 4.1.1 Parsing** — removed in WCAG 2.2; the audience will notice.
