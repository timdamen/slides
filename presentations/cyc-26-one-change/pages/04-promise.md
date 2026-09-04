---
layout: center
---

<p class="mega">A major version doesn't mean<br>our API changed.</p>

<p class="mega accent" v-click>It means our robot <span class="underline-accent">gave up.</span></p>

---

# The migration we refused to write

<UpdateRun mode="gate" />

---

# Codemods are forever

<div class="forever">
<v-clicks>

<div class="forever-row">
  <p class="forever-h">Never delete a gate.</p>
  <p>Someone four years behind has to walk every boundary in order. Upgrade paths only accrete.</p>
</div>

<div class="forever-row">
  <p class="forever-h">Never change a helper's output.</p>
  <p>A migration written in 2024 runs for the first time in 2027, against whatever version of the helper library happens to be installed then. Not the one it was written against.</p>
</div>

<div class="forever-row accent-row">
  <p class="forever-h">A codemod is a published API.</p>
  <p>Fixing one is itself a breaking change.</p>
</div>

</v-clicks>
</div>

---
layout: center
---

<p class="mega">We don't test the codemod.</p>
<p class="mega accent" v-click>We test the <span class="underline-accent">upgrade.</span></p>

<p class="rehearsal" v-click>Publish everything to a throwaway registry. Scaffold all three product types with every option turned on. Then clone three real applications at clean main and run the actual upgrade command on them.</p>

<p class="src-note" v-click>Six scenarios. Every release.</p>
