import { Suspense, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { usePreferences } from '../../state/preferences'
import { useLang } from '../../hooks/useLang'
import { appNames, uiStrings, type AppId } from '../../data/content'
import { APP_COMPONENTS } from '../apps/registry'
import { Wallpaper } from './Wallpaper'
import { MenuBar } from './MenuBar'
import { Dock, type DockHandle } from './Dock'
import { Window } from './Window'

// Layer order (section 7.4): wallpaper, menu bar, window layer, dock,
// brightness overlay. Menu bar and dock float above the window layer
// (section 7.5: "sits above windows").
export function Desktop() {
  const { brightness } = usePreferences()
  const { t } = useLang()
  const [activeApp, setActiveApp] = useState<AppId | null>(null)
  const dockRef = useRef<DockHandle>(null)
  const windowAreaRef = useRef<HTMLDivElement>(null)

  function handleCloseWindow() {
    const closingApp = activeApp
    setActiveApp(null)
    // Restore focus to the dock icon that opened this window (section 7.7).
    if (closingApp) dockRef.current?.focusApp(closingApp)
  }

  const ActiveAppComponent = activeApp ? APP_COMPONENTS[activeApp] : null

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Wallpaper />
      <MenuBar activeApp={activeApp} />

      {/* Free area between the menu bar and dock — also the drag boundary
          for the open window (section 7.7). */}
      <div ref={windowAreaRef} className="absolute inset-x-0 top-7 bottom-24 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeApp && ActiveAppComponent && (
            <Window key={activeApp} title={t(appNames[activeApp])} constraintsRef={windowAreaRef} onClose={handleCloseWindow}>
              <Suspense
                fallback={<div className="flex h-full items-center justify-center text-sm opacity-60">{t(uiStrings.loading)}</div>}
              >
                <ActiveAppComponent />
              </Suspense>
            </Window>
          )}
        </AnimatePresence>
      </div>

      <Dock ref={dockRef} activeApp={activeApp} onOpenApp={setActiveApp} />

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
