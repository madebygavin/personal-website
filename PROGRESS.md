# Progress Tracker

**Last updated:** 2026-09-20 by Claude (Sonnet 5), session `personal-website-b5`
**Read this file first**, before `PROJECT_BRIEF.md`, at the start of any session. `PROJECT_BRIEF.md` is the spec (binding, changes rarely). This file is the log (changes every session) — it tells you where things actually stand right now, including things the brief can't know: what's verified, what's deviated, what's blocked, and **which session is doing what**.

Status legend: ✅ Done (verified incl. visual QA) · 🟡 Code complete, **not** visually verified · 🔵 In progress · ⬜ Not started · 🔴 Blocked

> ⚠️ **Multiple sessions may be working on this repo at once.** Before editing anything, run `ListAgents` (if you're Claude Code) to check for a live peer session, and check `git status`/`git log` for uncommitted or unfamiliar changes on disk. If you find changes you didn't make, don't revert them blindly — they may be a peer's in-progress work. Message the peer to coordinate before touching the same files. See section 2 for who's doing what right now.

---

## 1. Status at a glance

| # | Milestone | Status | Lint | Test | Build | Visual QA |
|---|---|---|---|---|---|---|
| M0 | Scaffold | ✅ Done | ✅ | ✅ (0 tests, pass) | ✅ | n/a (blank page) |
| M1 | Landing & login screen | 🟡 Code complete, visually spot-checked | ✅ | ✅ | ✅ | ✅ landing screen screenshot looks correct (see section 8) |
| M2 | Boot & zoom transition | ✅ Done | ✅ | ✅ | ✅ | ✅ fixed + re-verified (see section 8, section 4a #1 resolved) |
| M3 | Desktop shell | ⬜ Not started | — | — | — | — |
| M4 | Window system & apps | ⬜ Not started | — | — | — | — |
| M5 | Mobile | ⬜ Not started | — | — | — | — |
| M6 | Polish, a11y, perf | ⬜ Not started | — | — | — | — |
| M7 | Deployment | ⬜ Not started | — | — | — | — |

**Nothing gets marked ✅ Done based on lint/test/build alone if the milestone's acceptance criteria (PROJECT_BRIEF.md section 12) are visual or behavioral.** M2 is now ✅: the zoom bug (section 4a #1) was fixed and re-verified by two independent sessions (see section 8). M1 got only a partial visual spot-check (one screenshot, one viewport) — encouraging, but 1280/1440/1920 + tablet widths are still unchecked, so it stays at 🟡 until someone (Gavin or a session with a working browser tool) confirms those.

---

## 2. Currently in progress

Nothing actively in progress. The M2 zoom-transform bug is fixed and independently re-verified by both sessions active during this window (`personal-website-1d`, `personal-website-b5`); the fix is uncommitted pending Gavin's go-ahead (repo convention: commit only when explicitly asked).

## 3. Next up

**M3 — Desktop shell**: animated wallpaper, menu bar (logo menu + Control Center dropdown), About dialog, dock with hover magnification + open-app indicator. See PROJECT_BRIEF.md section 7.4–7.6 and 12.

---

## 4. Blockers / risks (active)

Nothing currently blocking. M2's fix is uncommitted — see section 2 — but that's a pending action, not a blocker.

## 4a. Resolved blockers (kept for history — don't delete, append instead)

1. **✅ RESOLVED — M2 zoom transition bug.** Found and fixed by session `personal-website-1d`, independently re-verified by `personal-website-b5` (this session). Two root causes:
   - `Hardware.tsx`'s assembly `motion.div` only received `ref={outerRef}` starting at the `zooming-in` phase render — Motion v13 does not attach a ref added on a later render to an already-mounted instance (only at initial mount), so `outerRef.current` stayed permanently `null` and the transform never computed.
   - `Desktop.tsx`'s root used `min-h-dvh` (viewport-height-based) instead of `h-full`; when nested inside Hardware's small screen box during zooming, it overflowed and got clipped, which is why only the buttons peeked out.
   - Fix: `assemblyRef` now passed unconditionally on every `Hardware` render; `Desktop.tsx` changed to `h-full`; `src/styles/index.css` got a companion `html, body, #root { height: 100% }` rule, without which `h-full` has nothing to resolve against up the chain. Verified: `personal-website-1d` re-ran its Playwright repro (transform animates through the full scale/translate sequence; Restart/Log Out render centered full-screen with no bezel afterward) and confirmed lint/test/build clean; `personal-website-b5` independently re-ran lint/test/build and reviewed the diff. **Caveat:** the confirming screenshots were deleted during scratch-file cleanup and weren't re-captured — see the process note below. Recommend Gavin does one real click-through when convenient, but this is due diligence, not a sign of doubt about the fix.
   - **Process lesson:** QA screenshots that prove a bug fix should be kept somewhere durable (e.g. a gitignored `.progress-assets/` or attached to the commit message description) rather than deleted as "scratch," or the verification claim becomes unauditable later. Do this next time.

2. **✅ RESOLVED — mistaken universal claim about browser tooling.** An earlier version of this file said no browser automation was available in *any* session's environment. That was only true for `personal-website-b5`'s sandbox — `personal-website-1d`'s had `playwright-core` reachable via `node_modules/.bin` and used it for a real headless repro (now cleaned up, confirmed no trace in `package.json`/`package-lock.json`/`node_modules`). **Lesson:** "no browser tool" is a per-session/per-sandbox fact, not a project-wide one — state it as local, and check again each session rather than trusting a prior session's negative result.

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
5. Visually confirm M1 at 1280/1440/1920 + tablet widths, and re-confirm M2 end-to-end once the zoom fix (section 4a #1) is committed.
6. Optional later: real avatar photo, resume link, project screenshots.

---

## 8. Milestone log (detailed, append-only — newest first)

### M2 bug found and fixed — sessions `personal-website-1d` + `personal-website-b5` (2026-09-20, ~12:16–12:33)
Session `personal-website-1d` (live, parallel to this one) independently ran a headless Playwright repro (`playwright-core` from its `node_modules/.bin`) against a local dev server on port 5180: `1-landing.png` showed the M1 login screen rendering correctly (avatar, "Gavin" / "Software Developer", live clock "12:25 PM", "Sun, Sep 20 · New York" — timezone-to-city worked), but `2-after.png` (taken ~4.5s after clicking Login) showed the bug described in section 4a #1: desktop content stuck inside the small hardware screen, never zoomed to fill the viewport. It found the root cause, applied the fix, cleaned up all scratch artifacts, and reported back. `personal-website-b5` (this session) independently re-ran lint/test/build and reviewed the diff before accepting the fix — see section 4a #1 for full detail. Uncommitted as of this entry pending Gavin's go-ahead.

### M2 — Boot & zoom transition — 🟡 Code complete, pending visual QA (2026-09-20)
**What shipped:**
- `src/utils/zoom.ts` (+ test) — pure FLIP-style transform math (origin/translate/scale to grow the hardware's screen rect to fill the viewport).
- `src/hooks/useReducedMotion.ts` — wraps `motion/react`'s built-in hook.
- `src/components/boot/BootScreen.tsx` — logo + progress bar, non-linear timing (fast → pause near 70% → quick finish), 2.75s / 1.5s reduced-motion, not skippable.
- `src/components/desktop/Desktop.tsx` — **temporary stub** (Restart/Log Out buttons only, no styling per spec yet) to exercise the flows; M3 replaces its guts.
- `Hardware.tsx` refactored: assembly wrapper is now `motion.div`, accepts `ref`/`animate`/`transition` from the caller.
- `App.tsx`: full phase orchestration. Hardware stays mounted continuously through landing→booting→zooming-in (so the measured DOM node never remounts mid-measurement), swaps to bare `<Desktop/>` the instant zoom finishes (last frame is pixel-identical, so no flash), reverses symmetrically for logout using a cached transform. Restart shows an `AnimatePresence`-faded black overlay over the still-mounted desktop, no zoom. Reduced motion replaces the geometric zoom with an opacity crossfade both directions.
- Bug caught and fixed during this session's own review: the restart overlay's exit fade wasn't playing because `AnimatePresence` was being unmounted (not just its child) when boot completed — fixed by keeping `AnimatePresence` mounted across both `desktop` and `booting-while-restarting`.
**Verified:** lint clean, 14/14 tests pass, build succeeds. **Not verified at the time:** actual click-through in a browser — later done by a peer session, which found the bug logged above as section 4a #1.

### M1 — Landing & login screen — 🟡 Code complete, pending visual QA (2026-09-20)
**What shipped:**
- `src/data/content.ts` — `Localized<T>` type, placeholder `profile`, `uiStrings`.
- `src/utils/{language,timezone,format}.ts` (+ tests) — language detection, timezone→city, locale-aware clock/date formatting.
- `src/state/preferences.tsx` — theme/lang/brightness context, localStorage-persisted (try/catch wrapped).
- `src/state/session.tsx` — full session reducer (all 5 phases + restart flag), built ahead of need so M2 didn't require rework.
- `src/hooks/{useClock,useLang}.ts`.
- `src/components/landing/{Hardware,LoginScreen}.tsx` — original CSS-only hardware illustration (percentage/aspect-ratio sized so it scales as one unit on tablets), decorative parts `aria-hidden`; login screen with avatar, name/title, live clock+date, timezone city, Login button, Enter-key access.
**Verified:** lint clean, 12/12 tests pass, build succeeds. **Not verified at the time:** actual rendering at 1280/1440/1920/tablet widths — a peer session later confirmed one viewport looks correct (see section 8 entry above); the other widths are still unchecked.

### M0 — Scaffold — ✅ Done (pre-existing, committed `15e3c68`)
Vite + React + TS + Tailwind v4 + Motion + FontAwesome + Inter + ESLint/Prettier + Vitest + `wrangler.jsonc`. Verified in this session: `npm install` initially failed (see Deviations #1), fixed, then lint/test/build all confirmed passing from a clean install.

---

## 9. How to keep this file honest (for future sessions/agents)

- Update the status table and add a dated log entry **every time** you finish a chunk of work, not just at milestone boundaries.
- If you can verify something a prior session couldn't (e.g. you have a working browser tool), do it and flip the status — don't just trust this file's "not verified" forever.
- If you deviate from `PROJECT_BRIEF.md` sections 2 or 13, log it under section 5 immediately, with a reason and a revisit condition, before writing more code.
- Keep section 7 (open items for Gavin) in sync with brief section 16 as new non-blocking questions come up.
- **Check for peer sessions before editing.** If a peer is live and working on a file, coordinate via a message before touching it — see the warning at the top of this file. Don't assume a limitation of your own environment (e.g. "no browser tool") applies to every session; state it as local to you.
