import { describe, it, expect, vi, afterEach } from 'vitest'
import { createRequire } from 'module'

process.env.MAGIKEY_USE_FUNCTIONS_STUB = 'true'

const require = createRequire(import.meta.url)

function loadCjsModule(modulePath) {
  const resolved = require.resolve(modulePath)
  delete require.cache[resolved]
  return require(modulePath)
}

describe('deleteCompanyAccount function', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requires an authenticated user', async () => {
    const functionsIndex = loadCjsModule('../../functions/index.js')

    await expect(functionsIndex.deleteCompanyAccount({}, {})).rejects.toMatchObject({
      code: 'unauthenticated',
    })
  })

  it('deletes company data and the auth user', async () => {
    const adminMock = loadCjsModule('../../functions/firebaseAdmin.js')

    const companyDelete = vi.fn().mockResolvedValue()
    const reviewRequestDelete = vi.fn().mockResolvedValue()
    const reviewDelete = vi.fn().mockResolvedValue()
    const userDocDelete = vi.fn().mockResolvedValue()
    const authDelete = vi.fn().mockResolvedValue()

    adminMock.__setFirestoreImpl(() => ({
      collection: (name) => {
        if (name === 'companies') {
          return {
            doc: () => ({ delete: companyDelete }),
          }
        }

        if (name === 'users') {
          return {
            doc: () => ({ delete: userDocDelete }),
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
              docs: docMap[name].map((deleteFn) => ({
                ref: { delete: deleteFn },
              })),
            }),
          }),
        }
      },
    }))

    adminMock.__setAuthImpl(() => ({
      deleteUser: authDelete,
    }))

    const functionsIndex = loadCjsModule('../../functions/index.js')

    const result = await functionsIndex.deleteCompanyAccount({}, { auth: { uid: 'comp-1' } })

    expect(result).toMatchObject({ success: true, deletedDocuments: 4 })
    expect(companyDelete).toHaveBeenCalledTimes(1)
    expect(userDocDelete).toHaveBeenCalledTimes(1)
    expect(reviewRequestDelete).toHaveBeenCalledTimes(1)
    expect(reviewDelete).toHaveBeenCalledTimes(1)
    expect(authDelete).toHaveBeenCalledWith('comp-1')
  })
})
