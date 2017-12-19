/**
 * Created by waiwai on 17-12-7.
 */
import OrderSave from '../../utils/orderSave'
export default {
  state: {
    printOrders: [],
    hisOrders: [],
    hisOrderIds: [],
    activeOrder: null,
    isAuto: true,
    printService: null,
    printTpl: null
  },
  getters: {
    hisOrders: state => state.hisOrders,
    activeOrder: state => state.activeOrder,
    printOrders: state => state.printOrders,
    isAuto: state => state.isAuto,
    printService: state => state.printService,
    printTpl: state => state.printTpl
  },
  mutations: {
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
      state.hisOrderIds.push(order.id)
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
    pushAction ({getters, state, commit}, {list}) {
      let newData = list.filter(item => {
        if (state.hisOrderIds.indexOf(item.id) > -1) {
          return false
        }
        if (state.printOrders.some(sdata => sdata.id === item.id)) {
          return false
        }
        return true
      })
      commit('orderPush', newData)
      return newData
    }
  }
}
