import { createRouter, createWebHistory } from 'vue-router'
import PKView from '@/views/pk/PKView.vue'
import NotFound from '@/views/error/NotFound.vue'
import RankView from '@/views/rank/RankView.vue'
import RecordView from '@/views/record/RecordView.vue'
import BotsView from '@/views/user/bots/BotsView.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import store from "@/store/index"

const routes = [
  {
    path: "/",
    name: "home", 
    redirect: "/pk/",
  },
  {
    path: "/pk/",
    name: "pk-index",
    component: PKView,
    meta: {
      requestAuthrization: true,
    }
  },
  {
    path: "/rank/",
    name: "rank-index",
    component: RankView,
    meta: {
      requestAuthrization: true,
    }
  },
  {
    path: "/record/",
    name: "record-index",
    component: RecordView,
    meta: {
      requestAuthrization: true,
    }
  },
  {
    path: "/user/bot/",
    name: "user-bot-index",
    component: BotsView,
    meta: {
      requestAuthrization: true,
    }
  },
  {
    path: "/user/account/login/",
    name: "user-account-login",
    component: UserAccountLoginView,
    meta: {
      requestAuthrization: false,
    }
  },
  {
    path: "/user/account/register/",
    name: "user-account-register",
    component: UserAccountRegisterView,
    meta: {
      requestAuthrization: false,
    }
  },
  {
    path: "/404/",
    name: "error-404",
    component: NotFound,
    meta: {
      requestAuthrization: false,
    }
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

router.beforeEach((to, from, next) => {
  if (to.meta.requestAuthrization && !store.state.user.isLogin) {
    store.state.user.lastPage.name = to.name;
    next({name: "user-account-login"});
  } else {
    next();
  }
});

export default router
