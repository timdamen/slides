/**
 * Drag + keyboard resizing for the demo panels (AgentView / AgentSim).
 *
 * Both hooks drive plain reactive values that the components feed into CSS
 * (grid-template-columns / a --height custom property). The handles are
 * window splitters per WAI-ARIA: role="separator", tabindex="0",
 * aria-valuenow, arrow keys. Pointer capture keeps the drag alive while the
 * cursor crosses the preview iframes.
 */
import { computed, ref } from 'vue'

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

/** Adjacent grid columns (fr units) separated by draggable dividers. */
export function useColumnResize(initial: number[], dividerPx = 10, minShare = 0.15) {
  const cols = ref([...initial])
  const dragging = ref(false)
  const total = initial.reduce((a, b) => a + b, 0)
  const minFr = total * minShare

  /** Index of the maximized pane, or null. Cleared by any manual resize. */
  const maximized = ref<number | null>(null)
  let savedCols: number[] | null = null

  const gridTemplate = computed(() =>
    cols.value.map(c => `${c}fr`).join(` ${dividerPx}px `))

  function setPair(i: number, left: number) {
    maximized.value = null
    const pair = cols.value[i] + cols.value[i + 1]
    const next = clamp(left, minFr, pair - minFr)
    cols.value[i] = next
    cols.value[i + 1] = pair - next
  }

  /** Toggle: give pane i most of the width; second press restores the
      layout from before the first maximize. */
  function maximize(i: number) {
    if (maximized.value === i) {
      maximized.value = null
      if (savedCols)
        cols.value = [...savedCols]
      return
    }
    if (maximized.value === null)
      savedCols = [...cols.value]
    maximized.value = i
    const small = total * 0.12
    cols.value = cols.value.map((_, j) =>
      j === i ? total - small * (cols.value.length - 1) : small)
  }

  /** Give every pane the same width. */
  function equalize() {
    maximized.value = null
    savedCols = null
    cols.value = cols.value.map(() => total / cols.value.length)
  }

  /** Left pane's share of the pair, for aria-valuenow. */
  function percent(i: number) {
    const pair = cols.value[i] + cols.value[i + 1]
    return Math.round((cols.value[i] / pair) * 100)
  }

  function startDrag(i: number, e: PointerEvent) {
    const el = e.currentTarget as HTMLElement
    const width = el.parentElement!.getBoundingClientRect().width
    const startX = e.clientX
    const startLeft = cols.value[i]
    const frPerPx = total / width
    dragging.value = true
    el.setPointerCapture(e.pointerId)
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault()
      setPair(i, startLeft + (ev.clientX - startX) * frPerPx)
    }
    const onUp = () => {
      dragging.value = false
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  }

  function onKey(i: number, e: KeyboardEvent) {
    const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
    if (!dir)
      return
    e.preventDefault()
    e.stopPropagation() // arrows also drive Slidev's slide navigation
    setPair(i, cols.value[i] + dir * total * 0.05)
  }

  return { cols, dragging, gridTemplate, percent, startDrag, onKey, maximized, maximize, equalize }
}

/** Shared pane height in px, driven by a horizontal handle below the panes. */
export function useHeightResize(initialPx: number, min = 140, max = 560) {
  const heightPx = ref(clamp(initialPx, min, max))
  const dragging = ref(false)

  function startDrag(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement
    const startY = e.clientY
    const start = heightPx.value
    // Slidev scales slides with a transform; drag deltas are screen px but
    // the height is CSS px, so divide out the scale factor.
    const scale = el.getBoundingClientRect().width / el.offsetWidth || 1
    dragging.value = true
    el.setPointerCapture(e.pointerId)
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault()
      heightPx.value = clamp(start + (ev.clientY - startY) / scale, min, max)
    }
    const onUp = () => {
      dragging.value = false
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  }

  function onKey(e: KeyboardEvent) {
    const dir = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0
    if (!dir)
      return
    e.preventDefault()
    e.stopPropagation() // arrows also drive Slidev's slide navigation
    heightPx.value = clamp(heightPx.value + dir * 24, min, max)
  }

  return { heightPx, dragging, min, max, startDrag, onKey }
}
