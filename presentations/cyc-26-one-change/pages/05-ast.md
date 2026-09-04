---
hide: true
---

# What our migrations actually do

<p class="beat-sub">159 migration files, counted by what they change. A file can appear in more than one row.</p>

<div class="census-bars">

<div class="bar-row"><span class="bar-l">bump dependencies in package.json</span><span class="bar" style="--w:69"></span><span class="bar-n">69</span></div>
<div class="bar-row"><span class="bar-l">find and replace in text</span><span class="bar" style="--w:48"></span><span class="bar-n">48</span></div>
<div class="bar-row"><span class="bar-l">edit other JSON config</span><span class="bar" style="--w:40"></span><span class="bar-n">40</span></div>
<div class="bar-row"><span class="bar-l">add or overwrite a file</span><span class="bar" style="--w:25"></span><span class="bar-n">25</span></div>
<div class="bar-row hot"><span class="bar-l">parse the source code (AST)</span><span class="bar" style="--w:11"></span><span class="bar-n">11</span></div>

</div>

---

# Abstract Syntax Tree

<div class="astex">

<div class="astdef">
  <p v-click="1">An Abstract Syntax Tree (AST) represents the structure of code.</p>
  <p v-click="2">ASTs facilitate the analysis and transformation of source code.</p>
  <p v-click="3">Each node in an AST corresponds to a construct occurring in the source code.</p>
</div>

<figure class="astshot">
  <img src="/images/ast.png" alt="The line var AST = &quot;is Tree&quot;; with each part labelled — Keyword, Identifier, Equal, String, Semicolon — beside the JSON the parser returns: a Program containing a VariableDeclaration of kind var, whose declarations hold a VariableDeclarator with an id of type Identifier named AST and an init of type Literal with the value is tree.">
</figure>

</div>

---

# The same line, parsed

<AstInspector source='var AST = "is Tree";' initial-path="Literal" />

---
hide: true
---

# A node is a label and two numbers

<AstInspector initial-path="VariableDeclarator" />

---
hide: true
---
# The accessibility tree in DevTools

<div class="two-col akin">

  <figure class="akin-shot">
    <img src="/images/a11y-tree-chrome-devtools.png" alt="The Accessibility panel in Chrome DevTools. A tree of nodes — link &quot;Chrome DevTools&quot; focusable: true, link &quot;Extensions&quot;, generic, contentinfo — with many rows marked Ignored. A Computed Properties pane lists Name, Role: link and Focusable: true for the selected node.">
    <figcaption>Chrome DevTools &middot; accessibility tree</figcaption>
  </figure>

  <ul class="akin-map">
    <li v-click="1"><span class="akin-k">derived</span><span class="akin-v">The browser builds it from the HTML on the page.</span></li>
    <li v-click="2"><span class="akin-k">abstract</span><span class="akin-v">Class names, wrapper divs and formatting are not in it. It keeps what it needs.</span></li>
    <li v-click="3"><span class="akin-k">one label per node</span><span class="akin-v"><code>link</code>, <code>button</code>, <code>heading</code></span></li>
    <li v-click="4"><span class="akin-k">you can query it</span><span class="akin-v">axe walks this tree. The CI check from earlier in the talk is a tree search.</span></li>
  </ul>

</div>

<p v-click="5" class="punch punch-tight">A parser does the same thing for JavaScript instead of HTML.</p>

---
hide: true
---
# The accessibility tree in DevTools

<div class="two-col akin">

  <figure class="akin-shot">
    <img src="/images/a11y-tree-chrome-devtools.png" alt="The Accessibility panel in Chrome DevTools. A tree of nodes — link &quot;Chrome DevTools&quot; focusable: true, link &quot;Extensions&quot;, generic, contentinfo — with many rows marked Ignored. A Computed Properties pane lists Name, Role: link and Focusable: true for the selected node.">
    <figcaption>Chrome DevTools &middot; accessibility tree</figcaption>
  </figure>

  <ul class="akin-map">
    <li v-click="1"><span class="akin-k">derived</span><span class="akin-v">The browser builds it from the HTML on the page.</span></li>
    <li v-click="2"><span class="akin-k">abstract</span><span class="akin-v">Class names, wrapper divs and formatting are not in it. It keeps what it needs.</span></li>
    <li v-click="3"><span class="akin-k">one label per node</span><span class="akin-v"><code>link</code>, <code>button</code>, <code>heading</code></span></li>
    <li v-click="4"><span class="akin-k">you can query it</span><span class="akin-v">axe walks this tree. The CI check from earlier in the talk is a tree search.</span></li>
  </ul>

</div>

<p v-click="5" class="punch punch-tight">A parser does the same thing for JavaScript instead of HTML.</p>

---

# Example one · the goal

<div class="ex-header">
  <span class="ex-tag">TypeScript compiler API</span>
  <span class="ex-goal">one file per app · ~300 apps</span>
</div>

<div class="goal">
<v-clicks>

<p class="goal-now">Every app started out as this:<br><code>const routes = [ … ] as RouteRecordRaw[]</code></p>

<p class="goal-want">The router's next major only type-checks the other form:<br><code>const routes: RouteRecordRaw[] = [ … ]</code></p>

</v-clicks>
</div>

---

# What we are dealing with

<p class="beat-sub">The <span class="accent">four shapes</span> a routes file actually takes across the estate.</p>

<FindDemo phase="plain" filename="src/router/routes.ts" />

<!--
⏱ 16:40 — Beat 2 of 4: the starting point.

Now, this is the part is an important part when writing codemods! They are deterministic and they should work as expected. That is why we research always very well before we start to create a codemod.

CURRENT + FUTURE

What we found is that:

[tab 1] Most of them look like this. The tidy one.

[tab 2] Some teams have a square bracket inside a page title. A string, with a bracket in it.

[tab 3] Some have a bracket inside a comment.

[tab 4] And a few don't declare the routes in this file at all — they import them from somewhere else.
-->

---

# The migration

```ts {all|2-4|6-7|8-11|13-17}
export default function updateRoutesTyping(tree: Tree) {
  const path = 'src/router/routes.ts'
  const src = tree.read(path, 'utf-8')
  if (!src) return logger.warn(`${path} not found, nothing to change`)
  
  // 1. PARSE
  const sf = ts.createSourceFile(path, src, ts.ScriptTarget.Latest, true)
  // 2. FIND
  const decl = findNodes(sf, ts.SyntaxKind.VariableDeclaration)
    .find((n) => n.name.getText() === 'routes') 
  if (!decl) return logger.warn(`no routes declaration in ${path}, skipped`)

  // 3. EDIT
  tree.write(path, applyChangesToString(src, [ 
    { type: ChangeType.Insert, index: decl.name.getEnd(), text: ': RouteRecordRaw[]' },
    { type: ChangeType.Delete, index: decl.initializer.getEnd(), length: 20 },
  ]))
}
```

<!--
⏱ 17:30 — Beat 3 of 4: THE CODE.

Part of the code of the codemod.

[click] Read the file off the filesystem. If it isn't there, one line of warning and we stop.

[click] 1. PARSE. the code turns into the AST.

[click] 2. FIND. Give me every variable declaration, than hand me the one called routes. And if there isn't one, same thing — say so, change nothing. Three hundred repositories: the ones that don't match have to survive the run untouched.

[click] 3. EDIT. Two changes, each at an offset the node gave me. 

1. Insert the where the name ends
2. Delete the where the array ends: twenty characters, which is exactly " as RouteRecordRaw[]"
-->

---

# The result

<FindDemo phase="outcome" />

<!--
⏱ 18:30 — Beat 4 of 4: the result. Seventy seconds.

The four shapes from the census, run through the code you just read.

Clean file: four changed lines. The annotation is in, the assertion is gone, and the route count before and after is identical. That was the goal — without touching a single route — and you can see it is measurably true.

[click "] in a string"] The file where somebody put a square bracket in a page title. Still four lines, same result. A string is a node, and what is inside it is not syntax, so it simply never came up.

[click "] in a comment"] Same again.

[click "imported routes"] And this one, where the routes are imported from somewhere else. Zero changes — and it tells you why: there is no declarator called routes in this file, so it will not guess.

I want to be clear that the last one is not a failure. It is the most important row on this slide. Three hundred repositories means there is always a shape you did not think of, and the only safe behaviour when you meet one is to stop and say so.

Four shapes. One question asked of all of them. Nothing changed that should not have.

And the number along the bottom is the goal, measured: nine routes across these four files, zero of them rewritten. "Without touching a single route" isn't a promise on this slide — it's a count.
-->

---
layout: center
hide: true
---

<p class="mega">Ask the tree a question.</p>
<p class="mega accent">Edit at the answer.</p>

---
layout: center
hide: true
---

<p class="mega">Ask the tree a question.</p>
<p class="mega accent">Edit at the answer.</p>

---
hide: true
---

# What we are dealing with

<p class="beat-sub">The <span class="accent">five shapes</span> a heading takes across the organisation.</p>

<ReachDemo phase="plain" />

---
hide: true
---

# The migration

```ts {all|2-4|6|7-11|14}
export default function addTagClasses(tree: Tree, path: string) {
  const src = tree.read(path, 'utf-8')
  const { descriptor } = parse(src)
  if (!descriptor.template) return logger.warn(`${path} has no template, skipped`)

  const edits: StringChange[] = []
  walkElements(descriptor.template.ast, (el) => {
    if (!TARGET_TAGS.has(el.tag)) return
    const cls = el.props.find((p) => p.name === 'class')
    if (hasExactClass(cls, el.tag)) return
    edits.push(insertClass(el, cls))
  })

  tree.write(path, applyChangesToString(src, edits))
}
```

---
hide: true
---

# The result

<ReachDemo phase="outcome" />

---
hide: true
---

# Example three · the goal

<div class="ex-header">
  <span class="ex-tag">TypeScript compiler API</span>
  <span class="ex-goal">one call · one argument · every app</span>
</div>

<div class="goal">
<v-clicks>

<p class="goal-now">Today every app's entry file registers its feature flags like this:<br><code>registerFeatureFlags(app)</code></p>

<p class="goal-want">The flag service now needs its defaults passed in:<br><code>registerFeatureFlags(app, flagDefaults)</code></p>

<p class="goal-line">Add one argument. In every application.<br><span class="accent">And hand back a file its author still recognises.</span></p>

</v-clicks>
</div>

---
hide: true
---

# What we are dealing with

<PrintDemo phase="plain" />

---
hide: true
---

# The migration · two endings

```ts {all|1-4|6-7|9-12}
// identical up to here in both versions
const call = findNodes(sf, ts.SyntaxKind.CallExpression)
  .find((n) => n.expression.getText() === 'registerFeatureFlags')
const arg = call.arguments[0]

// (a) rebuild the file from the tree
tree.write(path, printer.printFile(withNewArgument(sf)))

// (b) edit the text you were handed
tree.write(path, applyChangesToString(src, [
  { type: ChangeType.Insert, index: arg.getEnd(), text: ', flagDefaults' },
]))
```

<p v-click class="punch">Both are correct. <span class="accent">One of them is a different file.</span></p>

---
hide: true
---

# The result

<PrintDemo phase="outcome" />

---
layout: center
hide: true
---

<p class="mega">Parse to <span class="accent">locate.</span></p>
<p class="mega">Splice to <span class="accent">edit.</span></p>

<p class="house-rule" v-click>Our entire shared helper library is 203 lines and never calls a printer.</p>

<p class="house-rule accent" v-click>A six-line diff gets merged. A four-hundred-line diff gets ignored.</p>
