/**
 * Word document in, a whole site's worth of files out.
 *
 * Nothing here touches the working tree. The result is a Map of
 * repo-relative path to contents, which is what lets the publisher convert,
 * inspect and compare before it writes a single file — and throw the whole
 * thing away if anything went wrong.
 */
import path from 'node:path';
import fs from 'node:fs';
import {ROOT, slugify} from '../lib.mjs';
import {readDocx} from './ooxml.mjs';
import {renderBlocks, renderInline, plain, LIST_INDENT} from './grammar.mjs';
import {indexManifest, parseModuleTitle, sha1} from './manifest.mjs';

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);

/** Import lines, always in this order, always straight after the settings block. */
const IMPORT_LINES = [
  ['ApiTable', "import ApiTable from '@site/src/components/ApiTable';"],
  ['Answer', "import Answer from '@site/src/components/Answer';"],
  ['YouTubeEmbed', "import YouTubeEmbed from '@site/src/components/YouTubeEmbed';"],
  ['ExternalModuleNote', "import ExternalModuleNote from '@site/src/components/ExternalModuleNote';"],
  ['useBaseUrl', "import useBaseUrl from '@docusaurus/useBaseUrl';"],
];

// ------------------------------------------------------------- segmentation

/**
 * Cut the flat block stream into pages.
 *
 * Heading 1 is a curriculum, Heading 2 a phase, Heading 3 a page. Word's
 * generated table of contents is skipped: it is not something anyone wrote.
 */
function segment(blocks, problems) {
  const pages = [];
  const outline = []; // [{heading, phases: [heading, ...]}] — what Word calls each section
  let front = null;
  let curriculum = null;
  let phase = null;
  let current = null;
  let skipping = false;

  for (const b of blocks) {
    if (b.kind === 'para' && b.heading && b.heading <= 3) {
      const text = plain(b);

      if (b.heading === 1) {
        current = null;
        if (/^table of contents$/i.test(text)) {
          skipping = true;
          continue;
        }
        skipping = false;
        if (/^how to use this book$/i.test(text)) {
          front = {heading: text, blocks: []};
          current = front;
          curriculum = null;
        } else {
          curriculum = {heading: text, index: pages.length};
          outline.push({heading: text, phases: []});
          phase = null;
        }
        continue;
      }

      if (b.heading === 2) {
        phase = {heading: text, ordinal: (phase?.ordinal ?? 0) + 1};
        if (curriculum) outline[outline.length - 1].phases.push(text);
        current = null;
        continue;
      }

      // Heading 3: a page.
      const parsed = parseModuleTitle(text);
      if (!parsed) {
        problems.push({
          where: text,
          message:
            `the heading "${text}" is a Heading 3 but is not written as "Module 1.2: Something". ` +
            'Every page heading needs that form so the website knows where it belongs.',
        });
        current = null;
        continue;
      }
      if (!curriculum || !phase) {
        problems.push({
          where: text,
          message: 'this page is not underneath a curriculum heading and a phase heading. Check the headings above it in Word.',
        });
        current = null;
        continue;
      }
      current = {
        heading: text,
        title: parsed.title,
        phaseNumber: parsed.phase,
        ordinal: parsed.position,
        curriculum: curriculum.heading,
        phaseHeading: phase.heading,
        phaseOrdinal: phase.ordinal,
        bookmark: b.bookmarks.find((n) => n.startsWith('bm_')) ?? null,
        blocks: [],
      };
      pages.push(current);
      continue;
    }

    if (skipping || !current) continue;
    current.blocks.push(b);
  }

  return {front, pages, outline};
}

// ------------------------------------------------------------------ identity

/**
 * Line the pages in the Word document up with the pages the website already
 * has. Matching by bookmark first, then by title, then by position, means a
 * renamed heading still finds its old entry — and so keeps its web address.
 */
function reconcile(pages, manifest, idx, problems) {
  const unused = new Set(manifest.modules.map((m) => m.id));
  const byBookmark = new Map();
  for (const m of manifest.modules) {
    const b = bookmarkFor(m, idx);
    if (b) byBookmark.set(b, byBookmark.has(b) ? null : m); // null marks a collision
  }
  const byTitle = new Map();
  for (const m of manifest.modules) {
    const k = m.title.toLowerCase();
    byTitle.set(k, byTitle.has(k) ? null : m);
  }

  const phasesInOrder = [];
  for (const cur of manifest.curricula) for (const ph of cur.phases) phasesInOrder.push({cur, ph});

  for (const page of pages) {
    // Which phase folder does this page belong to? Word gives the curriculum
    // by order and the phase by order; the folder names live in the manifest.
    const curIndex = curriculumIndex(page.curriculum);
    const cur = manifest.curricula[curIndex] ?? null;
    const ph = cur?.phases[page.phaseOrdinal - 1] ?? null;

    let match =
      (page.bookmark && byBookmark.get(page.bookmark)) ||
      byTitle.get(page.title.toLowerCase()) ||
      (ph ? (idx.modulesByPhase.get(ph.id) ?? []).find((m) => m.position === page.ordinal) : null) ||
      null;

    if (match && !unused.has(match.id)) match = null; // already claimed
    if (match) unused.delete(match.id);

    page.phaseRef = ph;
    page.curriculumRef = cur;
    page.module = match;

    if (!ph) {
      problems.push({
        where: page.heading,
        message:
          `there is no folder on the website for "${page.phaseHeading}" in "${page.curriculum}". ` +
          'A brand new phase has to be set up once before its pages can be published.',
      });
    }
  }

  return {removed: [...unused].map((id) => manifest.modules.find((m) => m.id === id))};
}

/**
 * The bookmark Word carries for a page: "bm_" + folder + "_" + address stub,
 * underscored, cut to Word's 40-character limit. The cut is why several pages
 * can share one name, which is why matching does not stop here.
 */
function bookmarkFor(module, idx) {
  if (module.bookmark) return module.bookmark;
  const phase = idx.phaseById.get(module.phase);
  if (!phase) return null;
  const stub = module.slug.split('/').pop();
  return `bm_${phase.folder}_${stub}`.replace(/-/g, '_').slice(0, 40);
}

/** Compare page titles ignoring punctuation and case. */
const titleKey = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function curriculumIndex(heading) {
  const m = heading.match(/^(\d+)\./);
  return m ? Number(m[1]) - 1 : 0;
}

/** A new page's file name, honouring a phase's legacy numbering. */
function fileNameFor(phase, stub, ordinal, usedNumbers) {
  if (phase.filePrefix === 'legacy') {
    let n = phase.nextFilePrefix ?? 1;
    while (usedNumbers.has(n)) n++;
    usedNumbers.add(n);
    phase.nextFilePrefix = n + 1;
    return `${String(n).padStart(2, '0')}-${stub}.md`;
  }
  return `${String(ordinal).padStart(2, '0')}-${stub}.md`;
}

// -------------------------------------------------------------------- images

function buildImageIndex() {
  const index = new Map();
  const base = path.join(ROOT, 'static');
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else index.set(sha1(fs.readFileSync(p)), `/${path.relative(base, p).split(path.sep).join('/')}`);
    }
  };
  walk(path.join(base, 'img'));
  return index;
}

// ------------------------------------------------------------------ the run

export function convert({docxPath, manifest, assetsDir}) {
  const {blocks, rels, media, warnings} = readDocx(docxPath);
  const problems = [];
  const notes = [...warnings];
  const files = new Map();
  const idx = indexManifest(manifest);

  const {front, pages, outline} = segment(blocks, problems);
  const {removed} = reconcile(pages, manifest, idx, problems);

  // Every page's address, known before rendering so cross-links can resolve.
  const slugOf = new Map(); // bookmark -> slug (first claimant)
  const bookmarkUses = new Map(); // bookmark -> how many pages share it
  const slugByTitle = new Map(); // page title -> slug
  const byPhaseOrdinal = new Map(); // `${phaseId}|${ordinal}` -> slug
  const added = [];
  const renamed = [];
  const usedNumbers = new Map();

  for (const page of pages) {
    if (!page.phaseRef) continue;
    const ph = page.phaseRef;
    if (page.module) {
      page.slug = page.module.slug;
      page.file = page.module.file;
      if (page.module.title !== page.title) renamed.push({from: page.module.title, to: page.title, slug: page.slug});
    } else {
      const stub = slugify(page.title);
      if (!usedNumbers.has(ph.id)) {
        usedNumbers.set(
          ph.id,
          new Set((idx.modulesByPhase.get(ph.id) ?? []).map((m) => Number(m.file.slice(0, 2)))),
        );
      }
      page.slug = `/${ph.folder}/${stub}`;
      page.file = fileNameFor(ph, stub, page.ordinal, usedNumbers.get(ph.id));
      added.push({title: page.title, slug: page.slug});
    }
    if (page.bookmark) {
      if (!slugOf.has(page.bookmark)) slugOf.set(page.bookmark, page.slug);
      bookmarkUses.set(page.bookmark, (bookmarkUses.get(page.bookmark) ?? 0) + 1);
    }
    slugByTitle.set(titleKey(page.title), page.slug);
    byPhaseOrdinal.set(`${ph.id}|${page.ordinal}`, page.slug);
  }

  const imageIndex = buildImageIndex();
  const newImages = [];

  // ---- render each page -----------------------------------------------
  const renderPage = (page, spec) => {
    const imports = new Set();
    let imageNumber = 0;
    const pageProblems = [];

    const ctx = {
      imports,
      fail: (message) => pageProblems.push(message),

      relTarget: (relId) => rels.get(relId)?.target ?? null,

      codeLang: (code) => manifest.codeFenceLanguage[sha1(code)] ?? null,

      resolveLink: (link, text) => {
        if (link.rel) return linkTarget(rels.get(link.rel));
        if (!link.anchor) return null;

        // Word cuts bookmark names to 40 characters, so several pages in the
        // same phase end up sharing one. When that happens the name alone is
        // not an answer, and the link's own wording has to settle it.
        const shared = (bookmarkUses.get(link.anchor) ?? 0) > 1;
        const direct = slugOf.get(link.anchor);
        if (direct && !shared) return direct;

        // "...see Module 4.6" — the number picks the page out of its phase.
        const ord = text.match(/(\d+)\.(\d+)/);
        if (ord) {
          const viaPhase = phaseSlugFor(link.anchor, Number(ord[2]));
          if (viaPhase) return viaPhase;
        }

        // "...see Four-Bar Linkage: Concept" — the wording is the page's title.
        // Punctuation is ignored: the same page gets written with a colon in
        // one place and a dash in another.
        const byTitle = slugByTitle.get(titleKey(text));
        if (byTitle) return byTitle;

        if (direct) return direct;
        pageProblems.push(`links to "${text}", which does not point at any page in the document.`);
        return null;
      },

      renderImage: (block, rawCaption, after, showCaptionLine) => {
        let caption = rawCaption;
        const relId = block.images[0];
        const item = media.get(relId);
        if (!item) return null;

        if (!IMAGE_EXTS.has(item.ext)) {
          pageProblems.push(
            `has a picture the website cannot show (a .${item.ext} file)` +
              (caption ? ` — the one captioned "${caption}"` : '') +
              '. In Word, delete it and paste it back in as a picture.',
          );
          return {markdown: '', consumed: 0};
        }

        const pin = manifest.imagePins[item.sha1];
        const target = pin?.path ?? imageIndex.get(item.sha1) ?? null;
        let src = target;
        if (pin?.stripFromCaption) caption = caption.replace(pin.stripFromCaption, '').trim();

        if (!src) {
          const stub = slugify(caption || `${spec.stub}-picture`).slice(0, 60);
          src = `/img/${spec.imageFolder}/${stub || `${spec.stub}-${imageNumber + 1}`}.${item.ext}`;
          let n = 2;
          while (files.has(`static${src}`) || imageIndex.has(src)) {
            src = `/img/${spec.imageFolder}/${stub}-${n++}.${item.ext}`;
          }
          files.set(`static${src}`, item.bytes);
          newImages.push({src, page: spec.title, caption});
        }

        // The document usually says whether to show a caption line, by
        // repeating it. The recorded style is the tie-breaker for a picture
        // that has only ever existed in Word.
        const style = spec.images?.[imageNumber++];
        const withCaptionLine = showCaptionLine ?? style?.italicCaption ?? false;

        // The drawing-sheet pages link the picture through to the full PDF.
        const pdf = after && after.kind === 'para' ? matchPdfLink(after, rels) : null;
        if (pdf) {
          imports.add('useBaseUrl');
          return {
            markdown:
              `<a href={useBaseUrl('${pdf}')} target="_blank" rel="noopener noreferrer">\n` +
              `  <img src={useBaseUrl('${src}')} alt="${caption}" />\n` +
              `</a>`,
            consumed: 1,
          };
        }

        const md = `![${caption}](${src})`;
        return {markdown: withCaptionLine && caption ? `${md}\n\n*${caption}*` : md, consumed: 0};
      },
    };

    const body = renderBlocks(page.blocks, ctx);

    for (const message of pageProblems) problems.push({where: page.heading, message});

    const importLines = IMPORT_LINES.filter(([name]) => imports.has(name)).map(([, line]) => line);
    const head = spec.frontmatter;
    return `${head}\n${importLines.length ? `${importLines.join('\n')}\n\n` : ''}${body}\n`;
  };

  /**
   * A truncated bookmark still names the folder it came from, which is enough
   * to say which phase — the ordinal from the link text then says which page.
   */
  function phaseSlugFor(anchor, ordinal) {
    for (const cur of manifest.curricula) {
      for (const ph of cur.phases) {
        const full = `bm_${ph.folder}`.replace(/-/g, '_');
        if (!anchor.startsWith(full.slice(0, Math.min(full.length, anchor.length)))) continue;
        const hit = byPhaseOrdinal.get(`${ph.id}|${ordinal}`);
        if (hit) return hit;
      }
    }
    return null;
  }

  // The front page.
  if (front) {
    const fp = manifest.frontPage;
    const spec = {
      stub: 'how-to-use-this-book',
      title: fp?.heading ?? 'How to Use This Book',
      imageFolder: 'curriculum',
      images: fp?.images ?? [],
      frontmatter: `---\ntitle: ${fp?.title ?? 'How to Use This Book'}\nsidebar_position: ${fp?.position ?? 0}\nslug: ${fp?.slug ?? '/how-to-use-this-book'}\n---\n`,
    };
    files.set(`docs/${fp?.file ?? 'how-to-use-this-book.md'}`, renderPage({...front, phaseRef: null}, spec));
  }

  for (const page of pages) {
    if (!page.phaseRef) continue;
    const dir = `docs/${page.curriculumRef.folder}/${page.phaseRef.folder}`;
    const spec = {
      stub: page.file.replace(/^\d+-/, '').replace(/\.md$/, ''),
      title: page.title,
      imageFolder: imageFolderFor(page.curriculumRef.id),
      images: page.module?.images ?? [],
      frontmatter:
        `---\ntitle: "Module ${page.phaseNumber}.${page.ordinal}: ${page.title}"\n` +
        `sidebar_position: ${page.ordinal}\nslug: ${page.slug}\n---\n`,
    };
    files.set(`${dir}/${page.file}`, renderPage(page, spec));
  }

  // Section files. The folder name and the description come from the
  // manifest — the document has no place for either — but the *name* the
  // reader sees in the sidebar is whatever the heading says in Word. Renaming
  // "Phase 1: Foundations" in Word renames it on the site; the folder and every
  // address underneath it stay put, exactly as a page's address does.
  const relabelled = [];
  manifest.curricula.forEach((cur, ci) => {
    const wordCur = outline[ci];
    const curCategory = {...cur.category};
    if (wordCur && wordCur.heading !== curCategory.label) {
      relabelled.push({folder: cur.folder, from: curCategory.label, to: wordCur.heading});
      curCategory.label = wordCur.heading;
    }
    files.set(`docs/${cur.folder}/_category_.json`, `${JSON.stringify(curCategory, null, 2)}\n`);

    cur.phases.forEach((ph, pi) => {
      const wordPhase = wordCur?.phases[pi];
      const phCategory = {...ph.category};
      if (wordPhase && wordPhase !== phCategory.label) {
        relabelled.push({folder: `${cur.folder}/${ph.folder}`, from: phCategory.label, to: wordPhase});
        phCategory.label = wordPhase;
      }
      files.set(`docs/${cur.folder}/${ph.folder}/_category_.json`, `${JSON.stringify(phCategory, null, 2)}\n`);
    });
  });

  // Files shipped beside the document (the drawing sheets).
  if (assetsDir && fs.existsSync(assetsDir)) {
    for (const rel of collectFiles(assetsDir)) {
      files.set(`static/files/${rel}`, fs.readFileSync(path.join(assetsDir, rel)));
    }
  }

  // Which file is which page, so a change list can name pages, not paths.
  const pageIndex = new Map();
  if (front) {
    const fp = manifest.frontPage;
    pageIndex.set(`docs/${fp?.file ?? 'how-to-use-this-book.md'}`, {
      title: fp?.title ?? 'How to Use This Book',
      slug: fp?.slug ?? '/how-to-use-this-book',
    });
  }
  for (const page of pages) {
    if (!page.phaseRef) continue;
    pageIndex.set(`docs/${page.curriculumRef.folder}/${page.phaseRef.folder}/${page.file}`, {
      title: `Module ${page.phaseNumber}.${page.ordinal}: ${page.title}`,
      slug: page.slug,
    });
  }

  return {files, problems, notes, added, removed, renamed, relabelled, newImages, pageCount: pages.length, pageIndex};
}

/**
 * Where a link points.
 *
 * Word marks every link it did not create itself as "external", including ones
 * that point at a file sitting next to the document — so the flag cannot be
 * trusted and the target itself has to be read. Anything without a scheme is a
 * file that ships with the book and lands under /files/.
 */
function linkTarget(rel) {
  if (!rel) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rel.target) || rel.target.startsWith('//')) return rel.target;
  if (rel.target.startsWith('/')) return rel.target;
  return `/files/${rel.target.replace(/^assets\//, '')}`;
}

function matchPdfLink(block, rels) {
  if (!plain(block).startsWith('Open full-resolution PDF')) return null;
  const run = block.runs.find((r) => r.link?.rel);
  const target = run ? linkTarget(rels.get(run.link.rel)) : null;
  return target && target.startsWith('/files/') ? target : null;
}

const imageFolderFor = (curriculumId) =>
  curriculumId === 'programming' ? 'curriculum' : curriculumId;

function collectFiles(dir, base = dir, acc = []) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectFiles(p, base, acc);
    else acc.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return acc;
}
