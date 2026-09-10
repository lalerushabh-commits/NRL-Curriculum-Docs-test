/**
 * "Check before publishing" — run this before you push.
 *
 * Two passes:
 *   1. A content lint for the mistakes Docusaurus will NOT catch
 *      (duplicate positions, missing frontmatter, missing image files).
 *   2. The real site build, with its errors translated into plain English.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, DOCS, allDocs, readFrontmatter, rel, c, ensureDeps, npmCmd} from './lib.mjs';

const problems = [];
const note = (file, message, fix) => problems.push({file, message, fix});

// ---------------------------------------------------------------- pass 1: lint
const docs = allDocs();
const byFolder = new Map();
const bySlug = new Map();

for (const file of docs) {
  const fm = readFrontmatter(file);
  const name = path.basename(file);

  if (!fm) {
    note(rel(file), 'This page has no settings block at the top.',
      'Every page must start with a --- block containing title, sidebar_position and slug. Copy the top of any neighbouring page, or make new pages with the "New module" task.');
    continue;
  }
  for (const key of ['title', 'sidebar_position', 'slug']) {
    if (!fm[key]) {
      note(rel(file), `The settings block at the top is missing "${key}".`,
        'Add it to the --- block at the top of the file, copying the style of a neighbouring page.');
    }
  }

  if (fm.sidebar_position) {
    const folder = path.dirname(file);
    if (!byFolder.has(folder)) byFolder.set(folder, new Map());
    const seen = byFolder.get(folder);
    const pos = fm.sidebar_position;
    if (seen.has(pos)) {
      note(rel(file), `sidebar_position ${pos} is already used by ${seen.get(pos)} in the same phase.`,
        'Two pages in one phase cannot share a position, or the sidebar order becomes random. Give this page the next free number.');
    } else {
      seen.set(pos, name);
    }
  }

  if (fm.slug) {
    if (bySlug.has(fm.slug)) {
      note(rel(file), `This page's slug "${fm.slug}" is already used by ${bySlug.get(fm.slug)}.`,
        'Two pages cannot share a slug — it is the page address. Change one of them.');
    } else {
      bySlug.set(fm.slug, rel(file));
    }
  }

  // Local images referenced by this page must actually exist on disk.
  // Code blocks and `backticked` spans are skipped — those are examples, not real images.
  const body = fs
    .readFileSync(file, 'utf8')
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/`[^`\n]*`/g, '');
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
    const src = m[1];
    if (/^(https?:)?\/\//.test(src)) continue;              // remote image, not ours to check
    const target = src.startsWith('/')
      ? path.join(ROOT, 'static', src)                       // /img/... lives under static/
      : path.resolve(path.dirname(file), src);               // co-located next to the page
    if (!fs.existsSync(target)) {
      note(rel(file), `This page shows an image "${src}", but that file is not there.`,
        'Either the image was never added, or it was moved or renamed. Delete the image line, or paste the picture into the page again.');
    }
  }
}

// A folder full of pages but no _category_.json gets a nameless sidebar section.
const folders = new Set(docs.map((f) => path.dirname(f)));
for (const folder of folders) {
  if (folder === DOCS) continue;
  if (!fs.existsSync(path.join(folder, '_category_.json'))) {
    note(rel(folder), 'This phase folder has no _category_.json, so it will show up in the sidebar with an ugly folder name.',
      'Use the "New phase" task to create phases — it writes this file for you.');
  }
}

// The pages are produced from the Word document, and source/manifest.json is
// what decides each one's web address. If the two ever disagree, an address
// has moved without anyone deciding to move it — which quietly breaks every
// link anyone has saved to that page.
const manifestFile = path.join(ROOT, 'source', 'manifest.json');
if (fs.existsSync(manifestFile)) {
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const onSite = new Map();
  for (const file of docs) {
    const fm = readFrontmatter(file);
    if (fm?.slug) onSite.set(fm.slug, file);
  }

  for (const m of manifest.modules) {
    if (!onSite.has(m.slug)) {
      note(
        'source/manifest.json',
        `The index lists a page at "${m.slug}" ("${m.title}"), but no page on the website has that address.`,
        'Publish from the Word document again. If the page really was removed, the publisher records that for you.',
      );
    }
  }

  const retiredSlugs = new Set((manifest.retired ?? []).map((r) => r.slug));
  for (const file of docs) {
    const body = fs.readFileSync(file, 'utf8').replace(/^```[\s\S]*?^```/gm, '');
    for (const m of body.matchAll(/\]\((\/[^)\s]+)\)/g)) {
      if (retiredSlugs.has(m[1])) {
        note(rel(file), `This page links to "${m[1]}", which was removed from the book.`,
          'Point the link somewhere else in Word, or put the removed page back.');
      }
    }
  }
}

console.log(c.bold(`Checked ${docs.length} pages.`));

if (problems.length) {
  console.log('');
  console.log(c.red(c.bold(`FAILED — ${problems.length} problem${problems.length > 1 ? 's' : ''} found before the build even started:`)));
  for (const p of problems) {
    console.log('');
    console.log(`  ${c.yellow(p.file)}`);
    console.log(`    ${p.message}`);
    console.log(`    ${c.dim('Fix: ' + p.fix)}`);
  }
  console.log('');
  console.log(c.red('Do not publish yet. Fix the above, then run this check again.'));
  process.exit(1);
}

console.log(c.green('No content problems. Now building the site (this takes a minute)...'));
console.log('');

// --------------------------------------------------------------- pass 2: build
if (!ensureDeps()) process.exit(1);
const npm = npmCmd();
const build = spawnSync(npm, ['run', 'build'], {cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32'});
const output = `${build.stdout ?? ''}\n${build.stderr ?? ''}`;

if (build.status === 0) {
  console.log(c.green(c.bold('PASSED — the site builds cleanly. Safe to commit and push.')));
  process.exit(0);
}

console.log(c.red(c.bold('FAILED — the site did not build. In plain English:')));
console.log('');

let explained = false;

// Broken internal links.
const linkBlocks = [...output.matchAll(/Broken link on source page path = ([^\s:]+):\s*((?:\s*->\s*linking to [^\n]+\n?)+)/g)];
if (linkBlocks.length) {
  explained = true;
  console.log(c.yellow('Broken links.') + ' A page links to an address that does not exist:');
  for (const [, page, targets] of linkBlocks) {
    for (const t of targets.matchAll(/->\s*linking to ([^\n]+)/g)) {
      console.log(`  - the page ${c.bold(page)} links to ${c.bold(t[1].trim())}, which is not a real page`);
    }
  }
  console.log(c.dim('  Fix: open that page, find the link, and correct the address. The address of any page is the "slug" line at the top of its file.'));
  console.log('');
}

// MDX / formatting errors.
const mdx = [...output.matchAll(/MDX compilation failed for file ["']?([^"'\n]+)/g)];
if (mdx.length) {
  explained = true;
  const cause = output.match(/Cause:\s*([^\n]+)/);
  const where = output.match(/\((\d+):(\d+)-/);
  console.log(c.yellow('A page could not be read as a page.') + ' Almost always a stray < or { character in ordinary text:');
  for (const m of mdx) console.log(`  - ${c.bold(rel(m[1].trim()))}`);
  if (where) console.log(`    around line ${c.bold(where[1])}`);
  if (cause) console.log(c.dim(`    (technical reason: ${cause[1].trim()})`));
  console.log(c.dim('  Fix: a bare < or { in text is read as the start of a component. Wrap it in backticks — `<` — or write &lt; instead.'));
  console.log('');
}

// Duplicate routes.
if (/Duplicate routes found/.test(output)) {
  explained = true;
  console.log(c.yellow('Two pages claim the same address.'));
  console.log(c.dim('  Fix: two files have the same "slug" line at the top. Change one of them.'));
  console.log('');
}

if (!explained) {
  console.log(c.dim('This one is not a mistake I recognise. The raw message is below — send it to Rushabh.'));
  console.log('');
  console.log(output.trim().split('\n').slice(-40).join('\n'));
  console.log('');
}

console.log(c.red('Do not publish yet. Fix the above, then run this check again.'));
process.exit(1);
