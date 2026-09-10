/**
 * The grammar: Word blocks in, markdown/MDX out.
 *
 * Every rule here corresponds to something the person writing the book can see
 * and do in Word. A coloured box is an admonition, a grey monospaced box is a
 * code block, a picture followed by an italic line is a captioned picture. Rules
 * are tried in order and the first match wins.
 *
 * Pure: no file system, no network. Everything it needs comes in through `ctx`,
 * which makes the whole thing testable against the existing site.
 */

// Cell fills, which is where the meaning lives.
const FILL_BOX = 'F5F5FA'; // an admonition or an answer
const FILL_CODE = 'F0F0F0'; // a code block
const LIST_INDENT = 431; // Word's indent on every list item in this book

const ADMONITIONS = new Map([
  ['Note', 'note'],
  ['Tip', 'tip'],
  ['Warning', 'warning'],
  ['Key Idea', 'keyidea'],
]);

const ANSWER_LABEL = 'Reveal the Answer';

/** The three sentences ExternalModuleNote renders, reversed back into its prop. */
const EXTERNAL_MODULE_NOTES = new Map([
  ['This module is taught through a video walkthrough rather than written notes here — follow along as you watch.', 'video'],
  ["This module is taught through Onshape's own interactive course rather than written notes here.", 'course'],
  ["This module is taught through Onshape's own interactive course and a video playlist rather than written notes here.", 'course-and-playlist'],
]);

// ------------------------------------------------------------------ inline

/**
 * Adjacent runs that look the same are merged first. Word splits a sentence
 * into runs wherever it feels like it, and without merging you get
 * `**bold**` `**text**` instead of `**bold text**`.
 */
function coalesce(runs) {
  const out = [];
  for (const r of runs) {
    const code = r.mono && r.shaded;
    const prev = out[out.length - 1];
    const sameLink =
      (prev?.link?.rel ?? null) === (r.link?.rel ?? null) &&
      (prev?.link?.anchor ?? null) === (r.link?.anchor ?? null);
    if (prev && prev.bold === r.bold && prev.italic === r.italic && prev.code === code && sameLink) {
      prev.text += r.text;
    } else {
      out.push({text: r.text, bold: r.bold, italic: r.italic, code, link: r.link ?? null});
    }
  }
  return out.filter((r) => r.text !== '');
}

/**
 * Markdown emphasis cannot have a space just inside its markers — `** bold **`
 * renders as literal asterisks. Word regularly puts the trailing space inside
 * the bold run, so the whitespace is moved outside the markers.
 */
function wrap(text, marker) {
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m || !m[2]) return text;
  return `${m[1]}${marker}${m[2]}${marker}${m[3]}`;
}

/** Escape the two characters MDX treats as syntax, but never inside code spans. */
export function escapeMdx(text) {
  return text
    .split(/(`[^`]*`)/)
    .map((part, i) => {
      if (i % 2 === 1) return part; // inside backticks: leave alone
      return part.replace(/<(?=[A-Za-z/])/g, '&lt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    })
    .join('');
}

/** Runs of one paragraph (or table cell) to a markdown string. */
export function renderInline(runs, ctx) {
  let out = '';
  for (const r of coalesce(runs)) {
    let text = r.text.replace(/ /g, ' ');
    if (r.code) {
      text = `\`${text.trim()}\``;
      // The space the trim removed still has to separate this from its neighbour.
      if (/^\s/.test(r.text)) text = ` ${text}`;
      if (/\s$/.test(r.text)) text = `${text} `;
    } else {
      if (r.bold && r.italic) text = wrap(text, '***');
      else if (r.bold) text = wrap(text, '**');
      else if (r.italic) text = wrap(text, '*');
    }
    if (r.link) {
      const target = ctx.resolveLink(r.link, r.text);
      if (target) text = `[${text.trim()}](${target})`;
    }
    out += text;
  }
  return escapeMdx(out).trim();
}

/** Plain text of a block, for matching rules that key off exact wording. */
const plain = (block) => (block.text ?? '').replace(/ /g, ' ').trim();

const cellText = (cell) =>
  cell.blocks
    .filter((b) => b.kind === 'para')
    .map((b) => plain(b))
    .filter(Boolean)
    .join(' ')
    .trim();

/**
 * A cell's contents. A pipe written inside a cell has to be escaped or it ends
 * the cell early and the rest of the row shifts into columns of its own.
 */
const cellInline = (cell, ctx) =>
  cell.blocks
    .filter((b) => b.kind === 'para')
    .map((b) => renderInline(b.runs, ctx))
    .filter(Boolean)
    .join('<br />')
    .replace(/\|/g, '\\|');

// ------------------------------------------------------------- table shapes

const isBox = (b) => b.kind === 'table' && b.rowCount === 1 && b.cellCount === 1 && b.rows[0][0].fill === FILL_BOX;
const isCode = (b) => b.kind === 'table' && b.rowCount === 1 && b.cellCount === 1 && b.rows[0][0].fill === FILL_CODE;

/** The bold label a box opens with: "Note", or "Warning: Watch Out". */
function boxLabel(block) {
  const first = block.rows[0][0].blocks.find((b) => b.kind === 'para' && plain(b));
  if (!first) return null;
  const bold = first.runs.filter((r) => r.bold).map((r) => r.text).join('').trim();
  return bold || null;
}

function isApiTable(b) {
  if (b.kind !== 'table' || b.rowCount < 2) return false;
  const header = b.rows[0].map((c) => cellText(c));
  return header.length === 2 && header[0] === 'Member' && header[1] === 'Purpose';
}

// -------------------------------------------------------------- code blocks

/**
 * Every line inside the grey box, verbatim. Word stores a code block as one
 * paragraph per line, so paragraphs are joined with newlines and nothing is
 * escaped — this is the one place markdown syntax must survive untouched.
 */
function codeText(cell) {
  return cell.blocks
    .filter((b) => b.kind === 'para')
    .map((b) => (b.text ?? '').replace(/ /g, ' ').replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

/**
 * The document says nothing about a code block's language. Known blocks are
 * looked up by content so the existing pages reproduce exactly; anything new
 * gets a guess that is right whenever the block contains C++ punctuation.
 */
export function guessLanguage(code) {
  return /[;{}]|#include|::|\/\/|\bclass\b|\bvoid\b|\bint\b/.test(code) ? 'cpp' : 'text';
}

function renderCode(cell, ctx) {
  const code = codeText(cell);
  const lang = ctx.codeLang(code) ?? guessLanguage(code);
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

// --------------------------------------------------------------- admonitions

function renderBox(block, ctx) {
  const label = boxLabel(block);
  const cell = block.rows[0][0];

  if (label === ANSWER_LABEL) {
    ctx.imports.add('Answer');
    const body = renderBlocks(dropLabelParagraph(cell.blocks), ctx).trim();
    // Every answer in the book is a single line; keep it on one.
    return body.includes('\n') ? `<Answer>\n${body}\n</Answer>` : `<Answer>${body}</Answer>`;
  }

  const [, kindWord, customTitle] = label?.match(/^([^:]+?)(?::\s*([\s\S]+))?$/) ?? [];
  const kind = ADMONITIONS.get((kindWord ?? '').trim());
  if (!kind) {
    ctx.fail(
      `has a coloured box labelled "${label ?? '(no label)'}". The labels the website understands are ` +
        `Note, Tip, Warning, Key Idea and Reveal the Answer. Change the label in Word.`,
    );
    return '';
  }
  if (kind === 'keyidea') ctx.usedKeyIdea = true;

  const head = customTitle ? `:::${kind}[${customTitle.trim()}]` : `:::${kind}`;
  const body = renderBlocks(dropLabelParagraph(cell.blocks), ctx).trim();
  return `${head}\n${body}\n:::`;
}

/** The label is the box's first paragraph; it becomes the :::marker, not body text. */
function dropLabelParagraph(blocks) {
  const i = blocks.findIndex((b) => b.kind === 'para' && plain(b));
  return i === -1 ? blocks : [...blocks.slice(0, i), ...blocks.slice(i + 1)];
}

// -------------------------------------------------------------------- tables

function renderApiTable(block, ctx) {
  ctx.imports.add('ApiTable');
  const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const rows = block.rows.slice(1).map((row) => {
    const member = cellText(row[0]);
    // A second paragraph in the description cell is the component's `detail`.
    const paras = row[1].blocks.filter((b) => b.kind === 'para' && plain(b));
    const description = paras.length ? renderInline(paras[0].runs, ctx) : '';
    // The extra line under a description is set in italics in Word purely to
    // look like a footnote; the component styles it itself, so the markers go.
    const detail =
      paras.length > 1
        ? paras
            .slice(1)
            .map((p) => renderInline(p.runs.map((r) => ({...r, italic: false})), ctx))
            .join(' ')
        : null;
    const fields = [`member: '${q(member)}'`, `description: '${q(description)}'`];
    if (detail) fields.push(`detail: '${q(detail)}'`);
    return `  {${fields.join(', ')}},`;
  });
  return `<ApiTable rows={[\n${rows.join('\n')}\n]} />`;
}

const unbold = (block) =>
  block.kind === 'para' ? {...block, runs: block.runs.map((r) => ({...r, bold: false}))} : block;

function renderTable(block, ctx) {
  if (block.merged) {
    ctx.fail('has a table with merged cells, which the website cannot show. Split them back apart in Word.');
    return '';
  }
  const width = Math.max(...block.rows.map((r) => r.length));
  // An empty cell is written as "| |", not "|  |" — one space, not two.
  const line = (cells) => `|${cells.map((cell) => (cell ? ` ${cell} ` : ' ')).join('|')}|`;
  // Word bolds the header row by hand; markdown makes a header bold on its
  // own, so keeping the bold here would double it up.
  const header = block.rows[0].map((cell) =>
    cellInline({...cell, blocks: cell.blocks.map(unbold)}, ctx),
  );
  while (header.length < width) header.push('');
  const out = [line(header), line(Array(width).fill('---'))];
  for (const row of block.rows.slice(1)) {
    const cells = row.map((c) => cellInline(c, ctx));
    while (cells.length < width) cells.push('');
    out.push(line(cells));
  }
  return out.join('\n');
}

// -------------------------------------------------------------------- blocks

/**
 * Turn a run of blocks into markdown.
 *
 * Some rules look ahead: a picture consumes the italic caption that follows it,
 * and consecutive list items are gathered into one list, so the loop advances
 * by more than one block in those cases.
 */
export function renderBlocks(blocks, ctx) {
  const out = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];

    if (b.kind === 'table') {
      if (isBox(b)) out.push(renderBox(b, ctx));
      else if (isCode(b)) out.push(renderCode(b.rows[0][0], ctx));
      else if (isApiTable(b)) out.push(renderApiTable(b, ctx));
      else out.push(renderTable(b, ctx));
      i++;
      continue;
    }

    // Headings inside a page. Word's H4 and H5 are both a section; H6 is a
    // sub-section. (The page's own title is the H3 and is not part of the body.)
    if (b.heading === 4 || b.heading === 5) {
      out.push(`## ${renderInline(b.runs, ctx)}`);
      i++;
      continue;
    }
    if (b.heading === 6) {
      out.push(`### ${renderInline(b.runs, ctx)}`);
      i++;
      continue;
    }

    // A picture and the italic line under it that names it.
    //
    // Some pictures are followed by the same sentence twice. That is not a
    // mistake: the site writes a caption into the picture itself and, for
    // about half of them, repeats it as a visible line underneath. Both come
    // through Word as italic paragraphs, so two means "show the line as well"
    // and one means "don't" — the document says which without being asked.
    if (b.images.length) {
      const isCaption = (blk) => blk && blk.kind === 'para' && blk.allItalic;
      const first = blocks[i + 1];
      const hasCaption = isCaption(first);
      const caption = hasCaption ? plain(first) : '';
      const second = blocks[i + 2];
      const repeated = hasCaption && isCaption(second) && plain(second) === caption;

      const rendered = ctx.renderImage(b, caption, repeated ? blocks[i + 3] : second, repeated);
      if (rendered !== null) {
        out.push(rendered.markdown);
        i += 1 + (hasCaption ? 1 : 0) + (repeated ? 1 : 0) + (rendered.consumed ?? 0);
        continue;
      }
    }

    const text = plain(b);

    // A module taught elsewhere: one of ExternalModuleNote's exact sentences.
    const via = EXTERNAL_MODULE_NOTES.get(text);
    if (via) {
      ctx.imports.add('ExternalModuleNote');
      out.push(`<ExternalModuleNote via="${via}" />`);
      i++;
      continue;
    }

    // "▶ Watch: <title>" linking to YouTube becomes the embedded player.
    const watch = matchWatch(b, ctx);
    if (watch) {
      ctx.imports.add('YouTubeEmbed');
      out.push(watch);
      i++;
      continue;
    }

    // Lists. Word gives every list item the same indent, which is what
    // separates a real list item from a paragraph that happens to start "1.".
    if (b.indent === LIST_INDENT && /^[•·-]\s/.test(text)) {
      const items = [];
      while (
        i < blocks.length &&
        blocks[i].kind === 'para' &&
        blocks[i].indent === LIST_INDENT &&
        /^[•·-]\s/.test(plain(blocks[i]))
      ) {
        items.push(`- ${stripMarker(blocks[i], ctx, /^[•·-]\s+/)}`);
        i++;
      }
      out.push(items.join('\n'));
      continue;
    }
    if (b.indent === LIST_INDENT && /^\d+\.\s/.test(text)) {
      const items = [];
      while (
        i < blocks.length &&
        blocks[i].kind === 'para' &&
        blocks[i].indent === LIST_INDENT &&
        /^\d+\.\s/.test(plain(blocks[i]))
      ) {
        const n = plain(blocks[i]).match(/^(\d+)\./)[1];
        items.push(`${n}. ${stripMarker(blocks[i], ctx, /^\d+\.\s+/)}`);
        i++;
      }
      out.push(items.join('\n'));
      continue;
    }

    if (!text) {
      i++;
      continue; // blank paragraph: spacing is handled by the joiner
    }

    out.push(renderInline(b.runs, ctx));
    i++;
  }

  return out.filter((s) => s !== '').join('\n\n');
}

/** Render a list item without its bullet or number, which markdown supplies. */
function stripMarker(block, ctx, marker) {
  const runs = block.runs.map((r) => ({...r}));
  for (const r of runs) {
    if (!r.text.trim()) continue;
    r.text = r.text.replace(marker, '');
    break;
  }
  return renderInline(runs, ctx);
}

function matchWatch(block, ctx) {
  const text = plain(block);
  if (!text.startsWith('▶ Watch:')) return null;
  const run = block.runs.find((r) => r.link?.rel);
  if (!run) return null;
  const target = ctx.relTarget(run.link.rel);
  if (!target) return null;
  const title = text.replace(/^▶\s*Watch:\s*/, '').trim();
  const list = target.match(/[?&]list=([\w-]+)/);
  if (list) return `<YouTubeEmbed listId="${list[1]}" title="${title}" />`;
  const id = target.match(/[?&]v=([\w-]+)/) ?? target.match(/youtu\.be\/([\w-]+)/);
  if (id) return `<YouTubeEmbed id="${id[1]}" title="${title}" />`;
  return null;
}

export {isBox, isCode, isApiTable, boxLabel, plain, cellText, codeText, ADMONITIONS, ANSWER_LABEL, LIST_INDENT};
