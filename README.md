# NRL Curriculum Docs

The NRL robotics curriculum, published as a GitBook-styled documentation site built with [Docusaurus](https://docusaurus.io/).

Converted from the original `NRL_Curriculum.docx`. This first pass ships the full 24-chapter navigation across all 5 parts, with 3 chapters fully written (Ch.1 Welcome to NRL, Ch.7 Motors, Ch.22 API Quick Reference) as a style reference — the rest are "coming soon" stubs pending the next conversion pass.

## Local Development

```bash
npm install
npm start
```

Starts a local dev server with live reload at `http://localhost:3000/NRL-Curriculum-Docs/`.

## Build

```bash
npm run build
```

Generates the static site into `build/`. Run `npm run serve` afterwards to preview the production build locally.

## Deployment

Pushes to `main` build and deploy automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) to GitHub Pages. In the repo settings, **Settings → Pages → Source** must be set to **GitHub Actions** for this to take effect.

## Content structure

- `docs/` — one folder per curriculum part (`part-1-foundations` … `part-5-examples-troubleshooting-reference`), each with a `_category_.json` and numeric-prefixed chapter files.
- `src/components/ApiTable` — reusable method/parameter table component used in API-heavy chapters.
- `src/theme/Admonition/Types.tsx` — adds a custom `:::keyidea` admonition alongside the built-in note/tip/warning/danger types.
- `static/img/curriculum/` — images extracted from the source docx via `pandoc --extract-media`.
