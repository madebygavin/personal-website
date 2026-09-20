# Instructions for Claude Code in this repo

## Read these first, in this order

1. **`PROGRESS.md`** — current status: what's done, in progress, next, blockers, deviations, open decisions. This is the live log; always check it before doing anything else.
2. **`PROJECT_BRIEF.md`** — the full spec. Sections 2 (Locked Decisions) and 13 (Out of Scope) are binding. Do not deviate without asking Gavin.

## Working rules

- Work milestone by milestone (`PROJECT_BRIEF.md` section 12). Don't start the next milestone until the current one is verified: `npm run lint`, `npm run test`, `npm run build`, **and**, for anything with a visual or behavioral acceptance criterion, an actual check in a running browser — not just green CI.
- Before ending a session (or after finishing a milestone, whichever comes first), update `PROGRESS.md`: move items between status buckets, add a dated log entry describing what shipped, log any new deviation or blocker.
- Only mark a milestone ✅ Done in `PROGRESS.md` once it's been checked against its real acceptance criteria in a browser. If this session's environment can't do that (e.g. no browser automation tool available), leave it at 🟡 and say so explicitly — don't silently skip it or assume it's fine.
- If you deviate from a locked decision (e.g. a dependency version conflict forces a downgrade), log it in `PROGRESS.md` section 5 with the reason and a condition for revisiting it, and say so to Gavin directly — don't bury it in a code comment only.
- All user-facing strings live in `src/data/content.ts` (the `Localized<T>` i18n layer). No hardcoded English or Vietnamese text inside components.
- Never use Apple assets, names, or artwork (see `PROJECT_BRIEF.md` section 5).
