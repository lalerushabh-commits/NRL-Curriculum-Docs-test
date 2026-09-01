/** "Preview the site" — sets up if needed, installs the safety check, then starts the live preview. */
import {spawn} from 'node:child_process';
import {ROOT, ensureDeps, npmCmd, c} from './lib.mjs';
import {installHooks} from './install-hooks.mjs';

if (!ensureDeps()) process.exit(1);
installHooks({quiet: true});

console.log('');
console.log(c.bold('Starting the preview. It opens in your browser in a moment.'));
console.log(c.dim('Leave this running while you work — every time you save a file, the page updates by itself.'));
console.log(c.dim('To stop it, click in this panel and press Ctrl+C.'));
console.log('');

spawn(npmCmd(), ['start'], {cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32'}).on(
  'exit',
  (code) => process.exit(code ?? 0),
);
