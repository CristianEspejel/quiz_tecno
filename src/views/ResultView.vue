<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
    <h2 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Resultados del Quiz</h2>
    
    <div class="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-md space-y-4 md:space-y-5">
      <p class="text-lg md:text-xl text-gray-700">✅ Correctas: <span class="font-semibold text-green-600">{{ score }}</span></p>
      <p class="text-lg md:text-xl text-gray-700">❌ Incorrectas: <span class="font-semibold text-red-600">{{ incorrect }}</span></p>
      <p class="text-lg md:text-xl text-gray-700">📊 Efectividad: <span class="font-semibold text-blue-600">{{ effectiveness }}%</span></p>
    </div>

    <button 
      @click="goHome"
      class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 text-base md:text-lg"
    >
      Reintentar
    </button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const score = parseInt(route.query.score || '0', 10)
const incorrect = parseInt(route.query.incorrect || '0', 10)
const total = parseInt(route.query.total || '0', 10)

const effectiveness = computed(() => ((score / total) * 100).toFixed(2))

function goHome() {
  router.replace('/')
}
</script>