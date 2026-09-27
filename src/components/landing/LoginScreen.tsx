import { useEffect } from 'react'
import avatarUrl from '../../assets/avatar.webp'
import { useClock } from '../../hooks/useClock'
import { useLang } from '../../hooks/useLang'
import { formatClock, formatDate } from '../../utils/format'
import { profile, uiStrings } from '../../data/content'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const now = useClock()
  const { lang, t } = useLang()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') onLogin()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onLogin])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_#2c2f38_0%,_#0d0e12_75%)] px-6 text-center text-white">
      <button
        type="button"
        onClick={onLogin}
        aria-label={t(uiStrings.login)}
        className="h-20 w-20 overflow-hidden rounded-full transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:h-24 sm:w-24"
      >
        <img src={avatarUrl} alt="" width={96} height={96} className="h-full w-full object-cover" />
      </button>

      <div className="text-[40px] leading-tight font-semibold tracking-[-0.5px]">{profile.name}</div>
      <div className="text-sm opacity-70">{t(profile.title)}</div>

      <div className="mt-3 text-3xl font-light tabular-nums">{formatClock(now, lang)}</div>
      <div className="text-sm opacity-70">
        {formatDate(now, lang)}
        {` · ${profile.location}`}
      </div>

      <button
        type="button"
        onClick={onLogin}
        className="mt-6 rounded-full bg-white/10 px-6 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        {t(uiStrings.login)}
      </button>
    </div>
  )
}
