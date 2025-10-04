// Diese Datei testet die Datenfunktionen für Firmen.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const firestoreMocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(() => 'collection'),
  doc: vi.fn(() => 'doc'),
  query: vi.fn(() => 'query'),
  where: vi.fn(() => 'where')
}))

vi.mock('@/firebase', () => ({ db: 'db-instance', isFirebaseConfigured: true }))
vi.mock('firebase/firestore', () => firestoreMocks)

import { getCompanies, getCompany } from './company'

describe('company service', () => {
  let consoleErrorMock
  let consoleWarnMock

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorMock.mockRestore()
    consoleWarnMock.mockRestore()
  })

  it('fetches all companies', async () => {
    firestoreMocks.getDocs.mockResolvedValueOnce({
      docs: [{ id: 'a', data: () => ({ name: 'A' }) }]
    })
    const comps = await getCompanies()
    expect(firestoreMocks.collection).toHaveBeenCalledWith('db-instance', 'companies')
    expect(firestoreMocks.where).toHaveBeenCalledWith('verified', '==', true)
    expect(firestoreMocks.query).toHaveBeenCalledWith('collection', 'where')
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith('query')
    expect(comps).toEqual([{ id: 'a', name: 'A' }])
  })

  it('fetches one company', async () => {
    firestoreMocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: 'a',
      data: () => ({ name: 'A', verified: true, verification: { status: 'verified' } })
    })
    const comp = await getCompany('a')
    expect(firestoreMocks.doc).toHaveBeenCalledWith('db-instance', 'companies', 'a')
    expect(comp).toEqual({ id: 'a', name: 'A', verified: true, verification: { status: 'verified' } })
  })

  it('returns null when company not found', async () => {
    firestoreMocks.getDoc.mockResolvedValueOnce({ exists: () => false })
    const comp = await getCompany('missing')
    expect(comp).toBeNull()
  })

  it('returns null when company is not verified', async () => {
    firestoreMocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: 'b',
      data: () => ({ name: 'B', verified: false, verification: { status: 'pending' } })
    })

    const comp = await getCompany('b')

    expect(comp).toBeNull()
  })

  it('returns null when verification status is not verified', async () => {
    firestoreMocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: 'c',
      data: () => ({ name: 'C', verified: true, verification: { status: 'pending' } })
    })

    const comp = await getCompany('c')

    expect(comp).toBeNull()
  })

  it('returns empty array on fetch error', async () => {
    firestoreMocks.getDocs.mockRejectedValueOnce(new Error('fail'))
    const comps = await getCompanies()
    expect(comps).toHaveLength(2)
    expect(comps[0].id).toBe('demo-berlin')
  })

  it('returns null on fetch error for single company', async () => {
    firestoreMocks.getDoc.mockRejectedValueOnce(new Error('fail'))
    const comp = await getCompany('a')
    expect(comp).toBeNull()
  })

  it('returns independent fallback copies when Firestore has no verified companies', async () => {
    firestoreMocks.getDocs.mockResolvedValueOnce({ docs: [] })
    const first = await getCompanies()
    first[0].company_name = 'Verändert'

    firestoreMocks.getDocs.mockResolvedValueOnce({ docs: [] })
    const second = await getCompanies()

    expect(second[0].company_name).toBe('Schlüsselservice Berlin Mitte')
  })

  it('does not leak fallback mutations across getCompany error calls', async () => {
    firestoreMocks.getDoc.mockRejectedValueOnce(new Error('fail'))
    const first = await getCompany('demo-berlin')
    expect(first).not.toBeNull()
    first.company_name = 'Manipuliert'

    firestoreMocks.getDoc.mockRejectedValueOnce(new Error('fail'))
    const second = await getCompany('demo-berlin')

    expect(second.company_name).toBe('Schlüsselservice Berlin Mitte')
  })
})
