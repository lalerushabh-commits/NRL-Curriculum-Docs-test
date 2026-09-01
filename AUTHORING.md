# Editing the NRL Curriculum

This guide is for whoever writes and edits the curriculum. It assumes you have never used
GitHub, VS Code or the command line, and it never asks you to type a command.

The whole site is just a folder of ordinary text files, one per module. You edit them, you
watch the site update in your browser as you type, you run one check, and you publish.

---

## Part 1 — Setting up (once, on your computer)

You need three free programs. Install them in this order.

1. **Node.js** — <https://nodejs.org>. Take the big green **LTS** button. Click Next through
   the installer and accept the defaults. You will never open this program; other things use it.
2. **Visual Studio Code** — <https://code.visualstudio.com>. This is the editor you will write in.
3. **GitHub Desktop** — <https://desktop.github.com>. This is how your work gets saved and shared.

Then get the curriculum onto your computer:

4. Open **GitHub Desktop** and sign in with the GitHub account you were invited with.
5. Choose **File → Clone repository**, pick **NRL-Curriculum-Docs** from the list, and note the
   folder it saves into. Click **Clone**. It takes a minute.
6. Open that folder and double-click **`NRL-Curriculum.code-workspace`**. VS Code opens.
   Always open the curriculum this way — not by opening the plain folder.
7. VS Code shows a small box in the corner offering **recommended extensions**. Click **Install**.

That is the setup finished.

---

## Part 2 — The four buttons you will use

Everything is done from one menu in VS Code: **Terminal → Run Task**. It offers four things.

| | What it does |
|---|---|
| **1. Preview the site** | Opens the curriculum in your browser and keeps it in step with what you type. Start this first and leave it running all day. |
| **2. New module or phase** | Creates a new page (or a whole new section) with its name, number and address filled in correctly. |
| **3. Import a Word document** | Turns one Word file into one module. See Part 6. |
| **4. Check before publishing** | Hunts for mistakes and builds the whole site. Always run this before you publish. |

The first time you run **Preview**, it spends a few minutes setting itself up. That happens
once. After that it starts in a few seconds.

While Preview is running, every time you press **Ctrl+S** to save, the page in your browser
updates by itself. You do not need to reload anything.

To stop the preview, click inside its panel at the bottom of VS Code and press **Ctrl+C**.

---

## Part 3 — Your working day

1. **Start in GitHub Desktop** and click **Fetch origin** to pick up anyone else's changes.
2. **In VS Code**, run *Terminal → Run Task → 1. Preview the site*.
3. **Edit.** The curriculum is in the `docs` folder on the left, arranged exactly the way the
   sidebar of the website is arranged. Click a file, change the words, press Ctrl+S, watch the
   browser.
4. **When you are done**, run *Terminal → Run Task → 4. Check before publishing*. It either
   says `PASSED` or tells you in plain English what is wrong. Do not go further until it passes.
5. **Back in GitHub Desktop**, your changed files are listed on the left. Type a short summary
   of what you did in the box at the bottom left — *"Added a module on wheels and traction"* —
   and click **Commit to main**.
6. Click **Push origin**. That publishes it. The live site rebuilds itself a couple of minutes later.

If you forget step 4, you will be reminded: the check runs again automatically when you push,
and refuses to publish anything broken.

---

## Part 4 — Finding the page you want to edit

The folders on disk mirror the sidebar on the website exactly.

```
docs/
  mechanical-curriculum/         ← "1. Mechanical Curriculum" in the sidebar
    phase-1-mechanical-fundamentals/
      01-gears-and-gear-ratio.md      ← "Module 1.1: Gears & Gear Ratio"
      02-load-payload-and-forces.md
  electronics-curriculum/
  programming-curriculum/
```

So a page at `.../phase-3-power/02-charging-checking-and-battery-care.md` is the one that shows
up as *Module 3.2: Charging, Checking & Battery Care*.

If you cannot find a page, press **Ctrl+P** in VS Code and start typing its title.

---

## Part 5 — Adding a new module or a new phase

**Never copy an existing file to make a new one.** Every page carries a hidden set of settings
at the top — its title, its position in the sidebar, and its web address — and copying them by
hand is where things go wrong.

Instead run *Terminal → Run Task → **2. New module or phase***. It asks you a few questions,
then tells you exactly which file it made and where it will appear. Open that file and write.

New pages are always added at the end of their phase. To move one, see Part 10.

A brand-new phase stays invisible until it has at least one module in it — so create the phase,
then run the task again to add its first module.

---

## Part 6 — Writing in Word

If you would rather write in Word than type into VS Code, you can. **One module at a time.**

1. Write the module in Word and save it as a normal `.docx` (File → Save As → *Word Document*).
2. In VS Code, run *Terminal → Run Task → **3. Import a Word document***.
3. Say whether it is a **new module** or a **rewrite of one that already exists**.
4. Drag the Word file into the panel and press Enter.
5. Answer the same where-does-it-go questions as Part 5.

It converts the writing, saves every picture into the right place, fills in the settings block,
and then lists anything worth a second look. **Read the page through afterwards** — Word
formatting never survives perfectly — and run the check.

### Use Word's Heading styles

This is the one thing that really matters. Use **Home → Styles → Heading 1 / Heading 2**, not
just bold text at a bigger size. A "heading" that is only big and bold arrives as an ordinary
paragraph, and the page ends up as one flat wall of text with no sections and no contents list.

### What comes across, and what does not

| Survives | Does not |
|---|---|
| Heading styles, and the order of everything | Fonts, sizes, colours, highlighting |
| **Bold** and *italic* | Text boxes, WordArt, columns, page breaks |
| Bullet and numbered lists | Headers, footers and page numbers |
| Tables (plain ones) | Merged table cells |
| Pictures and GIFs | Equations |
| Links | Comments and tracked changes |

Accept or reject all tracked changes and delete your comments **before** importing, so that what
you see in Word is what arrives on the site.

### Getting coloured boxes out of Word

Start a paragraph with one of these five words and a colon, and it becomes the matching coloured
box from Part 8:

```
Key Idea: Traction is friction you can steer.
Note: The battery must be charged first.
Tip: Label both ends of every wire.
Warning: Do not exceed the load rating.
Danger: Keep fingers clear of the drivetrain.
```

Only at the *start* of a paragraph — a sentence like "see the note: below" is left alone.

### Rewriting a module that already exists

Choosing *a rewrite* replaces everything written on that page, but **keeps its title, its place
in the sidebar and its web address exactly as they were**. Nothing that links to it breaks. Any
pictures a previous import put there are cleared out first, so nothing is left lying around.

It asks you to type "yes" before it does this, because the old words are replaced.

### The big "complete curriculum" Word file is not for editing

There is a `NRL-Curriculum-Complete.docx` that contains the whole book. That file is a **printout
made from this website** — a copy, generated on demand. Editing it does nothing to the site, and
it cannot be imported back: the site is the master copy, and it is 79 separate pages, not one
document. If you want to change something in it, change the module here and generate a fresh copy.

---

## Part 7 — Pictures and GIFs

**To add one:** click in the page where you want the picture, then either paste it with
**Ctrl+V** or drag the file in from a folder. That is the whole procedure. VS Code files the
picture away next to the page and writes a line like this:

```
![A wheel diagram](images/wheel-diagram.png)
```

Change the words inside the square brackets to describe what the picture shows — they are read
aloud to people using screen readers, and shown if the picture will not load. "Image" is not a
description; "The Command Hub with the battery connector on the left" is.

GIFs work exactly the same way, and so does dragging in several pictures at once.

**To remove one:** delete that whole line from the page, and delete the picture file itself from
the `images` folder next to the page. If you delete only the line, the unused file quietly stays
in the project forever; if you delete only the file, the check will tell you the page points at
a picture that is not there.

**Older pictures** live in a shared `static/img` folder and are written as `/img/electronics/...`
rather than `images/...`. Both styles work — leave the existing ones alone.

---

## Part 8 — Writing: everything you can put in a page

Plain text is plain text. Leave a blank line between paragraphs.

```
## A section heading
### A smaller heading underneath it

**bold**, *italic*, and `a part name or a bit of code`.

- a bullet
- another bullet

1. a numbered step
2. the next step

> a quoted line
```

### Coloured boxes

These are the strongest formatting tool you have — reach for one of these instead of trying to
change a font or a colour.

```
:::keyidea[The one thing to remember]
The single most important idea in the module.
:::

:::note
A useful aside.
:::

:::tip
A shortcut or a good habit.
:::

:::warning
Something that wastes time or breaks a rule.
:::

:::danger
Something that can destroy hardware or hurt someone.
:::
```

The `[text in square brackets]` after `:::keyidea` is an optional custom heading for the box.

### Linking to another module

Link to the other page's **address**, which is the `slug:` line at the top of its file:

```
See [Module 3.3: Servos](/part-3-programming-the-robot/servos) for more.
```

Do not link to the file name, and do not paste the full `https://...` address of the live site.

### Code examples

Fence them, and say what language it is:

````
```cpp
motor.setPower(0.5);
```
````

### The four special blocks

These are ready-made building blocks. Each one needs an `import` line, which goes immediately
after the settings block at the very top of the page, before any text.

**A method/parameter table:**

```
import ApiTable from '@site/src/components/ApiTable';

<ApiTable rows={[
  {member: 'begin()', description: 'Starts the motor. Call this in init().'},
  {member: 'setPower(float p)', description: 'Sets power from -1.0 to 1.0.'},
]} />
```

**A YouTube video:**

```
import YouTubeEmbed from '@site/src/components/YouTubeEmbed';

<YouTubeEmbed id="dQw4w9WgXcQ" title="Building a four-bar linkage" />
```

The `id` is the part of a YouTube address after `v=`. For a whole playlist use
`listId="..."` instead of `id="..."`, taking the part after `list=`.

**A hidden answer to an exercise:**

```
import Answer from '@site/src/components/Answer';

<Answer>
A 3:1 ratio, because the driven gear has three times as many teeth.
</Answer>
```

**A note that the module is taught by video rather than written here:**

```
import ExternalModuleNote from '@site/src/components/ExternalModuleNote';

<ExternalModuleNote via="video" />
```

`via` can be `"video"`, `"course"` or `"course-and-playlist"`.

---

## Part 9 — The settings block at the top of every page

Every page begins with a small block between two lines of dashes:

```
---
title: "Module 3.3: Servos"
sidebar_position: 3
slug: /part-3-programming-the-robot/servos
---
```

- **title** — what shows in the sidebar and at the top of the page. Safe to reword.
- **sidebar_position** — where it sits in its phase. 1 is first. No two pages in the same
  phase may share a number.
- **slug** — the page's web address. **Changing this breaks every link that points at the
  page,** including links from other websites. Leave it alone unless you mean it.

The "New module" task writes all three for you. Do not delete the block or the dashes.

---

## Part 10 — Reordering, renaming and deleting

**To reorder modules within a phase:** change the `sidebar_position` numbers so they read 1, 2,
3… in the order you want, then run the check — it will tell you if two pages ended up sharing a
number. The file names are only for your own convenience; the numbers in the settings block are
what actually decides the order.

**To rename a module:** change the `title` line. That is all. Do not rename the file, and do not
change the `slug`, unless you have decided to accept broken links.

**To reorder or rename phases:** open the `_category_.json` file inside the phase folder and edit
its `label` (the name in the sidebar) or `position` (where the phase sits).

**To delete a module:** delete the file, and delete its `images` folder if it has one. Then run
the check — it will list any other page that was still linking to the page you removed, so you
can fix those links.

---

## Part 11 — When something goes wrong

Run **Check before publishing**. It explains the problem in plain words and names the file. These
are the five it will find:

**"This page shows an image … but that file is not there."**
The picture was deleted, moved or renamed. Delete the image line, or paste the picture in again.

**"Broken links. A page links to an address that does not exist."**
Open the page it names and fix the link. The correct address of any page is the `slug:` line at
the top of that page's file.

**"sidebar_position N is already used by … in the same phase."**
Two pages in one phase are fighting for the same spot. Give one of them a different number.

**"A page could not be read as a page."**
Almost always a stray `<` or `{` in ordinary writing. A `<` immediately followed by a letter
(like `<part name>`) is read as the start of a hidden instruction. Wrap it in backticks —
`` `<part name>` `` — or write `&lt;` instead. Same for `{`.

**"The settings block at the top is missing …"**
The block described in Part 9 was damaged. Copy the shape of it from a neighbouring page.

If the check prints something it does not recognise, it says so and shows the raw message. Send
that to Rushabh rather than guessing.

**The preview looks stuck or wrong.** Stop it (click in the panel, press Ctrl+C) and run
*1. Preview the site* again. That clears almost everything.

---

## Part 12 — Changing how the site looks

Fonts, text size and heading weight can be changed, but they apply to the entire site at once —
there is deliberately no way to change the font of a single word or paragraph, which is what
keeps sixty-odd modules by different writers reading as one book. For emphasis inside a page,
use **bold** or one of the coloured boxes in Part 8.

See [THEME.md](./THEME.md) for the site-wide settings. Check with Rushabh before changing them.

---

## Part 13 — What you cannot break

Two things stand between a mistake and the live site:

- **Check before publishing**, which you run yourself.
- The same check running automatically when you push. If the site would not build, nothing is
  published and you are told why.

So the worst that can happen is that your work does not go out yet. Everything you have ever
committed is kept, and any change can be undone — ask Rushabh.

The one thing worth being careful about is Part 9's `slug`, because a broken address does not
fail the check on the page that was renamed. It fails on every other page pointing at it, which
is confusing. Leave slugs alone.
