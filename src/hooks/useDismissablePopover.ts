import { useEffect, useRef, type RefObject } from 'react'

// Shared by LogoMenu and ControlCenter: "light dismiss" on an outside
// pointerdown, or when focus leaves the container for any reason (including
// Tab) — the ARIA menu-button pattern's close-on-blur behavior. Deliberately
// does NOT refocus the trigger: for Tab specifically, that would fight the
// browser's own focus movement and trap the user. Escape is handled by the
// caller instead, since returning focus to the trigger only makes sense
// there (see LogoMenu/ControlCenter).
export function useDismissablePopover<T extends HTMLElement>(open: boolean, onDismiss: () => void): RefObject<T | null> {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onDismiss()
      }
    }

    function handleFocusOut(event: FocusEvent) {
      const next = event.relatedTarget as Node | null
      if (!next || !containerRef.current?.contains(next)) {
        onDismiss()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('focusout', handleFocusOut)
    }
  }, [open, onDismiss])

  return containerRef
}
