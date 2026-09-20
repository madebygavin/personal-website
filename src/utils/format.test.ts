import { describe, expect, it } from 'vitest'
import { formatClock, formatDate } from './format'

describe('formatClock', () => {
  it('formats English time in 12-hour form', () => {
    const date = new Date('2026-01-15T09:05:00')
    expect(formatClock(date, 'en')).toMatch(/^09:05\s?AM$/i)
  })

  it('formats Vietnamese time in 24-hour form', () => {
    const date = new Date('2026-01-15T21:05:00')
    expect(formatClock(date, 'vi')).toContain('21:05')
  })
})

describe('formatDate', () => {
  it('formats English dates with a short weekday and month', () => {
    const date = new Date('2026-01-15T09:00:00')
    const result = formatDate(date, 'en')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })

  it('formats Vietnamese dates using the vi-VN locale', () => {
    const date = new Date('2026-01-15T09:00:00')
    expect(formatDate(date, 'vi')).toContain('15')
  })
})
