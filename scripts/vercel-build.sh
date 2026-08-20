#!/usr/bin/env bash
set -euo pipefail

# Thumbnails are NOT generated here. They are generated locally and committed:
#
#   node scripts/generate-thumbnails.mjs <deck-id>
#
# This build only has to preserve them. `supaslidev deploy` clears
# dist/thumbnails and tries to regenerate every deck's cover itself, which
# cannot work on Vercel (no Chromium), so the committed files are copied aside
# first and put back afterwards.
cp -r thumbnails thumbnails-backup 2>/dev/null || true

# Ensure clean output directory exists
rm -rf dist
mkdir -p dist

# Use supaslidev deploy to build everything, with static Nitro preset
# to prevent Nuxt from using the Vercel preset
NITRO_PRESET=static npx supaslidev deploy --output dist

# Put the committed thumbnails back
if [ -d thumbnails-backup ]; then
  mkdir -p dist/thumbnails
  for f in thumbnails-backup/*.webp thumbnails-backup/*.png; do
    [ -f "$f" ] || continue
    name=$(basename "$f")
    # Only restore if not already in dist output
    if [ ! -f "dist/thumbnails/$name" ]; then
      cp "$f" "dist/thumbnails/$name"
      echo "Restored thumbnail: $name"
    fi
  done

  # Patch presentations.json to include thumbnail URLs for restored files
  node -e "
    const fs = require('fs');
    const path = require('path');
    const file = 'dist/presentations.json';
    const thumbDir = 'dist/thumbnails';
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let patched = false;
    for (const p of data) {
      if (!p.thumbnail) {
        const webp = path.join(thumbDir, p.id + '.webp');
        const png = path.join(thumbDir, p.id + '.png');
        if (fs.existsSync(webp)) { p.thumbnail = '/thumbnails/' + p.id + '.webp'; patched = true; }
        else if (fs.existsSync(png)) { p.thumbnail = '/thumbnails/' + p.id + '.png'; patched = true; }
      }
    }
    if (patched) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      console.log('Patched presentations.json with restored thumbnails');
    }
  "

  rm -rf thumbnails-backup
fi
