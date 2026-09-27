import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHelmetSafety } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import avatarUrl from '../../assets/avatar.webp'
import { useLang } from '../../hooks/useLang'
import { appNames, contactChannels, contactInfo, idCardStrings, profile } from '../../data/content'
import { BrandMark } from '../shared/BrandMark'

export const CARD_WIDTH = 232
export const CARD_HEIGHT = 340

const CARD_BODY = 'linear-gradient(165deg, #343a45 0%, #1d2027 55%, #14161b 100%)'

function Slot() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-3 left-1/2 h-2.5 w-14 -translate-x-1/2 rounded-full bg-black/70 shadow-[inset_0_1px_2px_rgb(0_0_0/80%),0_1px_0_rgb(255_255_255/10%)]"
    />
  )
}

// Diagonal accent blocks: original geometry, tinted with the site's accent
// and surface tokens (DESIGN.md) rather than a one-off hardcoded pair, so the
// card reads as part of the same system instead of its own gradient.
function Accents({ variant }: { variant: 'front' | 'back' }) {
  const [light, dark] =
    variant === 'front'
      ? ['0,292 232,236 232,340 0,340', '0,318 232,282 232,340 0,340']
      : ['0,250 232,150 232,340 0,340', '0,290 232,205 232,340 0,340']
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 232 340"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <polygon points={light} fill="var(--color-accent)" opacity="0.5" />
      <polygon points={dark} fill="var(--color-canvas)" opacity="0.55" />
    </svg>
  )
}

export function CardFront() {
  const { t } = useLang()
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[18px] text-white"
      style={{ backgroundImage: CARD_BODY }}
    >
      <Accents variant="front" />
      <Slot />
      <div className="absolute inset-x-0 top-10 flex justify-center">
        <div className="h-[132px] w-[132px] overflow-hidden rounded-full border-2 border-white/25 shadow-lg">
          <img src={avatarUrl} alt="" draggable={false} width={132} height={132} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="absolute inset-x-0 top-[186px] px-5 text-center">
        <p className="text-[40px] leading-tight font-semibold tracking-[-0.5px]">{profile.name}</p>
        <p className="mt-1 text-[13px] font-medium text-white/80">{t(profile.title)}</p>
      </div>
      <BrandMark size={28} className="absolute bottom-4 left-4" />
    </div>
  )
}

const CHANNEL_ICONS: Record<'email' | 'linkedin' | 'github', IconDefinition> = {
  email: faEnvelope,
  linkedin: faLinkedin,
  github: faGithub,
}

function channelHref(id: 'email' | 'linkedin' | 'github'): string {
  if (id === 'email') return `mailto:${contactInfo.email}`
  return id === 'linkedin' ? contactInfo.linkedinUrl : contactInfo.githubUrl
}

function channelText(id: 'email' | 'linkedin' | 'github'): string {
  if (id === 'email') return contactInfo.email
  return channelHref(id).replace(/^https?:\/\/(www\.)?/, '')
}

export function CardBack() {
  const { t } = useLang()
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[18px] text-white"
      style={{ backgroundImage: CARD_BODY }}
    >
      <Accents variant="back" />
      <Slot />
      <p className="absolute inset-x-0 top-9 px-5 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
        {t(appNames.contact)}
      </p>
      <ul className="absolute inset-x-4 top-[58px] space-y-1.5 text-[12px]">
        {contactChannels.map((channel) => (
          <li key={channel.id}>
            <a
              href={channelHref(channel.id)}
              target={channel.id === 'email' ? undefined : '_blank'}
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white/8 px-2.5 py-1.5 transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
            >
              <FontAwesomeIcon icon={CHANNEL_ICONS[channel.id]} className="w-4 shrink-0" />
              <span className="min-w-0 truncate">{channelText(channel.id)}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#ffc233] text-[30px] text-[#14161b] shadow-lg"
        >
          <FontAwesomeIcon icon={faHelmetSafety} />
        </span>
        <span className="text-[11px] font-semibold text-white">
          {t(idCardStrings.underConstruction)}
        </span>
      </div>
    </div>
  )
}
