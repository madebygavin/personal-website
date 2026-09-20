export type Lang = 'en' | 'vi'

export function detectLanguage(navigatorLanguage: string | undefined | null): Lang {
  return navigatorLanguage?.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}
