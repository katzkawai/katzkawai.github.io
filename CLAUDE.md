# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Static personal site ("KKLab", owner Katz Kawai) deployed via **GitHub Pages** from `main` (custom domain in `CNAME`). No build step — hand-authored HTML/CSS/vanilla JS served as-is. Primary language is Japanese. It is also a **PWA** (manifest + service worker + offline page). There is **no framework**: Bootstrap and jQuery were removed in favor of a lean modern CSS/JS design system.

## Development
- **No build system.** Edit files and commit; GitHub Pages deploys `main` automatically.
- **Local preview:** `python -m http.server` then open `http://localhost:8000`. Use a real server (not `file://`) — `js/components.js` fetches partials over XHR, which is blocked on the `file://` protocol.
- **Validate HTML:** W3C validator (https://validator.w3.org/).

## Architecture

### Shared navbar/footer via client-side includes
There is no server templating. Each page is a standalone HTML file that injects shared chrome at runtime:
- A page places `<div id="navbar-placeholder"></div>` and `<div id="footer-placeholder"></div>` where the chrome should go.
- `js/components.js` fetches `includes/navbar.html` / `includes/footer.html` via XHR, replaces the placeholder via `outerHTML`, then marks the active link by matching `window.location.pathname` against each `.nav-menu a` href and setting `aria-current="page"`.
- **Edit `includes/navbar.html` / `includes/footer.html` to change nav/footer site-wide** — do NOT hand-edit chrome inside individual pages.

### Design system (style.css)
Single stylesheet, no CSS framework. Tokens live in `:root` CSS custom properties (`--accent`, `--accent-grad`, `--surface`, `--radius`, etc.) — reuse these instead of hardcoding colors. The accent is an indigo→violet gradient (`#6366f1`→`#8b5cf6`). Layout uses Flexbox/Grid; `.container` centers content at `--container` width. Honors `prefers-reduced-motion`.

### js/main.js (runs on every page, vanilla, feature-detected)
`DOMContentLoaded` wires: back-to-top button, `IntersectionObserver` scroll reveal (`.reveal` → `.in`), contact-form validation, and **service worker registration** (`/sw.js`). A single delegated `click` listener on `document` handles the mobile nav toggle (`.nav-toggle` ↔ `#nav-menu.open`) and native `<dialog>` open/close (`[data-open-dialog="#id"]` / `[data-close-dialog]`) — delegation is required because the navbar is injected after load. Per-page features are guarded by element presence, so the file is safe to load everywhere.

### Page interactions
- **Mobile menu:** the injected navbar's `.nav-toggle` button toggles `#nav-menu.open`; handled by delegation in `main.js`.
- **Modals:** use the native `<dialog>` element with `data-open-dialog`/`data-close-dialog` hooks (see `contact.html` privacy policy) — no Bootstrap modal/JS.
- **Scroll-in animation:** add class `reveal` to any element; it fades in when scrolled into view.

### PWA / Service Worker (sw.js)
Cache name `kklab-cache-v5`. **Navigation requests (HTML) are network-first** — fresh HTML is fetched and re-cached on every visit, falling back to cache and then `/offline.html` when offline — so page-content edits (e.g. adding a work card) do NOT require a cache bump. All other resources (CSS/JS/images/partials) are cache-first. **`urlsToCache` is a hardcoded precache list** (includes the HTML pages, `style.css`, `js/*.js`, and the `includes/*.html` partials). When adding a core page/asset that must work offline, or when changing a cache-first asset that must reach returning visitors, add/keep its path there AND bump `CACHE_NAME` (e.g. `-v6`) so the old cache is purged on `activate`. `offline.html` is intentionally self-contained (inline styles) so it renders without `style.css`.

## Conventions
- **HTML5**, UTF-8, `<html lang="ja">`, 4-space indent, double quotes.
- Semantic landmarks (`<header>`/`<main>`/`<footer>`), `id="main-content"` skip-link target, `aria-*` where relevant — keep accessibility intact.
- Class names are descriptive kebab-case.
- HTML pages live in repo root; images in `imgs/`; shared partials in `includes/`; scripts in `js/`.
- When adding/removing a page, keep these in sync: `sitemap.xml`, the `sw.js` precache list + cache version, `manifest.json` shortcuts, and the nav/footer partials.

## CI
`.github/workflows/claude.yml` runs `claude-code-action` on issues/PR comments containing `@claude`. There is no test/lint/build CI.
