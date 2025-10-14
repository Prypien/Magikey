import { describe, it, expect, vi, afterEach } from 'vitest'
import { createRequire } from 'module'

process.env.MAGIKEY_USE_FUNCTIONS_STUB = 'true'

const require = createRequire(import.meta.url)

function loadCjsModule(modulePath) {
  const resolved = require.resolve(modulePath)
  delete require.cache[resolved]
  return require(modulePath)
}

describe('adminDeleteUserByEmail function', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requires authentication', async () => {
    const functionsIndex = loadCjsModule('../../functions/index.js')

    await expect(functionsIndex.adminDeleteUserByEmail({}, {})).rejects.toMatchObject({
      code: 'unauthenticated',
    })
  })

  it('rejects non-admin callers', async () => {
    const adminMock = loadCjsModule('../../functions/firebaseAdmin.js')

    const requesterDocGet = vi.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'user' }),
    })

    adminMock.__setFirestoreImpl(() => ({
      collection: (name) => {
        if (name === 'users') {
          return {
            doc: (id) => ({
              get: id === 'requester-1' ? requesterDocGet : vi.fn(),
              delete: vi.fn(),
            }),
          }
        }

        return {
          where: () => ({
            get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
          }),
        }
      },
    }))

    const functionsIndex = loadCjsModule('../../functions/index.js')

    await expect(
      functionsIndex.adminDeleteUserByEmail({ email: 'locked@example.com' }, { auth: { uid: 'requester-1' } }),
    ).rejects.toMatchObject({ code: 'permission-denied' })
  })

  it('deletes user data when invoked by an admin', async () => {
    const adminMock = loadCjsModule('../../functions/firebaseAdmin.js')

    const requesterDocGet = vi.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    })
    const companyDelete = vi.fn().mockResolvedValue()
    const userDocDelete = vi.fn().mockResolvedValue()
    const reviewRequestDelete = vi.fn().mockResolvedValue()
    const reviewDelete = vi.fn().mockResolvedValue()
    const authDelete = vi.fn().mockResolvedValue()
    const getUserByEmail = vi.fn().mockResolvedValue({ uid: 'target-1' })

    adminMock.__setFirestoreImpl(() => ({
      collection: (name) => {
        if (name === 'users') {
          return {
            doc: (id) => ({
              get: id === 'requester-1' ? requesterDocGet : vi.fn(),
              delete: id === 'target-1' ? userDocDelete : vi.fn(),
            }),
          }
        }

        if (name === 'companies') {
          return {
            doc: (id) => ({ delete: id === 'target-1' ? companyDelete : vi.fn() }),
          }
        }

        const docMap = {
          review_requests: [reviewRequestDelete],
          reviews: [reviewDelete],
          registration_email_requests: [],
        }

        return {
          where: () => ({
            get: vi.fn().mockResolvedValue({
              empty: docMap[name].length === 0,
              docs: docMap[name].map((deleteFn) => ({ ref: { delete: deleteFn } })),
            }),
          }),
        }
      },
    }))

    adminMock.__setAuthImpl(() => ({
      deleteUser: authDelete,
      getUserByEmail,
    }))

    const functionsIndex = loadCjsModule('../../functions/index.js')

    const result = await functionsIndex.adminDeleteUserByEmail(
      { email: 'company@example.com' },
      { auth: { uid: 'requester-1' } },
    )

    expect(getUserByEmail).toHaveBeenCalledWith('company@example.com')
    expect(companyDelete).toHaveBeenCalledTimes(1)
    expect(userDocDelete).toHaveBeenCalledTimes(1)
    expect(reviewRequestDelete).toHaveBeenCalledTimes(1)
    expect(reviewDelete).toHaveBeenCalledTimes(1)
    expect(authDelete).toHaveBeenCalledWith('target-1')
    expect(result).toMatchObject({ success: true, deletedDocuments: 4, uid: 'target-1' })
  })

  it('returns not-found for unknown emails', async () => {
    const adminMock = loadCjsModule('../../functions/firebaseAdmin.js')

    const requesterDocGet = vi.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    })

    adminMock.__setFirestoreImpl(() => ({
      collection: (name) => ({
        doc: (id) => ({
          get: id === 'requester-1' ? requesterDocGet : vi.fn(),
          delete: vi.fn(),
        }),
        where: () => ({ get: vi.fn().mockResolvedValue({ empty: true, docs: [] }) }),
      }),
    }))

    const getUserByEmail = vi.fn().mockRejectedValue(
      Object.assign(new Error('auth/user-not-found'), { code: 'auth/user-not-found' }),
    )

    adminMock.__setAuthImpl(() => ({
      deleteUser: vi.fn(),
      getUserByEmail,
    }))

    const functionsIndex = loadCjsModule('../../functions/index.js')

    await expect(
      functionsIndex.adminDeleteUserByEmail(
        { email: 'unknown@example.com' },
        { auth: { uid: 'requester-1' } },
      ),
    ).rejects.toMatchObject({ code: 'not-found' })
  })
})
