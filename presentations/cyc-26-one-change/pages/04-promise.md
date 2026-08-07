---
layout: center
---

<p class="mega">A major version doesn't mean<br>our API changed.</p>

<p class="mega accent" v-click>It means our robot <span class="underline-accent">gave up.</span></p>

<!--
⏱ 10:35 — Act 4. Keeping the promise. This act is short and it is the one that gets squeezed on stage. Don't let it.

Semver, in our system, does not mean what it means in yours.

[click] A change is breaking, and triggers a major, when our migrations cannot complete it for you. That's the definition. It's written down.

Sit with that, because it inverts the usual relationship. Normally your versioning describes your API and your users absorb the cost. Here, our versioning describes our own automation, and the number goes up precisely when we've failed to spare somebody work.

An upstream major in the build tool or the framework is not automatically a major for us. If we can migrate it for you, you get it in a minor and you find out from the changelog. It only becomes a major when we look at the change and admit we can't do it on your behalf.

Which brings me to my favourite thing we ever shipped.
-->

---

# The migration we refused to write

<UpdateRun mode="gate" />

<!--
⏱ 11:25 — Demo, sixty seconds. Toggle the blocker off at the end to show the other outcome.

A deprecated end-to-end testing framework had to go before anyone could cross into version two.

We could have automated it. We know how to remove a package, we know how to scaffold the replacement, we've done harder things. Instead we wrote a gate: eighteen lines that look at your repo, find the old tool, and stop.

It will not remove it. It will not scaffold the replacement. It will not even prompt you.

Watch what the run does. [start] It crosses everything it can, keeps all of it, stops at the boundary, tells you exactly what's in the way, and exits zero.

Exit zero. A partial upgrade is a success in our tool. Five named outcomes, and stopping halfway with a list of blockers is a first-class one, not an error.

The reason is in our own docs, and I'd read it out because it's the most grown-up sentence in the repository: requiring a conscious action keeps teams aware that they need to act, and stops the change from getting lost in an automated run.

Some changes should cost a human thirty minutes of attention. If you automate those away, nobody learns that their test strategy changed. They just wake up one morning in a different framework.
-->

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

<!--
⏱ 12:25

Two invariants, and I've never seen either of them written down anywhere outside our repo, so I'll give them to you.

[click] Never delete a gate. Even after every app has passed it. Because somewhere there's a repository that hasn't been touched since 2023, and when it finally runs the updater it has to traverse every boundary between then and now, in order. We have gates for problems nobody has anymore. They stay.

[click] Never change what a helper outputs. This one took us a while to understand. A migration is not code that runs when you write it. It's code that sits dormant in a published package and executes at an unknown future date, against whatever version of your shared utilities is installed at that moment.

[click] So a codemod is a published API with a permanent contract, and a bug fix that changes its output is itself a breaking change. Our shared helper library is append-only. Forever. We add a seventh function rather than improve the third one.

Two hundred and three lines, seven functions, frozen. That's the whole thing.
-->

---
layout: center
---

<p class="mega">We don't test the codemod.</p>
<p class="mega accent" v-click>We test the <span class="underline-accent">upgrade.</span></p>

<p class="rehearsal" v-click>Publish everything to a throwaway registry. Scaffold all three product types with every option turned on. Then clone three real applications at clean main and run the actual upgrade command on them.</p>

<p class="src-note" v-click>Six scenarios. Every release.</p>

<!--
⏱ 13:10

Last one in this act, and it's the answer to the most obvious hostile question in this room, which is: how do you know you didn't just break three hundred applications?

[click] We don't test the codemod. Unit tests tell you a function did what you meant. They cannot tell you that fifty-four migrations, from eight packages, applied in sequence, to a real repository with two years of other people's decisions in it, produce something that still builds.

[click] So before every release we do a dress rehearsal. Spin up a throwaway package registry. Publish the whole suite to it under the latest tag. Scaffold all three product types with the maximal option set. Then clone three real applications at clean main and run the actual upgrade command, the same one a team would run.

[click] Six scenarios, and each one is followed by a real build, a real test run and a real accessibility check.

It is slow and it is expensive and it has caught things no unit test would ever have caught, because the failures that matter at this scale are interactions, not functions.

Okay. That's the mechanism, and that's how we keep it alive. Everything I've shown you so far edits dependency lists, JSON files and configuration.

None of it needed a parser.
-->
