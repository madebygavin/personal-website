export interface ZoomTransform {
  originX: number
  originY: number
  x: number
  y: number
  scaleX: number
  scaleY: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

// Computes the transform needed to visually grow `screenRect` (a small area
// inside `outerRect`) until it fills the viewport — a FLIP-style zoom
// (section 7.3). `transformOrigin` should be set to (originX, originY),
// relative to outerRect's top-left, before animating x/y/scaleX/scaleY.
export function computeZoomTransform(
  outerRect: Rect,
  screenRect: Rect,
  viewportWidth: number,
  viewportHeight: number,
): ZoomTransform {
  const originX = screenRect.left - outerRect.left + screenRect.width / 2
  const originY = screenRect.top - outerRect.top + screenRect.height / 2
  const scaleX = viewportWidth / screenRect.width
  const scaleY = viewportHeight / screenRect.height
  const x = viewportWidth / 2 - (screenRect.left + screenRect.width / 2)
  const y = viewportHeight / 2 - (screenRect.top + screenRect.height / 2)
  return { originX, originY, x, y, scaleX, scaleY }
}
