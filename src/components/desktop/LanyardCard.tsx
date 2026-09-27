import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../hooks/useLang'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { idCardStrings } from '../../data/content'
import { Lanyard } from '../../utils/lanyard'
import { CARD_HEIGHT, CARD_WIDTH, CardBack, CardFront } from './IdCardFaces'

// Card art sits this far below the clip point; the hook passes through the slot.
const CARD_TOP = 26
const ASSEMBLY_HEIGHT = CARD_TOP + CARD_HEIGHT
const STRING_LENGTH = 170
const DROP_DELAY_MS = 250
const DROP_MS = 600
const DROP_KICK = 240
const STRAP_WIDTH = 9

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 3) return points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2
    const my = (points[i].y + points[i + 1].y) / 2
    d += ` Q${points[i].x},${points[i].y} ${mx},${my}`
  }
  const last = points[points.length - 1]
  return `${d} L${last.x},${last.y}`
}

// The hardware at the top of the assembly: strap ring, swivel and hook.
function Clip() {
  return (
    <svg
      aria-hidden="true"
      width="44"
      height="52"
      viewBox="0 0 44 52"
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 drop-shadow-md"
    >
      <rect
        x="12"
        y="1"
        width="20"
        height="17"
        rx="5"
        fill="none"
        stroke="#59606d"
        strokeWidth="3.5"
      />
      <rect
        x="18"
        y="16"
        width="8"
        height="10"
        rx="2"
        fill="#1a1c21"
        stroke="#3a3f49"
        strokeWidth="1"
      />
      <path
        d="M22 26 V33 C22 37 30 37 30 42 C30 48 22 50 18 47"
        fill="none"
        stroke="#59606d"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LanyardCard() {
  const { t } = useLang()
  const reducedMotion = useReducedMotion()
  const [flipped, setFlipped] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const assemblyRef = useRef<HTMLDivElement>(null)
  const strapRef = useRef<SVGPathElement>(null)
  const strapShineRef = useRef<SVGPathElement>(null)
  const simRef = useRef<Lanyard | null>(null)
  const scaleRef = useRef(1)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<() => void>(() => {})
  const dropRef = useRef({ startedAt: 0, done: false, from: 0 })

  const paint = useCallback(() => {
    const sim = simRef.current
    const assembly = assemblyRef.current
    if (!sim || !assembly) return
    const s = scaleRef.current
    const clip = sim.clip
    assembly.style.transform = `translate3d(${clip.x - CARD_WIDTH / 2}px, ${clip.y}px, 0) rotate(${sim.angle}rad) scale(${s})`
    const pts = sim.stringPoints
    const tail = { x: pts[0].x, y: Math.min(pts[0].y, 0) - 400 }
    const d = smoothPath([tail, ...pts])
    strapRef.current?.setAttribute('d', d)
    strapRef.current?.setAttribute('stroke-width', String(STRAP_WIDTH * s))
    strapShineRef.current?.setAttribute('d', d)
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    const s = Math.min(1, Math.max(0.72, height / 900))
    scaleRef.current = s
    const sim = new Lanyard({
      anchor: { x: width / 2, y: 0 },
      stringLength: STRING_LENGTH * s,
      cardLength: ASSEMBLY_HEIGHT * s,
    })
    simRef.current = sim

    if (reducedMotion) {
      paint()
      const staticObserver = new ResizeObserver(() => {
        sim.setAnchor((containerRef.current?.clientWidth ?? width) / 2, 0)
        sim.reset()
        paint()
      })
      staticObserver.observe(container)
      return () => {
        staticObserver.disconnect()
        simRef.current = null
      }
    }

    const raised = -(STRING_LENGTH * s + ASSEMBLY_HEIGHT * s + 60)
    sim.setAnchor(width / 2, raised)
    sim.reset()
    dropRef.current = { startedAt: performance.now() + DROP_DELAY_MS, done: false, from: raised }
    paint()

    let last = performance.now()
    const frame = (now: number) => {
      const drop = dropRef.current
      const anchorX = (containerRef.current?.clientWidth ?? width) / 2
      if (!drop.done) {
        const p = Math.min(1, Math.max(0, (now - drop.startedAt) / DROP_MS))
        sim.setAnchor(anchorX, drop.from * (1 - p * p))
        if (p >= 1) {
          drop.done = true
          sim.kick(DROP_KICK * s)
        }
      }
      sim.advance((now - last) / 1000)
      last = now
      paint()
      rafRef.current =
        drop.done && sim.isAsleep && !sim.isGrabbed ? null : requestAnimationFrame(frame)
    }
    startRef.current = () => {
      if (rafRef.current !== null) return
      last = performance.now()
      rafRef.current = requestAnimationFrame(frame)
    }
    startRef.current()

    const observer = new ResizeObserver(() => {
      if (!dropRef.current.done) return
      sim.setAnchor((containerRef.current?.clientWidth ?? width) / 2, 0)
      startRef.current()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      simRef.current = null
    }
  }, [reducedMotion, paint])

  function toLocal(event: ReactPointerEvent) {
    const rect = containerRef.current!.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const sim = simRef.current
    if (!sim || reducedMotion || !dropRef.current.done || event.button !== 0) return
    if ((event.target as HTMLElement).closest('button, a')) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    sim.grab(toLocal(event))
    startRef.current()
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    simRef.current?.moveGrab(toLocal(event))
  }

  function handlePointerUp() {
    simRef.current?.release()
    startRef.current()
  }

  const flipLabel = t(flipped ? idCardStrings.flipToFront : idCardStrings.flipToBack)
  const faceBase = 'absolute inset-0 [backface-visibility:hidden]'

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[5]">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <path ref={strapRef} fill="none" stroke="#2d323c" strokeLinejoin="round" />
        <path
          ref={strapShineRef}
          fill="none"
          stroke="rgb(255 255 255 / 14%)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>

      <div
        ref={assemblyRef}
        role="group"
        aria-label={t(idCardStrings.groupLabel)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: CARD_WIDTH,
          height: ASSEMBLY_HEIGHT,
          transformOrigin: '50% 0',
          touchAction: 'none',
          cursor: reducedMotion ? 'default' : 'grab',
        }}
        className="pointer-events-auto absolute top-0 left-0 will-change-transform select-none active:cursor-grabbing"
      >
        <div
          className="absolute left-0 drop-shadow-[0_18px_22px_rgb(0_0_0/45%)]"
          style={{ top: CARD_TOP, width: CARD_WIDTH, height: CARD_HEIGHT, perspective: 1100 }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: reducedMotion ? 'flat' : 'preserve-3d' }}
            animate={reducedMotion ? undefined : { rotateY: flipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          >
            <motion.div
              className={faceBase}
              inert={flipped}
              aria-hidden={flipped}
              animate={reducedMotion ? { opacity: flipped ? 0 : 1 } : undefined}
              transition={{ duration: 0.15 }}
            >
              <CardFront />
            </motion.div>
            <motion.div
              className={faceBase}
              style={reducedMotion ? undefined : { transform: 'rotateY(180deg)' }}
              inert={!flipped}
              aria-hidden={!flipped}
              initial={reducedMotion ? { opacity: 0 } : false}
              animate={reducedMotion ? { opacity: flipped ? 1 : 0 } : undefined}
              transition={{ duration: 0.15 }}
            >
              <CardBack />
            </motion.div>
          </motion.div>
          <button
            type="button"
            aria-label={flipLabel}
            title={flipLabel}
            onClick={() => setFlipped((value) => !value)}
            className="absolute right-3 bottom-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white shadow-md backdrop-blur-sm transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
        <Clip />
      </div>
    </div>
  )
}
