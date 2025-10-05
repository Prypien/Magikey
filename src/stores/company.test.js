import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest'
import { useCompanyStore } from './company'
import { filters, DEFAULT_PRICE_RANGE } from './filters'

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
    filters.price = [...DEFAULT_PRICE_RANGE]
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

  it('matches companies that use camelCase postalCode fields', () => {
    companies.value = [
      {
        id: 'munich',
        company_name: 'Schlüsseldienst München',
        postalCode: '80331',
        city: 'München',
        price: 70,
        opening_hours: {},
        lock_types: [],
      },
    ]

    filters.location = '80331'

    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['munich'])
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

  it('falls back to default range when price filter is invalid', () => {
    filters.price = ['invalid']
    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['a', 'b', 'c'])
  })
})

describe('filteredCompanies lock type filter', () => {
  const { companies, filteredCompanies } = useCompanyStore()

  beforeEach(() => {
    companies.value = [
      { id: '1', lock_types: [' house '] },
      { id: '2', lock_types: 'car mechanical' },
      { id: '3', lock_types: 'HOUSE, safe' },
    ]

    filters.openNow = false
    filters.price = [...DEFAULT_PRICE_RANGE]
    filters.location = ''
    filters.locationMeta = null
    filters.lockTypes = []
  })

  it('matches companies by lock types ignoring case and formatting', () => {
    filters.lockTypes = ['HOUSE']

    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['1', '3'])
  })
})

describe('filteredCompanies openNow filter', () => {
  const { companies, filteredCompanies } = useCompanyStore()

  beforeEach(() => {
    filters.location = ''
    filters.locationMeta = null
    filters.price = [...DEFAULT_PRICE_RANGE]
    filters.lockTypes = []
    filters.openNow = true

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z'))

    companies.value = [
      {
        id: 'open',
        opening_hours: {
          monday: { open: '08:00', close: '20:00' }
        },
      },
      {
        id: 'closed',
        opening_hours: {
          monday: { open: '21:00', close: '23:00' }
        },
      },
      {
        id: 'unknown-hours',
        opening_hours: {},
      },
    ]
  })

  afterEach(() => {
    filters.openNow = false
    vi.useRealTimers()
  })

  it('only keeps companies that are currently open', () => {
    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['open'])
  })
})

describe('filteredCompanies service radius handling', () => {
  const { companies, filteredCompanies } = useCompanyStore()

  beforeEach(() => {
    filters.openNow = false
    filters.price = [...DEFAULT_PRICE_RANGE]
    filters.lockTypes = []
    filters.location = '10115 Berlin'
    filters.locationMeta = { lat: '52.520008', lng: '13.404954' }

    companies.value = [
      {
        id: 'nearby',
        city: 'Berlin',
        postal_code: '10115',
        coordinates: { lat: 52.52, lng: 13.41 },
        service_radius_km: 15,
        opening_hours: {},
        lock_types: [],
      },
      {
        id: 'outside-radius',
        city: 'Berlin',
        postal_code: '10115',
        coordinates: { lat: 53.551086, lng: 9.993682 },
        service_radius_km: 10,
        opening_hours: {},
        lock_types: [],
      },
      {
        id: 'no-coordinates',
        city: 'Berlin',
        postal_code: '10115',
        opening_hours: {},
        lock_types: [],
      },
    ]
  })

  it('excludes companies outside their service radius even if city matches', () => {
    const resultIds = filteredCompanies.value.map((company) => company.id)
    expect(resultIds).toEqual(['nearby', 'no-coordinates'])
  })
})
