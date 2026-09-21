import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../hooks/useLang'
import { experienceEntries, uiStrings } from '../../data/content'

// Timeline-style layout: vertical timeline with date blocks and highlights (section 7.8).
export function ExperienceApp() {
  const { t } = useLang()

  return (
    <div className="h-full overflow-y-auto p-4 text-sm">
      <ol className="flex flex-col gap-6 border-l border-[var(--glass-border)] pl-5">
        {experienceEntries.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[1.45rem] top-1 h-2.5 w-2.5 rounded-full ${
                entry.kind === 'education' ? 'bg-white/40 ring-2 ring-[var(--color-accent)]' : 'bg-[var(--color-accent)]'
              }`}
            />
            <div className="text-xs font-medium opacity-70">{t(entry.period)}</div>
            <div className="text-base font-semibold">{t(entry.role)}</div>
            <div className="flex items-center gap-2">
              <div className="text-sm opacity-80">{entry.org}</div>
              {entry.kind === 'education' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium ring-1 ring-white/20">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-[10px]" />
                  {t(uiStrings.education)}
                </span>
              )}
            </div>
            <ul className="mt-1.5 list-disc pl-4 text-sm opacity-90">
              {entry.highlights.map((highlight, index) => (
                <li key={index}>{t(highlight)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
