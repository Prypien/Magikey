import { describe, expect, it } from 'vitest'
import { haversineDistance } from './distance'

describe('haversineDistance', () => {
  it('returns zero for identical coordinates', () => {
    expect(haversineDistance(52.5, 13.4, 52.5, 13.4)).toBe(0)
  })

  it('calculates the distance between Berlin and Hamburg with reasonable precision', () => {
    // Known great-circle distance between Berlin and Hamburg is about 255 km.
    const distance = haversineDistance(52.520008, 13.404954, 53.550341, 10.000654)
    expect(distance).toBeGreaterThan(250)
    expect(distance).toBeLessThan(270)
  })

  it('handles coordinate order symmetry', () => {
    const forward = haversineDistance(48.137154, 11.576124, 50.110924, 8.682127)
    const backward = haversineDistance(50.110924, 8.682127, 48.137154, 11.576124)
    expect(forward).toBeCloseTo(backward, 10)
  })

  it('returns NaN when any input is not finite', () => {
    expect(Number.isNaN(haversineDistance(NaN, 0, 0, 0))).toBe(true)
    expect(Number.isNaN(haversineDistance(0, Infinity, 0, 0))).toBe(true)
    expect(Number.isNaN(haversineDistance(0, 0, 'a', 0))).toBe(true)
  })
})
