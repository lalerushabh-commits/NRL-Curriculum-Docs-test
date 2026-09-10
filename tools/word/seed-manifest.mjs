/**
 * One-shot: build source/manifest.json from the site as it stands today.
 *
 * Run this once, check the result, commit it. After that the converter
 * maintains it. Re-running it rebuilds the index from docs/, which is only
 * correct while docs/ is still the master — i.e. before the first publish.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, DOCS, allDocs, c} from '../lib.mjs';
import {seedFromDocs, saveManifest, splitDoc, sha1, MANIFEST_PATH} from './manifest.mjs';

const manifest = seedFromDocs();

// ---- code fence languages, keyed by the hash of the block's own text --------
// The docx says nothing about a code block's language. Recording today's
// answers means the first conversion reproduces them exactly instead of
// guessing; anything new falls back to the heuristic in grammar.mjs.
let fences = 0;
for (const file of allDocs()) {
  const doc = splitDoc(fs.readFileSync(file, 'utf8'));
  if (!doc) continue;
  for (const m of doc.body.matchAll(/^```([a-zA-Z0-9]*)\n([\s\S]*?)^```/gm)) {
    manifest.codeFenceLanguage[sha1(m[2].trimEnd())] = m[1] || 'text';
    fences++;
  }
}

// ---- pictures Word cannot round-trip ---------------------------------------
// Word flattens an animated GIF to its first frame, so the frame it embedded
// will never match the .gif on disk by content. Without a pin here the
// converter would helpfully replace two working animations with stills.
const stills = {
  a77c059fd38422c3f18e19bc9fa01932834270c2: '/img/curriculum/ch06-command-hub-pairing-demo.gif',
  d5f8954cced0ac81d2e45ce470f2ddf4840fc047: '/img/curriculum/ch06-pairing-demo.gif',
};
for (const [hash, target] of Object.entries(stills)) {
  const onDisk = path.join(ROOT, 'static', target.replace(/^\//, ''));
  if (!fs.existsSync(onDisk)) {
    console.log(c.yellow(`  ! pinned picture not found, skipping: ${target}`));
    continue;
  }
  manifest.imagePins[hash] = {
    path: target,
    // Exporting the site added this apology to the caption because the
    // animation had become a still. The animation is back, so it goes.
    stripFromCaption: '(representative frame from an animated demo)',
    reason: 'Word flattened this animated GIF to a still frame. Keep the GIF; ignore the still.',
  };
}

saveManifest(manifest);

const phases = manifest.curricula.reduce((n, cur) => n + cur.phases.length, 0);
console.log('');
console.log(c.green('Site index written.'), c.dim(path.relative(ROOT, MANIFEST_PATH)));
console.log(`  ${manifest.curricula.length} curricula, ${phases} phases, ${manifest.modules.length} modules`);
console.log(`  ${fences} code blocks, ${Object.keys(manifest.imagePins).length} pinned pictures`);
console.log('');
for (const cur of manifest.curricula) {
  for (const ph of cur.phases) {
    const legacy = ph.filePrefix === 'legacy' ? c.yellow(`  (legacy file numbers, next ${ph.nextFilePrefix})`) : '';
    console.log(`  ${cur.folder}/${ph.folder}${legacy}`);
  }
}
