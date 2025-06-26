import { describe, it, expect, vi, beforeEach } from 'vitest'

const firestoreMocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(() => 'collection'),
  doc: vi.fn(() => 'doc')
}))

vi.mock('@/firebase/firebase', () => ({ db: 'db-instance' }))
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
})
