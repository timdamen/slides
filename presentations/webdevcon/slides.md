---
theme: apple-basic
addons:
  - '@supaslidev/shared'
background: https://cover.sli.dev
title: Keyboard accessibility & focus
info: |
  ## Keyboard Accessibility & Focus
  A presentation about keyboard accessibility and focus management for web interfaces.
class: text-center
drawings:
  persist: false
transition: fade-out
mdc: true
---

<div class="mt-20"></div>

# Keyboard accessibility & <span>:focus</span>

<p>
<br>
Tim Damen<br>
WebDevCon 2025<br>
21-03-2025
</p>

<div class="z-5 shapes absolute -left-4 top-[450px] z-10 hidden w-2/5 max-w-96 text-gray-900 transition-colors ease-in dark:text-gray-100 xl:flex lg:w-3/12 xl:top-[400px] xl:w-1/5" aria-hidden="true"><svg class="transition-transform ease-in hover:-translate-x-1 hover:text-primary-600 dark:hover:text-primary-400" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="currentColor"></circle></svg><svg class="transition-transform ease-in hover:-rotate-3 hover:text-primary-600 dark:hover:text-primary-400" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="currentColor"></rect></svg><svg class="-ml-2.5 transition-transform ease-in hover:-rotate-3 hover:text-primary-600 dark:hover:text-primary-400" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 100,100 10,100" fill="currentColor"></polygon></svg></div>

<style>
span {
  border: 5px dotted white;
  padding: 0px 10px;
}
h1 {
  font-size: 3.55rem;
  line-height: 3.75rem;
  margin-bottom: 1.6rem
}
h2 {
  font-size: 2.1rem;
  line-height: 2.2rem;
}
p {
  font-size: 1.75rem;
  line-height: 2rem;
}
</style>

<!--
Who would do something without seeing what you were doing?

That's what we are going to discuss today.
-->

---

# Keyboard accessibility & <span>:focus</span>

- People using the web with a keyboard
- Shortcuts
- Interactive elements
- Focus rings
- Focus traps
- Tabindex (bonus?)

<BarBottom title="keyboard accessibility & focus">
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
image: /images/moter-imp.jpg
---

# A lot of people use keyboards to navigate websites and apps.

- Motor disabilities
- Vision issues–including blindness
- With a broken hand
- While quickly filling out a form <v-click><span class="text-3xl">🙋🙋‍♀️🙋‍♂️</span></v-click>

<BarBottom title="keyboard accessibility & focus">
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
image: /images/Tim-2.jpeg
---

# Tim Damen

<br>
<span class="text-2xl">🧑‍💻</span> Front-end Developer @ ABN ARMO 

<span class="text-2xl">♿️</span> Accessibility Lead & Advocate

<span class="text-2xl">🎙️</span> Podcaster @ focustrap

<span class="text-2xl">🌸</span> Husband and proud father of a daughter

<span class="text-2xl">🏔️</span> Passionate about sports and outdoor adventures 

<BarBottom title="keyboard accessibility & focus">
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

# Ensure everything that can be done with a mouse, can be done with a keyboard

(also other devices that present as keyboard)

<style>
.slidev-layout{
width: 800px;
margin: auto;
text-align: center;
}
</style>

---

# People who don't use a mouse, use focus styles to see where they are

Lorem Ipsum is simply dummy text of the printing and typesetting industry. [Lorem Ipsum](#) has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
<button>Submit</button>

<style>
.slidev-layout{
width: 800px;
margin: auto;
}

button {
  all: revert;
  display: block;
  background-color: black;
  color: white;
  margin-top:10px;
}

button {
    background-color: darkblue ;
  color: white;
border-style: solid;
border-color: orange;
  font-size: 120%;
  margin: 0.4rem;
}

input[type="checkbox"] {
  border: 3px solid white;
}

button:focus {
  outline: webkit-focus-ring-color auto 5px;
  outline-offset: 5px;
}

p {
  margin-top: 50px;
  max-width: 28rem;
}
</style>

<BarBottom title="keyboard accessibility & focus">
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

# Ask your self: is the tab order sensible?

(not to many tab stops)

<style>
.slidev-layout{
width: 800px;
margin: auto;
text-align: center;
}
</style>

---
layout: image
image: /images/sidewalk.jpg
---
<BarBottom title="keyboard accessibility & focus" class="bg-black">
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
layout: image
image: /images/remote.jpg
---
<BarBottom title="keyboard accessibility & focus" class="bg-black">
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

#  Never remove or hide the <span>focus ring!</span>

<style>
span {
  border: 5px double white;
  padding: 0px 10px;
}
.slidev-layout{
width: 800px;
margin: auto;
}
</style>

---
layout: image
image: /images/steal-cursor.png
---
<BarBottom title="Laura Carvajal on stage at Fronteers conference 2018." class="bg-black">
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
level: 2
---

# Basic keyboard navigation

How to navigate a website with the keyboard, [keyboard navigation](https://accessibleweb.com/question-answer/navigate-website-keyboard/)

|               **Keyboard**                                    |      **Action**                      |
| --------------------------------------------------- | --------------------------- |
| <kbd>Tab</kbd>                  | move to next interactive element     |
| <kbd>Shift</kbd>  + <kbd>Tab</kbd> | move to previous interactive element |
| <kbd>Return</kbd>/<kbd>Enter</kbd>                                       | activate elements (links, buttons, etc)              |
| <kbd>Spacebar</kbd>                                     | activates buttons, checkbox, selectbox (such as to pause/play videos, submit forms, etc)            |
| <kbd>Esc</kbd>                                     | close opened content (modals, navigation menus, etc) or cancel current action                  |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd>                                     | navigate within widgets (tablists, checkboxes within a disclosure button, etc) and navigate around a page                  |

<BarBottom title="keyboard accessibility & focus">
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

# Good focus styles

- Visible
- 3:1 contrast <span v-mark.underline>against adjacent colors</span>
- Consistent

<BarBottom title="keyboard accessibility & focus">
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
layout: two-cols
layoutClass: gap-16
---

# Oreo focus style

   <p class="white">
    This is a dark text on a white background. It contains <a href="#">a link on a white background</a> and serves as an excellent example.
    </p>

  <p class="gray">
      This is a dark text on a gray background. It contains <a href="#">a link on a gray background</a> and serves as an excellent example.
  </p>

  <p class="black">
      This is a light text on a black background. It contains <a href="#">a link on a black background</a> and serves as an excellent example.
  </p>

::right::

<div class="mt-50" ></div>

```css
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
```


<style>
  :focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}

p {
  padding: 1rem;
  max-width: 20rem;
}

.white {
  background-color: white;
  color: black;
}

.gray {
  background-color: #757575;
}

.black {
  color: white;
  background-color: black;
}
.black a {
  color: #aaa;
}
</style>

<BarBottom title="https://www.erikkroes.nl/blog/the-universal-focus-state/">
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

# Only one thing on a given page can have <span>focus</span> at a time


<style>
.slidev-layout{
width: 750px;
margin: auto;
text-align: center;
}

span {
  border: 5px ridge white;
  padding: 0px 5px;
  line-height: 2;
}
</style>

---
layout: center
---

# Interactive elements


`<button>`,`<a href>`,`<input>`,`<details>`,`<select>`


<BarBottom title="keyboard accessibility & focus">
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

# Let's try!

<br>

## `<button>` and `<a href>`
<button class="mr-4">button</button> [link](#)

## Color `<input type="color">`
<input type="color" value="#fd00ff">

<div class="mt-10"></div>

## `<radio>` and `<checkbox>`
<div class="bg-white text-black">
<fieldset>
  <legend>Do you like coffee?</legend>
  <div class="radio">
    <input type="radio" name="coffee" id="no" value="no"/>
    <label for="no">Nope</label>
    <input type="radio" name="coffee" id="yes" value="yes"/>
    <label for="yes">Yes</label>
    <input type="radio" name="coffee" id="love" value="love" />
    <label for="love">No, I LOVE it!</label>
  </div>
</fieldset>

<fieldset>
  <legend>Please send me</legend>
  <div class="checkbox">
    <input type="checkbox" name="snacks" id="snacks-pizza" value="pizza">
    <label for="snacks-pizza">Pizza</label>
    <input type="checkbox" name="snacks" id="snacks-cake" value="cake">
    <label for="snacks-cake">Cake</label>
    <input type="checkbox" name="snacks" id="snacks-ice-cream" value="ice-cream">
    <label for="snacks-ice-cream">Ice Cream</label>
  </div>
</fieldset>
</div>

<style>
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
button, select, a, label, fieldset, legend, input {
  all: revert;
}

button, input[type="color"] {
  margin-right: 1rem;
    background-color: black;
  color: white;
}

button {
    background-color: darkblue ;
  color: white;
border-style: solid;
border-color: orange;
  font-size: 120%;
  margin: 0.4rem;
}

a:active {
  color: red;
}
button:active {
  background-color: red;
}
</style>

---
layout: center
---

# Debugging focused element

```js
document.addEventListener('focus', function() {
  console.log('focused: ', document.activeElement)
}, true);
```

<BarBottom title="keyboard accessibility & focus">
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

# Focus with JavaScript

```js
element.focus()
```

<BarBottom title="keyboard accessibility & focus">
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

# When do we need to trap focus?

- Within a modal window
- Within modal navigation
- In a full screen alert

<BarBottom title="keyboard accessibility & focus">
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
image: /images/focustrapp.png
backgroundSize: contain
---

# How to trap focus within an element

```js
modal.show();
modal.trapFocus();
```

```html
<div 
  id="dialog" role="dialog" 
  tabindex="-1" hidden 
  aria-labelledby="dialog-title"
>
  <form class="dialog-content">
    <h1 id="dialog-title">Name Entry</h1>

    <label for="within-dialog">Name</label> 
    <input id="within-dialog">

    <button type="button" id="close-dialog">Close</button>
    <button type="submit" id="save-dialog">Save</button>
  </form>
</div>
```

<BarBottom title="https://hidde.blog/using-javascript-to-trap-focus-in-an-element/">
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

# How to trap focus within an element (2)

```js
// method of the HTMLDialogElement 
modal.showModal();
```

---

# Demo `modal.show()` vs `modal.showModal()`
- The modal should trap focus
- First focusable element should be focused
- Close with <kbd>Esc</kbd>
- When the modal is closed, focus should return to the element that opened the modal

<dialog id="modal1">
  <h1>Welcome!</h1>
  <p>Click Close or press esc to close modal</p>
  <form method="dialog" class="text-end">
    <button class="btn btn-primary mr-2">Submit</button>
    <button class="btn btn-primary">Close</button>
  </form>
</dialog>

<dialog id="modal2">
  <h1>Welcome!</h1>
  <p>Click Close or press esc to close modal</p>
  <form method="dialog" class="text-end">
    <button class="btn btn-primary mr-2">Submit</button>
    <button class="btn btn-primary">Close</button>
  </form>
</dialog>

<button onclick="modal1.show()" class="btn btn-primary">show()</button>
<button onclick="modal2.showModal()" class="btn btn-primary">ShowModal()</button>

<BarBottom title="keyboard accessibility & focus">
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
  dialog {
    all: revert;
  }
  button {
    all: revert;
    margin-right: 5px;
      background-color: black;
  color: white;
  }
  button, input[type="color"] {
    background-color: darkblue ;
  color: white;
border-style: solid;
border-color: orange;
  font-size: 120%;
  margin: 0.4rem;
}
  :focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
</style>

---
layout: center
---

# HTML (`tabindex`) allows us to customise focus order
use this feature with caution!


<style>
.slidev-layout{
width: 800px;
margin: auto;
text-align: center;
}
</style>

---
layout: two-cols
layoutClass: gap-1
---

# What is the `tabindex` attribute?

<p>The <code>tabindex</code> attribute specifies the tab order of an element. It can have three different types of values:</p>

<dl>
  <dt><code>tabindex="0"</code></dt>
  <!-- <dd>Makes an element focusable via keyboard in the natural document order</dd> -->
  <dt class="font-semibold mt-4"><code>tabindex="-1"</code></dt>
  <!-- <dd>Makes an element programmatically focusable, but not via keyboard navigation</dd> -->
  <dt class="font-semibold mt-4"><code>tabindex="1+"</code> (positive values)</dt>
  <!-- <dd>Defines an explicit tab order (generally not recommended)</dd> -->
</dl>

<BarBottom title="keyboard accessibility & focus">
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

# Natural Tab Order

<div class="demo-box">
  <p>These elements are in their natural tab order (no <code>tabindex</code>):</p>
  <div class="container">
      <button>First Button</button>
      <a href="#">Link</a>
      <button>Second Button</button>
      <input type="text">
      <button>Third Button</button>
  </div>  
  <div class="tips positive">
      <p class="text-sm">Whenever possible, structure your HTML so that the natural tab order matches the logical reading order. This is the most accessible approach.</p>
  </div>
</div>

<style>
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
button, select, a, label, fieldset, legend, input {
  all: revert;
  margin-right: 1rem;
}

a {
color: white;
}

button, input[type="color"] {
  margin-right: 1rem;
    background-color: darkblue ;
  color: white;
}

a:active {
  color: red;
}
button:active {
  background-color: red;
}
</style>

<BarBottom title="keyboard accessibility & focus">
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

## Making Non-Interactive Elements Focusable
<div class="demo-box">
  <p>Regular divs are not focusable by default, but <code>tabindex="0"</code> makes them part of the tab sequence:</p>
    
  <div class="element border-2 border-red600 p1" tabindex="0">This div has <code>tabindex="0"</code> - It is now keyboard focusable</div>
  <div class="element border-2 border-green600 mt-2 p1" tabindex="0">Another div with <code>tabindex="0"</code></div>

  <button>Regular button (naturally focusable)</button>
</div>

<style>
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
button, select, a, label, fieldset, legend, input {
  all: revert;
  margin-right: 1rem;
}

button, input[type="color"] {
  margin-right: 1rem;
    background-color: darkblue ;
  color: white;
}

a:active {
  color: red;
}
button:active {
  background-color: red;
}
</style>

<BarBottom title="keyboard accessibility & focus">
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

## Programmatic Focus with <code>tabindex="-1"</code>
<div class="demo-box">
  <p>Elements with <code>tabindex="-1"</code> can receive focus programmatically but are not in the tab order:</p>
    <a href="#">Link</a>
  <div class="element border-2 border-red600 p1" tabindex="-1">This div has <code>tabindex="-1"</code> - Not in tab order</div>
  <button onclick="document.querySelector('[tabindex=\'-1\']').focus()">Click to focus the element above</button>
<br>
<br>

Focus with with javascript
  ```js
element.focus()
```
<v-click>
  
  `tabindex="-1"` is useful for:
  <ul>
      <li>Custom widgets where you manage focus manually</li>
      <li>Off-screen content that needs to be focused programmatically</li>
      <li>Managing focus for elements that should only be focused under specific conditions</li>
  </ul>
</v-click>
</div>

<style>
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
button, select, a, label, fieldset, legend, input {
  all: revert;
  margin-right: 1rem;
}

button, input[type="color"] {
  margin-right: 1rem;
    background-color: darkblue ;
  color: white;
}

a {
color: white;
}

a:active {
  color: red;
}
button:active {
  background-color: red;
}
</style>

<BarBottom title="keyboard accessibility & focus">
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

## Positive Tabindex Values (Not Recommended)
<div class="demo-box">
    <p>Positive tabindex values create a custom tab order that overrides the document structure:</p>
    
  <div class="container">
    <button tabindex="3">Button with tabindex="3" (third)</button>
    <button tabindex="1">Button with tabindex="1" (first)</button>
    <button tabindex="2">Button with tabindex="2" (second)</button>
    <button>Button with no tabindex (fourth)</button>
  </div>
    
<v-click>
  <div class="tips negative mt-10">
      <h2>❌ Not Recommended</h2>
      <p>Using positive tabindex values is generally discouraged because:</p>
      <ul>
          <li>It creates a disconnect between visual and keyboard navigation orders</li>
          <li>It's difficult to maintain as your HTML changes</li>
          <li>It can create a confusing experience for keyboard and screen reader users</li>
          <li>It can lead to "tab traps" where users get stuck in a section</li>
      </ul>
  </div>
</v-click>
</div>

<style>
:focus {
  box-shadow: 0 0 0 .25rem white;
  outline: .375rem double black;
  border-radius: .125rem;
}
button, select, a, label, fieldset, legend, input {
  all: revert;
  margin-right: 1rem;
}

button, input[type="color"] {
    background-color: darkblue ;
  color: white;
border-style: solid;
border-color: orange;
  font-size: 120%;
  margin: 0.4rem;
}

a:active {
  color: red;
}
button:active {
  background-color: red;
}
</style>

<BarBottom title="keyboard accessibility & focus">
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

# Summary

- People using the web with a keyboard
- Shortcuts
- Interactive elements
- Focus rings
- Focus traps
- Tabindex

<BarBottom title="keyboard accessibility & focus">
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

# Accessible banking meetup 🏦

- Two speakers
- Panel discussion with 6 experts
- Free food and drinks
- March 27th, 2025 at ABN ARMO HQ in Amsterdam

<div class="flex justify-center gap-4 mt-5">
<img src="/images/qr-meetup.png" alt="accessible banking meetup qr code" class="ml-10 size-50" />
<img src="/images/meetup.png" alt="accessible banking meetup thumbnail" class="ml-10 max-w-[500px]" />
</div>

<BarBottom title="keyboard accessibility & focus">
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

# focustrap podcast

I'm hosting a podcast called "focustrap" where we discuss all things digital accessibility.

Check it out! [focustrap](https://focusring.io/podcast-focustrap) ❤️

<div class="flex justify-center gap-4 mt-10">
 <img src="/images/qr.png" alt="focustrap qr code" class="ml-10 size-50" />
  <img src="/images/latest-focustrap.png" alt="focustrap qr code" class="ml-10 max-w-[500px]" />
 
</div>

<BarBottom title="keyboard accessibility & focus">
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

# Thank you! 🙏

Let's stay in touch!

slides: [webdevcon25.timdamen.io](https://webdevcon25.timdamen.io)

<BarBottom title="webdevcon25.timdamen.io">
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
