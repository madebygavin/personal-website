import { describe, expect, it } from 'vitest'
import { computeZoomTransform } from './zoom'

describe('computeZoomTransform', () => {
  it('centers the origin on the screen rect and scales it to fill the viewport', () => {
    const outerRect = { left: 100, top: 50, width: 800, height: 600 }
    const screenRect = { left: 140, top: 80, width: 720, height: 450 }

    const result = computeZoomTransform(outerRect, screenRect, 1440, 900)

    expect(result.originX).toBeCloseTo(140 - 100 + 720 / 2)
    expect(result.originY).toBeCloseTo(80 - 50 + 450 / 2)
    expect(result.scaleX).toBeCloseTo(1440 / 720)
    expect(result.scaleY).toBeCloseTo(900 / 450)
    expect(result.x).toBeCloseTo(1440 / 2 - (140 + 720 / 2))
    expect(result.y).toBeCloseTo(900 / 2 - (80 + 450 / 2))
  })

  it('produces zero translation when the screen is already centered on the viewport', () => {
    const outerRect = { left: 0, top: 0, width: 1440, height: 900 }
    const screenRect = { left: 320, top: 200, width: 800, height: 500 }

    const result = computeZoomTransform(outerRect, screenRect, 1440, 900)

    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
  })
})
