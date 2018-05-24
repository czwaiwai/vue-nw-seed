import Vue from 'vue'
import Router from 'vue-router'
//  import Hello from '@/components/Hello'
import Update from '@/components/Update'
import Login from '@/views/Login'
import Index from '@/views/index'
import Home from '@/views/Home'
import Main from '@/views/Main'
import MainCus from '@/views/MainCus'
// 书店
import MainBook from '@/views/MainBook'
import BookAssistantOpLog from '@/views/bookPages/bookAssistantOpLog'
import BuyBookOrder from '@/views/bookPages/buyBookOrder'
import BookStockList from '@/views/bookPages/bookStockList'
import BookPosition from '@/views/bookPages/bookPosition'
import AssBorrowCount from '@/views/bookPages/assBorrowCount'
import BookShopBorrowCount from '@/views/bookPages/bookShopBorrowCount'

// 商城
import MainMall from '@/views/MainMall'
import AssistantOpLog from '@/views/MallPages/assistantOpLog'
import YcFczOrder from '@/views/MallPages/ycFczOrder'
import CountShoppingBag from '@/views/MallPages/countShoppingBag'
import ScanClerk from '@/views/MallPages/scanClerk'

// 电子发票
import Invoice from '@/views/invoicePages/invoice'
import InvoiceWrap from '@/views/invoicePages/invoiceWrap'
import RedInvoice from '@/views/invoicePages/redInvoice'
import InvoiceList from '@/views/invoicePages/InvoiceList'
import NewOrder from '@/views/order/NewOrder'
import PrintedOrder from '@/views/order/PrintedOrder'
import CusPrintedOrder from '@/views/order/cusPrintedOrder'
import OtherFn from '@/views/otherFn/OtherFn'
import HistoryOrder from '@/views/order/historyOrder'
import BuffetMode from '@/views/mainCusPage/BuffetMode'
import Test from '@/views/test'

// 自由购
import FreeGo from '@/views/freeGo/index'
import FreeNewOrder from '@/views/freeGo/newOrder'
import FreeDayOrder from '@/views/freeGo/dayOrder'
import FreeHistoryOrder from '@/views/freeGo/historyOrder'
// 机场同步
import PlaneSync from '@/views/planeSync/index'

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
      path: '/login', // 登录界面
      name: 'Login',
      component: Login
    },
    {
      path: '/index', // 主用户界面
      name: 'Index',
      component: Index,
      children: [{
        path: 'main',  //  订餐模式
        name: 'Main',
        component: Main,
        meta: {
          title: '餐饮订餐'
        },
        children: [{
          path: 'otherFn',
          name: 'OtherFn',
          meta: {
            title: '其他功能'
          },
          component: OtherFn
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
        }, {
          path: 'invoice',
          name: 'Invoice',
          meta: {
            title: '电子发票开具'
          },
          component: Invoice
        }, {
          path: 'redInvoice',
          name: 'RedInvoice',
          props: (route) => ({invoiceCode: route.query.invoiceCode, invoiceNo: route.query.invoiceNo}),
          meta: {
            title: '电子发票红冲'
          },
          component: RedInvoice
        }, {
          path: 'invoiceList',
          name: 'InvoiceList',
          meta: {
            title: '电子发票列表'
          },
          component: InvoiceList
        }, {
          path: 'scanClerk',
          name: 'ScanClerk',
          meta: {
            title: '飞常赞用户收款'
          },
          component: ScanClerk
        }, {
          path: 'planeSync',
          name: 'PlaneSync',
          meta: {
            title: '机场数据同步'
          },
          component: PlaneSync
        }]
      }, {
        path: 'mainCus', // 点餐模式
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
          path: 'invoice',
          name: 'Invoice',
          meta: {
            title: '电子发票开具'
          },
          component: Invoice
        }, {
          path: 'redInvoice',
          name: 'RedInvoice',
          props: (route) => ({invoiceCode: route.query.invoiceCode, invoiceNo: route.query.invoiceNo}),
          meta: {
            title: '电子发票红冲'
          },
          component: RedInvoice
        }, {
          path: 'invoiceList',
          name: 'InvoiceList',
          meta: {
            title: '电子发票列表'
          },
          component: InvoiceList
        }, {
          path: 'scanClerk',
          name: 'ScanClerk',
          meta: {
            title: '飞常赞用户收款'
          },
          component: ScanClerk
        }, {
          path: 'planeSync',
          name: 'PlaneSync',
          meta: {
            title: '机场数据同步'
          },
          component: PlaneSync
        }]
      }, {
        path: 'mainBook',  // 书店管理
        name: 'MainBook',
        component: MainBook,
        children: [{
          path: 'bookAssistantOpLogType1',
          name: 'BookAssistantOpLogType1',
          meta: {
            title: '逸臣门店借书操作记录'
          },
          props: {type: 1},
          component: BookAssistantOpLog
        }, {
          path: 'bookAssistantOpLogType2',
          name: 'BookAssistantOpLogType2',
          meta: {
            title: '逸臣门店还书操作记录'
          },
          props: {type: 2},
          component: BookAssistantOpLog
        }, {
          path: 'buyBookOrder',
          name: 'BuyBookOrder',
          meta: {
            title: '逸臣门店租书订单'
          },
          component: BuyBookOrder
        }, {
          path: 'bookStockList',
          name: 'BookStockList',
          meta: {
            title: '逸臣门店图书库存'
          },
          component: BookStockList
        }, {
          path: 'bookPosition',
          name: 'BookPosition',
          meta: {
            title: '逸臣门店图书跟踪'
          },
          component: BookPosition
        }, {
          path: 'assBorrowCount',
          name: 'AssBorrowCount',
          meta: {
            title: '店员租书情况'
          },
          component: AssBorrowCount
        }, {
          path: 'bookShopBorrowCount',
          name: 'BookShopBorrowCount',
          meta: {
            title: '书店租书情况'
          },
          component: BookShopBorrowCount
        }, {
          path: 'invoice',
          name: 'Invoice',
          meta: {
            title: '电子发票开具'
          },
          component: Invoice
        }, {
          path: 'redInvoice',
          name: 'RedInvoice',
          meta: {
            title: '电子发票红冲'
          },
          component: RedInvoice
        }, {
          path: 'invoiceList',
          name: 'InvoiceList',
          meta: {
            title: '电子发票列表'
          },
          component: InvoiceList
        }, {
          path: 'scanClerk',
          name: 'ScanClerk',
          meta: {
            title: '飞常赞用户收款'
          },
          component: ScanClerk
        }, {
          path: 'planeSync',
          name: 'PlaneSync',
          meta: {
            title: '机场数据同步'
          },
          component: PlaneSync
        }]
      }, {
        path: 'mainMall', // 零售管理
        name: 'MainMall',
        component: MainMall,
        children: [{
          path: 'assistantOpLog',
          name: 'AssistantOpLog',
          meta: {
            title: '逸臣门店支付核消记录'
          },
          component: AssistantOpLog
        }, {
          path: 'ycFczOrder',
          name: 'YcFczOrder',
          meta: {
            title: '订单支付记录'
          },
          component: YcFczOrder
        }, {
          path: 'countShoppingBag',
          name: 'CountShoppingBag',
          meta: {
            title: '购物袋赠送统计'
          },
          component: CountShoppingBag
        }, {
          path: 'invoice',
          name: 'Invoice',
          meta: {
            title: '电子发票开具'
          },
          component: Invoice
        }, {
          path: 'redInvoice',
          name: 'RedInvoice',
          meta: {
            title: '电子发票红冲'
          },
          component: RedInvoice
        }, {
          path: 'invoiceList',
          name: 'InvoiceList',
          meta: {
            title: '电子发票列表'
          },
          component: InvoiceList
        }, {
          path: 'scanClerk',
          name: 'ScanClerk',
          meta: {
            title: '飞常赞用户收款'
          },
          component: ScanClerk
        }, {
          path: 'freeGo',
          name: 'FreeGo',
          meta: {
            title: '自助购订单'
          },
          component: FreeGo,
          children: [{
            path: 'freeNewOrder',
            name: 'FreeNewOrder',
            meta: {
              title: '自助购订单'
            },
            component: FreeNewOrder
          }, {
            path: 'freeDayOrder',
            name: 'FreeDayOrder',
            meta: {
              title: '自助购订单'
            },
            component: FreeDayOrder
          }, {
            path: 'freeHistoryOrder',
            name: 'FreeHistoryOrder',
            meta: {
              title: '自助购订单'
            },
            component: FreeHistoryOrder
          }]
        }, {
          path: 'planeSync',
          name: 'PlaneSync',
          meta: {
            title: '机场数据同步'
          },
          component: PlaneSync
        }]
      }, {
        path: 'freeGo', // 自助购
        name: 'FreeGo',
        meta: {
          title: '自助购订单'
        },
        component: FreeGo,
        children: [{
          path: 'freeNewOrder',
          name: 'FreeNewOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeNewOrder
        }, {
          path: 'freeDayOrder',
          name: 'FreeDayOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeDayOrder
        }, {
          path: 'freeHistoryOrder',
          name: 'FreeHistoryOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeHistoryOrder
        }]
      }, {
        path: 'scanClerk',
        name: 'ScanClerk',
        meta: {
          title: '飞常赞用户收款'
        },
        component: ScanClerk
      }, { // 机场数据同步
        path: 'planeSync',
        name: 'PlaneSync',
        component: PlaneSync,
        meta: {
          title: '机场数据同步'
        }
      }, {
        path: 'invoiceWrap',
        name: 'InvoiceWrap',
        meta: {
          title: '电子发票'
        },
        component: InvoiceWrap,
        children: [{
          path: 'invoice',
          name: 'Invoice',
          meta: {
            title: '电子发票开具'
          },
          component: Invoice
        }, {
          path: 'redInvoice',
          name: 'RedInvoice',
          meta: {
            title: '电子发票红冲'
          },
          component: RedInvoice
        }, {
          path: 'invoiceList',
          name: 'InvoiceList',
          meta: {
            title: '电子发票列表'
          },
          component: InvoiceList
        }]
      }]
    },
    // --------------------------------------------------------
    // --------------------------------------------------------
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
      }, {
        path: 'invoice',
        name: 'Invoice',
        meta: {
          title: '电子发票开具'
        },
        component: Invoice
      }, {
        path: 'redInvoice',
        name: 'RedInvoice',
        props: (route) => ({invoiceCode: route.query.invoiceCode, invoiceNo: route.query.invoiceNo}),
        meta: {
          title: '电子发票红冲'
        },
        component: RedInvoice
      }, {
        path: 'invoiceList',
        name: 'InvoiceList',
        meta: {
          title: '电子发票列表'
        },
        component: InvoiceList
      }, {
        path: 'scanClerk',
        name: 'ScanClerk',
        meta: {
          title: '飞常赞用户收款'
        },
        component: ScanClerk
      }, {
        path: 'planeSync',
        name: 'PlaneSync',
        meta: {
          title: '机场数据同步'
        },
        component: PlaneSync
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
        path: 'invoice',
        name: 'Invoice',
        meta: {
          title: '电子发票开具'
        },
        component: Invoice
      }, {
        path: 'redInvoice',
        name: 'RedInvoice',
        props: (route) => ({invoiceCode: route.query.invoiceCode, invoiceNo: route.query.invoiceNo}),
        meta: {
          title: '电子发票红冲'
        },
        component: RedInvoice
      }, {
        path: 'invoiceList',
        name: 'InvoiceList',
        meta: {
          title: '电子发票列表'
        },
        component: InvoiceList
      }, {
        path: 'scanClerk',
        name: 'ScanClerk',
        meta: {
          title: '飞常赞用户收款'
        },
        component: ScanClerk
      }, {
        path: 'planeSync',
        name: 'PlaneSync',
        meta: {
          title: '机场数据同步'
        },
        component: PlaneSync
      }]
    },
    {
      path: '/mainBook',
      name: 'MainBook',
      component: MainBook,
      children: [{
        path: 'bookAssistantOpLogType1',
        name: 'BookAssistantOpLogType1',
        meta: {
          title: '逸臣门店借书操作记录'
        },
        props: {type: 1},
        component: BookAssistantOpLog
      }, {
        path: 'bookAssistantOpLogType2',
        name: 'BookAssistantOpLogType2',
        meta: {
          title: '逸臣门店还书操作记录'
        },
        props: {type: 2},
        component: BookAssistantOpLog
      }, {
        path: 'buyBookOrder',
        name: 'BuyBookOrder',
        meta: {
          title: '逸臣门店租书订单'
        },
        component: BuyBookOrder
      }, {
        path: 'bookStockList',
        name: 'BookStockList',
        meta: {
          title: '逸臣门店图书库存'
        },
        component: BookStockList
      }, {
        path: 'bookPosition',
        name: 'BookPosition',
        meta: {
          title: '逸臣门店图书跟踪'
        },
        component: BookPosition
      }, {
        path: 'assBorrowCount',
        name: 'AssBorrowCount',
        meta: {
          title: '店员租书情况'
        },
        component: AssBorrowCount
      }, {
        path: 'bookShopBorrowCount',
        name: 'BookShopBorrowCount',
        meta: {
          title: '书店租书情况'
        },
        component: BookShopBorrowCount
      }, {
        path: 'invoice',
        name: 'Invoice',
        meta: {
          title: '电子发票开具'
        },
        component: Invoice
      }, {
        path: 'redInvoice',
        name: 'RedInvoice',
        meta: {
          title: '电子发票红冲'
        },
        component: RedInvoice
      }, {
        path: 'invoiceList',
        name: 'InvoiceList',
        meta: {
          title: '电子发票列表'
        },
        component: InvoiceList
      }, {
        path: 'scanClerk',
        name: 'ScanClerk',
        meta: {
          title: '飞常赞用户收款'
        },
        component: ScanClerk
      }, {
        path: 'planeSync',
        name: 'PlaneSync',
        meta: {
          title: '机场数据同步'
        },
        component: PlaneSync
      }]
    },
    {
      path: '/mainMall',
      name: 'MainMall',
      component: MainMall,
      children: [{
        path: 'assistantOpLog',
        name: 'AssistantOpLog',
        meta: {
          title: '逸臣门店支付核消记录'
        },
        component: AssistantOpLog
      }, {
        path: 'ycFczOrder',
        name: 'YcFczOrder',
        meta: {
          title: '订单支付记录'
        },
        component: YcFczOrder
      }, {
        path: 'countShoppingBag',
        name: 'CountShoppingBag',
        meta: {
          title: '购物袋赠送统计'
        },
        component: CountShoppingBag
      }, {
        path: 'invoice',
        name: 'Invoice',
        meta: {
          title: '电子发票开具'
        },
        component: Invoice
      }, {
        path: 'redInvoice',
        name: 'RedInvoice',
        meta: {
          title: '电子发票红冲'
        },
        component: RedInvoice
      }, {
        path: 'invoiceList',
        name: 'InvoiceList',
        meta: {
          title: '电子发票列表'
        },
        component: InvoiceList
      }, {
        path: 'scanClerk',
        name: 'ScanClerk',
        meta: {
          title: '飞常赞用户收款'
        },
        component: ScanClerk
      }, {
        path: 'freeGo',
        name: 'FreeGo',
        meta: {
          title: '自助购订单'
        },
        component: FreeGo,
        children: [{
          path: 'freeNewOrder',
          name: 'FreeNewOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeNewOrder
        }, {
          path: 'freeDayOrder',
          name: 'FreeDayOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeDayOrder
        }, {
          path: 'freeHistoryOrder',
          name: 'FreeHistoryOrder',
          meta: {
            title: '自助购订单'
          },
          component: FreeHistoryOrder
        }]
      }, {
        path: 'planeSync',
        name: 'PlaneSync',
        meta: {
          title: '机场数据同步'
        },
        component: PlaneSync
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
