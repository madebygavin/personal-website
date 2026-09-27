import { useEffect, useRef, type RefObject } from 'react'

// Shared by LogoMenu and ControlCenter: "light dismiss" on an outside
// pointerdown, or when focus leaves the container for any reason (including
// Tab) — the ARIA menu-button pattern's close-on-blur behavior. Deliberately
// does NOT refocus the trigger: for Tab specifically, that would fight the
// browser's own focus movement and trap the user. Escape is handled by the
// caller instead, since returning focus to the trigger only makes sense
// there (see LogoMenu/ControlCenter).
//
// `extraContainerRef` is for a panel that's portaled outside `containerRef`'s
// DOM subtree — ControlCenter's mobile bottom sheet and desktop dropdown are
// both portaled (the former to escape a `backdrop-filter` ancestor's
// fixed-position containing block, the latter to anchor off the trigger's
// real on-screen position instead of an assumed one) — without it, a
// portaled panel's own clicks/focus would look "outside" and self-dismiss
// immediately. Omit it when trigger and panel share one subtree (LogoMenu).
export function useDismissablePopover<T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void,
  extraContainerRef?: RefObject<HTMLElement | null>,
): RefObject<T | null> {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return

    function isInside(node: Node | null) {
      if (!node) return false
      return Boolean(
        containerRef.current?.contains(node) || extraContainerRef?.current?.contains(node),
      )
    }

    function handlePointerDown(event: PointerEvent) {
      if (!isInside(event.target as Node)) onDismiss()
    }

    // A null relatedTarget means focus went nowhere (e.g. Safari and Firefox
    // don't focus a button on tap/click), not that it left the popover, so
    // only a move to a different, outside element dismisses. Outside taps are
    // covered by the pointerdown handler above.
    function handleFocusOut(event: FocusEvent) {
      const next = event.relatedTarget as Node | null
      if (next && !isInside(next)) onDismiss()
    }

    const extraContainer = extraContainerRef?.current
    document.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('focusout', handleFocusOut)
    extraContainer?.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('focusout', handleFocusOut)
      extraContainer?.removeEventListener('focusout', handleFocusOut)
    }
  }, [open, onDismiss, extraContainerRef])

  return containerRef
}
