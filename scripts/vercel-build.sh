#!/usr/bin/env bash
set -euo pipefail

# Ensure clean output directory exists
rm -rf dist
mkdir -p dist

# Use supaslidev deploy to build everything, with static Nitro preset
# to prevent Nuxt from using the Vercel preset
NITRO_PRESET=static npx supaslidev deploy --output dist
