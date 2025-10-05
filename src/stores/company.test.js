import { describe, beforeEach, it, expect } from 'vitest'
import { useCompanyStore } from './company'
import { filters } from './filters'

describe('filteredCompanies location filter', () => {
  const { companies, filteredCompanies } = useCompanyStore()

  beforeEach(() => {
    companies.value = [
      {
        id: 'berlin',
        company_name: 'Schlüsselservice Berlin',
        postal_code: '10115',
        city: 'Berlin',
        price: 80,
        opening_hours: {},
        lock_types: [],
      },
      {
        id: 'hamburg',
        company_name: 'Notdienst Hamburg',
        postal_code: '20095',
        city: 'Hamburg',
        price: 90,
        opening_hours: {},
        lock_types: [],
      },
    ]

    filters.openNow = false
    filters.price = [0, 1000]
    filters.lockTypes = []
    filters.location = ''
    filters.locationMeta = null
  })

  it('matches combined postal code and city labels', () => {
    filters.location = '10115 Berlin'

    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['berlin'])
  })

  it('matches by city when label contains both postal code and city', () => {
    filters.location = 'Hamburg'

    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['hamburg'])
  })

  it('matches by postal code only', () => {
    filters.location = '20095'

    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['hamburg'])
  })
})

describe('filteredCompanies price filter', () => {
  const { companies, filteredCompanies } = useCompanyStore()

  beforeEach(() => {
    companies.value = [
      { id: 'a', price: '59,90', opening_hours: {}, lock_types: [] },
      { id: 'b', price: '149.50', opening_hours: {}, lock_types: [] },
      { id: 'c', price: '', opening_hours: {}, lock_types: [] },
    ]

    filters.openNow = false
    filters.location = ''
    filters.locationMeta = null
    filters.lockTypes = []
  })

  it('includes companies whose decimal price is within the range', () => {
    filters.price = [0, 100]
    expect(filteredCompanies.value.map((company) => company.id)).toEqual(['a', 'c'])
  })

  it('excludes companies outside the price range', () => {
    filters.price = [100, 200]
    expect(filteredCompanies.value.map((company) => company.id)).toEqual(['b'])
  })

  it('hides companies without price when minimum is above zero', () => {
    filters.price = [10, 80]
    const ids = filteredCompanies.value.map((company) => company.id)
    expect(ids).not.toContain('c')
  })
})
