# Sources and framing rules

Every number on a slide has to be traceable to a line in this file. If it is not here, it
does not go on screen.

## Framing rules (non-negotiable)

1. **No employer, ever.** The estate is "a large European bank". Never the real name.
2. **The tool is anonymised.** On screen it is "the platform toolkit", published under a
   `@platform/` scope. Never the internal codename, never the real npm scope, never
   `create-*-vue-app`, never the internal registry product name.
3. **No vendor names for the three tool onboardings.** Tim's call, 2026-08-05. The
   accessibility scanner and the translation/localisation platform are referred to by
   category only: "an accessibility scanning vendor", "a translation and localisation
   vendor". The test-runner swap is "a test-runner swap".
4. **No migration code on screen for those three onboardings.** They are described by
   shape (what kind of edit, how many lines, which files) and never shown. All three AST
   examples come from *other* migrations, which are shown in full.
5. **No internal source verbatim** unless every identifier has been renamed. The one
   exception is the reprinted file in the AST print example, and even there the
   identifiers are renamed. What must survive renaming is the *fingerprint*: the
   four-space indent, the missing blank lines, the `, }` in the collapsed import.
6. **The design system, the internal component library and the internal instruction
   files are never named.** "A design system major" is enough.
7. **No causal claim between the accessibility mandate and the three AST examples.**
   They were authored in different windows for different reasons. The documentary arc
   closes before the AST act opens. The connective sentence is "that one needed no
   parser; here are three that did", which is true.

## Numbers cleared for screen

| Claim | Value | How it was counted |
|---|---|---|
| Registered migrations | 153 | Sum of `Object.keys(generators).length` over 14 `packages/*/migrations.json` |
| Migration implementation files | 159 | `find packages -path '*/src/migrations/*' -name '*.ts' -not -name '*.spec.ts'` |
| Co-located spec files | 157 | Same find, `-name '*.spec.ts'` |
| Implementation LOC / test LOC | 9,001 / 11,820 | `cat` of each set piped to `wc -l`. Ratio 1.31 test lines per impl line |
| Migrations importing a parser | 11 of 159 (~7%) | grep for `ts.createSourceFile\|findNodes(\|ts.factory\|recast\|@vue/compiler` |
| Rises to, counting shared AST helpers | 17 (~11%) | adds files calling `addImports`/`pushToArray`/`findAndAddStatement` |
| Migrations using `.replace(` | 48 of 159 (30%) | grep. Upper bound: includes trivial single-string swaps |
| Hand-rolled brace/bracket counters | 4 | manual read of all 48; two of them in the router plugin |
| Codemod frameworks used | 0 | no ts-morph, jscodeshift, Babel, magic-string, esprima, tsquery anywhere |
| Shared AST helper library | 203 lines, 7 exported functions | `wc -l` on the helper + reading its exports |
| Published packages | 21 | `ls packages/*/package.json`, all at one version, released in lockstep |
| Packages migrated by one command | 10–11 | length of the `nx-migrations.packageGroup` array |
| Nx commands per major crossed | 4 | `runRound()` in the updater: fetch framework, apply framework, fetch platform, apply platform |
| Releases | 391 | `grep -cE '^## ' CHANGELOG.md`, 2024-02-06 → 2026-07-09. Includes prereleases |
| Upstream majors absorbed | 4 Nx majors in ~2 years | 22-row table in the platform's `nx-releases.md`, Nx 19.2.3 → 23.0.1 |
| Codemods in one catch-up update | 54 | entries in the `migrations` array of a real consumer's generated manifest |
| Plugins contributing those 54 | 8 | distinct `package` values in the same manifest |
| Files touched by that commit | 34 | `git show --stat`. Quote the FILE count; the line count is dominated by the lockfile |
| Drift before that update | ~9 months | gap between the two platform-update commits in that app |
| Commits in the gap | 1,040 commits, 14 contributors | `git log` over the same span |
| Files carrying a "platform owns this" header | 6 | `grep -rln` for the generated-file header |
| Distinct files touched by platform updates in that app | 58 | union of `--name-only` over the three update commits |
| App growth, scaffold → one year | 108 → 438 files; `src/` 26 → 235 files, 42,549 lines | `git ls-tree` at the scaffold commit vs `git ls-files` at HEAD |
| Direct dependencies per app | 59–87 | `Object.keys(deps) + Object.keys(devDeps)` across three repos |
| Resolved packages in the lockfile | 1,295–1,867 | `Object.keys(lock.packages).length` |
| Platform-managed deps app teams may not bump | 44 | bullet count in the scaffolded dependency-policy instruction file |
| The same routes file, rewritten | 3 migrations across 17 months | `git log --diff-filter=A` on the three migration directories |
| Tailwind theme regex nesting limit | 3 levels | stated in a trailing comment in the shipped migration; verified by running it |
| Blank lines destroyed and never recovered | 11 → 0 in one file, 6 → 0 in another | `grep -c '^$'` at four points in the consumer's history |
| Days the reprinted file has been in main | ~20 at time of research (2026-07-16 → 2026-08-05) | commit date vs inspection date; working tree clean |

## Numbers that need Tim before they go on a screen

- **"Roughly 300 applications."** Self-reported in an internal funding document, sourced
  there to a telemetry dashboard. It counts repos consuming the packages, not deployed
  apps. Say "roughly three hundred", never a precise figure, and never defend it.
  TODO(Tim): verify against the telemetry dashboard, or soften further.
- **"Five people."** Same document. TODO(Tim): confirm current team size.
- **The deadline date in the cold open.** TODO(Tim): supply a real quarter, or keep the
  slide date-free and say "before a date nobody in engineering chose".
- **Unattended completion rate.** Does not exist yet. Telemetry ships 20 named span
  operations to App Insights and every span carries an outcome, so the number is
  *derivable*. If Tim can get it before the conference it is the strongest slide in the
  talk. Until then it stays off the deck entirely.

## Quotations cleared for screen (paraphrased, attributed to "our own docs")

- On the refusal to automate: "Requiring a conscious action keeps teams aware that they
  need to act and stops the change from getting lost in an automated run."
- On the frozen helper API: migrations are immutable historical records; one authored in
  2024 executes against whatever helper version is installed at that moment.
- On gates: never remove a historical gate, because a consumer on an old version relies
  on every gate in the chain.
- On a bail-out inside a real migration: it checks whether the file still contains the
  scaffold's own expression and skips when "changes have been made which are too
  difficult to modify".

## Things deliberately left out

- The "claude code with regex" changelog entries. Real, and the most 2026 artifact in the
  corpus, but Tim chose the platform-thesis/documentary fusion rather than the
  generation-is-free storyline. Kept here in case it earns a slide later.
- `env.aiAgent: detectAiAgent() ?? 'human'`. Same reason. Strong closing gesture if the
  talk ever needs one.
- The migration that silently never ran (a patch version folded into a minor, so every
  consumer skipped it). Scariest failure mode in the corpus, no room for it at 30 minutes.
