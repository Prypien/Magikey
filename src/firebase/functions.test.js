import { afterEach, describe, expect, it, vi } from 'vitest'

const importFunctionsModule = async () => {
  const module = await import('@/firebase/functions.js')
  return module
}

describe('getPostalFromCoords', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('throws for invalid coordinates', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', 'https://example.com/postalCodeFromCoords')
    const { getPostalFromCoords } = await importFunctionsModule()
    await expect(getPostalFromCoords(NaN, 13.4)).rejects.toThrow('Invalid coordinates')
  })

  it('throws when no function endpoint is configured', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', '')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '')
    const { getPostalFromCoords } = await importFunctionsModule()
    await expect(getPostalFromCoords(52.5, 13.4)).rejects.toThrow('Cloud Function postalCodeFromCoords ist nicht konfiguriert.')
  })

  it('propagates HTTP error details', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', 'https://example.com/postalCodeFromCoords')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('kaputt'),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { getPostalFromCoords } = await importFunctionsModule()
    await expect(getPostalFromCoords(52.5, 13.4)).rejects.toThrow(
      'Cloud Function postalCodeFromCoords antwortete mit Status 500 – kaputt',
    )
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/postalCodeFromCoords', expect.any(Object))
  })

  it('returns parsed JSON on success', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', 'https://example.com/postalCodeFromCoords')
    const responseJson = { postalCode: '10115' }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(responseJson),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { getPostalFromCoords } = await importFunctionsModule()
    await expect(getPostalFromCoords(52.5, 13.4)).resolves.toEqual(responseJson)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/postalCodeFromCoords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 52.5, lng: 13.4 }),
    })
  })
})

describe('resolveFunctionUrl', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('prefers the custom function URL when provided', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', ' https://custom.url/function ')
    const {
      __test__: { resolveFunctionUrl },
    } = await importFunctionsModule()
    expect(resolveFunctionUrl()).toBe('https://custom.url/function')
  })

  it('constructs the default URL from the project ID', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', '')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'magikey-demo')
    const {
      __test__: { resolveFunctionUrl },
    } = await importFunctionsModule()
    expect(resolveFunctionUrl()).toBe(
      'https://us-central1-magikey-demo.cloudfunctions.net/postalCodeFromCoords',
    )
  })

  it('returns null when nothing is configured', async () => {
    vi.stubEnv('VITE_FUNCTION_URL', '')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '')
    const {
      __test__: { resolveFunctionUrl },
    } = await importFunctionsModule()
    expect(resolveFunctionUrl()).toBeNull()
  })
})
