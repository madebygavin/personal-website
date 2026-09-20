import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLanguage, type Lang } from '../utils/language'

export type Theme = 'dark' | 'light'

interface PreferencesContextValue {
  theme: Theme
  lang: Lang
  brightness: number
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLang: (lang: Lang) => void
  setBrightness: (value: number) => void
}

const STORAGE_KEY_THEME = 'personal-website:theme'
const STORAGE_KEY_LANG = 'personal-website:lang'

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const value = localStorage.getItem(key)
    return (allowed as readonly string[]).includes(value ?? '') ? (value as T) : null
  } catch {
    return null
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage unavailable (private mode, disabled storage); nothing to persist.
  }
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStored(STORAGE_KEY_THEME, ['dark', 'light'] as const) ?? 'dark')
  const [lang, setLangState] = useState<Lang>(
    () => readStored(STORAGE_KEY_LANG, ['en', 'vi'] as const) ?? detectLanguage(navigator.language),
  )
  const [brightness, setBrightness] = useState(100)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    writeStored(STORAGE_KEY_THEME, next)
  }

  const setLang = (next: Lang) => {
    setLangState(next)
    writeStored(STORAGE_KEY_LANG, next)
  }

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      lang,
      brightness,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      setLang,
      setBrightness,
    }),
    [theme, lang, brightness],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook pattern
export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider')
  return ctx
}
