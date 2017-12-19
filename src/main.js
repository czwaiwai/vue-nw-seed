// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import qs from 'qs'
import App from './App'
import store from './store'
import ElementUI from 'element-ui'
import { webUrl } from './utils/env'
import filter from './filter/'
import axios from 'axios'
import router from './router'
import './assets/css/main.scss'
import 'element-ui/lib/theme-chalk/index.css'
filter(Vue)
Vue.use(ElementUI)
Vue.config.productionTip = false
axios.defaults.baseURL = webUrl
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = [function (data) {
  console.log('data', data)
  return qs.stringify(data)
}]
let isFirst = true
axios.interceptors.request.use(function (config) {
  //  在发送请求之前做某事
  if (isFirst) {
    isFirst = false
    config.data.appCfg = 1
    console.log('configData', config.data)
    console.log('config', config)
  }
  return config
}, function (error) {
  //  请求错误时做些事
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response)
  if (response.data) {
    let { cfgInfo, data } = response.data
    let userInfo = null
    if (cfgInfo) {
      userInfo = cfgInfo.UserInfo
    }
    if (data && data.UserInfo) {
      userInfo = data.UserInfo
    }
    if (userInfo) {
      store.commit('setUser', userInfo)
    }
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.http = axios

Vue.config.errorHandler = (function () {
  let i = 0
  return function (err, vm) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err.message, '\n', err.stack)
    } else {
      if (i < 1) {
        i++
        Vue.http.post('/feeback/save', {title: '前端js异常', content: '' + err.message + '路由地址：' + location.href + '\n\r' + err.stack}).then(() => {
          i = 0
        })
      }
    }
  }
})()
// for auto update
import { checkUpdate } from '@/utils/update.js'
checkUpdate()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
