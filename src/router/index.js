import Vue from 'vue'
import Router from 'vue-router'
//  import Hello from '@/components/Hello'
import Update from '@/components/Update'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Main from '@/views/Main'
import MainCus from '@/views/MainCus'
import Printers from '@/views/Printers'
import NewOrder from '@/views/order/NewOrder'
import PrintedOrder from '@/views/order/PrintedOrder'
import CusPrintedOrder from '@/views/order/cusPrintedOrder'
import OtherFn from '@/views/otherFn/OtherFn'
import HistoryOrder from '@/views/order/historyOrder'
import BuffetMode from '@/views/mainCusPage/BuffetMode'
import Test from '@/views/test'
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
        meta: {
          title: '其他功能'
        },
        component: OtherFn
      }, {
        path: 'printers',
        name: 'Printers',
        component: Printers
      }, {
        path: 'newOrder',
        name: 'NewOrder',
        meta: {
          title: '新订单'
        },
        component: NewOrder
      }, {
        path: 'printedOrder',
        name: 'PrintedOrder',
        meta: {
          title: '已打印订单'
        },
        component: PrintedOrder
      }, {
        path: 'historyOrder',
        name: 'HistoryOrder',
        meta: {
          title: '历史订单'
        },
        component: HistoryOrder
      }, {
        path: 'test',
        name: 'Test',
        meta: {
          title: '测试'
        },
        component: Test
      }, {
        path: 'buffetMode',
        name: 'BuffetMode',
        meta: {
          title: '点餐模式'
        },
        component: BuffetMode
      }]
    },
    {
      path: '/mainCus',
      name: 'MainCus',
      component: MainCus,
      children: [{
        path: 'buffetMode',
        name: 'CusBuffetMode',
        meta: {
          title: '点餐模式'
        },
        component: BuffetMode
      }, {
        path: 'printedOrder',
        name: 'CusPrintedOrder',
        meta: {
          title: '已打印订单'
        },
        component: CusPrintedOrder
      }, {
        path: 'historyOrder',
        name: 'CusHistoryOrder',
        meta: {
          title: '历史订单'
        },
        component: HistoryOrder
      }, {
        path: 'otherFn',
        name: 'CusOtherFn',
        meta: {
          title: '其他功能'
        },
        component: OtherFn
      }, {
        path: 'printers',
        name: 'Printers',
        component: Printers
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
    }
    // {
    //   path: '/otherFn',
    //   name: 'OtherFn',
    //   component: OtherFn
    // }
  ]
})
