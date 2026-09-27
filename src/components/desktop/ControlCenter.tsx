import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { usePreferences } from '../../state/preferences'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { uiStrings } from '../../data/content'
import { useDismissablePopover } from '../../hooks/useDismissablePopover'

const SEGMENT_BASE = 'flex-1 rounded-[var(--radius-control)] py-1 text-xs font-medium transition'
const SEGMENT_ACTIVE = 'bg-[var(--color-surface-3)] text-[var(--color-ink)]'
const SEGMENT_INACTIVE = 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'

// Control Center dropdown: appearance, brightness, language (section 7.5).
export function ControlCenter() {
  const { theme, setTheme, brightness, setBrightness, lang, setLang } = usePreferences()
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Both the mobile bottom sheet and the desktop dropdown are portaled to
  // document.body (see the two branches below) — this tracks whichever one
  // is actually mounted, so it's shared rather than one ref per branch.
  const panelRef = useRef<HTMLDivElement>(null)
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; right: number } | null>(null)

  // Explicit close (Escape): returns focus to the trigger. Kept distinct
  // from the popover hook's dismiss, which must NOT refocus — see
  // useDismissablePopover.
  const containerRef = useDismissablePopover<HTMLDivElement>(open, () => setOpen(false), panelRef)

  // Anchors the desktop panel to the trigger button's actual on-screen
  // position, computed fresh from getBoundingClientRect, rather than assuming
  // MenuBar's exact height/width (the previous `fixed right-3 top-8` was
  // only correct by coincidence — see PROGRESS.md section 8, M3 review).
  // Recomputed on open and on resize, since a portaled `fixed` panel doesn't
  // move with the trigger the way an inline sibling would.
  useLayoutEffect(() => {
    if (!open || isMobile) return
    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      setDesktopPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [open, isMobile])

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

  // Both panels are portaled to the end of <body>, no longer DOM-adjacent to
  // the trigger, so a plain Tab from the trigger would land on whatever's
  // next in the *original* tree instead of the panel — found by the tester
  // on mobile at 375×812, reproducible every time; the same mismatch applies
  // to the desktop dropdown now that it's portaled too. Moving focus into the
  // panel's first control on open (same pattern AppSheet/AboutDialog use)
  // sidesteps it entirely: the user is already inside the panel, so
  // subsequent Tabs walk its own (DOM-contiguous) controls.
  useEffect(() => {
    if (!open) return
    const firstControl = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstControl?.focus()
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t(uiStrings.controlCenter)}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center rounded-full transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
          isMobile ? 'h-9 w-9 text-base' : 'h-5 w-5 text-sm'
        }`}
      >
        <FontAwesomeIcon icon={faSliders} />
      </button>

      {open &&
        isMobile &&
        createPortal(
          // Bottom sheet (section 7.9: "mobile-appropriate presentation") —
          // anchored to the viewport, not the trigger, same reasoning as the
          // desktop panel below: this only needs to stay clear of the home
          // screen's own status strip, which `bottom-4` does unconditionally
          // regardless of that strip's exact height.
          //
          // Portaled to document.body rather than rendered inline: the status
          // strip (this component's actual DOM parent on mobile) carries
          // `.glass-panel`'s `backdrop-filter`, which — like `transform` —
          // makes it the containing block for `fixed` descendants. Rendered
          // inline, `bottom-4` resolved against the strip's ~48px box instead
          // of the viewport, pushing most of the panel off-screen above the
          // top (found by the tester at 375×812 — Light/brightness/language
          // controls were physically unreachable). `panelRef` is handed to
          // useDismissablePopover as its `extraContainerRef` so outside-
          // click/focusout dismissal still treats this now-detached subtree
          // as "inside" the popover.
          <div
            ref={panelRef}
            className="glass-panel fixed inset-x-3 bottom-4 z-50 overscroll-contain rounded-[var(--radius-window)] p-4 text-sm"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <ControlCenterFields
              theme={theme}
              setTheme={setTheme}
              brightness={brightness}
              setBrightness={setBrightness}
              lang={lang}
              setLang={setLang}
            />
          </div>,
          document.body,
        )}

      {open &&
        !isMobile &&
        desktopPosition &&
        createPortal(
          // Portaled to document.body and positioned from the trigger's own
          // getBoundingClientRect (see the layout effect above), rather than
          // rendered inline with a `fixed right-3 top-8` guess — that guess
          // was only correct as long as MenuBar stayed exactly `fixed
          // inset-x-0 top-0 h-7` (see PROGRESS.md section 8, M3 review). This
          // is now anchored to the button's real position, so it stays
          // correct regardless of MenuBar's geometry. `panelRef` is handed to
          // useDismissablePopover as its `extraContainerRef`, same as the
          // mobile sheet above, so outside-click/focusout dismissal still
          // treats this detached subtree as "inside" the popover.
          <div
            ref={panelRef}
            style={{ top: desktopPosition.top, right: desktopPosition.right }}
            className="glass-panel fixed z-50 w-64 rounded-[var(--radius-window)] p-4 text-sm"
          >
            <ControlCenterFields
              theme={theme}
              setTheme={setTheme}
              brightness={brightness}
              setBrightness={setBrightness}
              lang={lang}
              setLang={setLang}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

interface ControlCenterFieldsProps {
  theme: ReturnType<typeof usePreferences>['theme']
  setTheme: ReturnType<typeof usePreferences>['setTheme']
  brightness: ReturnType<typeof usePreferences>['brightness']
  setBrightness: ReturnType<typeof usePreferences>['setBrightness']
  lang: ReturnType<typeof usePreferences>['lang']
  setLang: ReturnType<typeof usePreferences>['setLang']
}

// The panel's actual controls (section 7.5/7.9): identical on mobile and
// desktop — only the panel's own position/shape (bottom sheet vs. dropdown)
// differs, handled by the two callers above.
function ControlCenterFields({ theme, setTheme, brightness, setBrightness, lang, setLang }: ControlCenterFieldsProps) {
  const { t } = useLang()

  return (
    <>
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-[var(--color-ink-subtle)]">{t(uiStrings.appearance)}</legend>
        <div className="flex w-full rounded-[var(--radius-control)] bg-[var(--color-surface-2)] p-0.5">
          <button
            type="button"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme('dark')}
            className={`${SEGMENT_BASE} ${theme === 'dark' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
          >
            {t(uiStrings.dark)}
          </button>
          <button
            type="button"
            aria-pressed={theme === 'light'}
            onClick={() => setTheme('light')}
            className={`${SEGMENT_BASE} ${theme === 'light' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
          >
            {t(uiStrings.light)}
          </button>
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="brightness-slider" className="mb-1.5 block text-xs font-medium text-[var(--color-ink-subtle)]">
          {t(uiStrings.brightness)}
        </label>
        <input
          id="brightness-slider"
          type="range"
          min={40}
          max={100}
          value={brightness}
          onChange={(event) => setBrightness(Number(event.target.value))}
          className="w-full accent-[var(--color-accent)]"
        />
      </div>

      <fieldset className="mt-4">
        <legend className="mb-1.5 text-xs font-medium text-[var(--color-ink-subtle)]">{t(uiStrings.language)}</legend>
        <div className="flex w-full rounded-[var(--radius-control)] bg-[var(--color-surface-2)] p-0.5">
          <button
            type="button"
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
            className={`${SEGMENT_BASE} ${lang === 'en' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
          >
            EN
          </button>
          <button
            type="button"
            aria-pressed={lang === 'vi'}
            onClick={() => setLang('vi')}
            className={`${SEGMENT_BASE} ${lang === 'vi' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE}`}
          >
            VI
          </button>
        </div>
      </fieldset>
    </>
  )
}
