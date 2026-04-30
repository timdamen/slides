---
theme: apple-basic
addons:
  - '@supaslidev/shared'
background: https://cover.sli.dev
title: "Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live"
colorSchema: dark
info: |
  ## Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live
  A presentation about the top layer of the web, focusing on dialogs, popovers, and modals. Learn how to effectively use these components to enhance user experience and accessibility.
drawings:
  persist: false
transition: fade-out
mdc: true
---

<div class="particles">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
</div>

<div class="floating-elements">
    <div class="layer-element layer-1"></div>
    <div class="layer-element layer-2"></div>
    <div class="layer-element layer-3"></div>
    <div class="layer-element toplayer-element"></div>
</div>

<div class="mountains"></div>

<div class="code-snippet">
&lt;dialog&gt;<br>
&nbsp;&nbsp;/* I live in the toplayer 👋🏼 */<br>
&lt;/dialog&gt;
    </div>

<div class="slide-container mt-30!"><h1 class="main-title">Diving into the <span class="highlight">Toplayer</span></h1><p class="subtitle">Where <span class="code">
&lt;dialog&gt;
    </span>s, <span class="code">
&lbrack;popover&rbrack;
    </span>s, and Modals Live</p>
    <div class="conference-info">WebKonf Hungary 2026</div>
    <div class="location">Tim Damen</div>
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
            #2d3e2f 0%,
            #4a5d3a 25%,
            #6b4423 50%,
            #8b5a3c 75%,
            #5a4a3a 100%);
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
        font-size: 4.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        line-height: 1.1;
        letter-spacing: -0.02em;
    }

    .highlight {
        background: linear-gradient(45deg, #ffd700, #ffed4a);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    }


    .subtitle {
        font-size: 1.8rem;
        font-weight: 400;
        margin-bottom: 3rem;
        opacity: 0.9;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .conference-info {
        font-size: 1.3rem;
        opacity: 0.8;
    }

    .location {
        font-size: 1.1rem;
        opacity: 0.8;
    }

    /* Floating layer elements to represent the toplayer concept */
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
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        opacity: 0.5;
    }

    .layer-1 {
        width: 200px;
        height: 120px;
        background: rgba(255,255,255,0.1);
        top: 10%;
        left: 15%;
        animation-delay: 0s;
        z-index: 1;
    }

    .layer-2 {
        width: 180px;
        height: 100px;
        background: rgba(255,255,255,0.15);
        top: 10%;
        right: 20%;
        animation-delay: 1s;
        z-index: 2;
    }

    .layer-3 {
        width: 150px;
        height: 90px;
        background: rgba(255,255,255,0.2);
        bottom: 10%;
        left: 20%;
        animation-delay: 2s;
        z-index: 3;
    }

    .toplayer-element {
        width: 160px;
        height: 100px;
        background: rgba(255, 215, 0, 0.3);
        border: 2px solid rgba(255, 215, 0, 0.5);
        top: 2%;
        right: 15%;
        transform: translateY(-15px) scale(1.05);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        z-index: 999999; /* Toplayer! */
    }


    /* Mountain silhouette for Utah theming */
    .mountains {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        background: linear-gradient(to top,
            rgba(0,0,0,0.4) 0%,
            rgba(0,0,0,0.7) 50%,
            transparent 100%);
        clip-path: polygon(
            0% 100%,
            15% 60%,
            25% 80%,
            35% 40%,
            45% 70%,
            55% 30%,
            65% 65%,
            75% 45%,
            85% 75%,
            100% 50%,
            100% 100%
        );
        z-index: 1;
    }

    /* Code snippet decoration */
    .code {
        display: inline-block;
        background: rgba(0,0,0,0.4);
        color:rgb(247, 242, 242);
        padding: 0.5rem;
        border-radius: 8px;
        font-family: 'SF Mono', Monaco, monospace;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        opacity: 1;
    }
    .code-snippet {
        position: absolute;
        top: 60%;
        left: 8%;
        background: rgba(0,0,0,0.4);
        color: #00ff88;
        padding: 1rem;
        border-radius: 8px;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        opacity: 1;
    }


    /* Responsive design */
    @media (max-width: 768px) {
        .main-title {
            font-size: 3rem;
        }

        .subtitle {
            font-size: 1.4rem;
        }

        .layer-element {
            display: none;
        }
    }

    /* Subtle particle effect */
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
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.6);
        border-radius: 50%;
        opacity: 0.6;
    }

    .particle:nth-child(1) { left: 20%; animation-delay: 0s; }
    .particle:nth-child(2) { left: 40%; animation-delay: 2s; }
    .particle:nth-child(3) { left: 60%; animation-delay: 4s; }
    .particle:nth-child(4) { left: 80%; animation-delay: 6s; }

</style>

---

<FirstOverlayIntro />

<style>
.slidev-layout{
padding: 0px;
}
</style>

---

<OverlayIntro />

<style>
.slidev-layout{
padding: 0px;
}
</style>

---

<Tweet id="1435827240286109702" scale="0.9" />


<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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

<Youtube id="UMLgenmD2aY?start=133&rel=0" width="100%" height="450px"/>

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
layout: image-right
image: /images/wcag.webp
---

# Tim Damen

<br>
<span class="text-2xl">🧑‍💻</span> Head of Front-end @ focusring.io

🧩 Ecosystem Team Member <span class="i-logos-nuxt-icon inline-block align-middle" /> @ Nuxt

<span class="text-2xl">🌸</span> Husband and proud father of a daughter

<span class="text-2xl">🏔️</span> Passionate about sports and outdoor adventures

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
layout: center
---

# We'll focus on the <span class="font-italic" v-mark.underline>What</span>, <span class="font-italic" v-mark.underline>Why</span> and <span class="font-italic" v-mark.underline>How</span> of content that overlaps content

<br>

With the `<dialog>` element and the `[popover]` attribute

<style>
.slidev-layout{
width: 800px;
margin: auto;
text-align: center;
}
</style>

---
layout: center
---

# `<dialog>`

HTML element - a native dialog element that can be used to create a <span class="font-italic" v-mark.underline>modal</span> dialog or a <span class="font-italic" v-mark.underline>non-modal</span> dialog.

<v-click>

- Supported by all major browsers
    - 2014: Chrome v37
    - 2022: Firefox 98
    - 2022: Safari 15.4

</v-click>

<v-click>

- Good accessibility support
    - 2014-2021: "[The a11y community says nope](https://www.tpgi.com/the-current-state-of-modal-dialog-accessibility/)"
    - 2022: "Universal browser support... but still wait"
    - 2023: "[Use the dialog element (reasonably) by Scott ohara](https://www.scottohara.me/blog/2023/01/26/use-the-dialog-element.html)"

</v-click>

<BarBottom title="developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog">
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
layout: center
---

# `[popover]`

HTML attribute - API in HTML that allows you to create popovers, tooltips, and other overlay content.

<v-click>

- Supported by all major browsers
  - May 2023: Chrome v114
  - Sep 2023: Safari v17
  - Apr 2024: Firefox v125

</v-click>

<v-click>

- Accessibility was baked in from the start
- [Proposed by the Open UI group](https://open-ui.org/components/popover.research.explainer/)

</v-click>

<BarBottom title="developer.mozilla.org/en-US/docs/Web/API/Popover_API">
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
layout: center
---

# Non-modal dialog

<img src="/images/non-modal-dialog.png" alt="example of a non modal dialog">

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
.slidev-layout{
width: 700px;
margin: auto;
text-align: center;
}
</style>

---
layout: center
---

# Popover

<img src="/images/popover.png" alt="example of a popover">

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
.slidev-layout{
width: 700px;
margin: auto;
text-align: center;
}
</style>

---
layout: center
---

# Modal + Popover

<img src="/images/modal-popover.png" alt="example of a popover">

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
.slidev-layout{
width: 700px;
margin: auto;
text-align: center;
}
</style>

---

# Before `z-index`: the `<layer>` element

<div class="mt-4"></div>

<v-clicks>

- **Netscape 4 (1997)** introduced the `<layer>` element
  - Allowed absolute positioning and stacking of content
  - Each `<layer>` was a separate document object in JavaScript
  - **Only worked in Netscape** — `if (document.layers)` was true in Netscape 4, but false in all other browsers

- Meanwhile, **CSS2 (1998)** standardised `z-index` for stacking
  - Supported across browsers, no vendor lock-in
  - The `<layer>` element quietly disappeared

- Today `<layer>` is a relic of the Browser Wars — proof that **open standards outlast**

</v-clicks>

<BarBottom title="en.wikipedia.org/wiki/Layer_element">
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
Fun historical detour. Before z-index existed in CSS, Netscape tried to solve layering with a proprietary HTML tag called <layer>.
It only worked in Netscape 4 and died when CSS2 standardised z-index.
A perfect example of why open standards win.
-->

---
layout: center
---

# With `z-index` you can stack elements

<SlidevVideo autoplay autoreset="slide" loop>
  <!-- Anything that can go in an HTML video element. -->
  <source src="/images/zindex.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/images/zindex.mov">here</a>.
  </p>
</SlidevVideo>

<BarBottom title="developer.mozilla.org/en-US/docs/Web/CSS/z-index">
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
layout: center
---

# What is the maximum `z-index` value?

<div v-click.hide>

```css
z-index: ???;
```
</div>
<div v-after>

```css
z-index: 2147483647; /* 2^31 - 1 */
```

</div>
<div v-click>

<SpeakButton />

</div>

<div v-click>

`2147483647`, the largest number that can be stored in a `32-bit` signed integer 🤓

</div>

<BarBottom title="stackoverflow.com/questions/491052/minimum-and-maximum-value-of-z-index/25461690">
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
layout: image-right
image: /images/toplayer.png
---

# The `#top-layer` is above everything else, it has its own layer above the main document 

<BarBottom title="drafts.csswg.org./css-position-4/#top-layer">
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

<BrowserStackVisualization />

<style>
.slidev-layout{
padding: 0px;
}
</style>

---

# FILO stacking
First In, Last Out

<div class="stack-container">
    <div class="item item1">First</div>
    <div class="item item2">Second</div>
    <div class="item item3">Third</div>
</div>

<div class="info">
    <p><strong>Push Order:</strong> First → Second → Third</p>
    <p><strong>Pop Order:</strong> Third → Second → First</p>
    <p style="margin-top: 10px;">The first item added is the last to be removed!</p>
</div>

<style>

h1 {
    color: #white;
    margin-bottom: 10px;
    font-size: 2em;
}

.subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1em;
}

.stack-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 30px;
    border: 3px solid #white;
    border-top: none;
    border-radius: 0 0 10px 10px;
    background: rgba(0, 0, 0, 0.79);
}

.stack-label {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #666;
    font-weight: bold;
}

.item {
    position: absolute;
    width: 180px;
    height: 50px;
    left: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: bold;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
}

.item1 {
    animation: pushItem1 8s infinite;
}

.item2 {
    animation: pushItem2 8s infinite;
}

.item3 {
    animation: pushItem3 8s infinite;
}

@keyframes pushItem1 {
    0%, 10% {
        opacity: 0;
        bottom: 300px;
    }
    15%, 50% {
        opacity: 1;
        bottom: 10px;
    }
    55%, 100% {
        opacity: 0;
        bottom: 300px;
    }
}

@keyframes pushItem2 {
    0%, 20% {
        opacity: 0;
        bottom: 300px;
    }
    25%, 45% {
        opacity: 1;
        bottom: 70px;
    }
    50%, 100% {
        opacity: 0;
        bottom: 300px;
    }
}

@keyframes pushItem3 {
    0%, 30% {
        opacity: 0;
        bottom: 300px;
    }
    35%, 40% {
        opacity: 1;
        bottom: 130px;
    }
    45%, 100% {
        opacity: 0;
        bottom: 300px;
    }
}

.phase-indicator {
    font-size: 1.2em;
    color: #white;
    margin-top: 20px;
    height: 30px;
}

.phase {
    opacity: 0;
    animation: phaseShow 8s infinite;
}

.phase.push {
    animation-delay: 0s;
}

.phase.pop {
    animation-delay: 3.5s;
}

@keyframes phaseShow {
    0%, 35% {
        opacity: 1;
    }
    40%, 100% {
        opacity: 0;
    }
}

.arrow {
    font-size: 2em;
    color: #667eea;
    animation: bounce 1s infinite;
    display: inline-block;
    margin: 0 10px;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.info {
    max-width: 400px;
    margin: 0 auto;
    padding: 15px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 10px;
    color: #white;
}

.info h3 {
    margin-bottom: 10px;
    color: #667eea;
}
</style>

---
layout: center
---

# <span v-mark.underline>`<dialog>`</span> vs `[popover]`

<style>
.slidev-layout{
width: 700px;
margin: auto;
text-align: center;
}
</style>

---
layout: two-cols
---

# What a `<dialog>` is

::right::

# An additional window that (temporarily) overlaps the main content of a web page

<BarBottom title="developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog">
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
layout: center
---

# Dialogs
<br>

Typically contain:
- Information
- Task
- Action

---

# `<dialog>`

## `show()` vs `showModal()`

<br>

```js
// Opens the dialog as a non-modal
Element.show(); 
```

```js
// Opens the dialog as a modal
Element.showModal(); 
```

<style>
code {
  font-size: 1.4rem;
}
</style>

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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

# 

```html
<!-- dialog element -->
<dialog>
  ...
</dialog>
```

<br>

- `role="dialog"` is added automatically
- Option to show as modal or non-modal
- <kbd>Esc</kbd> to close when opened as modal
- Focus is trapped when opened as modal

<style>
code {
  font-size: 1.4rem;
}
</style>

<BarBottom title="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog/">
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

# modal vs non-modal

<DialogDemo />

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
layout: image-left
image: /images/itsatrap.png
backgroundSize: contain
---

# Keyboard focus trap

Sometimes you want to prevent keyboard focus from leaving a component, like a modal dialog.

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
p {
  font-size: 140%;
  line-height: 1.2;
}
</style>


---
layout: image-left
image: /images/toplayer.png
---

# backdrop

Some component have a backdrop.

**Toplayer** elements have a built-in styleable pseudo-element `::backdrop`

<BarBottom title="https://drafts.csswg.org/css-position-4/#selectordef-backdrop">
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
p {
  font-size: 140%;
  line-height: 1.2;
}
</style>

---
layout: center
---

# `<dialog>` vs <span v-mark.underline>`[popover]`</span>

<style>
.slidev-layout{
width: 700px;
margin: auto;
text-align: center;
}
</style>

---
layout: two-cols
---

# What a `[popover]` is

::right::

# A floating overlay that provides information or actions when triggered, appearing above the main content without blocking the user's workflow.

<br>

<v-click>

## "a popover 'pops'" - Tim Damen

</v-click>

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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

# `[popover]`

## HTML attribute that can be applied to any element, it ads a set of behaviors to the element

```html
<div popover>...</div>
```

```html
<dialog popover>...</dialog>
```

<v-click>

Popover does not add a `role`. It addepts the role of the element it is applied to.

</v-click>

<v-click>

Depending on the popover type (default is `popover="auto"` ), it will add:

- light dismiss
- keyboard behavior (<kbd>Esc</kbd> to close)
- added to toplayer
- Closes other popovers when opened
    - (Usaually) displayed one at a time
    - (Usaually) displayed on hover or click

</v-click>

<style>
code {
  font-size: 1.4rem;
}
</style>

---

# `[popover]` implementation
Requires no JavaScript, just HTML

```html
<button>
  Toggle popover
</button>

<div>
  ...
</div>
```

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
code {
  font-size: 1.4rem;
}
</style>

---

# `[popover]` implementation
Requires no JavaScript, just HTML

```html
<button popovertarget="x" popovertargetaction="show"> 
  Open popover
</button>

<div popover id="x">
  ...
</div>
```

<button popovertarget="x" popovertargetaction="show" style="color:black; padding: 2px; background-color: #f0f0f0; margin-right: 25px;"> 
  Open popover
</button>

<div popover id="x">
  Lorem Ipsum is simply dummy text of the printing and <a href="#">typesetting industry</a>.
</div>

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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
code {
  font-size: 1.2rem;
}

#x {
   font-size: 1.8rem;
   max-width: 300px;
   background-color: #f0f0f0;
   color: black;
}
</style>

---

# `[popover]` implementation
Requires no JavaScript, just HTML

```html
<button popovertarget="x" popovertargetaction="show"> 
  Open popover
</button>

<!-- Or open with Javascript -->
<button onclick="document.getElementById('x').showPopover()"> 
  element.showPopover();
</button>

<div popover id="x">
  ...
</div>
```

<button popovertarget="y" popovertargetaction="show" style="color:black; padding: 2px; background-color: #f0f0f0; margin-right: 25px;"> 
  Open popover
</button>

<!-- Or open with Javascript -->
<button onclick="document.getElementById('y').showPopover()" style="color:black; padding: 2px; background-color: #f0f0f0;"> 
  element.showPopover();
</button>

<div popover id="y">
  Lorem Ipsum is simply dummy text of the <a href="#">printing</a> and typesetting industry.
</div>

<style>
code {
  font-size: 1.2rem;
}
#y {
   font-size: 1.8rem;
   max-width: 300px;
   background-color: #f0f0f0;
   color: black;
}
</style>

---
layout: image
image: /images/margin-auto-popover.webp
---

---

# `[popover]` still has some positioning flaws
 
<br>

## But there is hope! You have got two options:

- Use a JS library for positioning like `floating-ui`
- Use CSS anchor()

<v-click>
CSS anchor() is not supported by all browsers yet 😒
</v-click>

<BarBottom title="Diving into the Toplayer; Where Dialogs, Popovers, and Modals Live">
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

<iframe height="500" style="width: 100%;" scrolling="no" title="position-try with flip keyword" src="https://codepen.io/una/embed/QWPvGRZ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
</iframe>

---

# "auto" and "auto"

<PopoverDemoHint />

---

# "auto" and "manual"

<PopoverDemoHintm />

---

<ToastDemo />

---

# `<dialog>` vs `[popover]` vs modals

| `<dialog>`s <br> <small><i>`<dialog>` with `show()`</i></small>    | `[popover]`s | **modals** <br> <small><i>`<dialog>` with `showModal()`</i></small>   |
| ----------- | ----------- |--------
| Explicit dismiss      | Light dismiss    | Explicit dismiss |
| `z-index`   | `#top-layer`        | `#top-layer` |
| `❌`   | `::backdrop` ⁈       | `::backdrop` |
| `❌`   | Keyboard assistance        | Keyboard assistance && <br> focus trap |


<style>
 
table {
  border-collapse: collapse;
  width: 100%;
  margin: 2rem 0;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

th, td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

th {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

td {
  color: rgba(255, 255, 255, 0.9);
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  border: 3px solid white;
}

td:nth-child(1) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

td:nth-child(2) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

---

<ToplayerTimeline />

<style>
.slidev-page {
  overflow-y: auto !important;
}

.slidev-layout {
  padding: 0px;
}
</style>

---
layout: center
---

# Thank you! 🙏

Let's stay in touch!

<div class="flex justify-start gap-4 mt-10">
<img src="/images/LQR.png" alt="linkedIn QR" class="size-50 align-right" />
</div>

<BarBottom title=" ">
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
