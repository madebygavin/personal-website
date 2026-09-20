import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Hardware } from './components/landing/Hardware'
import { LoginScreen } from './components/landing/LoginScreen'
import { BootScreen } from './components/boot/BootScreen'
import { Desktop } from './components/desktop/Desktop'
import { useReducedMotion } from './hooks/useReducedMotion'
import { PreferencesProvider } from './state/preferences'
import { SessionProvider, useSession } from './state/session'
import { computeZoomTransform, type ZoomTransform } from './utils/zoom'

type MotionTarget = Pick<ZoomTransform, 'x' | 'y' | 'scaleX' | 'scaleY'>

const IDENTITY: MotionTarget = { x: 0, y: 0, scaleX: 1, scaleY: 1 }

// Restart boot overlay's fade variants. Named (rather than inline
// animate/exit objects) so onAnimationComplete's `definition` argument can
// tell "enter finished" from "exit finished" apart. Shared as constants
// (not re-typed at each call site) so the variants object and the
// onAnimationComplete check below can't drift out of sync under a rename —
// `definition` types as a bare `string | string[]`, with no compiler link
// back to the variants object's own keys.
const OVERLAY_VISIBLE = 'visible'
const OVERLAY_HIDDEN = 'hidden'
const OVERLAY_VARIANTS = { [OVERLAY_VISIBLE]: { opacity: 1 }, [OVERLAY_HIDDEN]: { opacity: 0 } }

function toMotionValues(t: MotionTarget) {
  return { x: t.x, y: t.y, scaleX: t.scaleX, scaleY: t.scaleY }
}

function Experience() {
  const session = useSession()
  const reducedMotion = useReducedMotion()
  const outerRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  // Cached across the session: computed once when zooming in, reused as the
  // starting point when zooming back out (section 7.3).
  const [zoomTransform, setZoomTransform] = useState<ZoomTransform | null>(null)

  // Desktop must stay inert for the restart boot overlay's full lifetime,
  // including its exit fade — not just while session.phase === 'booting'.
  // The phase flips back to 'desktop' the instant the fade starts, but the
  // overlay (opaque, z-50) is still visibly covering the screen for another
  // ~150-300ms via AnimatePresence, and keyboard activation (Enter/Space on
  // an already-focused element) doesn't go through hit-testing the way a
  // click does, so it isn't blocked by the overlay just still being on top.
  // Gated off the overlay's own onExitComplete instead, same pattern as
  // Window.tsx's entered/onAnimationComplete gating for drag.
  // Adjusted during render (not an effect) on the transition into
  // restartOverlayShowing — the React-endorsed "adjusting state when a prop
  // changes" pattern, so the very first render where the overlay appears
  // already has Desktop inert instead of lagging a render behind.
  const restartOverlayShowing = session.phase === 'booting' && session.isRestarting
  const [desktopInert, setDesktopInert] = useState(restartOverlayShowing)
  const [prevRestartOverlayShowing, setPrevRestartOverlayShowing] = useState(restartOverlayShowing)
  if (restartOverlayShowing !== prevRestartOverlayShowing) {
    setPrevRestartOverlayShowing(restartOverlayShowing)
    if (restartOverlayShowing) setDesktopInert(true)
  }

  useLayoutEffect(() => {
    if (session.phase !== 'zooming-in' || reducedMotion) return
    const outer = outerRef.current
    const screen = screenRef.current
    if (!outer || !screen) return
    setZoomTransform(
      computeZoomTransform(
        outer.getBoundingClientRect(),
        screen.getBoundingClientRect(),
        window.innerWidth,
        window.innerHeight,
      ),
    )
  }, [session.phase, reducedMotion])

  if (session.phase === 'landing') {
    return (
      <Hardware screenRef={screenRef} assemblyRef={outerRef}>
        <LoginScreen onLogin={session.login} />
      </Hardware>
    )
  }

  if (session.phase === 'booting' && !session.isRestarting) {
    return (
      <Hardware screenRef={screenRef} assemblyRef={outerRef}>
        <BootScreen onComplete={session.bootComplete} />
      </Hardware>
    )
  }

  // 'desktop', and 'booting' while restarting (no zoom — section 3, gap #5).
  // AnimatePresence stays mounted across both so the overlay's exit fade can
  // actually play instead of being torn down when the phase flips.
  if (session.phase === 'desktop' || session.phase === 'booting') {
    const showBootOverlay = session.phase === 'booting'
    return (
      <>
        {/* inert (not just aria-hidden) so a keyboard user can't Tab into, or
            activate, Desktop controls that are fully hidden behind the opaque
            restart overlay (section 6: "ignore further input" while
            booting) — kept inert through the overlay's exit fade via the
            motion.div's own onAnimationComplete below, see desktopInert's
            comment. AnimatePresence.onExitComplete was measured empirically
            (a Playwright repro polling the overlay's live computed opacity
            through the full fade, both normal and reduced motion) to fire
            while the overlay was still substantially opaque — nowhere near
            real completion. Root cause not fully isolated (would need
            Motion's internal exit-tracking source), but named variants +
            checking onAnimationComplete's `definition` argument on the
            motion.div itself was empirically confirmed reliable instead:
            `inert` only lifted once opacity had actually decayed to ~0 and
            the overlay was removed from the DOM, across 3 separate runs. */}
        <div className="h-full w-full" inert={desktopInert}>
          <Desktop />
        </div>
        <AnimatePresence>
          {showBootOverlay && (
            <motion.div
              key="restart-boot"
              className="fixed inset-0 z-50"
              variants={OVERLAY_VARIANTS}
              initial={OVERLAY_HIDDEN}
              animate={OVERLAY_VISIBLE}
              exit={OVERLAY_HIDDEN}
              transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
              onAnimationComplete={(definition) => {
                if (definition === OVERLAY_HIDDEN) setDesktopInert(false)
              }}
            >
              <BootScreen onComplete={session.bootComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  if (session.phase === 'zooming-in' || session.phase === 'zooming-out') {
    const showingDesktop = session.phase === 'zooming-in'

    if (reducedMotion) {
      return (
        <motion.div
          key={session.phase}
          className="min-h-dvh w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onAnimationComplete={() => (showingDesktop ? session.zoomInComplete() : session.zoomOutComplete())}
        >
          {showingDesktop ? (
            <Desktop />
          ) : (
            <Hardware screenRef={screenRef} assemblyRef={outerRef}>
              <LoginScreen onLogin={session.login} />
            </Hardware>
          )}
        </motion.div>
      )
    }

    const target: MotionTarget | null = showingDesktop ? zoomTransform : IDENTITY
    const initial: MotionTarget = showingDesktop ? IDENTITY : (zoomTransform ?? IDENTITY)

    return (
      <Hardware
        screenRef={screenRef}
        assemblyRef={outerRef}
        assemblyProps={{
          initial: toMotionValues(initial),
          animate: target ? toMotionValues(target) : undefined,
          transition: { duration: 0.72, ease: [0.4, 0, 0.2, 1] },
          style: zoomTransform
            ? { transformOrigin: `${zoomTransform.originX}px ${zoomTransform.originY}px` }
            : undefined,
          onAnimationComplete: target
            ? () => (showingDesktop ? session.zoomInComplete() : session.zoomOutComplete())
            : undefined,
        }}
      >
        <Desktop />
      </Hardware>
    )
  }

  // Unreachable: every SessionPhase is handled above. Kept so TS sees a
  // return on all paths.
  return <Desktop />
}

export default function App() {
  return (
    <PreferencesProvider>
      <SessionProvider>
        <Experience />
      </SessionProvider>
    </PreferencesProvider>
  )
}
