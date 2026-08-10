#!/usr/bin/env node
/**
 * Activate the tracked git hooks by pointing core.hooksPath at .githooks/.
 *
 * Run automatically by the npm "prepare" lifecycle (i.e. on `npm install`), so a
 * fresh clone — the starter OR a client site derived from it — gets the
 * pre-push guard (.githooks/pre-push) with no manual step. `.git/hooks` is not
 * cloned and core.hooksPath is local config, so this is the reliable way to make
 * a tracked hook active everywhere.
 *
 * No-op (exit 0) outside a git work tree — e.g. a CI install from a tarball, or
 * `npm install` inside a Docker build context with no .git — so it never fails a
 * legitimate install.
 */
import { execSync } from 'node:child_process';

function git(args) {
  return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}

try {
  if (git('rev-parse --is-inside-work-tree') !== 'true') process.exit(0);
} catch {
  process.exit(0); // not a git checkout — nothing to wire
}

try {
  const current = (() => { try { return git('config --get core.hooksPath'); } catch { return ''; } })();
  if (current === '.githooks') {
    console.log('[setup-hooks] pre-push guard already active (core.hooksPath=.githooks)');
  } else {
    execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
    console.log('[setup-hooks] core.hooksPath -> .githooks  (pre-push guard active)');
  }
} catch (e) {
  // Never fail the install over hook wiring; just make the miss visible.
  console.warn('[setup-hooks] could not set core.hooksPath:', e.message);
}
