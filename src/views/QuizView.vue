<!-- <template>
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
</script> -->

<!-- <template>
  <div class="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
    <div v-if="loading" class="text-center text-gray-600">Cargando preguntas…</div>
    <div v-else-if="error" class="text-center text-red-600 break-all">{{ error }}</div>

    <div v-else-if="questions.length > 0" class="text-left sm:text-center">
      
      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="truncate">
          <span class="font-medium">Sección:</span> {{ section }}
          <span class="mx-2">•</span>
          <span class="font-medium">Idioma:</span> {{ lang.toUpperCase() }}
        </div>
        <div>{{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>
      </div>

      
      <h2 class="text-xl sm:text-2xl font-normal sm:font-medium mb-4 sm:mb-6 text-gray-800">
        <span class="mr-2">{{ currentQuestionIndex + 1 }}.</span>
        <span v-html="renderedQuestion" class="whitespace-pre-wrap"></span>
      </h2>
      <div class="flex flex-col gap-3 sm:gap-4">
  <button
    v-for="(opcion, index) in shuffledOptions"
    :key="opcion.clave + '-' + index"
    :class="[
      'option text-left sm:text-center py-2 px-4 sm:py-3 sm:px-5 rounded-lg text-base sm:text-lg font-normal transition-colors duration-300 border',
      // Azul si es la seleccionada; neutro si no
      selectedAnswer === opcion.clave
        ? 'bg-blue-100 border-blue-300'
        : 'bg-white border-gray-300 hover:bg-gray-50'
    ]"
    @click="handleAnswer(opcion.clave)"
    :disabled="clickLock"         
    :aria-pressed="selectedAnswer === opcion.clave"
  >
    <span class="font-semibold mr-2">{{ index + 1 }})</span>
    <span class="whitespace-pre-wrap">{{ opcion.texto }}</span>
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado
const questions = ref([])
const currentQuestionIndex = ref(0)
const shuffledOptions = ref([])
const selectedAnswer = ref(null)
const userAnswers = ref([])
const loading = ref(false)
const error = ref(null)

// Etiquetas visibles (números). Si quieres letras, usa ['A','B','C','D','E'].
const optionLabels = ['1', '2', '3', '4', '5']

// Params de ruta (con fallback)
const section = computed(() => String(route.params.section || 'section1_computer_fundamentals'))
const lang = computed(() => String(route.params.lang || 'es'))

// Pregunta actual
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})

// Render de la pregunta con bloques ```code```
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
const renderedQuestion = computed(() => {
  const raw = String(currentQuestion.value?.pregunta || '')
  const escaped = escapeHtml(raw)
  return escaped.replace(/```([\s\S]*?)```/g, (_m, code) =>
    `<pre class="bg-gray-100 p-3 rounded overflow-auto text-sm"><code>${code}</code></pre>`
  )
})

// Utilidades
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function shuffleForCurrent() {
  if (!questions.value.length) return
  const opts = currentQuestion.value?.opciones || []
  shuffledOptions.value = shuffleArray(opts)
  selectedAnswer.value = null
}

function calcScore() {
  return questions.value.reduce((acc, q, i) => (
    acc + (userAnswers.value[i] === q.respuesta_correcta ? 1 : 0)
  ), 0)
}

// Manejo de respuesta (sin revelar correcto/incorrecto aquí)
function handleAnswer(selectedKey) {
  if (selectedAnswer.value !== null) return
  selectedAnswer.value = selectedKey
  userAnswers.value[currentQuestionIndex.value] = selectedKey

  // Pequeña pausa y avanza
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      shuffleForCurrent()
    } else {
      // Guarda resultados para ResultView
      const payload = {
        questions: questions.value,
        userAnswers: userAnswers.value,
        score: calcScore(),
        incorrect: questions.value.length - calcScore(),
        total: questions.value.length
      }
      localStorage.setItem('quizData', JSON.stringify(payload))

      router.push({
        name: 'result',
        query: { score: payload.score, incorrect: payload.incorrect, total: payload.total }
      })
    }
  }, 700)
}

// Carga con fetch (Vite: public/data)
async function loadQuestions() {
  loading.value = true
  error.value = null
  try {
    const base = import.meta.env.BASE_URL // "/" en dev; respeta subcarpeta en prod
    const url = `${base}data/${section.value}_${lang.value}.json`
    // console.log('FETCH URL ->', url)

    const res = await fetch(url)
    if (!res.ok) throw new Error(`No se pudo cargar: ${url} (${res.status})`)

    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('application/json')) {
      const text = await res.text()
      throw new Error(`Respuesta no JSON desde ${url}. Content-Type=${ct}. Inicio: ${text.slice(0,120)}`)
    }

    const data = await res.json()

    // Baraja preguntas; si quieres limitar (ej. 50), usa .slice(0, 50)
    const bank = Array.isArray(data) ? data : (data.questions || [])
    questions.value = shuffleArray(bank)

    // Inicializa estado
    userAnswers.value = new Array(questions.value.length).fill(null)
    currentQuestionIndex.value = 0
    shuffleForCurrent()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadQuestions)
// Si cambian sección/idioma, recarga
watch(() => route.fullPath, loadQuestions)
// Rebaraja opciones al cambiar de pregunta o banco
watch([currentQuestionIndex, questions], shuffleForCurrent)
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
 -->



 <template>
  <div class="max-w-xl mx-auto p-4 sm:p-6 md:p-8">
    <div v-if="loading" class="text-center text-gray-600">Cargando preguntas…</div>
    <div v-else-if="error" class="text-center text-red-600 break-all">{{ error }}</div>

    <div v-else-if="questions.length > 0" class="text-left sm:text-center">
      <!-- Encabezado / progreso + botón Terminar (solo sección) -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="truncate">
          <span class="font-medium">Sección:</span> {{ section }}
          <span class="mx-2">•</span>
          <span class="font-medium">Idioma:</span> {{ lang.toUpperCase() }}
          <span class="mx-2">•</span>
          <span class="font-medium">Modo:</span> {{ mode.toUpperCase() }}
        </div>

        <div class="flex items-center gap-2">
          <div>{{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>

          <!-- Terminar quiz (solo modo sección) -->
          <button
            v-if="mode === 'section'"
            type="button"
            class="ml-2 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="finishEarly"
          >
            Terminar quiz
          </button>
        </div>
      </div>

      <!-- Pregunta con soporte de bloques ```code``` -->
      <h2 class="text-xl sm:text-2xl font-normal sm:font-medium mb-4 sm:mb-6 text-gray-800">
        <span class="mr-2">{{ currentQuestionIndex + 1 }}.</span>
        <span v-html="renderedQuestion" class="whitespace-pre-wrap"></span>
      </h2>

      <!-- Opciones -->
      <div class="flex flex-col gap-3 sm:gap-4">
        <button
          v-for="(opcion, index) in shuffledOptions"
          :key="opcion.clave + '-' + index"
          :class="[
            'option text-left sm:text-center py-2 px-4 sm:py-3 sm:px-5 rounded-lg text-base sm:text-lg font-normal transition-colors duration-300 border',
            selectedAnswer === opcion.clave
              ? 'bg-blue-100 border-blue-300'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          ]"
          @click="handleAnswer(opcion.clave)"
          :disabled="selectedAnswer !== null"
          :aria-pressed="selectedAnswer === opcion.clave"
        >
          <span class="font-semibold mr-2">{{ index + 1 }})</span>
          <span class="whitespace-pre-wrap">{{ opcion.texto }}</span>
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/* =============================
   Estado
============================= */
const questions = ref([])
const currentQuestionIndex = ref(0)
const shuffledOptions = ref([])
const selectedAnswer = ref(null)
const userAnswers = ref([])
const loading = ref(false)
const error = ref(null)

/* =============================
   Parámetros de ruta y query
   - mode: 'section' | 'exam'
   - n: número de preguntas (solo 'section')
   - minCorrect: mínimo de respuestas correctas para aprobar (exam) (default 75)
============================= */
const section = computed(() => String(route.params.section || 'section1_computer_fundamentals'))
const lang = computed(() => String(route.params.lang || 'es'))
const mode = computed(() => String(route.query.mode || 'section'))

// En EXAM siempre 90; en SECTION usa n (default 25)
const EXAM_SIZE = 90
const limit = computed(() => mode.value === 'exam'
  ? EXAM_SIZE
  : Number(route.query.n || 25)
)
const minCorrect = computed(() => Number(route.query.minCorrect || 75))

/* =============================
   Constantes de data
============================= */
const SECTION_KEYS = [
  'section1_computer_fundamentals',
  'section2_infrastructure_development',
  'section3_data_collection',
  'section4_troubleshooting',
  'section5_data_visualization',
  'section6_mixed_review',
]

/* =============================
   Utilidades
============================= */
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
const renderedQuestion = computed(() => {
  const raw = String(currentQuestion.value?.pregunta || '')
  const escaped = escapeHtml(raw)
  return escaped.replace(/```([\s\S]*?)```/g, (_m, code) =>
    `<pre class="bg-gray-100 p-3 rounded overflow-auto text-sm"><code>${code}</code></pre>`
  )
})

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function sample(array, n) {
  return shuffle(array).slice(0, Math.min(n, array.length))
}

function shuffleForCurrent() {
  if (!questions.value.length) return
  const opts = currentQuestion.value?.opciones || []
  shuffledOptions.value = shuffle(opts)
  selectedAnswer.value = null
}

function calcScore() {
  return questions.value.reduce((acc, q, i) => (
    acc + (userAnswers.value[i] === q.respuesta_correcta ? 1 : 0)
  ), 0)
}

/* =============================
   Navegar a resultados
   - En exam: aprobado si score >= minCorrect (default 75)
   - En section: no aplica aprobado; mostramos finishedEarly si corresponde
============================= */
function goToResult({ finishedEarly = false } = {}) {
  const score = calcScore()
  const total = questions.value.length
  const percent = total ? Math.round((score / total) * 100) : 0
  const passed = mode.value === 'exam' ? (score >= minCorrect.value) : null

  const payload = {
    mode: mode.value,               // 'section' | 'exam'
    finishedEarly,                  // true si terminó antes (solo section)
    section: section.value,
    lang: lang.value,
    minCorrect: minCorrect.value,   // mínimo de correctas para aprobar (exam)
    questions: questions.value,
    userAnswers: userAnswers.value,
    score,
    incorrect: total - score,
    total,
    percent,
    passed
  }
  localStorage.setItem('quizData', JSON.stringify(payload))
  router.push({ name: 'result' })
}

/* =============================
   Handlers
============================= */
function finishEarly() {
  if (confirm('¿Seguro que deseas terminar el quiz y ver tus resultados?')) {
    goToResult({ finishedEarly: true })
  }
}

function handleAnswer(selectedKey) {
  if (selectedAnswer.value !== null) return
  selectedAnswer.value = selectedKey
  userAnswers.value[currentQuestionIndex.value] = selectedKey

  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      shuffleForCurrent()
    } else {
      goToResult()
    }
  }, 700)
}

/* =============================
   Fetch helpers
============================= */
async function fetchJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`No se pudo cargar: ${path} (${res.status})`)
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    const text = await res.text()
    throw new Error(`Respuesta no JSON desde ${path}. Content-Type=${ct}. Inicio: ${text.slice(0, 120)}`)
  }
  return res.json()
}

async function loadSectionBank(sectionKey, lng) {
  const base = import.meta.env.BASE_URL
  const url = `${base}data/${sectionKey}_${lng}.json`
  const data = await fetchJson(url)
  return Array.isArray(data) ? data : (data.questions || [])
}

/* =============================
   Carga de preguntas
   - SECTION: usa banco de la sección y samplea 'limit'
   - EXAM: carga full_mock_exam_<lang>.json y toma exactamente 90
   - Fallback EXAM: mezcla todas las secciones si no existe el archivo
============================= */
async function loadQuestions() {
  loading.value = true
  error.value = null
  try {
    const lng = lang.value
    const base = import.meta.env.BASE_URL

    if (mode.value === 'exam') {
      // EXAM: banco dedicado
      const examUrl = `${base}data/full_mock_exam_${lng}.json`
      const data = await fetchJson(examUrl)
      const bank = Array.isArray(data) ? data : (data.questions || [])
      if (!bank.length) throw new Error(`Banco de examen vacío: ${examUrl}`)
      // barajar y tomar exactamente 90
      questions.value = shuffle(bank).slice(0, EXAM_SIZE)

    } else {
      // SECTION: solo sección y límite elegido
      const bank = await loadSectionBank(section.value, lng)
      questions.value = sample(bank, limit.value)
    }

    // Inicializa estado
    userAnswers.value = new Array(questions.value.length).fill(null)
    currentQuestionIndex.value = 0
    shuffleForCurrent()
  } catch (e) {
    if (mode.value === 'exam') {
      // Fallback: mezcla todas las secciones
      try {
        const banks = await Promise.all(SECTION_KEYS.map(s => loadSectionBank(s, lang.value)))
        const all = banks.flat()
        if (!all.length) throw new Error('No hay bancos de secciones disponibles para fallback.')
        questions.value = sample(all, EXAM_SIZE)
        userAnswers.value = new Array(questions.value.length).fill(null)
        currentQuestionIndex.value = 0
        shuffleForCurrent()
        error.value = `Aviso: no se encontró full_mock_exam_${lang.value}.json; usando mezcla de secciones.`
      } catch (e2) {
        error.value = e.message
      }
    } else {
      error.value = e.message
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadQuestions)
// cambio de ruta (incluye attempt=Date.now()) → re-sample/recarga
watch(() => route.fullPath, loadQuestions)
// rebaraja opciones al cambiar de pregunta o banco
watch([currentQuestionIndex, questions], shuffleForCurrent)
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
