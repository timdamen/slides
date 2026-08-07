/**
 * Minimal line diff (LCS) — enough to render a review-sized codemod diff.
 * No dependency, no network, deterministic.
 */
export type DiffKind = 'same' | 'add' | 'del'

export interface DiffLine {
  kind: DiffKind
  text: string
  /** 1-based line number in the source side, when applicable. */
  before: number | null
  after: number | null
}

export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split('\n')
  const b = after.split('\n')
  const n = a.length
  const m = b.length

  // lcs[i][j] = length of the longest common subsequence of a[i:] and b[j:]
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ kind: 'same', text: a[i], before: i + 1, after: j + 1 })
      i += 1
      j += 1
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ kind: 'del', text: a[i], before: i + 1, after: null })
      i += 1
    } else {
      out.push({ kind: 'add', text: b[j], before: null, after: j + 1 })
      j += 1
    }
  }
  while (i < n) {
    out.push({ kind: 'del', text: a[i], before: i + 1, after: null })
    i += 1
  }
  while (j < m) {
    out.push({ kind: 'add', text: b[j], before: null, after: j + 1 })
    j += 1
  }
  return out
}

export function changedLineCount(lines: DiffLine[]): number {
  return lines.filter((line) => line.kind !== 'same').length
}

/**
 * Collapse long runs of unchanged lines, keeping `context` lines either side.
 * Returns the same list with elided runs replaced by a single marker entry.
 */
export function collapse(lines: DiffLine[], context = 2): (DiffLine | { kind: 'gap'; count: number })[] {
  const keep = new Array(lines.length).fill(false)
  lines.forEach((line, index) => {
    if (line.kind === 'same') return
    for (let k = Math.max(0, index - context); k <= Math.min(lines.length - 1, index + context); k += 1) {
      keep[k] = true
    }
  })

  const out: (DiffLine | { kind: 'gap'; count: number })[] = []
  let run = 0
  lines.forEach((line, index) => {
    if (keep[index]) {
      if (run > 0) {
        out.push({ kind: 'gap', count: run })
        run = 0
      }
      out.push(line)
    } else {
      run += 1
    }
  })
  if (run > 0) out.push({ kind: 'gap', count: run })
  return out
}
