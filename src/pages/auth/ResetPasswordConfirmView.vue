<!-- Diese Datei führt den Nutzer durch das Setzen eines neuen Passworts. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-2xl">
      <div class="glass-card p-8 sm:p-10 text-center">
        <template v-if="loading">
          <div class="flex flex-col items-center gap-3 text-slate-500">
            <Loader :size="80" />
            <p>Überprüfe Link…</p>
          </div>
        </template>
        <template v-else-if="success">
          <div class="flex flex-col items-center gap-4">
            <lottie-player
              src="/lotties/haken.json"
              background="transparent"
              speed="1"
              style="width: 200px; height: 200px;"
              autoplay
            ></lottie-player>
            <h1 class="section-heading">Passwort geändert</h1>
            <p class="section-subtitle">Dein Konto ist wieder sicher. Du kannst dich jetzt mit deinem neuen Passwort anmelden.</p>
            <button class="btn" @click="gotoLogin">Weiter zum Login</button>
          </div>
        </template>
        <template v-else-if="valid">
          <div class="space-y-4">
            <h1 class="section-heading">Neues Passwort setzen</h1>
            <p class="section-subtitle">Vergib ein starkes Passwort mit mindestens 6 Zeichen.</p>
          </div>
          <div class="mt-6 text-left">
            <FormKit
              type="form"
              :actions="false"
              @submit="updatePassword"
              :config="{ validationVisibility: 'live' }"
              :classes="{ form: 'space-y-5' }"
            >
              <FormKit
                type="password"
                name="password"
                label="Neues Passwort"
                validation="required|length:6,36"
                v-model="newPassword"
                :classes="{
                  outer: 'space-y-2',
                  label: 'label text-slate-700',
                  input: 'water-input'
                }"
              />
              <p v-if="error" class="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-2 text-sm text-red-600">
                {{ error }}
              </p>
              <Button :disabled="submitting" class="w-full">
                <template v-if="submitting">
                  <Loader :size="20" />
                </template>
                <span v-else>Passwort setzen</span>
              </Button>
            </FormKit>
          </div>
        </template>
        <p v-else class="text-red-600">Link ist ungültig oder abgelaufen.</p>
      </div>
    </div>
  </section>
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
