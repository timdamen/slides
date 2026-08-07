# So how did the accessibility change land?

<div class="seam">

```json
// every app's tsconfig, written by us, years before we needed it
"paths": {
  "@playwright/test": ["./platform/test.ts"]
}
```

<p v-click class="punch">Every test file in every app <span class="accent">already imports that specifier.</span></p>

<p v-click class="punch-sm">Our wrapper re-exports it. Behind an environment variable, it also scans every page the test visits and fails on critical violations.</p>

<p v-click class="punch-sm accent">Nobody wrote an accessibility assertion. Nobody changed a test file.</p>

</div>

<!--
⏱ 8:35 — Act 3. The change lands.

Back to the email. Automated accessibility checks in every customer-facing frontend.

Here's how much source code we had to edit to do it. [gesture at the tsconfig]

Every app's tsconfig has this alias, and it's been there for years. When a developer writes `import { test } from '@playwright/test'`, they don't get Playwright's test function. They get ours. Ours calls Playwright's, and then does whatever else we need it to do.

[click] Every test file in the estate already imports that specifier. There is nothing to migrate, because the import statement was always pointing at us.

[click] So the accessibility scanner went in behind an environment variable. Flip it on, and every page any functional test visits gets scanned. Fails only on critical, because a platform team that turns everyone's build red on a Tuesday does not get a second change.

[click] Nobody wrote an assertion. Nobody opened a test file. The whole estate got scanned.

I'm not going to pretend we saw this coming in 2024. We didn't know about the accessibility mandate. We aliased that import because we wanted to control the test timeout. But you only get to be lucky like this if you own a seam in the first place, and owning seams is a thing you can decide to do on purpose.
-->

---
layout: center
---

<p class="mega">The cheapest codemod is<br>the one you <span class="accent">designed away.</span></p>

<div class="two-rule" v-click>
  <div><p class="rule-h">Config we own</p><p>ships as an imported preset. A version bump changes it. Zero codemod, zero diff in their repo.</p></div>
  <div><p class="rule-h">Code they own</p><p>can only be changed by a codemod. That is the only door, and it opens into someone else's house.</p></div>
</div>

<!--
⏱ 9:35

This is the rule I'd tattoo on a new platform engineer.

[click] Two ways to change three hundred applications. Config we own goes out as a preset they import. Their vite config is four lines and one of them is our preset. When we change it, they get the change by installing a version. There is no migration to write, no diff in their repository, nothing to review.

Code they own is the other door, and it is much more expensive, because it means reaching into a file with their name on the git blame.

So the architecture question, every single time, is: can I move this behind something they import? Every yes is a codemod I never have to write and never have to test and can never get wrong in three hundred repositories at once.

The accessibility rollout was mostly the cheap door. Two scripts, one alias, a couple of hundred lines of config editing. It didn't parse a single file.
-->

---
layout: center
---

<p class="verdict-green">Deadline met.</p>

<!--
⏱ 10:15 — Say it, hold it for two seconds, move on. Don't celebrate; the talk isn't over.

Deadline met. Across the estate, without a single ticket landing in a feature team's backlog.

That's the story I was told to come here and tell. Platform team good, automation good.

Except that's the easy half, and if I stop here I've taught you nothing you couldn't have guessed. Because that mechanism only works for as long as three hundred teams keep running that script. And they keep running it for exactly as long as it keeps not hurting them.
-->
