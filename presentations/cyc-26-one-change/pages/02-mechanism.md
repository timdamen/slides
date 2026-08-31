---
layout: center
---

<div class="one-line">
  <p class="one-line-kicker">The contract between us and three hundred apps</p>

```json
"update:platform": "npx @platform/updater@latest"
```

  <p class="one-line-sub">Every new scaffolded app is born with it.</p>
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

# How the updater knows what to run

<div class="roll">

<ol class="roll-steps">
  <li v-click="1"><span class="roll-k">detect</span><span class="roll-v">The app's package.json says which version of our packages it is on.</span></li>
  <li v-click="2"><span class="roll-k">list</span><span class="roll-v">The registry says which versions we released after that one.</span></li>
  <li v-click="3"><span class="roll-k">gather</span><span class="roll-v">Every release ships its codemods inside the package. Fetching the versions fetches the work.</span></li>
  <li v-click="4"><span class="roll-k">apply</span><span class="roll-v">Oldest first, one version at a time.</span></li>
</ol>

<!-- TODO(Tim): the versions and counts here are an illustration, not a real run.
     Swap in numbers off an actual update if you would rather quote one. -->
<div class="roll-chain">
  <div class="roll-row roll-row--here"><span class="roll-ver">2.1.2</span><span class="roll-note">where the app is</span></div>
  <div class="roll-after">
    <div class="roll-row"><span class="roll-ver">2.2.1</span><span class="roll-note">3 codemods</span></div>
    <div class="roll-row"><span class="roll-ver">2.3.4</span><span class="roll-note">8 codemod</span></div>
    <div class="roll-row"><span class="roll-ver">3.0.0</span><span class="roll-note">7 codemods</span></div>
  </div>
  <p v-click="4" class="roll-total">18 codemods, in that order</p>
</div>

</div>

<!--
⏱ 5:10 — Forty-five seconds. The whole mechanism, once, slowly.

So what does that script actually do when they run it?

[click] First it finds out where the app is. That is one line in their package.json — the version of ours they installed, whenever they last updated.

[click] Then it asks what we have released since. Nothing clever: the registry already knows.

[click] Then it collects the codemods. This is the part I would have got wrong if we had built it ourselves. Each release carries its own codemods inside the published package, so there is no separate place to look them up and nothing to keep in sync. Downloading the versions downloads the work.

[click] And it applies them oldest first, one version at a time. Never a jump straight to the newest, because every codemod was written against the version in front of it and nothing else.

An app nine months behind is not a special case. It is the same four steps with a longer list.
-->

---
hide: true
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
