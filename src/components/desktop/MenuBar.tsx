import { useLang } from '../../hooks/useLang'
import { formatClock, formatDate } from '../../utils/format'
import { appNames, uiStrings, type AppId } from '../../data/content'
import { LogoMenu } from './LogoMenu'
import { ControlCenter } from './ControlCenter'

interface MenuBarProps {
  activeApp: AppId | null
  // Passed down from Desktop.tsx rather than calling useClock() here, so
  // MenuBar and DesktopClock share one setInterval/tick instead of running
  // two independent ones for the same wall-clock second (reviewer's M6
  // batch-2 finding).
  now: Date
}

// Glass bar, full width, sits above windows (section 7.5).
export function MenuBar({ activeApp, now }: MenuBarProps) {
  const { t, lang } = useLang()

  const activeLabel = activeApp ? t(appNames[activeApp]) : t(uiStrings.desktopLabel)

  return (
    <div className="glass-panel fixed inset-x-0 top-0 z-40 flex h-7 items-center justify-between px-3 text-xs">
      <div className="flex items-center gap-3">
        <LogoMenu />
        <span className="font-semibold">{activeLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <ControlCenter />
        <span className="tabular-nums opacity-90">
          {formatClock(now, lang)} · {formatDate(now, lang)}
        </span>
      </div>
    </div>
  )
}
