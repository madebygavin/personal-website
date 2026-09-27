import { Suspense, useEffect, useId, useRef } from 'react'
import { motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../hooks/useLang'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { appNames, uiStrings, type AppId } from '../../data/content'
import { APP_COMPONENTS } from '../apps/registry'

interface AppSheetProps {
  appId: AppId
  onClose: () => void
}

// Mobile's equivalent of Window (section 7.9): a full-screen sheet that
// slides up over the whole viewport (status strip included), rather than a
// floating, draggable panel. Genuinely modal — unlike Window, there's
// nothing else reachable behind it — so it gets the same
// role="dialog"/focus-trap treatment as AboutDialog instead of Window's
// deliberately-non-modal one.
export function AppSheet({ appId, onClose }: AppSheetProps) {
  const { t } = useLang()
  const reducedMotion = useReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const ActiveAppComponent = APP_COMPONENTS[appId]

  useFocusTrap(sheetRef, true)

  useEffect(() => {
    sheetRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      initial={{ y: reducedMotion ? 0 : '100%' }}
      animate={{ y: 0 }}
      exit={{ y: reducedMotion ? 0 : '100%' }}
      transition={{ duration: reducedMotion ? 0.15 : 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel fixed inset-0 z-40 flex flex-col overflow-hidden overscroll-contain outline-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative flex h-12 shrink-0 items-center justify-center border-b border-[var(--color-hairline)] px-3">
        <h2 id={titleId} className="m-0 text-[17px] leading-tight font-semibold tracking-[-0.1px]">
          {t(appNames[appId])}
        </h2>
        <button
          type="button"
          aria-label={t(uiStrings.close)}
          onClick={onClose}
          className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full text-base transition hover:bg-[var(--color-surface-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Suspense
          fallback={<div className="flex h-full items-center justify-center text-sm opacity-70">{t(uiStrings.loading)}</div>}
        >
          <ActiveAppComponent />
        </Suspense>
      </div>
    </motion.div>
  )
}
