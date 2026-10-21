---
theme: supa11y
addons:
  - '@supaslidev/shared'
title: One change. Three hundred repositories. Nobody reports to me.
info: |
  ## Utilising the JavaScript AST for Automated Frontend Lifecycle Management
  Hello Stavanger 2026 · Stavanger, Norway · Tim Damen

  How a five-person platform team keeps roughly three hundred frontend
  applications current, and the small part of that job where a parser is the
  only safe way to edit somebody else's file.
author: Tim Damen
colorSchema: dark
transition: slide-left
mdc: true
lineNumbers: true
duration: 30min
drawings:
  persist: false
---

<div class="repo-field" aria-hidden="true"></div>
<div class="repo-live" aria-hidden="true"></div>
<div class="repo-echo repo-echo-1" aria-hidden="true"></div>
<div class="repo-echo repo-echo-2" aria-hidden="true"></div>
<div class="stavanger-band" aria-hidden="true"></div>
<svg class="stavanger-vine" aria-hidden="true" viewBox="-34 0 398 312" fill="none">
  <defs><g id="vine-leaf"><path class="vine-stem" d="M0 0 L0 -14.9" /><path class="vine-leaf" d="M-7.4 -21.9 L-7.4 -23.5 L-8.1 -22.5 L-8.8 -21.5 L-9.5 -20.9 L-10 -20.8 L-10.5 -20.8 L-10.9 -20.7 L-11.5 -20.6 L-12 -20.5 L-12.5 -20.5 L-13 -20.4 L-13.6 -20.3 L-14.1 -20.2 L-13.3 -22.9 L-13.7 -23 L-14.2 -23.1 L-14.6 -23.2 L-15.1 -23.2 L-15.6 -23.3 L-16.1 -23.3 L-16.6 -23.3 L-17.1 -23.4 L-17.6 -23.4 L-18.2 -23.4 L-18.7 -23.4 L-19.2 -23.5 L-20.5 -22.6 L-21.8 -21.7 L-23.2 -20.9 L-22.2 -22.9 L-23.3 -22.4 L-24.4 -21.8 L-25.6 -21.3 L-26.8 -20.8 L-28.1 -20.4 L-29.3 -19.9 L-30.6 -19.5 L-31.9 -19.1 L-33.3 -18.7 L-34.7 -18.4 L-36 -18 L-37.5 -17.7 L-35.2 -20.5 L-36.2 -20.5 L-37.3 -20.5 L-38.4 -20.6 L-39.5 -20.6 L-40.7 -20.6 L-41.9 -20.7 L-43.1 -20.8 L-44.3 -20.9 L-45.5 -21 L-46.7 -21.2 L-47.9 -21.4 L-49.2 -21.6 L-45.7 -24.4 L-46.5 -24.9 L-47.3 -25.3 L-48.1 -25.7 L-49 -26.2 L-49.8 -26.7 L-50.7 -27.1 L-51.6 -27.6 L-52.5 -28.1 L-53.3 -28.7 L-54.2 -29.2 L-55.1 -29.8 L-56 -30.4 L-56.8 -31 L-56.6 -32 L-56.2 -33 L-55.9 -34 L-55.5 -34.9 L-55.1 -35.9 L-54.7 -36.8 L-54.3 -37.7 L-53.9 -38.6 L-53.4 -39.5 L-53 -40.4 L-52.6 -41.2 L-52.2 -42.1 L-51.8 -42.9 L-56.4 -43.1 L-55.5 -44 L-54.6 -44.9 L-53.7 -45.8 L-52.8 -46.6 L-51.9 -47.4 L-51 -48.2 L-50.1 -48.9 L-49.2 -49.6 L-48.3 -50.3 L-47.4 -51 L-46.5 -51.6 L-45.7 -52.3 L-49.3 -53.2 L-47.9 -53.8 L-46.6 -54.3 L-45.3 -54.9 L-44 -55.4 L-42.7 -55.8 L-42.5 -56.4 L-44 -57.3 L-45.4 -58.2 L-46.9 -59.2 L-48.3 -60.2 L-49.7 -61.3 L-51.1 -62.4 L-52.5 -63.6 L-53.9 -64.8 L-49.9 -64.4 L-50.7 -65.5 L-51.6 -66.5 L-52.4 -67.7 L-53.3 -68.8 L-54.1 -70 L-54.9 -71.2 L-55.7 -72.5 L-56.5 -73.7 L-57.3 -75.1 L-58 -76.4 L-58.7 -77.7 L-59.4 -79.1 L-54.4 -77.6 L-54.5 -78.7 L-54.7 -79.8 L-54.9 -81 L-55 -82.1 L-55.2 -83.3 L-55.3 -84.5 L-55.5 -85.7 L-55.6 -86.9 L-55.6 -88.1 L-55.7 -89.4 L-55.7 -90.6 L-55.7 -91.8 L-55.6 -93.1 L-54.4 -93.4 L-53.2 -93.7 L-52 -94 L-50.8 -94.2 L-49.6 -94.5 L-48.4 -94.7 L-47.2 -94.8 L-46 -95 L-44.8 -95.1 L-43.7 -95.2 L-42.5 -95.3 L-41.4 -95.4 L-40.3 -95.6 L-43 -100 L-41.5 -99.7 L-40 -99.3 L-38.5 -98.9 L-37 -98.5 L-35.6 -98.1 L-34.2 -97.6 L-32.8 -97.1 L-31.5 -96.6 L-30.2 -96 L-28.9 -95.5 L-27.6 -94.9 L-26.4 -94.4 L-27.7 -98.1 L-26.2 -97.1 L-24.7 -96 L-23.3 -94.9 L-22.7 -95.2 L-22.8 -97.2 L-22.9 -99.3 L-23 -101.3 L-22.9 -103.4 L-22.9 -105.4 L-20.6 -101.9 L-20.3 -103.4 L-20 -105 L-19.6 -106.5 L-19.2 -108.1 L-18.8 -109.7 L-18.3 -111.3 L-17.8 -112.9 L-17.2 -114.5 L-16.6 -116.1 L-16 -117.7 L-15.3 -119.2 L-14.6 -120.8 L-12.5 -115.6 L-11.7 -116.5 L-10.8 -117.4 L-10 -118.3 L-9.1 -119.3 L-8.2 -120.3 L-7.2 -121.2 L-6.3 -122.2 L-5.3 -123.1 L-4.3 -124 L-3.3 -124.9 L-2.2 -125.8 L-1.1 -126.6 L0 -127.4 L1.1 -126.6 L2.2 -125.8 L3.3 -124.9 L4.3 -124 L5.3 -123.1 L6.3 -122.2 L7.2 -121.2 L8.2 -120.3 L9.1 -119.3 L10 -118.3 L10.8 -117.4 L11.7 -116.5 L12.5 -115.6 L14.6 -120.8 L15.3 -119.2 L16 -117.7 L16.6 -116.1 L17.2 -114.5 L17.8 -112.9 L18.3 -111.3 L18.8 -109.7 L19.2 -108.1 L19.6 -106.5 L20 -105 L20.3 -103.4 L20.6 -101.9 L22.9 -105.4 L22.9 -103.4 L23 -101.3 L22.9 -99.3 L22.8 -97.2 L22.7 -95.2 L23.3 -94.9 L24.7 -96 L26.2 -97.1 L27.7 -98.1 L26.4 -94.4 L27.6 -94.9 L28.9 -95.5 L30.2 -96 L31.5 -96.6 L32.8 -97.1 L34.2 -97.6 L35.6 -98.1 L37 -98.5 L38.5 -98.9 L40 -99.3 L41.5 -99.7 L43 -100 L40.3 -95.6 L41.4 -95.4 L42.5 -95.3 L43.7 -95.2 L44.8 -95.1 L46 -95 L47.2 -94.8 L48.4 -94.7 L49.6 -94.5 L50.8 -94.2 L52 -94 L53.2 -93.7 L54.4 -93.4 L55.6 -93.1 L55.7 -91.8 L55.7 -90.6 L55.7 -89.4 L55.6 -88.1 L55.6 -86.9 L55.5 -85.7 L55.3 -84.5 L55.2 -83.3 L55 -82.1 L54.9 -81 L54.7 -79.8 L54.5 -78.7 L54.4 -77.6 L59.4 -79.1 L58.7 -77.7 L58 -76.4 L57.3 -75.1 L56.5 -73.7 L55.7 -72.5 L54.9 -71.2 L54.1 -70 L53.3 -68.8 L52.4 -67.7 L51.6 -66.5 L50.7 -65.5 L49.9 -64.4 L53.9 -64.8 L52.5 -63.6 L51.1 -62.4 L49.7 -61.3 L48.3 -60.2 L46.9 -59.2 L45.4 -58.2 L44 -57.3 L42.5 -56.4 L42.7 -55.8 L44 -55.4 L45.3 -54.9 L46.6 -54.3 L47.9 -53.8 L49.3 -53.2 L45.7 -52.3 L46.5 -51.6 L47.4 -51 L48.3 -50.3 L49.2 -49.6 L50.1 -48.9 L51 -48.2 L51.9 -47.4 L52.8 -46.6 L53.7 -45.8 L54.6 -44.9 L55.5 -44 L56.4 -43.1 L51.8 -42.9 L52.2 -42.1 L52.6 -41.2 L53 -40.4 L53.4 -39.5 L53.9 -38.6 L54.3 -37.7 L54.7 -36.8 L55.1 -35.9 L55.5 -34.9 L55.9 -34 L56.2 -33 L56.6 -32 L56.8 -31 L56 -30.4 L55.1 -29.8 L54.2 -29.2 L53.3 -28.7 L52.5 -28.1 L51.6 -27.6 L50.7 -27.1 L49.8 -26.7 L49 -26.2 L48.1 -25.7 L47.3 -25.3 L46.5 -24.9 L45.7 -24.4 L49.2 -21.6 L47.9 -21.4 L46.7 -21.2 L45.5 -21 L44.3 -20.9 L43.1 -20.8 L41.9 -20.7 L40.7 -20.6 L39.5 -20.6 L38.4 -20.6 L37.3 -20.5 L36.2 -20.5 L35.2 -20.5 L37.5 -17.7 L36 -18 L34.7 -18.4 L33.3 -18.7 L31.9 -19.1 L30.6 -19.5 L29.3 -19.9 L28.1 -20.4 L26.8 -20.8 L25.6 -21.3 L24.4 -21.8 L23.3 -22.4 L22.2 -22.9 L23.2 -20.9 L21.8 -21.7 L20.5 -22.6 L19.2 -23.5 L18.7 -23.4 L18.2 -23.4 L17.6 -23.4 L17.1 -23.4 L16.6 -23.3 L16.1 -23.3 L15.6 -23.3 L15.1 -23.2 L14.6 -23.2 L14.2 -23.1 L13.7 -23 L13.3 -22.9 L14.1 -20.2 L13.6 -20.3 L13 -20.4 L12.5 -20.5 L12 -20.5 L11.5 -20.6 L10.9 -20.7 L10.5 -20.8 L10 -20.8 L9.5 -20.9 L8.8 -21.5 L8.1 -22.5 L7.4 -23.5 L7.4 -21.9 Z" /><path class="vine-vein" d="M0 -14.9 Q0 -60.5 0 -106.2 M0 -14.9 Q15.9 -46.9 37.5 -78.9 M0 -14.9 Q-15.9 -46.9 -37.5 -78.9 M0 -14.9 Q13.7 -27 32.3 -39.1 M0 -14.9 Q-13.7 -27 -32.3 -39.1" /></g></defs>
  <path class="vine-stem" d="M138 268 C 128 232, 76 220, 64 180" />
  <path class="vine-stem" d="M160 268 C 170 228, 154 186, 164 146" />
  <path class="vine-stem" d="M184 268 C 198 232, 252 220, 264 180" />
  <path class="vine-tendril" d="M144 266 C 120 252, 66 262, 50 244 L50 244 L50.2 242.1 L50.8 240.4 L51.6 238.7 L52.6 237.2 L53.9 235.9 L55.3 234.8 L56.9 233.9 L58.5 233.3 L60.3 233 L62 233 L63.7 233.2 L65.4 233.7 L66.9 234.4 L68.3 235.4 L69.5 236.5 L70.5 237.9 L71.2 239.3 L71.8 240.8 L72 242.4 L72.1 244 L71.9 245.6 L71.4 247.1 L70.7 248.4 L69.8 249.7 L68.8 250.8 L67.6 251.7 L66.3 252.4 L64.9 252.9 L63.4 253.1 L62 253.1 L60.6 252.9 L59.2 252.5 L58 251.9 L56.9 251.1 L55.9 250.1 L55.1 249 L54.5 247.8 L54.1 246.6 L53.9 245.3 L53.8 244 L54 242.7 L54.4 241.5 L55 240.4 L55.7 239.4 L56.6 238.6 L57.5 237.9 L58.6 237.3 L59.7 237 L60.9 236.8 L62 236.8 L63.1 237 L64.2 237.3 L65.1 237.8 L66 238.5 L66.7 239.3 L67.4 240.1 L67.8 241 L68.1 242 L68.2 243 L68.2 244 L68.1 245 L67.7 245.9 L67.3 246.7 L66.7 247.4 L66.1 248.1 L65.3 248.6 L64.5 249 L63.7 249.2 L62.8 249.3 L62 249.3 L61.2 249.1 L60.4 248.8 L59.7 248.4 L59.1 248 L58.6 247.4 L58.2 246.8 L57.9 246.1 L57.7 245.4 L57.7 244.7 L57.7 244 L57.8 243.3 L58.1 242.7 L58.4 242.2 L58.8 241.7 L59.3 241.3 L59.8 241 L60.3 240.8 L60.9 240.6 L61.5 240.6 L62 240.7 L62.5 240.8 L63 241 L63.4 241.3 L63.7 241.6 L64 242 L64.2 242.4 L64.4 242.8 L64.5 243.2 L64.5 243.6 L64.4 244 L64.3 244.4 L64.1 244.7 L63.9 245 L63.6 245.2" />
  <path class="vine-tendril" d="M180 266 C 206 252, 260 262, 278 244 L278 244 L277.8 242.1 L277.2 240.4 L276.4 238.7 L275.4 237.2 L274.1 235.9 L272.7 234.8 L271.1 233.9 L269.5 233.3 L267.7 233 L266 233 L264.3 233.2 L262.6 233.7 L261.1 234.4 L259.7 235.4 L258.5 236.5 L257.5 237.9 L256.8 239.3 L256.2 240.8 L256 242.4 L255.9 244 L256.1 245.6 L256.6 247.1 L257.3 248.4 L258.2 249.7 L259.2 250.8 L260.4 251.7 L261.7 252.4 L263.1 252.9 L264.6 253.1 L266 253.1 L267.4 252.9 L268.8 252.5 L270 251.9 L271.1 251.1 L272.1 250.1 L272.9 249 L273.5 247.8 L273.9 246.6 L274.1 245.3 L274.2 244 L274 242.7 L273.6 241.5 L273 240.4 L272.3 239.4 L271.4 238.6 L270.5 237.9 L269.4 237.3 L268.3 237 L267.1 236.8 L266 236.8 L264.9 237 L263.8 237.3 L262.9 237.8 L262 238.5 L261.3 239.3 L260.6 240.1 L260.2 241 L259.9 242 L259.8 243 L259.8 244 L259.9 245 L260.3 245.9 L260.7 246.7 L261.3 247.4 L261.9 248.1 L262.7 248.6 L263.5 249 L264.3 249.2 L265.2 249.3 L266 249.3 L266.8 249.1 L267.6 248.8 L268.3 248.4 L268.9 248 L269.4 247.4 L269.8 246.8 L270.1 246.1 L270.3 245.4 L270.3 244.7 L270.3 244 L270.2 243.3 L269.9 242.7 L269.6 242.2 L269.2 241.7 L268.7 241.3 L268.2 241 L267.7 240.8 L267.1 240.6 L266.5 240.6 L266 240.7 L265.5 240.8 L265 241 L264.6 241.3 L264.3 241.6 L264 242 L263.8 242.4 L263.6 242.8 L263.5 243.2 L263.5 243.6 L263.6 244 L263.7 244.4 L263.9 244.7 L264.1 245 L264.4 245.2" />
  <use href="#vine-leaf" transform="translate(64 180) rotate(-38)" />
  <use href="#vine-leaf" transform="translate(164 146) scale(1.1)" />
  <use href="#vine-leaf" transform="translate(264 180) rotate(38)" />
  <path class="vine-log" d="M66 282 C 100 268, 252 260, 284 266 L 292 294 C 252 288, 108 294, 70 306 Z" />
  <ellipse class="vine-log-end" cx="288" cy="280" rx="9" ry="14" />
</svg>

<div class="cover-wrap cover-front">
  <p class="cover-kicker">Hello Stavanger 2026 · Stavanger, Norway · 21 Oct 2026</p>
  <h1 class="cover-title"><span>One change</span><br>300 repositories</h1>
  <p class="cover-byline">Tim Damen · <span class="cover-url">talks.timdamen.io</span></p>
  <p class="cover-programme">Utilising the JavaScript AST for Automated Frontend Lifecycle Management</p>
</div>

<style>
/* Decorations use position: fixed, not absolute: the theme's cover layout wraps
   slide content in a small positioned box that would capture absolute elements,
   while fixed resolves against the slide's scaled container — the full canvas. */
.cover-front {
  position: relative;
  z-index: 5;
}

/* Stavanger's colours, from the city arms: a gold vine on blue. */
.slidev-layout {
  --stavanger-blue: #2f6fd6;
  --stavanger-gold: #f2c230;
}

/* The estate: a faint grid of repositories, strongest away from the title. */
.repo-field {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(47, 111, 214, 0.5) 1.5px, transparent 2.2px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 48% 68% at 79% 30%, black 30%, transparent 88%);
  mask-image: radial-gradient(ellipse 48% 68% at 79% 30%, black 30%, transparent 88%);
}

/* The one repo the change just landed in. Positions sit on the grid's
   26px centres (13 + 26n), so the lit squares read as part of the field. */
.repo-live,
.repo-echo {
  position: fixed;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background-color: var(--stavanger-gold);
}
.repo-live {
  left: 788.5px;
  top: 112.5px;
  box-shadow: 0 0 10px rgba(242, 194, 48, 0.7);
  animation: repo-pulse 3.2s ease-in-out infinite;
}
.repo-echo { opacity: 0.35; }
.repo-echo-1 { left: 892.5px; top: 242.5px; }
.repo-echo-2 { left: 684.5px; top: 60.5px; }

@keyframes repo-pulse {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 5px rgba(242, 194, 48, 0.35); }
  50% { opacity: 1; box-shadow: 0 0 14px rgba(242, 194, 48, 0.85); }
}

/* Blue and gold stripes along the bottom edge, after the old city flag. */
.stavanger-band {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14px;
  background-image: linear-gradient(
    to bottom,
    var(--stavanger-gold) 0 4px,
    var(--stavanger-blue) 4px 10px,
    var(--stavanger-gold) 10px 14px
  );
}

/* The vine from the city arms: three vine leaves and two coiled tendrils
   growing from a cut log. Drawn bottom-right, kept quiet behind the content. */
.stavanger-vine {
  position: fixed;
  right: 20px;
  bottom: 18px;
  width: 300px;
  height: auto;
  opacity: 0.6;
}
.vine-stem,
.vine-tendril {
  stroke: var(--stavanger-gold);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.vine-tendril { stroke-width: 2.4; }
.vine-leaf,
.vine-log { fill: var(--stavanger-gold); }
.vine-vein {
  stroke: #14171c;
  stroke-width: 1.6;
  stroke-linecap: round;
}
.vine-log-end {
  fill: none;
  stroke: #14171c;
  stroke-width: 1.6;
}

/* The change itself, bottom-right. */
.cover-diff {
  position: fixed;
  right: 3.2rem;
  bottom: 2.6rem;
  z-index: 5;
  font-family: var(--slidev-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.82rem;
  line-height: 1.6;
  background-color: var(--panel);
  border: 1px solid #2b3340;
  border-radius: 8px;
  padding: 0.65rem 0.95rem;
}
.diff-del { color: var(--red); }
.diff-add { color: var(--green); }

@media (prefers-reduced-motion: reduce) {
  .repo-live { animation: none; }
}
</style>

---
layout: center
---

<div class="qr-slide">
  <img class="qr-slide-code" src="/images/qr-slides.svg" alt="QR code linking to slides.timdamen.io/presentations/hello-stavanger-26-one-change/1">
  <p class="qr-slide-caption">Follow along, or grab it later<br><strong>slides.timdamen.io</strong></p>
</div>

<style>
.qr-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
}
/* Big enough to scan from the back of the room. The quiet zone is baked into
   the SVG, so no padding here — a QR needs that white margin to be readable. */
.qr-slide-code {
  width: 360px;
  height: 360px;
  border-radius: 10px;
}
.slidev-layout .qr-slide-caption {
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.45;
  color: var(--dim);
}
.slidev-layout .qr-slide-caption strong {
  display: inline-block;
  margin-top: 0.15rem;
  font-size: 1.35rem;
  color: var(--text);
}
</style>

---
src: ./pages/01-mandate.md
---

---
src: ./pages/02-mechanism.md
---

---
src: ./pages/03-landing.md
---

---
src: ./pages/05-ast.md
---

---
src: ./pages/06-thesis.md
---
