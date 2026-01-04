---
title: NetworkingDream Website
layout: project
status: active # active / updated / archived
featured: true
homepage: https://networkingdream.com

description: >
  A long-lived personal website built with Jekyll and GitHub Pages,
  used to learn in public and document projects over time.

excerpt: >
  Designing and maintaining a calm, durable Jekyll site where the website
  itself is treated as a first-class, evolving project.

tags:
  - jekyll
  - github-pages
  - meta
  - learning

repo: https://github.com/livingdead1989/networkingdream
started: 2024-12-30
archived: false
og_image: /assets/og/projects/site.png

assets: /assets/projects/networkingdream-site
---

## Overview

NetworkingDream is a deliberately simple website built with **Jekyll and GitHub Pages**.  
It isn’t a marketing site, a startup landing page, or a portfolio chasing attention.

Instead, the site itself is treated as a **long-term project** — something to revisit,
adjust, and improve slowly as understanding (and interests) evolve.

The guiding idea is that software doesn’t need to be loud or complicated to be useful.
Sometimes it just needs to be calm, clear, and easy to live with.

<div class="callout callout-note">
  This site is intentionally boring, and that’s a feature, not a bug.
</div>

---

## Core Principles

This project is guided by a small set of values that influence both design and tooling:

<dl>
  <dt>Clarity</dt>
  <dd>Content and structure should be obvious without documentation.</dd>

  <dt>Durability</dt>
  <dd>The site should survive years of small changes without rewrites.</dd>

  <dt>Restraint</dt>
  <dd>Fewer dependencies means fewer future problems.</dd>

  <dt>Learning</dt>
  <dd>The site exists to document thinking, not just outcomes.</dd>
</dl>

---

## Goals

- Build a structure that can comfortably last for years
- Keep content data-driven and predictable
- Avoid unnecessary plugins, frameworks, or build steps
- Make writing and publishing feel low-friction
- Prioritise readability, accessibility, and calm UI decisions

If something increases cognitive load without clear benefit, it probably doesn’t belong here.

---

## What’s Working Well

<div class="callout callout-tip">
  I have turned the website itself into a long-lived project.
</div>

- Clear separation between posts, projects, and supporting content
- Minimal, GitHub Pages–compatible build setup
- Fast load times and low operational overhead
- Styling that favours consistency over novelty
- Enough structure to guide content, without boxing it in

---

## Content Structure

At its core, the site runs on a very small set of clearly defined collections:

```yaml
collections:
  posts:
    output: true
  projects:
    output: true
```

That’s it. No hidden magic, no surprise inheritance chains, no “where is this coming from?” moments six months later.

Content declares what it is and how it behaves directly in front matter — things like
layout: project or status: active — rather than relying on implicit rules or clever abstractions that only make sense to Past You.

The result is a structure that stays easy to reason about, even after time, context, and enthusiasm have faded a little.

---

## Open questions (and current answers)

<details>
  <summary>What’s the difference between a blog post and a project article?</summary>
  <p>A blog post captures a moment: a thought, a lesson, a mistake, or something learned along the way. It’s allowed to be unfinished, opinionated, or quietly wrong in hindsight.</p>

  <p>A project article is more durable. It represents something that exists over time, changes slowly, and is worth revisiting. Projects may evolve, pause, or get archived, but they’re treated as ongoing artefacts rather than snapshots.</p>

  <p>If a piece of writing still makes sense a year from now, it probably wants to be a project.</p>

</details>

<details>
  <summary>Why a simplified dark theme by default?</summary>

  <p>Because eyes get tired and screens are loud.</p>

  <p>A restrained dark theme reduces visual noise, puts content first, and stays comfortable during long reading or late-night tinkering sessions. It’s not trying to impress — it’s trying to disappear and let the words do the work.</p>

</details>

<details>
  <summary>Why GitHub Pages and Jekyll instead of a traditional CMS like WordPress?</summary>

  <p>Jekyll does one thing very well: turn plain text into a website.</p>

  <p>There’s no database to maintain, no admin panel to babysit, and no surprise updates waiting to break things. Content lives as files, versioned in Git, and deployed predictably through GitHub Pages.</p>

  <p>The trade-off is fewer conveniences — and that’s intentional. The simplicity keeps the site understandable, portable, and durable over time.</p>

</details>

<details>
  <summary>Why strip back dependencies, skip ads, and avoid user tracking?</summary>
  
  <p>Every dependency is a long-term relationship. Most of them don’t age well.</p>

  <p>By keeping the stack small, the site stays fast, transparent, and resilient. No ads means no pressure to optimise for attention. No tracking means readers can exist here without being measured.</p>

  <p>The goal isn’t growth or engagement — it’s usefulness.
  Quietly, respectfully, and without asking anything in return.</p>

</details>

---

## Status

<span class="tag status-active">Active</span>

Changes happen slowly and deliberately, usually triggered by real friction:
something feels awkward, repetitive, or harder than it should be.

There is no roadmap — only small improvements made when they earn their place.

---

## Notes

<div class="callout callout-warning">
  This website will probably never feel “finished” — and that’s intentional.
</div>

If it remains useful, pleasant to write in, and easy to maintain over time,
then it’s doing exactly what it’s meant to do.

Quietly. Reliably. Without drama.
