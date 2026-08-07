# Everything so far was JSON

<div class="census-bars">

<div class="bar-row"><span class="bar-l">edit the dependency list</span><span class="bar" style="--w:69"></span><span class="bar-n">69</span></div>
<div class="bar-row"><span class="bar-l">string replace</span><span class="bar" style="--w:48"></span><span class="bar-n">48</span></div>
<div class="bar-row"><span class="bar-l">read and write JSON</span><span class="bar" style="--w:40"></span><span class="bar-n">40</span></div>
<div class="bar-row"><span class="bar-l">copy a template file</span><span class="bar" style="--w:25"></span><span class="bar-n">25</span></div>
<div class="bar-row hot"><span class="bar-l">parse the code</span><span class="bar" style="--w:11"></span><span class="bar-n">11</span></div>

</div>

<p v-click class="punch">Eleven files out of a hundred and fifty-nine. <span class="accent">Seven percent of the work.</span></p>
<p v-click class="punch accent">All of the fear.</p>

<!--
⏱ 14:00 — Act 5. The title act. Land the census as a turn, not an apology.

Before I show you a single parser, here is an honest census of what we actually ship.

Of a hundred and fifty-nine migration files: sixty-nine edit the dependency list. Forty-eight do a string replace. Forty do something to JSON. Twenty-five copy a template in.

[click] Eleven import a parser. Seven percent. Seventeen if you count the ones calling our shared helpers, so call it a tenth either way.

I could have stood here and implied it was most of them. It isn't, and you'd have found out.

[click] But that seven percent is where every genuinely frightening thing lives. Those are the changes that reach into a file with somebody else's name on it.

Seven percent of the work. All of the fear. Here's how you write one.
-->

---
layout: center
---

<div class="ast-words">
  <div v-click class="ast-word"><p class="ast-w accent">Abstract</p><p class="ast-d">Throw away the spelling. Keep the meaning. Whitespace, blank lines, where you put your comments: gone.</p></div>
  <div v-click class="ast-word"><p class="ast-w accent">Syntax</p><p class="ast-d">The grammar of the language. Not letters. The parser already knows it, because your editor uses the same one.</p></div>
  <div v-click class="ast-word"><p class="ast-w accent">Tree</p><p class="ast-d">Things inside things. You already write it: <code>{ a: { b: 1 } }</code> is a tree and you never think about it.</p></div>
</div>

<!--
⏱ 14:35 — Entry level, deliberately. Nobody gets left behind here.

Three words. One at a time, and one of them comes back to bite me later.

[click] Abstract. The parser throws away how the code was written and keeps what it means. Your whitespace, your blank lines, where you put a comment, single or double quotes. All discarded. Abstract in the ordinary English sense: the details are gone.

Remember that word.

[click] Syntax. The grammar of the language rather than the characters. The difference between "this is a function call" and "these are some brackets".

[click] Tree. Things inside things. If you've written a nested object you've written a tree. There is no third concept.
-->

---

# A node is a label and two numbers

<AstInspector initial-path="VariableDeclarator" />

<!--
⏱ 15:20 — THE teaching slide. Eighty seconds, do not rush. Everything after this depends on it.

This is a parser. Left, three lines of a routing file. Right, what the parser handed back.

It is not a diagram. It is the actual object, and every row has a name and two numbers.

[click Identifier routes] I am an Identifier, I start at character six, I end at twelve. And six to twelve is exactly the word routes. Not roughly. Exactly.

[click ArrayExpression] This one is the array.

A node is a label plus two numbers that point back into your text. The tree is an index into your file.

[click into the source] And it goes both ways. Click a character, it finds the smallest node containing it.

So a codemod is three steps. Parse: text becomes this. Find: ask a question about structure, not about text. Edit: take the two numbers and change the original string between them.

Three examples. Same three steps every time.

And if you never write a codemod at all, stop at step two: ask your own repo a question that isn't fooled by the same word appearing in a comment. That's tonight's project.
-->

---

# Example one · the goal

<div class="ex-header">
  <span class="ex-tag">TypeScript compiler API</span>
  <span class="ex-goal">one file per app · ~300 apps</span>
</div>

<div class="goal">
<v-clicks>

<p class="goal-now">Today every app writes its routes like this:<br><code>const routes = [ … ] as RouteRecordRaw[]</code></p>

<p class="goal-want">The router's next major only type-checks the other form:<br><code>const routes: RouteRecordRaw[] = [ … ]</code></p>

<p class="goal-line">Move the type. In every application. <span class="accent">Without touching a single route.</span></p>

</v-clicks>
</div>

<!--
⏱ 16:40 — Beat 1 of 4: WHY. Thirty seconds. State the goal and move on — do not explain the technique here.

First one, and the change is genuinely boring, which is why it's a good first one.

[click] Every application has a routes file, and today it declares the type at the end, as an assertion.

[click] The router's next major stops type-checking that form. It only understands the annotation, before the equals sign. So the same information has to move about twenty characters to the left.

[click] That's the goal. Move the type, in every application, and touch nothing else in the file. Those routes are the app team's. Some of them are four hundred lines long.

So: what are we dealing with?
-->

---

# What we are dealing with

<p class="beat-sub">The <span class="accent">four shapes</span> a routes file actually takes across the estate.</p>

<FindDemo phase="plain" />

<!--
⏱ 17:10 — Beat 2 of 4: the starting point. Fifty seconds. Calm. No comparisons here.
The four tabs are the whole point of this slide — introduce them before you touch anything else.

Now, this is the part people skip, and it's the part that decides whether your migration works.

You do not sit down and imagine what the file looks like. You go and look. We grepped every repository in the estate for this file, and it comes in four shapes. These four. That's not a test suite I invented — it's a census.

[tab 1] Most of them look like this. The tidy one.

[tab 2] Some teams have a square bracket inside a page title. A string, with a bracket in it.

[tab 3] Some have a bracket inside a comment.

[tab 4] And a few don't declare the routes in this file at all — they import them from somewhere else.

There's a comment in the real migration that says, more or less, "from searching through the repositories, these are the shapes". I'd frame that as the actual lesson of this slide: your test fixtures are not hypotheticals. They are inventory.

So — the file, and its tree. Two things to notice. [select the array] The array is a node, with a start and an end. And the name is a node too, ending exactly where the annotation needs to go.

The goal turns into something very concrete: insert at the end of one node, delete at the end of another. And it has to hold for all four shapes.
-->

---

# The migration

```ts {all|2-4|6-9|11-14|9}
export default function updateRoutesTyping(tree: Tree) {
  const path = 'src/router/routes.ts'
  const src = tree.read(path, 'utf-8')
  if (!src) return

  const sf = ts.createSourceFile(path, src, ts.ScriptTarget.Latest, true)
  const decl = findNodes(sf, ts.SyntaxKind.VariableDeclaration)
    .find((n) => n.name.getText() === 'routes')
  if (!decl) return

  tree.write(path, applyChangesToString(src, [
    { type: ChangeType.Insert, index: decl.name.getEnd(), text: ': RouteRecordRaw[]' },
    { type: ChangeType.Delete, index: decl.initializer.getEnd(), length: 20 },
  ]))
}
```

<!--
⏱ 18:00 — Beat 3 of 4: THE CODE. A minute. This is the slide people photograph — slow down and let them read.

That's the whole migration. Fourteen lines, and it runs in three hundred repositories.

[click] Read the file off a virtual filesystem. Not the real disk — an in-memory tree, which is why we can test this without cloning anything.

[click] PARSE, then FIND. One call to create the source file. Then: give me every variable declaration, and hand me the one called routes. That's the structural question. I never search the text.

[click] EDIT. Two changes, each at an offset the node gave me. Insert the annotation where the name ends. Delete the assertion where the array ends. Everything between those two points — every route, every comment, every blank line the team put there — is untouched, because I never rebuilt the file. I changed two spots in it.

[click] And this line is the one I'd argue is the most important in the whole talk. If there is no declarator called routes, we stop. We don't guess, we don't fall back to a regex, we don't do our best. We leave the file exactly as we found it and report that we skipped it.

A tool that can't tell you it failed will eventually fail quietly in a repository you have never opened.
-->

---

# The result

<FindDemo phase="outcome" />

<!--
⏱ 19:00 — Beat 4 of 4: the result. Seventy seconds.

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
---

<p class="mega">Ask the tree a question.</p>
<p class="mega accent">Edit at the answer.</p>

<!--
⏱ 20:10 — Ten seconds. Don't explain it. It's a breath before example two.
-->

---

# Example two · the goal

<div class="ex-header">
  <span class="ex-tag">Vue single-file component compiler</span>
  <span class="ex-goal">thousands of elements · every app</span>
</div>

<div class="goal">
<v-clicks>

<p class="goal-now">The design system's new major styles headings <strong>by class</strong>, not by tag.</p>

<p class="goal-want">So every <code>h1</code>–<code>h4</code>, <code>p</code> and <code>label</code> in every component needs its own tag name as a class:<br><code>&lt;h1 class="h1"&gt;</code></p>

<p class="goal-line">Add one class to specific elements. <span class="accent">Change nothing else in the markup.</span></p>

</v-clicks>
</div>

<!--
⏱ 20:20 — Beat 1 of 4: WHY. Thirty seconds.

Second one, and it's a different language with a different parser.

[click] The design system went to a new major, and the new one styles typography by class instead of by tag. Good decision, by the way — it means a heading can look like a heading without being an h1.

[click] Which means every heading and paragraph in every component needs to carry its own tag name as a class.

[click] That's the goal. Thousands of elements, across every application. Add one class to the elements that need it, and leave the markup otherwise exactly as it was.
-->

---

# What we are dealing with

<p class="beat-sub">The <span class="accent">five shapes</span> a heading takes across the estate.</p>

<ReachDemo phase="plain" />

<!--
⏱ 20:50 — Beat 2 of 4: the starting point. Forty-five seconds. Calm.
Name each tab out loud. These five names come back on the result slide, and if the room hasn't met them here they will not follow the grid.

Same exercise as last time. Before writing anything, go and look at what's actually in the estate. A heading turns up in five shapes.

[substring] This one has a class called my-h1. Contains the letters h-1, is not the class h1.

[multiline] This one's attributes are spread over four lines, because somebody ran a formatter.

[bound class] This one computes its class at runtime. There is no static class attribute to add to.

[nested] Headings inside other elements, plus a comment.

[control] And an ordinary one with none of those problems, which is most of them.

Five shapes. Remember the names — they come back in three slides.

Now the one observation that makes this example work. [select the h1] Look at what an element node is: a tag, a range, and a list of the attributes it owns. The class attribute isn't text sitting near this element. It belongs to it, and it has its own start and end.

So "does this heading already have the class h1" is a lookup on that list. And "where does the class go if it doesn't" is an offset I read off the node.
-->

---

# The migration

```ts {all|2-3|5-6|7-10|12}
export default function addTagClasses(tree: Tree, path: string) {
  const src = tree.read(path, 'utf-8')
  const { descriptor } = parse(src)
  if (!descriptor.template) return

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

<!--
⏱ 21:35 — Beat 3 of 4: THE CODE. Fifty-five seconds.

Same three steps. Different parser.

[click] PARSE. This is the Vue single-file component compiler, and it's already in your node_modules, because it's the thing that compiles your components. You are not adding a dependency to do this.

[click] Collect edits, don't apply them. This matters: if I edited the string as I walked, every edit would shift the offsets of the ones after it. So I gather them all first and apply them in one pass, back to front.

[click] FIND. Walk the elements. Skip anything that isn't a heading or a paragraph. Get the class attribute — as an object, not a substring. And if it already has the exact class, skip it, which is what makes this safe to run twice.

That last line is idempotency, and it's a hard requirement for us: a migration that changes something on the second run will eventually run twice somewhere real.

[click] EDIT. One write, all the offsets at once.
-->

---

# The result

<ReachDemo phase="outcome" />

<!--
⏱ 22:30 — Beat 4 of 4: the result. A minute. Let the grid do the arguing.

The five shapes from two slides ago, run through the code you just read. Every line of this is computed while you watch.

Read the rows out loud, because the names are shorthand and the room will have half-forgotten them. Substring, the class called my-h1: two elements got a class, and the div that merely contains the letters h-1 was left alone. Multiline: handled. Nested: handled. Control, the ordinary component: handled.

And bound class, which is the subtle one. That element computes part of its class at runtime. The migration adds the static class it needs and does not go anywhere near the binding — it neither rewrites it nor gives up because of it. Two kinds of class on one element, and it only owns one of them.

Which brings me to the panel on the right, and it is the half nobody puts in a talk.

That is everything the migration deliberately did not touch, and why. A div, because it is not a typography tag. A style block, because it is a different language. A bound class, because it is not ours to edit.

Look back at the goal: add one class to specific elements, change nothing else. The left-hand side is the first half. This panel is the second half, and it is the harder one.

When you ask a stranger to approve a change across three hundred files, "here's what I changed" is half the answer. "Here's what I left alone, and here's how I knew" is the other half.
-->

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

<!--
⏱ 23:30 — Beat 1 of 4: WHY. Thirty seconds. Do not foreshadow the failure; the goal is enough.

Last one, and it is by a distance the smallest change in this talk.

[click] Every application's entry file registers its feature flags, and today it calls that function with one argument.

[click] The flag service changed. It now needs the defaults passed in as a second argument. That's the whole change. Fourteen characters.

[click] And that is the goal. One argument, in every application. If you were doing it by hand you'd be finished in fifteen seconds.

The second line is the one that makes this hard, and it sounds so obvious that it is easy to skip past: hand the file back in a state its author still recognises.

Because I am not opening a pull request against my own code. I'm opening one against theirs.
-->

---

# What we are dealing with

<PrintDemo phase="plain" />

<!--
⏱ 24:00 — Beat 2 of 4: the starting point. A minute. Do the two searches here; this is the setup for everything that follows.

Here's the entry file. Thirty-five lines. Eleven of them are blank — they're banded on the left — and there's a comment explaining why the shell mounts once.

Here's its tree.

Before we write anything, do something with me.

[press "find the blank lines"] Walked all a hundred and seven nodes. None of them is a blank line, and none of them even starts on one of the eleven empty lines.

[press "find the comment"] Same answer.

And here's the sharpest way to see it. [point at the two rows] This import ends at two seven eight. The next statement starts at four two four. That is a hundred and forty-six characters of this file that no node covers at all. Your blank lines live in that hole. So does the comment. So does every gap anyone ever put there on purpose.

Nobody threw them away. The parser never picked them up. They aren't part of what the code means, and meaning is the only thing a tree holds.

That's the word from ten minutes ago. Abstract.

Hold onto that, because it decides which of the next two lines of code I write.
-->

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

<!--
⏱ 25:00 — Beat 3 of 4: THE CODE. Fifty-five seconds. The whole example is the difference between two lines.

Same three steps again, and the parse and the find are unremarkable.

[click] Find the call, take its first argument. That node knows where it ends.

[click] Now the two endings. This is version (a): build a new tree with the argument added, and ask the printer to turn that tree back into text.

It is the obvious thing to do. It's what the API most wants you to do. And you already know what's wrong with it, because you just went looking for the blank lines and they weren't there. The printer can only write what the tree holds.

[click] Version (b) never prints anything. It takes the one offset it needs, and inserts fourteen characters into the string it was handed. Everything else in that file is the same bytes it arrived as.

[click] Both of these produce correct code. One of them produces a different file.
-->

---

# The result

<PrintDemo phase="outcome" />

<!--
⏱ 25:55 — Beat 4 of 4: the result. Sixty-five seconds. The signature moment. Let the counter sit.

Three ways home, measured.

Rebuild the tree: fifty changed lines, for a change that added one argument.

Then the thing everyone suggests: run the formatter afterwards. Forty-six. We got four lines back out of fifty.

And the counter. [point] Eleven. Zero. Zero. Eleven.

The formatter gave us the indentation back, because indentation is derivable from the syntax. It cannot give us the blank lines back, because there is nothing left in the file that says a blank line used to be there. Same for the comment.

Formatting is recoverable. The author's structure is not.

Version (b) is two lines. The comment survives, the grouping survives, and the diff is small enough that somebody will actually read it.

I know which of these we shipped first, and it wasn't (b). There is a file in a live application right now, committed nine months ago, with zero blank lines where it used to have eleven. Nobody noticed for a long time, because nothing was broken. It just wasn't theirs any more.
-->

---
layout: center
---

<p class="mega">Parse to <span class="accent">locate.</span></p>
<p class="mega">Splice to <span class="accent">edit.</span></p>

<p class="house-rule" v-click>Our entire shared helper library is 203 lines and never calls a printer.</p>

<p class="house-rule accent" v-click>A six-line diff gets merged. A four-hundred-line diff gets ignored.</p>

<!--
⏱ 27:00 — The house rule. Forty seconds.

[click] Two hundred and three lines, seven functions, and not one of them regenerates a file. They find nodes and write bytes at offsets. One copies its indentation off the node it's inserting next to, so the formatter has nothing to argue with on the next commit.

[click] And here's what makes it more than a style preference. Your codemod's output is not a file. It's a pull request that a stranger has to approve, on a Friday afternoon, in a repository you have never opened, for a change they didn't ask for.

A six-line diff gets read and merged. A four-hundred-line diff gets a thumbs up without being read, which is worse, or it sits for three weeks, which is also worse.

Diff size isn't aesthetics. It's the difference between a mechanism that works and one that technically ran.
-->
