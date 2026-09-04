---
hide: true
---

# So how did the accessibility change land?

<div class="seam">

```json
// tsconfig.ts
"paths": {
  "@playwright/test": ["./platform/test.ts"]
}
```

<div v-click="1">

```ts
// platform/test.ts
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

</div>

---
layout: center
hide: true
---

<p class="mega">The best codemod is<br>the one you <span class="accent">designed away</span></p>

---
layout: center
hide: true
---

<p class="verdict-green">Deadline met</p>
