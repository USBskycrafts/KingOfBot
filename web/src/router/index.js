import { createRouter, createWebHistory } from 'vue-router'
import PKView from '@/views/pk/PKView.vue'
import NotFound from '@/views/error/NotFound.vue'
import RankView from '@/views/rank/RankView.vue'
import RecordView from '@/views/record/RecordView.vue'
import BotsView from '@/views/user/bots/BotsView.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'


const routes = [
  {
    path: "/",
    name: "home", 
    redirect: "/pk/"
  },
  {
    path: "/pk/",
    name: "pk-index",
    component: PKView
  },
  {
    path: "/rank/",
    name: "rank-index",
    component: RankView
  },
  {
    path: "/record/",
    name: "record-index",
    component: RecordView
  },
  {
    path: "/user/bot/",
    name: "user-bot-index",
    component: BotsView
  },
  {
    path: "/user/account/login/",
    name: "user-account-login",
    component: UserAccountLoginView
  },
  {
    path: "/user/account/register/",
    name: "user-account-register",
    component: UserAccountRegisterView
  },
  {
    path: "/404/",
    name: "error-404",
    component: NotFound
  },
  {
    path: "/:catchall(.*)",
    name: "404",
    redirect: "/404/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
