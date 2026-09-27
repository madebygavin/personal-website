import { describe, expect, it } from 'vitest'
import { Lanyard } from './lanyard'

const CONFIG = { anchor: { x: 500, y: 0 }, stringLength: 170, cardLength: 350 }

function run(sim: Lanyard, seconds: number, onFrame?: (t: number) => void) {
  const frames = Math.round(seconds * 60)
  for (let f = 0; f < frames; f++) {
    sim.advance(1 / 60)
    onFrame?.(f / 60)
  }
}

describe('Lanyard', () => {
  it('starts asleep, hanging straight below the anchor', () => {
    const sim = new Lanyard(CONFIG)
    expect(sim.isAsleep).toBe(true)
    expect(sim.clip.x).toBeCloseTo(500)
    expect(sim.clip.y).toBeCloseTo(170)
    expect(sim.cardBottom.y).toBeCloseTo(520)
    expect(sim.angle).toBeCloseTo(0)
  })

  it('swings across center after a kick, then settles asleep at rest', () => {
    const sim = new Lanyard(CONFIG)
    sim.kick(400)
    let sawRight = false
    let sawLeft = false
    run(sim, 20, () => {
      if (sim.clip.x > 505) sawRight = true
      if (sim.clip.x < 495) sawLeft = true
    })
    expect(sawRight && sawLeft).toBe(true)
    expect(sim.isAsleep).toBe(true)
    expect(Math.abs(sim.clip.x - 500)).toBeLessThan(1)
    expect(Math.abs(sim.angle)).toBeLessThan(0.01)
  })

  it('keeps the string and card lengths (nearly) constant while swinging', () => {
    const sim = new Lanyard(CONFIG)
    sim.kick(500)
    let worst = 0
    run(sim, 6, () => {
      const pts = sim.stringPoints
      let len = 0
      for (let i = 1; i < pts.length; i++)
        len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
      const card = Math.hypot(sim.cardBottom.x - sim.clip.x, sim.cardBottom.y - sim.clip.y)
      worst = Math.max(worst, Math.abs(len - 170) / 170, Math.abs(card - 350) / 350)
    })
    expect(worst).toBeLessThan(0.05)
  })

  it('drops in from a raised anchor without blowing up and comes to rest', () => {
    const sim = new Lanyard(CONFIG)
    const startY = -(170 + 350 + 40)
    sim.setAnchor(500, startY)
    sim.reset()
    sim.setAnchor(500, startY)
    const duration = 0.9
    run(sim, 20, (t) => {
      const p = Math.min(1, t / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      if (p < 1) sim.setAnchor(500, startY * (1 - eased))
      else if (t < duration + 0.05) sim.setAnchor(500, 0)
      expect(Number.isFinite(sim.clip.x) && Number.isFinite(sim.clip.y)).toBe(true)
    })
    expect(sim.isAsleep).toBe(true)
    expect(Math.abs(sim.clip.y - 170)).toBeLessThan(6)
  })

  it('follows a drag, then swings back through center on release', () => {
    const sim = new Lanyard(CONFIG)
    const grabPoint = { x: 500, y: 400 }
    sim.grab(grabPoint)
    expect(sim.isGrabbed).toBe(true)
    run(sim, 1, (t) => sim.moveGrab({ x: 500 + 150 * Math.min(1, t / 0.5), y: 400 }))
    expect(sim.cardBottom.x).toBeGreaterThan(530)
    sim.release()
    let crossed = false
    run(sim, 20, () => {
      if (sim.cardBottom.x < 490) crossed = true
    })
    expect(crossed).toBe(true)
    expect(sim.isAsleep).toBe(true)
  })

  it('cannot be dragged farther than the string and card allow', () => {
    const sim = new Lanyard(CONFIG)
    sim.grab({ x: 500, y: 400 })
    run(sim, 2, () => sim.moveGrab({ x: 5000, y: 400 }))
    expect(Math.hypot(sim.clip.x - 500, sim.clip.y)).toBeLessThan(170 * 1.05)
  })
})
