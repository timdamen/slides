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

---
hide: true
---

# A round is four commands

<UpdateRun mode="run" />
