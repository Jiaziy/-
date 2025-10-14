import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
import Detail from './views/Detail.vue'
import Search from './views/Search.vue'
import Collection from './views/Collection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
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
      path: '*',
      redirect: '/'
    }
  ]
})