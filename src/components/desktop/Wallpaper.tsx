import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    function handleChange() {
      setVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', handleChange)
    return () => document.removeEventListener('visibilitychange', handleChange)
  }, [])

  return visible
}

// Slow drifting gray gradient (section 7.4). Pure CSS animation on
// background-position, paused when the tab is hidden or reduced motion is
// requested (section 3, gap #18) instead of unmounting/remounting it.
export function Wallpaper() {
  const visible = useDocumentVisible()
  const reducedMotion = useReducedMotion()
  const playing = visible && !reducedMotion

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 bg-[length:200%_200%] [background-image:radial-gradient(ellipse_at_top_left,_var(--wallpaper-a)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_var(--wallpaper-b)_0%,_transparent_55%),linear-gradient(var(--wallpaper-base),var(--wallpaper-base))]"
      style={{
        animation: 'wallpaper-drift 30s ease-in-out infinite alternate',
        animationPlayState: playing ? 'running' : 'paused',
      }}
    />
  )
}
