// Diese Datei lädt Logos in den Firebase-Speicher hoch.
import { storage, auth } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// Speichert das Logo einer Firma im Cloud-Speicher und liefert die URL zurück.
export async function uploadCompanyLogo(file) {
  if (!auth.currentUser) {
    // Für das Hochladen muss der Nutzer eingeloggt sein.
    throw new Error('Nicht angemeldet')
  }
  // Ein Dateiname mit Zeitstempel verhindert Überschreiben und entfernt
  // problematische Zeichen aus dem ursprünglichen Namen.
  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  // Der Speicherpfad verwendet die Nutzer-ID, damit jeder Benutzer einen
  // eigenen Ordner erhält.
  const path = `company_logos/${auth.currentUser.uid}/${safeName}`
  // Referenz auf den Speicherort im Firebase Storage.
  const imgRef = storageRef(storage, path)
  // Datei hochladen.
  await uploadBytes(imgRef, file)
  // Öffentliche URL abrufen, um das Logo später anzeigen zu können.
  const url = await getDownloadURL(imgRef)
  return url
}

