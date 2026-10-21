---
layout: center
---

<div class="greys">
  <div class="grey-pair">
    <div class="grey-swatch" style="background-color:#787878"></div>
    <div class="grey-swatch" style="background-color:#8b8b8b"></div>

  </div>
  <p class="grey-caption">The business wanted the page background </p>
</div>

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
layout: default
---

<IntroSlide />

---

# New email:

<div class="mandate">
  <p class="mandate-body">Every customer-facing frontend must run<br><span class="accent">automated accessibility checks</span> in CI.</p>
  <p class="mandate-meta">Sharp deadline because of the EAA</p>
</div>

<!-- TODO(Tim): either put a real quarter here or keep it date-free. Don't invent one. -->

---
layout: center
---

<div class="huge-stat">
  <p class="huge-number">~350</p>
  <p class="huge-label">frontend applications</p>
</div>

---

# Same shape, different foundation

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

---

# One command, one foundation

<video class="demo-vid" src="/images/warp-drive-demo.mov" controls muted playsinline preload="metadata" aria-label="Terminal recording: the scaffolding CLI generating a new standard application"></video>

---

# We did not build a codemod framework

<div class="stack-col">

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
