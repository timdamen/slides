#!/usr/bin/env bash
set -euo pipefail

# Step 1: Build each Slidev presentation
for dir in presentations/*/; do
  id=$(basename "$dir")
  echo "Building presentation: $id"
  (cd "$dir" && npx slidev build --base "/presentations/$id/" --out dist)
done

# Step 2: Generate the Nuxt dashboard in deploy mode
SUPASLIDEV_PROJECT_ROOT="$PWD" \
SUPASLIDEV_PRESENTATIONS_DIR="$PWD/presentations" \
NUXT_PUBLIC_DEPLOY_MODE=true \
  npx nuxt generate .

# Step 3: Assemble output
rm -rf dist

# Nuxt on Vercel outputs to .vercel/output/static, locally to .output/public
if [ -d ".vercel/output/static" ]; then
  cp -r .vercel/output/static dist
elif [ -d ".output/public" ]; then
  cp -r .output/public dist
else
  echo "Error: Could not find Nuxt output directory"
  exit 1
fi

# Copy each presentation's built files
for dir in presentations/*/; do
  id=$(basename "$dir")
  if [ -d "$dir/dist" ]; then
    mkdir -p "dist/presentations/$id"
    cp -r "$dir/dist/." "dist/presentations/$id/"
  fi
done

# Include presentations.json if it exists
if [ -f ".supaslidev/presentations.json" ]; then
  cp .supaslidev/presentations.json dist/presentations.json
fi
