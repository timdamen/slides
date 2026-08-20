// Veldloper — the fictional trail-running webshop used in every demo.
// Each snippet ships as a broken/fixed pair of small, realistic HTML strings.

const SHOE_IMG
  = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 60%22%3E%3Cpath d=%22M8 44c20-26 34-30 44-24 8 5 14 8 26 10 16 3 30 6 34 14H8z%22 fill=%22%23e8590c%22/%3E%3Cpath d=%22M6 46h108v6H6z%22 fill=%22%23212529%22/%3E%3C/svg%3E'

export const DEMO_CSS = `
  :root { color-scheme: dark; }
  body {
    margin: 0; padding: 14px; background: #16181d; color: #e9ecef;
    font: 15px/1.45 system-ui, sans-serif;
  }
  img { max-width: 120px; height: auto; }
  h1, .h1 { font-size: 1.3em; margin: 0 0 .3em; }
  h2, .h2 { font-size: 1.15em; margin: 0 0 .3em; font-weight: 700; }
  p { margin: .25em 0; }
  a { color: #74c0fc; }
  .card { border: 1px solid #343a40; border-radius: 10px; padding: 14px; max-width: 340px; }
  .price { font-size: 1.2em; font-weight: 700; color: #ffd43b; }
  .meta { color: #adb5bd; font-size: .9em; }
  .btn, button {
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    background: #e8590c; color: #fff; border: 0; border-radius: 8px;
    padding: 10px 16px; font: inherit; font-weight: 600; margin-top: 8px;
  }
  button:focus-visible, a:focus-visible, input:focus-visible {
    outline: 3px solid #74c0fc; outline-offset: 2px;
  }
  form p { margin: .45em 0; }
  label { display: block; font-size: .9em; color: #ced4da; margin-bottom: 2px; }
  input {
    background: #212529; color: #e9ecef; border: 1px solid #495057;
    border-radius: 6px; padding: 8px 10px; font: inherit; width: 230px;
  }
  .hint { color: #adb5bd; font-size: .8em; }
  .error { color: #ff8787; font-size: .9em; }
  .toast {
    margin-top: 10px; padding: 10px 14px; border-radius: 8px; max-width: 320px;
    background: #2b8a3e; color: #fff; font-weight: 600;
  }
  .toast:empty, .toast[hidden] { display: none; }
  .cmp { display: grid; grid-template-columns: repeat(4, auto); gap: 6px 16px; align-items: center; }
  table { border-collapse: collapse; }
  caption { text-align: left; color: #adb5bd; font-size: .9em; padding-bottom: 6px; }
  th, td { text-align: left; padding: 6px 14px 6px 0; border-bottom: 1px solid #343a40; }
`

export interface SnippetPair {
  broken: string
  fixed: string
}

export const snippets: Record<string, SnippetPair> = {
  'product-card': {
    broken: `<div class="card">
  <div class="h2">TrailRunner 3000</div>
  <img src="${SHOE_IMG}">
  <div>Lightweight trail shoe with a grippy
  sole for wet Dutch singletrack.</div>
  <span class="price">€189</span>
  <div class="meta">Size 43 · In stock</div>
  <div class="btn" onclick="addToCart()">Add to cart</div>
</div>`,
    fixed: `<article class="card">
  <h1>TrailRunner 3000</h1>
  <img src="${SHOE_IMG}"
       alt="TrailRunner 3000, orange trail shoe with black lugged sole">
  <p>Lightweight trail shoe with a grippy
  sole for wet Dutch singletrack.</p>
  <p class="price">Price: €189</p>
  <p class="meta">Size 43 · In stock</p>
  <button onclick="addToCart()">Add to cart — €189</button>
</article>`,
  },

  'compare-table': {
    broken: `<div class="cmp">
  <div>Shoe</div><div>Price</div><div>Weight</div><div>Link</div>
  <img src="${SHOE_IMG}">
  <div>€189</div><div>240 g</div>
  <a href="/trailrunner-3000">Click here</a>
  <img src="${SHOE_IMG}">
  <div>€165</div><div>265 g</div>
  <a href="/mudmaster-2">Click here</a>
</div>`,
    fixed: `<table>
  <caption>Trail shoes, size 43</caption>
  <tr>
    <th scope="col">Shoe</th><th scope="col">Price</th>
    <th scope="col">Weight</th>
  </tr>
  <tr>
    <th scope="row"><img src="${SHOE_IMG}" alt=""> TrailRunner 3000</th>
    <td>€189</td><td>240 g</td>
  </tr>
  <tr>
    <th scope="row"><img src="${SHOE_IMG}" alt=""> MudMaster 2</th>
    <td>€165</td><td>265 g</td>
  </tr>
</table>
<p><a href="/trailrunner-3000">View TrailRunner 3000 — €189</a></p>`,
  },

  'add-to-cart': {
    broken: `<div class="btn" onclick="addToCart()">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0
      4 2 2 0 0 0 0-4zM3 2h2l3.6 10.6a1 1 0 0 0 .95.68h8.9a1 1 0
      0 0 .95-.68L22 6H6"/>
  </svg>
</div>`,
    fixed: `<button type="button" onclick="addToCart()">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"
       aria-hidden="true">
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0
      4 2 2 0 0 0 0-4zM3 2h2l3.6 10.6a1 1 0 0 0 .95.68h8.9a1 1 0
      0 0 .95-.68L22 6H6"/>
  </svg>
  Add to cart — €189
</button>`,
  },

  'checkout-form': {
    broken: `<form class="checkout">
  <p><input type="text" placeholder="Email"></p>
  <p><input type="text" placeholder="Name on card"></p>
  <p><input type="text" placeholder="Card number"></p>
  <span class="error">Invalid card number</span>
  <p><input type="text" placeholder="Postcode"></p>
  <div class="btn" onclick="pay()">Pay €189</div>
</form>`,
    fixed: `<form class="checkout">
  <p><label for="email">Email address</label>
  <input id="email" type="email" autocomplete="email" required></p>
  <p><label for="cc-name">Name on card</label>
  <input id="cc-name" autocomplete="cc-name" required></p>
  <p><label for="cc-number">Card number</label>
  <input id="cc-number" inputmode="numeric" autocomplete="cc-number"
         aria-describedby="cc-hint" required>
  <span id="cc-hint" class="hint">16 digits, no spaces</span></p>
  <p><label for="postal">Postcode</label>
  <input id="postal" autocomplete="postal-code" required></p>
  <button>Pay €189</button>
  <p role="status" id="order-status" class="toast"></p>
</form>
<script>
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById('order-status').textContent
      = 'Order placed — confirmation #1234'
  })
</script>`,
  },

  'confirm-toast': {
    broken: `<button id="order">Place order</button>
<div id="toast" class="toast" hidden>
  ✓ Order placed — confirmation #1234
</div>
<script>
  document.getElementById('order').addEventListener('click', () => {
    document.getElementById('toast').hidden = false
  })
</script>`,
    fixed: `<button id="order">Place order</button>
<div id="toast" class="toast" role="status"></div>
<script>
  document.getElementById('order').addEventListener('click', () => {
    document.getElementById('toast').textContent
      = '✓ Order placed — confirmation #1234'
  })
</script>`,
  },
}

export function wrapSnippet(html: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${DEMO_CSS}</style></head><body>${html}</body></html>`
}
