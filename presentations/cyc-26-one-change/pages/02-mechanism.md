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
⏱ 5:00 — Act 2. The mechanism. This is the part of the talk the title undersells.

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
⏱ 5:40 — Demo. Start it, then talk over it. Ninety seconds.

When they run that script, this happens.

First it works out what kind of product this repo is, because the answer changes which package it follows.

Then it plans. This app is a major version behind, so that's one round. Two majors behind would be two rounds, in order, never a jump.

And a round is four commands. [step] Fetch the framework's updates. [step] Apply the framework's codemods. [step] Fetch ours. [step] Apply ours.

That's it. That's the mechanism. Two of those four commands aren't even ours, they're stock tooling, and I want to be honest about how much of this is just knowing which four things to run in which order.

(If you're wondering how one command updates eleven of our packages: there's a field in our package.json that lists the siblings, and the build tool already understood it. We wrote no code for that. A lot of platform leverage is finding out which boring field already does the thing.)

[let the ledger fill]

And this is what came out. Fifty-four codemods, from eight different packages, in one commit. That app had gone about nine months without an update. Nine months, a thousand and forty commits, fourteen people. Then one afternoon.
-->

---

# A hundred and fifty-three of them

<div class="census">

<div class="census-row">
  <span class="census-n accent">153</span>
  <span class="census-l">codemods shipped</span>
</div>

<div class="census-row">
  <span class="census-n accent">157</span>
  <span class="census-l">tests for them</span>
</div>

<div class="census-row dim">
  <span class="census-n">9,001</span>
  <span class="census-l">lines of migration code</span>
</div>

<div class="census-row dim">
  <span class="census-n">11,820</span>
  <span class="census-l">lines of test</span>
</div>

</div>

<p v-click class="punch">More test than implementation. That ratio is the only reason anyone lets us do this.</p>

<!--
⏱ 7:10

A hundred and fifty-three codemods over about two and a half years. A hundred and fifty-seven test files.

[click] There is more test code than migration code. One point three lines of test for every line that ships.

I want to be blunt about why. It is not craftsmanship. It's that a codemod runs unattended, in a repository I will never open, against a version of a file I have never seen, possibly two years after I wrote it. There's no review step where a human catches it. The test suite is the review step, and it runs before the code exists in anyone's repo.

Every migration gets three cases minimum: it works, it's already been applied and does nothing, and the thing it's looking for isn't there and it doesn't explode.
-->

---
layout: center
---

<div class="ownership">
  <div class="own-half">
    <p class="own-n">6</p>
    <p class="own-l">files in that app carry a header saying<br><strong>the platform owns this, don't edit it</strong></p>
  </div>
  <div class="own-vs" aria-hidden="true">↓</div>
  <div class="own-half danger">
    <p class="own-n">58</p>
    <p class="own-l">files the platform updates<br><strong>have actually edited</strong></p>
  </div>
</div>

<!--
⏱ 7:45 — Slow down here. This is the honest slide and it sets up the whole last third.

Six files in that repository say we own them. Generated, do not edit, we'll clobber it.

Across the three updates in that app's history, we touched fifty-eight.

The gap between those two numbers is where all of my anxiety lives. Because the other fifty-two are files the app team owns. Files they wrote, files they've customised, files with their comments in. Their router config. Their entry point. Their internationalisation setup.

The boundary between what I own and what they own does not run around their source directory. It runs straight through the middle of individual files.

Hold that thought for eight minutes.
-->
