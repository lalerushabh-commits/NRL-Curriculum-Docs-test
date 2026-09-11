/**
 * Take the Word document all the way to the live website.
 *
 * The run is a transaction, and the order matters: everything that can go
 * wrong is made to go wrong *before* anything is written, so a failed run
 * leaves the repository and the website exactly as they were. The only step
 * that cannot be taken back is the push, and it happens last, after a real
 * build of the exact files being pushed.
 *
 *   node tools/word/publish.mjs --docx <path> [--check-only] [--yes]
 *
 * Written to be driven either by a person in a terminal or by the publisher
 * window, which reads the NDJSON on stdout when --json is passed.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, c, npmCmd} from '../lib.mjs';
import {loadManifest, saveManifest, MANIFEST_PATH} from './manifest.mjs';
import {convert} from './convert.mjs';
import {normalise, isText} from './compare.mjs';

const args = process.argv.slice(2);
const argOf = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const CHECK_ONLY = args.includes('--check-only');
const ASSUME_YES = args.includes('--yes');
const JSON_OUT = args.includes('--json');

const docxPath = path.resolve(argOf('--docx', path.join(ROOT, 'source', 'NRL-Curriculum-Complete.docx')));
const assetsDir = argOf('--assets', path.join(path.dirname(docxPath), 'assets'));

/** Progress the window can render, and a person can read. */
function say(step, message, extra = {}) {
  if (JSON_OUT) {
    console.log(JSON.stringify({step, message, ...extra}));
  } else {
    const colour = step === 'error' ? c.red : step === 'done' ? c.green : step === 'warn' ? c.yellow : c.blue;
    console.log(`${colour(step.padEnd(9))} ${message}`);
  }
}

function stop(message, detail = []) {
  say('error', message, {detail});
  if (!JSON_OUT && detail.length) {
    console.log('');
    for (const d of detail) console.log(`  ${d}`);
  }
  if (!JSON_OUT) {
    console.log('');
    console.log(c.yellow('Nothing was published. The website is unchanged.'));
  }
  process.exit(1);
}

const git = (...a) => spawnSync('git', a, {cwd: ROOT, encoding: 'utf8'});

// ---------------------------------------------------------------- phase 0

say('checking', 'Looking at the Word document...');

if (!fs.existsSync(docxPath)) {
  stop(`I cannot find the Word document.`, [docxPath]);
}

if (findLockFile(docxPath)) {
  stop('The curriculum is still open in Word.', [
    'Save it (Ctrl+S), close Word, then try again.',
  ]);
}

/**
 * Is the document open in Word right now?
 *
 * Word drops an "owner file" beside an open document, but it does not simply
 * prefix the name: for anything but a very short name it also chops the first
 * two characters, so NRL-Curriculum-Complete.docx is guarded by
 * ~$L-Curriculum-Complete.docx. Matching on the prefixed name alone silently
 * never fires — so every ~$ file in the folder is checked against the ending
 * of the document's name instead.
 *
 * This matters because reading a document that is still open gets whatever was
 * last saved to disk, which is rarely what the author has just typed.
 */
function findLockFile(file) {
  const dir = path.dirname(file);
  const name = path.basename(file);
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return null;
  }
  return (
    entries.find((e) => {
      if (!e.startsWith('~$')) return false;
      const stem = e.slice(2);
      return name === stem || name.endsWith(stem);
    }) ?? null
  );
}

let manifest;
try {
  manifest = loadManifest();
} catch (e) {
  stop(e.message);
}

// ---------------------------------------------------------------- phase 1

say('reading', 'Reading the document...');

let result;
try {
  result = convert({docxPath, manifest, assetsDir});
} catch (e) {
  stop('I could not read the Word document.', [e.message]);
}

if (result.problems.length) {
  const n = result.problems.length;
  stop(n === 1 ? 'One thing needs fixing in Word first.' : `${n} things need fixing in Word first.`,
    result.problems.map((p) => `${p.where}: ${p.message}`));
}

say('reading', `Found ${result.pageCount} pages.`, {pages: result.pageCount});

// A document that suddenly has far fewer pages usually means a bad save or the
// wrong file, not a deliberate deletion of half the book.
const before = manifest.modules.length;
if (result.pageCount < before * 0.8) {
  stop(`The document only has ${result.pageCount} pages, but the website has ${before}.`, [
    'That is a big drop, so I have stopped rather than delete pages.',
    'If you really did remove them, say so and run it again with --yes.',
  ].slice(0, ASSUME_YES ? 0 : 3));
}

// Removing a page deletes a web address that people may have bookmarked, so it
// is never something that just happens quietly.
if (result.removed.length && !ASSUME_YES) {
  stop(`${result.removed.length} page${result.removed.length === 1 ? ' is' : 's are'} in the website but no longer in the document.`,
    [
      ...result.removed.map((m) => `${m.title} — ${m.slug}`),
      '',
      'Publishing would delete them and their web addresses would stop working.',
      'If that is what you want, run it again with --yes.',
    ]);
}

// ---------------------------------------------------------------- phase 2

const changed = [];
const created = [];
for (const [rel, contents] of result.files) {
  const disk = path.join(ROOT, rel);
  if (!fs.existsSync(disk)) {
    created.push(rel);
    continue;
  }
  const differs = isText(rel)
    ? normalise(fs.readFileSync(disk, 'utf8')) !== normalise(String(contents))
    : Buffer.compare(fs.readFileSync(disk), Buffer.from(contents)) !== 0;
  if (differs) changed.push(rel);
}

// Named pages, not file paths: "Module 3.1: Motors", with the address to open.
const asPages = (files) => files.map((f) => result.pageIndex.get(f)).filter(Boolean);

say('comparing', summarise({changed, created, result}), {
  changed: changed.length,
  created: created.length,
  changedPages: asPages(changed),
  createdPages: asPages(created),
  added: result.added,
  renamed: result.renamed,
  removed: result.removed.map((m) => m.slug),
  newImages: result.newImages,
});

for (const r of result.renamed) {
  say('warn', `Renamed: "${r.from}" is now "${r.to}". Its web address stays ${r.slug}.`);
}
for (const a of result.added) say('warn', `New page: ${a.title} — it will be at ${a.slug}`);
for (const r of result.relabelled) say('warn', `Section renamed: "${r.from}" is now "${r.to}".`);
for (const i of result.newImages) say('warn', `New picture on ${i.page}: ${i.src}`);
for (const n of result.notes) say('warn', n);

if (!changed.length && !created.length && !result.removed.length) {
  say('done', 'The website already matches the document. Nothing to publish.', {published: false, url: siteUrl()});
  process.exit(0);
}

// ---------------------------------------------------------------- phase 3

say('writing', 'Updating the pages...');

// docs/ is generated in full, so anything no longer produced is gone.
for (const rel of walk(path.join(ROOT, 'docs'))) {
  if (!result.files.has(rel)) fs.rmSync(path.join(ROOT, rel));
}
for (const [rel, contents] of result.files) {
  const disk = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(disk), {recursive: true});
  if (typeof contents === 'string') fs.writeFileSync(disk, contents, 'utf8');
  else fs.writeFileSync(disk, contents);
}
pruneEmptyDirs(path.join(ROOT, 'docs'));

// Keep the master copy and its index beside the site it produced.
fs.mkdirSync(path.join(ROOT, 'source'), {recursive: true});
fs.copyFileSync(docxPath, path.join(ROOT, 'source', 'NRL-Curriculum-Complete.docx'));
applyManifestChanges(manifest, result);
saveManifest(manifest);

// ---------------------------------------------------------------- phase 4

say('checking', 'Building the website to make sure it works...');

const check = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'check.mjs')], {
  cwd: ROOT,
  encoding: 'utf8',
});
if (check.status !== 0) {
  const out = `${check.stdout ?? ''}${check.stderr ?? ''}`;
  if (!JSON_OUT) console.log(out);
  revert();
  stop('The website did not build, so nothing was published.', JSON_OUT ? out.split('\n').slice(-40) : []);
}

say('checking', 'The website builds cleanly.');

if (CHECK_ONLY) {
  say('done', 'Checked only — the pages were updated on this computer but nothing was published.', {published: false});
  process.exit(0);
}

// ---------------------------------------------------------------- phase 5

say('publishing', 'Publishing...');

const message =
  `Publish from Word: ${changed.length} page${changed.length === 1 ? '' : 's'} updated` +
  (result.added.length ? `, ${result.added.length} added` : '') +
  (result.removed.length ? `, ${result.removed.length} removed` : '');

git('add', '-A');
const commit = git('commit', '-m', message);
if (commit.status !== 0 && !/nothing to commit/i.test(commit.stdout ?? '')) {
  stop('I could not save the changes.', [(commit.stderr || commit.stdout || '').trim()]);
}

let push = git('push', 'origin', 'HEAD');
if (push.status !== 0) {
  // Someone else pushed in the meantime: take their work, redo ours on top.
  say('publishing', 'Someone else published first — catching up and trying once more...');
  const pull = git('pull', '--rebase', 'origin', 'HEAD');
  if (pull.status !== 0) {
    stop('Someone else published at the same time and I could not merge the two.', [
      'Nothing of yours was lost. Try again in a minute.',
    ]);
  }
  push = git('push', 'origin', 'HEAD');
}
if (push.status !== 0) {
  stop('I could not publish to GitHub.', [
    (push.stderr || push.stdout || '').trim(),
    'If it mentions permission or authentication, sign in to GitHub Desktop once and try again.',
  ]);
}

say('done', 'Published. The website will update in about two minutes.', {
  published: true,
  url: siteUrl(),
  changedPages: [...asPages(changed), ...asPages(created)],
});

/**
 * The address the site is served from, worked out from where this copy of the
 * repository was cloned. Hard-coding the real site's address would send
 * someone using a test repository to the wrong place.
 */
function siteUrl() {
  const remote = (git('remote', 'get-url', 'origin').stdout ?? '').trim();
  const m = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/);
  return m ? `https://${m[1]}.github.io/${m[2]}/` : 'https://lalerushabh-commits.github.io/NRL-Curriculum-Docs/';
}

// ------------------------------------------------------------------ helpers

function summarise({changed, created, result}) {
  const bits = [];
  if (changed.length) bits.push(`${changed.length} page${changed.length === 1 ? '' : 's'} changed`);
  if (result.added.length) bits.push(`${result.added.length} new`);
  if (result.removed.length) bits.push(`${result.removed.length} removed`);
  if (result.newImages.length) bits.push(`${result.newImages.length} new picture${result.newImages.length === 1 ? '' : 's'}`);
  return bits.length ? bits.join(', ') : 'no changes';
}

/** Bring the index up to date with what was just published. */
function applyManifestChanges(manifest, result) {
  for (const r of result.relabelled) {
    for (const cur of manifest.curricula) {
      if (cur.folder === r.folder) cur.category.label = r.to;
      for (const ph of cur.phases) if (`${cur.folder}/${ph.folder}` === r.folder) ph.category.label = r.to;
    }
  }
  for (const r of result.renamed) {
    const m = manifest.modules.find((x) => x.slug === r.slug);
    if (m) m.title = r.to;
  }
  for (const removed of result.removed) {
    manifest.modules = manifest.modules.filter((m) => m.id !== removed.id);
    manifest.retired.push({slug: removed.slug, title: removed.title, removed: today()});
  }
  for (const a of result.added) {
    if (!manifest.modules.some((m) => m.slug === a.slug)) {
      manifest.modules.push({id: a.slug.replace(/^\//, '').replace(/\//g, '-'), slug: a.slug, title: a.title});
    }
  }
}

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Put the working copy back exactly as it was.
 *
 * One path at a time on purpose: git refuses the whole command if any single
 * path is not yet tracked, so restoring "docs static source" together does
 * nothing at all the first time round — the run looks reverted and is not.
 */
function revert() {
  for (const p of ['docs', 'static', 'source']) {
    git('checkout', '--', p);
    git('clean', '-fdq', p);
  }
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  return acc;
}

function pruneEmptyDirs(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    pruneEmptyDirs(p);
    if (fs.readdirSync(p).length === 0) fs.rmdirSync(p);
  }
}
