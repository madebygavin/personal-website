# Progress Tracker

**Last updated:** 2026-09-21 by Claude (Sonnet 5), session `personal-website-fa` (PM) — M6 shipped and committed; content/UI polish pass (old-site content reuse, skill icons, desktop widget) queued next.
**Read this file first**, before `PROJECT_BRIEF.md`, at the start of any session. `PROJECT_BRIEF.md` is the spec (binding, changes rarely). This file is the log (changes every session) — it tells you where things actually stand right now, including things the brief can't know: what's verified, what's deviated, what's blocked, and **which session is doing what**.

Status legend: ✅ Done (verified incl. visual QA) · 🟡 Code complete, **not** visually verified · 🔵 In progress · ⬜ Not started · 🔴 Blocked

> ⚠️ **Multiple sessions may be working on this repo at once.** Before editing anything, run `ListAgents` (if you're Claude Code) to check for a live peer session, and check `git status`/`git log` for uncommitted or unfamiliar changes on disk. If you find changes you didn't make, don't revert them blindly — they may be a peer's in-progress work. Message the peer to coordinate before touching the same files. See section 2 for who's doing what right now.

> 📍 **Remote:** `https://github.com/madebygavin/personal-website` (private, added 2026-09-20). Nothing was pushed here before this repo existed locally-only — if you're on a fresh machine, `git clone` this instead of asking Gavin to transfer files another way. **Remember to `git push` after committing** — a PM session that only commits locally leaves other machines' clones stale. See `CLAUDE.md`'s restart guide for the full multi-session bootstrap.

---

## 0. Team & operating model (as of 2026-09-20)

This repo is currently run with a **PM / engineer / reviewer / tester split** across four Claude Code sessions on Gavin's machine:

- **PM session** — decides what the engineer and tester work on, tracks this file, gates when the tester tests, triages the tester's findings, talks to Gavin, and is the only one who commits (and only when Gavin explicitly asks). **Does not write feature code, does not review code line-by-line, does not do QA testing itself, and does not sanity-check the engineer's work** — that's the reviewer's job now (see below). PM is notified at the start of the engineer↔reviewer loop and again when it's clean, but isn't in the middle of it.
- **Engineer session** — implements exactly the task the PM assigns, verifies its own work (`npm run lint && npm run test -- --run && npm run build`, plus a real check for anything visual/behavioral). When a task is done, **sends it directly to the reviewer** for code review and gives the PM a heads-up (informational only — the PM doesn't gate this step). Works directly with the reviewer on any findings until they report it clean. **Does not commit, and does not edit `PROGRESS.md` or `CLAUDE.md` directly.**
- **Reviewer session** — a strict senior code reviewer, static analysis of the diff. **The engineer sends work to it directly** (no PM gate). Reviews for correctness, security, performance, maintainability, and adherence to `PROJECT_BRIEF.md`; sends severity-ranked findings (blocking/should-fix/nit/suggestion, file/line references) **straight back to the engineer**, iterating directly with them until clean. Once clean, **tells the PM** so it can update `PROGRESS.md` and hand off to the tester — that's the only thing the PM needs from the reviewer. **Does not edit code, does not commit, does not touch `PROGRESS.md`/`CLAUDE.md`.**
- **Tester session** — a senior QA/test engineer, dynamic/behavioral testing (actually running the app), complementary to the reviewer's static read. **Only tests work the PM has explicitly flagged as ready** (PM hands this off once the reviewer reports clean). This project has **no backend** (`PROJECT_BRIEF.md` section 4) — "backend" testing here means the logic/state layer (session state machine, preferences persistence, i18n, timezone/clock/zoom utils), not a server. Also covers responsive UI across breakpoints, both themes, both languages, reduced motion, and keyboard-only usage. **Reports bugs/findings to the PM only** (unlike the reviewer, the tester stays routed through the PM, not direct-to-engineer) — severity-ranked, with repro steps and evidence kept in `.qa/` (never deleted). PM triages and relays any required fixes to the engineer. **Does not edit code, does not commit, does not talk to the engineer or reviewer directly.**

**Workflow, superseded 2026-09-20 evening (Gavin's call):** previously the reviewer only reviewed once the PM explicitly flagged a task ready, and reported findings to the PM who then relayed them to the engineer. Now the engineer↔reviewer loop is direct and exclusive of the PM until it's clean — this cuts the PM out of an extra relay hop for code-review iteration, since that back-and-forth doesn't need PM judgment calls the way tester-finding triage does. The tester stage is unchanged: PM still gates it and still triages its findings, since those are genuine PM-level calls (required fix vs. deferred/minor, same as always).

**Current mapping** (session names are assigned by the harness and will change if a session restarts — check `ListAgents` and update this line, don't assume the names below stay valid):
- PM: `personal-website-fa` (2026-09-21, after a reboot — no memory of prior sessions' conversations, but nothing was lost since it's all captured in this file)
- Engineer: `personal-website-a4`
- Reviewer: `personal-website-dc`
- Tester: `personal-website-52`

**If you're a new session picking this up:** run `ListAgents`. If a PM session is live, message it and wait for a task rather than starting independent work — it's tracking state you don't have. If no PM is live (Gavin only has one session open), there's no split in effect right now; work normally per section 9's rules and update this file yourself.

### 0a. Usage-limit stop-and-log protocol (added 2026-09-20 ~19:20, per Gavin; threshold tightened to 90% ~19:55)

**Trigger: usage/token limit >= 90%.** If your session's environment surfaces a live usage/context percentage, treat 90% as the hard stop — don't wait for it to climb further or for a "natural" stopping point. If no live percentage is exposed (Claude Code doesn't always show one), treat the first usage-limit warning your own session sees as equivalent to having crossed 90% and act immediately on that instead of waiting for a number.

When a session hits that threshold:
- **If it's the PM:** immediately write a full state snapshot into this file — every in-flight task, each peer's exact status, all pending decisions, precise next steps — then stop taking further action and tell Gavin directly. Don't wait for a "natural" stopping point; log mid-task if that's where the warning lands.
- **If it's the engineer, reviewer, or tester:** immediately send the PM a full status report (what you were doing, progress so far, any partial output/files, exactly where you left off), then stop working and wait — don't keep going after sending the report. Per section 0's rule that only the PM edits this file, you report to the PM rather than editing it yourself; the PM folds your report into a PROGRESS.md snapshot and tells Gavin.
- **Resuming:** a session picks back up only when Gavin says to continue (or, on a fresh session/after a reset, by reading the snapshot this protocol just produced — same as any other cold start per section 9).

**Why this exists:** so a session running out of usage doesn't silently drop uncommitted context — the snapshot in this file is what lets any session (this one resumed, or a fresh one) pick up exactly where things stood.

**Task protocol (updated 2026-09-20 evening):**
1. PM assigns a task to the engineer via `SendMessage`: scope, relevant `PROJECT_BRIEF.md` sections, and anything needed from current `PROGRESS.md` state.
2. Engineer works, verifies (lint/test/build + real check for anything visual/behavioral) — no commit, no tracker edits.
3. Engineer sends the finished work **directly to the reviewer** and gives the PM a one-line heads-up (informational — PM doesn't gate this).
4. Engineer and reviewer iterate directly with each other on findings — PM is not in this loop and does not sanity-check the code itself.
5. Once clean, the reviewer tells the PM. PM updates `PROGRESS.md` and hands the work to the tester (dynamic/behavioral testing).
6. Tester reports findings to the PM only (unchanged — tester stays routed through the PM, not direct-to-engineer). PM triages: sends required fixes back to the engineer (loop back to step 2 — any resulting code change goes through the reviewer again per step 3, same as initial development), or — if clean, or findings are minor/deferred — updates `PROGRESS.md` and asks Gavin for commit approval.
7. If any session disappears mid-task (Gavin closes it, etc.), whoever notices tells the PM (or Gavin directly, if it's the PM itself that's affected) rather than silently waiting or absorbing the work itself.

---

## 1. Status at a glance

| # | Milestone | Status | Lint | Test | Build | Visual QA |
|---|---|---|---|---|---|---|
| M0 | Scaffold | ✅ Done | ✅ | ✅ (0 tests, pass) | ✅ | n/a (blank page) |
| M1 | Landing & login screen | ✅ Done — §8a #1 fixed, dynamically re-verified | ✅ | ✅ | ✅ | ✅ fix confirmed via `getBoundingClientRect` at 375/414px |
| M2 | Boot & zoom transition | 🟡 §8a #3 fixed & dynamically re-verified; §8a #4 still unconfirmed, needs Gavin | ✅ | ✅ | ✅ | ⚠️ #3 confirmed; #4 needs a real (non-headless) browser check |
| M3 | Desktop shell | ✅ Done — §8a #2 fixed, dynamically re-verified | ✅ | ✅ | ✅ | ✅ fix confirmed via measured panel bounds at 375/414px |
| M4 | Window system & apps | ✅ Done — reviewer + tester both clean on a full pass | ✅ | ✅ | ✅ | ✅ full dynamic pass done, nothing outstanding |
| M5 | Mobile | ✅ Done — reviewer + tester both clean (2 rounds on the CC bug) | ✅ | ✅ | ✅ | ✅ full dynamic pass + targeted re-tests, nothing outstanding |
| M6 | Polish, a11y, perf | ✅ Done — reviewer + tester clean, remaining opens (theme/hardware, Lighthouse) resolved by Gavin's decision, not fixes | ✅ | ✅ | ✅ | ✅ confirmed dynamically incl. real contrast math; Lighthouse score itself accepted as an unmeasured gap (§4a #3) |
| M7 | Deployment | ⬜ Not started | — | — | — | — |

**Update 2026-09-20 ~19:00:** all 3 confirmed §8a regressions (M1 login clipping, M3 Control Center overflow, M2 keyboard-focus-behind-restart-overlay) are now fixed and dynamically re-verified — the M2 fix took 3 rounds because the first two "fixes" looked correct under careful static review by both the PM and the reviewer, but only the tester's live, timing-based repro caught that they weren't. M4 is fully clean (review + dynamic).

**Update 2026-09-20 ~19:15:** Gavin approved the commit — the batch (3 §8a fixes + M4) is landed as `105592b` (M4) and `cabedfe` (the 3 fixes), pushed to `origin/main`. Gavin also disposed of §8a #4: accept it as an unconfirmed, low-probability edge case and move on rather than chase it further (see section 4a).

**Update 2026-09-20 ~21:20:** M5 (Mobile) shipped — reviewer + tester both clean after 2 rounds on a Control Center bug (touch-reachability fix, then a keyboard regression that fix introduced). Committed and pushed as `fd4835a`. Same session also updated the team protocol: engineer and reviewer now iterate directly with each other on code review until clean, instead of relaying through the PM each round (see section 0/0a). Full story in section 8. **Nothing in progress right now** — M6 (Polish, a11y, perf) is next, not yet scoped. See section 3.

---

## 2. Currently in progress

**Content/skills-icon/desktop-widget batch** — assigned to the engineer 2026-09-21 (see section 3 for scope). **Done, sent directly to the reviewer, iterating there now.** Bio, skills content + per-skill brand icons, LinkedIn, GitHub, ambient desktop clock all in and verified (lint/test/build clean, bundle <155KB gzip, 26 real-Chrome checks across EN/VI). Incidental fix: `BRAND.githubUrl` was pointing at a stale placeholder repo URL from early scaffolding, corrected to the real pushed repo.

**Two open questions for Gavin, not blocking the review loop:**
1. Skill proficiency percentages weren't in the old-site export — engineer defaulted all new real skills (CSS/HTML/JS/React, .NET/MySQL/Go/Python) to 80%, left `TODO(gavin)` in `content.ts`. Send real numbers if you have them in mind.
2. `contact@gavinle.com` is in but still marked `TODO(gavin)` — used as best-available data per instruction not to assume it's current. Confirm if that's still your real contact email.

Experience/Projects still pending your real details (section 7 item 2).

**Reviewer clean 2026-09-21** (1 round, both findings fixed and re-verified, reviewer independently reran lint/test/build before/after both rounds): (1) `MenuBar` and the new `DesktopClock` were each running an independent `useClock()` interval for the same tick — `Desktop.tsx` now calls it once and passes `now` down to both; (2) per-skill brand colors on the progress-bar *fill* failed WCAG 1.4.11 non-text contrast badly in light theme (10 of 13 colors, JavaScript's yellow worst at ~1.05:1) — reverted the bar fill to the shared accent color (passes both themes), kept the distinct brand color on the icon glyph only. Final: 14/14 tests, 154.30 kB gzip. **Handed to the tester** alongside batch 1 (M6, already committed) for a combined pass.

**Tester clean 2026-09-21 — no findings.** Real (non-headless) Chrome, throwaway `playwright-core` (cleanly uninstalled). All 5 targeted areas confirmed: bio/skills/contact content matches supplied copy exactly in EN, VI translation reads idiomatically (not mechanical); all 13 skill icons render correct brand icon + color (incl. `.NET`→`faCode`/MySQL→`faDatabase` fallbacks), confirmed the reviewer's contrast revert holds (every bar fill computes to the shared `--color-accent`, brand color confirmed icon-glyph-only); desktop clock excluded from Tab order, `aria-hidden` confirmed, sampled in sync with `MenuBar`'s clock (no drift); 80%-default skills and unconfirmed contact email correctly not flagged as bugs. Spot-checked M6 batch 1's `noscript` content with the new real links — still correct. Evidence in `.qa/` (`tester-m6b2-dynamic.cjs`, results JSON, 3 screenshots). **Ready for Gavin's commit approval.**

## 3. Next up

**Content + UI polish pass, per Gavin (2026-09-21), not yet scoped/assigned:**
1. **Real content from Gavin's old site.** He supplied `gavinle_site_content.md` (export of `gavinle.com`) — bio, skills list (Frontend: CSS/HTML/JS/React; Backend: .NET/MySQL/Go/Python), email, GitHub, LinkedIn are usable as-is; Experience/Projects were placeholder-only in that export, Gavin is providing real details separately (watch for his next message with that content before implementing those two sections).
2. **Per-skill icon + color in `SkillsApp.tsx`.** `@fortawesome/free-brands-svg-icons` is already installed — use real brand icons (React, JS, Python, Go, etc.) not generic placeholders. `.NET` has no dedicated FA brand icon; engineer's judgment call on a reasonable substitute.
3. **Ambient desktop widget.** Gavin's direction (chosen over a richer-wallpaper-only or dock/menu-bar-only alternative): a non-interactive element on the desktop surface itself — e.g. a large live clock/date display or a short status/quote line. Explicitly **not** a desktop icon or a new app (PROJECT_BRIEF.md §13 bans desktop icons) — keep it decorative, no click target, no new window.

**Queued after the above, not yet assigned — brainstormed UI ideas Gavin wants to work through next:** dock icon tooltip descriptions, tactile hover/press micro-animations on dock icons and traffic lights, login-screen cursor parallax on the hardware illustration, dock-icon-origin window open/close animation, project-card hover previews, skills grouped by category (Frontend/Backend, matching the old site's structure — pairs with item 2 above), time-of-day wallpaper palette shift. Two bigger-swing ideas (boot-progress visual pulse, radial-wipe theme toggle) need explicit scope discussion before assigning, not just a routine batch.

Once scoped: same protocol as M1–M6 — engineer → reviewer (direct loop) → PM hands to tester once reviewer says clean → PM triages tester findings → Gavin for commit approval.

Separately, still pending Gavin: whether to commit the previous session's uncommitted `PROGRESS.md` end-of-day cleanup edit (folded into this session's edits above, so now moot — this update supersedes it).

---

## 4. Blockers / risks (active)

Nothing currently blocking. Everything through M5 is committed and pushed (`fd4835a` on `origin/main`, working tree clean).

## 4a. Resolved blockers (kept for history — don't delete, append instead)

0. **⚪ DISPOSED (not fixed) — §8a #4, possible reduced-motion crash.** Repro (log in, open Logo menu, click Log Out within ~150ms of desktop first appearing under reduced motion) was only ever reproducible in headless Chrome; no session on the team (engineer, tester, PM) had real interactive browser access to confirm or deny it. Gavin's explicit decision (2026-09-20 ~19:15): accept as an unconfirmed, low-probability edge case and move on rather than have the team keep chasing it or harden defensively against an unconfirmed crash. Full detail and PM's plausible-root-cause trace (React remounting `Desktop`'s subtree mid-interaction as `session.phase` flips from `'zooming-in'` to `'desktop'`) preserved in section 8a #4. **Revisit if:** it resurfaces in real usage, or M6's polish pass touches the boot/zoom phase logic anyway.

1. **✅ RESOLVED — M2 zoom transition bug.** Found and fixed by session `personal-website-1d`, independently re-verified by `personal-website-b5` (this session). Two root causes:
   - `Hardware.tsx`'s assembly `motion.div` only received `ref={outerRef}` starting at the `zooming-in` phase render — Motion v13 does not attach a ref added on a later render to an already-mounted instance (only at initial mount), so `outerRef.current` stayed permanently `null` and the transform never computed.
   - `Desktop.tsx`'s root used `min-h-dvh` (viewport-height-based) instead of `h-full`; when nested inside Hardware's small screen box during zooming, it overflowed and got clipped, which is why only the buttons peeked out.
   - Fix: `assemblyRef` now passed unconditionally on every `Hardware` render; `Desktop.tsx` changed to `h-full`; `src/styles/index.css` got a companion `html, body, #root { height: 100% }` rule, without which `h-full` has nothing to resolve against up the chain. Verified: `personal-website-1d` re-ran its Playwright repro (transform animates through the full scale/translate sequence; Restart/Log Out render centered full-screen with no bezel afterward) and confirmed lint/test/build clean; `personal-website-b5` independently re-ran lint/test/build and reviewed the diff. **Caveat:** the confirming screenshots were deleted during scratch-file cleanup and weren't re-captured — see the process note below. Recommend Gavin does one real click-through when convenient, but this is due diligence, not a sign of doubt about the fix.
   - **Process lesson:** QA screenshots that prove a bug fix should be kept somewhere durable (e.g. a gitignored `.progress-assets/` or attached to the commit message description) rather than deleted as "scratch," or the verification claim becomes unauditable later. Do this next time.

2. **✅ RESOLVED — mistaken universal claim about browser tooling.** An earlier version of this file said no browser automation was available in *any* session's environment. That was only true for `personal-website-b5`'s sandbox — `personal-website-1d`'s had `playwright-core` reachable via `node_modules/.bin` and used it for a real headless repro (now cleaned up, confirmed no trace in `package.json`/`package-lock.json`/`node_modules`). **Lesson:** "no browser tool" is a per-session/per-sandbox fact, not a project-wide one — state it as local, and check again each session rather than trusting a prior session's negative result.

3. **⚪ DISPOSED (accepted gap) — M6 Lighthouse scores unmeasured.** No session on the team has a Lighthouse CLI available in its sandbox, so section 10's "Performance 90+ / Accessibility 95+" targets were never verified with an actual score. Everything Lighthouse would measure is otherwise addressed directly (bundle size ~153KB gzip well under the 200KB bar, `React.lazy` code-splitting, real contrast math, correct ARIA semantics). **Gavin's decision (2026-09-21): accept the gap, don't chase a number.** **Revisit if:** someone on the team gets real Lighthouse access, or Gavin wants to run it himself against a deployed build post-M7.

---

## 5. Deviations from PROJECT_BRIEF.md (need Gavin's sign-off)

PROJECT_BRIEF.md section 0.1 says not to swap libraries/versions without asking. This one was a hard blocker, not a preference, but it's still a deviation and needs your eyes:

1. **TypeScript pinned to `^5.9.3`, not `^7.0.2`.** `typescript@7.0.2` is genuinely `latest` on npm as of 2026-09-20 (it's the new native/Go-based compiler), but `typescript-eslint@8.70.0` (also latest) still declares a peer dependency of `typescript >=4.8.4 <6.1.0` — installing with TS7 fails with an unresolvable ERESOLVE conflict. No newer `typescript-eslint` major supports TS7 yet (checked npm dist-tags directly). Downgraded to the latest 5.x line so the toolchain installs and lints at all.
   - **Revisit when:** `typescript-eslint` ships a version whose peer range includes `^7`. Worth a quick `npm view typescript-eslint peerDependencies` check before each future session touches `package.json`.

2. **`LoginScreen`/`Hardware` render hardcoded dark regardless of theme preference — deviates from section 7.1 ("follows the current theme").** Flagged by the engineer during M6 (2026-09-21); fixing it means designing a light-mode version of the hardware illustration, which was judged bigger design scope than an M6 diff. **Gavin's call (2026-09-21): accept dark-only as intentional, not a bug to chase.**
   - **Revisit when:** never, unless Gavin changes his mind — this is a closed decision, not a tracked gap.

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
- `AboutDialog` now has a full focus trap (`useFocusTrap`, same hook built for M4's `Window`) — resolved during M6, confirmed present in code 2026-09-21.

---

## 7. Open items for Gavin (non-blocking, from brief section 16 + new)

1. Confirm veto-able defaults not yet built: #1 (active app name label), #2 (dimmed traffic lights), #7 (light mode look), #10 (default language detection), #12 (mobile flow) — these land in M3/M5.
2. **IN PROGRESS 2026-09-21:** real content — Gavin supplied his old site's export (`gavinle_site_content.md`); bio/skills/contact are usable as-is, Experience/Projects were placeholder-only in that export and Gavin is providing real details directly. See section 3 for the content-population task this feeds.
3. Choose the final logo (currently `faLemon` placeholder in `src/config/brand.ts`).
4. Decide domain / custom domain for Cloudflare Workers.
5. Visually confirm M1 at 1280/1440/1920 + tablet widths, and re-confirm M2 end-to-end once the zoom fix (section 4a #1) is committed.
6. Optional later: real avatar photo, resume link, project screenshots.

---

## 8. Milestone log (detailed, append-only — newest first)

### M6 (Polish, a11y, perf) — shipped, committed, pushed (2026-09-21)
Team restarted after a reboot (new session mapping: PM `personal-website-fa`, engineer `personal-website-a4`, reviewer `personal-website-dc`, tester `personal-website-52`). PM scoped M6 from `PROJECT_BRIEF.md` §10/§12 plus two carried-over backlog items and assigned it to the engineer.

**Engineer's batch — 9 files:** `Window.tsx` (dialog role/`aria-labelledby`), a real light-theme contrast bug fixed across 4 files (`opacity-60` text measured 3.87:1, below AA), `ControlCenter.tsx` (portaled + properly anchored — closes the M3-review backlog item on coincidental positioning), `App.tsx` (freezes the mobile/desktop breakpoint switch during boot/zoom transitions — closes the M5-review backlog item), `SkillsApp.tsx` (`role="progressbar"` added), `index.html` (`noscript` fallback with real name/title/contact content, meta/OG tags, a favicon fix), plus `Desktop.tsx`/`AppSheet.tsx`/`ExperienceApp.tsx`/`useDismissablePopover.ts` touched incidentally. `AboutDialog`'s full focus trap (open question since M3/M4) turned out already resolved via the shared `useFocusTrap` hook. Lint/test/build clean throughout, final bundle 153.21 kB gzip (well under the ~200KB bar).

**Reviewer — clean after 1 round:** two findings, both fixed and independently re-verified (`noscript` fallback initially missing real name/title/contact content per `PROJECT_BRIEF.md` §3 gap #17; a stale comment in `useDismissablePopover.ts` left over from the portal change).

**Tester — clean, no findings.** Real (non-headless) Chrome via a throwaway `playwright-core` install (installed/uninstalled cleanly, confirmed no trace). Verified with real measurements, not just visual checks: light-theme contrast at 5.2:1 via actual composited-color math (walked the full ancestor background chain); `ControlCenter` portal positions to the pixel via its formula, outside-click/Escape dismiss both work, auto-focus-on-open avoids the exact keyboard-regression class that hit M5's mobile Control Center; breakpoint freeze confirmed via settle-time measurement (2882ms baseline vs. 2995ms mid-resize, no restart/double-run); `noscript` fallback correct in both languages; dialog/progressbar roles correct in both languages. Supplementary VI/reduced-motion/mobile-375 sweep also clean. Evidence in `.qa/` (`tester-m6-dynamic.cjs`, `tester-m6-sweep.cjs`, results JSON, 10 screenshots).

**Two items closed by Gavin's decision, not by a code fix:**
1. `LoginScreen`/`Hardware` render hardcoded dark regardless of theme — a real deviation from §7.1, but Gavin accepted it as intentional rather than scope a light-mode illustration redesign (logged in section 5, deviation #2).
2. No Lighthouse CLI available anywhere on the team, so §10's Performance 90+/Accessibility 95+ targets are unmeasured — Gavin accepted the gap rather than chase a number neither the reviewer's static read nor the tester's real-browser checks can produce (logged in section 4a #3).

**M6 marked ✅ Done.** Committed and pushed. Gavin immediately followed up with the next phase of work — real content from his old site, per-skill icons/colors, and an ambient desktop widget — see section 3.

### M5 (Mobile) — shipped, committed, pushed (2026-09-20, ~19:20–21:20)
Engineer resumed M5 (per Gavin's go-ahead after a §0a usage-limit pause), finished `ContactApp.tsx`/`ProjectsApp.tsx` reflow to match the About/Skills pattern, confirmed `ExperienceApp.tsx` needed no change. Verification: lint/test/build clean (498.70 kB/153.02 kB gzip); real dynamic check via throwaway `playwright-core` against a real Chrome install (installed/uninstalled cleanly, confirmed no trace) across 375×812, 414×896, 667×375 landscape, both themes/languages, reduced motion. 21 screenshots in `.qa/` (`m5-*`).

**PM sanity pass:** read the two highest-risk diffs — `App.tsx`'s `RestartBootGate` extraction (shares the previously-buggy §8a #3 boot/inert mechanism between desktop `Experience` and new `MobileExperience`) and `ControlCenter.tsx`'s desktop/mobile split (`ControlCenterFields` extracted, desktop JSX preserved verbatim) — plus the two just-finished app files. Clean, mechanical, matches the report.

**Reviewer's static review — clean, one non-blocking nit accepted as a known edge case:** `Root()`'s live `useIsMobile()` switch can restart an in-flight zoom/boot animation if the viewport crosses 768px mid-transition (self-healing, not stuck — `session.phase` lives above `Root`); realistic trigger is a desktop browser resize, not a real phone rotating. Logged, not fixed — revisit only if M6 touches boot/zoom logic anyway.

**Tester's dynamic pass — 1 blocking bug, 2 scope questions resolved by Gavin:**
1. **Mobile Control Center's appearance/brightness controls were physically unreachable at 375×812** (panel rendered 178 of 209px above the viewport) — `ControlCenter.tsx`'s mobile panel (`fixed inset-x-3 bottom-4`) was resolving against `HomeScreen.tsx`'s `.glass-panel` (`backdrop-filter`) status-strip parent as its containing block instead of the viewport, since that parent isn't full-viewport/fixed the way desktop's `MenuBar` is. Confirmed via a real (non-forced) Playwright click timing out "outside the viewport."
   - **Engineer's fix:** portaled the panel to `document.body`, extended `useDismissablePopover` with an `extraContainerRef` param to track the portaled subtree. Reviewer confirmed clean (hand-traced dismiss-logic changes, both directions).
   - **Tester's re-test found a NEW blocking regression the portal introduced:** keyboard users could no longer reach the panel at all — Tab from the trigger jumped straight to the home screen's icon grid (next in the *original* tree's document order, since the panel was no longer DOM-adjacent), and `useDismissablePopover`'s focusout logic dismissed the panel on the very first Tab before any control was ever focused.
   - **Engineer's 2nd fix:** auto-focus the panel's first control on open (mobile-only, same pattern as `AppSheet`/`AboutDialog`). Reviewer confirmed clean (traced the effect-ordering/focus-race concern by hand). **Tester's final re-test: clean** — full 12-Tab trace confirms all 5 controls reachable, panel dismisses-and-continues past the last control (not a trap), Escape still works.
2. Gavin resolved: no mobile Restart/Log Out entry point is intentional M5 scope, deferred to a later milestone (`RestartBootGate`'s mobile wiring stays untested-on-mobile for now).
3. Gavin resolved: the width-only `useIsMobile()` breakpoint (real phone landscape falls back to desktop) is acceptable as-is — section 7.9's literal bar is met either way.

**M5 marked ✅ Done.** Committed as `fd4835a`, pushed to `origin/main`. Working tree confirmed clean afterward. Same commit also updated `CLAUDE.md`/`PROGRESS.md` §0 to the new engineer↔reviewer direct-loop workflow (see section 0/0a) — Gavin's call, made mid-M5, effective from the Control Center bug-fix round onward.

### Batch committed + pushed; §8a #4 disposed by Gavin; M5 up next (2026-09-20, ~19:15)
PM session `personal-website-b5` was restarted after a `/clear`. Re-read `CLAUDE.md`/`PROGRESS.md`, ran `ListAgents` and confirmed all 3 peer sessions (`personal-website-1d` engineer, `personal-website-f5` reviewer, `personal-website-30` tester) still live and idle, matching the mapping already recorded in section 0 — no re-bootstrap needed. Checked `git status`/`git log` and found the two open items from the previous "Next up" had, in fact, already been actioned outside this session: `105592b` (M4) and `cabedfe` (the 3 §8a fixes) were already committed and pushed to `origin/main` (working tree clean, local `main` matches `origin/main` exactly) — the PROGRESS.md text just hadn't been updated to reflect it yet, so it still read as "waiting on Gavin." Brought Gavin the one remaining real decision (§8a #4 disposition) plus a confirmation on the already-landed commit; he confirmed the commit and chose to accept §8a #4 as an unconfirmed edge case (logged in section 4a #0). Updated this file's sections 1–4a to match reality. Proceeding to assign M5 to the engineer next.

### Tester's M4 + retest pass — 1 bug reopened, everything else clean (2026-09-20, ~18:10)
Tester (`personal-website-30`) ran with headless Chromium again (temp-installed `playwright-core`, fully uninstalled after, confirmed via `npm uninstall` + grep — same clean process as its first pass). 43 screenshots + 5 repro scripts in `.qa/` (`tester-m4-*`/`tester-retest*` prefix), nothing deleted. Confirmed no real (non-headless) browser access in its sandbox either — did not re-attempt §8a #4 (correctly avoided submitting a second headless data point).

**#3 (keyboard focus behind restart overlay) — REOPENED, not fixed.** This is the important finding: both PM and the reviewer independently traced the 2nd-round `desktopInert`/`onExitComplete` fix and concluded it correctly held `inert` through the full exit fade. The tester's live repro proved otherwise: polling for the exact moment `inert` lifts and immediately sending keystrokes, **2 Tabs reliably reaches a live control while the overlay is still 60–98% opaque**, and **Enter actually activates it** — they watched the Control Center panel genuinely open mid-fade (`ccPanelOpened: true` at opacity 0.63–0.92). So `onExitComplete` is firing far earlier than the exit animation's real visual completion — a timing assumption, not a logic bug, that two independent static reads both missed. Sent back to the engineer with the concrete evidence and asked for an actual timing measurement (not another static read) before re-fixing; possible root cause floated (not confirmed): a Motion v13.4.0-specific `onExitComplete` timing quirk, in the same spirit as the already-documented M2 ref-timing quirk. Reviewer notified (informational, not blaming) since its recheck confirmation didn't hold up.

**#1 and #2 — confirmed fixed,** verified via `getBoundingClientRect`/`scrollWidth` measurements at 375/414px, not just visual screenshots.

**M4 dynamic pass — clean.** Single-window/replace-not-stack, no-op on re-clicking an open icon, focus-in-on-open (redone cleanly after an initial contaminated run), Escape-only-when-focused-scoped-correctly (doesn't leak to closing the window from Control Center), focus-restore-to-dock-icon, all 5 apps' EN/VI content (no unexpected English leakage), Projects detail view + Back button. **Drag constraint hammered specifically per PM's ask** — tested both post-settle and mid-entrance-animation (~30ms after open, before the scale animation's `onAnimationComplete`) — fully clamped both times, the M4 Motion bug stayed fixed under direct pressure. One transient console 404 seen once, not reproducible on a clean re-run — logged for the record, not treated as a bug.

**Landscape phone widths (667×375, 812×375) — NOT a regression**, contrary to the reviewer's advisory concern. Measured directly: Login button fully reachable with zero scrolling at both widths. The page does become vertically scrollable (the decorative `aria-hidden` hinge/base illustration below the screen box pushes total height past the viewport), but nothing functional is out of reach.

**§8a #4 — still unconfirmed.** Neither the engineer nor the tester has real (non-headless) browser access. No session in the current team has been able to confirm or deny this from a real browser — worth raising with Gavin directly rather than continuing to ask peers who've now all said no.

### Engineer's 3rd attempt at #3 — empirically verified this time, pending independent tester re-confirmation (2026-09-20, ~18:25)
Engineer switched mechanisms rather than re-tuning the same one: named `variants={{visible:{opacity:1}, hidden:{opacity:0}}}` on the overlay's `motion.div` (`initial="hidden"`/`animate="visible"`/`exit="hidden"`), with `onAnimationComplete={(definition) => { if (definition === 'hidden') setDesktopInert(false) }}` — the per-element completion callback (which reports which variant target was just reached) instead of the `AnimatePresence`-level `onExitComplete` that was empirically confirmed unreliable last round. Root cause of the original unreliability was **not** identified (engineer didn't dig into Motion's internals) — this is a mechanism swap, not a diagnosed-and-patched bug.

**This time the engineer did its own empirical timing verification before reporting**, not just a code read: found a real Chrome install, used `playwright-core` in headless mode pointed at it (same throwaway install/uninstall pattern as before, confirmed clean afterward) to poll `[inert]` + live `getComputedStyle().opacity` every 10-15ms through 3 runs (2 normal motion, 1 reduced motion). Results: `inert` lifted only after opacity decayed to ~0.001-0.003 (essentially fully faded), at timings matching the expected boot+fade duration (~3053-3060ms normal, ~1659ms reduced motion) — `Tab,Tab,Enter` only activated a control once the overlay was confirmed `GONE` from the DOM, not mid-fade. PM independently re-ran lint/test/build (clean, matched: 494.16 kB/152.39 kB gzip) and read the actual diff — the variants/`onAnimationComplete(definition)` mechanism is sound and matches Motion's documented per-element completion semantics.

**Given the last "fix" also looked correct on a careful static read (twice) and wasn't, this round's actual acceptance gate is the tester independently re-running their own original repro script** (`tester-retest3b-activation.cjs`, not the engineer's variant of it) — sent to the tester now, reviewer also asked for a quick static sanity pass in parallel. Not accepting this as closed until the tester's own script confirms it live.

**Reviewer's static sanity pass — clean, one cheap non-blocking hardening item.** Traced the interruption case (fast restart superseding an in-flight enter animation) — no misfire path, `onAnimationComplete` only ever fires for a target actually reached. Grepped for variant-name collisions — none (`variants=` used in exactly one place in `src/`). One real fragility, PM confirmed by reading the exact lines: `App.tsx:117`'s `if (definition === 'hidden')` has no compiler link back to the `variants={{visible:..., hidden:...}}` object at line 111 (Motion's `definition` param types as a bare `string`, not literal-checked against the component's own variant keys) — if the variant keys are ever renamed, `tsc` gives zero warning and this exact bug class could silently return. Sent to the engineer as a quick, non-blocking fold-in: extract a shared `HIDDEN_VARIANT` constant used in both places.

**Tester's independent re-confirmation — §8a #3 is genuinely resolved.** First run of their unmodified original script came back with a `null` reading (overlay not found at all by the time Tab landed) — rather than trust a single ambiguous result, they built a tighter 3-run check (5ms polling, `inert`-lift and overlay-presence/opacity sampled in the same `evaluate()` call, no round-trip gap between the two reads). All 3 runs: overlay fully removed from the DOM at the exact instant `inert` lifts — not just low opacity, gone. Never caught a single frame of overlap. **This is the confirmation the fix needed** — accepting §8a #3 as closed, pending only the cosmetic `HIDDEN_VARIANT` constant fold-in and reviewer's final sign-off once that lands.

**Constant fold-in done, PM-verified.** Engineer added module-scope `OVERLAY_VISIBLE`/`OVERLAY_HIDDEN` constants + an `OVERLAY_VARIANTS` object built from them, used at all 4 call sites (`variants`, `initial`, `animate`/`exit`, `onAnimationComplete` check), and updated a stale in-code comment. PM independently re-ran lint/test/build (clean, matched: 494.16 kB/152.42 kB gzip) and read the diff directly — correct, mechanical extraction, no behavior change. Sent to reviewer for a final quick look before considering this fix cycle fully closed.

**Status: all 3 confirmed §8a regressions (login clipping, Control Center overflow, keyboard-focus-behind-overlay) are now fixed and independently verified — dynamically, not just statically.** Reviewer's final sign-off on the constants fold-in landed clean (no stray literals, opacity mapping correct, no per-render object churn). §8a #4 (possible reduced-motion crash) remains unconfirmed; no session on the current team has real (non-headless) browser access. **The fix batch + M4 are both ready for Gavin's commit decision** — #4 is a separate open question for Gavin about how (or whether) to get a real-browser check, not a commit blocker in itself.

### Reviewer's review of the 3 §8a bug-fix files — 2 should-fix, sent back to engineer (2026-09-20, ~17:45)
Reviewer (`personal-website-f5`) reviewed `Hardware.tsx`, `ControlCenter.tsx`, `App.tsx`. No blocking findings. PM independently confirmed both should-fix items by reading the actual code before sending them on.

1. **`App.tsx:70` — the `inert` timing gap PM had logged as non-blocking is actually a real functional bug.** Reviewer traced it precisely: `inert` lifts synchronously the instant `showBootOverlay` goes false — at the *start* of the exit fade, not after — and during that window a keyboard user who Tabbed into Desktop can fire a real keyboard-activated action (Enter/Space on a focused element bypasses hit-testing/pointer-events entirely, unlike a mouse click). A real violation of section 6, keyboard-specific. **PM reclassified this from "non-blocking, logged" to should-fix** based on the reviewer's sharper trace — sent back to the engineer with a concrete fix direction (gate `inert` off the exit animation's completion, same pattern as `Window.tsx`'s `entered`/`onAnimationComplete` drag-gating, which PM confirmed exists at `Window.tsx:30`).
2. **`ControlCenter.tsx:52` — confirmed the `fixed right-3 top-8` positioning is a coincidence, not a fix**, and sharpened PM's own analysis: the containing block is `MenuBar`'s *padding* edge, 1px inside its border (`.glass-panel`'s `border: 1px solid`), so the computed position is technically ~1px off true-viewport — imperceptible today but proof it's not principled. Reviewer flagged, and PM confirmed by reading `useDismissablePopover.ts:19,26` and `ControlCenter.tsx:38` (`containerRef` wraps both trigger and panel), that a straight portal fix (like `AboutDialog`) is **not** a drop-in here — it would break both the outside-pointerdown and focusout dismiss logic, since a portaled panel is no longer a DOM descendant of `containerRef`. That's shared code with `LogoMenu`, so a real fix is bigger surgery than this round warrants. **PM's call: require a documentation comment now** (cheap, low-risk — flags that the positioning is load-bearing on `MenuBar`'s exact geometry so a future edit doesn't silently break it), **defer the proper portal-based hardening to the M6 backlog.**

**Advisory (not yet confirmed, added to tester's task):** reviewer flagged that the `Hardware.tsx` `min-h-[400px]` fix engages below ~640px assembly width — which also covers landscape phone widths (e.g. 667×375, 812×375), not just the two portrait widths the fix targeted. PM traced the CSS and thinks the likely outcome is the page becomes vertically scrollable rather than hard-clipped (the outer wrapper uses `min-h-dvh`, a floor not a fixed height), but couldn't confirm without a real render — sent to the tester as an addition to its in-progress pass.

### M4 recheck (reviewer) — clean
Reviewer checked all 5 app files (not just the 3 named), confirmed the 4 aria-labels route through `t()`, `CHANNEL_LABEL` is now id-keyed, and the education badge works — no blocking/should-fix findings, one non-blocking suggestion (pre-existing `as Record<...>` cast pattern shared with `CHANNEL_HREF`). PM independently re-ran lint/test/build (exact match: 14/14 tests, 493.89 kB/152.28 kB gzip main + same 5 app chunk sizes) and grepped the actual fix lines across all 5 files — confirmed. **M4 is review-clean.**

### M4 fixes made, PM-verified; reviewer cleared and re-briefed; PM told to hold (2026-09-20, ~16:00–16:10)
**Engineer** made all 3 fixes: (1) the 4 hardcoded `aria-label`s now route through new `uiStrings` entries (`notesNavLabel`, `skillCategoriesNavLabel`, `projectFiltersNavLabel`, `contactChannelsNavLabel`) via `t()`; (2) `ContactApp.tsx` got a `CHANNEL_LABEL` id-keyed `Record` (same pattern as the existing `CHANNEL_ICON`/`CHANNEL_HREF`), replacing the 3 positional lookups; (3) `ExperienceEntry.kind` is now used — education entries get a visually distinct timeline dot (ring vs. solid) and a small badge with a graduation-cap icon and localized "Education"/"Học vấn" label. Lint/test/build clean. **Engineer flagged, unprompted, that it has no browser tool in its sandbox to visually confirm these** — good instinct per CLAUDE.md's rule rather than silently asserting confidence it didn't have.

**PM verification:** read all 3 fixes directly in `content.ts`, `ContactApp.tsx`, and `ExperienceApp.tsx` — all correct, matching the report exactly. Independently re-ran lint/test/build (clean, same 5 app chunks, only individual chunk sizes shifted slightly from the new strings/markup). **Also checked for a browser tool in this session's own sandbox — none available either.** Per PROGRESS.md's own standing lesson (§4a#2: browser tooling is per-sandbox, not universal, don't assume), this is now logged rather than silently skipped: the education badge and the 4 aria-label strings in VI are unverified visually by anyone yet. Not treated as a blocker — folded into the tester's already-queued M4 task instead of spinning up a new special request.

**Gavin then cleared the reviewer session** (`personal-website-f5`) to save credit, and asked the PM to hold off contacting any of the three sessions further until told to continue, and to proactively flag safe-clear points instead of waiting to be asked. PM re-briefed the reviewer from scratch (it has zero memory of the M4 review above, but nothing is actually lost — it's fully captured in this file) and confirmed it re-oriented. PM is now holding as instructed; nothing further sent to engineer/reviewer/tester pending Gavin's go-ahead.

### M4 review complete — 2 should-fix, sent back to engineer (2026-09-20, ~14:05)
Reviewer (`personal-website-f5`) re-ran lint/test/build (matched PM's numbers), confirmed real per-app code-splitting in the build output, grepped for Apple/trademark leaks (clean). **No blocking findings.**

**Should-fix (PM independently confirmed both by reading the code, then sent to the engineer):**
1. Hardcoded English `aria-label`s in all 4 new app files (`AboutApp.tsx:13`, `SkillsApp.tsx:13`, `ProjectsApp.tsx:58`, `ContactApp.tsx:27`) — violates `CLAUDE.md`'s binding i18n rule; a VI-language screen-reader user would hear these in English. Confirmed via grep: exactly the 4 lines reported, nothing else missed.
2. `ContactApp.tsx` looks up action-button hrefs by id (`CHANNEL_HREF.email/.linkedin/.github`, safe against reordering) but looks up their visible labels by array position (`contactChannels[0/1/2].label`). Since section 1 explicitly promises Gavin can reconfigure content by editing `content.ts` alone, reordering `contactChannels` there is a very plausible future edit — and it would silently mismatch a button's icon/link with the wrong label. PM read the file and confirmed the inconsistency exactly as described.

**Bundled in as a quick optional fix (not blocking, but cheap to batch):** `ExperienceEntry.kind` (`'work' | 'education'`) is set in `content.ts` but never read in `ExperienceApp.tsx` — asked the engineer to use it to visually distinguish the education entry rather than leave it inert.

**Deferred to M6 backlog (not blocking):** `SkillsApp`'s level bars have no `role="progressbar"` (reviewer's own assessment: not actually inaccessible, the percentage is already shown as text); a defensive timeout fallback for `Window`'s `onAnimationComplete`-gated drag-enable, in case that event somehow never fires (reviewer confirmed the current blast radius is narrow — only drag is affected, not the whole window — and this exact pattern is already relied on elsewhere in the codebase for the M2 zoom transition, so it's an accepted existing risk shape, not a new one).

**Reviewer also verified, unprompted beyond the specific questions asked:** the drag-gating has no reachable stuck-forever path; `Window`'s non-modal Escape-when-focused-only behavior and bidirectional Tab flow (window → dock forward, window → menu bar backward) both work as designed by tracing actual DOM order in `Desktop.tsx`; `DockHandle` focus restoration has no reachable desync since all 5 dock icons stay mounted regardless of which app is open.

### M4 — Window system & apps — 🟡 Code complete, awaiting review + test (2026-09-20, ~13:50)
**What shipped (engineer: `personal-website-1d`):**
- New: `components/desktop/Window.tsx`, `components/apps/{AboutApp,SkillsApp,ExperienceApp,ProjectsApp,ContactApp}.tsx`.
- Modified: `Desktop.tsx` (window layer + `React.lazy`-loaded apps), `Dock.tsx` (dock clicks now open real windows; exposes `DockHandle.focusApp` via `forwardRef`/`useImperativeHandle` for focus restoration), `data/content.ts` (+all 5 apps' bilingual placeholder content, `TODO(gavin)`-marked per the existing pattern).
- Covers PROJECT_BRIEF.md 7.7–7.8: single window (opening another replaces it), default sizing, title-bar-only drag constrained to the free area, traffic-light buttons (red works, yellow/green disabled), internal scroll, Escape-when-focused close, focus-in-on-open/restore-on-close, and all 5 apps in their spec'd layouts (notes/settings/timeline/file-browser/mail-style).

**Real bug found and fixed — worth understanding, it's a non-obvious Motion interaction:** a `motion.div` that both scale-animates in on mount (`initial={{scale:0.96}} → animate={{scale:1}}`) *and* has `dragConstraints` resolves the constraint box against the pre-settle scale, even after the entrance animation visually finishes — so drag let the window overshoot the free area by a few percent (~17.6px/~12px, matching the 0.96↔1 scale ratio). Fixed by gating `drag`/`dragConstraints` behind the entrance animation's actual `onAnimationComplete` (reduced-motion starts already-"entered" since there's no scale mismatch there). PM read `Window.tsx` directly and confirmed the gating logic is correct; spot-checked `.qa/m4-03-dragged-constrained.png` — window sits flush at the free area's exact top-left corner, no overshoot visible.

**Process lesson worth keeping (engineer disclosed this unprompted):** the engineer's first diagnosis was wrong (blamed `useDragControls()` call site) and appeared to fix a narrow isolated test — but that test had incidentally also dropped the scale animation, masking that nothing was actually fixed. Only caught because the engineer re-tested against the *real app* rather than trusting the isolated test, which immediately showed the overshoot was still there. **Lesson: an isolated repro passing is not the same as the actual app working — always re-verify a fix against real usage before reporting it done**, especially when a test's setup differs from the real component's props/context in any way.

**Design decisions flagged for Gavin (none locked by the brief):**
1. `Window` is deliberately not modal — no focus trap (unlike `AboutDialog`). Escape closes it only while focus is inside (scoped `onKeyDown`, not a document listener), matching section 7.7's literal wording ("Esc closes the window when focused"). Tab flows freely from window content into the dock/menu bar.
2. Drag area is the *strict* free area between menu bar and dock (window can never go even partially under either) — stricter than the brief's stated minimum ("never fully under the menu bar or off-screen"), chosen for simplicity and guaranteed discoverability.
3. Apps are `React.lazy`-loaded per section 10's performance bar — confirmed in the build output as separate chunks (0.86–3.44 KB each).

**Verification:** tsc/eslint/vitest (14/14)/build all clean (per-app code-splitting confirmed: 5 separate small chunks). Live Playwright pass covering app-open/replace-not-stack, already-open-icon-does-nothing, close/disabled-buttons, title-bar-only drag, drag constraint, Escape-only-when-focused (confirmed it does NOT close from elsewhere, e.g. Control Center), focus in/out, Projects detail view, EN/VI content. Zero console errors. **PM verification:** read `Window.tsx`, `Desktop.tsx`, `Dock.tsx` directly (not just the report), independently re-ran lint/test/build (matched: 493.11 KB main chunk + 5 app chunks), spot-checked the drag-constraint screenshot. Handed to reviewer and tester in parallel (see section 2).

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

## 8a. Tester's first QA pass — 4 real bugs found across M1/M2/M3 (2026-09-20, ~16:40)

Tester (`personal-website-30`) ran the full M0–M3 dynamic pass assigned earlier: tested commit `638cc61` in an isolated git worktree (never touched the engineer's uncommitted M4 files), verified lint/test/build first, used `playwright-core` for dynamic testing, fully uninstalled it and removed the worktree afterward, 31 screenshots + repro scripts kept in `.qa/` (`tester-*` prefix). PM independently verified findings #1–#3 by reading the actual source (not just trusting the report); #4 could not be independently reproduced (no browser in this sandbox either) but PM traced a plausible root cause — see below.

**#1 — Login screen clipped at 375/414px width. PM-confirmed.** `Hardware.tsx`'s screen box is `aspect-[16/10] w-full` — height is derived purely from width (`min(1100px, 92vw)`), with no regard for the login content's actual required height. At 375px this computes to roughly a 216px-tall box (tester measured ~197px in the real rendered layout, close enough given padding/border eaten from the CSS `%` box-sizing) against content that needs 350px+, so `overflow-hidden` clips the avatar button and part of the Login button. Mouse users effectively can't see/click Login at these widths; Enter still works since that listener isn't gated on visibility. Not present from 768px up; landscape at the same device widths is unaffected (plenty of width there).

**#2 — Control Center panel overflows off the left edge at 375px (~41px) and marginally at 414px (~2px). PM-confirmed structurally.** `ControlCenter.tsx:52` is a fixed `w-64` (256px) panel `absolute right-0` against its trigger button. PM read `MenuBar.tsx` and found the button sits *before* the clock/date text in the right-hand flex group (`<ControlCenter /><span>clock</span>`), so it's well inboard of the viewport edge, not flush against it — there isn't 256px of room to its left at 375px. Visible effect: "Appearance"/"Brightness"/"Language" labels get truncated to "earance"/"htness"/"guage". Not present at 768px+.

**#3 — Keyboard focus not blocked behind the Restart boot overlay. PM-confirmed via grep.** The overlay (`App.tsx:72`, `fixed inset-0 z-50`, fully opaque) blocks mouse interaction fine, but has no `aria-hidden`/`inert` on itself or the `Desktop` behind it, and PM confirmed via grep that no such attribute exists anywhere nearby. A keyboard user can Tab through and activate Control Center, all 5 dock icons, and the Logo menu while they're invisible behind the boot screen — a real violation of section 6's "ignore further input" during booting, specific to the keyboard modality (mouse users are protected by the opaque overlay).

**#4 — Reproducible renderer crash under reduced motion (100% in headless Chrome, tester's own environment) — severity TBD, needs real-browser confirmation.** Repro: log in, open the Logo menu, click Log Out within ~150ms of the desktop first appearing (i.e. during the reduced-motion crossfade-in, before `zoomInComplete` fires). Waiting 500ms+ first does not crash. Tester isolated it to pure timing, not the click target, and explicitly flagged they could not verify this in a real interactive browser (headless-only sandbox) — asked for confirmation before ranking it higher, since it might be a headless/automation-only artifact.

PM's independent trace of a plausible mechanism (from reading `App.tsx`, not from running it): under reduced motion, `<Desktop/>` renders live and interactive as a child of the fade-in `motion.div` *while `session.phase` is still `'zooming-in'`* — the phase only flips to `'desktop'` when `onAnimationComplete` fires ~250ms later. When it does, the JSX tree shape changes (`Desktop` moves from being wrapped in that `motion.div` to being a top-level sibling in a different conditional branch), which plausibly forces React to unmount and remount `Desktop`'s whole subtree. Interacting with `Desktop` (e.g. clicking a Logo menu item) in the ~150–250ms window means a click can be mid-flight against a subtree that's about to be torn down — a believable crash trigger independent of headless-vs-real, though PM agrees severity should wait on real-browser confirmation before treating it as a hard blocker. Root architectural concern regardless of crash-reproducibility: rendering live interactive content before the phase that's supposed to represent "on the desktop" has actually been reached is fragile by construction.

**Nit (not blocking):** `LoginScreen`'s global `Enter` keydown listener stays mounted and fires during `'zooming-out'` too (the reduced-motion path remounts `LoginScreen` then) — harmless since the reducer's phase guard no-ops `LOGIN` outside `'landing'`, but technically not "ignored at the listener level." PM confirmed this matches the reducer guard exactly.

**Everything else the tester checked came back clean** — state machine robustness (rapid clicks/Escape/Enter spam during every phase), preferences persistence + graceful degradation under a throwing/corrupted localStorage, full i18n correctness (no English leakage in VI mode anywhere), timezone/clock/date formatting, full keyboard-only login→desktop→menu→dialog flow, responsive layout at 768/1280/1440/1920 across all 4 theme×language combos, landscape at phone-ish sizes, and reduced-motion timing (boot ~1.53s vs. spec's ~1.5s, crossfade-out working correctly outside the #4 crash window).

**Status:** PM is holding per Gavin's explicit request (section 2) — none of this has been sent to the engineer yet, and the tester has not yet been handed the M4 task it's waiting on. Awaiting Gavin's go-ahead.

---

## 9. How to keep this file honest (for future sessions/agents)

- Update the status table and add a dated log entry **every time** you finish a chunk of work, not just at milestone boundaries.
- If you can verify something a prior session couldn't (e.g. you have a working browser tool), do it and flip the status — don't just trust this file's "not verified" forever.
- If you deviate from `PROJECT_BRIEF.md` sections 2 or 13, log it under section 5 immediately, with a reason and a revisit condition, before writing more code.
- Keep section 7 (open items for Gavin) in sync with brief section 16 as new non-blocking questions come up.
- **Check for peer sessions before editing.** If a peer is live and working on a file, coordinate via a message before touching it — see the warning at the top of this file. Don't assume a limitation of your own environment (e.g. "no browser tool") applies to every session; state it as local to you.
