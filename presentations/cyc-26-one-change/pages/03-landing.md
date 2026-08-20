# So how did the accessibility change land?

<div class="seam">

```json {*}{lines:false}
// tsconfig.ts
"paths": {
  "@playwright/test": ["./platform/test.ts"]
}
```

<div v-click="1">

```ts {*}{lines:false}
import { test as base } from '@playwright/test'
import { scanForViolations } from '@platform/a11y'

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page)                  // their test, untouched
    if (process.env.PLATFORM_A11Y)
      await scanForViolations(page)  // fails on critical only
  },
})
```

</div>

<p v-click="2" class="punch">Every test file in every app <span class="accent">already imports that specifier.</span></p>

</div>

<!--
⏱ 8:05 — Act 3. The change lands. About ninety seconds, and it is the clearest picture of the mechanism in the talk.

Back to the email. Automated accessibility checks in every customer-facing frontend.

Here is how much source code we had to edit to do it. [gesture at the alias]

Every app's tsconfig has this line, and it has been there for years. When a developer writes `import { test } from '@playwright/test'`, they do not get Playwright's test function. They get ours.

[click] And this is ours. Nine lines.

First line: we import Playwright's real test function. We are not reimplementing anything and we are not forking anything. It is Playwright, exactly as it ships.

Then we extend the page fixture. Their test body runs first and runs untouched — that is the `await use(page)`. Whatever the feature team wrote happens normally, and if it fails, it fails for their own reasons.

Afterwards, if the environment variable is set, we scan the page their test just left behind. Same browser, whatever state their test walked the app into. Every route a functional test visits gets audited for free. Critical only — a platform team that turns three hundred builds red on a Tuesday morning does not get a second chance.

[click] Every test file in the estate already imports that specifier. There was nothing to migrate, because the import statement was always pointing at us.

[click] So nobody wrote an assertion, and nobody opened a test file.

I am not going to pretend we saw this coming. We aliased that import years earlier because we wanted to control the test timeout. But you only get to be lucky like this if you own a seam in the first place, and owning seams is a thing you can decide to do on purpose.
-->

---
layout: center
---

<p class="mega">The best codemod is<br>the one you <span class="accent">designed away</span></p>

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

<p class="verdict-green">Deadline met</p>

<!--
⏱ 10:15 — Say it, hold it for two seconds, move on. Don't celebrate; the talk isn't over.

Deadline met. Across the estate, without a single ticket landing in a feature team's backlog.

That's the story I was told to come here and tell. Platform team good, automation good.

Except that's the easy half, and if I stop here I've taught you nothing you couldn't have guessed. Because that mechanism only works for as long as three hundred teams keep running that script. And they keep running it for exactly as long as it keeps not hurting them.
-->
