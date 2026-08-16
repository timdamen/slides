---
layout: center
---

<div class="greys">
  <div class="grey-pair">
    <div class="grey-swatch" style="background-color:#8b8b8b"></div>
    <div class="grey-swatch" style="background-color:#787878"></div>
  </div>
  <p class="grey-caption">The business wanted the page background<br><span class="accent">one step darker.</span></p>
</div>

<!--
⏱ 0:20 — The origin story. This is personal, so slow down and tell it like a story, not like a slide.

Early in my career I worked at a large organisation. Forty-something web teams, all shipping parts of the same product to the same customers.

One day the designers and the business came to us with a change. They wanted the main background colour a little darker. That's it. That's the change. It's these two.

Nobody in this room can tell them apart from where you're sitting, and honestly neither could I.
-->

---
layout: center
---

<div class="huge-stat">
  <p class="huge-number">1 year</p>
  <p class="huge-label">to change one grey to a slightly darker grey</p>
</div>

<div class="bottlenecks">
<v-clicks>

<p>40+ teams, with different priorities</p>
<p>lack of an adopted design system</p>
<p>lack of CSS utilities and ways to share them</p>
<p>40+ backlogs items</p>
<p>and it had to land <span class="accent">everywhere at roughly the same time</span></p>

</v-clicks>
</div>

<!--
⏱ 0:50

It took more than a year.

[click] Forty-something teams, and for most of them this was somebody else's idea. Not one of them was wrong to deprioritise it. A slightly darker grey does not beat a customer-facing bug.

[click] We had no shared way of even describing the change. Every team had their own name for that colour, in their own file, in their own way.

[click] Forty backlogs, forty sets of priorities, forty sprint planning meetings where this had to win an argument against something a customer had actually asked for.

[click] And here's the one that made it genuinely hard rather than just slow: it had to land everywhere at roughly the same time. A half-migrated product doesn't look half-migrated. It looks broken. So the slowest team set the pace for everyone.

A year. For a grey.

I think about that project more than any other thing I've worked on, and it's the reason I do the job I do now.
-->

---

# What the organisation did about it

<div class="aftermath">
<v-clicks>

<p>Platform teams, with an actual mandate</p>
<p>Standards and guidelines, written down and governed</p>
<p>A strong design system</p>
<p>Shared CI/CD pipelines</p>
<p>One frontend stack instead of multiple</p>
<p>Good philosophy and vision</p>

</v-clicks>
</div>

<p v-click class="punch">Working in the middle of this transition formed me as a Frontend Engineer</p>

---
layout: image-right
image: /images/tim-speaking.png
---

# Tim Damen

<br>
<div class="text-sm leading-10">
🧑‍💻 Web platform tech lead<br>
🇳🇱 Working as an engineer in the Netherlands <br>
♿️ Passionate about making the web work for <strong>everyone</strong> <br>
🧩 Contributor to <span class="i-logos-nuxt-icon inline-block align-middle" /> <strong>Nuxt</strong>, <strong>@nuxt/a11y</strong>, and more <br>
🔧 Building <strong>WCAGify</strong> — open source accessibility tooling <br>
🧑‍🧑‍🧒‍🧒 Husband and father of two 👧🏼🧒🏼 <br>
🧗🏼‍♂️ Love to go outdoors and explore
</div>

<!--
⏱ 1:40

The interesting part isn't that it took a year. The interesting part is what the organisation concluded.

They didn't conclude that the teams were bad. They concluded that the way they managed frontend was the problem, and they rebuilt it.

[click] Platform teams, with a real remit rather than a volunteer rota.
[click] Standards, written down.
[click] A design system people actually wanted to use.
[click] Shared pipelines.
[click] And one frontend stack instead of forty.

[click] I work on the other side of that decision now. I'm on one of those platform teams, at a different organisation, and I want to show you what the machine looks like from the inside, because I've been on both ends of it.

I'll also tell you which part of that list turned out to be a lie. But not yet.
-->

---

# New email:

<div class="mandate">
  <p class="mandate-body">Every customer-facing frontend must run<br><span class="accent">automated accessibility checks</span> in CI.</p>
  <p class="mandate-meta">Sharp deadline because of the EAA</p>
</div>

<!-- TODO(Tim): either put a real quarter here or keep it date-free. Don't invent one. -->

<!--
⏱ 2:20 — Act 1 proper. The mandate. Move faster now; the grey story did the emotional work.

So. A few years later, different organisation, and this arrives.

It came from outside engineering, which is the important part. Nobody negotiated it, nobody sized it, and nobody attached any people to it.

Notice what it does not say. It does not say which apps. It does not say how. It says every.

Which makes the first question a counting question.
-->

---
layout: center
---

<div class="huge-stat">
  <p class="huge-number">~300</p>
  <p class="huge-label">frontend applications</p>
</div>

<!--
⏱ 2:50

Roughly three hundred. I say roughly on purpose, and I'll say it every time, because the number counts repositories that install our packages and that is not exactly the same as applications a customer can reach. Be suspicious of anyone who gives you this number to two significant figures.

Three hundred separate repositories. Not a monorepo. Three hundred pipelines, three hundred release cadences, three hundred backlogs owned by people whose priorities are set by somebody who has never heard of me.

There are five of us.

[click] So I cannot mandate anything. I have no authority here at all. What I have is a package they already install.
-->

---

# Rewind 5 years. Same shape. Different foundation.

<div class="wire-row">

  <div class="wire">
    <div class="wire-frame" v-click="1">
      <div class="wire-h">header</div>
      <div class="wire-b">
        <div class="wire-side">nav</div>
        <div class="wire-main">content</div>
      </div>
      <div class="wire-f">footer</div>
    </div>
    <ul class="wire-stack" v-click="4">
      <li>Vue</li><li>Vuex</li><li>webpack</li><li>Karma</li>
    </ul>
  </div>

  <div class="wire">
    <div class="wire-frame" v-click="2">
      <div class="wire-h">header</div>
      <div class="wire-b">
        <div class="wire-main">content</div>
      </div>
      <div class="wire-f">footer</div>
    </div>
    <ul class="wire-stack" v-click="4">
      <li>Vue</li><li>Pinia</li><li>Vite</li><li>Jest</li>
    </ul>
  </div>

  <div class="wire">
    <div class="wire-frame" v-click="3">
      <div class="wire-h">header</div>
      <div class="wire-b">
        <div class="wire-main">content</div>
        <div class="wire-rail">nav</div>
      </div>
      <div class="wire-f">footer</div>
    </div>
    <ul class="wire-stack" v-click="4">
      <li>Vue</li><li>hand-rolled store</li><li>webpack</li><li>Mocha</li>
    </ul>
  </div>

</div>

<p v-click="5" class="punch">Every team solved the same problems. <span class="accent">Every team was reinventing the wheel</span></p>
<p v-click="6" class="punch">Born was our CLI tool that could scaffold and update web applications according to the standards and guidelines</p>

<!--
⏱ 3:20 — The origin of the toolkit. About seventy seconds. This is a story beat, so tell it, don't present it.
Five clicks: one per wireframe, then the stacks, then the punch. Let each frame land before the next.

Rewind a few years. We were coming off AngularJS and moving to Vue, and every team did that migration themselves.

And here is what we kept finding when we looked inside the repositories.

[click] Here is one of them. A header at the top — the bank's header, the same one on every product. A layout in the middle. A footer at the bottom.

[click] Here is another team's application.

[click] And another.

If you squinted at screenshots you could not tell them apart, and that is by design: it's one bank, it's supposed to look like one bank.

[click] And underneath, no two of them were built the same way.

Different Vue version. Different state management, and in one case somebody had written their own. Different bundler. Different test runner. Every one of those was a reasonable decision on the Tuesday it was made, by a team that had no way of knowing what the team next door had picked.

So we had forty-odd teams solving the same problem, in parallel, in isolation, and every one of them paying full price for it.

[click] Every team solved the same problem. Nobody solved it twice.

That is the sentence that got us funding. Not "we should have a platform team" — that argument never lands. This: the same work, done again, by people who did not know it had already been done.

So we built a thing that generated the foundation for you. Header wired in, layout, footer, router, store, tests, pipeline — one command, and you started from the same place as everybody else.

That first version is dead now. We replaced it, and I'll come back to why. But it is where all of this starts, and it started as a scaffolding tool, not an updating one. The updating problem is the one we did not see coming.
-->

---

# One command, one foundation

<video class="demo-vid" src="/images/warp-drive-demo.mov" controls muted playsinline preload="metadata" aria-label="Terminal recording: the scaffolding CLI generating a new standard application"></video>

<!--
⏱ 4:30 — The only recording in the talk. Press play, then stop talking and let it run.
Do NOT narrate every prompt — say the two lines below and let the room read the terminal.

So that is what we built. One command.

[press play] It asks a handful of questions — what kind of product, does it need a router, does it need state — and then it writes the whole foundation. Header wired in, layout, footer, router, store, test setup, lint config, pipeline. The thing every one of those teams had been building by hand.

The important part isn't the speed. It's that the app it produces is the same shape as the other four hundred, which is the only reason anything later in this talk is possible.

[when it finishes] That is version one. It is dead now, and the reason it died is the whole second half of this talk: it could create an application, and it could not change one.
-->

---

# We did not build a codemod framework

<div class="stack">

  <div class="stack-hero">
    <span class="stack-mark i-logos-nx" aria-hidden="true"></span>
    <div>
      <p class="stack-name">Nx</p>
      <p class="stack-role">the monorepo tool we were already using</p>
    </div>
  </div>

  <ul class="stack-list">
    <li v-click="1"><span class="stack-k">generators</span><span class="stack-v">scaffold a new application — what you just watched</span></li>
    <li v-click="2"><span class="stack-k">migrations</span><span class="stack-v">versioned codemods that ship <em>inside</em> the package</span></li>
    <li v-click="3"><span class="stack-k">packageGroup</span><span class="stack-v">eleven packages move as one version</span></li>
    <li v-click="4"><span class="stack-k">the Tree</span><span class="stack-v">a virtual filesystem, so a codemod is a pure function you can unit test</span></li>
    <li v-click="5"><span class="stack-k">findNodes</span><span class="stack-v">AST queries, straight over the TypeScript compiler API</span></li>
  </ul>

</div>

<p v-click="6" class="punch">Every mechanism in this talk is <span class="accent">one of those five.</span></p>

<!--
⏱ 4:50 — Sixty seconds. This is the "what is this built on" slide, and it exists so that nothing later looks like magic.

One slide on the substrate, because everything after this is standing on it.

We were already an Nx monorepo. We did not go looking for a codemod framework — and I want to be clear, we never installed one. No jscodeshift, no ts-morph, no Babel. Everything you'll see today is Nx plus two parsers.

Nx gave us five things, and I'd argue any of them alone would have been worth it.

[click] Generators. That's the scaffolding you just watched. Nothing exotic — a function that writes files.

[click] Migrations, and this is the one that changed everything for us. Nx lets a package ship codemods *inside itself*, keyed to the version they belong to. Install version two, and the codemods that get you from one to two come along in the box. We didn't have to build a distribution mechanism, because publishing to npm already was one.

[click] packageGroup. Eleven of our packages travel together, so a team bumps one thing.

[click] The Tree. A virtual filesystem. A migration doesn't touch your disk — it's handed an in-memory tree and returns a new one. Which is exactly why we can have a hundred and fifty-seven test files: every codemod is a pure function.

[click] And findNodes, which is Nx's thin wrapper over the TypeScript compiler API. That's the AST utility the title of this talk is about, and it came with the monorepo tool we were already running.

[click] So: everything in the next twenty minutes is one of those five. If you're on Nx already, you have all of it today and you may not have noticed.

And if you're not on Nx — the ideas port. Versioned codemods shipped with the package, a virtual filesystem so they're testable, and one version number for a group. Those are the three that matter; the brand name is not the point.
-->
