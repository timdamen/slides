---
theme: apple-basic
addons:
  - '@supaslidev/shared'
background: https://cover.sli.dev
title: "Build Together, Accessed by All: Open Source Web Accessibility"
info: |
  ## Build Together, Accessed by All
  Open Source Web Accessibility — A talk about how open source and accessibility share the same philosophy: building things that work for everyone, together.
drawings:
  persist: false
transition: fade-out
mdc: true
duration: 45min
---

<div class="particles">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
</div>

<div class="floating-elements">
    <div class="layer-element layer-a11y">
      <span class="layer-icon">&#9855;</span>
    </div>
    <div class="layer-element layer-oss">
      <span class="layer-icon">&lt;/&gt;</span>
    </div>
    <div class="layer-element layer-community">
      <span class="layer-icon">&#127760;</span>
    </div>
    <div class="layer-element layer-heart">
      <span class="layer-icon">&#10084;&#65039;</span>
    </div>
</div>

<div class="connection-lines">
    <div class="line line-1"></div>
    <div class="line line-2"></div>
    <div class="line line-3"></div>
</div>

<div class="code-snippet">
&lt;web&gt;<br>
&nbsp;&nbsp;/* for everyone */<br>
&lt;/web&gt;
</div>

<div class="slide-container mt-28!">
  <h1 class="main-title">Build <span class="highlight">Together</span>,<br>Accessed by <span class="highlight">All</span></h1>
  <p class="subtitle">Open Source <span class="code-inline">Web Accessibility</span></p>
  <div class="conference-info">WebKonf Hungary 2026</div>
  <div class="speaker">Tim Damen</div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(135deg,
            #1a2a1a 0%,
            #2d4a2d 25%,
            #1a3a4a 50%,
            #2d3e2f 75%,
            #1a2a2a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .slide-container {
        text-align: center;
        color: white;
        z-index: 10;
        position: relative;
    }

    .main-title {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1rem;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        line-height: 1.15;
        letter-spacing: -0.02em;
    }

    .highlight {
        background: linear-gradient(45deg, #00c853, #64dd17);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
        from {
            filter: drop-shadow(0 0 10px rgba(0, 200, 83, 0.5));
        }
        to {
            filter: drop-shadow(0 0 20px rgba(0, 200, 83, 0.8));
        }
    }

    .subtitle {
        font-size: 1.6rem;
        font-weight: 400;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .conference-info {
        font-size: 1.3rem;
        opacity: 0.8;
        color: rgba(255,255,255,0.9);
    }

    .speaker {
        font-size: 1.1rem;
        opacity: 0.7;
        margin-top: 0.25rem;
    }

    .code-inline {
        display: inline-block;
        background: rgba(0,0,0,0.4);
        color: rgb(247, 242, 242);
        padding: 0.3rem 0.6rem;
        border-radius: 8px;
        font-family: 'SF Mono', Monaco, monospace;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    }

    .code-snippet {
        position: absolute;
        bottom: 12%;
        left: 6%;
        background: rgba(0,0,0,0.4);
        color: #00c853;
        padding: 1rem;
        border-radius: 8px;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 0.85rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        opacity: 0.7;
        animation: fadeInOut 6s ease-in-out infinite;
    }

    /* Floating elements representing a11y + OSS concepts */
    .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }

    .layer-element {
        position: absolute;
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: float 6s ease-in-out infinite;
    }

    .layer-icon {
        font-size: 1.5rem;
        opacity: 0.8;
    }

    .layer-a11y {
        width: 80px;
        height: 80px;
        background: rgba(0, 200, 83, 0.15);
        border-color: rgba(0, 200, 83, 0.3);
        top: 8%;
        left: 12%;
        animation-delay: 0s;
    }

    .layer-oss {
        width: 90px;
        height: 90px;
        background: rgba(100, 221, 23, 0.15);
        border-color: rgba(100, 221, 23, 0.3);
        top: 12%;
        right: 10%;
        animation-delay: 1.5s;
    }

    .layer-oss .layer-icon {
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 1.2rem;
        color: rgba(100, 221, 23, 0.8);
    }

    .layer-community {
        width: 70px;
        height: 70px;
        background: rgba(0, 150, 136, 0.15);
        border-color: rgba(0, 150, 136, 0.3);
        bottom: 25%;
        right: 8%;
        animation-delay: 3s;
    }

    .layer-heart {
        width: 75px;
        height: 75px;
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
        bottom: 18%;
        left: 15%;
        animation-delay: 4.5s;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
        }
        50% {
            transform: translateY(-20px) rotate(3deg);
            opacity: 0.8;
        }
    }

    /* Connection lines between floating elements */
    .connection-lines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .line {
        position: absolute;
        background: linear-gradient(90deg, transparent, rgba(0, 200, 83, 0.2), transparent);
        height: 1px;
        animation: pulse 4s ease-in-out infinite;
    }

    .line-1 {
        width: 30%;
        top: 20%;
        left: 15%;
        transform: rotate(15deg);
        animation-delay: 0s;
    }

    .line-2 {
        width: 25%;
        top: 45%;
        right: 10%;
        transform: rotate(-10deg);
        animation-delay: 1.5s;
    }

    .line-3 {
        width: 35%;
        bottom: 30%;
        left: 20%;
        transform: rotate(5deg);
        animation-delay: 3s;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.8; }
    }

    @keyframes fadeInOut {
        0%, 20%, 80%, 100% { opacity: 0.3; }
        40%, 60% { opacity: 0.7; }
    }

    /* Particles */
    .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(0, 200, 83, 0.6);
        border-radius: 50%;
        animation: particleFloat 12s linear infinite;
    }

    .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 25%; animation-delay: 2s; }
    .particle:nth-child(3) { left: 45%; animation-delay: 4s; }
    .particle:nth-child(4) { left: 65%; animation-delay: 6s; }
    .particle:nth-child(5) { left: 80%; animation-delay: 8s; }
    .particle:nth-child(6) { left: 92%; animation-delay: 10s; }

    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: scale(1);
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }

    @media (max-width: 768px) {
        .main-title { font-size: 2.8rem; }
        .subtitle { font-size: 1.2rem; }
        .layer-element { display: none; }
        .connection-lines { display: none; }
    }
</style>

<!--
Start with the provocation — not with who you are.

"De tools die developers gebruiken om toegankelijke software te bouwen... zijn zelf vaak niet toegankelijk. En de meeste accessibility-kennis zit opgesloten in betaalde tools, gesloten audits en consultancy-rapporten. Dat is een probleem — en open source is het antwoord."
-->

---

# The paradox

<div class="mt-8"></div>

<v-clicks>

> The tools developers use to build (accessible) software...
> are often **not accessible themselves**.

A lot of knowledge is locked in **black boxes** behind **paid tools** and with **subscriptions**.

**Open source** can help here.

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<style>
blockquote {
  font-size: 1.5rem;
  border-left: 4px solid #00c853;
  padding: 1rem 1.5rem;
  background: rgba(0, 200, 83, 0.05);
  margin: 1rem 0 2rem 0;
}
</style>

<!--
Open with the paradox. Let the audience feel the tension before you introduce yourself.

Accessibility knowledge shouldn't be gatekept. Open source breaks down these barriers.
-->

---
layout: image-right
image: /images/tim-speaking.png
---

# Tim Damen

<br>

<v-clicks>

- Front-end developer & accessibility advocate
- Working as an engineer in the Netherlands
- Passionate about making the web work for **everyone**
- Contributor to <span class="i-logos-nuxt-icon inline-block align-middle" /> **Nuxt**, **@nuxt/a11y**, and more
- Building **WCAGify** — open source accessibility tooling

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Now introduce yourself. Keep it brief — the audience wants substance, not a CV.
-->

---
layout: section
---

# Why open source matters
## For the web, for society, and for you

<!--
Transition into section 2. This is where we zoom out and talk about the bigger picture.
-->

---

<Youtube id="yVpbFMhOAwE" width="850px" height="450px" />

---

# The web was built on open source

<div class="mt-4"></div>

<v-clicks>

**The internet as we know it wouldn't exist without open source.**

Every website you visit, every app you build — it runs on a foundation of open source software that people shared freely with the world.

Let's look at two people who changed everything.

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Set the stage. Most devs use open source every day without thinking about how it got here.
-->

---

# Linus Torvalds — <span class="i-logos-linux-tux inline-block align-middle" /> Linux & <span class="i-logos-git-icon inline-block align-middle" /> Git

<img src="/images/linus.png" alt="Linus Torvalds" class="absolute right-12 top-12 w-48 rounded-xl shadow-lg" />

<v-clicks>

- **1991** — Created <span class="i-logos-linux-tux inline-block align-middle" /> **Linux** as a university student in Helsinki
  - Today it powers **96.3%** of the world's top servers
  - Every Android phone. Most of the cloud. The ISS.

- **2005** — Created <span class="i-logos-git-icon inline-block align-middle" /> **Git** out of frustration
  - Built it to manage Linux kernel development
  - Now the backbone of how **100M+ developers** collaborate

- One person shared their work. **The world built on it.**

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Linus is the ultimate example of open source impact. Two projects that changed everything.

Linux: started as a hobby OS, now runs almost everything.
Git: was built in 10 days because BitKeeper revoked their free license. Frustration became revolution.
-->

---
layout: center
---

# Where <span class="i-logos-linux-tux inline-block align-middle" /> Linux & <span class="i-logos-git-icon inline-block align-middle" /> Git were built

<img src="/images/linus-desk.png" alt="Linus Torvalds' minimal home office setup" class="mx-auto mt-4 max-h-96 rounded-lg shadow-lg" />

<!--
Show the audience Linus' simple desk setup. This is where Linux and Git were created.

The contrast between this modest workspace and the global impact of what was built there is powerful.
-->

---

# Evan You — <span class="i-logos-vue inline-block align-middle" /> Vue, <span class="i-logos-vitejs inline-block align-middle" /> Vite & the modern frontend

<img src="/images/evan.png" alt="Evan You" class="absolute right-12 bottom-12 w-48 rounded-xl shadow-lg" />

<v-clicks>

- **2014** — Created <span class="i-logos-vue inline-block align-middle" /> **Vue.js** as a solo side project
  - "I wanted to extract the parts I liked about <span class="i-logos-angular-icon inline-block align-middle" /> Angular and build something lightweight"
  - Today: **4M+ weekly <span class="i-logos-npm-icon inline-block align-middle" /> npm downloads**, used by companies worldwide

- **2020** — Created <span class="i-logos-vitejs inline-block align-middle" /> **Vite** to rethink build tooling
  - Replaced <span class="i-logos-webpack inline-block align-middle" /> Webpack's slow bundling with native ES modules
  - Now powers <span class="i-logos-vue inline-block align-middle" /> **Vue**, <span class="i-logos-nuxt-icon inline-block align-middle" /> **Nuxt**, <span class="i-logos-svelte-icon inline-block align-middle" /> **Svelte**, <span class="i-logos-astro-icon inline-block align-middle" /> **Astro**, <span class="i-logos-solidjs-icon inline-block align-middle" /> **SolidStart**, and more

- **2026** — Released <span class="i-logos-vitejs inline-block align-middle" /> **Vite 8** and launched **[Vite Plus](https://viteplus.dev/)**
  - The ecosystem keeps growing, year after year

- One developer's side project became an **entire ecosystem**

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Evan You is a great bridge between the Linux world and the frontend world.

Vue started as a personal experiment. Vite was born from the pain of slow Webpack builds.
Both became foundational tools for the web community — and Evan did this independently, funded by the community.

This is the power of open source: one person can build something, share it, and a whole ecosystem grows around it.
-->

---

# The ecosystem they enabled

<div class="mt-6"></div>

<v-clicks>

| Layer | Open Source Projects |
|-------|---------------------|
| **Runtime** | <span class="i-logos-linux-tux inline-block align-middle" /> Linux, <span class="i-logos-nodejs-icon inline-block align-middle" /> Node.js, <span class="i-logos-deno inline-block align-middle" /> Deno, <span class="i-logos-bun inline-block align-middle" /> Bun |
| **Frameworks** | <span class="i-logos-react inline-block align-middle" /> React, <span class="i-logos-vue inline-block align-middle" /> Vue, <span class="i-logos-angular-icon inline-block align-middle" /> Angular, <span class="i-logos-svelte-icon inline-block align-middle" /> Svelte, <span class="i-logos-solidjs-icon inline-block align-middle" /> Solid |
| **Meta-frameworks** | <span class="i-logos-nextjs-icon inline-block align-middle invert" /> Next.js, <span class="i-logos-nuxt-icon inline-block align-middle" /> **Nuxt**, <span class="i-logos-astro-icon inline-block align-middle" /> Astro, <span class="i-logos-svelte-icon inline-block align-middle" /> SvelteKit |
| **Build tools** | <span class="i-logos-vitejs inline-block align-middle" /> **Vite**, <span class="i-logos-esbuild inline-block align-middle" /> esbuild, <span class="i-logos-turbopack-icon inline-block align-middle invert" /> Turbopack, <span class="i-logos-rollupjs inline-block align-middle" /> Rollup |
| **Version control** | <span class="i-logos-git-icon inline-block align-middle" /> **Git**, <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub, <span class="i-logos-gitlab-icon inline-block align-middle" /> GitLab |
| **Infrastructure** | <span class="i-logos-docker-icon inline-block align-middle" /> Docker, <span class="i-logos-kubernetes inline-block align-middle" /> Kubernetes, <span class="i-logos-terraform-icon inline-block align-middle" /> Terraform |

</v-clicks>

<v-click>

<div class="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-500/30">

**Your job as a web developer today exists because people chose to share their work openly.**

</div>

</v-click>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Drive the point home. Every layer of the modern web stack is open source.

We didn't pay for React. We didn't pay for Git. We didn't pay for Linux.

Our careers are built on the generosity of open source contributors.
-->

---

# No paywalls, no gatekeeping

<img src="/images/paywall.png" alt="Paywall blocking access to tools" class="absolute right-12 top-1/2 -translate-y-1/2 w-96 rounded-lg shadow-lg" />

<v-clicks>

The best innovations happened because tools were **freely available**.

### Open source tools mean:
- No data collection
- No sign up required
- Free to use
- Open source — anyone can inspect, improve, contribute

### Why this matters
Good open source tooling has enabled **massive innovation**.
If we keep building and sharing freely, it will continue to do so — for everyone.

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
This is about fighting paywalls and gatekeeping. Accessibility knowledge and tooling should be free and open.

The best things on the web were built because the tools were available to everyone. Let's keep it that way.
-->

---
layout: center
---

# <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub quiz time

### Let's see how well you know the platform where open source lives

<div class="mt-4 text-lg opacity-70">

3 questions. Shout out your guesses.

</div>

<!--
Interactive section! Get the audience involved. Ask them to shout out answers before revealing.

This is a nice energy break between the "why OSS matters" story and the career arguments.
-->

---

# Which real project has the most commits on <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub? 🥇

<div class="mt-8"></div>

<v-click>

<div class="p-6 bg-green-900/20 rounded-lg border border-green-500/30">

### <span class="i-logos-linux-tux inline-block align-middle" /> torvalds/linux — ~1.4 million commits

- Started in 1991, still going strong with **~75,000-80,000 commits/year**
- Crossed 1 million commits in August 2020
- The runner-up? <span class="i-logos-homebrew inline-block align-middle" /> Homebrew — with only ~120,000

</div>

</v-click>

<v-click>

<div class="mt-4 text-sm opacity-60">

Fun fact: the actual record is **RVFET/committed** with 100,889,089 commits — all empty, generated by a bot at 90,000/min to test GitHub's limits. It got archived.

</div>

</v-click>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Ask the audience first: "Which project do you think has the most commits on GitHub?"

Let them guess. Then reveal Linux. Then the fun fact about the bot.
-->

---

# What is the most-starred repo on <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub?

<div class="mt-8"></div>

<v-click>

<div class="p-6 bg-green-900/20 rounded-lg border border-green-500/30">

### codecrafters-io/build-your-own-x — ~484,000 stars 💫

Not a framework. Not a tool. **A Markdown file** with links to tutorials for rebuilding technologies from scratch.

</div>

</v-click>

<v-click>

<div class="mt-4">

**4 out of 5 most-starred repos are curated lists, not software.**

| Repo | Stars | What it is |
|------|-------|------------|
| build-your-own-x | ~484K | Tutorial aggregator |
| awesome | ~450K | Curated topic lists |
| freeCodeCamp | ~439K | Coding curriculum |
| public-apis | ~417K | Free API directory |

</div>

</v-click>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
"What do you think is the most-starred repo on GitHub? React? Vue? Linux?"

Let them guess. Most will say a framework. The real answer surprises everyone.

Stars measure interest and bookmarking, not code quality.
-->

---

# What is the fastest-growing repo in <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub history? 🌠

<div class="mt-8"></div>

<v-click>

<div class="p-6 bg-green-900/20 rounded-lg border border-green-500/30">

### 🦞 OpenClaw — ~340,000 stars in under 5 months

An open-source AI agent that went from 9,000 to 100,000 stars in **days**. For comparison, <span class="i-logos-react inline-block align-middle" /> React took **over a decade** to reach 250,000 stars.

</div>

</v-click>

<v-click>

<div class="mt-4">

| Metric | 🦞 OpenClaw | <span class="i-logos-react inline-block align-middle" /> React |
|--------|----------|-------|
| Time to 100K stars | ~3 months | ~7 years |
| Time to 250K stars | ~60 days | ~10 years  |
| Peak growth | Tens of thousands/day | Gradual |

</div>

</v-click>

<v-click>

<div class="mt-4 text-lg">

GitHub is a barometer of what the developer world cares about **right now**.

</div>

</v-click>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
"And finally — what's the fastest-growing repo ever on GitHub?"

This one really lands. The AI era has completely changed the scale of open source growth.

Nice transition: "GitHub shows us what developers care about. And right now, we need them to care about accessibility too."
-->

---
layout: center
---

# 🦞 OpenClaw vs <span class="i-logos-react inline-block align-middle" /> React — star history

<img src="/images/star-history-open-react.png" alt="Star history chart comparing OpenClaw and React growth on GitHub" class="mx-auto mt-4 max-h-96 rounded-lg shadow-lg" />

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

---

# Open source: 4 reasons it matters for YOU

<div class="grid grid-cols-4 gap-4 mt-8">

<v-clicks>

<div class="p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-center">
  <div class="i-carbon-view inline-block text-3xl text-green-400 mb-3" />
  <h3 class="text-base! font-bold mb-2">Transparency as quality assurance</h3>
  <p class="text-sm opacity-80">Everyone can inspect, review, and improve the code. Audits in public, not behind a paywall.</p>
</div>

<div class="p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-center">
  <div class="i-carbon-education inline-block text-3xl text-green-400 mb-3" />
  <h3 class="text-base! font-bold mb-2">Learning in public</h3>
  <p class="text-sm opacity-80">A PR history is a growth path more visible than any certificate. Learn from reviewers worldwide.</p>
</div>

<div class="p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-center">
  <div class="i-carbon-collaborate inline-block text-3xl text-green-400 mb-3" />
  <h3 class="text-base! font-bold mb-2">People you'd never otherwise meet</h3>
  <p class="text-sm opacity-80">The OSS community transcends companies, countries, and seniority. You build a network by <em>doing</em>.</p>
</div>

<div class="p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-center">
  <div class="i-carbon-portfolio inline-block text-3xl text-green-400 mb-3" />
  <h3 class="text-base! font-bold mb-2">OSS as a living portfolio</h3>
  <p class="text-sm opacity-80">More concrete than a CV line. Recruiters can see your contributions and immediately assess your value.</p>
</div>

</v-clicks>

</div>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
These are the four arguments for people who've never contributed to OSS.

Make each one concrete. This isn't abstract — it directly benefits their career.
-->

---
layout: section
---

# A journey into open source

<!--
Transition to the personal story section.
-->

---

# The beginning

<div class="mt-6"></div>

<v-clicks>

### The first contribution
- A typo fix? An issue? A PR?
- Let's take a step back

### Learn about the project
- Use it, test it, intergrate it, understand it
- Read the contribution descriptions
- Try to connect with the community
- Make a meaningfull improvement

### The vulnerability
- Writing code in public is **vulnerable**
- Learning to deal with rejection and turn it into growth

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Tell this as a story, not a CV summary.

Be honest about the vulnerability. The audience will connect with the struggle, not the success.

When was your first contribution? How did it feel?
-->

---

# Good to know

<Tweet id="1469349956880408583" />


<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<style>
blockquote {
  font-size: 1.3rem;
  border-left: 4px solid #00c853;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 200, 83, 0.05);
  margin: 1rem 0;
}
</style>

<!--
This is the emotional core of the talk. The moment it clicked.

Open source and accessibility share the same DNA: inclusion, collaboration, openness.

Name Daniel Roe, name the Nuxt community — make it real.
-->

---
layout: section
---

# <span class="i-logos-nuxt-icon inline-block align-middle" /> @nuxt/a11y
## Accessibility utils for the Nuxt ecosystem

<!--
Transition to the first live demo.
-->

---

# How it started


<img src="/images/viteconf.png" alt="ViteConf" class="absolute right-12 bottom-12 w-48 rounded-xl shadow-lg" />
<div class="mt-6"></div>

<v-clicks>

### Talked to Daniel Roe at Viteconf
- Spoke about Open Source and where to start
- Talked about my background and interests

### What was missing in <span class="i-logos-nuxt-icon inline-block align-middle" /> Nuxt?
- <span class="i-logos-nuxt-icon inline-block align-middle" /> Nuxt is the most popular <span class="i-logos-vue inline-block align-middle" /> Vue meta-frameworks
- Nuxt has a nice way to intergrate modules in to the Nuxt Devtools
- But a core **accessibility module** was missing

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Set the context for the demo. What problem does nuxt/a11y solve?

Make the gap concrete — compare with what React had.
-->

---

# <span class="i-logos-nuxt-icon inline-block align-middle" /> @nuxt/a11y — The solution

<div class="mt-6"></div>

<v-clicks>

### What it does
- Automated accessibility checks during development
- Runtime warnings for common a11y violations
- Guidance on learning about and start fixing issues — not just flagging them

### Future
- More intergration with the Nuxt ecosystem
- Add more a11y utility features

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Describe the solution before showing it. Give the audience context.

Then transition to: "Let me show you what this looks like in practice."
-->

---

# [Live demo: @nuxt/a11y](http://localhost:3000)

<img src="/images/nuxt-a11y.png" alt="nuxt/a11y module" class="mt-8 max-h-100 rounded-lg shadow-lg" />

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
LIVE DEMO

Show the before and after. The contrast makes the value immediately clear.

Show:
- A Nuxt app without a11y module → no warnings
- Add the module → instant feedback
- Fix an issue based on the guidance
-->

---

# The OSS side of @nuxt/a11y

<div class="mt-6"></div>

<v-clicks>

### Working with Nuxt core maintainers
- Collaborating with **Daniel Roe** and the Nuxt team
- The review process — what did you learn?
- The difference between writing code alone vs. code a community will use

### Key takeaway

> Contributing to a well-maintained OSS project teaches a lot about software engineering

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<style>
blockquote {
  font-size: 1.2rem;
  border-left: 4px solid #00c853;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 200, 83, 0.05);
  margin: 1rem 0;
}
</style>

<!--
This is what makes the talk unique — not just the tech, but the human side of OSS.

What was it like to get a review from Daniel Roe? What did you learn from the process?
-->

---
layout: section
---

# Demo 2: WCAGify
## Behind the scenes of something new

<!--
Transition to the second demo. Use the "not public yet" as a feature.
-->

---

# WCAGify — The story

<div class="mt-6"></div>

<v-clicks>

> "This is something I'm building right now. You're seeing it before it's finished — and that's exactly how open source works."

### The problem it solves
- What gap does WCAGify fill?
- What tools already exist, and why aren't they enough?
- Who is this for?

### The approach
- Architecture decisions and trade-offs
- How you think when building *for* accessibility

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<style>
blockquote {
  font-size: 1.3rem;
  border-left: 4px solid #00c853;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 200, 83, 0.05);
  margin: 1rem 0;
}
</style>

<!--
Use the "not public yet" as a feature, not a disclaimer.

"You're seeing this before it's ready — and that's exactly how open source works."

This creates intimacy with the audience.
-->

---

# [Live demo: WCAGify](http://localhost:3001)

<img src="/images/wcagify.png" alt="WCAGify" class="mt-8 max-h-100 rounded-lg shadow-lg" />

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
LIVE DEMO

Show what works. Don't hide the rough edges — they make it real.

The audience should feel invited to help build this.
-->

---

# Building together

<div class="mt-8 text-xl">

<v-clicks>

WCAGify isn't finished — and that's the point.

**Open source means you don't have to build alone.**

If this resonates with you — if you want to help make accessibility tooling free and open...

Let's build this together.

</v-clicks>

</div>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
This is the engagement moment. Invite people in.

Make it personal: "Come talk to me." Not "check the repo." Human connection first.
-->

---
layout: section
hide: true
---

# Four reasons to start today

<!--
Transition to the action-oriented closing section.
-->

---
hide: true
---

# 1. Contribute to an existing project

<div class="mt-4"></div>

<v-clicks>

You don't need to be a maintainer. You don't need to write 1000 lines of code.

### A good accessibility issue looks like this:

```md
## Issue: Missing alt text on hero image

**Page:** /homepage
**Element:** <img src="hero.jpg"> (no alt attribute)
**WCAG criterion:** 1.1.1 Non-text Content (Level A)
**Impact:** Screen reader users cannot understand the image content
**Suggested fix:** Add descriptive alt text: alt="Team collaborating on code"
```

**That's a contribution.** And it matters.

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Show a concrete example of a good a11y issue. Make it tangible.

The audience should leave thinking "I can do that."
-->

---
hide: true
---

# 2. Take accessibility seriously

<div class="mt-6"></div>

<v-clicks>

### The European Accessibility Act (EAA) is here
- Came into effect **June 2025**
- Applies to products and services in the EU
- Government and businesses **need people who understand this**

### You already have a head start
- If you're in this room, you care about accessibility
- That puts you ahead of **most developers**
- This is not just a nice-to-have — it's becoming **law**

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
EAA is a strong motivator. It's not just ethics — it's regulation.

If you understand accessibility, you're valuable. Companies need you.
-->

---
hide: true
---

# 3. Build your own tool

<div class="mt-6"></div>

<v-clicks>

### If something is missing in your workflow — build it.

- WCAGify exists because existing tools weren't enough
- You don't need permission to start
- You don't need a team of 50

### And make it open source.

- Someone else has the same problem
- They'll find your tool, improve it, contribute back
- **That's how ecosystems grow**

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Encourage the builder mindset. WCAGify is proof it works.

Linus built Linux as a student. Evan built Vue as a side project. You can build something too.
-->

---
hide: true
---

# 4. OSS as a career move

<div class="mt-6"></div>

<v-clicks>

### One contribution can change your trajectory

- A good PR gets noticed by maintainers
- Maintainers work at companies. Companies are hiring.
- Your <span class="i-logos-github-icon inline-block align-middle invert" /> GitHub profile becomes a **living interview**

### Real example

> A contribution to @nuxt/a11y led to conversations, opportunities, and connections that no job board could have provided.

**Open source is the most honest way to show what you can do.**

</v-clicks>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<style>
blockquote {
  font-size: 1.2rem;
  border-left: 4px solid #00c853;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 200, 83, 0.05);
  margin: 1rem 0;
}
</style>

<!--
Make this concrete. Tell the real story of how OSS opened doors.

For you or for someone you know — one contribution that led to a conversation, a gig, an opportunity.
-->

---

# Build together, accessed by all

<div class="mt-8 text-center">

<v-clicks>

<div class="text-2xl leading-relaxed mb-8">

Open source and accessibility share the same philosophy:

**Nobody builds this alone,** and it's not done
until it **works for everyone.**

</div>

<div class="text-xl opacity-80 mb-8">

You are developers. You can change this —
not with a grand heroic act, but with
**one PR, one issue, one tool you share.**

</div>

</v-clicks>

</div>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Close the circle from your opening.

"Open source en accessibility delen dezelfde filosofie: niemand bouwt dit alleen, en het is voor niemand klaar zolang het niet voor iedereen werkt."

Pause. Let it land. Then move to the final slide.
-->

---

<div class="flex flex-col items-center justify-center h-full">
  <h1 class="text-5xl font-bold mb-4">Thank You</h1>
  <p class="text-2xl opacity-80 mb-12">Let's build together.</p>

  <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-lg">
    <div class="text-right opacity-70">Website</div>
    <div><strong>timdamen.io</strong></div>
    <div class="text-right opacity-70"><span class="i-logos-github-icon inline-block align-middle invert" /> GitHub</div>
    <div><strong>timdamen</strong></div>
    <div class="text-right opacity-70"><span class="i-logos-linkedin-icon inline-block align-middle invert" /> LinkedIn</div>
    <div><strong>Tim Damen</strong></div>
    <div class="text-right opacity-70"><span class="i-logos-nuxt-icon inline-block align-middle" /> @nuxt/a11y</div>
    <div><strong>github.com/nuxt/a11y</strong></div>
    <div class="text-right opacity-70">WCAGify</div>
    <div><strong>Coming soon</strong></div>
  </div>
</div>

<BarBottom title="Build Together, Accessed by All">
  <Item text="timdamen.io">
    <carbon:link />
  </Item>
  <Item text="Tim Damen">
    <carbon:logo-linkedin />
  </Item>
  <Item text="timdamen">
    <carbon:logo-github />
  </Item>
</BarBottom>

<!--
Final slide — contact info and links.

Stay here while people take photos.

"Come talk to me if you want to contribute to WCAGify, or if you have questions about getting started with open source accessibility."
-->
