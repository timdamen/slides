<script setup lang="ts">
/**
 * The mechanism demo: what an application developer sees when they run the one
 * npm script every repository is born with.
 *
 * Two modes, one machine:
 *
 *   mode="run"   a single major boundary, crossed. Four commands, then the
 *                migration ledger fills package by package.
 *   mode="gate"  the same terminal, stopped at the boundary by a gate the
 *                platform team wrote on purpose. Everything below the boundary
 *                is kept and committed; the outcome is "partial — exit 0".
 *
 * Everything on screen is derived from LEDGER below — the counter, the file
 * count, the per-package tallies, the round split. Nothing is a hard-coded
 * number that can drift away from the list underneath it.
 *
 * Playback is driven by this component's own buttons and one interval. It never
 * reads Slidev's click state, so the speaker can step, play, pause, skip or
 * reset in any order without the slide's navigation getting involved.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { ROUTES_CLEAN, VUE_NESTED, routesAst, vueTagClasses } from '../utils/transforms'

const props = withDefaults(
  defineProps<{
    mode?: 'run' | 'gate'
    /** Milliseconds between scripted steps while playing. */
    stepMs?: number
  }>(),
  { mode: 'run', stepMs: 700 },
)

// ---------------------------------------------------------------------------
// The migration ledger
//
// 54 migrations from 8 plugin packages, anonymised. Versions run from 1.8.1 to
// 2.0.1, so "is this one across the major boundary?" is a property of the data
// rather than a flag somebody has to keep in sync.
// ---------------------------------------------------------------------------

interface LedgerEntry {
  pkg: string
  version: string
  desc: string
  files: string[]
  /** Two of these are the codemods demonstrated later in the talk. */
  probe?: 'routes' | 'tags'
}

const LEDGER: LedgerEntry[] = [
  { pkg: '@platform/vue-app', version: '1.8.1', desc: 'update router to v5 config shape', files: ['src/router/index.ts'] },
  { pkg: '@platform/vue-app', version: '1.8.4', desc: 'replace the removed global properties API', files: ['src/main.ts'] },
  { pkg: '@platform/vue-app', version: '1.9.0', desc: 'move route titles into the route table', files: ['src/router/index.ts', 'src/router/meta.ts'] },
  { pkg: '@platform/vue-app', version: '1.9.2', desc: 'convert options-api components to script setup', files: ['src/components/AppShell.vue', 'src/composables/useSession.ts'] },
  { pkg: '@platform/vue-app', version: '1.9.6', desc: 'drop the provide/inject compatibility shim', files: ['src/main.ts', 'src/plugins/shell.ts'] },
  { pkg: '@platform/vue-app', version: '1.10.0', desc: 'annotate the route table instead of asserting it', files: ['src/router/index.ts'], probe: 'routes' },
  { pkg: '@platform/vue-app', version: '1.10.4', desc: 'move the mount call behind router.isReady()', files: ['src/main.ts', 'src/router/guards.ts'] },
  { pkg: '@platform/vue-app', version: '2.0.0', desc: 'remove the v1 compatibility build flag', files: ['vite.config.ts', 'package.json'] },
  { pkg: '@platform/vue-app', version: '2.0.1', desc: 'rename the shell entry export to createShell', files: ['src/main.ts', 'src/plugins/shell.ts'] },

  { pkg: '@platform/testing', version: '1.8.1', desc: 'replace deprecated test globals', files: ['vitest.config.ts', 'src/setupTests.ts'] },
  { pkg: '@platform/testing', version: '1.8.4', desc: 'move the test setup file into the config', files: ['vitest.config.ts'] },
  { pkg: '@platform/testing', version: '1.9.0', desc: 'convert external snapshots to inline snapshots', files: ['src/components/__tests__/AppShell.spec.ts'] },
  { pkg: '@platform/testing', version: '1.9.2', desc: 'drop the hand-rolled dom polyfill import', files: ['src/setupTests.ts'] },
  { pkg: '@platform/testing', version: '1.9.6', desc: 'rename spec files to the *.spec.ts convention', files: ['src/components/__tests__/AppShell.spec.ts'] },
  { pkg: '@platform/testing', version: '1.10.0', desc: 'switch the coverage provider config key', files: ['vitest.config.ts'] },
  { pkg: '@platform/testing', version: '2.0.0', desc: 'remove the global test timeout override', files: ['vitest.config.ts'] },
  { pkg: '@platform/testing', version: '2.0.1', desc: 'replace the mount helper with renderComponent', files: ['src/test/render.ts', 'src/components/__tests__/AppShell.spec.ts'] },

  { pkg: '@platform/lint', version: '1.8.1', desc: 'move lint preset to flat config', files: ['eslint.config.js', 'package.json'] },
  { pkg: '@platform/lint', version: '1.8.4', desc: 'delete the legacy rc file', files: ['.eslintrc.cjs'] },
  { pkg: '@platform/lint', version: '1.9.0', desc: 'enable the accessibility rule set', files: ['eslint.config.js'] },
  { pkg: '@platform/lint', version: '1.9.2', desc: 'replace the deprecated import resolver', files: ['eslint.config.js'] },
  { pkg: '@platform/lint', version: '1.9.6', desc: 'move ignore patterns into the config', files: ['.eslintignore', 'eslint.config.js'] },
  { pkg: '@platform/lint', version: '1.10.0', desc: 'pin the formatter to the workspace version', files: ['package.json'] },
  { pkg: '@platform/lint', version: '2.0.0', desc: 'drop rules the framework preset now owns', files: ['eslint.config.js'] },
  { pkg: '@platform/lint', version: '2.0.1', desc: 'add the floating-promise rule and autofix it', files: ['eslint.config.js', 'tsconfig.json'] },

  { pkg: '@platform/build', version: '1.8.1', desc: 'move the build target into the workspace config', files: ['vite.config.ts', 'project.json'] },
  { pkg: '@platform/build', version: '1.8.4', desc: 'replace define() with import.meta.env', files: ['vite.config.ts', 'src/api/client.ts'] },
  { pkg: '@platform/build', version: '1.9.0', desc: 'switch the dev proxy to the shared helper', files: ['vite.config.ts'] },
  { pkg: '@platform/build', version: '1.9.6', desc: 'move path aliases into tsconfig', files: ['tsconfig.json', 'vite.config.ts'] },
  { pkg: '@platform/build', version: '1.10.0', desc: 'drop the commonjs interop plugin', files: ['vite.config.ts', 'package.json'] },
  { pkg: '@platform/build', version: '2.0.0', desc: 'raise the browser target to the supported baseline', files: ['vite.config.ts', '.browserslistrc'] },
  { pkg: '@platform/build', version: '2.0.1', desc: 'emit the manifest into the new output folder', files: ['vite.config.ts', 'project.json'] },

  { pkg: '@platform/design-system', version: '1.8.4', desc: 'add the tag name as a class on typography elements', files: ['src/components/AppShell.vue', 'src/views/SettingsView.vue'], probe: 'tags' },
  { pkg: '@platform/design-system', version: '1.9.0', desc: 'replace the retired spacing tokens', files: ['src/styles/tokens.css'] },
  { pkg: '@platform/design-system', version: '1.9.2', desc: 'rename icon components to the new prefix', files: ['src/views/OrdersView.vue', 'src/views/DashboardView.vue'] },
  { pkg: '@platform/design-system', version: '1.9.6', desc: 'move the theme import to the package entry point', files: ['src/main.ts', 'src/styles/tokens.css'] },
  { pkg: '@platform/design-system', version: '2.0.0', desc: 'drop the retired grid mixin', files: ['src/styles/layout.css', 'src/styles/typography.css'] },
  { pkg: '@platform/design-system', version: '2.0.1', desc: 'switch buttons to the variant prop', files: ['src/views/OrdersView.vue', 'src/views/DashboardView.vue'] },

  { pkg: '@platform/i18n', version: '1.8.1', desc: 'move message catalogues out of the bundle', files: ['src/i18n/index.ts', 'vite.config.ts'] },
  { pkg: '@platform/i18n', version: '1.9.0', desc: 'replace the global t() with useI18n()', files: ['src/views/ArchiveView.vue', 'src/views/OrdersView.vue'] },
  { pkg: '@platform/i18n', version: '1.9.2', desc: 'add the locale fallback chain', files: ['src/i18n/index.ts'] },
  { pkg: '@platform/i18n', version: '1.9.6', desc: 'rename translation keys to the dotted scheme', files: ['src/i18n/messages/en.json', 'src/i18n/messages/nl.json'] },
  { pkg: '@platform/i18n', version: '1.10.4', desc: 'lazy-load every non-default locale', files: ['src/i18n/index.ts'] },
  { pkg: '@platform/i18n', version: '2.0.0', desc: 'remove the synchronous locale loader', files: ['src/i18n/index.ts', 'src/main.ts'] },

  { pkg: '@platform/ci', version: '1.8.4', desc: 'add CI cache step', files: ['.ci/pipeline.yml'] },
  { pkg: '@platform/ci', version: '1.9.0', desc: 'split lint and test into parallel jobs', files: ['.ci/pipeline.yml'] },
  { pkg: '@platform/ci', version: '1.9.6', desc: 'pin the runner image to the supported tag', files: ['.ci/pipeline.yml'] },
  { pkg: '@platform/ci', version: '1.10.0', desc: 'publish the coverage artefact', files: ['.ci/pipeline.yml'] },
  { pkg: '@platform/ci', version: '2.0.1', desc: 'move the build matrix into the shared template', files: ['.ci/pipeline.yml', '.ci/templates/build.yml'] },

  { pkg: '@platform/observability', version: '2.0.0', desc: 'register the telemetry plugin in the entry point', files: ['src/main.ts', 'src/telemetry/index.ts'] },
  { pkg: '@platform/observability', version: '2.0.0', desc: 'move the sample rate into configuration', files: ['src/telemetry/index.ts', 'src/config/env.ts'] },
  { pkg: '@platform/observability', version: '2.0.0', desc: 'replace the retired tracer factory', files: ['src/telemetry/index.ts'] },
  { pkg: '@platform/observability', version: '2.0.1', desc: 'drop the console reporter from production builds', files: ['src/telemetry/index.ts', 'vite.config.ts'] },
  { pkg: '@platform/observability', version: '2.0.1', desc: 'add the release tag to every span', files: ['src/telemetry/index.ts', 'package.json'] },
]

/** Package order in the ledger, which is also the order they are applied in. */
const PACKAGES = [...new Set(LEDGER.map((entry) => entry.pkg))]

/** A migration at 2.x can only run once the 2.0.0 boundary has been crossed. */
const acrossBoundary = (entry: LedgerEntry) => entry.version.startsWith('2.')

const ids = (predicate: (entry: LedgerEntry) => boolean) =>
  LEDGER.map((entry, index) => (predicate(entry) ? index : -1)).filter((index) => index >= 0)

function distinctFiles(indices: number[]): number {
  const files = new Set<string>()
  for (const index of indices) for (const file of LEDGER[index].files) files.add(file)
  return files.size
}

// ---------------------------------------------------------------------------
// Two of these 54 rows are real
//
// The router annotation and the design-system class change are the codemods the
// last third of the talk takes apart. Their edit counts are computed here, in
// the browser, by the same functions those slides use — so if the transform
// library changes, this ledger changes with it. A parse failure has to surface
// as a message in the panel, never as an exception that blanks the slide.
// ---------------------------------------------------------------------------

const probes = computed(() => {
  try {
    const routes = routesAst(ROUTES_CLEAN)
    if (routes.error) throw new Error(routes.error)
    const tags = vueTagClasses(VUE_NESTED)
    if (tags.error) throw new Error(tags.error)
    return { error: null as string | null, routes: routes.edits.length, tags: tags.edits.length }
  } catch (error: any) {
    return {
      error: `the two live codemods did not run: ${error?.message ?? String(error)}`,
      routes: 0,
      tags: 0,
    }
  }
})

function probeLabel(entry: LedgerEntry): string {
  if (!entry.probe || probes.value.error) return ''
  const edits = entry.probe === 'routes' ? probes.value.routes : probes.value.tags
  return `taken apart later in this talk · ${edits} edits, parsed live`
}

// ---------------------------------------------------------------------------
// The scripted run
// ---------------------------------------------------------------------------

type Tone = 'cmd' | 'out' | 'dim' | 'head' | 'ok' | 'bad' | 'plus'
type Outcome = 'complete' | 'partial'

interface Line {
  text: string
  tone: Tone
}

interface Step {
  lines: Line[]
  /** Ledger rows this step applies. */
  apply?: number[]
  commit?: boolean
  outcome?: Outcome
}

const COMMANDS = [
  { n: '1/4', label: 'fetch framework updates', cmd: 'npx framework-cli migrate latest' },
  { n: '2/4', label: 'apply framework codemods', cmd: 'npx framework-cli migrate --run-migrations' },
  { n: '3/4', label: 'fetch platform updates', cmd: 'npx @platform/cli migrate latest' },
  { n: '4/4', label: 'apply platform codemods', cmd: 'npx @platform/cli migrate --run-migrations' },
]

/**
 * Everything in the terminal is padded to a 48-column budget, which is what
 * fits the left pane at 15px without a horizontal scrollbar on a projector.
 */
function pad(text: string, width: number): string {
  return text.length >= width ? `${text} ` : text + ' '.repeat(width - text.length)
}

const blank: Line = { text: '', tone: 'out' }
const out = (text: string): Line => ({ text, tone: 'out' })
const dim = (text: string): Line => ({ text, tone: 'dim' })
/** `detect  installed      @platform/cli 1.8.0` */
const field = (label: string, name: string, value: string): Line =>
  out(pad(label, 8) + pad(name, 15) + value)
/** `commit  chore(platform): update to 2.0.1` */
const note = (label: string, value: string, tone: Tone = 'out'): Line => ({
  text: pad(label, 8) + value,
  tone,
})

/** The four commands, one step each, so the speaker can talk over every one. */
function commandSteps(): Step[] {
  return COMMANDS.map((command) => ({
    lines: [out(`  ${command.n}  ${command.label}`), { text: `    $ ${command.cmd}`, tone: 'cmd' }],
  }))
}

function packageLine(pkg: string, count: number): Line {
  return { text: `    + ${pad(pkg, 24)}${count} codemod${count === 1 ? '' : 's'}`, tone: 'plus' }
}

/** One step per package group, or `perStep` packages at a time. */
function ledgerSteps(indices: number[], perStep: number): Step[] {
  const groups = PACKAGES.map((pkg) => ({
    pkg,
    rows: indices.filter((index) => LEDGER[index].pkg === pkg),
  })).filter((group) => group.rows.length > 0)

  const steps: Step[] = []
  for (let at = 0; at < groups.length; at += perStep) {
    const slice = groups.slice(at, at + perStep)
    steps.push({
      lines: slice.map((group) => packageLine(group.pkg, group.rows.length)),
      apply: slice.flatMap((group) => group.rows),
    })
  }
  return steps
}

function header(app: string, version: string): Step {
  return {
    lines: [
      { text: '$ npm run update:platform', tone: 'cmd' },
      blank,
      dim(`> ${app}@${version} update:platform`),
      dim('> npx --yes @platform/updater@latest'),
    ],
  }
}

function buildRun(): Step[] {
  const all = LEDGER.map((_, index) => index)
  return [
    header('app-214', '1.8.0'),
    {
      lines: [
        blank,
        field('detect', 'product type', 'web application (vue)'),
        field('detect', 'toolkit scope', '@platform/ · 11 packages'),
        field('detect', 'installed', '@platform/cli 1.8.0'),
        field('detect', 'latest', '@platform/cli 2.0.1'),
      ],
    },
    {
      lines: [
        blank,
        field('plan', 'boundaries', '1 major · 1.8.0 -> 2.0.1'),
        field('plan', 'rounds', '1 · never skip a major'),
      ],
    },
    {
      lines: [blank, { text: 'round 1/1 · 1.8.0 -> 2.0.1', tone: 'head' }],
    },
    ...commandSteps(),
    ...ledgerSteps(all, 1),
    {
      lines: [
        blank,
        note('write', `${distinctFiles(all)} files changed`),
        note('commit', 'chore(platform): update to 2.0.1'),
        note('outcome', 'complete — exit 0', 'ok'),
      ],
      commit: true,
      outcome: 'complete',
    },
  ]
}

function buildGate(unblocked: boolean): Step[] {
  const below = ids((entry) => !acrossBoundary(entry))
  const above = ids(acrossBoundary)
  const all = LEDGER.map((_, index) => index)

  const steps: Step[] = [
    header('app-071', '1.8.0'),
    {
      lines: [
        blank,
        field('detect', 'product type', 'web application (vue)'),
        field('detect', 'toolkit scope', '@platform/ · 11 packages'),
        field('detect', 'installed', '@platform/cli 1.8.0'),
        field('detect', 'latest', '@platform/cli 2.0.1'),
        field('detect', 'gates', '1 · on the 2.0.0 boundary'),
      ],
    },
    {
      lines: [
        blank,
        field('plan', 'boundaries', '1 major · 2.0.0'),
        field('plan', 'rounds', '2 · 1.x first, then cross'),
        field('plan', 'gate', 'checked before the cross'),
      ],
    },
    {
      lines: [blank, { text: 'round 1/2 · 1.8.0 -> 1.10.4 · no boundary', tone: 'head' }],
    },
    ...commandSteps(),
    ...ledgerSteps(below, 4),
    {
      lines: [
        blank,
        note('write', `${distinctFiles(below)} files changed`),
        note('commit', 'chore(platform): update to 1.10.4'),
      ],
      commit: true,
    },
    {
      lines: [blank, { text: 'round 2/2 · 1.10.4 -> 2.0.1 · major boundary', tone: 'head' }],
    },
  ]

  if (!unblocked) {
    steps.push({
      lines: [
        out('  gate  e2e-runner-removed'),
        { text: '  BLOCKED  the deprecated end-to-end runner is', tone: 'bad' },
        { text: '           still installed in this repository.', tone: 'bad' },
        out('  found    legacy-e2e-runner 10.3.1 (devDeps)'),
        out('           14 spec files under e2e/'),
      ],
    })
    steps.push({
      lines: [
        blank,
        out('  why      we can delete the package for you.'),
        out('           we cannot port fourteen specs and'),
        out('           know they still assert the same'),
        out('           thing. requiring a conscious action'),
        out('           keeps the team aware that it has to'),
        out('           act.'),
        blank,
        out('  next     port e2e/, remove the package, then'),
        out('           run this script again.'),
      ],
    })
    steps.push({
      lines: [
        blank,
        dim('  nothing in round 2 was applied.'),
        dim('  round 1 is kept, written and committed.'),
        note('outcome', 'partial — exit 0', 'bad'),
      ],
      outcome: 'partial',
    })
    return steps
  }

  steps.push({
    lines: [
      { text: `  gate  ${pad('e2e-runner-removed', 26)}PASS`, tone: 'ok' },
      out('        no legacy runner in package.json;'),
      out('        14 specs ported by hand last sprint.'),
    ],
  })
  steps.push(...commandSteps())
  steps.push(...ledgerSteps(above, 4))
  steps.push({
    lines: [
      blank,
      note('write', `${distinctFiles(all)} files changed in total`),
      note('commit', 'chore(platform): update to 2.0.1'),
      note('outcome', 'complete — exit 0', 'ok'),
    ],
    commit: true,
    outcome: 'complete',
  })
  return steps
}

// ---------------------------------------------------------------------------
// Playback
// ---------------------------------------------------------------------------

const blockerRemoved = ref(false)
const cursor = ref(0)
const playing = ref(false)
const termRef = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

const steps = computed<Step[]>(() =>
  props.mode === 'gate' ? buildGate(blockerRemoved.value) : buildRun(),
)

const taken = computed(() => steps.value.slice(0, cursor.value))
const shown = computed<Line[]>(() => taken.value.flatMap((step) => step.lines))
const done = computed(() => cursor.value >= steps.value.length)

const applied = computed(() => {
  const set = new Set<number>()
  for (const step of taken.value) for (const index of step.apply ?? []) set.add(index)
  return set
})

const tally = computed(() => {
  const indices = [...applied.value]
  const packages = new Set(indices.map((index) => LEDGER[index].pkg))
  return {
    codemods: indices.length,
    packages: packages.size,
    files: distinctFiles(indices),
    commits: taken.value.filter((step) => step.commit).length,
  }
})

const groups = computed(() =>
  PACKAGES.map((pkg) => ({
    pkg,
    rows: LEDGER.filter((entry, index) => entry.pkg === pkg && applied.value.has(index)),
  })).filter((group) => group.rows.length > 0),
)

const outcome = computed<Outcome | null>(() => {
  for (let at = taken.value.length - 1; at >= 0; at -= 1) {
    const step = taken.value[at]
    if (step.outcome) return step.outcome
  }
  return null
})

const app = computed(() => (props.mode === 'gate' ? 'app-071' : 'app-214'))

const playLabel = computed(() => {
  if (playing.value) return 'Pause'
  if (done.value) return 'Replay'
  return cursor.value === 0 ? 'Start' : 'Resume'
})

function stop() {
  if (timer !== undefined) clearInterval(timer)
  timer = undefined
  playing.value = false
}

function advance() {
  if (done.value) {
    stop()
    return
  }
  cursor.value += 1
  if (done.value) stop()
}

function play() {
  stop()
  if (done.value) cursor.value = 0
  playing.value = true
  timer = setInterval(advance, Math.max(120, props.stepMs))
}

function togglePlay() {
  if (playing.value) stop()
  else play()
}

function step() {
  stop()
  advance()
}

function skipToEnd() {
  stop()
  cursor.value = steps.value.length
}

function reset() {
  stop()
  cursor.value = 0
  blockerRemoved.value = false
  nextTick(() => {
    if (termRef.value) termRef.value.scrollTop = 0
  })
}

/** Remove the blocker (or put it back) and replay from the top. */
function toggleBlocker() {
  stop()
  blockerRemoved.value = !blockerRemoved.value
  cursor.value = 0
  nextTick(play)
}

watch(cursor, () => {
  nextTick(() => {
    const el = termRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
})

watch(() => props.mode, reset)

onBeforeUnmount(stop)
</script>

<template>
  <section class="run" :class="`run--${mode}`">
    <div class="run__body">
      <div class="pane pane--term">
        <h2 class="pane__h">
          Terminal
          <span class="pane__sub">{{ app }}</span>
        </h2>
        <pre
          ref="termRef"
          class="term"
          tabindex="0"
          role="log"
          aria-live="polite"
          aria-label="Updater terminal output"
        ><span v-if="cursor === 0" class="ln ln--dim">{{ '$ ' }}</span><span v-for="(line, index) in shown" :key="index" class="ln" :class="`ln--${line.tone}`">{{ line.text }}{{ '\n' }}</span><span v-if="!done" class="caret" aria-hidden="true">▍</span></pre>
      </div>

      <div class="pane pane--ledger">
        <h2 class="pane__h">
          Migration ledger
          <span v-if="outcome" class="badge" :class="`badge--${outcome}`">
            {{ outcome === 'complete' ? 'complete — exit 0' : 'partial — exit 0' }}
          </span>
          <span v-else class="pane__sub">grouped by plugin package</span>
        </h2>

        <p class="tally" aria-live="polite">
          <strong>{{ tally.codemods }}</strong> codemods
          <span aria-hidden="true">·</span>
          <strong>{{ tally.packages }}</strong> packages
          <span aria-hidden="true">·</span>
          <strong>{{ tally.files }}</strong> files
          <span aria-hidden="true">·</span>
          <strong>{{ tally.commits }}</strong> {{ tally.commits === 1 ? 'commit' : 'commits' }}
        </p>

        <p v-if="probes.error" class="fault">{{ probes.error }}</p>

        <div
          class="ledger"
          tabindex="0"
          role="group"
          aria-label="Migrations applied by this run, grouped by package"
        >
          <p v-if="groups.length === 0" class="ledger__empty">
            Empty until the run applies a package. It fills eight times.
          </p>
          <ul v-else class="ledger__groups">
            <li v-for="group in groups" :key="group.pkg" class="grp">
              <p class="grp__name">
                {{ group.pkg }}
                <span class="grp__count">{{ group.rows.length }}</span>
              </p>
              <ul class="grp__rows">
                <li v-for="row in group.rows" :key="`${row.pkg}-${row.version}-${row.desc}`" class="row">
                  <span class="row__v">{{ row.version }}</span>
                  <span class="row__d">
                    {{ row.desc }}
                    <span v-if="probeLabel(row)" class="row__probe">{{ probeLabel(row) }}</span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="foot">
      <button type="button" class="btn btn--go" @click="togglePlay">{{ playLabel }}</button>
      <button type="button" class="btn" :disabled="done" @click="step">Step</button>
      <button type="button" class="btn" :disabled="done" @click="skipToEnd">Skip to end</button>
      <button type="button" class="btn" @click="reset">Reset</button>
      <button
        v-if="mode === 'gate'"
        type="button"
        class="btn btn--toggle"
        :aria-pressed="blockerRemoved"
        @click="toggleBlocker"
      >
        <span class="dot" aria-hidden="true"></span>
        Blocker removed by hand
      </button>

      <span class="foot__spacer" aria-hidden="true"></span>

      <span class="foot__count">step {{ Math.min(cursor, steps.length) }} / {{ steps.length }}</span>
    </div>
  </section>
</template>

<style scoped>
.run {
  /* Definite height, not 100%: the slide's content box is auto-height, so a
     percentage never resolves and the inner flex chain grows unbounded. */
  height: 385px;
  max-height: 385px;
  --run-mono: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  --run-border: var(--border, #39404d);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
  /* SIZING CONTRACT: both slides that use this component carry an <h1>, so the
     budget is 860 x 385 (see the header of style.css). Fixed rather than 100%
     or auto: the body and the two panes are the only things that flex, so no
     interaction state can push the panel past the bottom of the slide. */
  color: var(--text, #e9ecef);
}

.run__body {
  display: grid;
  /* The terminal needs 48 monospace columns at 15px (~445px incl. padding);
     the ledger takes everything that is left. */
  grid-template-columns: minmax(0, 462px) minmax(0, 1fr);
  /* minmax(0, 1fr) rather than the implicit `auto`: an auto row is sized to
     max-content, so the 54-row ledger would push straight through the box. */
  grid-template-rows: minmax(0, 1fr);
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.pane__h {
  margin: 0;
  /* Floor for a heading inside a demo. Do not take this below 19px. */
  font-size: 19px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text, #e9ecef);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  min-height: 24px;
}

.pane__sub {
  /* Floor for any text in this deck. Do not take this below 14px. */
  font-size: 14px;
  font-weight: 400;
  color: var(--dim, #adb5bd);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- terminal ---- */
.term {
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--run-border);
  border-radius: 8px;
  background-color: #0b0d12;
  padding: 8px 10px;
  font-family: var(--run-mono);
  /* The deck's style.css sets `.slidev-layout pre { font-size: 1.15rem !important }`,
     which would blow this pane apart. Scoped + important beats it on specificity. */
  font-size: 15px !important;
  line-height: 1.5 !important;
  white-space: pre;
  color: var(--text, #e9ecef);
  tab-size: 2;
}

.term:focus-visible {
  outline: 3px solid var(--yellow, #ffd43b);
  outline-offset: 2px;
}

.ln {
  display: inline;
}
.ln--out {
  color: var(--text, #e9ecef);
}
.ln--dim {
  color: var(--dim, #adb5bd);
}
.ln--cmd {
  color: var(--yellow, #ffd43b);
}
.ln--head {
  color: var(--purple, #b197fc);
  font-weight: 700;
}
.ln--plus {
  color: var(--blue, #74c0fc);
}
.ln--ok {
  color: var(--green, #69db7c);
  font-weight: 700;
}
.ln--bad {
  color: var(--red, #ff8787);
  font-weight: 700;
}

.caret {
  color: var(--blue, #74c0fc);
}
@media (prefers-reduced-motion: no-preference) {
  .caret {
    animation: run-blink 1.1s steps(1, end) infinite;
  }
}
@keyframes run-blink {
  50% {
    opacity: 0.2;
  }
}

/* ---- ledger ---- */
.tally {
  margin: 0;
  font-size: 15px;
  line-height: 1.25;
  color: var(--dim, #adb5bd);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tally strong {
  font-size: 19px;
  font-weight: 700;
  color: var(--blue, #74c0fc);
}

.fault {
  margin: 0;
  border: 1px solid var(--red, #ff8787);
  border-radius: 6px;
  background-color: #33222a;
  color: #ffc9c9;
  font-size: 14px;
  line-height: 1.3;
  padding: 3px 7px;
}

.ledger {
  flex: 1;
  min-height: 0;
  /* The one sanctioned scroll region: 54 rows in 8 groups never fit 385px.
     Its height is whatever the fixed body leaves, so it cannot grow the panel. */
  overflow: auto;
  border: 1px solid var(--run-border);
  border-radius: 8px;
  background-color: var(--panel, #171a21);
  padding: 6px 8px;
}

.ledger:focus-visible {
  outline: 3px solid var(--yellow, #ffd43b);
  outline-offset: 2px;
}

.ledger__empty {
  margin: 0;
  font-size: 15px;
  line-height: 1.35;
  color: var(--dim, #adb5bd);
}

.ledger__groups,
.grp__rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.grp + .grp {
  margin-top: 5px;
  border-top: 1px solid var(--run-border);
  padding-top: 4px;
}

.grp__name {
  margin: 0 0 1px;
  font-family: var(--run-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--blue, #74c0fc);
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.grp__count {
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #e9ecef);
  background-color: #232833;
  border-radius: 999px;
  padding: 0 7px;
}

.row {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 6px;
  padding: 1px 0;
  align-items: baseline;
}

.row__v {
  font-family: var(--run-mono);
  font-size: 15px;
  color: var(--dim, #adb5bd);
  font-variant-numeric: tabular-nums;
}

.row__d {
  font-size: 15px;
  line-height: 1.3;
  color: var(--text, #e9ecef);
}

.row__probe {
  display: block;
  font-size: 14px;
  line-height: 1.25;
  color: var(--purple, #b197fc);
}

/* ---- controls ---- */
.foot {
  display: flex;
  align-items: center;
  gap: 6px;
  /* nowrap: a wrapped second row of controls is exactly what used to push the
     panel off the bottom. Everything measures ~740px inside an 860px box. */
  flex-wrap: nowrap;
  flex: 0 0 auto;
}

.foot__spacer {
  flex: 1;
}

.foot__count {
  font-family: var(--run-mono);
  font-size: 15px;
  color: var(--dim, #adb5bd);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.btn {
  font: inherit;
  font-size: 15px;
  line-height: 1.2;
  font-weight: 600;
  white-space: nowrap;
  color: var(--text, #e9ecef);
  /* Longhand on purpose: the reset's `background-color: transparent` eats the
     `background` shorthand. */
  background-color: #232833;
  border: 1px solid var(--run-border);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background-color: #2c323f;
}

.btn:focus-visible {
  outline: 3px solid var(--yellow, #ffd43b);
  outline-offset: 2px;
}

.btn:disabled {
  color: var(--dim, #adb5bd);
  cursor: not-allowed;
  opacity: 0.75;
}

.btn--go {
  background-color: #1d2b3a;
  border-color: var(--blue, #74c0fc);
  color: var(--blue, #74c0fc);
}

.btn--go:hover:not(:disabled) {
  background-color: #23364a;
}

.btn--toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn--toggle .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid var(--dim, #adb5bd);
  background-color: transparent;
}

.btn--toggle[aria-pressed='true'] {
  background-color: #17301f;
  border-color: var(--green, #69db7c);
  color: var(--green, #69db7c);
}

.btn--toggle[aria-pressed='true'] .dot {
  background-color: var(--green, #69db7c);
  border-color: var(--green, #69db7c);
}

.badge {
  font-family: var(--run-mono);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  border-radius: 6px;
  padding: 1px 7px;
  white-space: nowrap;
}

.badge--complete {
  background-color: #17301f;
  color: var(--green, #69db7c);
  border: 1px solid var(--green, #69db7c);
}

.badge--partial {
  background-color: #3a2f16;
  color: var(--yellow, #ffd43b);
  border: 1px solid var(--yellow, #ffd43b);
}
</style>
