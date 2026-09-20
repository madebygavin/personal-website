import { useEffect, useState } from 'react'

// True when the primary input is a mouse-like pointer with hover support.
// Used to disable hover-only interactions (dock magnification) on touch.
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
    const handleChange = () => setFine(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return fine
}
