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
