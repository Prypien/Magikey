<template>
  <div class="min-h-screen flex items-stretch bg-gradient-to-br from-white to-yellow-50">
    <div class="hidden md:flex w-1/2 bg-cover bg-center items-center justify-center" style="background-image: url('/logo.png')">
      <div class="text-white text-center p-8 bg-black/70 rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold mb-4">Werde Problemsolver:in</h2>
        <p>Hilf Menschen in Not und präsentiere deinen Service auf Magikey.</p>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center p-6">
      <Transition name="fade" mode="out-in">
        <div v-if="show" class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg max-w-xl w-full p-8 space-y-4">
          <h1 class="text-2xl font-bold mb-4 text-center text-gold">
            🔐 Jetzt registrieren
          </h1>

          <FormKit
            type="form"
            ref="registerForm"
            :actions="false"
            @submit="submitRegistration"
            :config="{ validationVisibility: 'live' }"
            class="space-y-6 divide-y divide-gray-200"
          >
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Kontakt</h3>
            <CompanyImageUpload @selected="file => (logoFile.value = file)" />
            <FormKit type="text" name="company_name" label="Firmenname" validation="required" />
            <FormKit type="text" name="phone" label="Telefonnummer" />
            <FormKit type="email" name="email" label="E-Mail" validation="required|email" />
          </div>

            <div class="space-y-4 pt-4">
              <h3 class="font-semibold text-lg">Standort</h3>
              <GoogleAddressAutocomplete v-model="address.fulltext" @placeChanged="fillAddress" />
              <FormKit type="text" name="street" label="Straße" v-model="address.street" />
              <div class="flex gap-2">
                <FormKit type="text" name="postal_code" label="PLZ" v-model="address.plz" class="flex-1" />
                <FormKit type="text" name="city" label="Ort" v-model="address.city" class="flex-1" />
              </div>
              <GoogleMap
                v-if="address.lat && address.lng"
                :lat="address.lat"
                :lng="address.lng"
                class="mt-2"
              />
            </div>

            <FormKit type="number" name="price" label="Preis (ab)" />

            <OpeningHoursEditor :openingHours="openingHours" @update="updateOpeningHours" />

            <FormKit type="checkbox" name="is_247" label="24/7 Notdienst" v-model="is_247" />
            <FormKit v-if="is_247" type="number" name="emergency_price" label="Notdienstpreis" />

            <div class="space-y-4 pt-4">
              <h3 class="font-semibold text-lg">Account</h3>
              <FormKit type="password" name="password" label="Passwort" validation="required|min:6" />
              <FormKit type="password" name="repeatPassword" label="Passwort wiederholen" validation="required|min:6" />
              <div>
                <label class="font-medium text-sm">Gewerbeschein (optional)</label>
                <input type="file" class="mt-1 text-sm" @change="uploadLicense" />
              </div>
            </div>

            <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

            <FormKit
              type="submit"
              label="Registrieren & Teil von Magikey werden"
              :disabled="loading"
              :classes="{ input: 'btn w-full' }"
            />
            <button type="button" class="btn-outline w-full" @click="googleRegister">Mit Google registrieren</button>
          </FormKit>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import GoogleAddressAutocomplete from '@/components/company/GoogleAddressAutocomplete.vue'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'
import GoogleMap from '@/components/company/GoogleMap.vue'
import { uploadBusinessLicense, uploadCompanyLogo } from '@/services/storage'
import { loginWithGoogle } from '@/services/auth'

import OpeningHoursEditor from '@/components/company/OpeningHoursEditor.vue'

const error = ref('')
const loading = ref(false)
const is_247 = ref(false)
const registerForm = ref(null)
const useGoogle = ref(false)

const show = ref(false)

const logoFile = ref(null)
const licenseFile = ref(null)
const logoUrl = ref('')
const licenseUrl = ref('')

const address = ref({
  fulltext: '',
  street: '',
  plz: '',
  city: '',
  lat: null,
  lng: null,
  placeId: ''
})

const openingHours = ref({
  monday: { open: '', close: '' },
  tuesday: { open: '', close: '' },
  wednesday: { open: '', close: '' },
  thursday: { open: '', close: '' },
  friday: { open: '', close: '' },
  saturday: { open: '', close: '' },
  sunday: { open: '', close: '' }
})

onMounted(() => {
  show.value = true
})

function updateOpeningHours({ day, type, value }) {
  openingHours.value[day][type] = value
}

async function uploadLicense(e) {
  const file = e.target.files[0]
  if (!file) return
  licenseFile.value = file
}

function googleRegister() {
  useGoogle.value = true
  registerForm.value.submit()
}

function fillAddress(data) {
  address.value.fulltext = data.formatted
  address.value.lat = data.lat
  address.value.lng = data.lng
  address.value.placeId = data.placeId
  const comp = data.components || []
  const street = comp.find(c => c.types.includes('route'))?.long_name || ''
  const number = comp.find(c => c.types.includes('street_number'))?.long_name || ''
  address.value.street = [street, number].filter(Boolean).join(' ')
  address.value.plz = comp.find(c => c.types.includes('postal_code'))?.long_name || ''
  address.value.city = comp.find(c => c.types.includes('locality'))?.long_name || ''
}

const submitRegistration = async (formData) => {
  if (formData.password !== formData.repeatPassword) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const cred = useGoogle.value
      ? await loginWithGoogle()
      : await createUserWithEmailAndPassword(auth, formData.email, formData.password)
    const uid = cred.user.uid
    if (useGoogle.value) {
      formData.email = cred.user.email
    }

    if (logoFile.value) {
      logoUrl.value = await uploadCompanyLogo(logoFile.value)
    }
    if (licenseFile.value) {
      licenseUrl.value = await uploadBusinessLicense(licenseFile.value)
    }

  const companyData = { ...formData }
  delete companyData.password
  delete companyData.repeatPassword
  companyData.address = {
    volltext: address.value.fulltext,
    straße: address.value.street,
    plz: address.value.plz,
    ort: address.value.city,
    geo: { lat: address.value.lat, lng: address.value.lng },
    placeId: address.value.placeId,
  }
  companyData.logo_url = logoUrl.value
  companyData.license_url = licenseUrl.value
  delete companyData.street
  delete companyData.postal_code
  delete companyData.city

    await setDoc(doc(db, 'companies', uid), {
      ...companyData,
      opening_hours: openingHours.value,
      created_at: serverTimestamp(),
    })
    window.alert('Danke! Wir prüfen deinen Eintrag und melden uns bei dir.')
    window.location.href = '/dashboard'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
    useGoogle.value = false
  }
}
</script>
