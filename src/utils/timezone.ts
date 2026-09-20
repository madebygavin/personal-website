// Converts an IANA time zone (e.g. "Asia/Ho_Chi_Minh") into a human-readable
// city name (e.g. "Ho Chi Minh"). See PROJECT_BRIEF.md section 3, gap #9.
export function cityFromTimeZone(timeZone: string): string | null {
  const segment = timeZone.split('/').pop()
  if (!segment) return null
  return segment.replace(/_/g, ' ')
}

export function getVisitorCity(): string | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return cityFromTimeZone(timeZone)
  } catch {
    return null
  }
}
