import { reactive } from 'vue'

export const filters = reactive({
  openNow: false,
  price: [0, 1000],
  location: ''
})

export function toggleFilter(key) {
  filters[key] = !filters[key]
}

export function clearFilter(key) {
  if (key === 'price') {
    filters.price = [0, 1000]
  } else if (key === 'location') {
    filters.location = ''
  } else {
    filters[key] = false
  }
}
