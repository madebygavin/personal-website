import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Hardware } from './components/landing/Hardware'
import { LoginScreen } from './components/landing/LoginScreen'
import { BootScreen } from './components/boot/BootScreen'
import { Desktop } from './components/desktop/Desktop'
import { HomeScreen } from './components/mobile/HomeScreen'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useIsMobile } from './hooks/useIsMobile'
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

interface RestartBootGateProps {
  // True for both 'desktop' and 'booting' (while restarting) — see callers'
  // comments for why AnimatePresence must stay mounted across both.
  showBootOverlay: boolean
  onBootComplete: () => void
  children: ReactNode
}

// Shared by Experience (wraps Desktop) and MobileExperience (wraps
// HomeScreen): keeps `children` inert for the restart boot overlay's full
// lifetime, including its exit fade — not just while session.phase ===
// 'booting'. The phase flips back to 'desktop'/home the instant the fade
// starts, but the overlay (opaque, z-50) is still visibly covering the
// screen for another ~150-300ms via AnimatePresence, and keyboard
// activation (Enter/Space on an already-focused element) doesn't go through
// hit-testing the way a click does, so it isn't blocked by the overlay just
// still being on top (section 6: "ignore further input" while booting).
// Gated off the overlay's own onAnimationComplete instead of
// AnimatePresence.onExitComplete, which was measured empirically (a
// Playwright repro polling the overlay's live computed opacity through the
// full fade, both normal and reduced motion) to fire while the overlay was
// still substantially opaque — nowhere near real completion. Root cause not
// fully isolated (would need Motion's internal exit-tracking source), but
// named variants + checking onAnimationComplete's `definition` argument on
// the motion.div itself was empirically confirmed reliable instead: `inert`
// only lifted once opacity had actually decayed to ~0 and the overlay was
// removed from the DOM, across 3 separate runs.
// `inert` is adjusted during render (not an effect) on the transition into
// showBootOverlay — the React-endorsed "adjusting state when a prop
// changes" pattern, so the very first render where the overlay appears
// already has `children` inert instead of lagging a render behind.
function RestartBootGate({ showBootOverlay, onBootComplete, children }: RestartBootGateProps) {
  const reducedMotion = useReducedMotion()
  const [inert, setInert] = useState(showBootOverlay)
  const [prevShowBootOverlay, setPrevShowBootOverlay] = useState(showBootOverlay)
  if (showBootOverlay !== prevShowBootOverlay) {
    setPrevShowBootOverlay(showBootOverlay)
    if (showBootOverlay) setInert(true)
  }

  return (
    <>
      <div className="h-full w-full" inert={inert}>
        {children}
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
              if (definition === OVERLAY_HIDDEN) setInert(false)
            }}
          >
            <BootScreen onComplete={onBootComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Experience() {
  const session = useSession()
  const reducedMotion = useReducedMotion()
  const outerRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  // Cached across the session: computed once when zooming in, reused as the
  // starting point when zooming back out (section 7.3).
  const [zoomTransform, setZoomTransform] = useState<ZoomTransform | null>(null)

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
  if (session.phase === 'desktop' || session.phase === 'booting') {
    return (
      <RestartBootGate showBootOverlay={session.phase === 'booting'} onBootComplete={session.bootComplete}>
        <Desktop />
      </RestartBootGate>
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

// Mobile's flow (section 7.9): same session state machine, but no Hardware
// frame and no zoom transform — there's no hardware illustration for a zoom
// to originate from. Landing and boot are shown full-screen directly;
// zooming-in/out is a plain cross-fade between login and the home screen
// (the same treatment Experience uses for reduced motion, applied
// unconditionally here since there's nothing to zoom).
function MobileExperience() {
  const session = useSession()
  const reducedMotion = useReducedMotion()

  if (session.phase === 'landing') {
    return <LoginScreen onLogin={session.login} />
  }

  if (session.phase === 'booting' && !session.isRestarting) {
    return <BootScreen onComplete={session.bootComplete} />
  }

  // 'desktop', and 'booting' while restarting (no zoom — section 3, gap #5).
  if (session.phase === 'desktop' || session.phase === 'booting') {
    return (
      <RestartBootGate showBootOverlay={session.phase === 'booting'} onBootComplete={session.bootComplete}>
        <HomeScreen />
      </RestartBootGate>
    )
  }

  if (session.phase === 'zooming-in' || session.phase === 'zooming-out') {
    const showingHome = session.phase === 'zooming-in'
    return (
      <motion.div
        key={session.phase}
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
        onAnimationComplete={() => (showingHome ? session.zoomInComplete() : session.zoomOutComplete())}
      >
        {showingHome ? <HomeScreen /> : <LoginScreen onLogin={session.login} />}
      </motion.div>
    )
  }

  // Unreachable: every SessionPhase is handled above. Kept so TS sees a
  // return on all paths.
  return <HomeScreen />
}

// `useIsMobile`'s live media-query value can flip mid-transition if a
// desktop browser is resized across the 768px breakpoint while the session
// is mid-boot/zoom — since Experience and MobileExperience are different
// component types, React would unmount one and mount the other, restarting
// whatever animation was in flight (self-healing since session.phase lives
// above Root, but a visible glitch — flagged in PROGRESS.md section 8, M5
// review). Freezing the switch to the two stable phases (landing/desktop)
// and only adopting the live value there avoids remounting mid-transition;
// a resize during 'landing'/'desktop' still takes effect immediately. State
// is adjusted during render (not an effect), same pattern as
// RestartBootGate above, so the transition-ending render already reflects
// any breakpoint change that happened while frozen.
function Root() {
  const liveIsMobile = useIsMobile()
  const session = useSession()
  const isStablePhase = session.phase === 'landing' || session.phase === 'desktop'
  const [isMobile, setIsMobile] = useState(liveIsMobile)
  if (isStablePhase && liveIsMobile !== isMobile) {
    setIsMobile(liveIsMobile)
  }

  return isMobile ? <MobileExperience /> : <Experience />
}

export default function App() {
  return (
    <PreferencesProvider>
      <SessionProvider>
        <Root />
      </SessionProvider>
    </PreferencesProvider>
  )
}
