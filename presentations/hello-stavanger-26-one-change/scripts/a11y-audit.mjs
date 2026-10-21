/**
 * Walks every slide in the built deck with a real browser and runs axe-core
 * against it, then re-checks contrast a second way: it measures the *computed*
 * colour of every text node against its actual painted background.
 *
 * Reading style.css is not enough — a token can be correct and still be wrong on
 * screen once a component nests panels, and a projector is less forgiving than
 * either. Run this before every rehearsal:
 *
 *   pnpm build && node scripts/a11y-audit.mjs
 */
import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist')
const AXE = fileURLToPath(new URL('../node_modules/axe-core/axe.min.js', import.meta.url))

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

/** Static server over dist/, falling back to index.html for the SPA routes. */
async function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0])
    for (const candidate of [join(DIST, path), join(DIST, 'index.html')]) {
      try {
        if (!(await stat(candidate)).isFile()) continue
        res.writeHead(200, { 'content-type': TYPES[extname(candidate)] ?? 'text/plain' })
        res.end(await readFile(candidate))
        return
      } catch {
        /* try the next candidate */
      }
    }
    res.writeHead(404).end()
  })
  await new Promise((resolve) => server.listen(0, resolve))
  return { server, port: server.address().port }
}

const { server, port } = await serve()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const axeSource = await readFile(AXE, 'utf8')

await page.goto(`http://localhost:${port}/1`, { waitUntil: 'networkidle' })
// Slidev's nav renders "N / total" and exposes no stable global in a built deck,
// so read the counter it already paints.
const slideCount = await page.evaluate(() => {
  const m = document.body.innerText.match(/(\d+)\s*\/\s*(\d+)\s*$/m)
  return m ? Number(m[2]) : 0
})
if (!slideCount) throw new Error('could not read the slide count from the nav counter')

const violations = []
const contrastMisses = []

for (let n = 1; n <= slideCount; n += 1) {
  await page.goto(`http://localhost:${port}/${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(220)

  await page.addScriptTag({ content: axeSource })
  const result = await page.evaluate(async () => {
    // The nav chrome is upstream Slidev, not deck content; audit the slide only.
    return await window.axe.run('#slideshow', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
  })
  for (const v of result.violations) {
    violations.push({
      slide: n,
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html?.slice(0, 110),
      why: v.nodes[0]?.failureSummary?.split('\n').filter(Boolean).pop()?.slice(0, 150),
    })
  }

  // Second opinion: measure every text node's computed colour against the
  // background actually painted behind it.
  const misses = await page.evaluate(() => {
    const lin = (c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4)
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number)
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
      return (x + 0.05) / (y + 0.05)
    }
    const painted = (el) => {
      for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
        const bg = parse(getComputedStyle(node).backgroundColor)
        if (bg.length >= 3 && (bg[3] === undefined || bg[3] > 0.5)) return bg.slice(0, 3)
      }
      return [11, 13, 18]
    }
    const out = []
    for (const el of document.querySelectorAll('#slideshow *')) {
      const text = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join('')
      if (!text) continue
      const style = getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none' || +style.opacity === 0) continue
      const box = el.getBoundingClientRect()
      if (box.width < 2 || box.height < 2) continue
      const size = parseFloat(style.fontSize)
      const weight = Number(style.fontWeight) || 400
      // WCAG "large text": >=24px, or >=18.66px when bold.
      const large = size >= 24 || (size >= 18.66 && weight >= 700)
      const need = large ? 3 : 4.5
      const r = ratio(parse(style.color).slice(0, 3), painted(el))
      if (r < need) {
        out.push({
          text: text.slice(0, 46),
          color: style.color,
          px: Math.round(size),
          ratio: Number(r.toFixed(2)),
          need,
          cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 40),
        })
      }
    }
    return out
  })
  for (const m of misses) contrastMisses.push({ slide: n, ...m })
}

await browser.close()
server.close()

console.log(`\naudited ${slideCount} slides\n`)

console.log('── axe-core (WCAG 2.1 A + AA) ──')
if (violations.length === 0) console.log('  no violations\n')
else {
  for (const v of violations) {
    console.log(`  slide ${String(v.slide).padStart(2)}  ${v.impact.padEnd(8)} ${v.id}  (${v.nodes})`)
    if (v.why) console.log(`            ${v.why}`)
  }
  console.log()
}

console.log('── measured contrast of every rendered text node ──')
if (contrastMisses.length === 0) console.log('  every text node clears its WCAG AA threshold\n')
else {
  const seen = new Set()
  for (const m of contrastMisses) {
    const key = `${m.color}|${m.cls}`
    if (seen.has(key)) continue
    seen.add(key)
    console.log(
      `  slide ${String(m.slide).padStart(2)}  ${String(m.ratio).padStart(5)}:1 ` +
        `(needs ${m.need})  ${m.px}px  ${m.color.padEnd(20)} .${m.cls}\n            "${m.text}"`,
    )
  }
  console.log(`\n  ${contrastMisses.length} node(s), ${seen.size} distinct colour/class pairs\n`)
}

process.exit(violations.length + contrastMisses.length > 0 ? 1 : 0)
