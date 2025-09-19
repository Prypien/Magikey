<!-- Diese Datei führt den Nutzer durch das Setzen eines neuen Passworts. -->
<template>
  <div class="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
    <template v-if="loading">
      <Loader :size="80" />
      <p class="mt-2">Überprüfe Link...</p>
    </template>
    <template v-else-if="success">
      <lottie-player
        src="/lotties/haken.json"
        background="transparent"
        speed="1"
        style="width: 200px; height: 200px;"
        autoplay
      ></lottie-player>
      <h1 class="text-2xl font-semibold text-black mt-4">Passwort geändert</h1>
      <button class="btn mt-6" @click="gotoLogin">Weiter zum Login</button>
    </template>
    <template v-else-if="valid">
      <FormKit
        type="form"
        :actions="false"
        @submit="updatePassword"
        :config="{ validationVisibility: 'live' }"
      >
        <FormKit
          type="password"
          name="password"
          label="Neues Passwort"
          validation="required|length:6,36"
          v-model="newPassword"
          :classes="{ label: 'label', input: 'input' }"
        />
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <Button :disabled="submitting" class="w-full mt-4">
          <template v-if="submitting">
            <Loader :size="20" />
          </template>
          <span v-else>Passwort setzen</span>
        </Button>
      </FormKit>
    </template>
    <p v-else class="text-red-600">Link ist ungültig oder abgelaufen.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, isFirebaseConfigured } from '@/firebase'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import Button from '@/components/common/Button.vue'
import Loader from '@/components/common/Loader.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const valid = ref(false)
const success = ref(false)
const submitting = ref(false)
const newPassword = ref('')
const error = ref('')

onMounted(async () => {
  if (!isFirebaseConfigured || !auth) {
    loading.value = false
    return
  }
  const code = route.query.oobCode
  if (!code) {
    loading.value = false
    return
  }
  try {
    await verifyPasswordResetCode(auth, code)
    valid.value = true
  } catch (err) {
    console.error('Passwort-Reset-Code ungültig', err)
  } finally {
    loading.value = false
  }
})

async function updatePassword() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  if (!isFirebaseConfigured || !auth) {
    error.value = 'Passwortänderung ist momentan nicht verfügbar.'
    submitting.value = false
    return
  }
  try {
    const code = route.query.oobCode
    await confirmPasswordReset(auth, code, newPassword.value)
    success.value = true
    valid.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}

function gotoLogin() {
  router.push('/login')
}
</script>
