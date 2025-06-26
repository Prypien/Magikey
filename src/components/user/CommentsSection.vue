<template>
  <div class="mt-6">
    <h2 class="font-semibold mb-2 text-black">Bewertungen</h2>
    <div v-if="loading" class="text-gray-500">Lade...</div>
    <ul v-else class="space-y-2">
      <li v-for="rev in reviews" :key="rev.id" class="p-2 border rounded">
        <p class="text-sm">{{ rev.comment }}</p>
        <p class="text-yellow-500 text-sm">{{ '★'.repeat(rev.rating) }}</p>
      </li>
    </ul>
    <form @submit.prevent="submit" class="mt-4 space-y-2">
      <textarea v-model="comment" class="textarea" placeholder="Kommentar"></textarea>
      <div class="flex items-center gap-2">
        <select v-model.number="rating" class="input w-auto">
          <option v-for="r in [1,2,3,4,5]" :key="r" :value="r">{{ r }}★</option>
        </select>
        <Button size="sm" :disabled="saving">Absenden</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  companyId: { type: String, required: true }
})

const reviews = ref([])
const loading = ref(true)
const comment = ref('')
const rating = ref(5)
const saving = ref(false)

async function fetchReviews() {
  const q = query(collection(db, 'reviews'), where('companyId', '==', props.companyId))
  const snap = await getDocs(q)
  reviews.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

onMounted(async () => {
  await fetchReviews()
  loading.value = false
})

async function submit() {
  if (!comment.value) return
  saving.value = true
  try {
    await addDoc(collection(db, 'reviews'), {
      companyId: props.companyId,
      comment: comment.value,
      rating: rating.value,
      created_at: serverTimestamp()
    })
    comment.value = ''
    rating.value = 5
    await fetchReviews()
  } finally {
    saving.value = false
  }
}
</script>
