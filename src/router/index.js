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
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../views/login/login'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = window.sessionStorage.getItem('token')
  if (to.path.startsWith('/login')) {
    if (user !== 'null' && user != null) {
      next({name: 'question'})
    } else {
      next()
    }
  } else {
    if (user === 'null' || user == null) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
