<template>
  <div class="result-container max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
    <!-- Resumen Estadístico -->
    <div class="summary bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Resultados del Quiz</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-lg font-semibold text-green-600">✅ Correctas</p>
          <p class="text-3xl font-bold">{{ score }}</p>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-lg">
          <p class="text-lg font-semibold text-red-600">❌ Incorrectas</p>
          <p class="text-3xl font-bold">{{ incorrect }}</p>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-lg font-semibold text-blue-600">📊 Efectividad</p>
          <p class="text-3xl font-bold">{{ effectiveness }}%</p>
        </div>
      </div>
    </div>

    <!-- Detalle de Preguntas -->
    <div class="questions-detail">
      <h3 class="text-xl font-semibold mb-4 text-gray-700">Detalle de preguntas:</h3>
      
      <div v-for="(question, qIndex) in allQuestions" :key="qIndex" 
           class="question-card mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p class="font-medium mb-3 text-gray-800">{{ qIndex + 1 }}. {{ question.pregunta }}</p>
        
        <div class="options space-y-2">
          <div v-for="(option, oIndex) in question.opciones" :key="oIndex"
               :class="[
                 'option p-3 rounded-md border',
                 option.clave === question.respuesta_correcta ? 'bg-green-50 border-green-200' : '',
                 userAnswers[qIndex] === option.clave && userAnswers[qIndex] !== question.respuesta_correcta 
                   ? 'bg-red-50 border-red-200' : ''
               ]">
            <span class="font-medium">{{ String.fromCharCode(65 + oIndex) }})</span>
            <span class="ml-2">{{ option.texto }}</span>
            
            <span v-if="option.clave === question.respuesta_correcta" class="ml-2 text-green-600">
              ✓ Correcta
            </span>
            <span v-if="userAnswers[qIndex] === option.clave && userAnswers[qIndex] !== question.respuesta_correcta" 
                  class="ml-2 text-red-600">
              ✗ Tu elección
            </span>
          </div>
        </div>
      </div>
    </div>

    <button 
      @click="goHome"
      class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
    >
      Volver al inicio
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


const score = ref(0)
const incorrect = ref(0)
const total = ref(0)
const effectiveness = computed(() => ((score.value / total.value) * 100).toFixed(2))

// Almacenar todas las preguntas y respuestas del usuario
const allQuestions = ref([])
const userAnswers = ref([])

onMounted(() => {
  // parámetros de la URL
  score.value = parseInt(route.query.score || '0', 10)
  incorrect.value = parseInt(route.query.incorrect || '0', 10)
  total.value = parseInt(route.query.total || '0', 10)

  // datos del localStorage
  const quizData = JSON.parse(localStorage.getItem('quizData') || '{}')
  allQuestions.value = quizData.questions || []
  userAnswers.value = quizData.userAnswers || []
})

function goHome() {
  router.replace('/')
}
</script>

<style scoped>
.question-card {
  transition: all 0.3s ease;
}

.option {
  transition: background-color 0.2s ease;
}
</style>