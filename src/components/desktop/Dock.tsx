import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear, faCalendarDays, faFolderOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { usePointerFine } from '../../hooks/usePointerFine'
import { useLang } from '../../hooks/useLang'
import { appNames, type AppId } from '../../data/content'

interface DockAppConfig {
  id: AppId
  icon: IconDefinition
  gradient: string
}

// Original colors per app (section 5.4 — no Apple app icon designs).
const DOCK_APPS: DockAppConfig[] = [
  { id: 'about', icon: faUser, gradient: 'linear-gradient(160deg, #6ea8ff, #3b62e0)' },
  { id: 'skills', icon: faGear, gradient: 'linear-gradient(160deg, #7de3c8, #2fae8b)' },
  { id: 'experience', icon: faCalendarDays, gradient: 'linear-gradient(160deg, #ffb86b, #e0742f)' },
  { id: 'projects', icon: faFolderOpen, gradient: 'linear-gradient(160deg, #ffd76b, #e0a92f)' },
  { id: 'contact', icon: faEnvelope, gradient: 'linear-gradient(160deg, #ff8fb3, #e0407a)' },
]

interface DockProps {
  activeApp: AppId | null
  onOpenApp: (id: AppId) => void
}

// Floating glass dock with hover magnification (section 7.6).
export function Dock({ activeApp, onOpenApp }: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const reducedMotion = useReducedMotion()
  const pointerFine = usePointerFine()
  const magnify = pointerFine && !reducedMotion

  return (
    <div
      className="glass-panel fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-end gap-2 rounded-[var(--radius-dock)] px-3 py-2"
      onMouseMove={(event) => magnify && mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {DOCK_APPS.map((app) => (
        <DockIcon
          key={app.id}
          app={app}
          mouseX={mouseX}
          magnify={magnify}
          isActive={activeApp === app.id}
          onOpen={() => onOpenApp(app.id)}
        />
      ))}
    </div>
  )
}

function DockIcon({
  app,
  mouseX,
  magnify,
  isActive,
  onOpen,
}: {
  app: DockAppConfig
  mouseX: MotionValue<number>
  magnify: boolean
  isActive: boolean
  onOpen: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { t } = useLang()
  const label = t(appNames[app.id])

  const distance = useTransform(mouseX, (value) => {
    if (!magnify) return Infinity
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return Infinity
    return value - (bounds.left + bounds.width / 2)
  })
  const targetSize = useTransform(distance, [-140, 0, 140], [44, 68, 44])
  const size = useSpring(targetSize, { mass: 0.15, stiffness: 260, damping: 18 })

  return (
    <div className="group relative flex flex-col items-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 rounded-md bg-black/80 px-2 py-1 text-[11px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={isActive}
        onClick={() => {
          if (!isActive) onOpen()
          // TODO(M4): open/replace the real window for this app — for now
          // this only drives the menu bar label and the indicator dot below.
        }}
        style={{ width: size, height: size, backgroundImage: app.gradient }}
        className="flex items-center justify-center rounded-[var(--radius-dock-icon)] text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <FontAwesomeIcon icon={app.icon} className="text-lg" />
      </motion.button>
      <span
        aria-hidden="true"
        className={`mt-1 h-1 w-1 rounded-full transition-opacity ${isActive ? 'bg-[var(--color-accent)] opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
