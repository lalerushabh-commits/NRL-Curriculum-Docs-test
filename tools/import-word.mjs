/**
 * "Import a Word document" — turns ONE Word file into ONE curriculum module.
 *
 * Deliberately one module at a time. The site is the source of truth; Word is an
 * input for writing prose, not a copy of the book to be edited and pushed back.
 */
import fs from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
import {DOCS, phasesIn, modulesIn, readFrontmatter, slugify, createModule, rel, c} from './lib.mjs';
import {ask, choose, askTitle, closePrompt} from './prompt.mjs';

const IMAGE_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

const warnings = [];
const warn = (m) => warnings.includes(m) || warnings.push(m);

// ---------------------------------------------------------------- conversion

/**
 * Word file -> HTML. Pictures are held in memory rather than written straight out,
 * because their file names come from the module title, which is not chosen yet.
 */
async function readDocx(docxPath) {
  const images = [];

  const result = await mammoth.convertToHtml(
    {path: docxPath},
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const ext = IMAGE_EXT[image.contentType];
        if (!ext) {
          warn(
            `One picture is a ${image.contentType}, which browsers cannot show. In Word, delete it ` +
              `and paste it back in as an ordinary picture, then import again.`,
          );
          return {src: ''};
        }
        const index = images.length;
        images.push({ext, buffer: await image.read(), alt: image.altText ?? ''});
        return {src: `__NRL_IMAGE_${index}__`, alt: image.altText ?? ''};
      }),
    },
  );

  const html = result.value;

  const missingAlt = images.filter((i) => !i.alt).length;
  if (missingAlt) {
    warn(
      `${missingAlt} picture(s) came in with no description. Add words inside the square brackets ` +
        `of each image line — they are read aloud to people using screen readers.`,
    );
  }

  // Things Word can express and a web page cannot.
  if (/<t[dh][^>]*(colspan|rowspan)=/i.test(html)) {
    warn('A table has merged cells, which a web page cannot show. Check that table and split the cells.');
  }
  if (/<t[dh][^>]*>(?:(?!<\/t[dh]>)[\s\S])*?<img/i.test(html)) {
    warn('A picture sits inside a table. It will look cramped — consider moving it above or below the table.');
  }

  // Unrecognised styles are routine and harmless (the text still comes across as
  // ordinary paragraphs), so they get one calm line rather than one alarm each.
  const styles = [...new Set(
    result.messages
      .map((m) => m.message.match(/Unrecognised (?:paragraph|run) style: '([^']+)'/)?.[1])
      .filter(Boolean),
  )];
  if (styles.length) {
    warn(
      `${styles.length} Word style(s) have no equivalent on the site (${styles.slice(0, 4).join(', ')}` +
        `${styles.length > 4 ? ', …' : ''}). Those parts came in as ordinary text — check they still read right.`,
    );
  }
  for (const m of result.messages.filter((m) => m.type === 'error').slice(0, 4)) {
    warn(`Word reported a problem: ${m.message}`);
  }

  const docTitle = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, '').trim();

  return {html, images, docTitle};
}

/**
 * mammoth puts a <p> inside every table cell, which the markdown table rule cannot
 * express — without this the whole table comes out as rubble.
 */
function flattenTableCells(html) {
  return html.replace(/<(t[dh])([^>]*)>([\s\S]*?)<\/\1>/gi, (_, tag, attrs, inner) => {
    const flat = inner
      .replace(/<\/p>\s*<p[^>]*>/gi, '<br />')
      .replace(/<\/?p[^>]*>/gi, '')
      .trim();
    return `<${tag}${attrs}>${flat}</${tag}>`;
  });
}

function toMarkdown(html) {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });
  td.use(gfm);
  return td.turndown(html);
}

// ----------------------------------------------------------- post-processing

/** Run `fn` only over the parts of the text that are not code, so examples stay untouched. */
function outsideCode(text, fn) {
  return text
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('');
}

/**
 * The page title comes from the settings block, so a leading top-level heading is a
 * duplicate. Drop it, then shift what remains so the highest level sits at `##`,
 * matching every hand-written page.
 */
function normaliseHeadings(md) {
  const lines = md.split('\n');

  const first = lines.findIndex((l) => l.trim() !== '');
  let droppedTitle = null;
  if (first >= 0 && /^#\s+\S/.test(lines[first])) {
    droppedTitle = lines[first].replace(/^#\s+/, '').trim();
    lines.splice(first, 1);
  }

  const levels = lines.filter((l) => /^#{1,6}\s/.test(l)).map((l) => l.match(/^#+/)[0].length);
  const shift = levels.length ? Math.max(0, 2 - Math.min(...levels)) : 0;

  const out = lines.map((l) => {
    const m = l.match(/^(#{1,6})(\s.*)$/);
    if (!m) return l;
    return '#'.repeat(Math.min(6, m[1].length + shift)) + m[2];
  });

  return {md: out.join('\n'), droppedTitle};
}

const CALLOUTS = {'key idea': 'keyidea', note: 'note', tip: 'tip', warning: 'warning', danger: 'danger'};

/**
 * A paragraph that *begins* with "Note:", "Key Idea:" etc. becomes the matching
 * coloured box. Only at the start of a paragraph — "see Note: below" is left alone.
 */
function toCallouts(md) {
  return md
    .split(/\n{2,}/)
    .map((para) => {
      const m = para.match(/^(Key Idea|Note|Tip|Warning|Danger)\s*:\s*([\s\S]+)$/i);
      if (!m) return para;
      const kind = CALLOUTS[m[1].toLowerCase()];
      return `:::${kind}\n${m[2].trim()}\n:::`;
    })
    .join('\n\n');
}

/** Escape the two characters that fail a Docusaurus build when they appear in ordinary prose. */
function makeMdxSafe(md) {
  let escaped = 0;
  const out = outsideCode(md, (part) =>
    part
      .replace(/<(?=[A-Za-z/])/g, () => (escaped++, '&lt;'))
      .replace(/[{}]/g, (ch) => (escaped++, ch === '{' ? '&#123;' : '&#125;')),
  );
  if (escaped) {
    warn(
      `${escaped} "<" or "{" character(s) in the writing were escaped so the page builds. They still ` +
        `read normally; if one was meant to be code, wrap it in backticks instead.`,
    );
  }
  return out;
}

/**
 * Word footnotes arrive as a numbered list at the end of the page, with links that
 * point at anchors turndown has already thrown away. Keep the numbering, drop the
 * dead links.
 */
function tidyFootnotes(md) {
  if (!/#footnote-/.test(md)) return md;
  warn(
    'This document had footnotes. They are now a numbered list at the bottom of the page, and the ' +
      'small numbers in the text no longer jump down to them — consider working them into the sentences.',
  );
  return md
    .replace(/\[\\\[(\d+)\\\]\]\(#footnote-\d+\)/g, '[$1]')
    .replace(/\s*\[↑\]\(#footnote-ref-\d+\)/g, '');
}

function tidy(md) {
  return `${md
    .replace(/ /g, ' ')                 // Word's non-breaking spaces
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

/** Turn the read-in document into the finished page body, filing its pictures under `stub`. */
function buildBody({html, images}, imagesDir, stub) {
  const {md} = normaliseHeadings(toMarkdown(flattenTableCells(html)));
  let body = tidy(makeMdxSafe(toCallouts(tidyFootnotes(md))));

  images.forEach((image, i) => {
    const name = `${stub}-${String(i + 1).padStart(2, '0')}${image.ext}`;
    fs.mkdirSync(imagesDir, {recursive: true});
    fs.writeFileSync(path.join(imagesDir, name), image.buffer);
    body = body.replaceAll(`__NRL_IMAGE_${i}__`, `images/${name}`);
  });

  return body;
}

// -------------------------------------------------------------------- prompts

async function askForDocx() {
  for (;;) {
    const raw = await ask('\nDrag the Word file into this panel and press Enter\n(or type its full path): ');
    const p = raw.replace(/^['"]|['"]$/g, '').trim();
    if (!p) continue;
    if (!fs.existsSync(p)) {
      console.log(c.red('  There is no file at that path. Try dragging it in again.'));
      continue;
    }
    if (!p.toLowerCase().endsWith('.docx')) {
      console.log(c.red('  That is not a .docx file. In Word, use File → Save As and choose "Word Document".'));
      continue;
    }
    return p;
  }
}

async function pickPhase(question) {
  const curriculum = await choose('Which curriculum?', phasesIn(DOCS), (p) => p.label);
  const curriculumDir = path.join(DOCS, curriculum.name);
  const phases = phasesIn(curriculumDir);
  if (!phases.length) {
    console.log(c.red('\nThat curriculum has no phases yet. Create a phase first.'));
    return null;
  }
  return {curriculumDir, phase: await choose(question, phases, (p) => p.label)};
}

// --------------------------------------------------------------------- modes

async function importAsNew(docxPath) {
  const doc = await readDocx(docxPath);

  const picked = await pickPhase('Which phase should the new module go into?');
  if (!picked) return;
  const {curriculumDir, phase} = picked;

  // The document's own top heading is the best guess; the file name is the fallback.
  const suggested =
    doc.docTitle ||
    path
      .basename(docxPath, '.docx')
      .replace(/[_-]+/g, ' ')
      .replace(/\b[a-z]/g, (ch) => ch.toUpperCase())
      .trim();
  const title = await askTitle(`Title for this module — press Enter to use "${suggested}"`, suggested);

  const stub = slugify(title);
  const imagesDir = path.join(curriculumDir, phase.name, 'images');
  const body = buildBody(doc, imagesDir, stub);
  const imageCount = doc.images.length;

  let made;
  try {
    made = createModule({curriculumDir, phase, title, body});
  } catch (e) {
    console.log(c.red(`\n${e.message}`));
    return;
  }

  report({
    heading: 'Imported your Word document as a new module.',
    lines: [
      ['File', rel(made.file)],
      ['Appears', `${made.fullTitle}, last in ${phase.label}`],
      ['Address', made.slug],
      ['Pictures', String(imageCount)],
    ],
  });
}

async function importOverExisting(docxPath) {
  const picked = await pickPhase('Which phase is the module in?');
  if (!picked) return;
  const {curriculumDir, phase} = picked;
  const phaseDir = path.join(curriculumDir, phase.name);

  const files = modulesIn(phaseDir);
  if (!files.length) {
    console.log(c.red('\nThat phase has no modules yet. Choose "a new module" instead.'));
    return;
  }
  const chosen = await choose(
    'Which module should be replaced?',
    files,
    (f) => readFrontmatter(path.join(phaseDir, f))?.title ?? f,
  );

  const file = path.join(phaseDir, chosen);
  const existing = fs.readFileSync(file, 'utf8');
  const block = existing.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!block) {
    console.log(c.red(`\n${chosen} has no settings block at the top, so it cannot be replaced safely.`));
    return;
  }

  console.log('');
  console.log(c.yellow(`This replaces everything written in ${chosen}.`));
  console.log(c.dim('Its title, its position and its web address are kept exactly as they are.'));
  const confirm = await ask('\nType "yes" to go ahead: ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log(c.dim('\nNothing was changed.'));
    return;
  }

  const stub = chosen.replace(/^\d+-/, '').replace(/\.md$/, '');
  const imagesDir = path.join(phaseDir, 'images');

  // Clear only what a previous import of THIS module put there, so hand-pasted
  // pictures belonging to other pages in the phase are never touched.
  let removed = 0;
  if (fs.existsSync(imagesDir)) {
    for (const f of fs.readdirSync(imagesDir)) {
      if (new RegExp(`^${stub}-\\d+\\.[a-z]+$`).test(f)) {
        fs.rmSync(path.join(imagesDir, f));
        removed++;
      }
    }
  }

  const doc = await readDocx(docxPath);
  const body = buildBody(doc, imagesDir, stub);
  const imageCount = doc.images.length;
  fs.writeFileSync(file, `${block[0]}\n${body}`, 'utf8');

  const fm = readFrontmatter(file);
  report({
    heading: 'Replaced the words in that module.',
    lines: [
      ['File', rel(file)],
      ['Still appears as', fm.title],
      ['Address unchanged', fm.slug],
      ['Pictures', `${imageCount} in, ${removed} old one(s) cleared out`],
    ],
  });
}

function report({heading, lines}) {
  console.log('');
  console.log(c.green(c.bold(heading)));
  const pad = Math.max(...lines.map(([k]) => k.length));
  for (const [k, v] of lines) console.log(`  ${k.padEnd(pad)}  ${c.bold(v)}`);

  if (warnings.length) {
    console.log('');
    console.log(c.yellow(c.bold('Worth checking:')));
    for (const w of warnings) console.log(`  - ${w}`);
  }

  console.log('');
  console.log(c.dim('Open the file and read it through — Word formatting never survives perfectly.'));
  console.log(c.dim('Then run "4. Check before publishing".'));
}

// ---------------------------------------------------------------------- main

try {
  console.log(c.dim('\nThis brings ONE Word document in as ONE module.'));
  console.log(c.dim('The website stays the master copy — the big "complete curriculum" Word file is a printout of it, not something to edit.'));

  const mode = await choose('What should this Word document become?', [
    {k: 'new', label: 'A new module'},
    {k: 'replace', label: 'A rewrite of a module that already exists'},
  ], (i) => i.label);

  const docxPath = await askForDocx();

  if (mode.k === 'new') await importAsNew(docxPath);
  else await importOverExisting(docxPath);
} catch (e) {
  console.log(c.red(`\nThe import failed: ${e.message}`));
  process.exitCode = 1;
} finally {
  closePrompt();
}
