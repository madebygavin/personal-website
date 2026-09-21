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
            ? 'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--glass-border)] p-2'
            : 'w-40 shrink-0 overflow-y-auto border-r border-[var(--glass-border)] p-2'
        }
      >
        <ul className={isMobile ? 'flex gap-1' : 'flex flex-col gap-1'}>
          {aboutNotes.map((note) => (
            <li key={note.id} className={isMobile ? 'shrink-0' : ''}>
              <button
                type="button"
                onClick={() => setSelectedId(note.id)}
                aria-current={note.id === selectedId}
                className={`rounded-[8px] px-2 py-1.5 text-left whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  isMobile ? '' : 'w-full'
                } ${note.id === selectedId ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'}`}
              >
                {t(note.title)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-2 text-base font-semibold">{t(selected.title)}</h3>
        <p className="leading-relaxed opacity-90">{t(selected.body)}</p>
      </div>
    </div>
  )
}
