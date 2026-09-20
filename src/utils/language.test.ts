import { describe, expect, it } from 'vitest'
import { detectLanguage } from './language'

describe('detectLanguage', () => {
  it('detects Vietnamese from vi-VN', () => {
    expect(detectLanguage('vi-VN')).toBe('vi')
  })

  it('detects Vietnamese from a bare vi tag', () => {
    expect(detectLanguage('vi')).toBe('vi')
  })

  it('falls back to English for other locales', () => {
    expect(detectLanguage('en-US')).toBe('en')
    expect(detectLanguage('fr-FR')).toBe('en')
  })

  it('falls back to English when undefined or null', () => {
    expect(detectLanguage(undefined)).toBe('en')
    expect(detectLanguage(null)).toBe('en')
  })
})
