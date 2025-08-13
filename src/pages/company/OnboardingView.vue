<template>
  <div class="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-3xl font-semibold mb-8 text-center text-black">
      <p class="text-center text-gold font-medium mb-4">
        <i class="fa fa-key mr-2 animate-bounce"></i> Werde Problemsolver:in
      </p>
      Unternehmens-Onboarding
    </h1>

    <!-- Schritt 1: Firmendaten -->
    <div v-if="step === 1">
      <button
        @click="registerWithGoogle"
        class="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold mb-2"
        aria-label="Mit Google registrieren"
      >
        <svg class="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M533.5 278.4c0-17.7-1.4-35-4-51.8H272v98h147.5c-6.4 34.4-25.7 63.5-54.8 83.1v68h88.5c51.6-47.5 80.8-117.5 80.8-197.3z" />
          <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88.5-68c-24.7 16.6-56.5 26-92.3 26-70.9 0-131-47.9-152.5-112.5H28.9v70.9C73.6 473 167.6 544.3 272 544.3z" />
          <path fill="#FBBC05" d="M119.5 323.3c-11.4-34-11.4-70.6 0-104.5V148H28.9c-47.6 95.6-47.6 208.5 0 304.1l90.6-70.8z" />
          <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.8 104.1 40.8l78.2-78.2C407.5 23.8 344.7 0 272 0 167.6 0 73.6 71.3 28.9 176l90.6 70.8C141 155.6 201.1 107.7 272 107.7z" />
        </svg>
        <span class="text-gray-700 font-medium">Mit Google registrieren</span>
      </button>
      <p v-if="googleError" class="text-red-600 text-sm text-center mt-2">{{ googleError }}</p>
      <div v-if="googleLoading" class="flex justify-center mt-2">
        <Loader :size="40" />
      </div>
      <div class="text-center text-gray-400 mb-6">oder mit E-Mail registrieren</div>

      <FormKit
        type="form"
        :actions="false"
        @submit="handleStep1"
        :config="{ validationVisibility: 'blur' }"
        class="space-y-6"
      >
        <FormKit
          type="text"
          name="company_name"
          label="Firmenname"
          validation="required"
          placeholder="z. B. Schlüsseldienst Müller"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="email"
          name="email"
          label="E-Mail"
          validation="required|email"
          placeholder="beispiel@firma.de"
          :disabled="googleUser"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          v-if="!googleUser"
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          placeholder="Mind. 6 Zeichen"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          v-if="!googleUser"
          type="password"
          name="confirm_password"
          label="Passwort wiederholen"
          validation="required|confirm:password"
          placeholder="Nochmals eingeben"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="tel"
          name="phone"
          label="Telefonnummer"
          validation="required"
          placeholder="z. B. 0151 12345678"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="address"
          label="Straße und Hausnummer"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="city"
          label="Ort"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="postal_code"
          label="Postleitzahl"
          :classes="{ label: 'label', input: 'input' }"
        />

        <div class="flex justify-end">
          <Button>Weiter</Button>
        </div>
      </FormKit>
    </div>

    <!-- Schritt 2: Öffnungszeiten -->
    <div v-else-if="step === 2" class="space-y-6">
      <OpeningHoursForm v-model="form.opening_hours" />
      <div class="flex justify-between mt-6">
        <Button type="button" class="btn-outline" @click="step--">Zurück</Button>
        <Button type="button" @click="step++">Weiter</Button>
      </div>
    </div>

    <!-- Schritt 3: Schlosstypen -->
    <div v-else-if="step === 3">
      <FormKit
        type="form"
        :actions="false"
        @submit="handleStep3"
        class="space-y-6"
      >
        <div>
          <label class="label">Schlosstypen</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="opt in lockTypeOptions"
              :key="opt.value"
              class="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                :value="opt.value"
                v-model="form.lock_types"
                class="accent-gold"
              />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div class="flex justify-between">
          <Button type="button" class="btn-outline" @click="step--">Zurück</Button>
          <Button>Weiter</Button>
        </div>
      </FormKit>
    </div>

    <!-- Schritt 4: Services -->
    <div v-else-if="step === 4">
      <FormKit
        type="form"
        :actions="false"
        @submit="handleStep4"
        class="space-y-6"
      >
        <FormKit
          type="number"
          name="price"
          label="Preis (ab)"
          min="0"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="textarea"
          name="description"
          label="Beschreibung"
          :classes="{ label: 'label', input: 'textarea' }"
        />

        <FormKit
          type="checkbox"
          name="is_247"
          label="24/7 Notdienst"
          v-model="form.is_247"
          :classes="{ label: 'label' }"
        />

        <FormKit
          v-if="form.is_247"
          type="number"
          name="emergency_price"
          label="Notdienstpreis"
          validation="required"
          min="0"
          :classes="{ label: 'label', input: 'input' }"
        />

        <div class="flex justify-between">
          <Button type="button" class="btn-outline" @click="step--">Zurück</Button>
          <Button>Weiter</Button>
        </div>
      </FormKit>
    </div>

    <!-- Schritt 5: Vorschau & Bestätigung -->
    <div v-else-if="step === 5" class="space-y-4">
      <h2 class="text-xl font-semibold mb-4">Vorschau</h2>
      <div class="text-sm space-y-1">
        <p><strong>Firma:</strong> {{ form.company_name }}</p>
        <p><strong>E-Mail:</strong> {{ form.email }}</p>
        <p><strong>Telefon:</strong> {{ form.phone }}</p>
        <p><strong>Adresse:</strong> {{ form.address }}, {{ form.postal_code }} {{ form.city }}</p>
        <p><strong>Preis:</strong> {{ form.price }}</p>
        <p><strong>Beschreibung:</strong> {{ form.description }}</p>
        <p>
          <strong>24/7:</strong>
          {{ form.is_247 ? 'Ja (Preis: ' + form.emergency_price + ')' : 'Nein' }}
        </p>
        <p>
          <strong>Schlosstypen:</strong>
          {{ form.lock_types.join(', ') || '-' }}
        </p>
      </div>
      <div class="flex justify-between mt-6">
        <Button type="button" class="btn-outline" @click="step--">Zurück</Button>
        <Button type="button" @click="register">Bestätigen</Button>
      </div>
    </div>

    <!-- Schritt 6: Bild & Verifizierung -->
    <div v-else-if="step === 6" class="space-y-6">
      <h2 class="text-xl font-semibold mb-4">Profilbild & Verifizierung</h2>
      <CompanyImageUpload @uploaded="updateLogo" />
      <FormKit
        type="email"
        v-model="verificationEmail"
        label="E-Mail für Verifizierung"
        validation="required|email"
        :classes="{ label: 'label', input: 'input' }"
      />
      <p class="text-sm text-gray-600">
        Du kannst diesen Schritt überspringen, aber solange du nicht verifiziert bist, wirst du nicht angezeigt.
      </p>
      <div class="flex justify-between">
        <Button type="button" class="btn-outline" @click="finishWithoutVerification">Überspringen</Button>
        <Button type="button" @click="sendVerification">Verifizieren</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, updateEmail } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import Button from '@/components/common/Button.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'
import { LOCK_TYPE_OPTIONS } from '@/constants/lockTypes'
import { loginWithGoogle, sendVerificationEmail } from '@/services/auth'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'
import Loader from '@/components/common/Loader.vue'

const router = useRouter()
const step = ref(1)
const googleLoading = ref(false)
const googleError = ref('')
const googleUser = ref(false)
const verificationEmail = ref('')

const form = ref({
  company_name: '',
  email: '',
  password: '',
  confirm_password: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  opening_hours: {},
  lock_types: [],
  price: '',
  description: '',
  is_247: false,
  emergency_price: '',
  logo_url: ''
})

const lockTypeOptions = LOCK_TYPE_OPTIONS

function handleStep1(data) {
  Object.assign(form.value, data)
  step.value = 2
}

function handleStep3() {
  step.value = 4
}

function handleStep4(data) {
  form.value.price = data.price
  form.value.description = data.description
  form.value.emergency_price = data.emergency_price
  step.value = 5
}

async function register() {
  try {
    let user = auth.currentUser
    if (!user) {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.value.email,
        form.value.password
      )
      user = cred.user
    }
    await setDoc(doc(db, 'companies', user.uid), {
      company_name: form.value.company_name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
      postal_code: form.value.postal_code,
      price: form.value.price,
      description: form.value.description,
      lock_types: form.value.lock_types,
      opening_hours: form.value.opening_hours,
      is_247: form.value.is_247,
      emergency_price: form.value.is_247 ? form.value.emergency_price || '' : '',
      logo_url: form.value.logo_url || '',
      created_at: new Date().toISOString(),
      verified: false,
    })
    verificationEmail.value = form.value.email
    step.value = 6
  } catch (e) {
    alert('Fehler bei der Registrierung: ' + e.message)
  }
}

async function registerWithGoogle() {
  googleError.value = ''
  googleLoading.value = true
  try {
    const { user } = await loginWithGoogle()
    googleUser.value = true
    form.value.email = user.email || ''
    form.value.company_name = user.displayName || ''
  } catch (e) {
    googleError.value = e.message
  } finally {
    googleLoading.value = false
  }
}

function updateLogo(url) {
  form.value.logo_url = url
  if (auth.currentUser) {
    updateDoc(doc(db, 'companies', auth.currentUser.uid), { logo_url: url })
  }
}

async function sendVerification() {
  try {
    if (verificationEmail.value && auth.currentUser) {
      if (verificationEmail.value !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, verificationEmail.value)
        await updateDoc(doc(db, 'companies', auth.currentUser.uid), {
          email: verificationEmail.value,
        })
      }
      await sendVerificationEmail()
    }
    router.push({
      name: 'success',
      query: { msg: 'Verifizierungs-E-Mail gesendet', next: '/dashboard' }
    })
  } catch (e) {
    alert('Fehler bei der Verifizierung: ' + e.message)
  }
}

function finishWithoutVerification() {
  alert('Solange du nicht verifiziert bist, wirst du nicht angezeigt.')
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.label {
  @apply block text-sm font-medium mb-1;
}
.input {
  @apply w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold focus:border-gold;
}
.textarea {
  @apply w-full border border-gray-300 rounded-xl px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-gold focus:border-gold;
}
:deep(.btn-outline) {
  @apply rounded-full px-4 py-2 font-medium border border-gold text-gold bg-white hover:bg-gold/10 transition-colors;
}
</style>

