import { useClock } from '../../hooks/useClock'
import { useLang } from '../../hooks/useLang'
import { formatClock, formatDate } from '../../utils/format'
import { appNames, uiStrings, type AppId } from '../../data/content'
import { LogoMenu } from './LogoMenu'
import { ControlCenter } from './ControlCenter'

interface MenuBarProps {
  activeApp: AppId | null
}

// Glass bar, full width, sits above windows (section 7.5).
export function MenuBar({ activeApp }: MenuBarProps) {
  const now = useClock()
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
