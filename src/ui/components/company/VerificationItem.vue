<template>
  <div class="verification-item">
    <div class="icon">
      <i class="fa" :class="icon"></i>
    </div>
    <div class="content">
      <dt class="label">{{ label }}</dt>
      <dd v-if="value" class="value">
        <a v-if="isLink" :href="value" target="_blank" rel="noopener" class="link">
          {{ displayValue }}
        </a>
        <span v-else>{{ displayValue }}</span>
      </dd>
      <dd v-else class="placeholder">{{ placeholder }}</dd>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: '' },
  placeholder: { type: String, default: 'Noch keine Angabe' },
})

const isLink = computed(() => props.value?.startsWith('http'))
const displayValue = computed(() => {
  if (!props.value) return ''
  try {
    if (typeof window !== 'undefined' && typeof window.URL === 'function') {
      const parsed = new window.URL(props.value)
      return parsed.hostname.replace(/^www\./, '')
    }
    return props.value
  } catch (error) {
    return props.value
  }
})
</script>

<style scoped>
.verification-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.65);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1.25rem;
  background: rgba(252, 211, 77, 0.2);
  color: #b45309;
  font-size: 1.1rem;
}

.content {
  display: grid;
  gap: 0.25rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(30, 41, 59);
}

.value {
  font-size: 0.95rem;
  color: rgb(15, 118, 110);
  font-weight: 500;
}

.placeholder {
  font-size: 0.85rem;
  color: rgb(100, 116, 139);
  font-style: italic;
}

.link {
  text-decoration: none;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: rgba(16, 185, 129, 0.6);
}

@media (max-width: 640px) {
  .verification-item {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 1rem;
  }
}
</style>
