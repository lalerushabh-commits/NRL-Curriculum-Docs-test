/**
 * How generated pages are compared with pages on disk.
 *
 * Shared so the verification harness and the publisher's change list agree on
 * what counts as a difference — otherwise one of them reports churn the other
 * does not, and neither can be trusted.
 */

/**
 * Join lines that markdown would render as one paragraph anyway.
 *
 * A single newline inside a paragraph is a "soft break": markdown renders it as
 * a space, so `a\nb` and `a b` produce exactly the same page. Word has no way
 * to record the difference — exporting the site flattened those breaks into
 * spaces — so the converter cannot put them back, and comparing them literally
 * would report dozens of files as changed when not one rendered character has
 * moved.
 *
 * Deliberately narrow: never inside a code block, and never where either line
 * begins something markdown treats as a block of its own. A real paragraph
 * break is a blank line and is left alone, so genuinely running two paragraphs
 * together still shows up as a difference.
 */
export function softWrap(text) {
  // A bullet needs the space after it: "* item" is a list, "**Formula**" is not.
  const BLOCK_START = /^\s*(?:[|>]|#{1,6}\s|[-*+]\s|\d+\.\s|:::|```|<|!\[)/;
  const out = [];
  let inFence = false;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) inFence = !inFence;
    const next = lines[i + 1];
    const joinable =
      !inFence &&
      line.trim() !== '' &&
      next !== undefined &&
      next.trim() !== '' &&
      !BLOCK_START.test(line) &&
      !BLOCK_START.test(next);
    if (joinable) {
      lines[i + 1] = `${line} ${next.replace(/^\s+/, '')}`;
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/**
 * Blank lines that make no difference to the page.
 *
 * Markdown starts a list or a code block whether or not a blank line comes
 * first, so `text:\n- item` and `text:\n\n- item` render identically. The
 * pages were written by hand and are inconsistent about it; the converter is
 * consistent. Levelling both sides keeps the comparison about content.
 *
 * Only blank lines immediately before a list item or a fence are removed —
 * never one between two paragraphs, which would run them together.
 */
function blankBeforeBlocks(text) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const next = lines[i + 1];
    const prev = out.length ? out[out.length - 1].trim() : null;
    const blank = lines[i].trim() === '';
    const beforeBlock = next !== undefined && /^\s*(?:[-*+]\s|\d+\.\s|```|:::|<)/.test(next);
    // A closing fence is a bare ```; an opening one carries a language.
    const afterFence = prev === '```' && next !== undefined && next.trim() !== '';
    const drop = blank && prev !== null && prev !== '' && (beforeBlock || afterFence);
    if (!drop) out.push(lines[i]);
  }
  return out.join('\n');
}

/**
 * The ApiTable rows on the site quote their strings with whichever quote the
 * author happened to type — 92 single, 3 double, with nothing to distinguish
 * them. The converter always uses single. Same rendered table either way.
 */
const apiTableQuotes = (text) =>
  text.replace(/^(\s*\{member:.*)$/gm, (line) => line.replace(/"/g, "'"));

/**
 * core.autocrlf is on in this repo, so what sits on disk has \r\n while what
 * git stores has \n. Without this every file reads as changed.
 */
export const normalise = (s) =>
  apiTableQuotes(
    blankBeforeBlocks(softWrap(String(s).replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '\n'))),
  );

export const isText = (p) => p.endsWith('.md') || p.endsWith('.json');
