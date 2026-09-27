import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import { motion, useDragControls } from 'motion/react'
import { useLang } from '../../hooks/useLang'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { uiStrings } from '../../data/content'

interface WindowProps {
  title: string
  constraintsRef: RefObject<HTMLElement | null>
  onClose: () => void
  children: ReactNode
}

// Single-window chrome (section 7.7). Deliberately not modal: focus moves in
// on open, but Tab is free to continue past it into the dock/menu bar rather
// than being trapped (see useFocusTrap, which AboutDialog uses instead —
// that one IS modal). Escape only closes while focus is inside the window,
// via onKeyDown here rather than a document-level listener.
export function Window({ title, constraintsRef, onClose, children }: WindowProps) {
  const { t } = useLang()
  const reducedMotion = useReducedMotion()
  const dragControls = useDragControls()
  const windowRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  // Confirmed via an isolated repro: a motion.div that both scales in on
  // mount (initial/animate scale) AND has dragConstraints resolves the
  // constraint box against the wrong (pre-settle) scale, letting drag push
  // the window well past the free area — even long after the entrance
  // animation visually finishes. Enabling drag only once that animation
  // has actually completed sidesteps it entirely.
  const [entered, setEntered] = useState(reducedMotion)

  useEffect(() => {
    windowRef.current?.focus()
  }, [])

  return (
    <motion.div
      ref={windowRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      drag={entered}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={entered ? constraintsRef : undefined}
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.2 }}
      onAnimationComplete={() => setEntered(true)}
      style={{ width: 'min(880px, 90vw)', height: 'min(600px, 100%)' }}
      className="glass-panel pointer-events-auto relative flex flex-col overflow-hidden rounded-[var(--radius-window)] outline-none"
    >
      <div
        onPointerDown={(event) => dragControls.start(event)}
        className="relative flex h-9 shrink-0 items-center justify-center border-b border-[var(--color-hairline)] px-3"
      >
        {/* Monochrome dots, not the literal macOS traffic-light colors (DESIGN.md):
            only the working close button tints on hover/focus; the two permanently
            disabled controls never gain color. */}
        <div className="absolute left-3 flex items-center gap-1.5" onPointerDown={(event) => event.stopPropagation()}>
          <button
            type="button"
            aria-label={t(uiStrings.close)}
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[var(--color-ink-tertiary)] transition hover:bg-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          />
          <button
            type="button"
            aria-label={t(uiStrings.minimize)}
            disabled
            className="h-3 w-3 cursor-default rounded-full bg-[var(--color-ink-tertiary)] opacity-40"
          />
          <button
            type="button"
            aria-label={t(uiStrings.maximize)}
            disabled
            className="h-3 w-3 cursor-default rounded-full bg-[var(--color-ink-tertiary)] opacity-40"
          />
        </div>
        <h2 id={titleId} className="m-0 text-[22px] leading-tight font-semibold tracking-[-0.2px]">
          {title}
        </h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </motion.div>
  )
}
