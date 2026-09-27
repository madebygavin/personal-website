import { useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useClock } from '../../hooks/useClock'
import { useLang } from '../../hooks/useLang'
import { formatClock } from '../../utils/format'
import { usePreferences } from '../../state/preferences'
import { appNames, type AppId } from '../../data/content'
import { APP_ICONS } from '../../config/apps'
import { Wallpaper } from '../desktop/Wallpaper'
import { ControlCenter } from '../desktop/ControlCenter'
import { AppSheet } from './AppSheet'

// Mobile home screen (section 7.9): wallpaper, a top status strip (clock +
// Control Center), and a grid of the same 5 apps/icons as the desktop Dock.
export function HomeScreen() {
  const now = useClock()
  const { t, lang } = useLang()
  const { brightness } = usePreferences()
  const [activeApp, setActiveApp] = useState<AppId | null>(null)
  const iconRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({})

  function handleCloseApp() {
    const closingApp = activeApp
    setActiveApp(null)
    // Restore focus to the icon that opened this sheet (same pattern as the
    // desktop Dock's focus-restore-on-close, section 7.7).
    if (closingApp) iconRefs.current[closingApp]?.focus()
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Wallpaper />

      <div
        className="glass-panel relative z-10 flex h-12 shrink-0 items-center justify-between px-4 text-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3rem + env(safe-area-inset-top))' }}
      >
        <span className="tabular-nums font-medium">{formatClock(now, lang)}</span>
        <ControlCenter />
      </div>

      <div className="relative z-0 flex-1 overflow-y-auto px-6 py-8">
        <div className="grid grid-cols-3 justify-items-center gap-x-4 gap-y-6">
          {APP_ICONS.map((app) => (
            <button
              key={app.id}
              type="button"
              ref={(el) => {
                iconRefs.current[app.id] = el
              }}
              onClick={() => setActiveApp(app.id)}
              className="flex w-full flex-col items-center gap-2 rounded-2xl p-1 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <span
                aria-hidden="true"
                style={{ backgroundImage: app.gradient }}
                className="flex h-16 w-16 items-center justify-center rounded-[20px] text-2xl text-white shadow-md"
              >
                <FontAwesomeIcon icon={app.icon} />
              </span>
              <span className="text-xs font-medium">{t(appNames[app.id])}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeApp && <AppSheet key={activeApp} appId={activeApp} onClose={handleCloseApp} />}
      </AnimatePresence>

      {brightness < 100 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60]"
          style={{
            backdropFilter: `brightness(${brightness}%)`,
            WebkitBackdropFilter: `brightness(${brightness}%)`,
          }}
        />
      )}
    </div>
  )
}
