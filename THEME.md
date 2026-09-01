# Changing how the site looks

Four settings control the typography of the whole curriculum. They live at the top of
`src/css/custom.css`, in a block marked **THEME KNOBS**, and each one is explained in a comment
right above it.

Everything below the second banner in that file is the site's own styling. Leave it alone.

**Check with Rushabh before changing any of these.** They apply to all three curricula at once
and the fonts are part of the NRL brand.

---

## The four settings

### `--nrl-font-body`

The font used for ordinary paragraph text. Choose one of:

| Value | What it looks like |
|---|---|
| `'Inter'` | The current one. Neutral and modern, the default of most software. |
| `'Lexend'` | Rounder and roomier. Designed to be easier for younger and less confident readers. |
| `'Atkinson Hyperlegible'` | Built for readers with low vision — letters that are hard to confuse with each other. |
| `'Source Serif 4'` | A serif. More like a printed textbook, less like a website. |

### `--nrl-font-headings`

The font used for headings. The same four choices, plus:

| Value | What it looks like |
|---|---|
| `'Funnel Display'` | The current one. Matches the NRL marketing site. Headings only — it is not a reading font. |

### `--nrl-text-size`

The overall size of everything. `100%` is the default. `105%` or `110%` makes the whole site
larger; `95%` makes it smaller. Headings, body text and spacing all scale together, so the
proportions stay right.

### `--nrl-heading-weight`

How heavy headings look: `600` semi-bold, `700` bold, `800` extra bold. Only *Funnel Display*
and *Lexend* have an `800` — with the other fonts it will silently fall back to bold.

---

## How to change one

1. Open `src/css/custom.css`.
2. Start the preview (*Terminal → Run Task → 1. Preview the site*).
3. Edit one value inside the **THEME KNOBS** block and save. The browser updates immediately.
4. Look at it in **both** light and dark mode — the toggle is in the top right of the site.
5. Run *4. Check before publishing*, then commit as usual.

Keep the quotes exactly as they are: `--nrl-font-body: 'Lexend';` works,
`--nrl-font-body: Lexend;` does not.

---

## What is deliberately not adjustable

**Colours.** The palette is seven co-ordinated indigo shades plus a pink accent, defined twice —
once for light mode and once for dark. Changing one in isolation produces something that looks
broken in one of the two modes. This is a job for Rushabh.

**Per-word or per-paragraph fonts.** There is no way to make one paragraph a different font or
size, in the way you would in Word. That is intentional: it is what keeps the whole curriculum
looking like one book rather than sixty separate documents. For emphasis, use **bold** or one of
the coloured boxes described in Part 9 of [AUTHORING.md](./AUTHORING.md).

---

## Adding a font that is not on the list

This one needs Rushabh, and takes two minutes:

1. Find the font on <https://fontsource.org> and install it, e.g. `npm install @fontsource/figtree`.
2. Add the weights you need to the `@import` list at the top of `src/css/custom.css`, next to
   the existing alternatives — body fonts want 400/600/700, headings want 600/700 (and 800 if
   the family has one).
3. Add it to the comment listing the choices, so the next person knows it is available.
4. Set the knob to it and check both light and dark mode.

Unused families cost visitors nothing — a browser only downloads a font it actually has to draw
with — so it is fine to keep a few options installed.
