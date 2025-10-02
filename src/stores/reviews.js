import { ref } from 'vue'
import { getCompanyReviews } from '@/services/review'

const reviewsState = ref({})
const loadingState = ref({})
const errorState = ref({})

function setLoading(companyId, value) {
  loadingState.value = { ...loadingState.value, [companyId]: value }
}

function setReviews(companyId, reviews) {
  reviewsState.value = { ...reviewsState.value, [companyId]: reviews }
}

function setError(companyId, error) {
  errorState.value = { ...errorState.value, [companyId]: error }
}

export function useReviewStore() {
  async function fetchCompanyReviews(companyId) {
    if (!companyId) return []
    if (loadingState.value[companyId]) return reviewsState.value[companyId] || []

    setLoading(companyId, true)
    setError(companyId, null)

    try {
      const reviews = await getCompanyReviews(companyId)
      setReviews(companyId, reviews)
      return reviews
    } catch (err) {
      console.error('Fehler beim Laden der Bewertungen:', err)
      setError(companyId, err)
      setReviews(companyId, [])
      return []
    } finally {
      setLoading(companyId, false)
    }
  }

  function getReviewsForCompany(companyId) {
    return reviewsState.value[companyId] || []
  }

  function isLoading(companyId) {
    return Boolean(loadingState.value[companyId])
  }

  function getError(companyId) {
    return errorState.value[companyId] || null
  }

  return {
    reviewsState,
    loadingState,
    errorState,
    fetchCompanyReviews,
    getReviewsForCompany,
    isLoading,
    getError,
  }
}
