<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <transition name="modal">
        <div v-if="show" class="bg-white rounded-xl p-8 w-full max-w-sm shadow relative">
          <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
          <h2 class="text-xl font-semibold mb-4 text-center text-black">Login für Unternehmen</h2>
          <Login @success="$emit('close')" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import Login from '@/components/Login.vue'

const show = ref(true)
</script>
