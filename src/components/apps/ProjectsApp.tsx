import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../hooks/useLang'
import { projects, uiStrings, type Project } from '../../data/content'

type Filter = 'all' | 'web' | 'tools'

const FILTERS: Filter[] = ['all', 'web', 'tools']

// File-browser-style layout: sidebar filter, grid of project "folders",
// clicking one opens a detail view (section 7.8).
export function ProjectsApp() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = projects.filter((project) => filter === 'all' || project.category === filter)

  if (selected) {
    return (
      <div className="h-full overflow-y-auto p-4 text-sm">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-3 flex items-center gap-1.5 rounded-[8px] px-1 py-0.5 text-xs opacity-70 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> {t(uiStrings.back)}
        </button>
        <h3 className="text-base font-semibold">{selected.name}</h3>
        <p className="mt-2 leading-relaxed opacity-90">{t(selected.summary)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.tech.map((tech) => (
            <span key={tech} className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
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
    <div className="flex h-full text-sm">
      <nav aria-label={t(uiStrings.projectFiltersNavLabel)} className="w-32 shrink-0 overflow-y-auto border-r border-[var(--glass-border)] p-2">
        <ul className="flex flex-col gap-1">
          {FILTERS.map((f) => (
            <li key={f}>
              <button
                type="button"
                onClick={() => setFilter(f)}
                aria-current={filter === f}
                className={`w-full rounded-[8px] px-2 py-1.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                  filter === f ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'
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
          {filtered.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="flex flex-col items-center gap-1.5 rounded-[10px] p-2 text-center transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <FontAwesomeIcon icon={faFolder} className="text-3xl text-[var(--color-accent)]" />
              <span className="text-xs">{project.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
