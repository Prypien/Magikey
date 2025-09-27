import { describe, it, expect } from 'vitest'
import { evaluatePasswordStrength } from './passwordStrength'

describe('evaluatePasswordStrength', () => {
  it('returns weak rating for very simple passwords', () => {
    const result = evaluatePasswordStrength('abc')
    expect(result).toMatchObject({
      score: 1,
      percent: 20,
      label: 'Schwach',
      textClass: 'text-red-500',
      barClass: 'bg-red-500',
    })
  })

  it('returns medium rating for mixed alphanumeric passwords', () => {
    const result = evaluatePasswordStrength('abc123')
    expect(result).toMatchObject({
      score: 3,
      percent: 60,
      label: 'Mittel',
      textClass: 'text-yellow-500',
      barClass: 'bg-yellow-500',
    })
  })

  it('returns strong rating for complex passwords', () => {
    const result = evaluatePasswordStrength('Abc123!')
    expect(result).toMatchObject({
      score: 5,
      percent: 100,
      label: 'Stark',
      textClass: 'text-green-500',
      barClass: 'bg-green-500',
    })
  })
})
