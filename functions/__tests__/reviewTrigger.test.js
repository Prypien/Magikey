import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRequire } from 'module'

process.env.MAGIKEY_USE_FUNCTIONS_STUB = 'true'

const require = createRequire(import.meta.url)

const loadCjsModule = (modulePath) => {
  const resolved = require.resolve(modulePath)
  delete require.cache[resolved]
  return require(modulePath)
}

describe('onReviewRequestCreated trigger', () => {
  let functionsMock

  beforeEach(() => {
    functionsMock = loadCjsModule('../../functions/firebaseFunctions.js')
    functionsMock.__setConfig({})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('forwards the Firestore payload to the mail sender', async () => {
    const myFunctions = loadCjsModule('../../functions/index.js')
    const sendSpy = vi
      .spyOn(myFunctions, '_sendReviewEmail')
      .mockResolvedValue({ provider: 'mailjet' })

    const payload = {
      company_id: 'comp-1',
      company_name: 'Magikey GmbH',
      contact_type: 'email',
      customer_email: 'kunde@example.com',
    }

    await myFunctions.onReviewRequestCreated(
      { data: () => payload },
      { params: { requestId: 'req-123' } },
    )

    expect(sendSpy).toHaveBeenCalledTimes(1)
    expect(sendSpy).toHaveBeenCalledWith({
      ...payload,
      requestId: 'req-123',
    })
    sendSpy.mockRestore()
  })
})

describe('sendReviewEmail', () => {
  let reviewMailer
  let functionsMock

  beforeEach(() => {
    functionsMock = loadCjsModule('../../functions/firebaseFunctions.js')
    functionsMock.__setConfig({
      mailjet: { api_key: 'key', api_secret: 'secret' },
      reviews: {
        sender_email: 'support@example.com',
        form_url: 'https://example.com/review',
        template_id: '123456',
      },
    })
    reviewMailer = loadCjsModule('../../functions/reviewMailer.js')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds the Mailjet request with template variables', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: vi.fn() })

    const result = await reviewMailer.sendReviewEmail(
      {
        company_id: 'comp-1',
        company_name: 'Magikey GmbH',
        contact_type: 'email',
        customer_email: 'kunde@example.com',
        requestId: 'req-123',
      },
      { fetchImpl: fetchMock },
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.mailjet.com/v3.1/send')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe(`Basic ${Buffer.from('key:secret').toString('base64')}`)
    const body = JSON.parse(options.body)
    expect(body.Messages).toHaveLength(1)
    const message = body.Messages[0]
    expect(message.TemplateID).toBe(123456)
    expect(message.Variables).toMatchObject({
      companyName: 'Magikey GmbH',
      contactType: 'email',
      companyId: 'comp-1',
      requestId: 'req-123',
    })
    expect(message.Variables.reviewLink).toContain('companyId=comp-1')
    expect(message.Variables.reviewLink).toContain('requestId=req-123')
    expect(result).toMatchObject({ provider: 'mailjet', requestId: 'req-123' })
  })
})
