# NRL Curriculum Docs

The NRL robotics curriculum, published as a GitBook-styled documentation site built with [Docusaurus](https://docusaurus.io/).

It covers three curricula — mechanical, electronics and programming — each in five phases.

**The master copy is `source/NRL-Curriculum-Complete.docx`.** Everything under `docs/` is
generated from it by `tools/word/` and must not be hand-edited — the next publish overwrites it.
The person who writes the curriculum edits that one Word file and presses Publish in the NRL
Curriculum Publisher; nothing else is part of their workflow.

> **Writing or editing the curriculum?** Read **[AUTHORING.md](AUTHORING.md)** instead of this
> file. **[THEME.md](THEME.md)** covers the site-wide font settings. The rest of this README is
> for maintaining the site itself.

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
- `static/img/` — every image in the book. The converter matches pictures embedded in the Word
  document against these by content hash, so an unchanged picture keeps its existing filename and
  only genuinely new ones are written.
- `source/` — the master Word document, the drawing-sheet PDFs that ship beside it, and `manifest.json`.

## The converter

`tools/word/` turns the Word document into the site. It reads the OOXML directly rather than
going through pandoc or mammoth, because in this document the meaning of a block lives in its
formatting — a cell's background colour is what separates an admonition from a code block from a
data table, and both of those converters discard it before you can look. Pandoc additionally
drops every heading in this particular file, silently: its `styles.xml` bases the heading styles
on a `Normal` style it never defines.

- `ooxml.mjs` — reads the .docx into an annotated block stream.
- `grammar.mjs` — the block rules: coloured box → admonition, grey monospaced box → fenced code,
  `Member`/`Purpose` table → `<ApiTable>`, `▶ Watch:` link → `<YouTubeEmbed>`, and so on.
- `convert.mjs` — segments the document into pages, resolves identity and links, and returns the
  whole site as an in-memory map. Touches nothing on disk.
- `manifest.mjs` / `seed-manifest.mjs` — `source/manifest.json`, holding what the document cannot
  express: folder names, `_category_.json` contents, **frozen slugs**, code-block languages, and
  pins for the two animated GIFs Word flattens to stills.
- `compare.mjs` — the render-equivalent normalisations (soft line breaks, blank lines around
  block elements, ApiTable quote style) that keep verification about content.
- `verify.mjs` — the regression test. Converts the document and diffs the result against `docs/`.
- `publish.mjs` — convert → check → commit → push, in that order, reverting on any failure.

Also in `tools/`:

- `preview.mjs` — installs deps if missing, installs the pre-push hook, runs `npm start`.
- `check.mjs` — lints for what Docusaurus will not catch (missing/duplicate frontmatter,
  duplicate slugs, missing image files, phase folders without a `_category_.json`, and drift
  between `docs/` and the manifest), then runs `npm run build` and translates its errors into
  plain English.
- `install-hooks.mjs` — writes a `pre-push` hook that runs `check.mjs` and refuses to push a site
  that does not build. Since pushes to `main` deploy straight to production, this is the safety net.

## The publisher

`publisher/` is the Windows window the curriculum author double-clicks (Python + tkinter,
packaged by `build-exe.ps1`). It is deliberately thin — it clones this repo into a private
working copy under `%LOCALAPPDATA%`, keeps it up to date, and runs `tools/word/publish.mjs` — so
a converter fix reaches every machine on the next run without rebuilding the exe.
