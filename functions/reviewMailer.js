const functions = require('./firebaseFunctions')

function buildReviewLink(baseUrl, companyId, requestId) {
  if (!baseUrl) return ''
  try {
    const url = new URL(baseUrl)
    if (companyId) url.searchParams.set('companyId', companyId)
    if (requestId) url.searchParams.set('requestId', requestId)
    return url.toString()
  } catch (err) {
    functions.logger.warn('Invalid review form URL provided', { baseUrl, error: err.message })
    return baseUrl
  }
}

function extractConfig() {
  const runtimeConfig = functions.config ? functions.config() : {}
  return {
    mailjet: runtimeConfig.mailjet || {},
    reviews: runtimeConfig.reviews || {},
  }
}

function resolveFetch(customFetch) {
  if (customFetch) return customFetch
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch API not available in this runtime')
  }
  return fetch
}

async function sendReviewEmail(payload, options = {}) {
  const { fetchImpl } = options

  if (!payload || !payload.customer_email) {
    throw new Error('customer_email missing in payload')
  }

  const config = extractConfig()
  const reviewsConfig = config.reviews
  const mailjetConfig = config.mailjet

  const missingConfig = []
  if (!mailjetConfig.api_key) missingConfig.push('mailjet.api_key')
  if (!mailjetConfig.api_secret) missingConfig.push('mailjet.api_secret')
  if (!reviewsConfig.sender_email) missingConfig.push('reviews.sender_email')

  if (missingConfig.length) {
    const required = missingConfig.join(', ')
    throw new Error(
      `Missing Mailjet/Firebase config: ${required}. ` +
        'Run "firebase functions:config:set" with the values described in docs/functions-config.md.'
    )
  }

  const requestId = payload.requestId || ''
  const reviewLink = buildReviewLink(reviewsConfig.form_url, payload.company_id, requestId)

  const senderName = reviewsConfig.sender_name || payload.company_name || 'Magikey'
  const subject = reviewsConfig.subject || `Bitte bewerten Sie ${payload.company_name || 'uns'}`
  const linkText = reviewLink || reviewsConfig.form_url || ''

  const message = {
    From: {
      Email: reviewsConfig.sender_email,
      Name: senderName,
    },
    To: [
      {
        Email: payload.customer_email,
        Name: payload.customer_name || '',
      },
    ],
    Subject: subject,
    TextPart: `Hallo,\n\nwir würden uns über Ihr Feedback freuen. Bitte nutzen Sie folgenden Link:\n${linkText}\n\nVielen Dank!`,
    HTMLPart: `<!doctype html><html><body><p>Hallo,</p><p>wir würden uns über Ihr Feedback freuen.</p><p><a href="${linkText}">Bewertung abgeben</a></p></body></html>`,
    CustomID: requestId,
  }

  if (reviewsConfig.reply_to_email) {
    message.ReplyTo = {
      Email: reviewsConfig.reply_to_email,
      Name: reviewsConfig.reply_to_name || senderName,
    }
  }

  if (reviewsConfig.template_id) {
    const templateId = Number(reviewsConfig.template_id)
    if (!Number.isFinite(templateId)) {
      throw new Error('reviews.template_id must be numeric for Mailjet templates')
    }
    message.TemplateID = templateId
    message.TemplateLanguage = true
    message.Variables = {
      companyName: payload.company_name || '',
      contactType: payload.contact_type || '',
      reviewLink,
      companyId: payload.company_id || '',
      requestId,
    }
    delete message.Subject
    delete message.TextPart
    delete message.HTMLPart
  }

  const auth = Buffer.from(`${mailjetConfig.api_key}:${mailjetConfig.api_secret}`).toString('base64')
  const body = JSON.stringify({ Messages: [message] })
  const fetchFn = resolveFetch(fetchImpl)
  const response = await fetchFn('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Mailjet request failed with status ${response.status}: ${errorText}`)
  }

  functions.logger.info('Review request email dispatched', {
    to: payload.customer_email,
    requestId,
    provider: 'mailjet',
  })
  return {
    provider: 'mailjet',
    requestId,
    reviewLink,
  }
}

module.exports = {
  buildReviewLink,
  sendReviewEmail,
}
