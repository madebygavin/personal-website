import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { usePreferences } from '../../state/preferences'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { uiStrings } from '../../data/content'
import { useDismissablePopover } from '../../hooks/useDismissablePopover'

const SEGMENT_BASE = 'flex-1 rounded-[8px] py-1 text-xs font-medium transition'
const SEGMENT_ACTIVE = 'bg-white/20'
const SEGMENT_INACTIVE = 'opacity-70 hover:opacity-100'

// Control Center dropdown: appearance, brightness, language (section 7.5).
export function ControlCenter() {
  const { theme, setTheme, brightness, setBrightness, lang, setLang } = usePreferences()
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Only relevant on mobile, where the panel is portaled out to document.body
  // (see the `isMobile` branch below) — unused, and harmless as an always-null
  // ref, on desktop.
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  // Explicit close (Escape): returns focus to the trigger. Kept distinct
  // from the popover hook's dismiss, which must NOT refocus — see
  // useDismissablePopover.
  const containerRef = useDismissablePopover<HTMLDivElement>(open, () => setOpen(false), mobilePanelRef)

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

  // Mobile-only: the portaled panel is appended at the end of <body>, no
  // longer DOM-adjacent to the trigger, so a plain Tab from the trigger would
  // land on whatever's next in the *original* tree (the home screen's icon
  // grid) instead of the panel — found by the tester at 375×812, reproducible
  // every time. Moving focus into the panel's first control on open (same
  // pattern AppSheet/AboutDialog use) sidesteps the mismatch entirely: the
  // user is already inside the panel, so subsequent Tabs walk its own
  // (DOM-contiguous) controls rather than depending on where the portal
  // happens to sit in the wider document. Desktop's panel is untouched — it's
  // DOM-adjacent to its trigger already, so this isn't needed there.
  useEffect(() => {
    if (!open || !isMobile) return
    const firstControl = mobilePanelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstControl?.focus()
  }, [open, isMobile])

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
          // controls were physically unreachable). `mobilePanelRef` is handed
          // to useDismissablePopover as its `extraContainerRef` so outside-
          // click/focusout dismissal still treats this now-detached subtree
          // as "inside" the popover.
          <div
            ref={mobilePanelRef}
            className="glass-panel fixed inset-x-3 bottom-4 z-50 rounded-[var(--radius-window)] p-4 text-sm"
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

      {open && !isMobile && (
        // Fixed to the viewport edge rather than the trigger button so the
        // panel can't overflow off-screen at narrow widths (the trigger sits
        // inboard of the right edge, so `absolute right-0` on the button
        // doesn't leave room for a 256px panel below ~430px). This is only
        // correct because MenuBar is `fixed inset-x-0 top-0 h-7` — its edges
        // coincide with the viewport's. If MenuBar's positioning, height, or
        // full-width-ness ever changes, these values (right-3 top-8) need to
        // change with it; they are not independently correct.
        <div className="glass-panel fixed right-3 top-8 w-64 rounded-[var(--radius-window)] p-4 text-sm">
          <ControlCenterFields
            theme={theme}
            setTheme={setTheme}
            brightness={brightness}
            setBrightness={setBrightness}
            lang={lang}
            setLang={setLang}
          />
        </div>
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
        <legend className="mb-1.5 text-xs font-medium opacity-70">{t(uiStrings.appearance)}</legend>
        <div className="flex w-full rounded-[var(--radius-control)] bg-black/10 p-0.5">
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
        <label htmlFor="brightness-slider" className="mb-1.5 block text-xs font-medium opacity-70">
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
        <legend className="mb-1.5 text-xs font-medium opacity-70">{t(uiStrings.language)}</legend>
        <div className="flex w-full rounded-[var(--radius-control)] bg-black/10 p-0.5">
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
