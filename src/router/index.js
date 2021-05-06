// 引入Vue和VueRouter
import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用VueRouter
Vue.use(VueRouter)

// 创建路由规则
const routes = [
  {
    path: '/',
    redirect: '/book-store'
  },
  {
    path: '/ebook',
    name: 'Ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/book-store',
    name: 'BookStore',
    component: () => import('../views/store/index.vue'),
    children: [
      {
        path: '/book-store/home',
        component: () => import('../views/store/BookHome.vue'),
        meta: {key: 3}
      },
      {
        path: '/book-store/shelf',
        component: () => import('../views/store/BookShelf.vue'),
        meta: {key: 1}
      },
      {
        path: '/book-store/category',
        component: () => import('../views/store/BookCategory.vue'),
        meta: {key: 2}
      },
      {
        path: '/book-store/list',
        component: () => import('../views/store/BookList.vue'),
        meta: {key: 4}
      },
      {
        path: '/book-store/detail',
        component: () => import('../views/store/BookDetail.vue'),
        meta: {key: 5}
      },
      {
        path: '/book-store/book-speaking',
        component: () => import('../views/store/BookSpeaking.vue'),
        meta: {key: 6}
      }
    ]
  }
]

// 创建配置好routes规则的VueRouter实例对象
const router = new VueRouter({
  routes
})

// 导出路由
export default router
