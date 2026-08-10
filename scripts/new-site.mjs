#!/usr/bin/env node
/**
 * Bootstrap a NEW client site from a fresh core30-starter clone — and make it
 * impossible to push client work back onto the engine.
 *
 * WHY THIS EXISTS. Cloning the starter leaves `origin` pointing at
 * core30-starter. If you then build a client site and `git push`, you push onto
 * the ENGINE. (That is not hypothetical — it happened, which is why this script
 * and the pre-push hook exist.) This reconfigures the clone so:
 *   · origin   = YOUR client repo   (where your work goes)
 *   · upstream = core30-starter     (fetch-only; pushing to it is disabled)
 *   · main tracks origin            (so `git push` targets the client repo)
 *   · the pre-push guard is active  (blocks any push to core30-starter)
 *
 * USAGE (run inside a freshly-cloned starter directory):
 *   git clone https://github.com/KMPartners/core30-starter.git my-client
 *   cd my-client
 *   npm install                         # activates the pre-push hook
 *   node scripts/new-site.mjs <your-client-repo-git-url>
 *
 * Then create the client repo on GitHub first, and: git push -u origin main
 */
import { execSync } from 'node:child_process';

const clientUrl = process.argv[2];
const DISABLED_PUSH = 'DISABLED-push-to-origin-not-to-core30-starter';

function git(args, opts = {}) {
  return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString().trim();
}
function tryGit(args) { try { return git(args); } catch { return ''; } }
function die(msg) { console.error(`\n\x1b[31m[new-site]\x1b[0m ${msg}\n`); process.exit(1); }
function ok(msg) { console.log(`\x1b[32m[new-site]\x1b[0m ${msg}`); }

if (!clientUrl) {
  die('usage: node scripts/new-site.mjs <your-client-repo-git-url>\n' +
      '  (run inside a fresh `git clone` of core30-starter)');
}
if (tryGit('rev-parse --is-inside-work-tree') !== 'true') {
  die('not a git checkout. Clone core30-starter first, then run this inside it.');
}

const originUrl = tryGit('config --get remote.origin.url');
if (!/core30-starter/.test(originUrl)) {
  die(`this does not look like a fresh core30-starter clone.\n` +
      `  origin is: ${originUrl || '<unset>'}\n` +
      `  Expected origin to point at core30-starter. Aborting so nothing is clobbered.`);
}
if (/core30-starter/.test(clientUrl)) {
  die('the client URL must be your NEW repo, not core30-starter itself.');
}

// 1) engine becomes `upstream` (fetch source), with pushing disabled.
if (tryGit('config --get remote.upstream.url')) {
  git('remote remove upstream');
}
git(`remote rename origin upstream`);
git(`remote set-url --push upstream "${DISABLED_PUSH}"`);
ok('core30-starter is now `upstream` (fetch-only; push disabled)');

// 2) YOUR client repo becomes `origin`, and main tracks it.
git(`remote add origin "${clientUrl}"`);
git('config branch.main.remote origin');
git('config branch.main.merge refs/heads/main');
ok(`origin -> ${clientUrl}`);
ok('main now tracks origin (git push goes to YOUR repo)');

// 3) make sure the pre-push guard is active in this clone.
try { execSync('git config core.hooksPath .githooks', { stdio: 'ignore' }); ok('pre-push guard active (core.hooksPath=.githooks)'); }
catch { /* prepare/setup-hooks will have handled it */ }

console.log(`\n\x1b[32m[new-site] remotes configured:\x1b[0m`);
console.log(execSync('git remote -v').toString());
console.log('Next:');
console.log('  1) create the client repo on GitHub (the URL you just passed)');
console.log('  2) git push -u origin main');
console.log('  3) fill site.config.json + brand tokens + the content tree (see docs/NEW-PROJECT-WORKFLOW.md)');
console.log('  Pull future engine updates with:  git fetch upstream && git merge upstream/main\n');
