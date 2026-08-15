---
layout: center
---

<div class="one-line">
  <p class="one-line-kicker">The entire contract between us and three hundred teams</p>

```json
"update:platform": "npx --yes @platform/updater@latest"
```

  <p class="one-line-sub">Every application is born with it. Everything else in this talk hangs off that string.</p>
</div>

<!--
⏱ 4:30 — Act 2. The mechanism. This is the part of the talk the title undersells.

Remember I said one item on that list turned out to be a lie? It's "standards, written down".

Not because writing things down is bad. Because a standard on a wiki page is a description of what you hope people will do, and it decays the moment someone doesn't. I have written those pages. I have watched them get skimmed once and then quietly disagreed with for two years.

The only standard that actually exists is the one that executes. So here's ours.

One npm script. It's in the scaffold, so every app has had it since the day it was generated.

A developer runs it about once a sprint. That's the whole interface. No dashboard, no platform portal, nothing to log into. If your platform's front door is a web app, teams have to remember you exist. If it's a script in their package.json, they don't.

Notice the `@latest`. We are not asking them to keep the updater up to date. That would be one more thing to drift.
-->

---

# A round is four commands

<UpdateRun mode="run" />

<!--
⏱ 5:10 — Demo. Start it, then talk over it. Ninety seconds.

When they run that script, this happens.

First it works out what kind of product this repo is, because the answer changes which package it follows.

Then it plans. This app is a major version behind, so that's one round. Two majors behind would be two rounds, in order, never a jump.

And a round is four commands. [step] Fetch the framework's updates. [step] Apply the framework's codemods. [step] Fetch ours. [step] Apply ours.

That's it. That's the mechanism. Two of those four commands aren't even ours, they're stock tooling, and I want to be honest about how much of this is just knowing which four things to run in which order.

(If you're wondering how one command updates eleven of our packages: there's a field in our package.json that lists the siblings, and the build tool already understood it. We wrote no code for that. A lot of platform leverage is finding out which boring field already does the thing.)

[let the ledger fill]

And this is what came out. Fifty-four codemods, from eight different packages, in one commit. That app had gone about nine months without an update. Nine months, a thousand and forty commits, fourteen people. Then one afternoon.
-->
