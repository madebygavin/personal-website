import { faMemory, faRobot, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { faReact } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export interface ProjectIconConfig {
  icon: IconDefinition
  gradient: string
}

// Per-project icon + gradient tile, keyed by Project.id in content.ts —
// same device as the Dock's per-app gradient tiles (config/apps.ts), used
// here to fix the audit finding that every ProjectsApp card rendered as an
// identical accent-colored folder icon. Original gradients, distinct from
// the Dock's five app colors so a project tile is never mistaken for a dock
// icon; icon choice reflects each project's actual primary tech.
export const PROJECT_ICONS: Record<string, ProjectIconConfig> = {
  'portfolio-site': { icon: faReact, gradient: 'linear-gradient(160deg, #6ee7ff, #2f8fd1)' },
  'syscall-benchmark': { icon: faTerminal, gradient: 'linear-gradient(160deg, #b8bfcc, #5b6472)' },
  'memory-simulator': { icon: faMemory, gradient: 'linear-gradient(160deg, #c792ea, #7c4dbd)' },
  'robot-lab': { icon: faRobot, gradient: 'linear-gradient(160deg, #ffb86b, #d1631f)' },
}

export const DEFAULT_PROJECT_ICON: ProjectIconConfig = {
  icon: faTerminal,
  gradient: 'linear-gradient(160deg, #9aa3af, #4b5563)',
}
