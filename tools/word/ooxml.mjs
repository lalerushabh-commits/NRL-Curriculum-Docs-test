/**
 * Read a .docx into an annotated block stream.
 *
 * This is deliberately not pandoc and not mammoth. In this document the meaning
 * of a block lives in its *formatting*: a coloured cell fill says "this is a
 * warning", the Consolas font says "this is code". Both converters throw that
 * away before you can see it, which would collapse every admonition, every
 * answer box and every code block into the same anonymous table.
 *
 * So we read word/document.xml ourselves. The document uses a small, regular
 * subset of OOXML (no numbering, no merged cells, no floating images, one level
 * of table nesting), which is what makes this tractable.
 */
import {unzipSync} from 'fflate';
import {XMLParser} from 'fast-xml-parser';
import {createHash} from 'node:crypto';
import fs from 'node:fs';

const TEXT = '#text';

/** fast-xml-parser in preserveOrder mode: every node is {tag: [children], ':@': attrs}. */
const parser = new XMLParser({
  preserveOrder: true,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  trimValues: false, // Word's xml:space="preserve" runs carry load-bearing spaces
  parseTagValue: false,
  parseAttributeValue: false,
});

const tagOf = (node) =>
  node && typeof node === 'object' ? Object.keys(node).find((k) => k !== ':@') : undefined;
const attrs = (node) => (node && typeof node === 'object' ? node[':@'] ?? {} : {});

/**
 * A text node is {'#text': 'value'}, so its "children" are a string, not a
 * list. Returning that string would make every walker iterate characters and
 * recurse forever, so anything that is not an array is treated as a leaf.
 */
const childrenOf = (node) => {
  const t = tagOf(node);
  if (t === undefined) return [];
  const v = node[t];
  return Array.isArray(v) ? v : [];
};

/** Depth-first search for the first descendant with this tag. */
function find(nodes, tag) {
  for (const n of nodes ?? []) {
    if (tagOf(n) === tag) return n;
    const hit = find(childrenOf(n), tag);
    if (hit) return hit;
  }
  return null;
}

/** All descendants with this tag, in document order. */
function findAll(nodes, tag, acc = []) {
  for (const n of nodes ?? []) {
    if (tagOf(n) === tag) acc.push(n);
    findAll(childrenOf(n), tag, acc);
  }
  return acc;
}

/** Direct children with this tag. */
const kids = (nodes, tag) => (nodes ?? []).filter((n) => tagOf(n) === tag);

/**
 * Word writes both <w:b/> and <w:b w:val="0"/>. Treating presence as "on"
 * marks large stretches of the document bold that are not.
 */
function isOn(rPr, tag) {
  const el = rPr ? kids(childrenOf(rPr), tag)[0] : null;
  if (!el) return false;
  const v = attrs(el)['w:val'];
  return v !== '0' && v !== 'false';
}

// --------------------------------------------------------------------- runs

/**
 * One run of text with the formatting that matters to us.
 * `shaded` + `mono` is how inline code is encoded; `mono` alone appears inside
 * code blocks, where the shading sits on the cell instead.
 */
function readRun(node) {
  const ch = childrenOf(node);
  const rPr = find(ch, 'w:rPr');
  const rPrCh = rPr ? childrenOf(rPr) : [];
  const fonts = kids(rPrCh, 'w:rFonts')[0];
  const shd = kids(rPrCh, 'w:shd')[0];

  let text = '';
  for (const c of ch) {
    const t = tagOf(c);
    if (t === 'w:t') text += childrenOf(c).map((x) => x[TEXT] ?? '').join('');
    else if (t === 'w:br') text += '\n';
    else if (t === 'w:tab') text += '\t';
  }

  const blip = find(ch, 'a:blip');

  return {
    text,
    bold: isOn(rPr, 'w:b'),
    italic: isOn(rPr, 'w:i'),
    mono: (attrs(fonts)['w:ascii'] ?? '') === 'Consolas',
    shaded: (attrs(shd)['w:fill'] ?? '').toUpperCase() === 'F0F0F0',
    imageRel: blip ? attrs(blip)['r:embed'] ?? null : null,
  };
}

/**
 * Runs inside a paragraph, flattened. A hyperlink is a container of runs, so we
 * pull its runs up and tag each with the link it belongs to — that keeps the
 * inline renderer working on one flat list.
 */
function readRuns(paraChildren) {
  const out = [];
  for (const c of paraChildren) {
    const t = tagOf(c);
    if (t === 'w:r') {
      out.push(readRun(c));
    } else if (t === 'w:hyperlink') {
      const a = attrs(c);
      const link = {rel: a['r:id'] ?? null, anchor: a['w:anchor'] ?? null};
      for (const r of findAll(childrenOf(c), 'w:r')) out.push({...readRun(r), link});
    }
  }
  return out;
}

// --------------------------------------------------------- paragraphs, tables

function readParagraph(node) {
  const ch = childrenOf(node);
  const pPr = find(ch, 'w:pPr');
  const pPrCh = pPr ? childrenOf(pPr) : [];
  const style = attrs(kids(pPrCh, 'w:pStyle')[0])['w:val'] ?? null;
  const ind = kids(pPrCh, 'w:ind')[0];
  const runs = readRuns(ch);
  const text = runs.map((r) => r.text).join('');
  const withText = runs.filter((r) => r.text.trim());

  return {
    kind: 'para',
    style,
    // Heading level, or null. The one thing pandoc silently loses on this file.
    heading: /^Heading[1-6]$/.test(style ?? '') ? Number(style.slice(-1)) : null,
    indent: Number(attrs(ind)['w:start'] ?? attrs(ind)['w:left'] ?? 0),
    runs,
    text,
    // "italic-only" identifies image captions. An empty paragraph is not italic.
    allItalic: withText.length > 0 && withText.every((r) => r.italic),
    images: runs.filter((r) => r.imageRel).map((r) => r.imageRel),
    bookmarks: findAll(ch, 'w:bookmarkStart').map((b) => attrs(b)['w:name']).filter(Boolean),
  };
}

function readCell(node) {
  const ch = childrenOf(node);
  const tcPr = find(ch, 'w:tcPr');
  const tcPrCh = tcPr ? childrenOf(tcPr) : [];
  const shd = kids(tcPrCh, 'w:shd')[0];
  const gridSpan = kids(tcPrCh, 'w:gridSpan')[0];
  const vMerge = kids(tcPrCh, 'w:vMerge')[0];

  return {
    fill: (attrs(shd)['w:fill'] ?? '').toUpperCase() || null,
    // Cell contents are themselves blocks — this is where nested tables live.
    blocks: readBlocks(ch),
    merged: !!gridSpan || !!vMerge,
  };
}

function readTable(node) {
  const rows = kids(childrenOf(node), 'w:tr').map((tr) => kids(childrenOf(tr), 'w:tc').map(readCell));
  const fills = new Set();
  for (const r of rows) for (const c of r) if (c.fill) fills.add(c.fill);
  return {
    kind: 'table',
    rows,
    fills,
    rowCount: rows.length,
    cellCount: rows.reduce((n, r) => n + r.length, 0),
    merged: rows.some((r) => r.some((c) => c.merged)),
  };
}

/** Direct block children of a body or a table cell, in order. */
function readBlocks(nodes) {
  const out = [];
  for (const n of nodes ?? []) {
    const t = tagOf(n);
    if (t === 'w:p') out.push(readParagraph(n));
    else if (t === 'w:tbl') out.push(readTable(n));
    else if (t === 'w:sdt') {
      // Word's table-of-contents field. Its content is generated, never authored.
      const c = find(childrenOf(n), 'w:sdtContent');
      if (c) out.push(...readBlocks(childrenOf(c)));
    }
  }
  return out;
}

// ---------------------------------------------------------------------- entry

/** Read a .docx. Returns {blocks, rels, media, warnings}. */
export function readDocx(file) {
  const zip = unzipSync(new Uint8Array(fs.readFileSync(file)));
  const warnings = [];

  const xml = (name) => {
    const bytes = zip[name];
    if (!bytes) return null;
    return parser.parse(Buffer.from(bytes).toString('utf8'));
  };

  const doc = xml('word/document.xml');
  if (!doc) throw new Error('This file does not look like a Word document (no word/document.xml inside).');

  const body = find(doc, 'w:body');
  if (!body) throw new Error('The Word document has no body.');
  const blocks = readBlocks(childrenOf(body));

  // Relationship ids to link targets and image parts.
  const rels = new Map();
  const relXml = xml('word/_rels/document.xml.rels');
  for (const r of findAll(relXml ?? [], 'Relationship')) {
    const a = attrs(r);
    if (a.Id) rels.set(a.Id, {target: a.Target ?? '', external: a.TargetMode === 'External'});
  }

  // Media, keyed by relationship id so a block can look up its own picture.
  const media = new Map();
  for (const [id, rel] of rels) {
    if (rel.external || !rel.target.startsWith('media/')) continue;
    const bytes = zip[`word/${rel.target}`];
    if (!bytes) {
      warnings.push(`A picture is referenced but missing from the document (${rel.target}).`);
      continue;
    }
    const buf = Buffer.from(bytes);
    media.set(id, {
      name: rel.target.slice('media/'.length),
      bytes: buf,
      sha1: createHash('sha1').update(buf).digest('hex'),
      ext: (rel.target.split('.').pop() ?? '').toLowerCase(),
    });
  }

  // These are empty today. If they stop being empty, content is being lost.
  const parts = [
    ['word/footnotes.xml', 'footnotes'],
    ['word/endnotes.xml', 'endnotes'],
    ['word/comments.xml', 'comments'],
  ];
  for (const [part, what] of parts) {
    const text = findAll(xml(part) ?? [], 'w:t')
      .map((t) => childrenOf(t).map((x) => x[TEXT] ?? '').join(''))
      .join('')
      .trim();
    if (text) {
      warnings.push(`The document contains ${what}, which do not appear on the website. Move that text into the page itself.`);
    }
  }

  return {blocks, rels, media, warnings};
}

export {find, findAll, kids, tagOf, attrs, childrenOf};
