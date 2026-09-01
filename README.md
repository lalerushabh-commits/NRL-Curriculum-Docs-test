# NRL Curriculum Docs

The NRL robotics curriculum, published as a GitBook-styled documentation site built with [Docusaurus](https://docusaurus.io/).

Converted from the original `NRL_Curriculum.docx`. It now covers three curricula — mechanical, electronics and programming — each in five phases.

> **Writing or editing the curriculum?** Read **[AUTHORING.md](AUTHORING.md)** instead of this
> file. It is the guide for non-developers: setup, the three one-click VS Code tasks, adding
> modules, images and GIFs, and what to do when something breaks.
> **[THEME.md](THEME.md)** covers the site-wide font settings. The rest of this README is for
> maintaining the site itself.

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

- `docs/` — one folder per curriculum, then one per phase, each with a `_category_.json` and numeric-prefixed module files.
- `src/components/ApiTable` — reusable method/parameter table component used in API-heavy chapters.
- `src/theme/Admonition/Types.tsx` — adds a custom `:::keyidea` admonition alongside the built-in note/tip/warning/danger types.
- `src/css/custom.css` — the theme. The **THEME KNOBS** block at the top is the author-facing part; see [THEME.md](THEME.md).
- `static/img/` — images extracted from the source docx via `pandoc --extract-media`. Images added since then are co-located in an `images/` folder next to the page that uses them.

## Authoring tooling

`tools/` holds the scripts behind the VS Code tasks in `.vscode/tasks.json`. No dependencies beyond Node.

- `preview.mjs` — installs deps if missing, installs the pre-push hook, runs `npm start`.
- `new-module.mjs` — interactive scaffolder for a new module or a new phase; derives file number, `sidebar_position`, title and slug from the existing folder contents.
- `check.mjs` — lints for what Docusaurus will not catch (missing/duplicate frontmatter, duplicate slugs, missing image files, phase folders without a `_category_.json`), then runs `npm run build` and translates its errors into plain English.
- `install-hooks.mjs` — writes a `pre-push` hook that runs `check.mjs` and refuses to push a site that does not build. Since pushes to `main` deploy straight to production, this is the safety net.
