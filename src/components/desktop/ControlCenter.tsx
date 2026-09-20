import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { usePreferences } from '../../state/preferences'
import { useLang } from '../../hooks/useLang'
import { uiStrings } from '../../data/content'
import { useDismissablePopover } from '../../hooks/useDismissablePopover'

const SEGMENT_BASE = 'flex-1 rounded-[8px] py-1 text-xs font-medium transition'
const SEGMENT_ACTIVE = 'bg-white/20'
const SEGMENT_INACTIVE = 'opacity-70 hover:opacity-100'

// Control Center dropdown: appearance, brightness, language (section 7.5).
export function ControlCenter() {
  const { theme, setTheme, brightness, setBrightness, lang, setLang } = usePreferences()
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Explicit close (Escape): returns focus to the trigger. Kept distinct
  // from the popover hook's dismiss, which must NOT refocus — see
  // useDismissablePopover.
  const containerRef = useDismissablePopover<HTMLDivElement>(open, () => setOpen(false))

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

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t(uiStrings.controlCenter)}
        onClick={() => setOpen((v) => !v)}
        className="flex h-5 w-5 items-center justify-center rounded-full text-sm transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <FontAwesomeIcon icon={faSliders} />
      </button>

      {open && (
        <div className="glass-panel absolute right-0 top-full mt-2 w-64 rounded-[var(--radius-window)] p-4 text-sm">
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
        </div>
      )}
    </div>
  )
}
