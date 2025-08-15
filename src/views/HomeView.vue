<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="mx-auto max-w-6xl">
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Selecciona un Pack de Estudio</h1>

        <div class="flex items-center gap-3">
          <label class="font-medium text-gray-700">Idioma:</label>
          <select v-model="lang" class="border rounded-lg px-2 py-1 text-sm bg-white">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section v-for="cert in CERTS" :key="cert.key" class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col">
          <div class="flex items-center gap-4 mb-4">
            <img :src="cert.img" :alt="cert.title[lang]" class="w-14 h-14 object-contain" />
            <div>
              <h2 class="text-lg font-semibold text-gray-800">{{ cert.title[lang] }}</h2>
              <p class="text-xs text-gray-500" v-if="cert.subtitle">{{ cert.subtitle[lang] }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-1">
           
            <div class="border rounded-xl p-4 hover:shadow-md transition bg-white">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ t('practice_title') }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ t('practice_desc') }}</p>
                </div>
                <span class="text-xs rounded-full px-2 py-1 bg-indigo-50 text-indigo-700 whitespace-nowrap">
                  {{ cert.sections.length }} {{ t('sections') }}
                </span>
              </div>

              <div class="mt-3 space-y-3">
                <select v-model="selectedSection[cert.key]" class="border rounded-md px-2 py-1 text-sm bg-white w-full">
                  <option disabled :value="null">{{ t('select_section') }}</option>
                  <option v-for="s in cert.sections" :key="s.fileBase" :value="s.fileBase">
                    {{ s.title[lang] }}
                  </option>
                </select>

                <button
                  class="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  :disabled="!selectedSection[cert.key]"
                  @click="loadPractice(cert, selectedSection[cert.key])"
                >
                  {{ t('start_practice') }}
                </button>

                <!-- “Ver cuestionarios” se queda comentado por ahora -->
                <!--
                <button
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  :disabled="!selectedSection[cert.key]"
                  @click="loadSectionQuizzes(cert, selectedSection[cert.key])"
                >
                  {{ t('view_quizzes') }}
                </button>
                -->
              </div>
            </div>
            
            <div class="border rounded-xl p-4 hover:shadow-md transition bg-white">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ t('exam_title', { name: cert.short[lang] }) }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ t('exam_desc', { count: cert.examQuestions }) }}</p>
                </div>
                <span class="text-xs rounded-full px-2 py-1 bg-emerald-50 text-emerald-700">
                  {{ cert.examQuestions }} {{ t('questions') }}
                </span>
              </div>

              <div class="mt-3">
                <button class="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" @click="loadMockExam(cert)">
                  {{ t('start_mock') }}
                </button>
              
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lang = ref('es')

// i18n (sin la clave 'shuffle')
const I18N = {
  es: {
    practice_title: 'Práctica por sección',
    practice_desc: 'Elige una sección del temario para practicar con sus cuestionarios.',
    select_section: 'Selecciona una sección…',
    start_practice: 'Practicar',
    view_quizzes: 'Ver cuestionarios',
    exam_title: 'Simulación examen: {name}',
    exam_desc: 'Examen completo de {count} preguntas (tiempo y puntuación simulados).',
    start_mock: 'Iniciar simulación',
    sections: 'secciones',
    questions: 'preguntas',
  },
  en: {
    practice_title: 'Practice by section',
    practice_desc: 'Pick a guide section to practice with its quizzes.',
    select_section: 'Select a section…',
    start_practice: 'Practice',
    view_quizzes: 'View quizzes',
    exam_title: 'Mock exam: {name}',
    exam_desc: 'Full exam with {count} questions (timed & scored).',
    start_mock: 'Start mock',
    sections: 'sections',
    questions: 'questions',
  },
}
function t(key, vars = {}) {
  const str = I18N[lang.value][key] || key
  return str.replace(/\{(.*?)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

// Config (fileBase = nombre JSON sin _<lang>.json)
const CERTS = [
  {
    key: 'fundamentals',
    short: { es: 'Fundamentals', en: 'Fundamentals' },
    title: { es: 'Datadog Fundamentals', en: 'Datadog Fundamentals' },
    subtitle: { es: 'Guía en 6 secciones', en: '6-section guide' },
    img: '../src/assets/images/datadog.png',
    examQuestions: 90,
    examBase: 'exam_fundamentals',
    sections: [
      { fileBase: 'section1_computer_fundamentals',      title: { es: 'Sección 1: Fundamentos de Computación', en: 'Section 1: Computer Fundamentals' } },
      { fileBase: 'section2_infrastructure_development', title: { es: 'Sección 2: Infraestructura y Desarrollo', en: 'Section 2: Infrastructure Development' } },
      { fileBase: 'section3_data_collection',            title: { es: 'Sección 3: Recolección de Datos', en: 'Section 3: Data Collection' } },
      { fileBase: 'section4_metrics_logs_traces',        title: { es: 'Sección 4: Métricas/Logs/Traces', en: 'Section 4: Metrics/Logs/Traces' } },
      { fileBase: 'section5_monitors_dashboards',        title: { es: 'Sección 5: Monitores y Tableros', en: 'Section 5: Monitors & Dashboards' } },
      { fileBase: 'section6_best_practices',             title: { es: 'Sección 6: Buenas prácticas', en: 'Section 6: Best Practices' } },
    ],
  },
  {
    key: 'logs',
    short: { es: 'Logs', en: 'Logs' },
    title: { es: 'Datadog Log Management', en: 'Datadog Log Management' },
    subtitle: { es: '7 áreas', en: '7 areas' },
    img: '../src/assets/images/datadog.png',
    examQuestions: 90,
    examBase: 'exam_logs',
    sections: [
      { fileBase: 'section1_logging_fundamentals',       title: { es: 'Logging Fundamentals', en: 'Logging Fundamentals' } },
      { fileBase: 'section2_log_collection',             title: { es: 'Log Collection', en: 'Log Collection' } },
      { fileBase: 'section3_log_parsing',                title: { es: 'Log Parsing', en: 'Log Parsing' } },
      { fileBase: 'section4_log_searching_filtering',    title: { es: 'Log Searching & Filtering', en: 'Log Searching & Filtering' } },
      { fileBase: 'section5_log_analysis',               title: { es: 'Log Analysis', en: 'Log Analysis' } },
      { fileBase: 'section6_log_utilization',            title: { es: 'Log Utilization', en: 'Log Utilization' } },
      { fileBase: 'section7_log_troubleshooting',        title: { es: 'Log Troubleshooting', en: 'Log Troubleshooting' } },
    ],
  },
  {
    key: 'apm',
    short: { es: 'APM', en: 'APM' },
    title: { es: 'Datadog APM & Tracing', en: 'Datadog APM & Tracing' },
    subtitle: { es: '4 áreas principales', en: '4 main topics' },
    img: '../images/datadog.png',
    examQuestions: 90,
    examBase: 'exam_apm',
    sections: [
      { fileBase: 'section1_apm_fundamentals',           title: { es: 'APM Fundamentals', en: 'APM Fundamentals' } },
      { fileBase: 'section2_application_instrumentation',title: { es: 'Application Instrumentation', en: 'Application Instrumentation' } },
      { fileBase: 'section3_insight_discovery',          title: { es: 'Insight Discovery', en: 'Insight Discovery' } },
      { fileBase: 'section4_apm_troubleshooting',        title: { es: 'Troubleshooting Application using APM', en: 'Troubleshooting Application using APM' } },
    ],
  },
]

const selectedSection = reactive(Object.fromEntries(CERTS.map(c => [c.key, null])))

// helpers a /public/data (con BASE_URL)
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
const fromPublic = (p) => `${BASE}${p.startsWith('/') ? '' : '/'}${p}`
const srcFor  = (fileBase, lng)  => fromPublic(`data/${fileBase}_${lng}.json`)
const examFor = (examBase, lng)  => fromPublic(`data/${examBase}_${lng}.json`)

async function ensureAvailable(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`No se encontró: ${url}`)
}

// === Navegación ===
async function loadPractice(cert, fileBase) {
  try {
    const src = srcFor(fileBase, lang.value)
    await ensureAvailable(src)
    router.push({
      path: `/quiz/${fileBase}/${lang.value}`,
      query: { src, title: cert.title[lang.value] }
    })
  } catch (e) { alert(e.message) }
}

// “Ver cuestionarios” lo dejamos comentado por si vuelve después
// async function loadSectionQuizzes(cert, fileBase) { ... }

async function loadMockExam(cert) {
  try {
    const examSrc = examFor(cert.examBase, lang.value)
    // ahora es obligatorio que exista el JSON de examen
    await ensureAvailable(examSrc)

    router.push({
      path: `/quiz/full_mock_exam/${lang.value}`,
      query: {
        src: examSrc,
        q: cert.examQuestions,
        title: `Mock: ${cert.short[lang.value]}`
      }
    })
  } catch (e) { alert(e.message) }
}
</script>







