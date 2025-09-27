// Diese Datei testet die Datenfunktionen für Firmen.
import { describe, it, expect, vi, beforeEach } from 'vitest'

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
  beforeEach(() => {
    vi.clearAllMocks()
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
      data: () => ({ name: 'A' })
    })
    const comp = await getCompany('a')
    expect(firestoreMocks.doc).toHaveBeenCalledWith('db-instance', 'companies', 'a')
    expect(comp).toEqual({ id: 'a', name: 'A' })
  })

  it('returns null when company not found', async () => {
    firestoreMocks.getDoc.mockResolvedValueOnce({ exists: () => false })
    const comp = await getCompany('missing')
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
})
