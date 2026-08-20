// All AgentSim reasoning copy lives here so the voice can be tuned
// without touching component logic. Keep lines under ~80 chars.

export type SimAction
  = | { type: 'find', role: string, name: string }
    | { type: 'fill', role: string, name: string, value: string }
    | { type: 'click', role: string, name: string }
    | { type: 'read-status' }

export interface SimStep {
  lines?: string[]
  intro?: string
  action?: SimAction
  onSuccess?: string[]
  onFailure?: string[]
  failStops?: boolean
}

export interface SimScript {
  steps: SimStep[]
  abortLines: string[]
  doneLines: string[]
}

export const simScripts: Record<string, Record<'broken' | 'fixed', SimScript>> = {
  'checkout': {
    broken: {
      steps: [
        { lines: ['🎯 Task: buy TrailRunner 3000 (€189) for alex@example.com'] },
        {
          intro: '🔍 Looking for a textbox named /email/i …',
          action: { type: 'find', role: 'textbox', name: 'email' },
          onSuccess: ['✓ Found it. Someone fixed this form. Continuing.'],
          onFailure: [
            '❌ No textbox named /email/i in the tree.',
            '   There is an <input> with placeholder "Email".',
            '   A placeholder is a hint, not a name.',
            '   Guessing fields is how I order 12 pairs of shoes.',
          ],
        },
        {
          intro: '🔍 Looking for a textbox named /card number/i …',
          action: { type: 'find', role: 'textbox', name: 'card number' },
          onSuccess: ['✓ Found "Card number".'],
          onFailure: [
            '❌ Same story: four anonymous textboxes, zero names.',
            '   Which one wants the card? I refuse to find out in prod.',
          ],
        },
        {
          intro: '🔍 Looking for a button named /pay/i …',
          action: { type: 'click', role: 'button', name: 'pay' },
          onSuccess: ['✓ Pressed "Pay €189".'],
          onFailure: [
            '❌ No button named /pay/i. Only a <div class="btn"> with onclick.',
            '   Role: generic. Name: "". Keyboard: unreachable.',
          ],
          failStops: true,
        },
      ],
      abortLines: [
        '🛑 Aborting checkout. Reporting back to Alex: site not operable.',
        '   Veldloper just lost a €189 sale in 4 seconds.',
      ],
      doneLines: ['🏁 Unexpected success — this form has been fixed live.'],
    },
    fixed: {
      steps: [
        { lines: ['🎯 Task: buy TrailRunner 3000 (€189) for alex@example.com'] },
        {
          intro: '🔍 textbox /email address/i …',
          action: { type: 'fill', role: 'textbox', name: 'email address', value: 'alex@example.com' },
          onSuccess: ['✓ Found by label. Filled: alex@example.com'],
          onFailure: ['❌ Missing. This was supposed to be the fixed form.'],
          failStops: true,
        },
        {
          intro: '🔍 textbox /name on card/i …',
          action: { type: 'fill', role: 'textbox', name: 'name on card', value: 'Alex Janssen' },
          onSuccess: ['✓ Filled: Alex Janssen'],
          onFailure: ['❌ Missing.'],
          failStops: true,
        },
        {
          intro: '🔍 textbox /card number/i …',
          action: { type: 'fill', role: 'textbox', name: 'card number', value: '4242424242424242' },
          onSuccess: ['✓ Filled. The hint says 16 digits, no spaces. Obeyed.'],
          onFailure: ['❌ Missing.'],
          failStops: true,
        },
        {
          intro: '🔍 textbox /postcode/i …',
          action: { type: 'fill', role: 'textbox', name: 'postcode', value: '1012 AB' },
          onSuccess: ['✓ Filled: 1012 AB (autocomplete: postal-code — nice)'],
          onFailure: ['❌ Missing.'],
          failStops: true,
        },
        {
          intro: '🖱 button /pay/i …',
          action: { type: 'click', role: 'button', name: 'pay' },
          onSuccess: ['✓ Pressed "Pay €189".'],
          onFailure: ['❌ No pay button found.'],
          failStops: true,
        },
        {
          intro: '👂 Waiting for a status message …',
          action: { type: 'read-status' },
          onSuccess: ['✅ status: "Order placed — confirmation #1234"'],
          onFailure: ['❌ No status message. Did it work? Retrying is risky.'],
          failStops: true,
        },
      ],
      abortLines: ['🛑 Aborting. Reporting failure to Alex.'],
      doneLines: [
        '🏁 Order verified. Every field found by role + accessible name.',
        '   Zero guesses, zero retries, one happy customer.',
      ],
    },
  },

  'add-to-cart': {
    broken: {
      steps: [
        { lines: ['🎯 Task: add TrailRunner 3000 to the cart'] },
        {
          intro: '🔍 Looking for a button named /add to cart/i …',
          action: { type: 'click', role: 'button', name: 'add to cart' },
          onSuccess: ['✓ Pressed it.'],
          onFailure: [
            '❌ Nothing with role button in the whole tree.',
            '   There is a clickable <div> containing… an unlabeled svg.',
            '   I cannot press what has no name.',
          ],
          failStops: true,
        },
      ],
      abortLines: ['🛑 Task failed. Alex buys from the competitor with a <button>.'],
      doneLines: ['🏁 Added to cart.'],
    },
    fixed: {
      steps: [
        { lines: ['🎯 Task: add TrailRunner 3000 to the cart'] },
        {
          intro: '🔍 Looking for a button named /add to cart/i …',
          action: { type: 'click', role: 'button', name: 'add to cart' },
          onSuccess: ['✓ button "Add to cart — €189" — found by name, pressed.'],
          onFailure: ['❌ Not found.'],
          failStops: true,
        },
      ],
      abortLines: ['🛑 Task failed.'],
      doneLines: ['🏁 Added to cart. One element, one query, done.'],
    },
  },
}
