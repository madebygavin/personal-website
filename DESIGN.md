---
version: 1
name: gavinle-portfolio-design
description: >
  Redesign-preserve token system for the interactive macOS-style desktop portfolio.
  Keeps the existing "Liquid Glass" desktop conceit (menu bar, dock, draggable window,
  glass blur), the existing accent hue, the FontAwesome lemon logo, and all copy.
  Replaces the flat, single-scale chrome with a Linear-inspired near-black/near-white
  surface ladder, a scarce single accent, hairline-border elevation, and an actual
  type scale with a headline moment. Reference: Linear's marketing design system
  (near-black canvas, one chromatic accent used sparingly, hairline elevation,
  negative-tracking display type) adapted to this site's own accent hue and to a
  dual dark/light desktop-app context rather than a one-theme marketing page.

design_read: >
  Redesign-preserve of a developer's interactive OS-style portfolio for recruiters
  and hiring managers, in a precise / software-craft language, leaning on Linear's
  surface-ladder + scarce-accent model while keeping this site's own glass-blur
  desktop shell intact. This is a component redesign, not a landing page: most
  marketing-page rules (hero copy limits, eyebrows, marquees, bento grids) do not
  apply here and are intentionally skipped.

dials:
  design_variance: 4 # window/dock chrome needs predictability, not asymmetry
  motion_intensity: 5 # matches what's already shipped (springs, dock magnify, id-card physics) — not increased
  visual_density: 5 # small windowed app panes, not an art-gallery landing page

colors:
  dark:
    canvas: "#08090b" # page-level base behind the wallpaper; deeper/cooler than the old #0b0c10
    surface-1: "#111318" # glass-panel base (menu bar, dock, window chrome, dialogs)
    surface-2: "#161920" # sidebar / nav rail inside a window (one step up)
    surface-3: "#1c1f27" # active row, hovered card, selected segment (two steps up)
    hairline: "rgb(255 255 255 / 10%)"
    hairline-strong: "rgb(255 255 255 / 16%)"
    ink: "rgb(255 255 255 / 92%)"
    ink-muted: "rgb(255 255 255 / 70%)"
    ink-subtle: "rgb(255 255 255 / 50%)"
    ink-tertiary: "rgb(255 255 255 / 32%)"
    accent: "#5b9dff" # unchanged — existing brand blue, kept as-is
    accent-hover: "#7fb2ff"
    accent-pressed: "#4a86e0"
    accent-soft: "rgb(91 157 255 / 14%)" # tinted fills (badge, soft highlight) — new, was missing
    glass-shadow: "0 8px 32px rgb(0 0 0 / 40%)"
  light:
    canvas: "#eef0f3"
    surface-1: "#f7f8fa" # glass-panel base
    surface-2: "#ffffff" # sidebar / nav rail (one step up from canvas, matches dark's direction)
    surface-3: "#e9ecf1" # active row, hovered card
    hairline: "rgb(0 0 0 / 9%)"
    hairline-strong: "rgb(0 0 0 / 14%)"
    ink: "rgb(15 17 21 / 92%)"
    ink-muted: "rgb(15 17 21 / 70%)"
    ink-subtle: "rgb(15 17 21 / 50%)"
    ink-tertiary: "rgb(15 17 21 / 32%)"
    accent: "#2f6fe0" # unchanged — existing brand blue, kept as-is
    accent-hover: "#4b83ea"
    accent-pressed: "#2559b8"
    accent-soft: "rgb(47 111 224 / 10%)"
    glass-shadow: "0 8px 32px rgb(0 0 0 / 12%)"

typography:
  # Font stays Inter (locked in PROJECT_BRIEF.md section 5 — never swap this).
  # What changes is that a real scale now exists instead of maxing out at 26px.
  display:
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.5px
    use: "LoginScreen name, ID card front name — the two 'first impression' moments"
  heading-lg:
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
    use: "Window/app-sheet title bar (was 12-14px), AboutDialog title"
  heading-md:
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.1px
    use: "In-app section heading (AboutApp note title, SkillsApp category title, was text-base/16px)"
  body:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
    use: "Default paragraph/content text (unchanged from current text-sm)"
  body-strong:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    use: "Experience role title, active nav item"
  caption:
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.1px
    use: "Sidebar nav items, dock tooltips, badges (unchanged from current text-xs)"
  micro:
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.2px
    use: "Menu bar clock, smallest labels"

radii:
  control: 8px # buttons, segmented controls, inputs (was 10px)
  card: 12px # sidebar nav items, project tiles, in-app cards (new — was ad hoc 8-10px)
  panel: 16px # window/dialog/sheet chrome (was 18px — tightened to match the scale)
  pill: 9999px # dock, filter chips

spacing:
  # Kept close to the existing Tailwind default scale — this is a token audit,
  # not a spacing overhaul. Documented here so values stop being ad hoc.
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  section: 32px

elevation:
  # Linear's core move: depth comes from the surface ladder + hairline borders,
  # not from stacking box-shadows. This site keeps ONE real drop shadow (glass-shadow)
  # because windows/dock/dialogs are genuinely floating over the wallpaper — but
  # everything INSIDE a window (sidebar vs. content, hover vs. idle) now steps
  # through the surface ladder instead of `bg-white/10`-style opacity overlays.
  level-0: "canvas — wallpaper, window content background"
  level-1: "surface-1 + 1px hairline — glass-panel chrome: menu bar, dock, window title bar, dialogs"
  level-2: "surface-2 — sidebar/nav rail inside a window, ControlCenter fields"
  level-3: "surface-3 — active/selected row, hovered card"
  floating: "surface-1 + hairline + glass-shadow — the only true drop-shadow layer: window, dock, popovers"
---

## Why this exists

This is a **redesign-preserve** pass (see `PROJECT_BRIEF.md` section 2's locked decisions), not a rebuild. The desktop
conceit, the five-app structure, the accent hue, the logo, the copy, and the bilingual/dark-light system are all kept.
What changes is the token layer underneath: a real type scale, a proper surface ladder instead of opacity overlays, a
tightened radius scale, and two specific fixes the design audit flagged — the traffic-light buttons and the identical
Projects folder icons.

Reference system: **Linear** (near-black canvas, one scarce chromatic accent, hairline-border surface-ladder
elevation, negative-tracking display type). This site keeps its own accent hue (`#5b9dff` / `#2f6fe0`) rather than
adopting Linear's lavender — only the *structure* (scarce accent, surface ladder, hairline elevation, tight tracking)
is borrowed, per the library's own usage rule ("use the design language, not the brand").

Marketing-page rules that don't apply here and are intentionally skipped: hero copy limits, eyebrows, marquees, bento
grids, CTA-wrap rules, logo walls. This is a small windowed application, not a landing page.

## Color

The dark and light tables above are a 4-step surface ladder (`canvas` → `surface-1` → `surface-2` → `surface-3`)
plus a 4-step text ladder (`ink` → `ink-muted` → `ink-subtle` → `ink-tertiary`), replacing the current pattern of
one glass color + ad hoc `opacity-70`/`opacity-90`/`bg-white/10`/`bg-white/15` utility classes scattered per component.

**The accent stays scarce.** Right now `--color-accent` appears on: every focus ring, every active nav state, the
skills progress bar, project tech links, the contact email button, the dock active-dot, and the ID card diagonal
accent shape. Under this system it keeps exactly those roles (focus, single primary action, the one data
visualization) but nothing new gets added to that list — no accent-colored borders, no accent card backgrounds. That
scarcity is what makes it read as a considered choice instead of a template default.

`accent-soft` is new: a low-opacity tint of the accent for places that currently have no good option between "full
accent" and "no color" — e.g. the active dock indicator's glow, or a subtle highlight behind the selected sidebar
item, instead of the flat `bg-white/15` currently used for selection state.

## Typography

The core fix: nothing on the site currently exceeds ~26px (the ID card name), and most UI sits at 12-16px. `display`
(40px/600/-0.5px) gives the site exactly two genuine headline moments — the visitor's name on the login screen and
on the front of the ID card — without turning any in-app content into a marketing page. Everything else moves up
one deliberate notch: window titles go from a 12-14px `<span>` to `heading-lg` (22px) rendered as an actual heading
element (fixes the audit's semantic-heading gap too), and in-app section titles (`AboutApp` note title, `SkillsApp`
category title, `ExperienceApp` role) move from `text-base` (16px) to `heading-md` (17px/600) with slightly tighter
tracking so they read as considered, not just "bigger."

Font stays Inter — that's locked in `PROJECT_BRIEF.md` and is correct for this brief's "neutral, precise" register,
not a generic-default problem here.

## Radii

Tightened from the current three ad hoc values (18/24/15/10) to a documented four-step scale: `control` (8px) for
buttons/inputs/segmented controls, `card` (12px) for sidebar rows and project tiles, `panel` (16px) for
window/dialog/sheet chrome, `pill` for the dock and filter chips. This is the same shape-consistency principle Linear
uses (a small, named scale everything maps to) rather than a redesign of the actual geometry — window chrome goes
from 18px to 16px, a one-pixel nudge, not a rebuild.

## Component changes

**MenuBar** — retint to `surface-1` + hairline (was the single `glass-bg`/`glass-border` pair). No structural change.

**Dock** — retint container to `surface-1`; keep the five per-app icon gradients as-is (they already give each app a
distinct, original identity and don't compete with the "scarce accent" rule since they're icon branding, not chrome).
Active-app indicator dot switches from solid `accent` to a small `accent-soft` glow behind a solid center, matching
the new soft-tint token.

**Window** — the traffic-light buttons currently use the literal macOS hex values (`#ff5f57`/`#ffbd2e`/`#28c840`),
which is the single most Apple-recognizable element on the site and works against `PROJECT_BRIEF.md` section 5's
"original design, not traced" requirement. Replace with a monochrome treatment consistent with Linear's restraint:
all three dots render in `ink-tertiary` at rest (same neutral, no tri-color scheme). On hover/focus, the close
button (the only one that does anything) tints to `accent`; the two disabled dots stay neutral and never gain color,
which also makes their disabled state more legible than the current same-saturation-as-close yellow/green. Window
title moves from a plain `<span>` to a real heading element at `heading-lg`, radius tightens to `panel` (16px).

**ControlCenter** — segmented-control fill and dropdown/sheet background move from `bg-white/10`/`bg-black/10` +
`bg-white/20` active state to `surface-2` idle / `surface-3` active, consistent with the ladder used everywhere else.

**App windows (About/Skills/Experience/Projects/Contact)** — sidebar nav rail moves to `surface-2` (currently
transparent, relying only on a border), content pane stays at `canvas`/`surface-1`, selected/hovered rows move from
`bg-white/15`/`hover:bg-white/10` to `surface-3`/`accent-soft`. Section titles move to `heading-md`.

**ProjectsApp** — the audit flagged every project rendering as an identical `faFolder` icon in the accent color,
indistinguishable until clicked. Fix: give each project tile the same treatment the Dock already gives each app — a
small gradient tile (reusing that existing device, not inventing a new one) behind a tech-relevant FontAwesome icon,
so the grid reads as five distinct things instead of five copies of one icon. This stays inside the "one accent"
rule because it's project identity, exactly like the existing per-app dock icons, not new chrome color.

**LoginScreen / BootScreen** — LoginScreen's name renders at `display` (40px) instead of `text-lg` (18px), giving the
first screen an actual headline moment; everything else on that screen (title, clock, location) stays at its current
size, now clearly subordinate. BootScreen is unchanged (it's intentionally minimal, monochrome, and brief).

**ID card** — front face name already sits close to `display` size (26px); nudge to the documented 40px token for
consistency with LoginScreen, kept in the same restrained weight. Diagonal accent shapes keep the accent hue but
should sit at reduced opacity against the new `surface` tones rather than the flat `#5b9dff`/`#0b0c10` pair currently
hardcoded in `IdCardFaces.tsx`, so the card reads as part of the same system instead of a one-off gradient.

## What this does NOT touch

Copy, information architecture, the five-app structure, the accent hue, the logo, bilingual EN/VI, the physics-based
ID card interaction, dock magnification, window drag behavior, and the overall glass-blur desktop concept are all
unchanged. This is token and hierarchy work, not a rebuild.
