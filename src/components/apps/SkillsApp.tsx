import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { skillCategories, uiStrings } from '../../data/content'

// Settings-style layout: sidebar categories, skill rows with level bars
// (section 7.8) — becomes a top segmented control on mobile (section 7.9).
export function SkillsApp() {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState(skillCategories[0].id)
  const selected = skillCategories.find((category) => category.id === selectedId) ?? skillCategories[0]

  return (
    <div className={`flex h-full text-sm ${isMobile ? 'flex-col' : ''}`}>
      <nav
        aria-label={t(uiStrings.skillCategoriesNavLabel)}
        className={
          isMobile
            ? 'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--glass-border)] p-2'
            : 'w-40 shrink-0 overflow-y-auto border-r border-[var(--glass-border)] p-2'
        }
      >
        <ul className={isMobile ? 'flex gap-1' : 'flex flex-col gap-1'}>
          {skillCategories.map((category) => (
            <li key={category.id} className={isMobile ? 'shrink-0' : ''}>
              <button
                type="button"
                onClick={() => setSelectedId(category.id)}
                aria-current={category.id === selectedId}
                className={`rounded-[8px] px-2 py-1.5 text-left whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  isMobile ? '' : 'w-full'
                } ${category.id === selectedId ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'}`}
              >
                {t(category.label)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-3 text-base font-semibold">{t(selected.label)}</h3>
        <ul className="flex flex-col gap-3">
          {selected.skills.map((skill) => (
            <li key={skill.name}>
              <div className="mb-1 flex items-center justify-between">
                <span>{skill.name}</span>
                <span className="text-xs opacity-70">{skill.level}%</span>
              </div>
              <div
                role="progressbar"
                aria-label={skill.name}
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1.5 w-full overflow-hidden rounded-full bg-black/10"
              >
                <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${skill.level}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
