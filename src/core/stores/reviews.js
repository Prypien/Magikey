import { ref } from 'vue'
import { getCompanyReviews } from '@/core/services/review'

const reviews = ref([])
const loading = ref(false)
const lastCompanyId = ref(null)
const error = ref(null)

export async function fetchCompanyReviews(companyId, { force = false } = {}) {
  if (!companyId) {
    reviews.value = []
    lastCompanyId.value = null
    return
  }

  if (!force && lastCompanyId.value === companyId && reviews.value.length) {
    return
  }

  loading.value = true
  error.value = null

  try {
    reviews.value = await getCompanyReviews(companyId)
    lastCompanyId.value = companyId
  } catch (err) {
    console.error('Fehler beim Abrufen der Magikey-Bewertungen:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

export function useReviewStore() {
  return {
    reviews,
    loading,
    error,
    fetchCompanyReviews,
  }
}
