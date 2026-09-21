import { useLang } from '../../hooks/useLang'
import { formatClock, formatDate } from '../../utils/format'

interface DesktopClockProps {
  // Passed down from Desktop.tsx (a single shared useClock() tick, also fed
  // to MenuBar) rather than calling useClock() here — avoids two independent
  // setInterval ticks for the same wall-clock second (reviewer's M6 batch-2
  // finding).
  now: Date
}

// Purely decorative ambient clock on the desktop surface (Gavin's ask,
// post-M6) — not a new app or desktop icon (PROJECT_BRIEF.md section 13
// bans both): no click target, no window, aria-hidden. Sits behind the
// window layer (z-10, see Desktop.tsx) so an open window naturally covers
// it, the way a real OS desktop widget would. No motion/animation of its
// own — just a ticking number — so there's nothing here for reduced-motion
// to gate.
export function DesktopClock({ now }: DesktopClockProps) {
  const { lang } = useLang()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col items-center gap-1 text-center opacity-[0.08] select-none"
    >
      <span className="text-[7rem] leading-none font-light tabular-nums sm:text-[9rem]">{formatClock(now, lang)}</span>
      <span className="text-lg font-medium tabular-nums">{formatDate(now, lang)}</span>
    </div>
  )
}
