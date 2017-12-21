/**
 * Created by waiwai on 17-12-7.
 */
import OrderSave from '../../utils/orderSave'
import {orderSign, orderSignOne} from '../../utils/orderFormat'
export default {
  state: {
    printOrders: [],
    hisOrders: [],
    hisOrderIds: [],
    activeOrder: null,
    isAuto: false,
    printService: null,
    printTpl: null,
    loopTime: 10000,
    listOrder: []
  },
  getters: {
    hisOrders: state => state.hisOrders,
    activeOrder: state => state.activeOrder,
    printOrders: state => state.printOrders,
    isAuto: state => state.isAuto,
    printService: state => state.printService,
    printTpl: state => state.printTpl,
    loopTime: state => state.loopTime,
    listOrder: state => state.listOrder
  },
  mutations: {
    setListOrder (state, list) {
      orderSign(list)
      state.listOrder = list
    },
    updateOne (state, order) {
      let myOrder = state.listOrder.find(item => item.id === order.id)
      myOrder = orderSignOne(order)
      console.log(myOrder)
    },
    removeOne (state, order) {
      let index = state.listOrder.findIndex(item => item.id === order.id)
      state.listOrder.splice(index, 1)
    },
    setLoopTime (state, time) {
      state.loopTime = time
    },
    printInit (state, {vue, shop, shopPrint, user}) {
      if (!state.printService) {
        state.printService = new OrderSave(vue, shop, shopPrint, user)
      } else {
        state.printService
      }
    },
    printClose (state) {
      state.printService = null
    },
    //  获取新订单
    orderPush (state, list) {
      state.printOrders.push(...list)
    },
    setAuto (state, bool) {
      state.isAuto = bool
    },
    setPrintOrder (state, order) {
      let printOrder = state.printOrders.find(item => item.id === order.id)
      printOrder.isPrinting = true
    },
    setFinshPrintOrder (state, order) {
      let printOrder = state.printOrders.find(item => item.id === order.id)
      printOrder.isPrinting = false
    },
    removeOrder (state, order) {
      let index = state.printOrders.findIndex(item => item.id === order.id)
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
      state.printOrders.splice(index, 1)
    },
    removeActiveOrder (state) {
      let index = state.printOrders.findIndex(item => item.id === state.activeOrder.id)
      state.printOrders.splice(index, 1)
      state.activeOrder = null
    },
    setActiveOrder (state, order) {
      console.log(Object.assign({}, order))
      state.activeOrder = order
    },
    clearActiveOrder (state, order) {
      state.activeOrder = null
    },
    setTpl (state, tpl) {
      state.printTpl = tpl
    }
  },
  actions: {
    //  查看订单是否在打印列表
    vaildOrderInHIs ({state}, {obj}) {
      return state.hisOrderIds.indexOf(obj.id) > -1
    },
    pushAction ({getters, state, commit}, {list}) {
      orderSign(list)
      // 打印中排除已经有打印过的
      let newData = list.filter(item => {
        if (state.hisOrderIds.indexOf(item.id) > -1) {
          return false
        }
        if (state.printOrders.some(sdata => sdata.id === item.id)) {
          return false
        }
        return true
      })
      // 新订单页面展示
      commit('orderPush', newData)
      // 筛选出用户现金下单的
      let printData = newData.filter(item => {
        if (item.assistantOp === 0 && item.status === 9) {
          return false
        } else {
          return true
        }
      })
      return printData
    }
  }
}
