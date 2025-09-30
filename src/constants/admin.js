export const ADMIN_EMAILS = [
  'admin@magikey.de',
]

export function isAdminUser(user) {
  if (!user) return false
  const email = user.email?.toLowerCase?.()
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}
