<!-- Diese Datei enthält das Login-Formular für Unternehmen. -->
<template>
  <FormKit
    type="form"
    :actions="false"
    @submit="login"
    :config="{ validationVisibility: 'live' }"
    :classes="{ form: 'space-y-5 text-left' }"
  >
    <FormKit
      type="email"
      name="email"
      label="E-Mail"
      validation="required|email"
      v-model="email"
      :classes="{
        outer: 'space-y-2',
        label: 'label text-slate-700',
        input: 'water-input'
      }"
    />

    <FormKit
      type="password"
      name="password"
      label="Passwort"
      validation="required|length:6,255"
      v-model="password"
      :classes="{
        outer: 'space-y-2',
        label: 'label text-slate-700',
        input: 'water-input'
      }"
    />

    <p
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
    >
      {{ error }}
    </p>

    <Button :disabled="loading" class="mt-2 w-full">
      <template v-if="loading">
        <Loader :size="20" />
      </template>
      <span v-else>Einloggen</span>
    </Button>

    <div class="mt-6 flex flex-col gap-2 text-center text-sm">
      <button
        type="button"
        class="font-medium text-slate-600 transition hover:text-gold"
        @click="goToRegister"
      >
        Noch kein Konto? Jetzt registrieren
      </button>
      <button
        type="button"
        class="font-medium text-slate-600 transition hover:text-gold"
        @click="resetPassword"
      >
        Passwort vergessen?
      </button>
      <button
        v-if="showCancel"
        type="button"
        class="font-medium text-slate-500 transition hover:text-gold"
        @click="emit('cancel')"
      >
        Abbrechen
      </button>
    </div>
  </FormKit>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginService, resetPassword as resetPasswordService } from '@/services/auth'
import Button from '@/components/common/Button.vue'
import Loader from '@/components/common/Loader.vue'

defineProps({
  showCancel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['success', 'cancel'])

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)


const login = async () => {
  error.value = ''
  loading.value = true
  try {
    await loginService(email.value, password.value)
    emit('success')
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
  emit('cancel')
}

const resetPassword = async () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Bitte E-Mail eingeben'
    return
  }
  loading.value = true
  try {
    await resetPasswordService(email.value)
    error.value = 'Passwort-Reset E-Mail gesendet'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>