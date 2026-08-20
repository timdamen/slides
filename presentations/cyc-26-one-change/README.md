# One change. Three hundred repositories. Nobody reports to me.

Commit Your Code 2026 · Plano, TX · 4 September 2026 · 30-minute slot

Programme title: *Utilising the JavaScript AST for Automated Frontend Lifecycle
Management*. The on-slide title is the one above, because the programme title
promises a parser talk and this is a platform talk with a parser in it.

```bash
pnpm --filter @supaslidev/cyc-26-one-change dev
pnpm --filter @supaslidev/cyc-26-one-change audit   # build + axe
```

## Storyline

A fusion of two shapes Tim picked on 2026-08-05: the **platform-team thesis** as the
argument, and the **follow-one-change documentary** as the vehicle. One change (a
mandate for automated accessibility checks) travels through the machine for the first
half, and each stage of its journey pays for a piece of the org argument.

The documentary arc **closes** at "Deadline met" before the AST act opens. That is
deliberate. The three AST examples were authored in different windows for different
reasons, and there is no causal link between the mandate and any of them. The
connective sentence is "that one needed no parser; here are three that did", which is
true. Do not let a rewrite turn this into "and so we needed an AST".

## Shape (37 slides, last word at ~28:20)

| Time | Act | Slides |
|---|---|---|
| 0:00 | Cold open | cover |
| 0:20 | 0 · The grey | two swatches · a year · what the organisation did about it |
| 2:20 | 1 · The mandate | the email · ~300 · three hundred tickets (`BreakEven`) · three things have to be true |
| 5:00 | 2 · The mechanism | one line · four commands (`UpdateRun`) · 153/157 · 6 vs 58 |
| 8:35 | 3 · Landing it | the word `test` · designed away · deadline met |
| 10:35 | 4 · Keeping the promise | robot gave up · the refusal (`UpdateRun` gate) · codemods are forever · test the upgrade |
| 14:00 | 5 · Abstract. Syntax. Tree. | census · A/S/T · the grep beat · then three examples, three slides each |
| 25:50 | 6 · The thesis | what it bought · the thesis · Monday · thanks |

### The three AST examples are three beats each

Tim's call, 2026-08-05: one demo per example was too cramped, so each now runs
**starting point → the AST migration → the outcome**, one slide per beat.

| | starting point | migration | outcome |
|---|---|---|---|
| **FIND** | one file, three migrations, seventeen months, two hand-rolled bracket counters | `FindDemo phase="migrate"` — clean file, both engines agree, tree panel shows the parser working by offsets | `FindDemo phase="outcome"` — the hazard fixtures; the broken run's diff is *smaller* than the correct one |
| **REACH** | a design system major; every heading in every component | `ReachDemo phase="migrate"` — four adversarial fixtures, two diffs disagreeing | `ReachDemo phase="outcome"` — the graded arena and the "did not touch" panel |
| **PRINT** | one argument added to one call; the transform is correct every time | `PrintDemo phase="migrate"` — the three strategy buttons | `PrintDemo phase="outcome"` — all three costs side by side, and the 11 → 0 → 0 → 11 counter |

Each component keeps `phase="all"` as its default, which renders the original
single-slide view. Nothing else in the deck uses it, but it means a phase split can be
undone on stage by swapping one attribute.

The FIND example carries a fourth slide ("The parser already counted. Stop counting.")
and PRINT carries "Parse to locate. Splice to edit." Both are ten-second codas, not beats.

### Act 0, the origin story

Tim's own, from early in his career: a large organisation, 40+ web teams, and a
designer asking for the page background one step darker. It took over a year.
Misalignment, no shared vocabulary, 40 competing backlogs, and the requirement that it
land everywhere at roughly the same time or the product looks broken. The organisation's
response was to rebuild how it managed frontend: platform teams, written standards, a
real design system, shared pipelines, one stack.

This does three jobs at once. It states the problem in a form that needs no scale to
feel. It pays for the platform-team thesis with lived experience rather than assertion.
And it makes "one change" in the title mean two things.

The line "I'll also tell you which part of that list turned out to be a lie" points at
written standards, and gets paid off in Act 5 (a wiki page is how we pretend a decision
was made). Don't cut one without the other.

Act 5 is 11:35 and Act 4 is 3:25. **Act 4 is the one that gets squeezed on stage and it
must not be.** It carries the material the closing thesis rests on. If you are running
long, cut in this order: the fourth Monday item (−20s), the "what it bought" fourth
line (−15s), the "parser already counted" beat (−10s). Never cut "most of you should
not build this", the refusal, or the grey story.

The `packageGroup` slide (eleven libraries as one upgradeable unit, via stock tooling)
was cut to make room for Act 0. It survives as one sentence in the four-commands
presenter notes. Put it back if the grey story lands short in rehearsal.

## Demos

All five compute their output live, in the browser, from real parsers. Nothing is a
screenshot and nothing is a recording. That claim is the last line of the talk, so it
has to stay true.

| Component | Act | What it computes |
|---|---|---|
| `BreakEven` | 1 | engineer-years of manual toil vs one platform team. Drag to 12 apps and it says don't build this |
| `UpdateRun` | 2, 4 | the four-command round, the 54-codemod ledger; `mode="gate"` shows the refusal and the partial-but-zero exit |
| `FindDemo` | 5 | a shipped line-based bracket counter vs acorn, on four fixtures. Type a `]` into a string and watch the counter silently drop a type annotation |
| `ReachDemo` | 5 | `@vue/compiler-sfc` template AST vs a pattern match, graded live across four adversarial fixtures. Verdicts are computed by comparison, never authored |
| `PrintDemo` | 5 | one correct edit, three ways back to disk. The blank-line counter reads 11 → 0 → 0 → 11 |

None of them bind to Slidev's click state. Each has its own Reset. A parse failure
renders inline rather than blanking the slide.

## Presenting

`RUNSHEET.md` is the stage document for the three AST examples (slides 22–33): opening
state, click order, the numbers that will be on screen, where to pause, and what to do
when something misbehaves. It was written by driving each demo in a browser, not from the
component specs, so the figures in it are the ones that actually render.

## Verification

`pnpm --filter @supaslidev/cyc-26-one-change audit` builds the deck and then measures
every rendered text node. Last run, 2026-08-05, all 37 slides:

- **axe-core (WCAG 2.1 A + AA): no violations.**
- **Contrast: every text node clears its AA threshold.** This needed
  `setup/shiki.ts` — the stock code theme renders comments at 4.4:1 and punctuation
  at 3:1 on this background, so the deck pins the high-contrast variants.
- **No visible overflow on any slide, and no text below 13px**, checked in a headless
  browser at every click state.

Two traps worth knowing before you touch the layout:

1. Slidev keeps ~20 slides in the DOM at once, so `document.querySelector('.slidev-layout')`
   returns whichever comes first in document order, **not** the one on screen. Scope to
   `.slidev-page-<n>` instead. Several confident-looking measurements were wrong because
   of this.
2. An element inside a scroll container has a bounding rect taller than the container,
   so a naive deepest-child check reports overflow that is not visible. Skip any element
   with an `overflow: auto|scroll|hidden` ancestor. `PrintDemo`'s code pane trips this.

## TODO(Tim)

- [ ] **"Roughly 300" and "five people"** both come from an internal funding document.
      Verify against the telemetry dashboard or soften further. Never give a precise
      figure on stage. See `SOURCES.md`.
- [ ] **The deadline in the cold open.** Supply a real quarter or keep the slide
      date-free. Do not invent one.
- [ ] **The unattended completion rate.** Does not exist yet, and it would be the
      strongest slide in the talk. Telemetry ships 20 named span operations with an
      outcome on every span, so it is derivable. If you can get it before September,
      it goes on the "what it bought" slide.
- [ ] **Anonymise the print fixture properly.** `PRINT_SOURCE` must keep the
      fingerprint (four-space indent, missing blank lines, the `, }` in the collapsed
      import) while every identifier is renamed. Read it once with fresh eyes before
      you present.
- [ ] Rehearse `FindDemo` typing live. It is the moment the talk turns and it depends
      on you typing one character into a textarea in front of 200 people.
- [ ] Re-verify every number in `SOURCES.md` about two weeks out.

## Constraints

See `SOURCES.md`. The short version: no employer, no internal codenames, no vendor
names for the three tool onboardings, no internal source on screen without renaming,
and no causal claim between the mandate and the AST examples.
