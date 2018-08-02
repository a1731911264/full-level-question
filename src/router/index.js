import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../views/index'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/question',
      component: resolve => require(['../views/index.vue'], resolve),
      children: [
        {path: 'upload', name: 'upload', meta: {'keepAlive': true, title: '首页'}, component: resolve => require(['../views/upload/upload'], resolve)},
        {path: '/question', name: 'question', meta: {'keepAlive': true, title: '首页'}, component: resolve => require(['../views/question/index'], resolve)}
      ]
    }
  ]
})

export default router
