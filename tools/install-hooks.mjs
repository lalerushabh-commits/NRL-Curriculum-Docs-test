/**
 * Installs a git "pre-push" hook that refuses to publish a broken site.
 *
 * Pushes to this repo deploy straight to the live site, so this is the last
 * line of defence if somebody forgets to run "Check before publishing".
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT, c} from './lib.mjs';

const HOOK = `#!/bin/sh
# Installed by tools/install-hooks.mjs — refuses to push if the site does not build.
echo ""
echo "Checking the site before publishing..."
if ! node "$(git rev-parse --show-toplevel)/tools/check.mjs"; then
  echo ""
  echo "Nothing was published. Fix the problems listed above and push again."
  exit 1
fi
`;

export function installHooks({quiet = false} = {}) {
  const dir = path.join(ROOT, '.git', 'hooks');
  if (!fs.existsSync(dir)) return; // not a git checkout (e.g. a downloaded zip)
  const file = path.join(dir, 'pre-push');
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === HOOK) return;
  fs.writeFileSync(file, HOOK, {encoding: 'utf8', mode: 0o755});
  if (!quiet) console.log(c.green('Safety check installed: a broken site can no longer be published.'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) installHooks();
