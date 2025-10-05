// Diese Datei hält die aktuellen Filterwerte bereit.
import { reactive } from 'vue'

export const DEFAULT_PRICE_RANGE = Object.freeze([0, 1000])

export const filters = reactive({
  openNow: false,
  price: [...DEFAULT_PRICE_RANGE],
  location: '',
  locationMeta: null,
  lockTypes: []
})

export function clearFilter(key) {
  if (key === 'price') {
    filters.price = [...DEFAULT_PRICE_RANGE]
    return
  }

  if (key === 'location') {
    filters.location = ''
    filters.locationMeta = null
    return
  }

  if (key === 'lockTypes') {
    filters.lockTypes = []
    return
  }

  if (Object.prototype.hasOwnProperty.call(filters, key)) {
    filters[key] = false
  }
}
