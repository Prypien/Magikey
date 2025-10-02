import { afterEach, describe, expect, it, vi } from 'vitest'

const getPostalFromCoordsMock = vi.hoisted(() => vi.fn())

vi.mock('@/firebase/functions', () => ({
  getPostalFromCoords: getPostalFromCoordsMock,
}))

const importLocationModule = async () => import('./location')

describe('location service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
    vi.unstubAllGlobals()
    getPostalFromCoordsMock.mockReset()
  })

  it('returns empty search results for blank queries without calling the API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { searchLocations } = await importLocationModule()
    await expect(searchLocations('   ')).resolves.toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requests locations from Nominatim and normalises the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        {
          place_id: '123',
          address: { postcode: '10115', city: 'Berlin' },
          display_name: 'Berlin, Germany',
          lat: '52.5200',
          lon: '13.4050',
        },
      ]),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { searchLocations } = await importLocationModule()
    const results = await searchLocations(' Berlin ', { limit: 3 })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=3&countrycodes=de%2Cat%2Cch&q=Berlin&email=kontakt%40magikey.app',
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: undefined,
      },
    )
    expect(results).toEqual([
      {
        id: '123',
        label: '10115 Berlin',
        postalCode: '10115',
        city: 'Berlin',
        lat: 52.52,
        lng: 13.405,
        source: 'search',
      },
    ])
  })

  it('falls back to the display name when address information is missing', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        {
          place_id: '9',
          address: {},
          display_name: 'Musterstadt, Deutschland',
          lat: '49.0',
          lon: '8.4',
        },
      ]),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { searchLocations } = await importLocationModule()
    const results = await searchLocations('Musterstadt')
    expect(results[0]).toMatchObject({ label: 'Musterstadt' })
  })

  it('reverse geocodes coordinates into postal code and city', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        address: { postcode: '80331', city: 'München' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { reverseGeocode } = await importLocationModule()
    const result = await reverseGeocode(48.137154, 11.576124)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=48.137154&lon=11.576124&addressdetails=1&zoom=18&email=kontakt%40magikey.app',
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: undefined,
      },
    )
    expect(result).toEqual({
      postalCode: '80331',
      city: 'München',
      label: '80331 München',
      lat: 48.137154,
      lng: 11.576124,
      source: 'reverse',
    })
  })

  it('throws when reverse geocoding receives invalid coordinates', async () => {
    const { reverseGeocode } = await importLocationModule()
    await expect(reverseGeocode('nope', 11)).rejects.toThrow('Ungültige Koordinaten')
  })

  it('throws when reverse geocoding fails with a network error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)
    const { reverseGeocode } = await importLocationModule()
    await expect(reverseGeocode(48, 11)).rejects.toThrow('Reverse Geocoding fehlgeschlagen')
  })

  it('detects the current location when geolocation and reverse geocoding succeed', async () => {
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 52.5, longitude: 13.4 } }),
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    getPostalFromCoordsMock.mockResolvedValue({ postalCode: '10115' })

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        address: { postcode: '10115', city: 'Berlin' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const module = await importLocationModule()
    const result = await module.detectCurrentLocation()

    expect(getCurrentPosition).toHaveBeenCalled()
    expect(getPostalFromCoordsMock).toHaveBeenCalledWith(52.5, 13.4)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=52.5&lon=13.4&addressdetails=1&zoom=18&email=kontakt%40magikey.app',
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: undefined,
      },
    )
    expect(result).toEqual({
      postalCode: '10115',
      city: 'Berlin',
      label: '10115 Berlin',
      lat: 52.5,
      lng: 13.4,
      source: 'reverse',
    })
  })

  it('falls back to postal information when reverse geocoding fails', async () => {
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 52.5, longitude: 13.4 } }),
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    getPostalFromCoordsMock.mockResolvedValue({ postalCode: '20095' })

    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)

    const module = await importLocationModule()
    const result = await module.detectCurrentLocation()

    expect(result).toEqual({
      postalCode: '20095',
      city: '',
      label: '20095',
      lat: 52.5,
      lng: 13.4,
      source: 'postal',
    })
  })

  it('propagates reverse geocoding errors when no postal code is available', async () => {
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 52.5, longitude: 13.4 } }),
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    getPostalFromCoordsMock.mockResolvedValue({ postalCode: '' })

    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)

    const module = await importLocationModule()

    await expect(module.detectCurrentLocation()).rejects.toThrow(
      'Reverse Geocoding fehlgeschlagen',
    )
  })

  it('logs a warning when Firebase reverse geocoding fails but continues with Nominatim data', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 52.5, longitude: 13.4 } }),
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    getPostalFromCoordsMock.mockRejectedValue(new Error('down'))

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        address: { postcode: '10115', city: 'Berlin' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const module = await importLocationModule()

    const result = await module.detectCurrentLocation()

    expect(warnSpy).toHaveBeenCalledWith(
      'Firebase Reverse Geocoding fehlgeschlagen:',
      expect.any(Error),
    )
    expect(result.source).toBe('reverse')
    expect(result.label).toBe('10115 Berlin')
  })

  it('throws when geolocation is not supported', async () => {
    vi.stubGlobal('navigator', { })
    const module = await importLocationModule()
    await expect(module.detectCurrentLocation()).rejects.toThrow(
      'Geolocation wird nicht unterstützt',
    )
  })
})
