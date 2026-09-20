import { uiStrings } from '../../data/content'
import { useLang } from '../../hooks/useLang'
import { useSession } from '../../state/session'

// TODO(M3): replace with the real desktop shell (wallpaper, menu bar, dock).
// The buttons here exist only to exercise the Log Out / Restart flows for M2.
export function Desktop() {
  const { t } = useLang()
  const session = useSession()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,_#2c2f38_0%,_#0b0c10_75%)] text-white">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={session.restart}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {t(uiStrings.restart)}
        </button>
        <button
          type="button"
          onClick={session.logout}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {t(uiStrings.logout)}
        </button>
      </div>
    </div>
  )
}
