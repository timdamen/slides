<script setup lang="ts">
/**
 * BreakEven — the sixty seconds where the talk argues against itself.
 *
 * Three numbers the room can shout at me, one fixed assumption printed on
 * screen, and a verdict banner that opens on the honest answer for most of the
 * audience: DON'T BUILD THIS. Drag applications down to twelve and the banner
 * says it out loud. Push it back to three hundred and it flips.
 *
 * Every constant is visible. This is arithmetic I want argued with from the
 * floor, not a chart anybody has to take on trust.
 *
 * Stage rules honoured here: no Slidev click state, no timers, no randomness,
 * no clock. Every control is a real button or a labelled range input, there is
 * always a Reset, and the whole computation is wrapped so a bad number renders
 * as an inline message instead of blanking the slide.
 */
import { computed, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Applications in the estate. The number the speaker drags. */
    initialApps?: number
    /** Engineer-hours one application costs for one change. */
    initialHours?: number
    /** Changes pushed across the estate per year. */
    initialChanges?: number
    /** The fixed assumption: what one platform team costs, per year. */
    teamEngineerYears?: number
    /** Productive hours in one engineer-year. Printed on screen. */
    hoursPerEngineerYear?: number
    /** Upper bound of the applications slider. */
    maxApps?: number
  }>(),
  {
    initialApps: 300,
    initialHours: 4,
    initialChanges: 12,
    teamEngineerYears: 5,
    hoursPerEngineerYear: 1800,
    maxApps: 400,
  },
)

/* ---- state ---- */
const apps = ref(props.initialApps)
const hours = ref(props.initialHours)
const changes = ref(props.initialChanges)

const ids = { apps: useId(), hours: useId(), changes: useId() }

const APPS = { min: 1, max: props.maxApps, step: 10 }
const HOURS = { min: 0.5, max: 40, step: 0.5 }
const CHANGES = { min: 1, max: 52, step: 1 }

/** The jump targets. 12 is the one the speaker actually uses. */
const APP_PRESETS = [5, 12, 40, 120, 300]

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))

/** Steppers clamp rather than disable, so nothing is ever un-clickable on stage. */
function bump(which: 'apps' | 'hours' | 'changes', direction: 1 | -1) {
  if (which === 'apps') apps.value = clamp(apps.value + direction * APPS.step, APPS.min, APPS.max)
  else if (which === 'hours')
    hours.value = clamp(hours.value + direction * HOURS.step, HOURS.min, HOURS.max)
  else changes.value = clamp(changes.value + direction * CHANGES.step, CHANGES.min, CHANGES.max)
}

function reset() {
  apps.value = props.initialApps
  hours.value = props.initialHours
  changes.value = props.initialChanges
}

/* ---- formatting ---- */
const int = (value: number) => Math.round(value).toLocaleString('en-US')
const trim = (value: number) => (value % 1 === 0 ? String(value) : value.toFixed(1))
const years = (value: number) => value.toFixed(1)

/* ---- the model ---- */
interface Model {
  error: string | null
  toilHours: number
  toilYears: number
  teamYears: number
  teamHours: number
  /** Applications at which manual toil overtakes the platform team. */
  breakEvenApps: number | null
  pays: boolean
}

/**
 * Wrapped on purpose. There is no parser in this demo, but a prop typed by a
 * slide author can still arrive as a string or a zero, and a thrown error here
 * would blank the slide mid-sentence.
 */
const model = computed<Model>(() => {
  try {
    const a = clamp(Number(apps.value), APPS.min, APPS.max)
    const h = clamp(Number(hours.value), HOURS.min, HOURS.max)
    const c = clamp(Number(changes.value), CHANGES.min, CHANGES.max)
    const perYear = Number(props.hoursPerEngineerYear)
    const teamYears = Number(props.teamEngineerYears)

    if (!Number.isFinite(perYear) || perYear <= 0) {
      throw new Error(`hoursPerEngineerYear must be a positive number, got ${props.hoursPerEngineerYear}`)
    }
    if (!Number.isFinite(teamYears) || teamYears <= 0) {
      throw new Error(`teamEngineerYears must be a positive number, got ${props.teamEngineerYears}`)
    }

    const toilHours = a * h * c
    const teamHours = teamYears * perYear
    const perAppYear = h * c

    return {
      error: null,
      toilHours,
      toilYears: toilHours / perYear,
      teamYears,
      teamHours,
      breakEvenApps: perAppYear > 0 ? Math.ceil(teamHours / perAppYear) : null,
      pays: toilHours > teamHours,
    }
  } catch (error: any) {
    return {
      error: error?.message ?? String(error),
      toilHours: 0,
      toilYears: 0,
      teamYears: 0,
      teamHours: 0,
      breakEvenApps: null,
      pays: false,
    }
  }
})

const pays = computed(() => model.value.error === null && model.value.pays)

/* ---- readouts ---- */
const exprText = computed(
  () => `${int(apps.value)} apps × ${trim(hours.value)} h × ${trim(changes.value)}/yr`,
)
const hoursText = computed(() => `${int(model.value.toilHours)} hours`)
const yearsText = computed(() => `${years(model.value.toilYears)} engineer-years`)

const breakEvenText = computed(() =>
  model.value.breakEvenApps === null ? '—' : int(model.value.breakEvenApps),
)

const verdictWord = computed(() => (pays.value ? 'NOW IT PAYS FOR ITSELF' : "DON'T BUILD THIS"))
const verdictSub = computed(() =>
  pays.value
    ? `${yearsText.value} of manual toil against ${years(model.value.teamYears)} for the platform team`
    : 'go write the tickets',
)

/** One sentence, announced only when the numbers actually change. */
const spoken = computed(() =>
  model.value.error
    ? `The model could not be computed: ${model.value.error}`
    : `${exprText.value} equals ${hoursText.value}, ${yearsText.value}. Platform team costs ${years(model.value.teamYears)} engineer-years. Verdict: ${pays.value ? 'now it pays for itself' : "don't build this, go write the tickets"}.`,
)
</script>

<template>
  <div class="be">
    <div class="be__controls">
      <!-- applications -->
      <div class="ctl ctl--lead">
        <div class="ctl__head">
          <label class="ctl__label" :for="ids.apps">applications</label>
          <span class="ctl__value" aria-hidden="true">{{ int(apps) }}</span>
        </div>
        <div class="ctl__row">
          <button
            type="button"
            class="step"
            :aria-label="`fewer applications, ${APPS.step} at a time`"
            @click="bump('apps', -1)"
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            :id="ids.apps"
            v-model.number="apps"
            class="ctl__range"
            type="range"
            :min="APPS.min"
            :max="APPS.max"
            step="1"
            :aria-valuetext="`${apps} applications`"
          />
          <button
            type="button"
            class="step"
            :aria-label="`more applications, ${APPS.step} at a time`"
            @click="bump('apps', 1)"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <div class="presets">
          <button
            v-for="preset in APP_PRESETS"
            :key="preset"
            type="button"
            class="preset"
            :class="{ 'preset--on': apps === preset }"
            :aria-pressed="apps === preset"
            :aria-label="`set the estate to ${preset} applications`"
            @click="apps = preset"
          >
            {{ preset }}
          </button>
        </div>
      </div>

      <!-- hours per app per change -->
      <div class="ctl">
        <div class="ctl__head">
          <label class="ctl__label" :for="ids.hours">hours per app, per change</label>
          <span class="ctl__value" aria-hidden="true">{{ trim(hours) }}</span>
        </div>
        <div class="ctl__row">
          <button
            type="button"
            class="step"
            aria-label="fewer hours per app per change"
            @click="bump('hours', -1)"
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            :id="ids.hours"
            v-model.number="hours"
            class="ctl__range"
            type="range"
            :min="HOURS.min"
            :max="HOURS.max"
            :step="HOURS.step"
            :aria-valuetext="`${trim(hours)} hours per application per change`"
          />
          <button
            type="button"
            class="step"
            aria-label="more hours per app per change"
            @click="bump('hours', 1)"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <!-- changes per year -->
      <div class="ctl">
        <div class="ctl__head">
          <label class="ctl__label" :for="ids.changes">changes per year</label>
          <span class="ctl__value" aria-hidden="true">{{ trim(changes) }}</span>
        </div>
        <div class="ctl__row">
          <button
            type="button"
            class="step"
            aria-label="fewer changes per year"
            @click="bump('changes', -1)"
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            :id="ids.changes"
            v-model.number="changes"
            class="ctl__range"
            type="range"
            :min="CHANGES.min"
            :max="CHANGES.max"
            :step="CHANGES.step"
            :aria-valuetext="`${trim(changes)} changes per year`"
          />
          <button
            type="button"
            class="step"
            aria-label="more changes per year"
            @click="bump('changes', 1)"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </div>

    <p v-if="model.error" class="be__error">{{ model.error }}</p>

    <p v-else class="be__math">
      <span class="be__expr">{{ exprText }}</span>
      <span class="be__op">=</span>
      <span class="be__hours">{{ hoursText }}</span>
      <span class="be__op">=</span>
      <span class="be__years">{{ yearsText }}</span>
    </p>

    <p class="sr-only" aria-live="polite">{{ spoken }}</p>

    <div class="verdict" :class="pays ? 'verdict--pays' : 'verdict--dont'">
      <div class="verdict__main">
        <strong class="verdict__word">{{ verdictWord }}</strong>
        <span class="verdict__sub">{{ verdictSub }}</span>
      </div>
      <div class="verdict__cross">
        <span class="verdict__crossn">{{ breakEvenText }}</span>
        <span class="verdict__crossl">apps to break even</span>
      </div>
    </div>

    <div class="be__foot">
      <p class="be__assume">
        fixed: one platform team = <b>{{ trim(props.teamEngineerYears) }} engineer-years</b> a year ·
        1 engineer-year = <b>{{ int(props.hoursPerEngineerYear) }} hours</b>
      </p>
      <button type="button" class="reset" @click="reset()">Reset</button>
    </div>
  </div>
</template>

<style scoped>
/*
 * Fits the 860 x 385 budget of a slide that already has an <h1>.
 * No height: 100% here — the layout's content box is 472px tall and the h1
 * eats ~87 of it, so a 100% child hangs off the bottom by design.
 */
.be {
  /* Definite height, not 100%: the slide's content box is auto-height, so a
     percentage never resolves and the inner flex chain grows unbounded. */
  height: 385px;
  max-height: 385px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  color: var(--text, #e9ecef);
}

/* ---- controls ---- */
.be__controls {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 0.8rem;
  align-items: stretch;
}

.ctl {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
  padding: 0.45rem 0.7rem 0.5rem;
  border: 1px solid var(--border, #39404d);
  border-radius: 9px;
  background-color: var(--panel, #171a21);
}
.ctl--lead {
  border-color: var(--blue, #74c0fc);
}

.ctl__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}

.ctl__label {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 1.05rem;
  line-height: 1.15;
  font-weight: 600;
  color: var(--dim, #adb5bd);
}
.ctl--lead .ctl__label {
  color: var(--text, #e9ecef);
}

.ctl__value {
  flex: 0 0 auto;
  font-size: 2.0rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text, #e9ecef);
}
.ctl--lead .ctl__value {
  font-size: 2.0rem;
  color: var(--blue, #74c0fc);
}

.ctl__row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.ctl__range {
  flex: 1 1 auto;
  min-width: 0;
  height: 1.4rem;
  margin: 0;
  accent-color: var(--blue, #74c0fc);
  cursor: pointer;
}

/* Longhand background-color: the reset's `background-color: transparent`
   beats a `background:` shorthand on buttons. This repo has been bitten. */
.step {
  flex: 0 0 auto;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid var(--border, #39404d);
  border-radius: 7px;
  background-color: #232833;
  color: var(--text, #e9ecef);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}
.step:hover {
  background-color: #2c323f;
  border-color: var(--blue, #74c0fc);
}

.presets {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.preset {
  flex: 1 1 0;
  min-width: 0;
  padding: 0.1rem 0.2rem;
  border: 1px solid var(--border, #39404d);
  border-radius: 6px;
  background-color: #232833;
  color: var(--text, #e9ecef);
  font-size: 1rem;
  line-height: 1.3;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.preset:hover {
  border-color: var(--blue, #74c0fc);
}
.preset--on {
  background-color: #1d3049;
  border-color: var(--blue, #74c0fc);
  color: var(--blue, #74c0fc);
}

/* ---- the arithmetic, in one line ---- */
.be__math {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0 0.4rem;
  margin: 0;
  font-family: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 1.15rem;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
  color: var(--text, #e9ecef);
}
.be__op {
  color: var(--dim, #adb5bd);
  font-weight: 700;
}
.be__hours {
  color: var(--yellow, #ffd43b);
  font-weight: 700;
}
.be__years {
  color: var(--purple, #b197fc);
  font-weight: 700;
}

.be__error {
  margin: 0;
  padding: 0.35rem 0.7rem;
  border: 2px solid var(--red, #ff8787);
  border-radius: 8px;
  background-color: rgba(255, 135, 135, 0.12);
  color: var(--red, #ff8787);
  font-size: 1.1rem;
  line-height: 1.3;
  font-weight: 600;
}

/* ---- verdict: the only thing that has to read from the back row ---- */
.verdict {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 0;
  padding: 0.95rem 1.1rem;
  border: 3px solid;
  border-radius: 12px;
  transition: border-color 140ms ease, background-color 140ms ease;
}
.verdict__main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.verdict__word {
  font-size: 2.0rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.verdict__sub {
  font-size: 1.25rem;
  line-height: 1.25;
  color: var(--text, #e9ecef);
}
.verdict__cross {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 0 0 auto;
  padding-left: 1rem;
  border-left: 1px solid var(--border, #39404d);
  text-align: right;
}
.verdict__crossn {
  font-size: 2.0rem;
  font-weight: 700;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  color: var(--text, #e9ecef);
}
.verdict__crossl {
  font-size: 0.85rem;
  line-height: 1.2;
  color: var(--dim, #adb5bd);
}

.verdict--dont {
  border-color: var(--yellow, #ffd43b);
  background-color: rgba(255, 212, 59, 0.1);
}
.verdict--dont .verdict__word {
  color: var(--yellow, #ffd43b);
}
.verdict--pays {
  border-color: var(--green, #69db7c);
  background-color: rgba(105, 219, 124, 0.1);
}
.verdict--pays .verdict__word {
  color: var(--green, #69db7c);
}

/* ---- footer ---- */
.be__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.be__assume {
  margin: 0;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--dim, #adb5bd);
}
.be__assume b {
  color: var(--text, #e9ecef);
  font-weight: 700;
}
.reset {
  flex: 0 0 auto;
  padding: 0.2rem 0.9rem;
  border: 1px solid var(--border, #39404d);
  border-radius: 7px;
  background-color: #232833;
  color: var(--text, #e9ecef);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.reset:hover {
  border-color: var(--blue, #74c0fc);
  background-color: #2c323f;
}

.step:focus-visible,
.preset:focus-visible,
.reset:focus-visible,
.ctl__range:focus-visible {
  outline: 3px solid var(--blue, #74c0fc);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .verdict {
    transition: none;
  }
}
</style>
