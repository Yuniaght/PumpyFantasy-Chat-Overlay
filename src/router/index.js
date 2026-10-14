import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/pages/ChatView.vue'
import ConfigView from '@/pages/ConfigView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {path: "/", component: ConfigView},
  {path: "/chat", component: ChatView}
  ],
  history: createWebHistory(),
})

export default router
