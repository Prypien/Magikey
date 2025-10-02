import { db, isFirebaseConfigured } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  COMPANY: 'company',
}

const roleCache = new Map()

function normalizeRole(role) {
  if (typeof role !== 'string') return USER_ROLES.USER
  const value = role.trim().toLowerCase()
  if (!value) return USER_ROLES.USER
  if (value === USER_ROLES.ADMIN) return USER_ROLES.ADMIN
  if (value === USER_ROLES.COMPANY) return USER_ROLES.COMPANY
  return USER_ROLES.USER
}

export function setCachedUserRole(uid, role) {
  if (!uid) return
  roleCache.set(uid, normalizeRole(role))
}

export function clearCachedUserRole(uid) {
  if (uid) {
    roleCache.delete(uid)
  } else {
    roleCache.clear()
  }
}

async function fetchRoleByUid(uid) {
  if (!uid || !isFirebaseConfigured || !db) {
    return USER_ROLES.USER
  }

  if (roleCache.has(uid)) {
    return roleCache.get(uid)
  }

  try {
    const snap = await getDoc(doc(db, 'users', uid))
    const data = snap.exists() ? snap.data() : null
    const role = normalizeRole(data?.role)
    roleCache.set(uid, role)
    return role
  } catch (error) {
    console.error('Konnte Nutzerrolle nicht laden:', error)
    return USER_ROLES.USER
  }
}

export async function getUserRole(user) {
  if (!user) return USER_ROLES.USER
  return fetchRoleByUid(user.uid)
}

export async function isAdminUser(user) {
  const role = await getUserRole(user)
  return role === USER_ROLES.ADMIN
}

export async function isAdminByUid(uid) {
  const role = await fetchRoleByUid(uid)
  return role === USER_ROLES.ADMIN
}
