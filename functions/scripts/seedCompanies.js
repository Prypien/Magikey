#!/usr/bin/env node
/*
 * Seedet Beispielunternehmen in den Firestore-Emulator.
 *
 * Nutzung:
 *   cd functions
 *   npm install
 *   firebase emulators:start --only firestore
 *   FIRESTORE_EMULATOR_HOST=localhost:8080 npm run seed:companies
 */
const fs = require('fs/promises')
const path = require('path')
const admin = require('firebase-admin')

async function main() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.error('⚠️  FIRESTORE_EMULATOR_HOST ist nicht gesetzt. Bitte den Firestore-Emulator starten.')
    process.exit(1)
  }

  const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || 'magikey-emulator'

  if (!admin.apps.length) {
    admin.initializeApp({ projectId })
  }

  const db = admin.firestore()
  const seedFile = path.resolve(__dirname, '../sample-data/companies.json')
  const raw = await fs.readFile(seedFile, 'utf8')
  const companies = JSON.parse(raw)

  const revivedCompanies = companies.map((company) => revive(company))

  const batch = db.batch()
  for (const entry of revivedCompanies) {
    const { id, ...data } = entry
    if (!id) {
      console.warn('⏭️  Überspringe Eintrag ohne ID', entry)
      continue
    }
    batch.set(db.collection('companies').doc(id), data, { merge: true })
  }

  await batch.commit()
  console.log(`✅ ${revivedCompanies.length} Unternehmen wurden in den Emulator geschrieben.`)
}

function revive(value) {
  if (Array.isArray(value)) {
    return value.map((item) => revive(item))
  }
  if (value && typeof value === 'object') {
    if (
      Object.prototype.hasOwnProperty.call(value, '_seconds') &&
      Object.prototype.hasOwnProperty.call(value, '_nanoseconds')
    ) {
      return new admin.firestore.Timestamp(value._seconds, value._nanoseconds)
    }
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, revive(val)]))
  }
  return value
}

main().catch((err) => {
  console.error('❌ Fehler beim Seeding:', err)
  process.exit(1)
})
