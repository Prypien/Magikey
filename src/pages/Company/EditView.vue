<template>
  <div class="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-3xl font-semibold mb-8 text-center text-black">
      🔧 Firmenprofil bearbeiten
    </h1>

    <Transition name="fade">
      <FormKit
        type="form"
        :actions="false"
        @submit="saveChanges"
        :config="{ validationVisibility: 'live' }"
        class="space-y-6"
      >
        <CompanyImageUpload
          :initialImageUrl="company.logo_url"
          @uploaded="url => (company.logo_url = url)"
          @upload-start="logoUploading = true"
          @upload-end="logoUploading = false"
        />

        <FormKit
          type="text"
          name="company_name"
          label="Firmenname"
          validation="required"
          v-model="company.company_name"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="tel"
          name="phone"
          label="Telefonnummer"
          v-model="company.phone"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="text"
          name="address"
          label="Straße und Hausnummer"
          v-model="company.address"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="text"
          name="city"
          label="Ort"
          v-model="company.city"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="text"
          name="postal_code"
          label="Postleitzahl"
          v-model="company.postal_code"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="number"
          name="price"
          label="Preis (ab)"
          min="0"
          v-model="company.price"
          :classes="{ label: 'label', input: 'input' }"
        />
        <FormKit
          type="textarea"
          name="description"
          label="Beschreibung"
          v-model="company.description"
          :classes="{ label: 'label', input: 'textarea' }"
        />

        <OpeningHoursForm v-model="company.opening_hours" />


        <FormKit
          type="checkbox"
          name="is_247"
          label="24/7 Notdienst"
          v-model="company.is_247"
          :classes="{ label: 'label' }"
        />

        <FormKit
          v-if="company.is_247"
          type="number"
          name="emergency_price"
          label="Notdienstpreis"
          validation="required"
          min="0"
          v-model="company.emergency_price"
          :classes="{ label: 'label', input: 'input' }"
        />

        <div class="flex gap-4 pt-4">
          <Button
            type="submit"
            class="flex-1"
            :disabled="logoUploading || saving"
          >
            Änderungen speichern
          </Button>
          <button type="button" @click="confirmDelete" class="btn-danger">Konto löschen</button>
        </div>
      </FormKit>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'
import Button from '@/components/common/Button.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'

const router = useRouter()
const user = auth.currentUser

const logoUploading = ref(false)
const saving = ref(false)

const company = ref({
  company_name: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  price: '',
  description: '',
  logo_url: '',
  is_247: false,
  emergency_price: '',
  opening_hours: {},
})

onMounted(async () => {
  if (!user) return
  const docSnap = await getDoc(doc(db, 'companies', user.uid))
  if (docSnap.exists()) {
    company.value = { ...company.value, ...docSnap.data() }
  }
})

const saveChanges = async () => {
  if (!user || logoUploading.value) {
    if (logoUploading.value) {
      window.alert('Bild wird noch hochgeladen. Bitte warten...')
    }
    return
  }
  saving.value = true
  await updateDoc(doc(db, 'companies', user.uid), company.value)
  saving.value = false
  router.push({
    name: 'success',
    query: { msg: 'Änderungen gespeichert', next: '/dashboard' }
  })
}

const confirmDelete = async () => {
  const confirmed = window.confirm('Bist du sicher, dass du dein Konto löschen willst?')
  if (!confirmed || !user) return
  await deleteDoc(doc(db, 'companies', user.uid))
  await user.delete()
  window.alert('Konto gelöscht')
  router.push('/')
}
</script>
