import { useState } from 'react'
import { motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { skillCategories, uiStrings } from '../../data/content'
import { SKILL_ICONS, DEFAULT_SKILL_ICON } from '../../config/skillIcons'

// Bar-fill stagger step and per-bar duration (section 7.8 polish pass) —
// kept short so a full 13-skill category finishes well under a second.
const BAR_STAGGER_STEP = 0.05
const BAR_FILL_DURATION = 0.5

// Settings-style layout: sidebar categories, skill rows with level bars
// (section 7.8) — becomes a top segmented control on mobile (section 7.9).
export function SkillsApp() {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
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
          {selected.skills.map((skill, index) => {
            const { icon, color } = SKILL_ICONS[skill.name] ?? DEFAULT_SKILL_ICON
            return (
              <li key={skill.name}>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    tabIndex={0}
                    aria-label={skill.name}
                    className={`inline-flex shrink-0 rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                      reducedMotion
                        ? ''
                        : 'transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-110 focus-visible:-translate-y-0.5 focus-visible:scale-110'
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} style={{ color }} className="w-4 text-sm" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{skill.name}</span>
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
                  {/* Uses the app's single accent color, not the per-skill
                      brand color above — checked the actual numbers (same
                      contrast-computation approach as the earlier
                      opacity-60→70 fix) and most of the 13 brand colors fall
                      well under WCAG 1.4.11's 3:1 non-text bar against this
                      track in light theme (e.g. JavaScript ~1.05:1, React
                      ~1.21:1) — not something worth re-tuning per color, so
                      the bar keeps the accent color, which passes both
                      themes (light 3.51:1, dark 6.67:1), and the distinct
                      color stays on the icon glyph only.
                      aria-valuenow above always reflects the real, final
                      skill.level — the fill's width animation (below) is
                      purely visual and never drives the accessible value. */}
                  <motion.div
                    key={selectedId}
                    className="h-full rounded-full bg-[var(--color-accent)]"
                    initial={{ width: reducedMotion ? `${skill.level}%` : 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{
                      duration: reducedMotion ? 0 : BAR_FILL_DURATION,
                      delay: reducedMotion ? 0 : index * BAR_STAGGER_STEP,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
