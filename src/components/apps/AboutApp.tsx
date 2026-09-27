import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { aboutNotes, uiStrings } from '../../data/content'

// Notes-style layout: sidebar of notes, selected note's body on the right
// (section 7.8) — becomes a top segmented control on mobile (section 7.9).
export function AboutApp() {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState(aboutNotes[0].id)
  const selected = aboutNotes.find((note) => note.id === selectedId) ?? aboutNotes[0]

  return (
    <div className={`flex h-full text-sm ${isMobile ? 'flex-col' : ''}`}>
      <nav
        aria-label={t(uiStrings.notesNavLabel)}
        className={
          isMobile
            ? 'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
            : 'w-40 shrink-0 overflow-y-auto border-r border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
        }
      >
        <ul className={isMobile ? 'flex gap-1' : 'flex flex-col gap-1'}>
          {aboutNotes.map((note) => (
            <li key={note.id} className={isMobile ? 'shrink-0' : ''}>
              <button
                type="button"
                onClick={() => setSelectedId(note.id)}
                aria-current={note.id === selectedId}
                className={`rounded-[var(--radius-control)] px-2 py-1.5 text-left whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  isMobile ? '' : 'w-full'
                } ${
                  note.id === selectedId
                    ? 'bg-[var(--color-surface-3)] font-semibold'
                    : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]'
                }`}
              >
                {t(note.title)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-2 text-[17px] leading-tight font-semibold tracking-[-0.1px]">{t(selected.title)}</h3>
        <p className="leading-relaxed text-[var(--color-ink-muted)]">{t(selected.body)}</p>
      </div>
    </div>
  )
}
