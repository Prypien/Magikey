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

