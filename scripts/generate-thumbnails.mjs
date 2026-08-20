#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

// Generate slide-1 thumbnails by driving Playwright against `slidev` dev mode
// directly. This bypasses `slidev export`, whose internal
// `frame.waitForLoadState()` step has a hardcoded 30s timeout and reliably
// hangs for decks containing <Tweet>/<iframe> components (the embedded Twitter
// widget iframe is mounted on every slide URL even with --per-slide --range 1).
//
// Usage:
//   node scripts/generate-thumbnails.mjs              # all presentations
//   node scripts/generate-thumbnails.mjs devdays-26   # specific deck(s)

const SLIDE_TIMEOUT_MS = Number(process.env.SLIDEV_THUMB_TIMEOUT ?? 60_000);
const SETTLE_MS = Number(process.env.SLIDEV_THUMB_SETTLE_MS ?? 1500);
const VIEWPORT = { width: 1920, height: 1080 };
const THUMB_WIDTH = 1280;
const WEBP_QUALITY = 80;

const projectRootPath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const presentationsDir = join(projectRootPath, 'presentations');
const thumbnailsDir = join(projectRootPath, 'thumbnails');
const require = createRequire(import.meta.url);

const pnpmDir = join(projectRootPath, 'node_modules', '.pnpm');
function resolveFromPnpm(prefix, subpath) {
  const dir = readdirSync(pnpmDir).find((d) => d.startsWith(prefix));
  if (!dir) throw new Error(`${prefix} not found in node_modules/.pnpm — run pnpm install`);
  return require(join(pnpmDir, dir, 'node_modules', subpath));
}
const sharp = resolveFromPnpm('sharp@', 'sharp');
const { chromium } = resolveFromPnpm('playwright-chromium@', 'playwright-chromium');

const filter = new Set(process.argv.slice(2));
const ids = readdirSync(presentationsDir).filter((id) => {
  const p = join(presentationsDir, id);
  return statSync(p).isDirectory() && existsSync(join(p, 'slides.md')) && (filter.size === 0 || filter.has(id));
});
if (ids.length === 0) {
  console.error('No matching presentations found.');
  process.exit(1);
}
mkdirSync(thumbnailsDir, { recursive: true });

function isDark(slidesPath) {
  const m = readFileSync(slidesPath, 'utf-8').match(/^---\n([\s\S]*?)\n---/);
  return !!m && /colorSchema:\s*['"]?dark['"]?/.test(m[1]);
}

function freePort() {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => res(port));
    });
    srv.on('error', rej);
  });
}

function startSlidev(slidevBin, cwd, port) {
  return new Promise((res, rej) => {
    const proc = spawn(slidevBin, ['--port', String(port), '--remote', 'no'], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let ready = false;
    const onData = (buf) => {
      const s = buf.toString();
      if (!ready && s.includes(`http://localhost:${port}/`)) {
        ready = true;
        res(proc);
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('exit', (code) => { if (!ready) rej(new Error(`slidev exited ${code} before ready`)); });
    setTimeout(() => { if (!ready) { proc.kill('SIGTERM'); rej(new Error('slidev did not become ready')); } }, SLIDE_TIMEOUT_MS);
  });
}

async function captureSlide(id, presDir, dark) {
  const slidevBin = join(presDir, 'node_modules', '.bin', 'slidev');
  if (!existsSync(slidevBin)) throw new Error('no local slidev binary');
  const port = await freePort();
  const server = await startSlidev(slidevBin, presDir, port);
  try {
    const browser = await chromium.launch();
    try {
      const ctx = await browser.newContext({ viewport: VIEWPORT, colorScheme: dark ? 'dark' : 'light' });
      const page = await ctx.newPage();
      await page.goto(`http://localhost:${port}/1`, { waitUntil: 'domcontentloaded', timeout: SLIDE_TIMEOUT_MS });
      // Wait for the first slide container to be visible. Don't wait for
      // iframes — the Twitter widget iframe never reaches "load".
      const slide = page.locator('[data-slidev-no="1"]').first();
      await slide.waitFor({ state: 'visible', timeout: SLIDE_TIMEOUT_MS });
      // Let fonts, layout, and intro animations settle.
      await page.waitForTimeout(SETTLE_MS);
      const pngTarget = join(thumbnailsDir, `${id}.png`);
      await slide.screenshot({ path: pngTarget });
      return pngTarget;
    } finally {
      await browser.close();
    }
  } finally {
    server.kill('SIGTERM');
  }
}

let failures = 0;
for (const id of ids) {
  const presDir = join(presentationsDir, id);
  const dark = isDark(join(presDir, 'slides.md'));
  const webpTarget = join(thumbnailsDir, `${id}.webp`);
  console.log(`\n→ ${id}${dark ? ' (dark)' : ''}`);
  try {
    const pngTarget = await captureSlide(id, presDir, dark);
    await sharp(pngTarget)
      .resize(THUMB_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpTarget);
    unlinkSync(pngTarget);
    console.log(`  ✓ wrote ${webpTarget}`);
  } catch (err) {
    failures++;
    console.error(`  ✗ ${id}: ${err.message}`);
  }
}
process.exit(failures === 0 ? 0 : 1);
