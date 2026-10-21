import { defineConfig, presetIcons } from 'unocss'
import { icons as logos } from '@iconify-json/logos'

// Slidev registers its own presetIcons, which resolves collections through
// @iconify/utils' Node loader. preset-icons disables that loader whenever
// VSCODE_CWD is set — i.e. every build started from the VS Code integrated
// terminal — so every i-logos-* class silently vanished from the CSS.
//
// This preset hands UnoCSS the collection object directly, so no filesystem
// lookup is involved and the icons render from any terminal and in CI.
// It needs a distinct name: UnoCSS dedupes presets by name and keeps the
// first, so a second '@unocss/preset-icons' would just be discarded.
const presetLogos = presetIcons({ collections: { logos: () => logos } })
presetLogos.name = 'preset-icons-logos-bundled'

export default defineConfig({
  presets: [presetLogos],
})
