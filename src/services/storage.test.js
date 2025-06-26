/* global File */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const firebaseMock = vi.hoisted(() => ({ auth: { currentUser: { uid: 'uid123' } }, storage: 'storage-instance' }))
const storageRefMock = vi.hoisted(() => vi.fn(() => 'ref'))
const uploadBytesMock = vi.hoisted(() => vi.fn(() => Promise.resolve()))
const getDownloadURLMock = vi.hoisted(() => vi.fn(() => Promise.resolve('https://download/url')))

vi.mock('@/firebase/firebase', () => firebaseMock)
vi.mock('firebase/storage', () => ({
  ref: storageRefMock,
  uploadBytes: uploadBytesMock,
  getDownloadURL: getDownloadURLMock
}))

import { uploadCompanyLogo, uploadBusinessLicense } from './storage'

describe('storage service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    firebaseMock.auth.currentUser = { uid: 'uid123' }
    globalThis.File = class { constructor(parts, name) { this.parts = parts; this.name = name } }
  })

  it('uploads file and returns download url', async () => {
    const file = new File(['a'], 'logo.png')
    const url = await uploadCompanyLogo(file)
    expect(storageRefMock).toHaveBeenCalledWith('storage-instance', 'company_logos/uid123/logo.png')
    expect(uploadBytesMock).toHaveBeenCalledWith('ref', file)
    expect(url).toBe('https://download/url')
  })

  it('uploads license and returns url', async () => {
    const file = new File(['c'], 'lic.pdf')
    const url = await uploadBusinessLicense(file)
    expect(storageRefMock).toHaveBeenCalledWith('storage-instance', 'licenses/uid123/lic.pdf')
    expect(uploadBytesMock).toHaveBeenCalledWith('ref', file)
    expect(url).toBe('https://download/url')
  })

  it('throws when not authenticated', async () => {
    firebaseMock.auth.currentUser = null
    const file = new File(['b'], 'logo.png')
    await expect(uploadCompanyLogo(file)).rejects.toThrow('Nicht angemeldet')
  })

  it('license upload fails when unauthenticated', async () => {
    firebaseMock.auth.currentUser = null
    const file = new File(['d'], 'lic.pdf')
    await expect(uploadBusinessLicense(file)).rejects.toThrow('Nicht angemeldet')
  })
})
