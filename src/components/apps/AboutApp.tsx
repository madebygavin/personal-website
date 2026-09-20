import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { aboutNotes, uiStrings } from '../../data/content'

// Notes-style layout: sidebar of notes, selected note's body on the right (section 7.8).
export function AboutApp() {
  const { t } = useLang()
  const [selectedId, setSelectedId] = useState(aboutNotes[0].id)
  const selected = aboutNotes.find((note) => note.id === selectedId) ?? aboutNotes[0]

  return (
    <div className="flex h-full text-sm">
      <nav aria-label={t(uiStrings.notesNavLabel)} className="w-40 shrink-0 overflow-y-auto border-r border-[var(--glass-border)] p-2">
        <ul className="flex flex-col gap-1">
          {aboutNotes.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => setSelectedId(note.id)}
                aria-current={note.id === selectedId}
                className={`w-full rounded-[8px] px-2 py-1.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  note.id === selectedId ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'
                }`}
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
