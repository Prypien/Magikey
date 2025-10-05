import { db, isFirebaseConfigured } from '@/core/firebase'
import { doc, getDoc } from 'firebase/firestore'

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  COMPANY: 'company',
}

const roleCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000

function isCacheEntryValid(entry) {
  if (!entry) return false
  if (!entry.fetchedAt) return true
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS
}

function normalizeRole(role) {
  if (typeof role !== 'string') return USER_ROLES.USER
  const value = role.trim().toLowerCase()
  if (!value) return USER_ROLES.USER
  if (value === USER_ROLES.ADMIN) return USER_ROLES.ADMIN
  if (value === USER_ROLES.COMPANY) return USER_ROLES.COMPANY
  return USER_ROLES.USER
}

export function setCachedUserRole(uid, role, { fetchedAt = Date.now() } = {}) {
  if (!uid) return
  roleCache.set(uid, {
    role: normalizeRole(role),
    fetchedAt,
  })
}

export function clearCachedUserRole(uid) {
  if (uid) {
    roleCache.delete(uid)
  } else {
    roleCache.clear()
  }
}

async function fetchRoleByUid(uid, { forceRefresh = false } = {}) {
  if (!uid || !isFirebaseConfigured || !db) {
    return USER_ROLES.USER
  }

  const cachedEntry = roleCache.get(uid)
  const cacheIsValid = isCacheEntryValid(cachedEntry)

  if (!forceRefresh && cacheIsValid) {
    return cachedEntry.role
  }

  if (cachedEntry && !cacheIsValid) {
    roleCache.delete(uid)
  }

  try {
    const snap = await getDoc(doc(db, 'users', uid))
    const data = snap.exists() ? snap.data() : null
    const role = normalizeRole(data?.role)
    setCachedUserRole(uid, role)
    return role
  } catch (error) {
    console.error('Konnte Nutzerrolle nicht laden:', error)
    if (cachedEntry?.role) {
      return cachedEntry.role
    }
    return USER_ROLES.USER
  }
}

export async function getUserRole(user, options) {
  if (!user) return USER_ROLES.USER
  return fetchRoleByUid(user.uid, options)
}

export async function isAdminUser(user, options) {
  const role = await getUserRole(user, options)
  return role === USER_ROLES.ADMIN
}

export async function isAdminByUid(uid, options) {
  const role = await fetchRoleByUid(uid, options)
  return role === USER_ROLES.ADMIN
}
