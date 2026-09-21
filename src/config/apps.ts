import { faUser, faGear, faCalendarDays, faFolderOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { AppId } from '../data/content'

export interface AppIconConfig {
  id: AppId
  icon: IconDefinition
  gradient: string
}

// Original colors per app (section 5.4 — no Apple app icon designs). Shared
// between the desktop Dock and the mobile home screen grid (section 7.9) so
// both surfaces show the same 5 icons.
export const APP_ICONS: AppIconConfig[] = [
  { id: 'about', icon: faUser, gradient: 'linear-gradient(160deg, #6ea8ff, #3b62e0)' },
  { id: 'skills', icon: faGear, gradient: 'linear-gradient(160deg, #7de3c8, #2fae8b)' },
  { id: 'experience', icon: faCalendarDays, gradient: 'linear-gradient(160deg, #ffb86b, #e0742f)' },
  { id: 'projects', icon: faFolderOpen, gradient: 'linear-gradient(160deg, #ffd76b, #e0a92f)' },
  { id: 'contact', icon: faEnvelope, gradient: 'linear-gradient(160deg, #ff8fb3, #e0407a)' },
]
