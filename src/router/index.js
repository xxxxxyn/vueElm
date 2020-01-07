import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [

    ]
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('../views/Discover'),
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/Order'),
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/Mine'),
  },
  {
    //地址页面不是谁的子路由，而是从首页进来，不属于首页
    path: '/address',
    name: 'address',
    component: () => import('../views/Address'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
