<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { simScripts, type SimAction } from '../snippets/demoScripts'
import { snippets, wrapSnippet } from '../snippets/demos'
import { queryByRoleName } from '../utils/a11y'

const props = withDefaults(defineProps<{
  task?: 'checkout' | 'add-to-cart'
  snippet?: string
  variant?: 'broken' | 'fixed'
  speed?: number
  height?: string
}>(), {
  task: 'checkout',
  snippet: 'checkout-form',
  variant: 'broken',
  speed: 1,
})

const activeVariant = ref<'broken' | 'fixed'>(props.variant)
watch(() => props.variant, v => reset(v))

const frame = ref<HTMLIFrameElement>()
const frameKey = ref(0)
const docHtml = computed(() =>
  wrapSnippet(snippets[props.snippet]?.[activeVariant.value] ?? '<p>Unknown snippet</p>'))

interface LogLine { text: string, kind: 'ok' | 'fail' | 'info' | 'final' }
const log = ref<LogLine[]>([])
const logEl = ref<HTMLElement>()
const running = ref(false)
const finished = ref(false)
const stepIndex = ref(0)

const script = computed(() => simScripts[props.task]?.[activeVariant.value])

let cancelled = false
let timers: ReturnType<typeof setTimeout>[] = []
function wait(ms: number) {
  return new Promise<void>((resolve) => {
    timers.push(setTimeout(resolve, ms / props.speed))
  })
}
onBeforeUnmount(() => timers.forEach(clearTimeout))

function kindOf(text: string): LogLine['kind'] {
  if (text.includes('❌') || text.includes('🛑'))
    return 'fail'
  if (text.includes('✓') || text.includes('✅'))
    return 'ok'
  if (text.includes('🏁'))
    return 'final'
  return 'info'
}

async function typeLine(text: string) {
  const line: LogLine = { text: '', kind: kindOf(text) }
  log.value.push(line)
  for (const char of text) {
    if (cancelled)
      return
    line.text += char
    if (!/\s/.test(char))
      await wait(9)
    await nextTick()
    logEl.value?.scrollTo({ top: logEl.value.scrollHeight })
  }
  await wait(120)
}

function performAction(action: SimAction): boolean {
  const doc = frame.value?.contentDocument
  if (!doc)
    return false
  if (action.type === 'read-status') {
    const region = doc.querySelector('[role="status"], [role="alert"], [aria-live]')
    return !!region?.textContent?.trim()
  }
  const el = queryByRoleName(doc.body, action.role, new RegExp(action.name, 'i'))
  if (!el)
    return false
  if (action.type === 'fill') {
    const input = el as HTMLInputElement
    input.focus()
    input.value = action.value
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
  else if (action.type === 'click') {
    (el as HTMLElement).focus?.();
    (el as HTMLElement).click()
  }
  return true
}

async function runStep(): Promise<'continue' | 'abort' | 'end'> {
  const steps = script.value?.steps ?? []
  if (stepIndex.value >= steps.length)
    return 'end'
  const step = steps[stepIndex.value]
  stepIndex.value++

  for (const line of step.lines ?? [])
    await typeLine(line)
  if (step.intro)
    await typeLine(step.intro)

  if (step.action) {
    await wait(250)
    const success = performAction(step.action)
    if (step.action.type === 'read-status' && !success)
      await wait(400)
    const lines = success ? step.onSuccess : step.onFailure
    for (const line of lines ?? [])
      await typeLine(line)
    if (!success && step.failStops)
      return 'abort'
  }
  return stepIndex.value >= steps.length ? 'end' : 'continue'
}

async function finish(outcome: 'abort' | 'end') {
  const lines = outcome === 'abort' ? script.value?.abortLines : script.value?.doneLines
  for (const line of lines ?? [])
    await typeLine(line)
  finished.value = true
}

async function run() {
  if (running.value || finished.value)
    return
  running.value = true
  cancelled = false
  let outcome: 'continue' | 'abort' | 'end' = 'continue'
  while (outcome === 'continue' && !cancelled) {
    outcome = await runStep()
    await wait(200)
  }
  if (!cancelled && outcome !== 'continue')
    await finish(outcome)
  running.value = false
}

async function stepOnce() {
  if (running.value || finished.value)
    return
  running.value = true
  cancelled = false
  const outcome = await runStep()
  if (outcome !== 'continue')
    await finish(outcome)
  running.value = false
}

function reset(variant?: 'broken' | 'fixed') {
  cancelled = true
  timers.forEach(clearTimeout)
  timers = []
  log.value = []
  stepIndex.value = 0
  running.value = false
  finished.value = false
  if (variant)
    activeVariant.value = variant
  frameKey.value++ // reload the iframe so form state is fresh
}
</script>

<template>
  <div class="agent-sim" :style="height ? { '--as-height': height } : {}">
    <div class="as-toolbar">
      <div role="group" aria-label="Form variant" class="as-variants">
        <button
          type="button" :class="{ active: activeVariant === 'broken' }"
          :aria-pressed="activeVariant === 'broken'" @click="reset('broken')"
        >
          Broken form
        </button>
        <button
          type="button" :class="{ active: activeVariant === 'fixed' }"
          :aria-pressed="activeVariant === 'fixed'" @click="reset('fixed')"
        >
          Fixed form
        </button>
      </div>
      <div role="group" aria-label="Agent controls" class="as-controls">
        <button type="button" :disabled="running || finished" @click="run">▶ Run</button>
        <button type="button" :disabled="running || finished" @click="stepOnce">Step</button>
        <button type="button" @click="reset()">Reset</button>
      </div>
    </div>

    <div class="as-panes">
      <div class="as-pane">
        <div class="as-pane-title">Veldloper checkout</div>
        <iframe
          ref="frame" :key="frameKey" class="as-preview" :srcdoc="docHtml"
          title="Demo checkout form the simulated agent operates on"
        />
      </div>
      <div class="as-pane">
        <div class="as-pane-title">Agent log</div>
        <div ref="logEl" class="as-log" role="log" aria-label="Simulated agent reasoning log">
          <div v-for="(line, i) in log" :key="i" class="as-line" :class="line.kind">
            {{ line.text }}
          </div>
          <div v-if="!log.length" class="as-line info as-idle">
            Press Run to start the agent.
          </div>
        </div>
      </div>
    </div>
    <p class="as-disclaimer">simulated agent — scripted demo, real DOM queries (role + accessible name)</p>
  </div>
</template>

<style scoped>
.agent-sim {
  --as-height: 350px;
  font-size: 0.74rem;
  border: 1px solid #3b4252;
  border-radius: 10px;
  padding: 8px;
  background: #14161c;
}
.as-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.as-variants, .as-controls { display: flex; gap: 6px; }
.agent-sim button {
  font: inherit;
  font-weight: 600;
  color: #cdd3dd;
  background: #232733;
  border: 1px solid #3b4252;
  border-radius: 6px;
  padding: 3px 12px;
  cursor: pointer;
}
.agent-sim button.active {
  background: #2f3a52;
  color: #fff;
  outline: 2px solid #74c0fc;
  outline-offset: 1px;
}
.agent-sim button:disabled { opacity: 0.45; cursor: not-allowed; }
.agent-sim button:focus-visible { outline: 3px solid #ffd43b; outline-offset: 2px; }
.as-panes { display: grid; grid-template-columns: 1fr 1.25fr; gap: 8px; }
.as-pane { display: flex; flex-direction: column; min-width: 0; }
.as-pane-title {
  font-weight: 700;
  color: #9aa4b2;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.62rem;
  margin-bottom: 4px;
}
.as-preview {
  height: var(--as-height);
  width: 100%;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #16181d;
}
.as-log {
  height: var(--as-height);
  overflow: auto;
  border: 1px solid #3b4252;
  border-radius: 8px;
  background: #0e1015;
  padding: 8px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
  line-height: 1.55;
  white-space: pre-wrap;
}
.as-line.ok { color: #69db7c; }
.as-line.fail { color: #ff8787; }
.as-line.final { color: #ffd43b; font-weight: 700; }
.as-line.info { color: #d8dee9; }
.as-idle { color: #9aa4b2; font-style: italic; }
.as-disclaimer {
  margin: 6px 0 0;
  color: #9aa4b2;
  font-size: 0.62rem;
  font-style: italic;
}
</style>
