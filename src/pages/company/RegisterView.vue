<!-- Diese Datei enthält das Registrierungsformular für Firmen. -->
<template>
  <section class="page-wrapper">
    <div class="grid gap-10 xl:grid-cols-[0.9fr,1.1fr]">
      <div class="glass-card p-8 sm:p-10">
        <div class="space-y-6">
          <p class="badge-neutral">
            <i class="fa fa-key"></i>
            Werde Problemsolver:in
          </p>
          <h1 class="section-heading">Präsentiere deinen Schlüsseldienst auf Magikey</h1>
          <p class="section-subtitle">
            Registriere dich kostenfrei, verifiziere dein Unternehmen und erscheine in der Suchergebnisliste der Plattform.
          </p>
          <div class="muted-panel space-y-3 text-sm text-slate-600">
            <p class="font-semibold text-slate-700">Deine Vorteile:</p>
            <ul class="space-y-2">
              <li class="flex items-start gap-2">
                <i class="fa fa-check text-gold mt-1"></i>
                <span>Zeige transparente Preise & Leistungen, inklusive Notdienst-Informationen.</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="fa fa-check text-gold mt-1"></i>
                <span>Erreiche Kund:innen, die gezielt nach vertrauenswürdigen Betrieben suchen.</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="fa fa-check text-gold mt-1"></i>
                <span>Verwalte Öffnungszeiten, Bilder und Beschreibungen zentral im Dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="glass-card p-8 sm:p-10">
        <Transition name="fade">
          <FormKit
            type="form"
            :actions="false"
            @submit="register"
            :config="{ validationVisibility: 'blur' }"
            :classes="{ form: 'space-y-6' }"
          >
            <div class="grid gap-6 lg:grid-cols-2">
              <FormKit
                type="text"
                name="company_name"
                label="Firmenname"
                validation="required"
                placeholder="z. B. Schlüsseldienst Müller"
                :classes="inputClasses"
              />

              <FormKit
                type="email"
                name="email"
                label="E-Mail"
                validation="required|email"
                placeholder="beispiel@firma.de"
                :classes="inputClasses"
              />

              <PasswordField :classes="inputClasses" />

              <FormKit
                type="password"
                name="confirm_password"
                label="Passwort wiederholen"
                validation="required|confirm:password"
                placeholder="Nochmals eingeben"
                :classes="inputClasses"
                autocomplete="new-password"
              />

              <FormKit
                type="tel"
                name="phone"
                label="Telefonnummer"
                validation="required"
                placeholder="z. B. 0151 12345678"
                :classes="inputClasses"
              />

              <FormKit
                type="number"
                name="price"
                label="Preis (ab)"
                min="0"
                :classes="inputClasses"
              />

              <FormKit
                type="text"
                name="address"
                label="Straße und Hausnummer"
                :classes="inputClasses"
              />

              <FormKit
                type="text"
                name="postal_code"
                label="Postleitzahl"
                :classes="inputClasses"
              />

              <FormKit
                type="text"
                name="city"
                label="Ort"
                :classes="inputClasses"
              />

              <FormKit
                type="textarea"
                name="description"
                label="Beschreibung"
                placeholder="Beschreibe dein Angebot in ein paar Sätzen"
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
                  :class="{ 'border-gold bg-gold/20 text-slate-900': lockTypes.includes(opt.value) }"
                  @click="toggleLockType(opt.value)"
                >
                  <span>{{ opt.label }}</span>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="font-semibold text-slate-800">Öffnungszeiten</h3>
              <OpeningHoursForm v-model="openingHours" />
            </div>

            <div class="space-y-4 rounded-3xl border border-white/70 bg-white/60 p-6 shadow-inner">
              <FormKit
                type="checkbox"
                name="is_247"
                label="24/7 Notdienst"
                v-model="is247"
                :classes="{
                  outer: 'flex items-center gap-3',
                  input: 'h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold',
                  label: 'text-sm font-medium text-slate-600'
                }"
              />

              <FormKit
                v-if="is247"
                type="number"
                name="emergency_price"
                label="Notdienstpreis"
                validation="required"
                min="0"
                :classes="inputClasses"
              />
            </div>

            <Button class="w-full">Registrieren</Button>
          </FormKit>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import Button from '@/components/common/Button.vue'
import PasswordField from '@/components/common/PasswordField.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'
import { LOCK_TYPE_OPTIONS } from '@/constants/lockTypes'
import { sendVerificationEmail } from '@/services/auth'

const router = useRouter()
const is247 = ref(false)
const openingHours = ref({})
const lockTypes = ref([])
const lockTypeOptions = LOCK_TYPE_OPTIONS

const inputClasses = {
  outer: 'space-y-2',
  label: 'label text-slate-700',
  input: 'water-input',
  help: 'text-xs text-slate-500',
}

const textareaClasses = {
  outer: 'space-y-2 lg:col-span-2',
  label: 'label text-slate-700',
  input: 'water-textarea min-h-[120px]',
  help: 'text-xs text-slate-500',
}

function toggleLockType(value) {
  if (lockTypes.value.includes(value)) {
    lockTypes.value = lockTypes.value.filter((item) => item !== value)
  } else {
    lockTypes.value = [...lockTypes.value, value]
  }
}


const register = async (form) => {
  if (!isFirebaseConfigured || !auth || !db) {
    alert('Registrierung ist derzeit nicht verfügbar.')
    return
  }
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    )
    const companyRef = doc(db, 'companies', user.uid)
    const existing = await getDoc(companyRef)
    if (!existing.exists()) {
      await setDoc(companyRef, {
        company_name: form.company_name,
        email: form.email,
        phone: form.phone,
        address: form.address || '',
        city: form.city || '',
        postal_code: form.postal_code || '',
        price: form.price || '',
        description: form.description || '',
        lock_types: lockTypes.value,
        opening_hours: openingHours.value,
        is_247: form.is_247 || false,
        emergency_price: form.is_247 ? form.emergency_price || '' : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        verified: false,
        verification_status: 'pending',
        association_member: false,
        is_admin: false,
        google_place_url: '',
        website_url: '',
        price_comment: '',
        security_badge: '',
        review_policy_note:
          'Bewertungen werden ausschließlich über die Magikey-Plattform erfasst und manuell geprüft.',
        admin_notes: '',
      })
    }
    await sendVerificationEmail(user)
    router.push({
      name: 'success',
      query: {
        msg: 'Registrierung eingegangen – unser Trust-Team prüft dein Unternehmen.',
        next: '/dashboard',
      },
    })
  } catch (e) {
    alert('Fehler bei der Registrierung: ' + e.message)
  }
}

</script>

