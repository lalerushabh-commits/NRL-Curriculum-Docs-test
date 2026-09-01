/** Shared terminal questions, so every authoring task asks in the same style. */
import readline from 'node:readline';
import {stdin as input, stdout as output} from 'node:process';
import {c} from './lib.mjs';

const rl = readline.createInterface({input, output});

// Lines are queued as they arrive rather than requested one at a time: when input
// is piped instead of typed, several lines can land before the next question is asked.
const queued = [];
const waiting = [];
rl.on('line', (line) => (waiting.length ? waiting.shift()(line) : queued.push(line)));
rl.on('close', () => waiting.forEach((resolve) => resolve(null)));

export async function ask(q) {
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
export async function choose(label, items, render) {
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

/** Ask for a title, refusing something too short to be one. */
export async function askTitle(what, fallback = '') {
  for (;;) {
    const t = await ask(`\n${what}: `);
    if (!t && fallback) return fallback;
    if (t.length >= 3) return t;
    console.log(c.red('  Please type a real title.'));
  }
}

export const closePrompt = () => rl.close();
