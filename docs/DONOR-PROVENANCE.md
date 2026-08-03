# Donor provenance — which commit each carve came from

> **Why this file exists.** Phase 1 and the first donor audit were both performed
> against local checkouts that were **behind their remotes**, and nothing in the
> process would have revealed it. A carve is a snapshot of a moving repo; without
> a recorded source commit, "we copied this from Beach" is not a checkable claim
> and drift is invisible. Every future carve records its SHA here **before** the
> work, and re-verifies against the remote.

---

## The rule

Before reading or copying anything from a donor repo:

```bash
git -C <donor> fetch origin
git -C <donor> status -sb        # is the checkout on the branch you think?
git -C <donor> rev-list --count HEAD..origin/main   # MUST be 0
```

A non-zero count means the working tree is stale. **Read from `origin/main`
(`git show origin/main:<path>`) or pull first — never from the working tree.**
Then record the SHA in the table below.

This is not bureaucracy. It is the only mechanism that makes a carve
reproducible, and both failures below were silent: stale files read exactly like
current ones.

---

## What actually went wrong

### `anderson-concrete-pros` — 76 commits behind

The local checkout sat at `360320b` (PR #46) while `origin/main` was at `5935d16`
(PR #77). Everything read from it described a superseded architecture.

**Wrong conclusions drawn, and corrected:**

| Claim made from the stale tree | Reality on `origin/main` |
|---|---|
| "Concrete POSTs client-side straight to the GHL webhook" | False. `worker.js` (added `466b2b8`) proxies `/lead` server-side. |
| "The webhook URL is hardcoded in shipped JS / visible in view-source" | False. `contact-form.js:45` is `LEAD_ENDPOINT = '/lead'`. |
| "Its spam guards are client-side and bypassable" | False. Mirrored in `validateLead()` and authoritative there. |
| "Take concrete's payload but Beach's transport" | Backwards. Concrete's transport is the better one; take the whole stack. |

Corrected in `docs/SETUP.md` §7.1. **Nothing was copied** from concrete except
`scripts/optimize.py`, which is byte-identical between `360320b` and
`origin/main` — verified, so that copy is unaffected.

### `beach-family-automotive` — 10 commits behind at carve time

Phase 1 copied from `b9f2c70`; the repo is now at `74637d8`. Seven copied files
changed in between, and **two Engine components did not exist yet**.

| File | Drift |
|---|---|
| `src/components/InquiryForm.astro` | **Did not exist at `b9f2c70`.** Added in `cf55a10`. |
| `src/components/ServiceForm.astro` | **Did not exist at `b9f2c70`.** Added in `ce07f40`. |
| `functions/api/pre-qualify.js` | 50 lines changed (multi-intent lead pipeline) |
| `src/components/PreQualForm.astro` | 12 lines changed |
| `src/pages/used-cars/[slug].astro` | 20 lines changed |
| `src/pages/auto-repair/index.astro`, `[service].astro` | 10 lines each |

**The retraction that matters:** Phase 1's PR and the Beach handoff brief both
stated that charter §3 named `InquiryForm.astro` and `ServiceForm.astro` but that
"they do not exist in Beach." **They exist.** The charter was right; the carve
was reading a checkout from before they landed. Both are now copied in.

**Re-verified and still standing** (present on current `origin/main`, so these
findings were not artifacts of staleness):

- `functions/api/pre-qualify.js:64` still honeypots on `company` — the field name
  password managers auto-fill, silently dropping real leads.
- Consent is still `consent: form.get('consent') != null` — a bare boolean, with
  no verbiage, URL, or user-agent record.
- `scripts/optimize.py` still hardcodes the client name into generated `alt`
  text, and its docstring still quotes constants the code no longer uses.

---

## Provenance table

| Carved into | From donor | Source commit | Verified against remote | Notes |
|---|---|---|---|---|
| Phase 1 engine skeleton (~40 files) | `beach-family-automotive` | `b9f2c70` | ❌ not checked at the time | 10 commits stale; 7 files + 2 missing components |
| `scripts/optimize.py` | `anderson-concrete-pros` | `360320b` | ❌ not checked at the time | byte-identical to `origin/main` — unaffected |
| `InquiryForm.astro`, `ServiceForm.astro` | `beach-family-automotive` | `74637d8` | ✅ `HEAD..origin/main` = 0 | Phase 2b re-sync |

---

## Deliberately NOT re-synced, and why

Not every stale file is worth updating — some are already slated for replacement,
and re-copying them would regress work already done on top.

| File | Decision |
|---|---|
| `functions/api/pre-qualify.js` | **Do not re-sync.** Being replaced wholesale by concrete's `/lead` Worker (`docs/SETUP.md` §7.1). Syncing Beach's newer version is throwaway work. |
| `src/components/PreQualForm.astro` | **Do not blind-copy.** This repo's copy has since been fixed to read `NAP` from config; a straight overwrite would reintroduce the hardcoded phone. Reconcile by hand during the lead-stack carve. |
| `src/lib/site.js` | **Do not re-sync.** Rewritten in Phase 2a as a config adapter; it no longer resembles the donor file. |
| The four example pages | **Do not re-sync.** All four are neutralization targets; taking newer donor copy only means neutralizing newer donor copy. |

---

## Standing guard

- Any session carving from a donor **fetches first, verifies zero commits
  behind, and records the SHA here.** Reading `git show origin/main:<path>` is
  the safe default when in doubt.
- Any *finding* about a donor is re-verified against `origin/main` before it is
  acted on — including findings that arrive in a report from another session.
  The concrete audit report was correct precisely because it read a current tree;
  the earlier conclusions were wrong for the opposite reason.
- `core30-lint` should eventually assert this file lists a SHA for every carved
  path, so an undocumented carve fails the build.
