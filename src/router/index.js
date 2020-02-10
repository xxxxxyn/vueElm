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
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('../views/ShopMenu'),
    children: [
      {
        path: '/shop',
        name: 'orderMenu',
        component: () => import('../components/shop/OrderMenu'),
      },
      {

        path: '/shop/comments',
        name: 'comments',
        component: () => import('../components/shop/Comments'),
      },
      {

        path: '/shop/shopDetail',
        name: 'shopDetail',
        component: () => import('../components/shop/ShopDetail'),
      },

    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
