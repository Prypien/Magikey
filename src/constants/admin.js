export const ADMIN_EMAILS = ['jen@preisser.de']

export const ADMIN_EMAIL_DOMAINS = ['magikey.de']

const NORMALIZED_ADMIN_EMAILS = ADMIN_EMAILS.map((email) => email.trim().toLowerCase())
const NORMALIZED_ADMIN_DOMAINS = ADMIN_EMAIL_DOMAINS.map((domain) => domain.trim().toLowerCase())

export function isAdminUser(user) {
  if (!user) return false
  const rawEmail = typeof user.email === 'string' ? user.email : ''
  const normalizedEmail = rawEmail.trim().toLowerCase()
  if (!normalizedEmail) return false

  if (NORMALIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
    return true
  }

  const domain = normalizedEmail.split('@')[1]
  if (!domain) return false
  return NORMALIZED_ADMIN_DOMAINS.includes(domain)
}
