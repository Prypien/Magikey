// Diese Datei hält die aktuellen Filterwerte bereit.
import { reactive } from 'vue'

export const filters = reactive({
  openNow: false,
  price: [0, 1000],
  location: '',
  locationMeta: null,
  lockTypes: []
})

export function toggleFilter(key) {
  filters[key] = !filters[key]
}

export function clearFilter(key) {
  if (key === 'price') {
    filters.price = [0, 1000]
  } else if (key === 'location') {
    filters.location = ''
    filters.locationMeta = null
  } else if (key === 'lockTypes') {
    filters.lockTypes = []
  } else {
    filters[key] = false
  }
}
