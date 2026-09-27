// Verlet rope + rigid-card simulation for the hanging ID card. Pure and
// DOM-free so it can be unit tested. Coordinates are CSS pixels, y points down.
//
// Particle layout: 0 = anchor (pinned), 1..segments = string nodes (the last
// one is the clip, "C"), segments + 1 = bottom of the card ("B"). The card is
// the rigid rod C-B; its rotation is derived from that rod.

export interface Vec {
  x: number
  y: number
}

export interface LanyardConfig {
  anchor: Vec
  stringLength: number
  // Distance from the clip point down to the bottom edge of the card.
  cardLength: number
  segments?: number
}

const STEP = 1 / 120
const GRAVITY = 6000
const ITERATIONS = 16
const STRING_MASS = 0.2
const CARD_MASS = 1
const STRING_DAMPING = 0.992
const CARD_DAMPING = 0.9955
const MAX_STEP_DISTANCE = 40
const GRAB_FOLLOW = 0.35
const SLEEP_SPEED = 0.04
const SLEEP_STEPS = 60
const SLEEP_OFFSET = 1

interface Grab {
  t: number
  offset: Vec
  target: Vec
  current: Vec
}

export class Lanyard {
  readonly segments: number
  private readonly n: number
  private readonly xs: Float64Array
  private readonly ys: Float64Array
  private readonly pxs: Float64Array
  private readonly pys: Float64Array
  private readonly invMass: Float64Array
  private readonly rest: Float64Array
  private anchor: Vec
  private grabState: Grab | null = null
  private accumulator = 0
  private calmSteps = 0
  private asleep = false
  readonly stringLength: number
  readonly cardLength: number

  constructor(config: LanyardConfig) {
    this.segments = config.segments ?? 8
    this.stringLength = config.stringLength
    this.cardLength = config.cardLength
    this.anchor = { ...config.anchor }
    this.n = this.segments + 2
    this.xs = new Float64Array(this.n)
    this.ys = new Float64Array(this.n)
    this.pxs = new Float64Array(this.n)
    this.pys = new Float64Array(this.n)
    this.invMass = new Float64Array(this.n)
    this.rest = new Float64Array(this.n - 1)

    const segLen = config.stringLength / this.segments
    for (let i = 0; i < this.n - 1; i++)
      this.rest[i] = i < this.segments ? segLen : config.cardLength
    for (let i = 0; i < this.n; i++) {
      const isCard = i >= this.segments
      this.invMass[i] = i === 0 ? 0 : 1 / (isCard ? CARD_MASS : STRING_MASS)
    }
    this.placeAtRest()
  }

  // Straight hang directly below the anchor, zero velocity.
  private placeAtRest() {
    let y = this.anchor.y
    for (let i = 0; i < this.n; i++) {
      if (i > 0) y += this.rest[i - 1]
      this.xs[i] = this.pxs[i] = this.anchor.x
      this.ys[i] = this.pys[i] = y
    }
    this.calmSteps = 0
    this.asleep = true
  }

  reset() {
    this.grabState = null
    this.accumulator = 0
    this.placeAtRest()
  }

  get isAsleep(): boolean {
    return this.asleep
  }

  get isGrabbed(): boolean {
    return this.grabState !== null
  }

  get clip(): Vec {
    return { x: this.xs[this.segments], y: this.ys[this.segments] }
  }

  // Card rotation in radians, clockwise-positive to match CSS rotate().
  get angle(): number {
    const c = this.segments
    return Math.atan2(-(this.xs[c + 1] - this.xs[c]), this.ys[c + 1] - this.ys[c])
  }

  get stringPoints(): Vec[] {
    const pts: Vec[] = []
    for (let i = 0; i <= this.segments; i++) pts.push({ x: this.xs[i], y: this.ys[i] })
    return pts
  }

  get cardBottom(): Vec {
    return { x: this.xs[this.n - 1], y: this.ys[this.n - 1] }
  }

  // Moves the pinned anchor. Everything else follows through the constraints.
  setAnchor(x: number, y: number) {
    this.anchor.x = x
    this.anchor.y = y
    this.asleep = false
    this.calmSteps = 0
  }

  // Horizontal impulse on the card, in px/s.
  kick(vx: number) {
    const c = this.segments
    for (let i = c; i < this.n; i++) this.pxs[i] = this.xs[i] - vx * STEP
    this.wake()
  }

  // Grab the card at `point`. The grabbed spot is projected onto the C-B rod
  // to a fraction `t` (0 = clip, 1 = bottom); the perpendicular remainder is
  // kept as an offset so the card does not jump under the pointer.
  grab(point: Vec) {
    const c = this.segments
    const cx = this.xs[c]
    const cy = this.ys[c]
    const dx = this.xs[c + 1] - cx
    const dy = this.ys[c + 1] - cy
    const len2 = dx * dx + dy * dy
    const t = Math.min(1, Math.max(0, ((point.x - cx) * dx + (point.y - cy) * dy) / len2))
    const onRod = { x: cx + dx * t, y: cy + dy * t }
    this.grabState = {
      t,
      offset: { x: point.x - onRod.x, y: point.y - onRod.y },
      target: { ...onRod },
      current: { ...onRod },
    }
    this.wake()
  }

  moveGrab(point: Vec) {
    const g = this.grabState
    if (!g) return
    g.target.x = point.x - g.offset.x
    g.target.y = point.y - g.offset.y
    this.wake()
  }

  release() {
    this.grabState = null
    this.wake()
  }

  private wake() {
    this.asleep = false
    this.calmSteps = 0
  }

  // Advances by real elapsed seconds using fixed sub-steps.
  advance(dt: number) {
    if (this.asleep && !this.grabState) return
    this.accumulator += Math.min(dt, 0.05)
    while (this.accumulator >= STEP) {
      this.step()
      this.accumulator -= STEP
    }
  }

  private step() {
    const n = this.n
    const g = GRAVITY * STEP * STEP
    for (let i = 1; i < n; i++) {
      const damping = i < this.segments ? STRING_DAMPING : CARD_DAMPING
      let vx = (this.xs[i] - this.pxs[i]) * damping
      let vy = (this.ys[i] - this.pys[i]) * damping
      const speed = Math.hypot(vx, vy)
      if (speed > MAX_STEP_DISTANCE) {
        vx *= MAX_STEP_DISTANCE / speed
        vy *= MAX_STEP_DISTANCE / speed
      }
      this.pxs[i] = this.xs[i]
      this.pys[i] = this.ys[i]
      this.xs[i] += vx
      this.ys[i] += vy + g
    }

    // Smooth the pointer target so release velocity reflects the real motion
    // instead of the pointer-event cadence.
    const grab = this.grabState
    if (grab) {
      grab.current.x += (grab.target.x - grab.current.x) * GRAB_FOLLOW
      grab.current.y += (grab.target.y - grab.current.y) * GRAB_FOLLOW
      // The string can't reach beyond its length plus the grabbed part of the card.
      const reach = (this.stringLength + grab.t * this.cardLength) * 0.97
      const rx = grab.current.x - this.anchor.x
      const ry = grab.current.y - this.anchor.y
      const dist = Math.hypot(rx, ry)
      if (dist > reach) {
        grab.current.x = this.anchor.x + (rx / dist) * reach
        grab.current.y = this.anchor.y + (ry / dist) * reach
      }
    }

    for (let iter = 0; iter < ITERATIONS; iter++) {
      this.xs[0] = this.anchor.x
      this.ys[0] = this.anchor.y
      if (grab) this.applyGrab(grab)
      for (let i = 0; i < n - 1; i++) this.solve(i, i + 1, this.rest[i], i < this.segments)
      for (let i = n - 2; i >= 0; i--) this.solve(i, i + 1, this.rest[i], i < this.segments)
    }
    this.xs[0] = this.anchor.x
    this.ys[0] = this.anchor.y
    this.pxs[0] = this.xs[0]
    this.pys[0] = this.ys[0]

    this.updateSleep()
  }

  private applyGrab(grab: Grab) {
    const c = this.segments
    const t = grab.t
    const px = this.xs[c] + (this.xs[c + 1] - this.xs[c]) * t
    const py = this.ys[c] + (this.ys[c + 1] - this.ys[c]) * t
    const dx = grab.current.x - px
    const dy = grab.current.y - py
    const s = (1 - t) * (1 - t) + t * t
    const a = (1 - t) / s
    const b = t / s
    this.xs[c] += dx * a
    this.ys[c] += dy * a
    this.xs[c + 1] += dx * b
    this.ys[c + 1] += dy * b
  }

  // `ropeOnly` segments resist stretching but not compression, like a string.
  private solve(i: number, j: number, rest: number, ropeOnly: boolean) {
    const dx = this.xs[j] - this.xs[i]
    const dy = this.ys[j] - this.ys[i]
    const dist = Math.hypot(dx, dy) || 1e-9
    if (ropeOnly && dist <= rest) return
    const wSum = this.invMass[i] + this.invMass[j]
    if (wSum === 0) return
    const k = (dist - rest) / (dist * wSum)
    this.xs[i] += dx * k * this.invMass[i]
    this.ys[i] += dy * k * this.invMass[i]
    this.xs[j] -= dx * k * this.invMass[j]
    this.ys[j] -= dy * k * this.invMass[j]
  }

  private updateSleep() {
    if (this.grabState) {
      this.calmSteps = 0
      return
    }
    let maxSpeed = 0
    for (let i = 1; i < this.n; i++) {
      const s = Math.hypot(this.xs[i] - this.pxs[i], this.ys[i] - this.pys[i])
      if (s > maxSpeed) maxSpeed = s
    }
    const offCenter = Math.abs(this.xs[this.n - 1] - this.anchor.x)
    if (maxSpeed < SLEEP_SPEED && offCenter < SLEEP_OFFSET) this.calmSteps++
    else this.calmSteps = 0
    if (this.calmSteps >= SLEEP_STEPS) this.asleep = true
  }
}
