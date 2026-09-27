import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useLang } from '../../hooks/useLang'
import { useIsMobile } from '../../hooks/useIsMobile'
import { contactChannels, contactInfo, contactMessage, uiStrings, type ContactChannel, type Localized } from '../../data/content'

const CHANNEL_ICON: Record<ContactChannel['id'], IconDefinition> = {
  email: faEnvelope,
  linkedin: faLinkedin,
  github: faGithub,
}

const CHANNEL_HREF: Record<ContactChannel['id'], string> = {
  email: `mailto:${contactInfo.email}`,
  linkedin: contactInfo.linkedinUrl,
  github: contactInfo.githubUrl,
}

const CHANNEL_LABEL: Record<ContactChannel['id'], Localized<string>> = Object.fromEntries(
  contactChannels.map((channel) => [channel.id, channel.label]),
) as Record<ContactChannel['id'], Localized<string>>

// Mail-style layout: sidebar of channels, a message card with action buttons.
// No contact form (out of scope, section 13); section 7.8.
export function ContactApp() {
  const { t } = useLang()
  const isMobile = useIsMobile()

  return (
    <div className={`flex h-full text-sm ${isMobile ? 'flex-col' : ''}`}>
      <nav
        aria-label={t(uiStrings.contactChannelsNavLabel)}
        className={
          isMobile
            ? 'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
            : 'w-40 shrink-0 overflow-y-auto border-r border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-2'
        }
      >
        <ul className={isMobile ? 'flex gap-1' : 'flex flex-col gap-1'}>
          {contactChannels.map((channel) => (
            <li key={channel.id} className={isMobile ? 'shrink-0' : ''}>
              <a
                href={CHANNEL_HREF[channel.id]}
                target={channel.id === 'email' ? undefined : '_blank'}
                rel={channel.id === 'email' ? undefined : 'noreferrer'}
                className="flex items-center gap-2 rounded-[var(--radius-control)] px-2 py-1.5 whitespace-nowrap text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)]"
              >
                <FontAwesomeIcon icon={CHANNEL_ICON[channel.id]} className="w-4" />
                {t(channel.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-[var(--radius-card)] bg-[var(--color-surface-2)] p-4">
          <p className="leading-relaxed text-[var(--color-ink-muted)]">{t(contactMessage)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={CHANNEL_HREF.email}
              className="rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-1.5" />
              {t(CHANNEL_LABEL.email)}
            </a>
            <a
              href={CHANNEL_HREF.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[var(--color-surface-3)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] ring-1 ring-[var(--color-hairline-strong)] transition hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <FontAwesomeIcon icon={faLinkedin} className="mr-1.5" />
              {t(CHANNEL_LABEL.linkedin)}
            </a>
            <a
              href={CHANNEL_HREF.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[var(--color-surface-3)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] ring-1 ring-[var(--color-hairline-strong)] transition hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-1.5" />
              {t(CHANNEL_LABEL.github)}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
