/* global File */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const firebaseMock = vi.hoisted(() => ({
  auth: { currentUser: { uid: 'uid123' } },
  storage: 'storage-instance',
  isFirebaseConfigured: true,
}))
const storageRefMock = vi.hoisted(() => vi.fn(() => 'ref'))
const uploadBytesMock = vi.hoisted(() => vi.fn(() => Promise.resolve()))
const getDownloadURLMock = vi.hoisted(() => vi.fn(() => Promise.resolve('https://download/url')))

vi.mock('@/firebase', () => firebaseMock)
vi.mock('firebase/storage', () => ({
  ref: storageRefMock,
  uploadBytes: uploadBytesMock,
  getDownloadURL: getDownloadURLMock
}))

import { uploadCompanyLogo } from './storage'

describe('storage service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    firebaseMock.auth.currentUser = { uid: 'uid123' }
    globalThis.File = class { constructor(parts, name) { this.parts = parts; this.name = name } }
    vi.spyOn(Date, 'now').mockReturnValue(1234567890)
  })

  it('uploads file and returns download url', async () => {
    const file = new File(['a'], 'my logo.png')
    const url = await uploadCompanyLogo(file)
    expect(storageRefMock).toHaveBeenCalledWith('storage-instance', 'company_logos/uid123/1234567890_my_logo.png')
    expect(uploadBytesMock).toHaveBeenCalledWith('ref', file)
    expect(url).toBe('https://download/url')
  })


  it('throws when not authenticated', async () => {
    firebaseMock.auth.currentUser = null
    const file = new File(['b'], 'logo.png')
    await expect(uploadCompanyLogo(file)).rejects.toThrow('Nicht angemeldet')
  })

})
