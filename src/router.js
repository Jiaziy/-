import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
import Detail from './views/Detail.vue'
import Search from './views/Search.vue'
import Collection from './views/Collection.vue'
import Interactive from './views/Interactive.vue'
import SupabaseTest from './views/SupabaseTest.vue'
import CheckDatabase from './views/CheckDatabase.vue'

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
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router