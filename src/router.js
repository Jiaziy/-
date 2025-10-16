import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
import Detail from './views/Detail.vue'
import Search from './views/Search.vue'
import Collection from './views/Collection.vue'
import Interactive from './views/Interactive.vue'
import SupabaseTest from './views/SupabaseTest.vue'
import CheckDatabase from './views/CheckDatabase.vue'
import Profile from './views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/list',
    name: 'list',
    component: List
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: Detail,
    props: true
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: (route) => ({ query: route.query.q })
  },
  {
    path: '/collection',
    name: 'collection',
    component: Collection
  },
  {
    path: '/interactive',
    name: 'interactive',
    component: Interactive
  },
  {
    path: '/supabase-test',
    name: 'supabase-test',
    component: SupabaseTest
  },
  {
    path: '/check-database',
    name: 'check-database',
    component: CheckDatabase
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 这里可以添加认证检查逻辑
    // 暂时直接放行，后续可以集成auth store
    next()
  } else {
    next()
  }
})

export default router