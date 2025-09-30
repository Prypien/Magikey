<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal-backdrop" @keydown.esc.prevent.stop="emitClose">
        <div class="modal-card" role="dialog" aria-modal="true">
          <button class="close-btn" type="button" @click="emitClose">
            <i class="fa fa-times"></i>
          </button>
          <div class="space-y-4">
            <div class="space-y-2 text-center">
              <p class="badge-neutral inline-flex items-center gap-2 text-xs text-emerald-700">
                <i class="fa fa-lock"></i>
                Sicheres Feedback-Verfahren
              </p>
              <h2 class="text-2xl font-semibold text-slate-900">Wir begleiten die Rezension</h2>
              <p class="text-sm text-slate-600">
                Nach deiner Anfrage erhältst du einen digitalen Bewertungsbogen (1–5 Sterne) direkt von Magikey. So
                stellen wir sicher, dass alle Erfahrungen authentisch sind.
              </p>
            </div>

            <form class="space-y-5" @submit.prevent="submit">
              <label class="form-field">
                <span class="text-sm font-medium text-slate-700">E-Mail-Adresse für den Bewertungsbogen</span>
                <input
                  v-model.trim="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="deine.mail@example.com"
                />
              </label>

              <div class="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                <p class="font-semibold text-emerald-900">So funktioniert’s:</p>
                <ul class="mt-2 space-y-1">
                  <li class="flex items-start gap-2">
                    <i class="fa fa-shield-alt mt-0.5"></i>
                    <span>Wir speichern deine Anfrage verschlüsselt und geben sie nur an den ausgewählten Dienst weiter.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fa fa-star mt-0.5"></i>
                    <span>Nach Abschluss erhältst du den Bewertungsbogen per E-Mail (1–5 Bewertung + Kommentar).</span>
                  </li>
                </ul>
              </div>

              <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
              <p v-if="success" class="text-sm text-emerald-600">
                Danke! Der Bewertungsbogen wird an {{ email }} gesendet.
              </p>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" class="link-btn" @click="emitClose">
                  Abbrechen
                </button>
                <button type="submit" class="btn" :disabled="sending">
                  <Loader v-if="sending" :size="16" />
                  <i v-else class="fa fa-paper-plane"></i>
                  <span>{{ primaryLabel }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Loader from '@/components/common/Loader.vue'
import { createReviewInvite } from '@/services/review'

const props = defineProps({
  open: { type: Boolean, default: false },
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  action: { type: String, default: 'call' },
})

const emit = defineEmits(['close', 'submitted'])

const email = ref('')
const sending = ref(false)
const success = ref(false)
const error = ref('')

const primaryLabel = computed(() => {
  if (props.action === 'whatsapp') return 'Review-Bogen anfordern & WhatsApp öffnen'
  if (props.action === 'message') return 'Review-Bogen anfordern & Nachricht senden'
  return 'Review-Bogen anfordern & anrufen'
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      error.value = ''
      success.value = false
      sending.value = false
      email.value = ''
    } else {
      email.value = ''
    }
  }
)

async function submit() {
  if (!email.value) {
    error.value = 'Bitte gib eine gültige E-Mail-Adresse ein.'
    return
  }
  sending.value = true
  error.value = ''
  try {
    await createReviewInvite({
      companyId: props.companyId,
      companyName: props.companyName,
      contactType: props.action,
      customerEmail: email.value,
    })
    success.value = true
    emit('submitted', email.value)
  } catch (err) {
    error.value = err?.message || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'
  } finally {
    sending.value = false
  }
}

function emitClose() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal-card {
  position: relative;
  width: min(34rem, 100%);
  border-radius: 1.75rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.92));
  padding: 2.4rem 2rem 2rem;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.6);
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(51, 65, 85);
}

.badge-neutral {
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.35);
  background: rgba(209, 250, 229, 0.65);
  padding: 0.4rem 0.8rem;
  font-weight: 600;
}

.form-field input {
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: rgb(30, 41, 59);
}

.form-field input:focus {
  outline: none;
  border-color: rgba(248, 191, 64, 0.8);
  box-shadow: 0 0 0 4px rgba(248, 191, 64, 0.18);
}

.link-btn {
  background: transparent;
  color: rgb(100, 116, 139);
  font-weight: 600;
  text-decoration: underline;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.75rem 1.6rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  font-weight: 700;
  color: rgb(30, 41, 59);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.35);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 480px) {
  .modal-card {
    padding: 2rem 1.4rem 1.6rem;
  }
}
</style>
