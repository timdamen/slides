# Run sheet — the three AST examples

Slides 22–33. Everything here was read off the running deck, not from a spec, so the
numbers are what you will actually see. If a number on screen disagrees with this file,
trust the screen and tell me.

**The one rule for all three:** say **parse · find · edit** out loud in every example.
Three times, same three words. The repetition is what makes it stick, and by the third
one the room is predicting the structure.

**Every demo has a Reset.** Nothing is timed, nothing autoplays, nothing depends on
Slidev's click state. You can leave a slide half-driven and come back to it. If anything
looks wrong, press Reset and carry on — none of these can get into a state you cannot
back out of.

---

## Slide 22 · A node is a label and two numbers

The teaching slide. Everything after this depends on it. **~80 seconds, do not rush.**

Opens with `VariableDeclarator` pre-selected. Left: three lines of a routing file.
Right: the tree, 12 nodes, offsets in the right margin of every row.

| do | say |
|---|---|
| — | "This is not a diagram. It is the actual object, and every row has a name and two numbers." |
| click **`Identifier routes`** (6–12) | "I am an Identifier, I start at character six, I end at twelve. And six to twelve is exactly the word `routes`. Not roughly. Exactly." |
| click **`ArrayExpression`** (15–52) | "This one is the array." |
| click **into the source text** | "And it goes the other way. I click a character, it finds the smallest node that contains it." |
| — | "A node is a label plus two numbers that point back into your text. The tree is an index into your file." |
| — | **parse · find · edit** — name the three steps here for the first time. |

Close on the beginner takeaway: *"stop at step two. Don't edit anything. Just ask your own
repository a question."*

> **Watch out:** these offsets are **15–52** because this slide uses a three-line snippet.
> Slide 24 uses the full file and says **65–389**. Same idea, different source. Don't
> cross-quote them.

---

## Slide 24 · How the parser finds it — FIND, the migration

Opens on the **`clean`** fixture. `src/router/index.ts`, 48 nodes.
Header reads `ArrayExpression  start 65 · end 389 → source.slice(65, 389)`.

Four fixture buttons across the top: `clean` · `] in a string` · `] in a comment` ·
`imported routes`. **Stay on `clean` for this slide.** The hazards belong to slide 25.

| do | say |
|---|---|
| — | "Parse, find, edit. Again." |
| gesture at the tree | **PARSE.** "Here's the file, here's its tree. Same picture you just saw." |
| click **`ArrayExpression 65–389`** | **FIND.** "The declarator named routes, then its array. Sixty-five to three eighty-nine. The parser didn't search for anything. It already knew." |
| — | **EDIT.** "Two numbers, so I change the original text between them and leave every other character alone." |
| point at the **bottom strip** | "Now the same job without a parser — what we actually shipped. Same two numbers, derived by counting brackets." |
| — | "Right now they agree. **Sixty-five and three eighty-nine, twice.**" |

The bottom strip is the whole slide. It reads:

```
parser           read off the declarator named routes    start 65  end 389   ( same two numbers )
bracket counter  tallied [ and ] from the declaration    start 65  end 389
```

Hand off: *"Everything that goes wrong on the next slide is those two numbers coming apart."*

---

## Slide 25 · What happens on a file you have never seen — FIND, the outcome

**This is where you type on stage.** ~75 seconds.

Same four fixture buttons. You can either click **`] in a string`** or type a `]` into a
route title live in the editable pane. Typing is stronger if your hands are steady;
clicking is safe. Decide before you go on and don't improvise.

| do | what happens |
|---|---|
| click `] in a string` *(or type one)* | counter's offsets become **65 / 249**, parser stays **65 / 427**. The offending `]` marks red; the counter's underline stops short while the parser's band runs on |
| — | the counter still reports success. Green. Output still parses |
| point at the changed-line counts | correct migration = **4 lines**. Broken one = **2 lines** |
| click `imported routes` | the parser **refuses** — "could not locate the routes declaration; refusing to guess" |

The two lines that matter:

- *"It didn't break your build. It quietly deleted your types. In a repository I don't own, in a team that doesn't report to me, and nobody finds out for nine months."*
- *"The failure is smaller than the success. The one that deleted your type safety is the one that looks least alarming on a Friday afternoon."*

Then the refusal: *"That's the feature. Not that it's more accurate. That it can tell you it failed."*

---

## Slide 28 · The template compiler does the edit — REACH, the migration

Opens on the **`substring`** fixture with the `<h1>` already selected. **Do not go looking
for it — it is the one that opens.**

Five tabs: `substring` · `multiline` · `bound class` · `nested` · `control`.
Only one visible Reset (the inspector's own bar is hidden on this slide).

| do | say |
|---|---|
| — | "Parse, find, edit. Different language, same three steps." |
| point at **`Element <h1 class>` 37–76** | **PARSE.** "Look at what an element node is: a tag, and a list of attributes it owns." |
| point at **`props class 41–54`** | **FIND.** "So my question — does this heading already have the class h1 — is a lookup on that list. It is not a search through text." |
| point at the two rows below | the panel asks the same question twice: |

```
parser  props.class = "my-h1"        no "h1" token – appends it
text    /class="[^"]*h1[^"]*"/       matches – skips it        ( they disagree )
```

> *"Same question, asked two ways, two different answers, and only one of them is about the actual element."*

Then flip the remaining tabs quickly — `multiline` (attributes over four lines, because
someone ran a formatter), `bound class` (nothing static to append to), `nested`.

Close: *"The parser isn't cleverer. It just isn't reading text."*

---

## Slide 31 · Three ways back to disk — PRINT, the migration

**Do the tree search BEFORE the buttons.** That ordering is the entire point of this
slide — it is what turns your best beat from an assertion into something the room derives.

Top bar, left to right: `Is it in the tree?` · **find the blank lines** · **find the
comment** · Reset · and the yellow **① now print the tree →**.

The source pane bands the blank lines in yellow. The strip under the panes reads:

```
35 lines of text · 11 blank · 2 comment lines · 107 nodes in the tree
                            · 0 of them a blank line · 0 a comment
```

| do | say |
|---|---|
| — | "Thirty-five lines, eleven of them blank, one comment. Here's its tree." |
| press **find the blank lines** | "Walked all a hundred and seven nodes. None is a blank line, and none even starts on one of the eleven empty lines." |
| press **find the comment** | "Same answer." |
| point at `"./flags" 218–278` then `VariableDeclaration 424–509` | **"That's a hundred and forty-six characters of your file that no node covers at all. Your blank lines live in that hole."** |
| — | "Nobody threw them away. The parser never picked them up… That's the word from ten minutes ago. **Abstract.**" |
| press **① now print the tree →** | 50-line diff. *"The blank lines are gone. The comment is gone. **Of course they are. You just watched them not be in there.**"* |
| press **② reprint, then run the formatter** | indentation snaps back |
| press **③ parse to locate, splice the bytes** | 2 lines, comment survives |

---

## Slide 32 · What each one cost — PRINT, the outcome

The verdict slide. Three rows, computed live, plus the counter as the hero.

```
reprint the tree                 50 changed lines
reprint, then run the formatter  46 changed lines   indentation restored, blank lines still gone
parse to locate, splice          2 changed lines

BLANK LINES   11 → 0 → 0 → 11
```

Say it slowly: *"Reprint: fifty. Reprint then format: forty-six. We got four back. Out of fifty."*

Then point at the counter and just read it: **"Eleven. Zero. Zero. Eleven."**

Let it sit. Then: *"Formatting is recoverable. The author's structure is not."* And close
the loop — *"That's what abstract means. I told you it would come back."*

---

## If something goes wrong

| symptom | what to do |
|---|---|
| a demo looks wrong | press **Reset**. Every one returns to the state described above |
| you clicked past a beat | nothing is sequential — click the control you actually wanted |
| a pane looks empty | you are probably on the wrong fixture tab; the opening tab is named above |
| a parse error appears | it renders inline in red and the slide stays up. Say "that's the demo telling me it failed, which is the whole point" and move on |
| you are running long | cut slide 26 ("The parser already counted") — it is a ten-second coda. Never cut slide 31's tree search |

Nothing here needs the network. Every number is computed in the browser while the room
watches, which is why the last line of the talk is allowed to be *"everything on screen
today ran in your browser."*
