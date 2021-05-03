// 引入Vue和VueRouter
import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用VueRouter
Vue.use(VueRouter)

// 创建路由规则
const routes = [
  {
    path: '/',
    redirect: '/ebook'
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
  }
]

// 创建配置好routes规则的VueRouter实例对象
const router = new VueRouter({
  routes
})

// 导出路由
export default router
