/**
 * "New module" / "New phase" — creates correctly named and numbered pages
 * so nobody has to hand-write a settings block, a file number, or a slug.
 *
 * Just run it and answer the questions.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, DOCS, slugify, readFrontmatter, modulesIn, phasesIn, createModule, rel, c} from './lib.mjs';
import {ask, choose, askTitle, closePrompt} from './prompt.mjs';

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

  const body = fs
    .readFileSync(path.join(ROOT, 'tools', 'templates', 'module.md'), 'utf8')
    .replaceAll('__HEADING__', title);

  let made;
  try {
    made = createModule({curriculumDir, phase, title, body});
  } catch (e) {
    console.log(c.red(`\n${e.message}`));
    return;
  }

  console.log('');
  console.log(c.green(c.bold('Created your new module.')));
  console.log(`  File:    ${c.bold(rel(made.file))}`);
  console.log(`  Appears: ${c.bold(made.fullTitle)}, last in ${phase.label}`);
  console.log(`  Address: ${c.bold(made.slug)}`);
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
  closePrompt();
}
