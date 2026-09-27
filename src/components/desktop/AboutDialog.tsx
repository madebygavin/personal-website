import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { BRAND } from '../../config/brand'
import { useLang } from '../../hooks/useLang'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { uiStrings } from '../../data/content'

interface AboutDialogProps {
  open: boolean
  onClose: () => void
}

// Small glass dialog (section 3, gap #6). Closes on Escape or backdrop click.
export function AboutDialog({ open, onClose }: AboutDialogProps) {
  const { t } = useLang()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useFocusTrap(dialogRef, open)

  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  // Portaled to <body>: this dialog is rendered from inside LogoMenu, which
  // lives inside MenuBar's .glass-panel. backdrop-filter on that ancestor
  // makes it the containing block for `position: fixed` descendants (same
  // rule as transform/filter), so `fixed inset-0` here would cover the
  // 28px menu bar instead of the viewport without the portal.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="glass-panel w-full max-w-sm rounded-[var(--radius-window)] p-5 text-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[22px] leading-tight font-semibold tracking-[-0.2px]">
            {BRAND.siteName}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={t(uiStrings.close)}
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs transition hover:bg-[var(--color-surface-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <p className="mt-3 text-[var(--color-ink-muted)]">{t(uiStrings.builtWith)}</p>
        <a
          href={BRAND.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-[var(--color-accent)] underline underline-offset-2"
        >
          {t(uiStrings.viewSource)}
        </a>
      </div>
    </div>,
    document.body,
  )
}
