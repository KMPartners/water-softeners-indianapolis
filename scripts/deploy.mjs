#!/usr/bin/env node
/**
 * Cross-platform Cloudflare Pages deploy wrapper.
 *
 * The deploy:* npm scripts used to pass `--project-name=$CF_PAGES_PROJECT`
 * directly to wrangler. That is bash syntax: on Windows, npm's default script
 * shell is cmd, which does NOT expand `$CF_PAGES_PROJECT`, so the deploy
 * silently targets a Cloudflare project literally named "$CF_PAGES_PROJECT".
 * Reading the project name from the environment in Node is portable, so this
 * wrapper works the same on Windows, macOS, and Linux / CI.
 *
 * The build steps (config:gen, astro build, stamp, lint) stay in package.json —
 * they are already cross-platform; only the env-var expansion was not.
 *
 * Usage: node scripts/deploy.mjs <staging|prod>
 * Requires CF_PAGES_PROJECT in the environment (or .env — package.json loads it
 * via --env-file-if-exists). See .env.example.
 */
import { spawnSync } from 'node:child_process';

const target = process.argv[2];
if (target !== 'staging' && target !== 'prod') {
  console.error('[deploy] usage: node scripts/deploy.mjs <staging|prod>');
  process.exit(1);
}

const project = String(process.env.CF_PAGES_PROJECT || '').trim();
if (!project) {
  console.error(
    '[deploy] CF_PAGES_PROJECT is not set. It is the Cloudflare Pages project ' +
      'name (client config — see .env.example). Set it in your shell environment ' +
      'or in .env, then re-run.',
  );
  process.exit(1);
}

// prod deploys the production branch (main); staging deploys the staging branch.
const branch = target === 'prod' ? 'main' : 'staging';
const args = [
  'wrangler', 'pages', 'deploy', 'dist',
  `--project-name=${project}`,
  `--branch=${branch}`,
  '--commit-dirty=true',
];

console.log(`[deploy] npx ${args.join(' ')}`);
// shell:true so `npx`/`npx.cmd` resolves on every platform.
const res = spawnSync('npx', args, { stdio: 'inherit', shell: true });
process.exit(res.status == null ? 1 : res.status);
