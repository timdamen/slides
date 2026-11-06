---
layout: center
class: ending-slide
hide: true
---

<div class="ending">

<p class="ending-line">The accessibility tree was built for <strong>people</strong> — blind users, keyboard users, screen-reader users — decades before any agent showed up.</p>

<p v-click class="ending-line">Agents are free-riding on <strong>25 years of accessibility work</strong>. The market suddenly cares, because this user has a credit card.</p>

<p v-click class="ending-quote">"For twenty years we asked for a business case.<br>The market finally delivered one — it just doesn't have eyes."</p>

<p v-click class="ending-quote final">"Don't let the business case replace the reason we started."</p>

</div>

---
layout: center
class: tweet-slide
---

<div class="tweet-pair">

<Tweet id="2098080734317547756" conversation="none" cards="hidden" />

<Tweet id="2098083109816471645" conversation="none" cards="hidden" />

</div>

<p class="src-note"><a href="https://x.com/matteocollina/status/2098080734317547756" target="_blank" rel="noopener noreferrer">@matteocollina</a> and <a href="https://x.com/zeeg/status/2098083109816471645" target="_blank" rel="noopener noreferrer">@zeeg</a>, 10 Sep 2026</p>

<!--
Only slide in the deck that needs the network. Slidev decides whether to
     inject platform.twitter.com/widgets.js by grepping slide markdown for the
     string "<Tweet", and it makes that decision ONCE at server start: adding
     this slide to an already-running `slidev` gives you the placeholder logo
     and nothing else until you restart it. Same reason PostEmbed cannot host
     the tag on its own — the grep never sees inside a .vue file.

     TODO(Tim): if conference wifi looks bad, replace the whole .tweet-pair
     block above with the screenshot of both cards, already captured:
     <PostEmbed fallback="/images/zeeg-matteocollina-exchange.png"
                post-url="https://x.com/zeeg/status/2098083109816471645"
                alt='Matteo Collina on X, 10 Sep 2026: "Given we do not write code anymore... why are we still dealing with TypeScript and transpilation? Models can write perfect JS in less tokens." David Cramer replies: "if it was good for humans its good for agents"' />
     Leave a literal "<Tweet" in this comment so the head injection still fires
     if you switch back. (public/images/zeeg-tweet.png is the reply on its own,
     from before the parent was added.)
-->

---
layout: default
---

<OutroSlide title="Thank you, let's stay connected" />

---
routeAlias: bonus
hide: true
---

# Bonus: yes, we checked

<DeckAudit />

<p class="src-note">This deck, read through its own accessibility tree — same computation the demos use.</p>
