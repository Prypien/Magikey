<!-- Diese Datei verschickt den Link zum Zurücksetzen des Passworts. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-2xl">
      <div class="glass-card p-8 sm:p-10">
        <div class="space-y-4 text-center">
          <h1 class="section-heading">Passwort zurücksetzen</h1>
          <p class="section-subtitle">
            Wir senden dir einen sicheren Link per E-Mail. Damit kannst du ein neues Passwort festlegen.
          </p>
        </div>
        <div class="mt-8">
          <FormKit
            type="form"
            :actions="false"
            @submit="sendReset"
            :config="{ validationVisibility: 'live' }"
            :classes="{ form: 'space-y-5' }"
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
            <p v-if="message" class="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm text-emerald-600">
              {{ message }}
            </p>
            <p v-if="error" class="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-2 text-sm text-red-600">
              {{ error }}
            </p>
            <Button :disabled="loading" class="w-full">
              <template v-if="loading">
                <Loader :size="20" />
              </template>
              <span v-else>Reset-Link anfordern</span>
            </Button>
          </FormKit>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { resetPassword } from '@/services/auth'
import Button from '@/components/common/Button.vue'
import Loader from '@/components/common/Loader.vue'

const email = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)

const sendReset = async () => {
  message.value = ''
  error.value = ''
  loading.value = true
  try {
    await resetPassword(email.value)
    message.value = 'E-Mail zum Zurücksetzen wurde gesendet'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
