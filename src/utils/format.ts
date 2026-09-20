import type { Lang } from './language'

const localeFor: Record<Lang, string> = { en: 'en-US', vi: 'vi-VN' }

export function formatClock(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor[lang], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: lang === 'en',
  }).format(date)
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor[lang], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
