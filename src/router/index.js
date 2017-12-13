import Vue from 'vue'
import Router from 'vue-router'
//  import Hello from '@/components/Hello'
import Update from '@/components/Update'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Main from '@/views/Main'
import Printers from '@/views/Printers'
import OtherFn from '@/views/otherFn/OtherFn'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [{
        path: 'otherFn',
        name: 'OtherFn',
        component: OtherFn
      }]
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/update',
      name: 'Update',
      component: Update
    },
    {
      path: '/printers',
      name: 'Printers',
      component: Printers
    }
    // {
    //   path: '/otherFn',
    //   name: 'OtherFn',
    //   component: OtherFn
    // }
  ]
})
