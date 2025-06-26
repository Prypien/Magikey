import { storage, auth } from '@/firebase/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadCompanyLogo(file) {
  if (!auth.currentUser) {
    throw new Error('Nicht angemeldet')
  }
  const path = `company_logos/${auth.currentUser.uid}/${file.name}`
  const imgRef = storageRef(storage, path)
  await uploadBytes(imgRef, file)
  return getDownloadURL(imgRef)
}

export async function uploadBusinessLicense(file) {
  if (!auth.currentUser) {
    throw new Error('Nicht angemeldet')
  }
  const path = `licenses/${auth.currentUser.uid}/${file.name}`
  const licRef = storageRef(storage, path)
  await uploadBytes(licRef, file)
  return getDownloadURL(licRef)
}
