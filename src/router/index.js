import { createRouter, createWebHashHistory } from 'vue-router'
import ChatView from '@/pages/ChatView.vue'
import ConfigView from '@/pages/ConfigView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
  {path: "/", component: ConfigView},
  {path: "/chat", component: ChatView}
  ]
})

export default router
