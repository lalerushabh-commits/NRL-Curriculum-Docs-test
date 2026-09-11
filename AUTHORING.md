# Editing the NRL Curriculum

Everything on the curriculum website comes from **one Word document**:

```
NRL-Curriculum-Complete.docx
```

You edit that document in Word, the way you would edit anything else. When you
want the website to catch up, you press one button. That is the whole system.

You never edit the website directly. You never need GitHub, VS Code, or a
terminal. If someone shows you a folder full of files ending in `.md` — those
are made *from* your document, automatically, every time you publish. Changing
them by hand is pointless: the next publish overwrites them.

> **This is the opposite of how it used to work.** Until now the website was the
> master copy and Word was only a way of drafting one page at a time. It is the
> other way round now: the Word document is the book.

---

## Part 1 — Setting up (once)

1. Install **Node.js** — go to [nodejs.org](https://nodejs.org), take the big
   green **LTS** button, and click Next through the installer.
2. Install **GitHub Desktop** — [desktop.github.com](https://desktop.github.com).
   Open it once and sign in with the NRL GitHub account. You will not use the
   app itself; the publisher needs it in order to be allowed to update the site.
3. Put **NRL Curriculum Publisher.exe** somewhere you will find it. The Desktop
   is fine.
4. Keep the Word document at
   `Desktop\NRL-Curriculum-Complete\NRL-Curriculum-Complete.docx`. If you keep
   it somewhere else, the publisher has a **Choose a different file** link, and
   it remembers your choice.

The first time you press Publish it spends a few minutes setting itself up.
That happens once.

---

## Part 2 — Publishing

1. Make your edits in Word.
2. **Save, and close Word.** The publisher refuses to run while the document is
   open, because it can only read what has actually been saved.
3. Double-click **NRL Curriculum Publisher**.
4. Press **Publish to the website**.

It tells you what it is doing as it goes, and finishes with *"Published. The
website will update in about two minutes."* Wait those two minutes, then
refresh the site.

There is also **Check without publishing**. It does every step except the last
one, so it finds any mistake without touching the live website. Use it as often
as you like — it cannot do any harm.

If anything is wrong, the publisher stops, says so in plain English, and
**leaves the website exactly as it was**. There is no half-published state.

---

## Part 3 — How the document becomes the website

The structure comes from Word's **heading styles**. This is the one technical
thing worth understanding, and it is not complicated: in Word's Home tab there
is a gallery of styles — Normal, Heading 1, Heading 2, and so on.

| Word style | What it makes |
|---|---|
| **Heading 1** | A curriculum — one of the three big parts of the book |
| **Heading 2** | A phase inside a curriculum |
| **Heading 3** | **One page on the website** |
| **Heading 4** or **Heading 5** | A heading inside a page |
| **Heading 6** | A smaller heading inside a page |
| Normal | Ordinary writing |

A Heading 3 has to be written exactly like this:

```
Module 3.4: The Gamepad
```

The number before the dot is the phase; the number after it is the page's place
in that phase. If a heading is not in that form, the publisher tells you which
one and stops.

### Adding a page

Put a new **Heading 3** where you want it, named in that pattern, and write
underneath it. That is all. The publisher creates the page and tells you its new
web address.

### Renaming a page

Change the words after the colon. The sidebar changes; **the web address does
not**. That is deliberate — anyone who saved a link to that page still gets
there. The publisher says so every time:

> Renamed: "Gears & Gear Ratio" is now "Gears and Gear Ratios".
> Its web address stays /phase-1-mechanical-fundamentals/gears-and-gear-ratio.

### Renaming a curriculum or a phase

Change the Heading 1 or Heading 2 text. The name in the sidebar follows; the
web addresses underneath it do not move. The publisher reports it:

> Section renamed: "Phase 1: Foundations" is now "Phase 1: C++ Foundations".

### Reordering pages

Move a Heading 3, with everything under it, up or down. Renumber the headings so
they still read 1, 2, 3 in order. The sidebar follows.

### Deleting a page

Delete the Heading 3 and everything under it. The publisher **stops and asks
first**, because deleting a page also kills its web address, and anyone with a
saved link to it will get an error page from then on.

---

## Part 4 — The coloured boxes

The book uses five kinds of box. Each is a **single-cell table with a coloured
background** and a bold label on its first line.

The reliable way to make one: find a box of the kind you want, select the whole
box, copy it, paste it where you want it, and type over the text. Do not build
one from scratch — copying keeps the colours right, and the colours are how the
publisher recognises it.

The label on the first line must start with exactly one of these:

| Label | What it becomes |
|---|---|
| `Note` | A note |
| `Tip` | A tip |
| `Warning` | A warning |
| `Key Idea` | A key idea |
| `Reveal the Answer` | A hidden answer the reader clicks to open |

The first four can take a title of your own after a colon:

```
Warning: The one-second rule
Key Idea: The ratio of teeth controls the ratio of speeds
Tip: Check your work
```

Label a box anything else — `Caution`, say — and the publisher stops and tells
you, rather than guessing. A safety warning quietly turned into a mild note is
worse than a publish that did not happen.

---

## Part 5 — Code

Code lives in its own **grey single-cell table**, in the Consolas font. Same
advice as the boxes: copy an existing code block and type over it.

Code written inside a sentence — like `gamepad1.leftY()` — is the same font with
the same grey shading, applied to just those words.

---

## Part 6 — Pictures

Paste a picture into Word where you want it, then put a line **in italics**
directly underneath describing it. That italic line is the caption. It is not
optional: it is what a blind reader's screen reader announces, and the publisher
stops if a picture does not have one.

If you also want the caption **visible** underneath the picture on the website,
write it twice — two identical italic lines. One italic line means the
description is there but not shown; two means it is shown as well. Both styles
are already used in the book.

Worth knowing:

- **Animations.** Word cannot show an animated GIF; it freezes it to one frame.
  Two pictures in the book are animations, and the publisher knows to keep the
  real animation rather than Word's frozen frame. If you want a *new* animation
  on a page, ask rather than pasting it in.
- **Paste pictures, not drawing objects.** A chart or diagram pasted from
  another Office program is stored in a format the website cannot show. The
  publisher stops and names the picture. Save it as a PNG or JPG and paste that.
- Pictures already in the book are reused exactly as they are. Only genuinely
  new ones get added, and the publisher lists them for you.

---

## Part 7 — Links

- **To a website** — Word's normal Insert → Link.
- **To another page in the book** — link to that page's heading (Insert → Link →
  Place in This Document). Write the link text either as the page's name or as
  `Module 4.6`. Both work.

If a link points at a page that does not exist, the publisher stops and tells
you which page and which link. It will not publish a broken link.

---

## Part 8 — What the publisher checks

Before anything goes live, it:

1. Refuses to run while the document is open in Word.
2. Reads the whole document and reports **every** problem at once, so you fix
   them in one pass instead of one publish at a time.
3. Refuses to delete pages unless you say so.
4. Stops if the document has suddenly lost a large part of the book — that
   normally means the wrong file or a bad save, not a decision.
5. **Builds the entire website** and only carries on if it works.
6. Only then publishes.

If any step fails, nothing is published and the live website is untouched.

---

## Part 9 — What you cannot break

- You cannot break the live website by editing Word. The publisher builds the
  whole site first and refuses to publish a broken one.
- You cannot lose your writing. The Word document is yours; the website is made
  from it. Every publish is also saved in the project's history and can be undone.
- You cannot accidentally move a page's web address by renaming it.
- If you are unsure, press **Check without publishing**.

---

## Part 10 — Changing how the site looks

Fonts and text size live in `THEME.md`. That is a job for whoever maintains the
site, not something you need to touch in order to write the book.

---

## For whoever maintains this

The converter is in `tools/word/`. Reading `ooxml.mjs` then `grammar.mjs` is the
fastest way in. Things worth knowing before changing anything:

- **`verify.mjs` is the regression test.** It converts the document and compares
  the result against `docs/` page by page. If a change to the converter starts
  losing something, this is what says so. Run it after every change.
- **`source/manifest.json` holds everything the Word document cannot say** —
  folder names, sidebar labels and descriptions, frozen web addresses, which
  code block is C++ and which is plain text, and the two animated GIFs Word
  flattens to stills. Losing it means losing every page's web address. It is
  committed for that reason.
- **`docs/` is generated output.** Do not hand-edit it; `check.mjs` compares it
  against the manifest and complains if the two have drifted.
- **Neither pandoc nor mammoth can do this job.** What separates a warning from
  a code block from a data table in this document is the cell's background
  colour, and both converters discard it before you can look. Pandoc also drops
  every heading in this particular file, silently, because its `styles.xml`
  defines the heading styles as based on a `Normal` style that it never defines.
- **The publisher window is `publisher/`**, packaged by `publisher/build-exe.ps1`.
  It is deliberately thin: the converter it runs comes from this repository, so
  a converter fix reaches every machine on the next run without rebuilding the
  exe.
