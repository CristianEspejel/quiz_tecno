<template>
  <div class="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
    <div v-if="questions.length > 0" class="text-left sm:text-center">
      <h2 class="text-xl sm:text-2xl font-normal sm:font-medium mb-4 sm:mb-6 text-gray-800">
        {{ currentQuestionIndex + 1 }}. {{ currentQuestion.pregunta }}
      </h2>

      <div class="flex flex-col gap-3 sm:gap-4">
        <button
          v-for="(opcion, index) in shuffledOptions"
          :key="opcion.clave"
          :class="[
            'option text-left sm:text-center py-2 px-4 sm:py-3 sm:px-5 rounded-lg',
            'text-base sm:text-lg font-normal transition-colors duration-300 border',
            selectedAnswer === opcion.clave 
              ? 'bg-blue-100 border-blue-300' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          ]"
          @click="handleAnswer(opcion.clave)"
          :disabled="selectedAnswer !== null"
        >
          {{ optionLabels[index] }}) {{ opcion.texto }}
        </button>
      </div>

      <p class="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
        Pregunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import preguntas from '@/data/preguntas.json'

const router = useRouter()

const questions = ref([])
const currentQuestionIndex = ref(0)
const shuffledOptions = ref([])
const score = ref(0)
const incorrectCount = ref(0)
const selectedAnswer = ref(null)
const optionLabels = ['A', 'B', 'C', 'D', 'E']
const userAnswers = ref([])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

onMounted(() => {
  const shuffled = shuffleArray(preguntas).slice(0, 50)
  questions.value = shuffled
  currentQuestionIndex.value = 0
  score.value = 0
  incorrectCount.value = 0
  selectedAnswer.value = null
  userAnswers.value = new Array(50).fill(null)
})

watch([currentQuestionIndex, questions], () => {
  if (questions.value.length > 0) {
    shuffledOptions.value = shuffleArray(currentQuestion.value.opciones)
    selectedAnswer.value = null
  }
})

function handleAnswer(selectedKey) {
  selectedAnswer.value = selectedKey
  userAnswers.value[currentQuestionIndex.value] = selectedKey
  
  const isCorrect = selectedKey === currentQuestion.value.respuesta_correcta
  if (isCorrect) {
    score.value++
  } else {
    incorrectCount.value++
  }

  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      localStorage.setItem('quizData', JSON.stringify({
        questions: questions.value,
        userAnswers: userAnswers.value,
        score: score.value,
        incorrect: incorrectCount.value,
        total: questions.value.length
      }))
      
      router.push({
        path: '/result',
        query: {
          score: score.value,
          incorrect: incorrectCount.value,
          total: questions.value.length,
        },
      })
    }
  }, 1500)
}
</script>

<style scoped>
.option {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.option:disabled {
  cursor: not-allowed;
  opacity: 1;
}
</style>