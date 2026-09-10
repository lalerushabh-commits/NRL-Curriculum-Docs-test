/**
 * The manifest: everything about the site that the Word document cannot say.
 *
 * The docx knows the words, the pictures and the order. It does not know:
 *   - which folder a phase lives in ("Phase 1: Foundations" is
 *     phase-1-electronics-foundations, and "Phase 5: DIY (Do It Yourself)" is
 *     phase-5-self-practice — neither is derivable from the heading),
 *   - that the programming curriculum uses part-N- while the others use phase-N-,
 *   - the _category_.json labels and descriptions (which carry "[Foundation]"
 *     prefixes that appear nowhere in the document),
 *   - the legacy numeric filename prefixes (07-motors.md sits at position 1),
 *   - which code block is C++ and which is plain text,
 *   - which pictures were animated GIFs before Word flattened them.
 *
 * It is also what keeps web addresses still. A slug is written once and then
 * frozen, so renaming a heading in Word changes the sidebar title and nothing
 * else — the URL is read from here, never re-derived from the title.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT, DOCS} from '../lib.mjs';

export const MANIFEST_PATH = path.join(ROOT, 'source', 'manifest.json');

export const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

export function loadManifest(file = MANIFEST_PATH) {
  if (!fs.existsSync(file)) {
    throw new Error(
      `The site index is missing (${path.relative(ROOT, file)}).\n` +
        'Run: node tools/word/seed-manifest.mjs',
    );
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function saveManifest(manifest, file = MANIFEST_PATH) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

/** Read a doc's frontmatter and body, tolerating CRLF (core.autocrlf is on here). */
export function splitDoc(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return {frontmatter: fm, body: m[2]};
}

/** "Module 3.1: Motors" -> {phase: 3, position: 1, title: "Motors"} */
export function parseModuleTitle(text) {
  const m = text.trim().match(/^Module\s+(\d+)\.(\d+):\s*(.+)$/);
  if (!m) return null;
  return {phase: Number(m[1]), position: Number(m[2]), title: m[3].trim()};
}

/**
 * Build a manifest from the site as it stands today. Run once; the output is
 * committed and from then on maintained by the converter.
 */
export function seedFromDocs() {
  const curricula = [];
  const modules = [];

  const curriculumDirs = fs
    .readdirSync(DOCS, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .map((name) => {
      const cat = readCategory(path.join(DOCS, name));
      return {name, cat};
    })
    .filter((c) => c.cat) // a folder with no _category_.json is not a curriculum
    .sort((a, b) => (a.cat.position ?? 99) - (b.cat.position ?? 99));

  for (const cur of curriculumDirs) {
    const curDir = path.join(DOCS, cur.name);
    const phases = fs
      .readdirSync(curDir, {withFileTypes: true})
      .filter((d) => d.isDirectory())
      .map((d) => ({name: d.name, cat: readCategory(path.join(curDir, d.name))}))
      .filter((p) => p.cat)
      .sort((a, b) => (a.cat.position ?? 99) - (b.cat.position ?? 99));

    const curId = cur.name.replace(/-curriculum$/, '');
    const phaseEntries = [];

    for (const phase of phases) {
      const phaseDir = path.join(curDir, phase.name);
      const files = fs.readdirSync(phaseDir).filter((f) => /^\d+-.*\.md$/.test(f)).sort();
      if (files.length === 0) continue; // an empty phase is not part of the book

      const phaseId = `${curId}-p${phase.cat.position}`;
      // Do the filenames simply count 01,02,03...? If not they are legacy
      // numbers that must be pinned rather than recomputed.
      const positional = files.every((f, i) => f.startsWith(String(i + 1).padStart(2, '0') + '-'));

      for (const file of files) {
        const text = fs.readFileSync(path.join(phaseDir, file), 'utf8');
        const doc = splitDoc(text);
        if (!doc) throw new Error(`${file} has no settings block at the top.`);
        const parsed = parseModuleTitle(doc.frontmatter.title);
        modules.push({
          id: `${phaseId}-${file.replace(/^\d+-/, '').replace(/\.md$/, '')}`,
          phase: phaseId,
          file,
          slug: doc.frontmatter.slug,
          position: Number(doc.frontmatter.sidebar_position),
          title: parsed ? parsed.title : doc.frontmatter.title,
          images: readImageStyles(doc.body),
        });
      }

      phaseEntries.push({
        id: phaseId,
        folder: phase.name,
        label: phase.cat.label,
        filePrefix: positional ? 'position' : 'legacy',
        nextFilePrefix: positional
          ? null
          : Math.max(...files.map((f) => Number(f.slice(0, 2)))) + 1,
        category: phase.cat,
      });
    }

    curricula.push({id: curId, folder: cur.name, label: cur.cat.label, category: cur.cat, phases: phaseEntries});
  }

  // "How to Use This Book" sits at the root of docs/, outside every phase, and
  // is the one page whose title is unquoted in its settings block.
  const frontFile = path.join(DOCS, 'how-to-use-this-book.md');
  const frontDoc = fs.existsSync(frontFile) ? splitDoc(fs.readFileSync(frontFile, 'utf8')) : null;
  const frontPage = frontDoc
    ? {
        file: 'how-to-use-this-book.md',
        heading: 'How to Use This Book',
        title: frontDoc.frontmatter.title,
        slug: frontDoc.frontmatter.slug,
        position: Number(frontDoc.frontmatter.sidebar_position),
        images: readImageStyles(frontDoc.body),
      }
    : null;

  return {
    version: 1,
    note: 'Generated from docs/ by tools/word/seed-manifest.mjs, then maintained by tools/word/convert.mjs. Slugs here are frozen: they are what keeps web addresses stable when a heading is renamed in Word.',
    frontPage,
    curricula,
    modules,
    // Pictures Word cannot round-trip: it flattens animated GIFs to a still
    // frame, so the still must be mapped back to the original file.
    imagePins: {},
    // The docx carries no language on a code block. Seeded from today's pages.
    codeFenceLanguage: {},
    // Files never treated as unused, whatever the pages reference.
    keepAlways: ['img/logo.svg', 'img/favicon.svg', 'img/favicon.ico', 'img/docusaurus-social-card.jpg'],
    // Slugs that used to exist. Kept so nothing silently links to a dead page.
    retired: [],
  };
}

/**
 * Which caption style each picture on a page uses.
 *
 * The site does two things side by side: some pictures are just
 * `![caption](src)`, others repeat the same sentence underneath as an italic
 * line. In Word both look identical — a picture followed by an italic
 * paragraph — so the document cannot tell them apart and roughly half the
 * pictures in the book would get rewritten on the first run. Recorded here
 * instead, in page order.
 */
function readImageStyles(body) {
  const lines = body.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const img = lines[i].trim().match(/^!\[(.*)\]\((.+)\)$/);
    if (!img) continue;
    const next = lines.slice(i + 1, i + 3).find((l) => l.trim());
    out.push({
      path: img[2],
      italicCaption: !!next && /^\*[^*].*\*$/.test(next.trim()),
    });
  }
  return out;
}

function readCategory(dir) {
  const file = path.join(dir, '_category_.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Look-ups the converter needs, built once per run. */
export function indexManifest(manifest) {
  const phaseById = new Map();
  const curriculumOfPhase = new Map();
  for (const cur of manifest.curricula) {
    for (const ph of cur.phases) {
      phaseById.set(ph.id, ph);
      curriculumOfPhase.set(ph.id, cur);
    }
  }
  const modulesByPhase = new Map();
  for (const m of manifest.modules) {
    if (!modulesByPhase.has(m.phase)) modulesByPhase.set(m.phase, []);
    modulesByPhase.get(m.phase).push(m);
  }
  for (const list of modulesByPhase.values()) list.sort((a, b) => a.position - b.position);
  return {phaseById, curriculumOfPhase, modulesByPhase};
}
