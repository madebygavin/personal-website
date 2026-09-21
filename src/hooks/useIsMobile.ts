import { useEffect, useState } from 'react'

// Section 7.9's mobile layout applies "under 768px" — matches Tailwind's
// default `md` breakpoint, so this hook's threshold and any `md:` utility
// classes agree on the same cutoff.
const QUERY = '(max-width: 767px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handleChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
