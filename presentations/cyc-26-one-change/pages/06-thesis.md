# What this actually bought

<div class="bought">
<v-clicks>

<p>A feature team never read a framework release note.</p>
<p>A requirement from outside engineering landed everywhere <span class="accent">without three hundred tickets.</span></p>
<p>A design system major went out in a fortnight instead of a fiscal year.</p>
<p>Four upstream major versions absorbed in two years, by five people.</p>

</v-clicks>
</div>

<!--
⏱ 27:40 — Act 6. The thesis. Four lines, no adjectives, let them land.

[click] Nobody on a feature team read a release note. That's not a small thing. That's the single largest recurring tax on frontend work and it just isn't in their week.

[click] A requirement arrived from outside engineering with a date on it, and it landed everywhere, and no feature team's backlog moved.

[click] A design system went to a new major across the estate in a fortnight.

[click] And four upstream majors got absorbed in two years by a team of five, which is the number I'd put in front of anyone asking what a platform team is for.
-->

---
layout: center
---

<div class="thesis">
  <p class="thesis-line">Feature teams ship what the customer asked for.</p>
  <p class="thesis-line accent" v-click>Platform teams ship the thing <span class="underline-accent">nobody asked for and everybody needs.</span></p>
  <p class="thesis-sub" v-click>You cannot mandate it. You can only make the paved road so good that leaving it feels like work.</p>
</div>

<!--
⏱ 28:10

Here's the argument I actually came to make.

Feature teams are measured in customer value, and they should be. Platform teams are measured in nothing visible at all, right up until the moment something breaks, and then they're measured in that.

[click] We ship the thing nobody asked for and everybody needs. Governance, security, performance, accessibility. These arrive from outside engineering, they are not negotiable, and they land on people whose job is something else entirely.

[click] And the constraint that shapes everything: I have no authority. Not a single one of those three hundred teams reports to me. I cannot mandate a thing. All I can do is make the paved road so obviously better than the alternative that stepping off it feels like work.

That's what all of this is. The one-line script, the four commands, the frozen helper library, the two hundred and three lines that never call a printer. It's all one idea: make the correct thing the cheap thing, and then never, ever betray the people who trusted you with write access.
-->

---

# Monday

<div class="monday">
<v-clicks>

<div class="mon-row"><span class="mon-n">1</span><p>Count your repositories and do the arithmetic <strong>before</strong> you build anything. If it says don't, don't.</p></div>

<div class="mon-row"><span class="mon-n">2</span><p>Find one line of config you can move behind something they import. That seam is worth more than any codemod you will write.</p></div>

<div class="mon-row"><span class="mon-n">3</span><p>Take the thing you have written on a wiki page twice and make it executable instead.</p></div>

<div class="mon-row"><span class="mon-n">4</span><p>Write a parser query, not a codemod. Ask your own repo a question tonight.</p></div>

<div class="mon-row"><span class="mon-n">5</span><p>Test against a fake filesystem, and always run it twice. The second run must change nothing.</p></div>

</v-clicks>
</div>

<!--
⏱ 29:00

Five things, and they scale down to three applications.

[click] Do the arithmetic first. I meant it earlier. Most of you shouldn't build this.

[click] Find one seam. One line of configuration you can move behind a package they install. This is the highest-leverage hour you'll spend and it requires no framework.

[click] Anything you've written on a wiki page more than once is a thing you wished were executable. Wiki pages are how we pretend a decision was made.

[click] Your first parser is a question, not an edit. Tonight, on your own repo, with no permission from anybody.

[click] And when you do write a codemod: fake filesystem, and run it twice. If the second run changes anything, it will eventually run twice somewhere real, and then you'll find out the hard way.
-->

---
layout: center
---

<div class="cover-wrap">
  <h1 class="cover-title">Thank you</h1>
  <p class="cover-byline">Tim Damen · <span class="cover-url">talks.timdamen.io</span></p>
  <p class="thanks-note">Everything on screen today ran in your browser.<br>Nothing was a screenshot.</p>
</div>

<!--
⏱ 29:50 — Last line. Say it and stop.

Every demo in this talk parsed real code, in the browser, while you watched. There are no screenshots in this deck and no recorded terminals. If it looked like it computed something, it computed it.

Thank you.

[Q&A buffer to 30:00]
-->
