# Project Brief: Interactive macOS-Style Personal Website

Owner: Gavin (Software Developer)
Status: Spec approved, ready for implementation
Audience: Claude Code (implementer). Read this whole file before writing code.

---

## 0. Instructions for Claude Code

1. Treat sections 2 (Locked Decisions) and 13 (Out of Scope) as binding. Do not add features, change styles or swap libraries without asking Gavin.
2. Work milestone by milestone (section 12). Finish and verify one milestone before starting the next. After each milestone run `npm run lint`, `npm run build` and the unit tests, and summarize what changed.
3. Where this brief says "Assumption (veto-able)", implement the stated default and list it in your final summary so Gavin can override it.
4. Use current stable versions of all dependencies. Check official docs before using any API you are not certain about (especially Tailwind, Motion/Framer Motion, Wrangler).
5. Never use Apple assets, names or artwork in the shipped UI (see section 5).
6. All user-facing strings live in the content/i18n layer. No hardcoded English or Vietnamese text inside components.

---

## 1. Goal and Success Criteria

**Goal:** A personal portfolio website that makes visitors feel like they are using a big desktop computer with a macOS "Liquid Glass" style interface.

**Success criteria:**
- A visitor lands on a realistic space-gray desktop computer, clicks Login, watches a boot screen, and the view zooms into a full-screen desktop.
- The desktop has a menu bar, a dock with five apps, and one draggable app window at a time showing About me, Skills, Experience, Projects and Contact content.
- It works in English and Vietnamese, in dark and light mode, on desktop and on phones.
- Deployed on Cloudflare Workers, fast, accessible, and free of copyrighted Apple material.
- Gavin can replace all placeholder content by editing one data file.

---

## 2. Locked Decisions (from Gavin)

| Area | Decision |
|---|---|
| Delivery | React + Vite project, multi-file |
| Stack | TypeScript, Tailwind, Framer Motion |
| Visual style | Liquid Glass (translucent, macOS Tahoe-like) |
| Behavior depth | Medium: draggable windows, dock hover magnification, working menu bar menus |
| Landing | Full computer hardware in space gray/dark, with keyboard and mouse, then zoom into full-screen after login |
| Landing info | Avatar, name, title, live clock/date, location auto-detected from visitor timezone |
| Login | Just click Login (or the avatar). No password field |
| Boot | Plays right after clicking Login, before the zoom. Apple-style progress bar. No sound |
| Logo | FontAwesome fruit icon that is NOT an apple, as a placeholder to change later |
| Menu bar | Logo menu (About this site, Log Out, Restart to replay boot), Control Center-style dropdown (brightness, dark/light toggle, EN/VI toggle), live clock and date on the right. No per-app menus, no status icons |
| Wallpaper | Slowly animated dark gray gradient |
| Dock | Five apps only, with hover magnification. No desktop icons |
| Apps | About me, Skills, Experience, Projects, Contact |
| App look | Each app resembles a real macOS app (About me = notes-style, Skills = settings-style, Experience = calendar/timeline-style, Projects = file-browser-style, Contact = mail-style). Original design only, see section 5 |
| Windows | One at a time; opening another replaces it. Close and drag only. No minimize/maximize |
| Contact | Mail-style window with buttons/links (email, LinkedIn, GitHub). No form |
| Language | Bilingual EN/VI, toggle inside Control Center |
| Phones | iOS-style home screen with app icons |
| Content | Placeholders now, real content later |
| Placeholder identity | "Gavin", "Software Developer", FontAwesome user icon as avatar |
| Icons | FontAwesome only |
| Sound | None |
| Hosting | Cloudflare Workers (static assets) |

---

## 3. Project Manager Review: Gaps Found and Resolutions

Every item below was missing or ambiguous in the original plan. Each has a default so nothing blocks implementation. Items marked **Veto-able** should be confirmed by Gavin at review.

| # | Gap | Resolution | Status |
|---|---|---|---|
| 1 | Skipped per-app menus, but a desktop menu bar normally shows the active app name | Show the active app name as a static, non-interactive label next to the logo (shows "Desktop" when no window is open) | Veto-able |
| 2 | Window has three colored buttons but only close works | Render all three; yellow and green appear dimmed/disabled, like a non-resizable window | Veto-able |
| 3 | Keyboard and mouse on the landing screen: interactive or decorative? | Decorative. Pressing Enter also triggers Login (accessibility). Login button is a real `<button>` | Veto-able |
| 4 | "Log Out" behavior undefined | Reverse zoom back to the landing hardware view, window closed, theme and language kept | Resolved |
| 5 | "Restart" behavior undefined | Desktop fades to black, boot screen replays, desktop returns. No zoom | Resolved |
| 6 | "About this site" content undefined | Small glass dialog: site name, "Built with React, Vite, Tailwind, Framer Motion", link to GitHub repo (placeholder URL), close button | Resolved |
| 7 | Light mode requested (toggle) but only a dark wallpaper defined | Light mode = light glass panels, light gray animated gradient, dark text. Dark is default | Veto-able |
| 8 | Brightness slider semantics | Applies a CSS brightness filter on a full-screen overlay (range 40% to 100%, default 100%). Not persisted | Resolved |
| 9 | Location from timezone is not the visitor's real location | Use `Intl.DateTimeFormat().resolvedOptions().timeZone`, take the city segment (e.g. `Asia/Ho_Chi_Minh` becomes "Ho Chi Minh"). No geolocation permission prompts. Fallback: hide the location line | Resolved |
| 10 | Default language | Detect `navigator.language`: `vi*` gives VI, everything else gives EN. Persist user choice | Veto-able |
| 11 | Persistence | Persist theme and language in `localStorage` (wrapped in try/catch). Nothing else persists. Reload returns to the landing screen | Resolved |
| 12 | Phone flow undefined | Under 768px: no hardware frame. Login screen full-screen, then boot, then home screen with 5 app icons. Tapping an icon opens the app as a full-screen sheet with a close button. Control Center opens from a small icon at the top right | Veto-able |
| 13 | Tablets and small laptops | Between 768px and hardware size, scale the whole hardware illustration to fit the viewport (keep aspect ratio) | Resolved |
| 14 | Apple trademark risk in naming | See section 5. Never show the words Finder, Notes, Mail, Calendar, System Settings, iMac, macOS, Apple in the UI or page title | Resolved |
| 15 | Fonts: Apple's system font is proprietary | Use Inter (self-hosted via Fontsource). Do not reference the Apple system font stack | Resolved |
| 16 | No shareable deep links to apps | Out of scope for v1 (no router). Documented as a known limitation | Accepted |
| 17 | SEO and no-JS | Static `<title>`, meta description, Open Graph tags in `index.html`, plus a `<noscript>` block with name, title and contact links | Resolved |
| 18 | Motion sensitivity | Respect `prefers-reduced-motion`: replace zoom with a crossfade, shorten boot to 1.5s, freeze the wallpaper gradient | Resolved |
| 19 | No QA definition | Acceptance criteria per milestone (section 12) and a final Definition of Done (section 15) | Resolved |
| 20 | Real content not ready | Single typed data file with clearly fake placeholders and `TODO(gavin)` markers | Resolved |
| 21 | Backdrop blur performance on low-end devices | Limit blur layers (menu bar, dock, window, control center only). Provide a solid-color fallback when `backdrop-filter` is unsupported | Resolved |

---

## 4. Tech Stack and Constraints

- **Build:** Vite, React, TypeScript (strict mode)
- **Styling:** Tailwind CSS (current major version). Custom design tokens via CSS variables for theme switching
- **Animation:** Framer Motion (or its renamed successor package `motion`, use whichever is current, but only one)
- **Icons:** `@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-brands-svg-icons`. Import individual icons only (tree-shaking)
- **Font:** Inter, self-hosted via `@fontsource-variable/inter`. No Google Fonts requests
- **State:** React state and context only. No Redux/Zustand
- **i18n:** Lightweight custom solution: a `Localized<T> = { en: T; vi: T }` type and a `useLang()` hook. No i18n library
- **Tests:** Vitest for pure utilities (timezone-to-city, clock formatting, language detection)
- **Lint/format:** ESLint and Prettier with sensible defaults
- **Runtime constraints:** No backend, no analytics, no cookies, no third-party network requests at runtime
- **Browser support:** Latest two versions of Chrome, Edge, Safari, Firefox. Include `-webkit-backdrop-filter` (Tailwind handles this)

---

## 5. Legal and IP Guardrails (Strict)

Gavin's requirement: nothing copied from Apple. Implement all of the following:

1. **No Apple logo.** Use FontAwesome `faLemon` as the logo placeholder. Never use `faApple` or `faAppleWhole`. Keep the logo icon in a single constant (`src/config/brand.ts`) so it is a one-line change.
2. **No Apple wallpapers, icons, sounds or screenshots.** All artwork is CSS, SVG or FontAwesome.
3. **No Apple product names in visible UI or metadata.** App names are exactly: About me, Skills, Experience, Projects, Contact (localized). The hardware must not be labeled as any Apple product; no logo on the chin.
4. **Design is "inspired by", not traced.** Use original proportions and details for the computer body, dock and window chrome. Do not attempt pixel-accurate copies of Apple UI.
5. **Font:** Inter only.
6. Code comments may mention macOS for design context, but keep them out of user-visible strings, `<title>` and meta tags.

---

## 6. Experience Flow (State Machine)

States: `landing` then `booting` then `zooming` then `desktop`.

```
landing --(click Login / avatar / Enter)--> booting
booting --(progress reaches 100%)--> zooming
zooming --(zoom completes)--> desktop
desktop --(Log Out)--> zooming-out --> landing
desktop --(Restart)--> booting (no zoom) --> desktop
```

Rules:
- Reload always starts at `landing`.
- During `booting` and `zooming`, ignore further input.
- The state lives in one top-level reducer/context (`useSession`).

---

## 7. Component Specifications

### 7.1 Landing (desktop/tablet)
- Centered space-gray computer illustration built with CSS/SVG: thin-bezel display, chin, stand, plus a keyboard and mouse on a subtle surface. Soft shadow, subtle metallic gradient. Background: dark, quiet gradient.
- **Screen content (the login screen):** blurred wallpaper background, centered avatar (FontAwesome user icon in a circle), name "Gavin", title "Software Developer", live clock and date (updates every second), city from timezone, and a Login button. The avatar is also clickable.
- Login screen follows the current theme (dark default).

### 7.2 Boot screen
- Full-screen black inside the display area. Logo icon (placeholder fruit) centered, thin progress bar beneath it, styled like a classic boot bar (rounded, white on dark gray).
- Duration about 2.5 to 3 seconds total, non-linear progress (fast start, brief pause near 70%, quick finish). Not skippable. Reduced motion: 1.5s.

### 7.3 Zoom transition
- Measure the screen rectangle (`getBoundingClientRect`) and animate the hardware container (scale and translate) so the screen fills the viewport, then unmount the hardware and render the desktop full-screen. Must look seamless with no flash.
- Reverse for Log Out. Reduced motion: crossfade.

### 7.4 Desktop
- Layers: animated gradient wallpaper, menu bar (top, 28px), window layer, dock (bottom, floating), brightness overlay.
- Wallpaper: slow (about 30s loop) drifting dark gray gradient using CSS animation or lightweight canvas. Pause when the tab is hidden.

### 7.5 Menu bar
- Left: logo icon (opens the Logo menu), then the active app name label (static, bold).
- Right: Control Center icon (opens the dropdown), then live clock and date (locale-aware: en-US and vi-VN formats).
- Glass style, full width, sits above windows.

**Logo menu items:** About this site, separator, Restart, Log Out. Closes on outside click or Escape. Arrow-key navigable.

**Control Center dropdown (top right, glass panel):**
- Appearance: Dark / Light segmented control
- Brightness: slider (40% to 100%)
- Language: EN / VI segmented control
- Closes on outside click or Escape.

### 7.6 Dock
- Floating glass dock, centered at the bottom, five icon buttons (FontAwesome icons on rounded-square gradient tiles, original colors).
- Hover magnification (neighbors scale smoothly, spring animation), tooltip label above each icon, small indicator dot under the icon of the open app.
- Click: open that app (replaces current window). Clicking the already-open app does nothing.
- Magnification disabled on touch and reduced-motion.

### 7.7 Window system
- One window at a time. Default size: `min(880px, 90vw)` by `min(600px, available height)`. Centered in the free area between menu bar and dock, opens with a short scale-fade animation.
- Draggable by the title bar only, constrained to the desktop area (never fully under the menu bar or off-screen). No momentum. Position resets each time an app is opened.
- Title bar: three traffic-light buttons (red = close working; yellow and green dimmed/disabled), centered title.
- Content area scrolls internally. Esc closes the window when focused.
- Focus management: move focus to the window on open, restore to the dock button on close.

### 7.8 Apps (all content from the data file)

| App | Layout | Content |
|---|---|---|
| About me | Notes-style: left sidebar of notes (Bio, Interests, Fun facts), right note body | Short bio, focus areas, personal touch |
| Skills | Settings-style: left sidebar categories (Languages, Frontend, Backend, Tools), right panel with skill rows and level bars | 4 categories, 4 to 6 skills each |
| Experience | Timeline/calendar-style: vertical timeline with date blocks, role, company, bullet highlights | 3 placeholder roles plus 1 education entry |
| Projects | File-browser-style: sidebar (All, Web, Tools), grid of project "folders" (icon, name); clicking one opens a detail view with description, tech chips, and links | 4 placeholder projects |
| Contact | Mail-style: sidebar (Inbox-like list of channels), message-style card with a friendly note and buttons: Email, LinkedIn, GitHub | Email and social links as `TODO(gavin)` placeholders |

Design rule: recognizable structure, original visuals (see section 5).

### 7.9 Mobile (under 768px)
- Landing: full-screen login screen (no hardware), same info and Login button.
- After boot: home screen with wallpaper, top status strip (live clock, Control Center icon), and a grid of five large rounded app icons with labels.
- App open: full-screen sheet slides up, header with title and close button, same app content reflowed to a single column (sidebars become a top segmented control or list).
- Control Center works the same (appearance, brightness, language).

---

## 8. Internationalization and Content Model

- Types: `type Localized<T> = { en: T; vi: T }`.
- One file: `src/data/content.ts` exports typed objects for profile, about, skills, experience, projects, contact links, and UI strings.
- **Placeholders** must be realistic but obviously fake (for example "Acme Corp", "Project Name"). Mark every placeholder with a `// TODO(gavin)` comment. Do not invent real employers, degrees or dates. The only real facts allowed: name "Gavin" and title "Software Developer".
- Provide natural Vietnamese for every string, not machine-sounding literal translations.
- Switching language updates all visible text instantly without reload, and updates `<html lang>`.

---

## 9. Visual Design Tokens (Liquid Glass)

Define as CSS variables, swapped by `data-theme="dark|light"` on `<html>`.

- **Glass panel:** semi-transparent background (about 55 to 70% opacity), `backdrop-filter: blur(24px) saturate(160%)`, 1px translucent inner border, soft outer shadow, subtle top highlight gradient.
- **Radii:** window 16 to 20px, dock 24px, dock icons 14 to 16px, controls 10px.
- **Dark:** near-black graphite base, white text at 90% opacity, accent a soft blue.
- **Light:** light gray base, dark text, same accent.
- **Typography:** Inter, menu bar 13px medium, window titles 13px semibold, body 14 to 15px.
- **Motion:** springs for dock and window open; 200 to 300ms ease for menus.

---

## 10. Accessibility, Performance, Quality Bars

- Keyboard: every interactive element reachable by Tab; visible focus ring; menus support arrow keys and Escape; Enter triggers Login on the landing screen.
- Semantics: real `<button>`, `role="menu"` and `role="menuitem"` for menus, `role="dialog"` with `aria-labelledby` for windows and About dialog. Decorative hardware has `aria-hidden`.
- Contrast: text meets WCAG AA on glass backgrounds (verify both themes).
- Reduced motion honored (see gap #18).
- Performance: initial JS bundle under about 200 KB gzipped if reasonable; no images required (CSS/SVG only); lazy-load app windows with `React.lazy`; Lighthouse Performance 90+ and Accessibility 95+ on desktop.
- No console errors or warnings in production build.

---

## 11. Suggested Project Structure

```
/
  index.html
  wrangler.jsonc
  vite.config.ts
  package.json
  src/
    main.tsx
    App.tsx
    config/brand.ts            # logo icon constant, site name
    data/content.ts            # ALL content (EN/VI) with TODO(gavin) placeholders
    state/session.tsx          # landing/booting/zooming/desktop state machine
    state/preferences.tsx      # theme, language, brightness
    hooks/useClock.ts, useLang.ts, useReducedMotion.ts, useIsMobile.ts
    utils/timezone.ts, format.ts   (+ unit tests)
    components/
      landing/  Hardware.tsx, LoginScreen.tsx
      boot/     BootScreen.tsx
      desktop/  Desktop.tsx, Wallpaper.tsx, MenuBar.tsx, LogoMenu.tsx,
                ControlCenter.tsx, Dock.tsx, Window.tsx, AboutDialog.tsx
      apps/     AboutApp.tsx, SkillsApp.tsx, ExperienceApp.tsx,
                ProjectsApp.tsx, ContactApp.tsx
      mobile/   HomeScreen.tsx, AppSheet.tsx
    styles/index.css           # Tailwind + theme variables
```

---

## 12. Milestones and Acceptance Criteria

**M0. Scaffold**
- Vite + React + TS + Tailwind + Motion + FontAwesome + Inter + ESLint/Prettier + Vitest set up; `wrangler.jsonc` present; `npm run dev|build|lint|test` all work.
- Accept: blank themed page builds and lints clean.

**M1. Landing and login screen**
- Hardware illustration, login screen with avatar, name, title, live clock/date, timezone city, Login button. Theme variables in place.
- Accept: looks correct at 1280, 1440, 1920 widths and scales down on tablet; Enter and click both trigger the state change (to a stub).

**M2. Boot and zoom**
- Session state machine, boot screen with progress bar, zoom transition, reduced-motion variants.
- Accept: landing to desktop transition is smooth with no flash; Log Out and Restart flows work.

**M3. Desktop shell**
- Animated wallpaper, menu bar, logo menu, About dialog, Control Center (theme, brightness, language), live clock, dock with magnification and indicator.
- Accept: all menu behaviors in 7.5 and 7.6 work; theme and language persist across reload; keyboard navigation works.

**M4. Window system and apps**
- Window component (drag, close, focus handling) and the five apps with placeholder content in EN/VI.
- Accept: opening another app replaces the current one; drag is constrained; each app matches its layout in 7.8.

**M5. Mobile**
- Home screen, sheets, mobile Control Center.
- Accept: fully usable at 375px and 414px widths; no horizontal scroll; landscape does not break.

**M6. Polish, accessibility, performance**
- Reduced motion, focus rings, contrast pass, `noscript` fallback, meta/OG tags, Lighthouse targets, bundle check, glass fallback.
- Accept: section 10 quality bars met.

**M7. Deployment**
- Cloudflare Workers static-assets config, README with deploy steps, environment notes.
- Accept: `npm run build && npx wrangler deploy` works from a clean checkout (Gavin runs the actual deploy with his account).

---

## 13. Out of Scope (v1)

Sound effects, minimize/maximize, multiple simultaneous windows, per-app menus, menu bar status icons (Wi-Fi, battery), desktop icons, Spotlight/search, contact form or any backend, resume/PDF download, Terminal/Finder/Trash apps, deep links or routing, analytics, CMS, blog, real photos, custom domain setup.

---

## 14. Deployment Notes (Cloudflare Workers)

- Static assets served from `./dist` via the Workers assets feature in `wrangler.jsonc`, with single-page-application fallback for unknown routes.
- Scripts: `build` (Vite), `preview`, `deploy` (`wrangler deploy` after build).
- README must document: Node version, install, dev, build, deploy, and where to edit content (`src/data/content.ts`) and the logo (`src/config/brand.ts`).
- Verify current Wrangler config syntax against Cloudflare docs before writing it.

---

## 15. Definition of Done

- All milestones M0 to M7 accepted.
- Lint, unit tests and production build pass; no console errors.
- Works in EN and VI, dark and light, desktop and phone.
- No Apple logos, names, fonts or assets anywhere (grep the repo and built output for "apple", "finder", "imac", "macOS" in UI strings).
- Gavin can change the logo, all text and all links by editing only `brand.ts` and `content.ts`.
- README complete. Final summary lists every "Assumption (veto-able)" applied.

---

## 16. Open Items for Gavin (Non-Blocking)

1. Confirm the veto-able defaults in section 3 (#1, #2, #3, #7, #10, #12).
2. Provide real content: bio, skills, experience, projects (names, descriptions, links), contact links.
3. Choose the final logo (currently placeholder fruit).
4. Decide the domain and whether Cloudflare Workers will use a custom domain.
5. Optional later: real avatar photo, resume link, project screenshots.
