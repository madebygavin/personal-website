// The site's "‹G›" mark: bracket-G-bracket on a graphite gradient tile,
// distinct from the 5 dock app tile hues (src/config/apps.ts). Geometry
// (radius/gap/bracket/stroke/font ratios) matches the approved design
// concept at its three reference sizes (16/32/96px); other sizes are
// linearly interpolated between those anchors so strokes stay legible
// when rendered small (e.g. the menu-bar logo) or large (the boot screen).
interface BrandMarkProps {
  size: number
  className?: string
}

interface BrandMarkMetrics {
  size: number
  radius: number
  gap: number
  bracketWidth: number
  bracketHeight: number
  strokeWidth: number
  fontSize: number
  letterSpacing: number
}

const BREAKPOINTS: BrandMarkMetrics[] = [
  { size: 16, radius: 4, gap: 0.5, bracketWidth: 3.5, bracketHeight: 6, strokeWidth: 4, fontSize: 6, letterSpacing: -0.2 },
  { size: 32, radius: 8, gap: 1.5, bracketWidth: 7, bracketHeight: 12, strokeWidth: 3.2, fontSize: 12, letterSpacing: -0.3 },
  { size: 96, radius: 24, gap: 5, bracketWidth: 18, bracketHeight: 30, strokeWidth: 2.6, fontSize: 32, letterSpacing: -0.5 },
]

type Metric = Exclude<keyof BrandMarkMetrics, 'size'>

function interpolate(size: number, key: Metric): number {
  const first = BREAKPOINTS[0]
  const last = BREAKPOINTS[BREAKPOINTS.length - 1]
  if (size <= first.size) return (first[key] / first.size) * size
  if (size >= last.size) return (last[key] / last.size) * size
  for (let i = 0; i < BREAKPOINTS.length - 1; i++) {
    const a = BREAKPOINTS[i]
    const b = BREAKPOINTS[i + 1]
    if (size >= a.size && size <= b.size) {
      const t = (size - a.size) / (b.size - a.size)
      return a[key] + (b[key] - a[key]) * t
    }
  }
  return BREAKPOINTS[1][key]
}

export function BrandMark({ size, className }: BrandMarkProps) {
  const radius = interpolate(size, 'radius')
  const gap = interpolate(size, 'gap')
  const bracketWidth = interpolate(size, 'bracketWidth')
  const bracketHeight = interpolate(size, 'bracketHeight')
  const strokeWidth = interpolate(size, 'strokeWidth')
  const fontSize = interpolate(size, 'fontSize')
  const letterSpacing = interpolate(size, 'letterSpacing')

  return (
    <div
      aria-hidden="true"
      className={['flex shrink-0 items-center justify-center font-bold text-white shadow-md', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundImage: 'linear-gradient(160deg, #9aa5b1, #414c5a)',
        gap,
      }}
    >
      <svg
        width={bracketWidth}
        height={bracketHeight}
        viewBox="0 0 12 24"
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9.5 3 2.5 12 9.5 21" />
      </svg>
      <span style={{ fontSize, letterSpacing, lineHeight: 1 }}>G</span>
      <svg
        width={bracketWidth}
        height={bracketHeight}
        viewBox="0 0 12 24"
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="2.5 3 9.5 12 2.5 21" />
      </svg>
    </div>
  )
}
