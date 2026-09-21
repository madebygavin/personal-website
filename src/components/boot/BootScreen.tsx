import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { BrandMark } from '../shared/BrandMark'
import { useLang } from '../../hooks/useLang'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { uiStrings } from '../../data/content'

interface BootScreenProps {
  onComplete: () => void
}

// Boot progress is fast start, brief pause near 70%, quick finish (section 7.2).
const KEYFRAMES = [0, 70, 72, 100]
const TIMES = [0, 0.4, 0.75, 1]

export function BootScreen({ onComplete }: BootScreenProps) {
  const reducedMotion = useReducedMotion()
  const { t } = useLang()
  const progress = useMotionValue(0)
  const scaleX = useTransform(progress, [0, 100], [0, 1])
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const duration = reducedMotion ? 1.5 : 2.75
    const controls = animate(progress, KEYFRAMES, {
      duration,
      times: TIMES,
      ease: reducedMotion ? 'linear' : ['easeOut', 'easeInOut', 'easeIn'],
      onComplete: () => onCompleteRef.current(),
    })
    return () => controls.stop()
  }, [progress, reducedMotion])

  return (
    <div
      role="status"
      aria-label={t(uiStrings.loading)}
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-black text-white"
    >
      <BrandMark size={72} className="opacity-90" />
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/15">
        <motion.div className="h-full origin-left rounded-full bg-white" style={{ scaleX }} />
      </div>
    </div>
  )
}
