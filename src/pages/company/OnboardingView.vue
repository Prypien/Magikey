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
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          placeholder="Mind. 6 Zeichen"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
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
import { sendVerificationEmail } from '@/services/auth'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'

const router = useRouter()
const step = ref(1)
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

