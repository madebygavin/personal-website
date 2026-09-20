import { describe, expect, it } from 'vitest'
import { cityFromTimeZone } from './timezone'

describe('cityFromTimeZone', () => {
  it('extracts the city segment from a simple time zone', () => {
    expect(cityFromTimeZone('Asia/Ho_Chi_Minh')).toBe('Ho Chi Minh')
  })

  it('replaces all underscores with spaces', () => {
    expect(cityFromTimeZone('America/Los_Angeles')).toBe('Los Angeles')
  })

  it('uses the last segment for multi-part zones', () => {
    expect(cityFromTimeZone('America/Argentina/Buenos_Aires')).toBe('Buenos Aires')
  })

  it('returns null for an empty string', () => {
    expect(cityFromTimeZone('')).toBeNull()
  })
})
