import { describe, expect, it } from 'vitest'
import { hasLockType, normaliseLockTypeList } from './lockTypes'

describe('lockTypes utils', () => {
  it('normalises lock type arrays and strings', () => {
    expect(normaliseLockTypeList([' House ', 'car-mechanical', ''])).toEqual([
      'house',
      'car_mechanical',
    ])
    expect(normaliseLockTypeList('House;Car Mechanical')).toEqual([
      'house',
      'car_mechanical',
    ])
    expect(normaliseLockTypeList(null)).toEqual([])
  })

  it('detects lock types regardless of formatting', () => {
    expect(hasLockType([' House '], 'house')).toBe(true)
    expect(hasLockType('car mechanical', 'car_mechanical')).toBe(true)
    expect(hasLockType(undefined, 'house')).toBe(false)
  })
})
