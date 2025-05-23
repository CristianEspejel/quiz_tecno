<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <h1 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Selecciona un Pack de Estudio</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
      <button 
        @click="irAQuiz('datadog')" 
        class="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50 border border-gray-200"
      >
        <div class="w-24 h-24 md:w-32 md:h-32 mb-4 flex items-center justify-center">
          <img 
            src="../assets/images/datadog.png" 
            alt="Datadog" 
            class="max-w-full max-h-full object-contain" 
          />
        </div>
        <span class="text-lg font-medium text-gray-700">Datadog</span>
      </button>

      <button 
        @click="irAQuiz('splunk')" 
        class="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-green-50 border border-gray-200"
      >
        <div class="w-24 h-24 md:w-32 md:h-32 mb-4 flex items-center justify-center">
          <img 
            src="../assets/images/splunk.png" 
            alt="Splunk" 
            class="max-w-full max-h-full object-contain" 
          />
        </div>
        <span class="text-lg font-medium text-gray-700">Splunk</span>
      </button>

      
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irAQuiz(packName) {
  router.push(`/quiz?pack=${packName}`)
}
</script>