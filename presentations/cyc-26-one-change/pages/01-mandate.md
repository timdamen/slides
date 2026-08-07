---
layout: center
---

<div class="greys">
  <div class="grey-pair">
    <div class="grey-swatch" style="background-color:#8b8b8b"></div>
    <div class="grey-swatch" style="background-color:#787878"></div>
  </div>
  <p class="grey-caption">A designer wanted the page background<br><span class="accent">one step darker.</span></p>
</div>

<!--
⏱ 0:20 — The origin story. This is personal, so slow down and tell it like a story, not like a slide.

Early in my career I worked at a large organisation. Forty-something web teams, all shipping parts of the same product to the same customers.

One day the designers and the business came to us with a change. They wanted the main background colour a little darker. That's it. That's the change. It's these two.

Nobody in this room can tell them apart from where you're sitting, and honestly neither could I.
-->

---
layout: center
---

<div class="huge-stat">
  <p class="huge-number">1 year</p>
  <p class="huge-label">to change one grey to a slightly darker grey</p>
</div>

<div class="bottlenecks">
<v-clicks>

<p>forty-plus teams, none of whom agreed it mattered</p>
<p>no shared vocabulary to describe the change</p>
<p>forty-plus backlogs, forty-plus sets of priorities</p>
<p>and it had to land <span class="accent">everywhere at roughly the same time</span>, or the product looked broken</p>

</v-clicks>
</div>

<!--
⏱ 0:50

It took more than a year.

[click] Forty-something teams, and for most of them this was somebody else's idea. Not one of them was wrong to deprioritise it. A slightly darker grey does not beat a customer-facing bug.

[click] We had no shared way of even describing the change. Every team had their own name for that colour, in their own file, in their own way.

[click] Forty backlogs, forty sets of priorities, forty sprint planning meetings where this had to win an argument against something a customer had actually asked for.

[click] And here's the one that made it genuinely hard rather than just slow: it had to land everywhere at roughly the same time. A half-migrated product doesn't look half-migrated. It looks broken. So the slowest team set the pace for everyone.

A year. For a grey.

I think about that project more than any other thing I've worked on, and it's the reason I do the job I do now.
-->

---

# What the organisation did about it

<div class="aftermath">
<v-clicks>

<p>Platform teams, with an actual mandate</p>
<p>Standards, written down</p>
<p>A design system worth using</p>
<p>Shared pipelines</p>
<p>One frontend stack instead of forty</p>

</v-clicks>
</div>

<p v-click class="punch">I work on the other side of that decision now.</p>

<!--
⏱ 1:40

The interesting part isn't that it took a year. The interesting part is what the organisation concluded.

They didn't conclude that the teams were bad. They concluded that the way they managed frontend was the problem, and they rebuilt it.

[click] Platform teams, with a real remit rather than a volunteer rota.
[click] Standards, written down.
[click] A design system people actually wanted to use.
[click] Shared pipelines.
[click] And one frontend stack instead of forty.

[click] I work on the other side of that decision now. I'm on one of those platform teams, at a different organisation, and I want to show you what the machine looks like from the inside, because I've been on both ends of it.

I'll also tell you which part of that list turned out to be a lie. But not yet.
-->

---

# The email

<div class="mandate">
  <p class="mandate-body">Every customer-facing frontend must run<br><span class="accent">automated accessibility checks</span> in CI.</p>
  <p class="mandate-meta">Not a proposal. Not a Q3 initiative.<br>A date, chosen by people who have never opened your repo.</p>
</div>

<!-- TODO(Tim): either put a real quarter here or keep it date-free. Don't invent one. -->

<!--
⏱ 2:20 — Act 1 proper. The mandate. Move faster now; the grey story did the emotional work.

So. A few years later, different organisation, and this arrives.

It came from outside engineering, which is the important part. Nobody negotiated it, nobody sized it, and nobody attached any people to it.

Notice what it does not say. It does not say which apps. It does not say how. It says every.

Which makes the first question a counting question.
-->

---
layout: center
---

<div class="huge-stat">
  <p class="huge-number">~300</p>
  <p class="huge-label">frontend applications</p>
  <p class="huge-sub">and not one of those teams reports to me</p>
</div>

<p class="src-note">Roughly. It counts repositories that install our packages. <span class="dim">TODO(Tim): verify or soften.</span></p>

<!--
⏱ 2:50

Roughly three hundred. I say roughly on purpose, and I'll say it every time, because the number counts repositories that install our packages and that is not exactly the same as applications a customer can reach. Be suspicious of anyone who gives you this number to two significant figures.

Three hundred separate repositories. Not a monorepo. Three hundred pipelines, three hundred release cadences, three hundred backlogs owned by people whose priorities are set by somebody who has never heard of me.

There are five of us.

[click] So I cannot mandate anything. I have no authority here at all. What I have is a package they already install.
-->

---

# Three hundred tickets

<BreakEven />

<!--
⏱ 3:20 — First interactive slide. Keep it to about sixty seconds.

The obvious plan is tickets. One per app. Let's do the arithmetic out loud, because it's the plan everybody proposes and it deserves a real answer rather than a smirk.

Three hundred apps, four hours each, and this is not a once-a-year thing.

Now watch what happens when I drag it down. [drag to 12]

Twelve apps. Go write the tickets. Genuinely. If this is you, everything I build in the next twenty minutes will make your life worse: you'll spend six months on tooling to save a week of typing, and you'll own the tooling forever.

I'm not being modest. Most rooms I give this talk in should not build any of this. The interesting question is what has to change before you should.
-->

---

# Three things have to be true first

<div class="prereq">
<v-clicks>

<div class="prereq-row"><span class="prereq-n">1</span><p>Your applications are <strong>enumerable and shaped the same.</strong> We ship three product types, not infinite ones. A codemod for a shape you have never seen is a wish.</p></div>

<div class="prereq-row"><span class="prereq-n">2</span><p>You own <strong>a seam.</strong> Something they already import, that you control. Without one, every change is surgery on their source.</p></div>

<div class="prereq-row"><span class="prereq-n">3</span><p>You can <strong>test a change without a real repository.</strong> If you have to clone something to know whether your migration works, you will not write enough of them.</p></div>

</v-clicks>
</div>

<!--
⏱ 4:20

If you want to know whether you're in the business I'm about to describe, it's these three.

[click] Enumerable and shaped the same. We generate three kinds of thing, so there are three shapes to reason about. If every team in your company bootstrapped their own app in 2019 from a blog post, you don't have a fleet, you have three hundred special cases and no codemod will survive contact with them.

[click] A seam. This is the one people miss, and I'll spend a whole slide on it later. Something they import that you own. Config behind a preset. A wrapper around a tool. Anything where you can change behaviour by publishing a package instead of editing their file.

[click] And you have to be able to test against a fake filesystem. Every migration we ship is a function over an in-memory tree. If testing a codemod means cloning a repo, you'll write five of them. We've written a hundred and fifty-three.

Right. Assume all three are true. Here's what we actually built.
-->
