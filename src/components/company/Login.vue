<!-- Diese Datei enthält das Login-Formular für Unternehmen. -->
<template>
  <FormKit
    type="form"
    :actions="false"
    @submit="login"
    :config="{ validationVisibility: 'live' }"
  >
    <FormKit
      type="email"
      name="email"
      label="E-Mail"
      validation="required|email"
      v-model="email"
      :classes="{ label: 'label', input: 'input' }"
    />

    <FormKit
      type="password"
      name="password"
      label="Passwort"
      validation="required|min:6"
      v-model="password"
      :classes="{ label: 'label', input: 'input' }"
    />

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <Button :disabled="loading" class="w-full mt-4">
      <template v-if="loading">
        <Loader :size="20" />
      </template>
      <span v-else>Einloggen</span>
    </Button>

    <div class="flex flex-col gap-2 mt-4">
      <button
        type="button"
        class="w-full text-sm text-gold hover:underline"
        @click="goToRegister"
      >
        Noch kein Konto? Jetzt registrieren
      </button>
      <button
        type="button"
        class="w-full text-sm text-gold hover:underline"
        @click="resetPassword"
      >
        Passwort vergessen?
      </button>
      <button
        v-if="showCancel"
        type="button"
        class="w-full text-sm text-gray-600 hover:underline"
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