/**
 * Static assets imported from this addon's components.
 *
 * Vite rewrites these imports to an emitted URL at build time; TypeScript needs
 * telling separately or the import is an error in the editor. Declared here
 * rather than via `vite/client` so the package does not have to depend on Vite
 * just for its ambient types.
 */
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
