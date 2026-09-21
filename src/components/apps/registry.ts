import { lazy } from 'react'
import type { AppId } from '../../data/content'

// Lazy-loaded per app (section 10 performance bar) — defined once at module
// scope so React.lazy isn't re-invoked on every render. Shared by the
// desktop Window and the mobile AppSheet so both mount the same components.
export const APP_COMPONENTS = {
  about: lazy(() => import('./AboutApp').then((m) => ({ default: m.AboutApp }))),
  skills: lazy(() => import('./SkillsApp').then((m) => ({ default: m.SkillsApp }))),
  experience: lazy(() => import('./ExperienceApp').then((m) => ({ default: m.ExperienceApp }))),
  projects: lazy(() => import('./ProjectsApp').then((m) => ({ default: m.ProjectsApp }))),
  contact: lazy(() => import('./ContactApp').then((m) => ({ default: m.ContactApp }))),
} satisfies Record<AppId, ReturnType<typeof lazy>>
