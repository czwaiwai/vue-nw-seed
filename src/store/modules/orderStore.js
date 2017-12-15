/**
 * Created by waiwai on 17-12-7.
 */
export default {
  state: {
    printOrders: [],
    hisOrders: [],
    hisOrderIds: [],
    activeOrder: null
  },
  getters: {
    hisOrders: state => state.hisOrders,
    activeOrder: state => state.activeOrder,
    printOrders: state => state.printOrders
  },
  mutations: {
    //  获取新订单
    orderPush (state, list) {
      let newData = list.filter(item => {
        if (state.hisOrderIds.indexOf(item.id) > -1) {
          return false
        }
        if (state.printOrders.some(sdata => sdata.id === item.id)) {
          return false
        }
        return true
      })
      console.log(newData, '--------------------------------------')
      state.printOrders.push(...newData)
    },
    setActiveOrder (state, order) {
      console.log(Object.assign({}, order))
      state.activeOrder = order
    },
    clearActiveOrder (state, order) {
      state.activeOrder = null
    }
  },
  actions: {}
}
