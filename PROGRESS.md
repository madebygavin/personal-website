# Progress Tracker

**Last updated:** 2026-09-20 by Claude (Sonnet 5), session `personal-website-b5`
**Read this file first**, before `PROJECT_BRIEF.md`, at the start of any session. `PROJECT_BRIEF.md` is the spec (binding, changes rarely). This file is the log (changes every session) — it tells you where things actually stand right now, including things the brief can't know: what's verified, what's deviated, what's blocked, and **which session is doing what**.

Status legend: ✅ Done (verified incl. visual QA) · 🟡 Code complete, **not** visually verified · 🔵 In progress · ⬜ Not started · 🔴 Blocked

> ⚠️ **Multiple sessions may be working on this repo at once.** Before editing anything, run `ListAgents` (if you're Claude Code) to check for a live peer session, and check `git status`/`git log` for uncommitted or unfamiliar changes on disk. If you find changes you didn't make, don't revert them blindly — they may be a peer's in-progress work. Message the peer to coordinate before touching the same files. See section 2 for who's doing what right now.

> 📍 **Remote:** `https://github.com/madebygavin/personal-website` (private, added 2026-09-20). Nothing was pushed here before this repo existed locally-only — if you're on a fresh machine, `git clone` this instead of asking Gavin to transfer files another way. **Remember to `git push` after committing** — a PM session that only commits locally leaves other machines' clones stale. See `CLAUDE.md`'s restart guide for the full multi-session bootstrap.

---

## 0. Team & operating model (as of 2026-09-20)

This repo is currently run with a **PM / engineer / reviewer / tester split** across four Claude Code sessions on Gavin's machine:

- **PM session** — coordinates, assigns tasks, tracks this file, gates when review/testing happens, re-runs lint/test/build independently before trusting any "done" report, decides what happens with findings, talks to Gavin, and is the only one who commits (and only when Gavin explicitly asks). **Does not write feature code, does not review code line-by-line, does not do QA testing itself** — PM's own checks are lint/test/build plus a sanity read of the diff, not a substitute for the reviewer or tester.
- **Engineer session** — implements exactly the task the PM assigns, verifies its own work (`npm run lint && npm run test -- --run && npm run build`, plus a real check for anything visual/behavioral), and reports back to the PM with: what it did, files touched, verification results, any deviations or blockers. **Does not commit, and does not edit `PROGRESS.md` or `CLAUDE.md` directly** — report to the PM instead, to avoid sessions racing on the same file.
- **Reviewer session** — a strict senior code reviewer, static analysis of the diff. **Only reviews work the PM has explicitly flagged as ready** — it does not review a task while the engineer is still mid-flight, and does not go looking for work on its own. Reviews for correctness, security, performance, maintainability, and adherence to `PROJECT_BRIEF.md`, then reports findings back to the PM — severity-ranked, with file/line references. **Does not edit code, does not commit, does not talk to the engineer or tester directly.**
- **Tester session** — a senior QA/test engineer, dynamic/behavioral testing (actually running the app), complementary to the reviewer's static read. **Only tests work the PM has explicitly flagged as ready.** This project has **no backend** (`PROJECT_BRIEF.md` section 4) — "backend" testing here means the logic/state layer (session state machine, preferences persistence, i18n, timezone/clock/zoom utils), not a server. Also covers responsive UI across breakpoints, both themes, both languages, reduced motion, and keyboard-only usage. Reports bugs/findings to the PM only, severity-ranked, with repro steps and evidence kept in `.qa/` (never deleted). **Does not edit code, does not commit, does not talk to the engineer or reviewer directly.** Can run in parallel with the reviewer (different concerns: reading code vs. running it) rather than waiting in sequence, unless the PM says otherwise for a specific task.

**Current mapping** (session names are assigned by the harness and will change if a session restarts — check `ListAgents` and update this line, don't assume the names below stay valid):
- PM: `personal-website-b5`
- Engineer: `personal-website-1d`
- Reviewer: `personal-website-f5` (Gavin restarted the reviewer session at ~13:05 after `personal-website-ad` hit a cross-session messaging issue and couldn't reach the PM — see section 8. `personal-website-f5` has no memory of `-ad`'s in-progress M3 review; it was re-briefed and re-tasked from scratch.)
- Tester: `personal-website-30` (joined ~13:45)

**If you're a new session picking this up:** run `ListAgents`. If a PM session is live, message it and wait for a task rather than starting independent work — it's tracking state you don't have. If no PM is live (Gavin only has one session open), there's no split in effect right now; work normally per section 9's rules and update this file yourself.

**Task protocol:**
1. PM assigns a task to the engineer via `SendMessage`: scope, relevant `PROJECT_BRIEF.md` sections, and anything needed from current `PROGRESS.md` state.
2. Engineer works, verifies, and messages the PM back — no commit, no tracker edits.
3. PM does a light sanity pass itself (re-runs lint/test/build, skims the diff for anything glaring) — not a full review or test pass.
4. PM hands the same completed work to the reviewer (static review) and the tester (dynamic/behavioral testing) — these can run in parallel. Both report findings back to the PM only.
5. PM triages all findings from both: sends required fixes back to the engineer (loop back to step 2), or — if clean, or findings are minor/deferred — updates `PROGRESS.md` and asks Gavin for commit approval.
6. If any session disappears mid-task (Gavin closes it, etc.), PM tells Gavin rather than silently waiting or absorbing the work itself.

---

## 1. Status at a glance

| # | Milestone | Status | Lint | Test | Build | Visual QA |
|---|---|---|---|---|---|---|
| M0 | Scaffold | ✅ Done | ✅ | ✅ (0 tests, pass) | ✅ | n/a (blank page) |
| M1 | Landing & login screen | 🟡 Code complete, visually spot-checked | ✅ | ✅ | ✅ | ✅ landing screen screenshot looks correct (see section 8) |
| M2 | Boot & zoom transition | ✅ Done | ✅ | ✅ | ✅ | ✅ fixed + re-verified (see section 8, section 4a #1 resolved) |
| M3 | Desktop shell | ✅ Done, committed `201f81a` | ✅ | ✅ | ✅ | ✅ 10+ screenshots in `.qa/`, spot-checked by PM; reviewer traced live keyboard behavior |
| M4 | Window system & apps | 🔵 Assigned to engineer | — | — | — | — |
| M5 | Mobile | ⬜ Not started | — | — | — | — |
| M6 | Polish, a11y, perf | ⬜ Not started | — | — | — | — |
| M7 | Deployment | ⬜ Not started | — | — | — | — |

**Nothing gets marked ✅ Done based on lint/test/build alone if the milestone's acceptance criteria (PROJECT_BRIEF.md section 12) are visual or behavioral.** M2 is now ✅: the zoom bug (section 4a #1) was fixed and re-verified by two independent sessions (see section 8). M1 got only a partial visual spot-check (one screenshot, one viewport) — encouraging, but 1280/1440/1920 + tablet widths are still unchecked, so it stays at 🟡 until someone (Gavin or a session with a working browser tool) confirms those.

---

## 2. Currently in progress

M3 is committed (`201f81a`). Engineer has just been assigned M4 (Window system & apps). Reviewer is on standby, briefed that M4 is coming.

## 3. Next up

Engineer implements M4. Same pipeline as M3: engineer reports → PM sanity-check → reviewer review → PM triages/loops fixes → Gavin commit approval.

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

From PROJECT_BRIEF.md section 3 — Gavin should confirm or override these at review. #2 and #12 aren't built yet (M4/M5).

| # | Gap | Applied as | Milestone |
|---|---|---|---|
| 1 | Active app name label | Shows localized "Desktop" when no window is open (window system isn't built until M4, so it always shows "Desktop" for now); dock click sets the label + indicator dot | M3 |
| 3 | Keyboard/mouse decorative vs interactive | Fully decorative (`aria-hidden`); Enter key triggers login via a `window` keydown listener; Login button is a real `<button>`, also clickable via the avatar button | M1 |
| 7 | Light mode look | Light gray glass panels, light animated gradient, dark text — implemented, per engineer's report, as CSS variables swapped on `data-theme`, same as dark | M3 |
| 8 (impl. detail) | Brightness slider mechanism | Implemented as `backdrop-filter: brightness(N%)` on a full-screen overlay (not `filter` on the content tree) — engineer's literal reading of "CSS brightness filter on a full-screen overlay" | M3 |
| 10 | Default language detection | Already built in M1 (`detectLanguage` on `navigator.language`); M3 just added the Control Center UI to override it | M1/M3 |

**New engineer decisions not explicitly locked by the brief, need Gavin's eyes (not blocking):**
- Dock icons: About me = `faUser`, Skills = `faGear`, Experience = `faCalendarDays`, Projects = `faFolderOpen`, Contact = `faEnvelope`, each on its own gradient tile color.
- Wallpaper: pure CSS radial-gradient background-position drift (30s, alternating), no canvas; paused on both tab-hidden and reduced-motion.
- "Control Center" localized to "Trung tâm điều khiển" in VI.
- EN/VI segmented-control button labels left as literal strings (not run through `Localized<T>`), since they're language identifiers, not language-dependent prose.
- `AboutDialog` has initial focus + Escape + focus-return, but no full focus trap. Brief section 10 doesn't explicitly demand a trap at this milestone — engineer flagged it as a candidate for now vs. M6; PM has not decided, awaiting reviewer input.

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

### Git remote added, repo pushed (2026-09-20, ~13:40)
Gavin asked how to rebuild the PM/engineer/reviewer session split after a reboot or on a different PC. Answer: the files (this repo) persist via git; the live sessions and their roles don't, and have to be re-bootstrapped every time. Two things done about it:
1. `CLAUDE.md` got a "Restarting the multi-session team" section with copy-paste bootstrap prompts for each of the three roles, plus the reconnect steps (`ListAgents`, update the mapping table).
2. The repo had no git remote at all until now — meaning there was previously no way to get this code onto a different machine except a manual file copy. Created a private GitHub repo (`gh repo create`, authenticated as `madebygavin`) and pushed all history. Remote: `https://github.com/madebygavin/personal-website`.

Committed as `c535e36` (CLAUDE.md guide + the pending M4-assignment PROGRESS.md edit). **Process note for future sessions: remember to `git push`, not just `git commit`** — commits alone don't help a different machine, and this session almost left the remote-setup docs sitting local-only.

### M3 closed out — reviewer recheck clean (2026-09-20, ~13:25)
Reviewer (`personal-website-f5`) rechecked all 3 fixes plus the two incidental files, independently re-ran lint/test/build (matched: 14/14 tests, 148.12 KB gzip JS), and found nothing new. Went beyond the ask: traced the Escape-refocus path to confirm it doesn't double-fire a redundant dismiss through the new `focusout` handler (a real edge case neither the PM nor the recheck request explicitly named) and confirmed the focus trap's container is a DOM sibling of the backdrop, not a wrapper around it, so the backdrop was never reachable via Tab. **M3 is now done**: implemented, sanity-checked, reviewed, fixed, and re-verified independently by both PM and reviewer. Uncommitted, pending Gavin's approval.

### M3 review fixes made — PM-verified, sent for recheck (2026-09-20, ~13:20)
Engineer (`personal-website-1d`) fixed all 3 items:
1. **Tab-out closing** — rather than bolting Tab-close onto the existing Escape/refocus logic, split responsibilities: `useDismissablePopover` now does pure "light dismiss" (outside pointerdown + `focusout` via `relatedTarget` check), and never refocuses the trigger — refocusing on Tab would fight the browser's own forward focus movement and effectively trap the user. Escape handling stays in each caller (`LogoMenu`, `ControlCenter`) since only Escape should return focus to the trigger. PM read the new hook and both callers — confirmed this correctly separates the two concerns and doesn't reintroduce a trap-on-Tab bug.
2. **AboutDialog focus trap** — built as a new reusable `hooks/useFocusTrap.ts` (standard first/last-focusable Tab/Shift+Tab wrap), explicitly for reuse in M4's Window component. PM read it — correct standard implementation, correctly scoped to just the dialog panel via `dialogRef` (not the backdrop).
3. **ControlCenter `aria-haspopup`** — changed to `"dialog"`. PM confirmed.

Engineer also did a live Tab-through verification (not just static/automated) and reported: menu closes and focus lands on the next control (not hijacked back) when tabbing forward past it; Escape still correctly refocuses the trigger; the dialog's 2-way Tab wrap confirmed both directions. Screenshots/scripts for this added to `.qa/` (`m3-review-fixes-check.cjs`), alongside the original M3 set — none deleted.

**PM verification:** read all 5 touched files directly (not just the report), independently re-ran lint/test/build (clean: 14/14 tests, 148.12 KB gzip JS — build size still under the ~200KB bar). Sent the same 3 files to the reviewer for a targeted recheck (not a full re-review, since the rest of M3 didn't change) before asking Gavin for commit approval.

### M3 review complete — findings triaged, fixes sent back to engineer (2026-09-20, ~13:10)
Reviewer (`personal-website-f5`) did a static read of the full diff plus an independent lint/test/build run (matched PM's numbers exactly: 14/14 tests, 147.85 KB gzip JS). **No blocking findings.** PM independently re-verified both should-fix items by reading the actual source before acting on them (see below) — both confirmed real, not just accepted on the reviewer's word.

**Should-fix (sent back to engineer, blocking the M3 commit):**
1. `useDismissablePopover.ts:9-28` only closes on outside `pointerdown` or `Escape` — no `focusout` handling. Used by `LogoMenu` (`role="menu"`/`aria-haspopup="menu"`) and `ControlCenter`. A keyboard user tabbing through and past the menu leaves it visually open with `aria-expanded="true"` stuck true — a real deviation from the standard ARIA menu-button pattern (Tab should close it). PM confirmed by reading the hook: no `focusout`/blur listener exists at all.
2. `AboutDialog.tsx:44` declares `aria-modal="true"` but has no focus trap — Tab can reach background controls (menu bar / dock) through the translucent backdrop. Reviewer's call, which PM agrees with: not a literal violation of section 10's explicit list (reachability/focus ring/Escape/dialog semantics are all met), but `aria-modal="true"` is an explicit promise to assistive tech that isn't being kept, so it's should-fix rather than a clean deferral. PM confirmed by reading the component: only two focusable elements inside (link, close button), nothing stops Tab from leaving the portal.

**Also sent as a quick fix (trivial, bundled with the above rather than deferred):**
3. `ControlCenter.tsx:32` — `aria-haspopup="true"` on a panel that's actually a settings fieldset (segmented controls + a slider), not a menu. Confirmed by reading the file. Reviewer suggested `aria-haspopup="dialog"` or dropping the attribute.

**Deferred to M6 polish backlog (not blocking, logged so it isn't forgotten):**
4. `Dock.tsx:75-80` — `getBoundingClientRect()` runs inside the hover-magnification `useTransform` callback, a forced layout read per icon per `mousemove`. Fine at 5 icons; reviewer suggested caching on resize instead. Not urgent — added to the M6 punch list.

**Unprompted check the reviewer did on its own initiative (good sign of real scrutiny, not just answering the checklist):** traced whether `Desktop`'s `fixed` MenuBar/Dock have the same containing-block problem as the AboutDialog bug during the M2 zoom transition, since `<Desktop/>` briefly renders inside Hardware's transformed assembly at that point. Confirmed it's intentional and correct — that's exactly how the FLIP zoom scales the nested desktop together with the growing hardware screen, and `Desktop` becomes a top-level sibling again the instant the animation completes (`App.tsx:63-67`), so `fixed` descendants resolve against the real viewport again immediately after. No action needed, just confirms the M2 fix's design holds up under a second, independent trace.

**Explicitly not verifiable from a static diff read (reviewer disclosed this rather than silently skipping it):** real screen-reader behavior (NVDA/VoiceOver), actual rendered contrast vs. hand-computed values, and touch-device dock behavior. None of these have had a hands-on pass from anyone yet — worth keeping in mind for M6's accessibility pass rather than assuming they're covered.

PM sent all 3 fix items back to the engineer. Not yet committed — M3 stays at 🟡 pending the fix + re-verification.

### Reviewer session restarted (2026-09-20, ~13:05)
`personal-website-ad` (original reviewer) reported to Gavin that it couldn't reach the PM — no report ever arrived at `personal-website-b5` despite the PM's handoff message showing as delivered/queued on send. Root cause not confirmed (candidates: the receiving session's permission mode holding the message for approval, or something else entirely) — Gavin closed that session before it could be diagnosed further. Gavin opened a new session, `personal-website-f5`, as the replacement reviewer. It has no memory of `-ad`'s in-progress review, so it was re-briefed on the role/protocol and re-handed the M3 task from scratch (nothing was lost since `-ad` never actually reported any findings to begin with). **Lesson for next time:** if a peer reports a delivery problem, don't just retry blind — ask it what exactly happened (error vs. silent non-delivery) before concluding a restart is needed, since that diagnostic information is gone once the session closes.

### M3 — Desktop shell — 🟡 Code complete, awaiting review (2026-09-20, ~12:40–12:56)
**What shipped (engineer: `personal-website-1d`):**
- New: `components/desktop/{Wallpaper,MenuBar,LogoMenu,ControlCenter,AboutDialog,Dock}.tsx`, `hooks/{useDismissablePopover,usePointerFine}.ts`.
- Modified: `Desktop.tsx` (full rewrite, replaces the M2 stub), `config/brand.ts` (+`githubUrl`), `data/content.ts` (+`AppId` type, +`appNames`, +9 `uiStrings` entries), `styles/index.css` (+`.glass-panel` utility with a solid-color fallback for no-`backdrop-filter` browsers, +wallpaper drift keyframes, +theme vars).
- Covers PROJECT_BRIEF.md 7.4–7.6: animated wallpaper (pauses on tab-hidden/reduced-motion), menu bar with logo menu + active-app label + Control Center + live clock, About dialog, dock with hover magnification + tooltips + open-app indicator.

**Bug found and fixed during the engineer's own QA — flagged for reviewer attention:** `AboutDialog` is rendered from inside `LogoMenu` → `MenuBar`, and `MenuBar` carries `.glass-panel` (`backdrop-filter`). A `backdrop-filter` (or `filter`/`transform`) on an ancestor makes it the containing block for `position: fixed` descendants — same rule that trips people up with `transform`. So the dialog's `fixed inset-0` was resolving against the 28px menu bar box, not the viewport, squashing it into a sliver at the top. Fixed with `createPortal` to `document.body`. **Reviewer: please confirm M4's window layer (a `MenuBar` sibling, not a descendant) doesn't share this problem** — the engineer believes it's fine by construction but this is exactly the kind of non-obvious CSS gotcha worth a second pair of eyes on.

**Verification:** `personal-website-1d` — tsc/eslint/vitest (14/14)/build (147.83 KB gzip JS) all clean; live Playwright repro against a dev server covering every 7.5/7.6 acceptance item (menu bar label swap, logo menu keyboard nav + focus return, About dialog, Restart via logo menu, Control Center theme/brightness/language, persistence-across-reload-resets-to-landing, dock magnification 44px→68px, dock indicator), zero console errors; 10 screenshots + the repro script kept in `.qa/` (not deleted — process fix from the M2 lesson). `personal-website-b5` (PM) independently re-ran lint/test/build (matched: 147.85 KB gzip JS), confirmed no `playwright-core` trace anywhere, and spot-checked 2 of the 10 screenshots directly (`m3-01-desktop-dark.png`, `m3-03-about-dialog.png` — both match spec, dialog correctly centered post-fix).

**Not yet done:** full reviewer pass (in progress as of this entry — see section 2). No commit yet.

### Team model expanded to PM/engineer/reviewer; M3 assigned (2026-09-20, ~12:40)
Gavin added a third session, `personal-website-ad`, as a strict senior code reviewer. PM updated section 0 to a three-way protocol (reviewer only reviews once PM flags a task as engineer-complete; reports findings to PM only, no direct contact with the engineer, no edits/commits). PM assigned M3 (Desktop shell) to the engineer (`personal-website-1d`) — see the task message for full scope (wallpaper, menu bar, logo menu, About dialog, Control Center, dock; reuse existing preferences/session state and content.ts patterns). Briefed the reviewer on its role and told it to stand by. Commits `c1280fc` (M2 fix) and `1bf8ccf` (PM/engineer model) landed just before this. M3 work is in progress as of this entry.

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
