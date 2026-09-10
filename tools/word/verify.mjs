/**
 * Prove the converter reproduces the website.
 *
 * Converts the Word document and compares the result against the pages the
 * site already has, file by file. This is the check the whole approach rests
 * on: if converting an unedited document does not give back the site as it
 * stands, the converter is losing something, and every later run would lose it
 * silently.
 *
 *   node tools/word/verify.mjs --docx <path> [--assets <dir>] [--full]
 *
 * Some differences are expected and not faults: the Word document has been
 * edited since the site was last built, so its wording legitimately wins. Those
 * are listed separately from the ones that mean a bug.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, c} from '../lib.mjs';
import {loadManifest} from './manifest.mjs';
import {normalise as norm, isText} from './compare.mjs';
import {convert} from './convert.mjs';

const args = process.argv.slice(2);
const argOf = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const FULL = args.includes('--full');

const docxPath = argOf('--docx', path.join(ROOT, 'source', 'NRL-Curriculum-Complete.docx'));
const assetsDir = argOf('--assets', path.join(path.dirname(docxPath), 'assets'));

if (!fs.existsSync(docxPath)) {
  console.log(c.red(`Cannot find the Word document: ${docxPath}`));
  process.exit(1);
}

const manifest = loadManifest();
const result = convert({docxPath, manifest, assetsDir});


const same = [];
const differs = [];
const onlyGenerated = [];
const onlyOnSite = [];

for (const [rel, contents] of result.files) {
  const disk = path.join(ROOT, rel);
  if (!fs.existsSync(disk)) {
    onlyGenerated.push(rel);
    continue;
  }
  if (!isText(rel)) {
    const a = fs.readFileSync(disk);
    (Buffer.compare(a, Buffer.from(contents)) === 0 ? same : differs).push(rel);
    continue;
  }
  const a = norm(fs.readFileSync(disk, 'utf8'));
  const b = norm(String(contents));
  (a === b ? same : differs).push(rel);
}

// Pages the site has that the document no longer produces.
const walk = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  return acc;
};
for (const rel of walk(path.join(ROOT, 'docs'))) {
  if (!result.files.has(rel)) onlyOnSite.push(rel);
}

// ------------------------------------------------------------------- report

const pad = (n) => String(n).padStart(4);
console.log('');
console.log(c.bold('Comparing the converted document against the website'));
console.log('');
console.log(`  ${pad(same.length)} files identical`);
console.log(`  ${pad(differs.length)} files different`);
console.log(`  ${pad(onlyGenerated.length)} files the document produces that the site does not have`);
console.log(`  ${pad(onlyOnSite.length)} files the site has that the document does not produce`);
console.log('');

if (result.problems.length) {
  console.log(c.red(`  ${result.problems.length} problems that would stop a publish:`));
  for (const p of result.problems.slice(0, 25)) console.log(`    ${c.yellow(p.where)} ${p.message}`);
  if (result.problems.length > 25) console.log(c.dim(`    ...and ${result.problems.length - 25} more`));
  console.log('');
}

for (const [label, list] of [
  ['Only produced by the document', onlyGenerated],
  ['Only on the site', onlyOnSite],
]) {
  if (!list.length) continue;
  console.log(c.yellow(`  ${label}:`));
  for (const f of list.slice(0, 20)) console.log(`    ${f}`);
  if (list.length > 20) console.log(c.dim(`    ...and ${list.length - 20} more`));
  console.log('');
}

if (differs.length) {
  console.log(c.yellow('  Different:'));
  for (const rel of differs) console.log(`    ${rel}`);
  console.log('');

  const show = FULL ? differs : differs.slice(0, 3);
  for (const rel of show) {
    if (!isText(rel)) continue;
    console.log(c.bold(`  --- ${rel}`));
    printDiff(norm(fs.readFileSync(path.join(ROOT, rel), 'utf8')), norm(String(result.files.get(rel))));
    console.log('');
  }
  if (!FULL && differs.length > show.length) {
    console.log(c.dim(`  (${differs.length - show.length} more files differ — run with --full to see them all)`));
    console.log('');
  }
}

const clean = differs.length === 0 && onlyGenerated.length === 0 && onlyOnSite.length === 0 && result.problems.length === 0;
console.log(clean ? c.green('  MATCHES — the converter reproduces the website exactly.') : c.yellow('  Not yet identical.'));
console.log('');

/** A minimal line diff: enough to see what changed without pulling in a library. */
function printDiff(before, after) {
  const a = before.split('\n');
  const b = after.split('\n');
  let shown = 0;
  const limit = FULL ? 200 : 40;
  // Longest common subsequence would be nicer; for these files a simple
  // walk that resynchronises on the next matching line reads just as well.
  let i = 0;
  let j = 0;
  while ((i < a.length || j < b.length) && shown < limit) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    const resyncB = b.indexOf(a[i], j);
    const resyncA = a.indexOf(b[j], i);
    if (resyncB !== -1 && (resyncA === -1 || resyncB - j <= resyncA - i)) {
      while (j < resyncB && shown < limit) {
        console.log(c.green(`    + ${b[j++]}`));
        shown++;
      }
    } else if (resyncA !== -1) {
      while (i < resyncA && shown < limit) {
        console.log(c.red(`    - ${a[i++]}`));
        shown++;
      }
    } else {
      if (i < a.length) {
        console.log(c.red(`    - ${a[i++]}`));
        shown++;
      }
      if (j < b.length) {
        console.log(c.green(`    + ${b[j++]}`));
        shown++;
      }
    }
  }
  if (shown >= limit) console.log(c.dim('    ...'));
}

process.exit(clean ? 0 : 1);
