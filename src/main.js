// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './strore/store.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(iView)
axios.defaults.baseURL = 'http://192.168.31.223:8888'
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
})
