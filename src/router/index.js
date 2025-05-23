import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import QuizView from '@/views/QuizView.vue'
import ResultView from '@/views/ResultView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/quiz', component: QuizView },
  { path: '/result', component: ResultView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
