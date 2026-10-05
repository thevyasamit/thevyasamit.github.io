<div align="center">

<a href="https://thevyasamit.github.io"><img src="images/personal_logo.png" alt="AV logo" width="120"></a>

# Amit Vyas Public Website

**AI and Research Software Engineer** &middot; profile, CV and writing

[![Build & deploy](https://github.com/thevyasamit/thevyasamit.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/thevyasamit/thevyasamit.github.io/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fthevyasamit.github.io&label=site&up_message=online)](https://thevyasamit.github.io)
[![Built with Jekyll](https://img.shields.io/badge/built%20with-Jekyll%204-cc0000?logo=jekyll&logoColor=white)](https://jekyllrb.com/)
[![Last commit](https://img.shields.io/github/last-commit/thevyasamit/thevyasamit.github.io)](https://github.com/thevyasamit/thevyasamit.github.io/commits/master)
<br>
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue)](LICENSE)
[![Content: all rights reserved](https://img.shields.io/badge/content-%C2%A9%20all%20rights%20reserved-lightgrey)](LICENSE)

[**Live site**](https://thevyasamit.github.io) &nbsp;&middot;&nbsp;
[Writing](https://thevyasamit.github.io/writing/) &nbsp;&middot;&nbsp;
[CV](https://thevyasamit.github.io/assets/Amit_Vyas_CV.pdf) &nbsp;&middot;&nbsp;
[Google Scholar](https://scholar.google.com/citations?user=6D2uXYEAAAAJ&hl=en) &nbsp;&middot;&nbsp;
[GitHub](https://github.com/thevyasamit) &nbsp;&middot;&nbsp;
[LinkedIn](https://www.linkedin.com/in/thevyasamit/) &nbsp;&middot;&nbsp;
[X](https://twitter.com/thevyasamit)

<sub>A static <a href="https://jekyllrb.com/">Jekyll</a> site, hosted free on GitHub Pages, built and deployed by GitHub Actions.</sub>

<br>

<i>We are in a world where almost everything is virtual. Just like in the earlier
days of civilisation people used to have a home/mailing address, I believe now
is the time where people should have an e-address for their presence in this
vast, web-dominating world in addition to their physical presence.</i>

</div>

---

## Contents

- [Adding a post](#adding-a-post)
- [Tags and authorship](#tags-and-authorship)
- [Editing everything else](#editing-everything-else)
- [Repository layout](#repository-layout)
- [Running locally](#running-locally)
- [What's used](#whats-used)
- [SEO & discoverability](#seo--discoverability)
- [Accessibility](#accessibility)
- [Analytics](#analytics)
- [Deployment](#deployment)
- [The footer year](#the-footer-year)
- [Licence](#licence)

---

## Adding a post

One Markdown file in `_posts/`, named `YYYY-MM-DD-some-slug.md`:

```markdown
---
title: "The title of the post"
date: 2026-09-01
tags: [ai, gpu]              # must come from _data/tags.yml
authorship: human-written    # or ai-written; required
description: >-
  One or two sentences, 50-160 characters. This is the Google snippet and
  the post-list excerpt — worth writing properly.
---

Body goes here, in Markdown.
```

Optional: `last_modified_at: 2026-09-14` adds an "Updated" date and feeds
`dateModified` in the structured data.

Push to `master`. The post then appears at `/writing/some-slug/` and is added
**automatically** to:

| Surface                   | How                                        |
| ------------------------- | ------------------------------------------ |
| Writing index             | `writing/index.html` loops `site.posts`     |
| Tag filter chips          | Derived from `site.tags` — new tags just work |
| Full-text search          | `search.json` is regenerated at build time  |
| `sitemap.xml`             | `jekyll-sitemap`                            |
| `feed.xml` (RSS)          | `jekyll-feed`                               |
| `llms.txt`                | Loops `site.posts`                          |
| JSON-LD `BlogPosting`     | `_includes/schema.html`                     |

Nothing is hardcoded per-post. Tags come from a fixed list -- see below.

Unpublished drafts go in `_drafts/` (no date in the filename); preview them with
`bundle exec jekyll serve --drafts`.

## Tags and authorship

Two separate controlled vocabularies. Provenance is not a topic, so keeping
them apart stops "AI" (a subject) and "AI-written" (a disclosure) from
rendering as the same kind of chip.

| File | Field | Values |
| ---- | ----- | ------ |
| `_data/tags.yml` | `tags:` | tech, ai, software, gpu, cpu, business, economy, finance, society, psychology, philosophy |
| `_data/authorship.yml` | `authorship:` | human-written, ai-written |

**Adding a tag:** append an entry to `_data/tags.yml` with a `slug`, `label`
and `description`, then use the slug in front matter. The filter chips, the
`keywords` in JSON-LD, the `og:article:tag` meta and the validator all derive
from that one file. Chips appear in file order — broad topics first — and only
tags actually in use are shown, since a chip that filters to nothing is worse
than no chip.

**Removing a tag:** delete the entry. The build then *fails* and names every
post still using it, so a tag can never disappear silently.

`script/validate-content.rb` runs in CI before the build and checks that every
tag and authorship value is in vocabulary, that `description` exists and is
50-160 characters, that `title` is present, and that the filename date matches
the front-matter date (a classic Jekyll trap where a post silently fails to
publish). Unknown values get a "did you mean" suggestion. Run it locally with:

```bash
ruby script/validate-content.rb
```

Because pull requests build too, a bad tag is caught before merge.

Authorship is required with no default — a disclosure that defaults silently
isn't a disclosure. It renders as a labelled badge on the post, shaped
deliberately unlike a topic chip, and appears in the post list so readers can
see it before clicking.

## Editing everything else

No HTML required — the content is YAML, the templates just render it.

| File                     | Controls                                              |
| ------------------------ | ----------------------------------------------------- |
| `_data/home.yml`         | Sidebar tagline (with its struck-out words), homepage intro, and the four homepage cards |
| `_data/social.yml`       | Sidebar icon links and the homepage card buttons (`icon` maps to a symbol in `_includes/icons.html`) |
| `_data/nav.yml`          | Sidebar navigation items (Home, Writing)              |
| `_data/experience.yml`, `_data/education.yml`, `_data/publications.yml` | Not shown on the page any more; they still feed `llms.txt` and the JSON-LD |
| `_config.yml`            | Name, role, org, description, social handles, timezone |
| `assets/Amit_Vyas_CV.pdf`| The CV. Replace the file (same name) to update it -- the link stays the same |

A homepage card links either to a `social:` entry (looked up by `icon`, so each
URL lives in one place) or to a `url:`. Links that leave the site, and files
like the CV, open in a new tab; navigation within the site does not.

Adding a new social link needs an `<svg><symbol id="i-yourname">` in
`_includes/icons.html` plus an entry in `_data/social.yml`.

## Repository layout

```
├── _config.yml              site config + build settings
├── Gemfile                  dependencies (lockfile is gitignored;
│                             CI resolves fresh — see note below)
├── _data/                   ALL editable content (YAML)
├── _layouts/                default → page / post
├── _includes/               head, sidebar, footer, icons, schema
├── _posts/                  the writing (Markdown)
├── _drafts/                 unpublished writing
├── writing/index.html       post index: tag filter + search
├── index.html               homepage
├── 404.html
├── assets/
│   ├── css/main.css         one stylesheet, tokenised
│   ├── js/site.js           theme toggle, mobile nav, sidebar hide/show,
│   │                         new-tab links, heading anchors
│   ├── js/writing.js        tag filtering + full-text search
│   ├── Amit_Vyas_CV.pdf     the CV linked from the homepage
│   └── favicon.png
├── images/                  portrait, logo, derived icons, OG card,
│                             post images (images/posts/<slug>/)
├── search.json              full-text index, generated at build
├── llms.txt                 plain-text site summary for AI agents
├── robots.txt
├── site.webmanifest
├── LICENSE                  code: MIT · content: all rights reserved
└── .github/workflows/       build+deploy, footer-year refresh
```

## Running locally

```bash
bundle install
bundle exec jekyll serve          # http://127.0.0.1:4000
bundle exec jekyll serve --drafts # include drafts
```

Needs Ruby 3.0 or newer.

`Gemfile.lock` is intentionally **not** committed: a lockfile generated by a
newer local Ruby can pin a `BUNDLED WITH` version the Actions runner cannot
install. The `Gemfile` uses `~>` constraints, so CI resolves compatible
versions on its own.

## What's used

Deliberately small. No framework, no bundler, no CDN, no cookies.

| Thing | Why |
| ----- | --- |
| [Jekyll 4](https://jekyllrb.com/) | Static site generator; native to GitHub Pages |
| [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) | Canonical URLs, Open Graph, Twitter card meta |
| [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap) | `sitemap.xml` |
| [jekyll-feed](https://github.com/jekyll/jekyll-feed) | RSS/Atom feed |
| [Rouge](https://github.com/rouge-ruby/rouge) | Syntax highlighting |
| [html-proofer](https://github.com/gjtorikian/html-proofer) | Broken-link/HTML check in CI |
| GitHub Actions + Pages | Build and hosting, free |
| [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) | Traffic stats. Cookieless, ~2KB, free |
| Vanilla JS (~6 KB, no deps) | Theme toggle, nav, tag filter, search |
| System font stack | Zero webfont downloads, native look per-OS |
| Hand-rolled inline SVG sprite | Replaced Font Awesome (~70 KB CSS + webfonts) with ~2 KB |

Total first paint is roughly **63 KB**, with no external requests other than the analytics beacon.

**Credits:** the site is written from scratch. Earlier versions used an
[HTML5 UP](https://html5up.net/) template; none of that code remains.
The AV monogram is my own logo.

## SEO & discoverability

- Every post is a **real page at its own URL** with its own `<title>`,
  meta description and canonical link — the thing that actually gets indexed.
- `sitemap.xml`, `robots.txt` (with the sitemap declared) and an RSS feed.
- schema.org JSON-LD: `Person` + `WebSite` (with a `SearchAction` pointing at
  `/writing/?q=`) on the homepage, `BlogPosting` + `BreadcrumbList` on every
  post, so Google can render the Home > Writing > Post trail in results.
- `article:author` and `article:tag` Open Graph tags for LinkedIn/Facebook
  previews (jekyll-seo-tag emits `article:published_time` but not these).
- Authorship is recorded in JSON-LD via `additionalProperty`, schema.org's
  sanctioned extension point, since schema.org has no property for AI
  authorship. An IPTC digital-source-type URI is emitted alongside it. That
  vocabulary was designed for images and search engines do not visibly act on
  it yet; the badge on the page is what communicates this today.
- Open Graph + Twitter `summary_large_image` card (`images/og-card.png`).
- Favicon is a **square, 96×96** PNG (a multiple of 48, which is what Google
  requires to show an icon beside a search result) and is crawlable.
- **For AI agents:** `llms.txt` gives a plain-text summary of the site, the
  post list, current role and publications; `search.json` exposes full post
  text as JSON. Both are linked from `<head>` and the footer, and `robots.txt`
  welcomes crawlers.

## Accessibility

Targets WCAG 2.1 AA.

- Skip-to-content link, semantic landmarks, one `<h1>` per page, no heading skips.
- All colour pairs meet AA — body text ≥ 4.5:1, control borders ≥ 3:1
  (`--border-strong`) in **both** themes. Ratios are noted in `main.css`.
- Filter and search are **progressive enhancement**: the full post list is
  rendered server-side and works with JavaScript disabled.
- Real `<button>`/`<input>` elements with labels, `aria-pressed`, `aria-current`,
  and an `aria-live` region announcing result counts.
- Visible focus rings, Escape closes the mobile nav, `prefers-reduced-motion`
  and `forced-colors` respected, plus a print stylesheet.

## Analytics

Cloudflare Web Analytics, configured by `analytics.cloudflare_token` in
`_config.yml` and rendered by `_includes/analytics.html`.

The token is **public by design** -- it ships in the HTML of every page, so it
is committed deliberately rather than hidden. It is write-only and
hostname-bound: Cloudflare rejects beacons whose hostname does not
postfix-match the one registered in the dashboard, and it cannot be used to
read any data.

The beacon only renders when `jekyll.environment` is `production`, so local
`jekyll serve` never pollutes the stats. The token is compared against `""`
rather than tested for truthiness, because Liquid treats an empty string as
true -- without that, an unset token would emit a beacon with `token:""` and
fail silently. Blank the value to disable analytics entirely.

Cookieless, so no consent banner is required.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `master`: builds with
`JEKYLL_ENV=production`, runs html-proofer over the output to catch broken
links, then publishes to GitHub Pages.

Pull requests run the same build and link-check but skip the deploy job, so
`build` works as a required status check without ever publishing from a PR.
Both `master` and `main` are watched, so renaming the default branch cannot
silently stop deploys.

GitHub Pages is set to deploy from **GitHub Actions**, so this workflow is
the only thing that builds and publishes the site.

### Branch protection

`master` is protected against deletion and force pushes, with history kept
linear. Pull requests and status checks are deliberately **not** required:
posts are pushed straight to `master`, and a direct push has no checks yet, so
GitHub would reject every one. The validator still runs on every push and
fails the deploy, so a broken post never goes live.

## The footer year

The copyright year is rendered at build time from `site.time`
(`_includes/footer.html`), with the site timezone pinned to `Etc/UTC`, so it is
correct on every deploy. `.github/workflows/refresh-year.yml` forces a redeploy
at **00:10 UTC on 1 January** so the year rolls over even in a year with no
commits, with a monthly run as a safety net. No bot ever commits to the repo.

Why just after midnight and not `23:59` on 31 December: `site.time` reads the
*build* clock, so a build starting at 23:59 would still render the old year.
Verified:

| Build clock (UTC)     | Footer renders |
| --------------------- | -------------- |
| 2026-12-31 23:59      | © 2026 ❌       |
| 2027-01-01 00:10      | © 2027 ✅       |

## Licence

<div align="center">

**Code: [MIT](LICENSE)** &nbsp;&middot;&nbsp; **Content: © Amit Vyas, all rights reserved**

The site's structure, templates, styles and scripts are free to reuse for your
own site.<br>
The writing, the portraits, the AV logo, the post images, the CV and the
personal profile text are not.<br>
Short quotes with a link back are welcome. See [`LICENSE`](LICENSE) for exactly
which files are which.

<sub>© 2026 Amit Vyas</sub>

</div>
