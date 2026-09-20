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
        <Desktop />
        <AnimatePresence>
          {showBootOverlay && (
            <motion.div
              key="restart-boot"
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
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
