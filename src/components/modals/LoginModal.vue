<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-sm relative">
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        &times;
      </button>

      <h2 class="text-xl font-bold mb-4 text-center">Login für Unternehmen</h2>

      <Login showCancel @cancel="$emit('close')" @success="$emit('close')" />
    </div>
  </div>
</template>

<script setup>
import Login from '@/components/Login.vue'
</script>
