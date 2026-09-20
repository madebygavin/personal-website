import { useState } from 'react'
import { usePreferences } from '../../state/preferences'
import { type AppId } from '../../data/content'
import { Wallpaper } from './Wallpaper'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'

// Layer order (section 7.4): wallpaper, menu bar, window layer, dock,
// brightness overlay. Menu bar and dock float above the window layer
// (section 7.5: "sits above windows").
export function Desktop() {
  const { brightness } = usePreferences()
  // TODO(M4): replace with real window state. The window system isn't built
  // yet, so this only drives the menu bar's active-app label and the dock's
  // indicator dot.
  const [activeApp, setActiveApp] = useState<AppId | null>(null)

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Wallpaper />
      <MenuBar activeApp={activeApp} />

      {/* TODO(M4): window layer — renders the single open app window. */}
      <div className="absolute inset-0 z-10" />

      <Dock activeApp={activeApp} onOpenApp={setActiveApp} />

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
