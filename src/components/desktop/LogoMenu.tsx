import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BRAND } from '../../config/brand'
import { useLang } from '../../hooks/useLang'
import { useSession } from '../../state/session'
import { uiStrings } from '../../data/content'
import { useDismissablePopover } from '../../hooks/useDismissablePopover'
import { AboutDialog } from './AboutDialog'

const MENU_ITEM_CLASS =
  'block w-full rounded-[8px] px-3 py-1.5 text-left transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)]'

// Logo menu: About this site, Restart, Log Out (section 7.5).
export function LogoMenu() {
  const { t } = useLang()
  const session = useSession()
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Explicit close (Escape, or activating an item): returns focus to the
  // trigger. Kept distinct from the popover hook's dismiss, which must NOT
  // refocus — see useDismissablePopover.
  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const containerRef = useDismissablePopover<HTMLDivElement>(open, () => setOpen(false))

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  function focusItem(index: number) {
    const items = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null)
    if (items.length === 0) return
    items[(index + items.length) % items.length]?.focus()
  }

  function handleItemKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusItem(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusItem(index - 1)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(uiStrings.logoMenuLabel)}
        onClick={() => setOpen((v) => !v)}
        className="flex h-5 w-5 items-center justify-center rounded-full text-sm transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <FontAwesomeIcon icon={BRAND.logoIcon} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t(uiStrings.logoMenuLabel)}
          className="glass-panel absolute left-0 top-full mt-2 w-48 rounded-[var(--radius-control)] p-1 text-sm"
        >
          <button
            ref={(el) => {
              itemRefs.current[0] = el
            }}
            role="menuitem"
            type="button"
            onKeyDown={(event) => handleItemKeyDown(event, 0)}
            onClick={() => {
              setOpen(false)
              setAboutOpen(true)
            }}
            className={MENU_ITEM_CLASS}
          >
            {t(uiStrings.aboutThisSite)}
          </button>

          <div role="separator" className="my-1 h-px bg-[var(--glass-border)]" />

          <button
            ref={(el) => {
              itemRefs.current[1] = el
            }}
            role="menuitem"
            type="button"
            onKeyDown={(event) => handleItemKeyDown(event, 1)}
            onClick={() => {
              close()
              session.restart()
            }}
            className={MENU_ITEM_CLASS}
          >
            {t(uiStrings.restart)}
          </button>

          <button
            ref={(el) => {
              itemRefs.current[2] = el
            }}
            role="menuitem"
            type="button"
            onKeyDown={(event) => handleItemKeyDown(event, 2)}
            onClick={() => {
              close()
              session.logout()
            }}
            className={MENU_ITEM_CLASS}
          >
            {t(uiStrings.logout)}
          </button>
        </div>
      )}

      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false)
          buttonRef.current?.focus()
        }}
      />
    </div>
  )
}
