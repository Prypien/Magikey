import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatDuration, formatEta } from './time'

describe('formatDuration', () => {
  it('returns empty string for non-finite values', () => {
    expect(formatDuration(NaN)).toBe('')
    expect(formatDuration(Infinity)).toBe('')
  })

  it('handles durations under one minute', () => {
    expect(formatDuration(0.2)).toBe('unter 1 Minute')
    expect(formatDuration(0.2, { short: true })).toBe('< 1 Min.')
  })

  it('rounds to whole minutes and hours correctly', () => {
    expect(formatDuration(1)).toBe('1 Min.')
    expect(formatDuration(14.6)).toBe('15 Min.')
    expect(formatDuration(89.5)).toBe('1 Std. 30 Min.')
  })

  it('normalises 60 minutes to the next full hour', () => {
    expect(formatDuration(119.6)).toBe('2 Std.')
    expect(formatDuration(180)).toBe('3 Std.')
  })
})

describe('formatEta', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns empty string for invalid timestamp', () => {
    expect(formatEta(undefined)).toBe('')
  })

  it('delegates to Date#toLocaleTimeString with German locale', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('12:34')
    const result = formatEta(1700000000000)
    expect(spy).toHaveBeenCalledWith('de-DE', { hour: '2-digit', minute: '2-digit' })
    expect(result).toBe('12:34')
  })
})
