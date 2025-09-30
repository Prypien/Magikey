export const ADMIN_EMAILS = [
  'jen@preisser.de',
]

const NORMALIZED_ADMIN_EMAILS = ADMIN_EMAILS.map((email) => email.trim().toLowerCase())

export function isAdminUser(user) {
  if (!user) return false
  const rawEmail = typeof user.email === 'string' ? user.email : ''
  const normalizedEmail = rawEmail.trim().toLowerCase()
  if (!normalizedEmail) return false
  return NORMALIZED_ADMIN_EMAILS.includes(normalizedEmail)
}
