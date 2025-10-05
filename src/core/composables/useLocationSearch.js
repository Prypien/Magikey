/* global setTimeout, clearTimeout, AbortController */
// Gemeinsamer Hook für die Standortsuche in Desktop- und Mobilansicht.
import { ref, watch } from 'vue'
import { filters } from '@/core/stores/filters'
import { searchLocations, detectCurrentLocation } from '@/core/services/location'

export function useLocationSearch() {
  const query = ref(filters.location)
  const suggestions = ref([])
  const loadingSuggestions = ref(false)
  const suggestionsError = ref('')
  const geolocationPending = ref(false)

  let abortController = null
  let debounceTimeout = null

  watch(
    () => filters.location,
    (value) => {
      const next = value || ''
      if (next !== query.value) {
        query.value = next
      }
    }
  )

  watch(query, (value) => {
    const normalized = value?.toString() ?? ''
    if (filters.location !== normalized) {
      filters.location = normalized
    }
    if (filters.locationMeta && filters.locationMeta.label !== normalized) {
      filters.locationMeta = null
    }

    if (debounceTimeout) clearTimeout(debounceTimeout)

    const trimmed = normalized.trim()
    if (!trimmed || trimmed.length < 2) {
      if (abortController) {
        abortController.abort()
        abortController = null
      }
      suggestions.value = []
      suggestionsError.value = ''
      return
    }

    debounceTimeout = setTimeout(() => fetchSuggestions(trimmed), 250)
  })

  async function fetchSuggestions(term) {
    if (abortController) {
      abortController.abort()
    }

    abortController = typeof AbortController !== 'undefined' ? new AbortController() : null

    loadingSuggestions.value = true
    suggestionsError.value = ''

    try {
      const results = await searchLocations(term, { signal: abortController?.signal })
      suggestions.value = results
      if (!results.length) {
        suggestionsError.value = 'Keine passenden Orte gefunden'
      }
    } catch (error) {
      if (error?.name === 'AbortError') return
      console.error('Ortssuche fehlgeschlagen:', error)
      suggestions.value = []
      suggestionsError.value = 'Ortssuche aktuell nicht verfügbar'
    } finally {
      loadingSuggestions.value = false
    }
  }

  function applyLocation(location) {
    if (!location) return
    const label = location.label || ''
    query.value = label
    filters.location = label
    filters.locationMeta = {
      label,
      postalCode: location.postalCode || '',
      city: location.city || '',
      lat: location.lat ?? null,
      lng: location.lng ?? null,
      source: location.source || 'manual'
    }
    suggestions.value = []
    suggestionsError.value = ''
  }

  async function useCurrentLocation() {
    if (geolocationPending.value) return null

    geolocationPending.value = true
    suggestionsError.value = ''

    try {
      const location = await detectCurrentLocation({ enableHighAccuracy: true, timeout: 12000 })
      if (location?.label) {
        applyLocation(location)
      }
      return location
    } catch (error) {
      console.error('Standort konnte nicht ermittelt werden:', error)
      suggestionsError.value = 'Standort konnte nicht ermittelt werden'
      return null
    } finally {
      geolocationPending.value = false
    }
  }

  function clearSuggestions() {
    suggestions.value = []
    suggestionsError.value = ''
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  return {
    query,
    suggestions,
    loadingSuggestions,
    suggestionsError,
    geolocationPending,
    applyLocation,
    useCurrentLocation,
    clearSuggestions
  }
}
