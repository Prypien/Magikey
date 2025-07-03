import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebase'

const functions = getFunctions(app)

export function getPostalFromCoords(lat, lng) {
  const fn = httpsCallable(functions, 'postalCodeFromCoords')
  return fn({ lat, lng }).then(r => r.data)
}
