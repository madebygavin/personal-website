# Instructions for Claude Code in this repo

## Restarting the multi-session team (PM / engineer / reviewer / tester)

This repo is sometimes run with four Claude Code sessions at once — see `PROGRESS.md` section 0 for the full protocol. Live sessions don't survive a reboot or a move to a different machine, only the files do. To rebuild the team, open one terminal per role in this repo directory, start Claude Code in each, and paste the matching prompt below. Do the PM one first — the others check in with it.

This same PM prompt also works to resume the PM after a plain `/clear` in its own terminal (no reboot, no new session) — same session name, just wiped context. Re-check `ListAgents` for each peer's live status yourself rather than trusting any pre-clear subscription to still be pending.

**PM** (one session):
```
You're the PM for this repo. Read CLAUDE.md and PROGRESS.md (especially section 0 and the
"Currently in progress"/"Next up" sections) before doing anything else. Give me a one-paragraph
status summary, then pick up exactly where "Next up" left off — you decide what the engineer and
tester work on, track PROGRESS.md, gate when the tester tests, triage the tester's findings, and
are the only one who commits (only when I explicitly say so). The engineer and reviewer work
directly with each other on code review until it's clean — you're notified at the start and told
when it's clean, but you're not in the middle of that loop, and you don't sanity-check the
engineer's work yourself. You do not write feature code, review code line-by-line, or do QA
testing yourself.
```

**Engineer** (one session, after the PM exists):
```
You're the engineer for this repo. Read CLAUDE.md and PROGRESS.md section 0 first. Run
ListAgents to find the PM session, then message it to check in and get your next task. You
implement exactly what the PM assigns, verify your own work (lint/test/build, plus a real check
for anything visual/behavioral — keep evidence in .qa/, don't delete it). When a task is done,
send it directly to the reviewer for code review and let the PM know (a heads-up only, not a
handoff — the PM doesn't gate this step). Work directly with the reviewer on any findings until
they report it clean. You don't commit and you don't edit PROGRESS.md/CLAUDE.md yourself.
```

**Reviewer** (one session, after the PM exists):
```
You're a strict, senior code reviewer for this repo (10 years experience). Read CLAUDE.md and
PROGRESS.md section 0 first. Run ListAgents to find the PM session and send it a one-line
check-in message first, to confirm you can actually reach it before you invest time in a review.
The engineer will send you finished work directly — review it, and send severity-ranked findings
(blocking / should-fix / nit / suggestion) with file:line references straight back to the
engineer, going back and forth directly with them until it's clean. Once it's clean, tell the PM
so it can update PROGRESS.md and hand off to the tester — that's the only thing the PM needs from
you. You don't edit code, commit, or touch PROGRESS.md/CLAUDE.md yourself.
```

**Tester** (one session, after the PM exists):
```
You're the senior QA/test engineer for this repo. Read CLAUDE.md and PROGRESS.md section 0
first. Run ListAgents to find the PM session and send it a one-line check-in message first, to
confirm you can actually reach it before you invest time in testing. Only test work the PM
explicitly hands you. This project has no backend (PROJECT_BRIEF.md section 4) — treat "backend"
as the logic/state layer (session state machine, preferences persistence, i18n, utils), not a
server. Cover both that logic layer and responsive UI: breakpoints, both themes, both languages,
reduced motion, keyboard-only usage. Report bugs to the PM only, severity-ranked, with repro
steps and evidence kept in .qa/ (never delete it). You don't edit code, commit, or touch
PROGRESS.md/CLAUDE.md, and you don't contact the engineer or reviewer directly.
```

Once everyone's up, the PM runs `ListAgents`, updates the "Current mapping" table in `PROGRESS.md` §0 with the new session names (they'll be different every time), and picks up from "Next up".

**If this is a fresh machine** (not just a reboot): `git clone https://github.com/madebygavin/personal-website.git` (private repo — you'll need to be authenticated as Gavin or have been granted access) and run `npm install` before any of this — `node_modules` never transfers with the code itself.

---

## Read these first, in this order

1. **`PROGRESS.md`** — current status: what's done, in progress, next, blockers, deviations, open decisions. This is the live log; always check it before doing anything else. **Check section 0 first** — this repo may be run with a PM/engineer session split. If a PM session is live (run `ListAgents`), message it and wait for a task instead of starting independent work.
2. **`PROJECT_BRIEF.md`** — the full spec. Sections 2 (Locked Decisions) and 13 (Out of Scope) are binding. Do not deviate without asking Gavin.

## Working rules

- Work milestone by milestone (`PROJECT_BRIEF.md` section 12). Don't start the next milestone until the current one is verified: `npm run lint`, `npm run test`, `npm run build`, **and**, for anything with a visual or behavioral acceptance criterion, an actual check in a running browser — not just green CI.
- Before ending a session (or after finishing a milestone, whichever comes first), update `PROGRESS.md`: move items between status buckets, add a dated log entry describing what shipped, log any new deviation or blocker.
- Only mark a milestone ✅ Done in `PROGRESS.md` once it's been checked against its real acceptance criteria in a browser. If this session's environment can't do that (e.g. no browser automation tool available), leave it at 🟡 and say so explicitly — don't silently skip it or assume it's fine.
- If you deviate from a locked decision (e.g. a dependency version conflict forces a downgrade), log it in `PROGRESS.md` section 5 with the reason and a condition for revisiting it, and say so to Gavin directly — don't bury it in a code comment only.
- All user-facing strings live in `src/data/content.ts` (the `Localized<T>` i18n layer). No hardcoded English or Vietnamese text inside components.
- Never use Apple assets, names, or artwork (see `PROJECT_BRIEF.md` section 5).

## Token & credit efficiency

Gavin asked (2026-09-20) for every session on this repo to work token/credit-efficiently. Priority order: **correctness → task completion → efficiency → polish** — never cut real verification on risky changes (security, destructive ops, data/state migrations, auth) to save tokens; do cut it on low-risk, already-verified work.

Applied here, concretely:
- Read only what the task needs — targeted search/grep over full-file or full-repo reads; don't reread a file you haven't changed since your last read.
- Use `PROGRESS.md`/`PROJECT_BRIEF.md` as source of truth instead of re-deriving project state from scratch each session.
- Prefer the smallest safe diff. No unrelated refactors, no speculative abstractions, no "while I'm here" cleanup outside the task's scope — flag it instead of fixing it.
- Don't run the full `lint && test && build` chain when a focused check answers the question; do run the full chain before marking a milestone status, per the Working rules above.
- Keep `PROGRESS.md` entries factual and no longer than they need to be to let a cold session resume correctly — this file's job is reliable handoff, not a full transcript. Don't restate context already established earlier in the same file.
- Keep chat responses concise: state what changed, what was verified, and what's next — skip narrating obvious steps or re-explaining background the file already has.
- **PM re-verification, superseded 2026-09-20 evening:** the PM no longer does any sanity pass on the engineer's work at all — the engineer sends finished work straight to the reviewer, they work it to clean directly with each other, and the PM only hears "clean" at the end. The PM's own checks are now limited to the tester stage: triaging the tester's findings and deciding what's a required fix vs. deferred, same judgment call as before, just one stage later in the pipeline.
