import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { projects, uiStrings, type Project } from '../../data/content'
import { DEFAULT_PROJECT_ICON, PROJECT_ICONS } from '../../config/projectIcons'

type Filter = 'all' | 'web' | 'tools'

const FILTERS: Filter[] = ['all', 'web', 'tools']

// File-browser-style layout: sidebar filter, grid of project "folders",
// clicking one opens a detail view (section 7.8).
export function ProjectsApp() {
  const { t } = useLang()
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = projects.filter((project) => filter === 'all' || project.category === filter)

  if (selected) {
    return (
      <div className="h-full overflow-y-auto p-4 text-sm">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-3 flex items-center gap-1.5 rounded-[var(--radius-control)] px-1 py-0.5 text-xs text-[var(--color-ink-subtle)] transition hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> {t(uiStrings.back)}
        </button>
        <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.1px]">{selected.name}</h3>
        <p className="mt-2 leading-relaxed text-[var(--color-ink-muted)]">{t(selected.summary)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[var(--color-surface-3)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          {selected.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-accent)] underline underline-offset-2"
            >
              {t(link.label)}
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-full text-sm ${isMobile ? 'flex-col' : ''}`}>
      <nav
        aria-label={t(uiStrings.projectFiltersNavLabel)}
        className={
          isMobile
            ? 'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
            : 'w-32 shrink-0 overflow-y-auto border-r border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
        }
      >
        <ul className={isMobile ? 'flex gap-1' : 'flex flex-col gap-1'}>
          {FILTERS.map((f) => (
            <li key={f} className={isMobile ? 'shrink-0' : ''}>
              <button
                type="button"
                onClick={() => setFilter(f)}
                aria-current={filter === f}
                className={`rounded-[var(--radius-control)] px-2 py-1.5 text-left whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  isMobile ? '' : 'w-full'
                } ${
                  filter === f
                    ? 'bg-[var(--color-surface-3)] font-semibold'
                    : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]'
                }`}
              >
                {f === 'all' ? t(uiStrings.filterAll) : f === 'web' ? t(uiStrings.filterWeb) : t(uiStrings.filterTools)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((project) => {
            const { icon, gradient } = PROJECT_ICONS[project.id] ?? DEFAULT_PROJECT_ICON
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelected(project)}
                className="flex flex-col items-center gap-1.5 rounded-[var(--radius-card)] p-2 text-center transition hover:bg-[var(--color-surface-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                <span
                  aria-hidden="true"
                  style={{ backgroundImage: gradient }}
                  className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] text-xl text-white shadow-md"
                >
                  <FontAwesomeIcon icon={icon} />
                </span>
                <span className="text-xs text-[var(--color-ink-muted)]">{project.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
