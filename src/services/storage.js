import { storage, auth } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadCompanyLogo(file) {
  console.log('Upload startet, User:', auth.currentUser)
  if (!auth.currentUser) {
    throw new Error('Nicht angemeldet')
  }
  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  const path = `company_logos/${auth.currentUser.uid}/${safeName}`
  const imgRef = storageRef(storage, path)
  await uploadBytes(imgRef, file)
  const url = await getDownloadURL(imgRef)
  console.log('Upload abgeschlossen, URL:', url)
  return url
}

