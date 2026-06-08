# AGENTS.md

Static personal site ("KKLab", owner Katz Kawai). **No build system.** Hand-authored HTML/CSS/vanilla JS, deployed via GitHub Pages from `main`. Primary language is Japanese.

## Commands

```bash
# local preview (requires HTTP — file:// blocks XHR includes)
python -m http.server
```

## Architecture

- **Client-side includes:** Each page has `<div id="navbar-placeholder">` / `<div id="footer-placeholder">`. `js/components.js` fetches `includes/navbar.html` / `includes/footer.html` via XHR on DOMContentLoaded and swaps in via `outerHTML`. **Edit `includes/` for site-wide chrome changes** — never hand-edit nav/footer inside individual pages.
- **`js/components.js` must load before `js/main.js`** (navbar must be in DOM before `main.js` delegated listeners attach).
- **CSS design tokens:** `:root` custom properties in `style.css` (`--accent`, `--accent-grad`, `--surface`, `--radius`, etc.) — reuse these instead of hardcoding.
- **PWA / Service Worker (`sw.js`):** Hardcoded `urlsToCache` precache list + `CACHE_NAME` (currently `kklab-cache-v3`). When adding a core page/asset, add its path AND bump `CACHE_NAME`.
- **Scroll animation:** add class `reveal` to any element → fades in via `IntersectionObserver` (`js/main.js`).
- **Modals:** native `<dialog>` with `data-open-dialog`/`data-close-dialog` attributes.
- **`contact.html` form** is placeholder — checks for `YOUR_FORM_ID` in action URL and blocks submission.
- **`offline.html`** is self-contained (inline styles) — no dependency on `style.css`.

## Page sync checklist

When adding/removing a page, update all of:
1. `includes/navbar.html` and `includes/footer.html`
2. `sw.js` — `urlsToCache` array + bump `CACHE_NAME`
3. `manifest.json` — `shortcuts` array
4. `sitemap.xml`

## Conventions

- HTML5, `<html lang="ja">`, UTF-8, 4-space indent, double quotes.
- Semantic landmarks (`<header>`/`<main>`/`<footer>`), `id="main-content"` skip-link target, `aria-*`.
- Class names: descriptive kebab-case.

## CI

Only `.github/workflows/claude.yml` (responds to `@claude` in issues/PR comments). No test/lint/build CI.
