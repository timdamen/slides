import {
  computeAccessibleName,
  getRole,
  isDisabled,
  isInaccessible,
} from 'dom-accessibility-api'

export interface TreeNode {
  role: string
  name: string
  states: string[]
  warning?: string
  depth: number
}

// Roles that take their name from contents — render as a single leaf row.
const NAMED_LEAVES = new Set([
  'heading', 'button', 'link', 'columnheader', 'rowheader', 'cell',
  'gridcell', 'option', 'tab', 'menuitem', 'caption',
])

// Roles a user (or agent) interacts with — an empty name here is a bug.
const INTERACTIVE = new Set([
  'button', 'link', 'textbox', 'searchbox', 'combobox', 'checkbox',
  'radio', 'slider', 'spinbutton', 'switch', 'menuitem', 'tab', 'option',
])

const IMPLICIT_FALLBACK: Record<string, string> = {
  table: 'table', tr: 'row', td: 'cell', th: 'columnheader',
  button: 'button', a: 'link', h1: 'heading', h2: 'heading', h3: 'heading',
  img: 'img', form: 'form', caption: 'caption', select: 'combobox',
  textarea: 'textbox',
}

export function safeRole(el: Element): string | null {
  try {
    const role = getRole(el)
    if (role)
      return role
  }
  catch {}
  const tag = el.tagName.toLowerCase()
  if (tag === 'a' && !el.hasAttribute('href'))
    return null
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type
    if (['text', 'email', 'tel', 'url', ''].includes(type))
      return 'textbox'
    if (type === 'search')
      return 'searchbox'
    if (type === 'checkbox' || type === 'radio')
      return type
    if (type === 'number')
      return 'spinbutton'
    if (type === 'submit' || type === 'button')
      return 'button'
    return 'textbox'
  }
  return IMPLICIT_FALLBACK[tag] ?? null
}

export function safeName(el: Element): string {
  try {
    return computeAccessibleName(el).trim()
  }
  catch {
    return ''
  }
}

function elementStates(el: Element, role: string): string[] {
  const out: string[] = []
  if (role === 'heading') {
    const level = el.getAttribute('aria-level')
      ?? (/^h([1-6])$/i.exec(el.tagName)?.[1] ?? null)
    if (level)
      out.push(`level ${level}`)
  }
  const input = el as HTMLInputElement
  if (input.required || el.getAttribute('aria-required') === 'true')
    out.push('required')
  try {
    if (isDisabled(el) || el.getAttribute('aria-disabled') === 'true')
      out.push('disabled')
  }
  catch {}
  if (role === 'checkbox' || role === 'radio') {
    out.push(input.checked ? 'checked' : 'unchecked')
  }
  else if (el.hasAttribute('aria-checked')) {
    out.push(el.getAttribute('aria-checked') === 'true' ? 'checked' : 'unchecked')
  }
  if (el.hasAttribute('aria-expanded'))
    out.push(el.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed')
  if (el.getAttribute('aria-invalid') === 'true')
    out.push('invalid')
  if (el.hasAttribute('autocomplete') && el.getAttribute('autocomplete'))
    out.push(`autocomplete: ${el.getAttribute('autocomplete')}`)
  return out
}

function isFocusable(el: Element): boolean {
  if (el.hasAttribute('tabindex'))
    return el.getAttribute('tabindex') !== '-1'
  const tag = el.tagName.toLowerCase()
  return ['a', 'button', 'input', 'select', 'textarea'].includes(tag)
}

function looksClickable(el: Element): boolean {
  return el.hasAttribute('onclick')
}

function warningFor(el: Element, role: string, name: string): string | undefined {
  if (el.tagName.toLowerCase() === 'img' && !el.hasAttribute('alt'))
    return 'image has no alt text — invisible to the tree'
  if (INTERACTIVE.has(role) && !name) {
    if (el.hasAttribute('placeholder'))
      return 'no accessible name — placeholder is not a label'
    return 'no accessible name'
  }
  if (role === 'link' && /^(?:click here|here|read more|learn more)$/i.test(name))
    return `link text "${name}" carries no meaning`
  return undefined
}

export function buildTree(root: Element): { nodes: TreeNode[], warnings: number } {
  const nodes: TreeNode[] = []
  let warnings = 0

  const push = (node: TreeNode) => {
    nodes.push(node)
    if (node.warning)
      warnings++
  }

  const walk = (el: Element, depth: number) => {
    const tag = el.tagName.toLowerCase()
    if (['script', 'style', 'template', 'head', 'meta', 'title'].includes(tag))
      return
    try {
      if (isInaccessible(el))
        return
    }
    catch {}

    const role = safeRole(el)

    if (role === 'presentation' || role === 'none') {
      recurse(el, depth)
      return
    }

    if (role === null) {
      // A click handler on a role-less element: the classic fake button.
      if (looksClickable(el) && !isFocusable(el)) {
        push({
          role: 'generic',
          name: '',
          states: [],
          warning: 'clickable, but no role, no name, no keyboard access',
          depth,
        })
        return
      }
      recurse(el, depth)
      return
    }

    const name = safeName(el)
    const node: TreeNode = {
      role,
      name,
      states: elementStates(el, role),
      warning: warningFor(el, role, name),
      depth,
    }
    push(node)

    if (!NAMED_LEAVES.has(role) && !INTERACTIVE.has(role) && role !== 'img')
      recurse(el, depth + 1)
  }

  const recurse = (el: Element, depth: number) => {
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.replace(/\s+/g, ' ').trim()
        if (text)
          push({ role: 'text', name: text, states: [], depth })
      }
      else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child as Element, depth)
      }
    }
  }

  recurse(root, 0)
  return { nodes, warnings }
}

export function queryByRoleName(root: ParentNode, role: string, name: RegExp): Element | null {
  for (const el of Array.from(root.querySelectorAll('*'))) {
    try {
      if (isInaccessible(el))
        continue
    }
    catch {}
    if (safeRole(el) === role && name.test(safeName(el)))
      return el
  }
  return null
}
