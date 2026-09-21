import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCode, faDatabase } from '@fortawesome/free-solid-svg-icons'
import {
  faTypescript,
  faJs,
  faPython,
  faGolang,
  faReact,
  faCss3,
  faHtml5,
  faGitAlt,
  faDocker,
  faCloudflare,
  faFigma,
} from '@fortawesome/free-brands-svg-icons'

export interface SkillIconConfig {
  icon: IconDefinition
  color: string
}

// Per-skill brand icon + real brand accent color, keyed by `Skill.name` in
// content.ts (SkillsApp.tsx section 7.8) — distinct colors, similar spirit
// to the dock's per-app gradient tiles. These are the technologies' actual
// Font Awesome brand marks, unrelated to PROJECT_BRIEF.md section 5's
// Apple-asset restriction (which is about not using Apple's own designs).
// .NET and MySQL have no dedicated Font Awesome brand icon, so they fall
// back to a generic solid icon (engineer's call, per Gavin's go-ahead).
export const SKILL_ICONS: Record<string, SkillIconConfig> = {
  TypeScript: { icon: faTypescript, color: '#3178c6' },
  JavaScript: { icon: faJs, color: '#f0db4f' },
  Python: { icon: faPython, color: '#4b8bbe' },
  Go: { icon: faGolang, color: '#00add8' },
  CSS: { icon: faCss3, color: '#2965f1' },
  HTML: { icon: faHtml5, color: '#e34c26' },
  React: { icon: faReact, color: '#61dafb' },
  '.NET (VB.NET / C#)': { icon: faCode, color: '#8a5cf5' },
  MySQL: { icon: faDatabase, color: '#4479a1' },
  Git: { icon: faGitAlt, color: '#f05032' },
  Docker: { icon: faDocker, color: '#2496ed' },
  'Cloudflare Workers': { icon: faCloudflare, color: '#f38020' },
  Figma: { icon: faFigma, color: '#a259ff' },
}

// Any skill name not in the map above (e.g. a future addition) falls back
// to this rather than rendering nothing.
export const DEFAULT_SKILL_ICON: SkillIconConfig = { icon: faCode, color: 'var(--color-accent)' }
