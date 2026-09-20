# Progress Tracker

**Last updated:** 2026-09-20 by Claude (Sonnet 5), this session
**Read this file first**, before `PROJECT_BRIEF.md`, at the start of any session. `PROJECT_BRIEF.md` is the spec (binding, changes rarely). This file is the log (changes every session) — it tells you where things actually stand right now, including things the brief can't know: what's verified, what's deviated, what's blocked.

Status legend: ✅ Done (verified incl. visual QA) · 🟡 Code complete, **not** visually verified · 🔵 In progress · ⬜ Not started · 🔴 Blocked

---

## 1. Status at a glance

| # | Milestone | Status | Lint | Test | Build | Visual QA |
|---|---|---|---|---|---|---|
| M0 | Scaffold | ✅ Done | ✅ | ✅ (0 tests, pass) | ✅ | n/a (blank page) |
| M1 | Landing & login screen | 🟡 Code complete | ✅ | ✅ | ✅ | ❌ not done |
| M2 | Boot & zoom transition | 🟡 Code complete | ✅ | ✅ | ✅ | ❌ not done |
| M3 | Desktop shell | ⬜ Not started | — | — | — | — |
| M4 | Window system & apps | ⬜ Not started | — | — | — | — |
| M5 | Mobile | ⬜ Not started | — | — | — | — |
| M6 | Polish, a11y, perf | ⬜ Not started | — | — | — | — |
| M7 | Deployment | ⬜ Not started | — | — | — | — |

**Nothing gets marked ✅ Done based on lint/test/build alone if the milestone's acceptance criteria (PROJECT_BRIEF.md section 12) are visual or behavioral.** M1 and M2 are withheld at 🟡 for exactly this reason — see Blocker #1.

---

## 2. Currently in progress

Nothing actively in progress. Awaiting either (a) Gavin's visual sign-off on M1/M2, or (b) go-ahead to start M3.

## 3. Next up

**M3 — Desktop shell**: animated wallpaper, menu bar (logo menu + Control Center dropdown), About dialog, dock with hover magnification + open-app indicator. See PROJECT_BRIEF.md section 7.4–7.6 and 12.

---

## 4. Blockers / risks

1. **🔴 No browser automation available in this sandbox.** No `chromium-cli`, no Playwright install, no claude-in-chrome MCP connection. This session could not screenshot or click through the app — all M1/M2 verification is lint+test+build only. **Action needed from Gavin:** run `npm run dev` and check the login screen (1280/1440/1920 + tablet width) and the full Login→boot→zoom→Restart→Log Out flow, then tell the next session "M1 confirmed" / "M2 confirmed" (or what's wrong) so it can flip the status table above to ✅. If a future session *does* have a working browser tool, it should self-verify and update this file instead of asking.
2. **Uncommitted work.** As of this update, `M1` and `M2` work (see git status below) is only in the working tree — not committed. If you want a checkpoint to fall back to, say so; commits are made only when explicitly requested (repo convention).

---

## 5. Deviations from PROJECT_BRIEF.md (need Gavin's sign-off)

PROJECT_BRIEF.md section 0.1 says not to swap libraries/versions without asking. This one was a hard blocker, not a preference, but it's still a deviation and needs your eyes:

1. **TypeScript pinned to `^5.9.3`, not `^7.0.2`.** `typescript@7.0.2` is genuinely `latest` on npm as of 2026-09-20 (it's the new native/Go-based compiler), but `typescript-eslint@8.70.0` (also latest) still declares a peer dependency of `typescript >=4.8.4 <6.1.0` — installing with TS7 fails with an unresolvable ERESOLVE conflict. No newer `typescript-eslint` major supports TS7 yet (checked npm dist-tags directly). Downgraded to the latest 5.x line so the toolchain installs and lints at all.
   - **Revisit when:** `typescript-eslint` ships a version whose peer range includes `^7`. Worth a quick `npm view typescript-eslint peerDependencies` check before each future session touches `package.json`.

No other deviations from section 2 (Locked Decisions) or section 13 (Out of Scope) have been made.

---

## 6. Veto-able assumptions applied so far

From PROJECT_BRIEF.md section 3 — Gavin should confirm or override these at review. Only listing ones actually implemented so far; #1, #2, #7, #10, #12 aren't built yet (they belong to M3/M5).

| # | Gap | Applied as | Milestone |
|---|---|---|---|
| 3 | Keyboard/mouse decorative vs interactive | Fully decorative (`aria-hidden`); Enter key triggers login via a `window` keydown listener; Login button is a real `<button>`, also clickable via the avatar button | M1 |

---

## 7. Open items for Gavin (non-blocking, from brief section 16 + new)

1. Confirm veto-able defaults not yet built: #1 (active app name label), #2 (dimmed traffic lights), #7 (light mode look), #10 (default language detection), #12 (mobile flow) — these land in M3/M5.
2. Provide real content: bio, skills, experience, projects, contact links (currently all `TODO(gavin)` placeholders in `src/data/content.ts`).
3. Choose the final logo (currently `faLemon` placeholder in `src/config/brand.ts`).
4. Decide domain / custom domain for Cloudflare Workers.
5. Visually confirm M1 and M2 (see Blocker #1).
6. Optional later: real avatar photo, resume link, project screenshots.

---

## 8. Milestone log (detailed, append-only — newest first)

### M2 — Boot & zoom transition — 🟡 Code complete, pending visual QA (2026-09-20)
**What shipped:**
- `src/utils/zoom.ts` (+ test) — pure FLIP-style transform math (origin/translate/scale to grow the hardware's screen rect to fill the viewport).
- `src/hooks/useReducedMotion.ts` — wraps `motion/react`'s built-in hook.
- `src/components/boot/BootScreen.tsx` — logo + progress bar, non-linear timing (fast → pause near 70% → quick finish), 2.75s / 1.5s reduced-motion, not skippable.
- `src/components/desktop/Desktop.tsx` — **temporary stub** (Restart/Log Out buttons only, no styling per spec yet) to exercise the flows; M3 replaces its guts.
- `Hardware.tsx` refactored: assembly wrapper is now `motion.div`, accepts `ref`/`animate`/`transition` from the caller.
- `App.tsx`: full phase orchestration. Hardware stays mounted continuously through landing→booting→zooming-in (so the measured DOM node never remounts mid-measurement), swaps to bare `<Desktop/>` the instant zoom finishes (last frame is pixel-identical, so no flash), reverses symmetrically for logout using a cached transform. Restart shows an `AnimatePresence`-faded black overlay over the still-mounted desktop, no zoom. Reduced motion replaces the geometric zoom with an opacity crossfade both directions.
- Bug caught and fixed during this session's own review: the restart overlay's exit fade wasn't playing because `AnimatePresence` was being unmounted (not just its child) when boot completed — fixed by keeping `AnimatePresence` mounted across both `desktop` and `booting-while-restarting`.
**Verified:** lint clean, 14/14 tests pass, build succeeds. **Not verified:** actual click-through in a browser (Blocker #1).

### M1 — Landing & login screen — 🟡 Code complete, pending visual QA (2026-09-20)
**What shipped:**
- `src/data/content.ts` — `Localized<T>` type, placeholder `profile`, `uiStrings`.
- `src/utils/{language,timezone,format}.ts` (+ tests) — language detection, timezone→city, locale-aware clock/date formatting.
- `src/state/preferences.tsx` — theme/lang/brightness context, localStorage-persisted (try/catch wrapped).
- `src/state/session.tsx` — full session reducer (all 5 phases + restart flag), built ahead of need so M2 didn't require rework.
- `src/hooks/{useClock,useLang}.ts`.
- `src/components/landing/{Hardware,LoginScreen}.tsx` — original CSS-only hardware illustration (percentage/aspect-ratio sized so it scales as one unit on tablets), decorative parts `aria-hidden`; login screen with avatar, name/title, live clock+date, timezone city, Login button, Enter-key access.
**Verified:** lint clean, 12/12 tests pass, build succeeds. **Not verified:** actual rendering at 1280/1440/1920/tablet widths (Blocker #1).

### M0 — Scaffold — ✅ Done (pre-existing, committed `15e3c68`)
Vite + React + TS + Tailwind v4 + Motion + FontAwesome + Inter + ESLint/Prettier + Vitest + `wrangler.jsonc`. Verified in this session: `npm install` initially failed (see Deviations #1), fixed, then lint/test/build all confirmed passing from a clean install.

---

## 9. How to keep this file honest (for future sessions/agents)

- Update the status table and add a dated log entry **every time** you finish a chunk of work, not just at milestone boundaries.
- If you can verify something a prior session couldn't (e.g. you have a working browser tool), do it and flip the status — don't just trust this file's "not verified" forever.
- If you deviate from `PROJECT_BRIEF.md` sections 2 or 13, log it under section 5 immediately, with a reason and a revisit condition, before writing more code.
- Keep section 7 (open items for Gavin) in sync with brief section 16 as new non-blocking questions come up.
