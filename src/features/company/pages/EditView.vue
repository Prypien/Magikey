<!-- Diese Datei ermöglicht Firmen das Bearbeiten ihres Profils. -->
<template>
  <section class="page-wrapper">
    <div class="space-y-10">
      <div class="glass-card p-8 sm:p-10">
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="space-y-2">
            <p class="badge-neutral mx-auto w-fit">
              <i class="fa fa-wrench"></i>
              Profilpflege
            </p>
            <h1 class="text-3xl font-semibold text-slate-900">Firmenprofil bearbeiten</h1>
            <p class="text-sm text-slate-500">
              Aktualisiere deine Daten, damit Kund:innen jederzeit die richtigen Informationen finden.
            </p>
          </div>
          <Transition name="fade">
            <div
              v-if="!company.verified"
              class="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-700"
            >
              <p>Dein Profil ist noch nicht verifiziert.</p>
              <Button
                size="sm"
                type="button"
                @click="verifyProfile"
                :disabled="verificationSending"
              >
                <template v-if="verificationSending">Senden…</template>
                <template v-else>Verifizierungsmail senden</template>
              </Button>
              <p v-if="verificationSent" class="text-emerald-600">E-Mail wurde gesendet.</p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="glass-card p-8 sm:p-10">
        <FormKit
          type="form"
          :actions="false"
          @submit="saveChanges"
          :config="{ validationVisibility: 'live' }"
          :classes="{ form: 'space-y-8' }"
        >
          <CompanyImageUpload
            :initialImageUrl="company.logo_url"
            @uploaded="url => (company.logo_url = url)"
            @upload-start="logoUploading = true"
            @upload-end="logoUploading = false"
          />

          <div class="grid gap-6 lg:grid-cols-2">
            <FormKit
              type="text"
              name="company_name"
              label="Firmenname"
              validation="required"
              v-model="company.company_name"
              :classes="inputClasses"
            />
            <FormKit
              type="tel"
              name="phone"
              label="Telefonnummer"
              v-model="company.phone"
              :classes="inputClasses"
              help="Diese Nummer wird für Anrufe und – sofern nicht anders angegeben – für WhatsApp genutzt."
            />
            <FormKit
              type="checkbox"
              name="has_separate_whatsapp"
              label="Ich nutze eine andere Nummer für WhatsApp"
              v-model="hasSeparateWhatsapp"
              :classes="whatsappToggleClasses"
              help="Aktiviere die Option, wenn deine WhatsApp-Nummer von der Telefon-Nummer abweicht."
            />
            <FormKit
              v-if="hasSeparateWhatsapp"
              type="tel"
              name="whatsapp"
              label="Eigene WhatsApp-Nummer"
              validation="required"
              v-model="company.whatsapp"
              :classes="inputClasses"
              help="Diese Nummer wird ausschließlich für WhatsApp genutzt."
            />
            <FormKit
              type="number"
              name="price"
              label="Preis (ab)"
              min="0"
              v-model="company.price"
              :classes="inputClasses"
            />
            <FormKit
              type="text"
              name="address"
              label="Straße und Hausnummer"
              v-model="company.address"
              :classes="inputClasses"
            />
            <FormKit
              type="text"
              name="postal_code"
              label="Postleitzahl"
              v-model="company.postal_code"
              :classes="inputClasses"
            />
            <FormKit
              type="text"
              name="city"
              label="Ort"
              v-model="company.city"
              :classes="inputClasses"
            />
            <FormKit
              type="textarea"
              name="description"
              label="Beschreibung"
              v-model="company.description"
              :classes="textareaClasses"
            />
          </div>

          <div class="space-y-4">
            <label class="label text-slate-700">Schlosstypen</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in lockTypeOptions"
                :key="opt.value"
                type="button"
                class="pill-checkbox"
                :class="{ 'border-gold bg-gold/20 text-slate-900': company.lock_types.includes(opt.value) }"
                @click="toggleLockType(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900">Öffnungszeiten</h3>
            <OpeningHoursForm v-model="company.opening_hours" />
          </div>

          <div class="space-y-4 rounded-3xl border border-white/70 bg-white/60 p-6 shadow-inner">
            <FormKit
              type="checkbox"
              name="is_247"
              label="24/7 Notdienst"
              v-model="company.is_247"
              :classes="{
                outer: 'flex items-center gap-3',
                input: 'h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold',
                label: 'text-sm font-medium text-slate-600'
              }"
            />

            <FormKit
              v-if="company.is_247"
              type="number"
              name="emergency_price"
              label="Notdienstpreis"
              validation="required"
              min="0"
              v-model="company.emergency_price"
              :classes="inputClasses"
            />
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="submit"
              class="flex-1"
              :disabled="logoUploading || saving"
            >
              Änderungen speichern
            </Button>
            <button type="button" @click="confirmDelete" class="btn-danger sm:w-auto">Konto löschen</button>
          </div>
        </FormKit>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, isFirebaseConfigured } from '@/core/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import CompanyImageUpload from '@/ui/components/company/CompanyImageUpload.vue'
import Button from '@/ui/components/common/Button.vue'
import OpeningHoursForm from '@/ui/components/company/OpeningHoursForm.vue'
import { sendVerificationEmail } from '@/core/services/auth'
import { LOCK_TYPE_OPTIONS } from '@/core/constants/lockTypes'
import { onAuthStateChanged } from 'firebase/auth'
import { ROUTE_LOCATIONS, ROUTE_NAMES, ROUTE_PATHS } from '@/core/constants/routes'

const router = useRouter()
const logoUploading = ref(false)
const saving = ref(false)
const verificationSending = ref(false)
const verificationSent = ref(false)

const currentUser = ref(null)

const defaultCompany = () => ({
  company_name: '',
  phone: '',
  whatsapp: '',
  address: '',
  city: '',
  postal_code: '',
  price: '',
  description: '',
  logo_url: '',
  is_247: false,
  emergency_price: '',
  opening_hours: {},
  lock_types: [],
  verified: false,
})

const company = ref(defaultCompany())
const hasSeparateWhatsapp = ref(false)

async function loadCompany(uid) {
  if (!isFirebaseConfigured) {
    company.value = defaultCompany()
    return
  }
  try {
    const docSnap = await getDoc(doc(db, 'companies', uid))
    if (docSnap.exists()) {
      company.value = { ...defaultCompany(), ...docSnap.data() }
      syncWhatsappState()
    } else {
      company.value = defaultCompany()
      syncWhatsappState()
    }
  } catch (error) {
    console.error('Fehler beim Laden der Firmendaten:', error)
  }
}

let unsubscribeAuth

onMounted(() => {
  if (!isFirebaseConfigured) {
    currentUser.value = null
    return
  }
  try {
    unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        currentUser.value = user
        if (user) {
          loadCompany(user.uid)
        } else {
          company.value = defaultCompany()
          syncWhatsappState()
        }
      },
      (error) => {
        console.error('Auth-Listener konnte nicht gestartet werden:', error)
        currentUser.value = null
        company.value = defaultCompany()
      }
    )
  } catch (error) {
    console.error('Registrierung des Auth-Listeners fehlgeschlagen:', error)
    currentUser.value = null
  }
})

onUnmounted(() => {
  if (typeof unsubscribeAuth === 'function') {
    unsubscribeAuth()
  }
})

const lockTypeOptions = LOCK_TYPE_OPTIONS

const inputClasses = {
  outer: 'space-y-2',
  label: 'label text-slate-700',
  input: 'water-input',
  help: 'text-xs text-slate-500',
}

const whatsappToggleClasses = {
  outer: 'lg:col-span-2 space-y-2',
  wrapper: 'flex items-center gap-3',
  input: 'h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold',
  label: 'text-sm font-medium text-slate-600',
  help: 'text-xs text-slate-500',
}

const textareaClasses = {
  outer: 'space-y-2 lg:col-span-2',
  label: 'label text-slate-700',
  input: 'water-textarea min-h-[140px]',
  help: 'text-xs text-slate-500',
}

watch(
  () => company.value.phone,
  (phone) => {
    if (!hasSeparateWhatsapp.value) {
      company.value.whatsapp = phone || ''
    }
  }
)

watch(
  hasSeparateWhatsapp,
  (value, previous) => {
    if (value === previous) return
    if (value) {
      if (company.value.whatsapp === company.value.phone) {
        company.value.whatsapp = ''
      }
    } else {
      company.value.whatsapp = company.value.phone || ''
    }
  }
)

function syncWhatsappState() {
  hasSeparateWhatsapp.value =
    !!company.value.whatsapp && company.value.whatsapp !== company.value.phone

  if (!hasSeparateWhatsapp.value) {
    company.value.whatsapp = company.value.phone || ''
  }
}

function toggleLockType(value) {
  if (company.value.lock_types.includes(value)) {
    company.value.lock_types = company.value.lock_types.filter((item) => item !== value)
  } else {
    company.value.lock_types = [...company.value.lock_types, value]
  }
}

const saveChanges = async () => {
  const user = currentUser.value
  if (!isFirebaseConfigured || !user || logoUploading.value) {
    if (logoUploading.value) {
      window.alert('Bild wird noch hochgeladen. Bitte warten...')
    }
    return
  }
  saving.value = true
  const payload = {
    ...company.value,
    whatsapp: hasSeparateWhatsapp.value
      ? company.value.whatsapp
      : company.value.phone || '',
  }
  await updateDoc(doc(db, 'companies', user.uid), payload)
  company.value = { ...company.value, ...payload }
  syncWhatsappState()
  saving.value = false
  router.push({
    ...ROUTE_LOCATIONS.SUCCESS,
    query: {
      msg: 'Änderungen gespeichert',
      next: ROUTE_PATHS[ROUTE_NAMES.DASHBOARD],
    },
  })
}

const confirmDelete = async () => {
  const confirmed = window.confirm('Bist du sicher, dass du dein Konto löschen willst?')
  const user = currentUser.value
  if (!confirmed || !isFirebaseConfigured || !user) return
  await deleteDoc(doc(db, 'companies', user.uid))
  await user.delete()
  window.alert('Konto gelöscht')
  router.push(ROUTE_LOCATIONS.HOME)
}

const verifyProfile = async () => {
  const user = currentUser.value
  if (!isFirebaseConfigured || !user || verificationSending.value) return
  verificationSending.value = true
  try {
    await sendVerificationEmail(user)
    verificationSent.value = true
  } catch (e) {
    window.alert('Fehler beim Senden der Verifizierungsmail: ' + e.message)
  } finally {
    verificationSending.value = false
  }
}
</script>
