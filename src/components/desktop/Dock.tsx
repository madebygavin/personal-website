import { forwardRef, useImperativeHandle, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { usePointerFine } from '../../hooks/usePointerFine'
import { useLang } from '../../hooks/useLang'
import { appNames, type AppId } from '../../data/content'
import { APP_ICONS, type AppIconConfig } from '../../config/apps'

interface DockProps {
  activeApp: AppId | null
  onOpenApp: (id: AppId) => void
}

export interface DockHandle {
  // Lets Desktop return focus to the dock icon that opened the window that
  // just closed (section 7.7's focus-management requirement).
  focusApp: (id: AppId) => void
}

// Floating glass dock with hover magnification (section 7.6).
export const Dock = forwardRef<DockHandle, DockProps>(function Dock({ activeApp, onOpenApp }, ref) {
  const mouseX = useMotionValue(Infinity)
  const reducedMotion = useReducedMotion()
  const pointerFine = usePointerFine()
  const magnify = pointerFine && !reducedMotion
  const buttonRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({})

  useImperativeHandle(ref, () => ({
    focusApp: (id) => buttonRefs.current[id]?.focus(),
  }))

  return (
    <div
      className="glass-panel fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-end gap-2 rounded-[var(--radius-dock)] px-3 py-2"
      onMouseMove={(event) => magnify && mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {APP_ICONS.map((app) => (
        <DockIcon
          key={app.id}
          app={app}
          mouseX={mouseX}
          magnify={magnify}
          isActive={activeApp === app.id}
          onOpen={() => onOpenApp(app.id)}
          registerRef={(el) => {
            buttonRefs.current[app.id] = el
          }}
        />
      ))}
    </div>
  )
})

function DockIcon({
  app,
  mouseX,
  magnify,
  isActive,
  onOpen,
  registerRef,
}: {
  app: AppIconConfig
  mouseX: MotionValue<number>
  magnify: boolean
  isActive: boolean
  onOpen: () => void
  registerRef: (el: HTMLButtonElement | null) => void
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
        ref={(el) => {
          ref.current = el
          registerRef(el)
        }}
        type="button"
        aria-label={label}
        aria-pressed={isActive}
        onClick={() => {
          // Clicking the already-open app does nothing (section 7.6).
          if (!isActive) onOpen()
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
