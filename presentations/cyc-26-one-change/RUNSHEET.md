# Run sheet — the two AST examples, slides 20–28

Slide numbers are the deck as it renders today (example three is `hide: true` and does not
count). Numbers in this file were read off the code, not off a running deck — where a
number on screen disagrees, trust the screen and tell me.

**The one rule for both examples:** say **parse · find · edit** out loud, in order, every
time. By the second example the room is predicting the structure, and that is the point.

**Every demo has a Reset.** Nothing is timed, nothing autoplays, nothing binds to Slidev's
click state. You can leave a slide half-driven, come back, and press Reset. None of these
can get into a state you cannot back out of.

**The beat map** — both examples run the same four beats, and you can name them:

| beat | example one (20–23) | example two (25–28) |
|---|---|---|
| 1 · the goal | slide 20 | slide 25 |
| 2 · what we are dealing with | slide 21 (FindDemo) | slide 26 (ReachDemo) |
| 3 · the migration (code) | slide 22 | slide 27 |
| 4 · the result | slide 23 | slide 28 |

Slide 24 is a ten-second breather between them.

---

## Slide 20 · Example one · the goal — ⏱ 16:10, ~30s

Three Slidev clicks, one per line. State the goal and move on — the technique belongs to
the next three slides.

| click | say |
|---|---|
| — | "First one, and the change is genuinely boring, which is why it's a good first one." |
| 1 | Every app's routes file declares the type at the end, as an assertion: `as RouteRecordRaw[]`. |
| 2 | The router's next major only type-checks the annotation form. The same information moves ~20 characters left. |
| 3 | "Move the type. In every application. **Without touching a single route.** Some of those files are four hundred lines long." |

Hand off: *"So — what are we dealing with?"*

---

## Slide 21 · What we are dealing with — ⏱ 16:40, ~50s

`FindDemo phase="plain"`. Opens on the **clean** fixture with the routes
**ArrayExpression already selected**: the readout above the file says
`ArrayExpression · start … · end … → source.slice(…, …)` and the band is painted over the
array. Four fixture buttons: `clean` · `] in a string` · `] in a comment` ·
`imported routes`. Reset far right.

First the census, then the two anchors. Tabs first — these four names come back on
slide 23, and if the room hasn't met them here the result grid means nothing.

| do | say | why this click |
|---|---|---|
| — | "This is the part people skip, and it's the part that decides whether your migration works. You don't imagine what the file looks like. You go and look. We grepped the estate; it comes in four shapes. That's not a test suite I invented — it's a census." | frames the tabs as inventory, not hypotheticals |
| click **`] in a string`** | "Some teams have a square bracket inside a page title — `title: 'Archive ] old'`. A string, with a bracket in it." | each button loads the real fixture; the room sees the hazard in context, not on a bullet |
| click **`] in a comment`** | "Some have the bracket in a comment a colleague wrote to be helpful." | same |
| click **`imported routes`** | "And a few don't declare the routes here at all — they import them from a generated file." Point at the readout: it has gone back to its hint, because there is no `routes` declaration for it to anchor on. | quietly plants the refusal that pays off on slide 23 |
| click **`clean`** | "Most of them look like this." | you need the clean file back for the anchors |
| click the **`ArrayExpression`** row in the tree | "The array is a node, with a start and an end." The band paints the whole array in the file. | shows the edit target is a character range, not a line number |
| click the **`Identifier routes`** row | "And the name is a node too — and it ends exactly where the annotation needs to go." | this end offset is the exact number the next slide reads with `decl.name.getEnd()` |

Land it: *"So the goal turns into something very concrete: insert at the end of one node,
delete at the end of another. And it has to hold for all four shapes."*

> **Watch out:** slide 18 used a three-line snippet, this slide uses the full file — the
> offsets are different. Never quote slide 18's numbers here; read them off the screen.

---

## Slide 22 · The migration — ⏱ 17:30, ~60s

The slide people photograph. Slow down and let them read.
Highlights: `{all|2-4|6|7-9|11-14|9}` — five clicks after the full view.

| click | lines | say |
|---|---|---|
| — | all | "That's the whole migration. Fourteen lines, and it runs in three hundred repositories." |
| 1 | 2–4 | Read the file off a virtual filesystem — an in-memory tree, which is why this is testable without cloning anything. No file, we're done before we started. |
| 2 | 6 | **PARSE.** One call, and the text becomes the tree you were clicking through a slide ago. |
| 3 | 7–9 | **FIND.** Every variable declaration; hand me the one called `routes`. A structural question — the text is never searched. |
| 4 | 11–14 | **EDIT.** Two changes at offsets the nodes gave me. Insert where the name ends — you watched that node end on exactly that character. Delete where the array ends: twenty characters, exactly `" as RouteRecordRaw[]"`. Everything between the two spots is untouched because the file was never rebuilt. |
| 5 | 9 | Back to this line — "the most important line in the whole talk. No declarator called routes → we stop. We don't guess, we don't fall back to a regex. We leave the file as we found it and report that we skipped it." |

Close: *"A tool that can't tell you it failed will eventually fail quietly in a repository
you have never opened."*

---

## Slide 23 · The result — ⏱ 18:30, ~70s

`FindDemo phase="outcome"`. Opens on **clean**. Left: one computed row per shape. Right:
the full diff (every line shown — nothing elided, so "untouched" can be inspected) for
whichever shape is loaded. Bottom: the goal as a number.

Expected rows — every value is computed live, trust the screen:

```
clean            migrated   4 changed lines   annotation present · assertion removed · 3 routes untouched
] in a string    migrated   4 changed lines   (same facts)
] in a comment   migrated   4 changed lines   (same facts)
imported routes  skipped    on purpose        0 changed lines — "could not locate the routes declaration; refusing to guess"
```

| do | say | why this click |
|---|---|---|
| — | "The four shapes from the census, run through the code you just read." Point at the clean diff: the two `−`/`+` pairs, the annotation in, the assertion gone. "Four changed lines, and the route count before and after is identical." | the number is computed in front of them, not asserted |
| click **`] in a string`** | "The bracket in a page title. Still four lines, same result. A string is a node, and what's inside it is not syntax — it simply never came up." | the row lights, the diff switches; the hazard shape produces the identical result |
| click **`] in a comment`** | "Same again." | quick — the point is repetition |
| click **`imported routes`** | "Zero changes — and it tells you why, in its own words. There is no declarator called routes in this file, so it will not guess." | the refusal is the payoff of the guard line from the last slide |
| point at the **footer** | "Nine routes across these four files. Zero rewritten. 'Without touching a single route' isn't a promise on this slide — it's a count." | the goal from slide 20, measured |

Say explicitly: the skipped row is not a failure. Three hundred repositories means there is
always a shape you did not think of, and the only safe behaviour is to stop and say so.

---

## Slide 24 · breather — ⏱ 19:40, ~10s

"Ask the tree a question. Edit at the answer." Don't explain it. If you are running long,
this is the slide you can walk straight through.

---

## Slide 25 · Example two · the goal — ⏱ 19:50, ~30s

Three Slidev clicks.

| click | say |
|---|---|
| — | "Second one — different language, different parser." |
| 1 | The design system's new major styles typography by class, not by tag. (Good decision: a heading can look like a heading without being an `h1`.) |
| 2 | So every `h1`–`h4`, `p` and `label` needs its own tag name as a class: `<h1 class="h1">`. |
| 3 | "Add one class to specific elements. Thousands of elements, every application. **Change nothing else in the markup.**" |

---

## Slide 26 · What we are dealing with — ⏱ 20:20, ~45s

`ReachDemo phase="plain"`. Five tabs: `substring` · `multiline` · `bound class` ·
`nested` · `control`. Opens on **substring** with the **`<h1 class="my-h1">` already
focused** — tree on the right, and under it the element panel: the open tag, its range,
and a **props** chip per attribute, each with its own start–end.

Name every tab out loud — the five names are the rows of slide 28's grid.

| do | say | why this click |
|---|---|---|
| — (on `substring`) | "Same exercise as last time: before writing anything, go and look. A heading turns up in five shapes. This one has a class called `my-h1`. Contains the letters h-1. Is not the class h1." | the census again; and this shape is the one already focused |
| click **`multiline`** | "This one's attributes are spread over four lines, because somebody ran a formatter." Point at the element panel: the open tag reads back as one line, because the node's range spans all four. | formatting changes the text, not the node |
| click **`bound class`** | "This one computes its class at runtime — there is no static class attribute to add to." The `:class` chip is marked as bound. | plants slide 28's subtle row |
| click **`nested`** | "Headings inside other elements, plus a comment that looks like markup." The focused `<h2>` has no attributes — the panel says *"the list is empty — not missing."* | an empty list is still an answer; a text tool can't say that |
| click **`control`** | "And an ordinary one with none of those problems — which is most of them." | the grid needs a row that was never in danger |
| click **`substring`**, then the **`<h1>` element** in the tree (usually still focused) | "Now the one observation that makes this example work. Look at what an element node is: a tag, a range, and the list of attributes it owns. The class attribute isn't text sitting near this element. It belongs to it — and it has its own start and end." | attribute ownership is the whole mechanism of the next slide |

Land it: *"So 'does this heading already have the class h1' is a lookup on that list. And
'where does the class go if it doesn't' is an offset I read off the node."*

---

## Slide 27 · The migration — ⏱ 21:05, ~55s

Highlights: `{all|2-4|6|7-11|14|10}` — five clicks after the full view. Same shape as
slide 22 on purpose, down to ending on the safety line.

| click | lines | say |
|---|---|---|
| — | all | "Same three steps. Different parser." |
| 1 | 2–4 | **PARSE.** The Vue SFC compiler — already in your node_modules; you are not adding a dependency. No template block → stop before we start, same rule as last time. |
| 2 | 6 | Collect edits, don't apply them: editing while walking would shift every offset after the edit. Gather, then apply in one pass, back to front. |
| 3 | 7–11 | **FIND.** Walk the elements. Skip non-targets. The class attribute is an object the element owns, not a substring. Exact class already there → walk on; otherwise push an edit built from the node's own offsets. |
| 4 | 14 | **EDIT.** One write, all the offsets at once. |
| 5 | 10 | Back up to this line: "every example in this talk has one line that matters more than the rest. Already has the class → writes nothing. That's idempotency, and it's a hard requirement: a migration that changes something on the second run will eventually run twice somewhere real." |

---

## Slide 28 · The result — ⏱ 22:00, ~60s

`ReachDemo phase="outcome"`. Opens on **substring**. Left: "what the migration did" — five
rows, all computed; **each row is a button** that loads that shape's diff (bottom left)
and retargets the right-hand panel. Right, full height: **did not touch** — the ✓ list of
what was deliberately left alone for the loaded shape, with a count pill.

Expected rows — computed live, trust the screen:

```
substring    2 elements got a class · <div class="my-h1"> left alone
multiline    1 element got a class  · data-testid, :title left alone
bound class  1 element got a class  · :class is computed at runtime
nested       2 elements got a class · <!-- <label> --> left alone
control      2 elements got a class · <article> left alone
```

| do | say | why this click |
|---|---|---|
| — (on `substring`) | "The five shapes from two slides ago, run through the code you just read — every line computed while you watch. Two elements got a class, and the div that merely contains the letters h-1 was left alone." | the trap the shape is named after, resolved |
| click **`multiline`** | "Handled — the class lands inside a four-line open tag, and the attributes around it didn't move." | the diff pane shows the edit landing mid-formatting |
| click **`nested`** | "Handled. The `h3` that already carried its class got nothing written — that's line ten from the last slide, running. And the comment that looks like a label is still a comment." | idempotency and the comment, both visible; the right panel is longest here — it scrolls |
| click **`bound class`** | "The subtle one. It computes part of its class at runtime. The migration adds the static class it needs and does not go anywhere near the binding — it neither rewrites it nor gives up because of it. Two kinds of class on one element, and it only owns one of them." | the row nobody expects a codemod to survive |
| click **`control`** | "And the ordinary one: handled." | quick |
| point at the **right panel** | "This is the half nobody puts in a talk: everything the migration deliberately did not touch, and why. A div, because it's not a typography tag. A style block, because it's a different language. A bound class, because it's not ours to edit." | "change nothing else" is half the goal, so this panel is half the slide |

Close: *"When you ask a stranger to approve a change across three hundred files, 'here's
what I changed' is half the answer. 'Here's what I left alone, and here's how I knew' is
the other half."*

---

## If something goes wrong

| symptom | what to do |
|---|---|
| a demo looks wrong | press **Reset** — every demo returns to the opening state described above |
| you clicked past a beat | nothing is sequential; click the control you actually wanted |
| a pane looks empty | wrong fixture tab — the opening tab for each slide is named above |
| a parse error appears | it renders inline in red and the slide stays up. Say "that's the demo telling me it failed, which is the whole point" and move on |
| running long | walk through slide 24 without stopping; tighten the tab tour on 26 to three tabs (substring, bound class, control) |

Nothing needs the network. Every number is computed in the browser while the room watches.

---

## Hidden: example three (PRINT)

The three example-three slides and their interstitial are `hide: true` in
`pages/05-ast.md`. Their speaker notes are intact there if the example ever comes back;
re-enabling them renumbers everything after slide 28.
