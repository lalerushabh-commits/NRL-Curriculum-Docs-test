/**
 * "New module" / "New phase" — creates correctly named and numbered pages
 * so nobody has to hand-write a settings block, a file number, or a slug.
 *
 * Just run it and answer the questions.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {stdin as input, stdout as output} from 'node:process';
import {ROOT, DOCS, slugify, readFrontmatter, modulesIn, phasesIn, rel, c} from './lib.mjs';

const rl = readline.createInterface({input, output});

// Lines are queued as they arrive rather than requested one at a time: when input
// is piped instead of typed, several lines can land before the next question is asked.
const queued = [];
const waiting = [];
rl.on('line', (line) => (waiting.length ? waiting.shift()(line) : queued.push(line)));
rl.on('close', () => waiting.forEach((resolve) => resolve(null)));

async function ask(q) {
  output.write(c.blue(q));
  const line = queued.length ? queued.shift() : await new Promise((resolve) => waiting.push(resolve));
  if (line === null) {
    console.log(c.red('\nCancelled.'));
    process.exit(1);
  }
  if (queued.length || !input.isTTY) output.write(`${line}\n`);
  return line.trim();
}

/** Show a numbered menu and return the chosen item. */
async function choose(label, items, render) {
  console.log('');
  if (label) console.log(c.bold(label));
  items.forEach((it, i) => console.log(`  ${String(i + 1).padStart(2)}. ${render(it)}`));
  for (;;) {
    const a = await ask('\nType a number and press Enter: ');
    const n = Number(a);
    if (Number.isInteger(n) && n >= 1 && n <= items.length) return items[n - 1];
    console.log(c.red('  That is not one of the numbers above.'));
  }
}

async function askTitle(what) {
  for (;;) {
    const t = await ask(`\n${what}: `);
    if (t.length >= 3) return t;
    console.log(c.red('  Please type a real title.'));
  }
}

/** The "4" in "Phase 4", used to number its modules 4.1, 4.2 ... */
function phaseNumber(curriculumDir, phase) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(curriculumDir, phase.name, '_category_.json'), 'utf8'));
    return meta.position ?? 1;
  } catch {
    return 1;
  }
}

async function newModule() {
  const curriculum = await choose('Which curriculum?', phasesIn(DOCS), (p) => p.label);
  const curriculumDir = path.join(DOCS, curriculum.name);

  const phases = phasesIn(curriculumDir);
  if (!phases.length) {
    console.log(c.red('\nThat curriculum has no phases yet. Create a phase first.'));
    return;
  }
  const phase = await choose('Which phase does the new module belong to?', phases, (p) => p.label);
  const phaseDir = path.join(curriculumDir, phase.name);

  const existing = modulesIn(phaseDir);
  console.log('');
  console.log(c.dim(`This phase currently has ${existing.length} module(s):`));
  for (const f of existing) {
    const fm = readFrontmatter(path.join(phaseDir, f));
    console.log(c.dim(`    ${fm?.title ?? f}`));
  }

  const title = await askTitle('Title of the new module (in plain words, e.g. "Wheels and Traction")');

  const nextNum = existing.length + 1;
  const prefix = String(nextNum).padStart(2, '0');
  const stub = slugify(title);
  const filename = `${prefix}-${stub}.md`;
  const file = path.join(phaseDir, filename);

  if (fs.existsSync(file)) {
    console.log(c.red(`\nThere is already a file called ${filename}. Pick a different title.`));
    return;
  }

  const fullTitle = `Module ${phaseNumber(curriculumDir, phase)}.${nextNum}: ${title}`;
  const slug = `/${phase.name}/${stub}`;

  const template = fs
    .readFileSync(path.join(ROOT, 'tools', 'templates', 'module.md'), 'utf8')
    .replaceAll('__TITLE__', fullTitle)
    .replaceAll('__POSITION__', String(nextNum))
    .replaceAll('__SLUG__', slug)
    .replaceAll('__HEADING__', title);

  fs.writeFileSync(file, template, 'utf8');

  console.log('');
  console.log(c.green(c.bold('Created your new module.')));
  console.log(`  File:    ${c.bold(rel(file))}`);
  console.log(`  Appears: ${c.bold(fullTitle)}, last in ${phase.label}`);
  console.log(`  Address: ${c.bold(slug)}`);
  console.log('');
  console.log(c.dim('Open that file from the list on the left and start writing. If the preview is running, it updates as you save.'));
}

async function newPhase() {
  const curriculum = await choose('Which curriculum does the new phase belong to?', phasesIn(DOCS), (p) => p.label);
  const curriculumDir = path.join(DOCS, curriculum.name);

  const existing = phasesIn(curriculumDir);
  console.log('');
  console.log(c.dim(`This curriculum currently has ${existing.length} phase(s):`));
  for (const p of existing) console.log(c.dim(`    ${p.label}`));

  const title = await askTitle('Title of the new phase, without the "Phase N:" part (e.g. "Drivetrain Design")');
  const description = await ask('\nOne sentence describing what this phase covers: ');

  const position = existing.length + 1;
  const folder = `phase-${position}-${slugify(title)}`;
  const dir = path.join(curriculumDir, folder);

  if (fs.existsSync(dir)) {
    console.log(c.red(`\nThere is already a folder called ${folder}. Pick a different title.`));
    return;
  }

  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(
    path.join(dir, '_category_.json'),
    `${JSON.stringify({
      label: `Phase ${position}: ${title}`,
      position,
      collapsible: true,
      collapsed: true,
      link: {type: 'generated-index', description: description || `${title}.`},
    }, null, 2)}\n`,
    'utf8',
  );

  console.log('');
  console.log(c.green(c.bold('Created your new phase.')));
  console.log(`  Folder:  ${c.bold(rel(dir))}`);
  console.log(`  Appears: ${c.bold(`Phase ${position}: ${title}`)}, last in ${curriculum.label}`);
  console.log('');
  console.log(c.dim('An empty phase stays hidden. Run this tool again and choose "A new module" to add its first page.'));
}

try {
  const what = await choose('What would you like to create?', [
    {k: 'module', label: 'A new module (one page inside an existing phase)'},
    {k: 'phase', label: 'A new phase (a whole new section of a curriculum)'},
  ], (i) => i.label);
  if (what.k === 'module') await newModule();
  else await newPhase();
} finally {
  rl.close();
}
