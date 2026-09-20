import { useCallback } from 'react'
import { usePreferences } from '../state/preferences'
import type { Localized } from '../data/content'

export function useLang() {
  const { lang, setLang } = usePreferences()

  const t = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang])

  return { lang, setLang, t }
}
