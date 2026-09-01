// Shared helpers for the authoring tools. No dependencies — plain Node.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DOCS = path.join(ROOT, 'docs');

/** Turn a human title into the kebab-case form used for filenames and slugs. */
export function slugify(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u2018\u2019']/g, '')      // drop apostrophes rather than turning them into dashes
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')       // everything else (incl. em dashes, commas) becomes a separator
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** Read a doc's frontmatter into a plain object. Returns null if there is no frontmatter block. */
export function readFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    out[kv[1]] = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return out;
}

/** Every module file (numeric-prefixed .md) directly inside a folder, sorted by name. */
export function modulesIn(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /^\d+-.*\.md$/.test(f)).sort();
}

/** Immediate subfolders of a docs directory, sorted by their _category_.json position. */
export function phasesIn(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => {
      const cat = path.join(dir, d.name, '_category_.json');
      let meta = {};
      try {
        meta = JSON.parse(fs.readFileSync(cat, 'utf8'));
      } catch {
        /* a folder without a readable _category_.json still gets listed */
      }
      return {name: d.name, label: meta.label ?? d.name, position: meta.position ?? 999};
    })
    .sort((a, b) => a.position - b.position);
}

/** Walk every .md file under docs/. */
export function allDocs(dir = DOCS, acc = []) {
  for (const d of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) allDocs(p, acc);
    else if (d.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

export const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/** The "4" in "Phase 4", used to number its modules 4.1, 4.2 ... */
export function phaseNumber(curriculumDir, phase) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(curriculumDir, phase.name, '_category_.json'), 'utf8'));
    return meta.position ?? 1;
  } catch {
    return 1;
  }
}

/**
 * Write a new module page at the end of a phase.
 *
 * The single place frontmatter is generated, so a page imported from Word is
 * indistinguishable from one made by the scaffolder. Throws if the file exists.
 */
export function createModule({curriculumDir, phase, title, body}) {
  const phaseDir = path.join(curriculumDir, phase.name);
  const position = modulesIn(phaseDir).length + 1;
  const stub = slugify(title);
  const file = path.join(phaseDir, `${String(position).padStart(2, '0')}-${stub}.md`);

  if (fs.existsSync(file)) {
    throw new Error(`There is already a file called ${path.basename(file)}. Pick a different title.`);
  }

  const fullTitle = `Module ${phaseNumber(curriculumDir, phase)}.${position}: ${title}`;
  const slug = `/${phase.name}/${stub}`;

  fs.writeFileSync(file, `${frontmatter({title: fullTitle, position, slug})}\n${body}`, 'utf8');
  return {file, fullTitle, slug, position};
}

/** The `---` settings block at the top of every page. */
export function frontmatter({title, position, slug}) {
  return `---\ntitle: "${title}"\nsidebar_position: ${position}\nslug: ${slug}\n---\n`;
}

// Console colours, disabled when the output is not a terminal.
const on = process.stdout.isTTY;
const wrap = (code) => (s) => (on ? `\u001b[${code}m${s}\u001b[0m` : s);
export const c = {
  red: wrap(31), green: wrap(32), yellow: wrap(33), blue: wrap(36), bold: wrap(1), dim: wrap(2),
};

/** Install dependencies if they are missing. Returns false if the install failed. */
export function ensureDeps() {
  if (fs.existsSync(path.join(ROOT, 'node_modules', '@docusaurus'))) return true;
  console.log(c.yellow('First run on this computer — setting up (a few minutes, one time only)...'));
  console.log('');
  const r = spawnSync(npmCmd(), ['install'], {cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32'});
  if (r.status !== 0) {
    console.log('');
    console.log(c.red('Setup failed. Check that Node.js 20 or newer is installed, then try again.'));
    return false;
  }
  console.log('');
  console.log(c.green('Setup done.'));
  return true;
}

export const npmCmd = () => (process.platform === 'win32' ? 'npm.cmd' : 'npm');
