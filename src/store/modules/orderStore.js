/**
 * Created by waiwai on 17-12-7.
 */
import OrderSave from '../../utils/orderSave'
import {currency, amountFix} from '../../utils/utils'
import {orderSign, orderSignOne, freeOrderSign, freeOrderOne} from '../../utils/orderFormat'
var isAuto = true
if (process.env.NODE_ENV === 'development') {
  isAuto = true
}
function isSame (aItem, bItem) {
  let aIds = aItem.subItems.sort((a, b) => a.id - b.id).reduce((before, sItem) => {
    return before + sItem.id + '' + sItem.num
  }, '')
  let bIds = bItem.subItems.sort((a, b) => a.id - b.id).reduce((before, sItem) => {
    return before + sItem.id + '' + sItem.num
  }, '')
  return aIds === bIds
}
export default {
  state: {
    printOrders: [],
    printOrdersMap: new Map(),
    printHistoryMap: new Map(),
    printing: [],
    hisOrders: [],
    hisOrderIds: [],
    activeOrder: null,
    isAuto: isAuto,
    printService: null,
    printTpl: null,
    loopTime: 10000,
    token: null,
    listOrder: []
  },
  getters: {
    hisOrders: state => state.hisOrders,
    activeOrder: state => state.activeOrder,
    printOrders: state => state.printOrders,
    isAuto: state => state.isAuto,
    token: state => state.token,
    printService: state => state.printService,
    printTpl: state => state.printTpl,
    loopTime: state => state.loopTime,
    listOrder: state => state.listOrder
  },
  mutations: {
    createActiveOrder (state, list) {
      state.activeOrder = {
        isNew: true,
        fnActPayAmount: 0, // 消费金额
        cashDisc: 100, // 折扣率
        cashRound: 0, // 舍入额
        cashMoney: 0, // 折扣掉的金额
        cashNeedPay: 0, // 应收的金额
        cashMoneyBack: 0, // 找回的零钱
        fnAttach: []
      }
    },
    setActiveOrderInfo (state, obj) {
      if (!state.activeOrder) return
      for (let key in obj) {
        this._vm.$set(state.activeOrder, key, obj[key])
      }
    },
    // 设置折扣额及应收金额
    changeActiveMoney (state, money) {
      if (!state.activeOrder) return
      let active = state.activeOrder
      let before = active.fnActPayAmount
      // 有折扣
      if (active.cashMoney > 0) {
        before = currency(before - active.cashMoney)
      }
      console.log(parseFloat(before), parseFloat(money))
      active.cashMoneyBack = currency(parseFloat(money) - parseFloat(before))
      // active.cashNeedPay = money
    },
    // 修改找零金额
    changeActiveBackMoney (state, money) {
      if (!state.activeOrder) return
      state.activeOrder.cashRound = currency(parseFloat(state.activeOrder.cashMoneyBack) - parseFloat(money))
      state.activeOrder.cashMoneyBack = money
      console.log(state.activeOrder.cashRound, '取整后：舍入金额 cashRound')
    },
    setActiveDiscount (state, percent) {
      if (!state.activeOrder) return
      let active = state.activeOrder
      active.cashDisc = percent
      active.cashMoney = currency((active.fnActPayAmount * (100 - percent)) / 100)
      active.cashNeedPay = currency(active.fnActPayAmount - active.cashMoney)
      // state.activeOrder.cashNeedPay =
    },
    // 自助点餐tableNo
    setActiveTableNO (state, deskObj) {
      if (!state.activeOrder) return
      if (!deskObj) return
      state.activeOrder.tableId = deskObj.id
      state.activeOrder.tableNum = deskObj.tableNum
    },
    // 自助点餐添加商品到订单
    setActiveOrderFood (state, foodObj) {
      if (!state.activeOrder) return
      if (!state.activeOrder.fnAttach) state.activeOrder.fnAttach = []
      let foundOne = state.activeOrder.fnAttach.find(item => {
        if (item.id === foodObj.id && item.attr === foodObj.attr) {
          // 比较判断子商品是否属于统一的对象
          if (item.subItems && foodObj.subItems && isSame(item, foodObj)) {
            return true
          }
          // 不存在子商品的说明是同一对象
          if (!item.subItems && !item.subItems) {
            return true
          }
        } else {
          return false
        }
      })
      // 判断foodObj 是否存在且一致
      // console.log(foodObj.attr, 'fooObj.attr')
      if (foundOne) {
        foundOne.buyCount++
        foundOne.amount = amountFix(foundOne.buyCount * foundOne.perCash)
        console.log(foundOne)
      } else {
        foodObj.amount = amountFix(foodObj.buyCount * foodObj.perCash)
        state.activeOrder.fnAttach.push(foodObj)
      }
      state.activeOrder.fnActPayAmount = state.activeOrder.fnAttach.reduce((before, item) => {
        return before + (item.buyCount * item.perCash)
      }, 0)
    },
    // 自助点餐减少订单中的商品
    reFoodActiveOrder (state, foodObj) {
      if (!state.activeOrder) return
      if (!state.activeOrder.fnAttach) state.activeOrder.fnAttach = []
      let index = state.activeOrder.fnAttach.findIndex(item => item.id === foodObj.id)
      let foundOne = state.activeOrder.fnAttach[index]
      if (foundOne) {
        if (foundOne.buyCount === 1) {
          state.activeOrder.fnAttach.splice(index, 1)
        }
        if (foundOne.buyCount > 1) {
          foundOne.buyCount--
          foundOne.amount = foundOne.buyCount * foundOne.perCash
        }
      }
      state.activeOrder.fnActPayAmount = state.activeOrder.fnAttach.reduce((before, item) => {
        return before + (item.buyCount * item.perCash)
      }, 0)
    },
    /* --------------------------listOrder ------------------- */
    setListOrder (state, list) {
      orderSign(list)
      state.listOrder = list
    },
    updateOne (state, order) {
      let index = state.listOrder.findIndex(item => item.id === order.id)
      if (index > -1) {
        state.listOrder.splice(index, 1, orderSignOne(order))
      }
    },
    clearOrderList (state) {
      state.listOrder = []
    },
    removeOne (state, order) {
      let index = state.listOrder.findIndex(item => item.id === order.id)
      if (index > -1) {
        state.listOrder.splice(index, 1)
      }
    },
    removeOneById (state, id) {
      let index = state.listOrder.findIndex(item => item.id === id)
      if (index > -1) {
        state.listOrder.splice(index, 1)
      }
    },
    /* ---------------------------listOrder end --------------- */
    // ------------------------打印机初始化 ---------------------
    setLoopTime (state, time) {
      state.loopTime = time
    },
    printInit (state, {vue, shop, shopPrint, user}) {
      console.log(state.printService, 'state.printService')
      if (!state.printService) {
        state.printService = new OrderSave(vue, shop, shopPrint, user)
      }
    },
    printClose (state) {
      state.printService = null
    },
    setAuto (state, bool) {
      state.isAuto = bool
    },
    setToken (state, token) {
      state.token = token
    },
    setTpl (state, tpl) {
      state.printTpl = tpl
    },
    // ------------------------打印机初始化end -------------------
    //  获取新订单
    orderPush (state, list) {
      state.printOrders.push(...list)
    },
    orderPushMap (state, obj) {
      obj.newData.forEach(item => {
        state.printOrdersMap.set(item.id, item)
      })
      console.log(obj.inHisArr)
      console.log('inHisArr', state.printHistoryMap)
      //  当新订单列表不存在单printMore有值时
      if (obj.inHisArr.length > 0) {
        obj.inHisArr.forEach(item => {
          if (state.printHistoryMap.has(item.id)) {
            if (state.printHistoryMap.get(item.id) !== `${item.printMore},${item.printMoreSeq}`) {
              state.printHistoryMap.set(item.id, `${item.printMore},${item.printMoreSeq}`)
              state.printService.add(item)
            } else {
              console.log('不做任何处理，说明是重复项')
            }
          } else { // 历史记录中都不存在说明可以直接去打印
            state.printHistoryMap.set(item.id, `${item.printMore},${item.printMoreSeq}`)
            state.printService.add(item)
          }
        })
      }
      // 更新列表中存在的值
      if (obj.inViewArr.length > 0) {
        obj.inViewArr.forEach(item => {
          if (state.printOrdersMap.has(item.id)) {
            let oldOne = state.printOrdersMap.get(item.id)
            if (oldOne.printMoreSeq !== item.printMoreSeq) { // 去打印
              item.isAutoChange = true
              state.printOrdersMap.set(item.id, item)
              if (item.printMore) {
                state.printHistoryMap.set(item.id, `${item.printMore},${item.printMoreSeq}`)
                state.printService.add(item)
              } else {
                item.status === 1 && state.printOrdersMap.delete(item.id)  // 移除
              }
            } else {
              state.printOrdersMap.set(item.id, item)
            }
          }
        })
      }
      // 更新printOrders
      state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo)
    },
    setPrintOrder (state, order) {
      let printOrder = state.printOrders.find(item => item.id === order.id)
      printOrder.isPrinting = true
    },
    updatePrintOrder (state, order) {
      if (order.isOrder === undefined) {
        orderSignOne(order)
      }
      let index = state.printOrders.findIndex(item => item.id === order.id)
      if (index > -1) {
        state.printOrders.splice(index, 1, order)
        console.log('更新后的state，printOrders', state.printOrders)
      }
    },
    // 更新待打印列表的值
    updatePrintOrderMap (state, order) {
      if (order.isOrder === undefined) {
        orderSignOne(order)
      }
      if (state.printOrdersMap.has(order.id)) {
        state.printOrdersMap.set(order.id, order)
        // 更新printOrders
        state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo)
      }
    },
    // 从新订单列表中移除订单
    removeInPrintOrderMap (state, order) {
      if (order.isOrder === undefined) {
        orderSignOne(order)
      }
      // if (state.printOrdersMap.has(order.id)) {
      //   state.printOrdersMap.delete(order.id)
      // }
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
      let index = state.printing.indexOf(order.id)
      if (index > -1) {
        state.printing.splice(index, 1)
      }
      state.printHistoryMap.set(order.id, `${order.printMore},${order.printMoreSeq}`)
      if (state.printOrdersMap.has(order.id)) {
        state.printOrdersMap.delete(order.id)
        // 更新printOrders
      }
      state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo)
    },
    setFinshPrintOrder (state, order) {
      let printOrder = state.printOrders.find(item => item.id === order.id)
      if (printOrder) {
        printOrder.isPrint = true
        printOrder.isPrinting = false
      }
    },
    // 从printerOrders中找出移除并添加进历史订单中
    removeOrder (state, order) {
      let index = state.printOrders.findIndex(item => item.id === order.id)
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
      if (index > -1 && order.status !== 9) {
        state.printOrders.splice(index, 1)
      }
    },
    removeOrderMap (state, order) {
      if (order) {
        console.log('列表中移除---order', JSON.stringify(order))
      }
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
      let index = state.printing.indexOf(order.id)
      if (index > -1) {
        state.printing.splice(index, 1)
      }
      state.printHistoryMap.set(order.id, `${order.printMore},${order.printMoreSeq}`)
      if (state.printOrdersMap.has(order.id) && order.status !== 9) {
        state.printOrdersMap.delete(order.id)
        // 更新printOrders
        state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo)
      }
    },
    // 从待打印列表中找出activeOrder 并移除
    removeActiveOrder (state) {
      if (state.activeOrder) {
        let index = state.printOrders.findIndex(item => item.id === state.activeOrder.id)
        if (index >= 0) {
          state.printOrders.splice(index, 1)
        }
        state.activeOrder = null
      }
    },
    // 从待打印列表中找出activeOrder 并移除
    removeActiveOrderMap (state) {
      if (state.activeOrder) {
        if (state.printOrdersMap.has(state.activeOrder.id)) {
          state.printOrdersMap.delete(state.activeOrder.id)
          // 更新printOrders
          state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo)
        }
        state.activeOrder = null
      }
    },
    setActiveOrder (state, order) {
      if (order.isOrder === undefined) {
        orderSignOne(order)
      }
      state.activeOrder = order
    },
    findAndClearActiveOrder (state, order) {
      if (state.activeOrder && state.activeOrder.id === order.id) {
        state.activeOrder = null
      }
    },
    clearActiveOrder (state, order) {
      state.activeOrder = null
    },
    // 零售相关操作-------------------------
    // 添加到零售历史记录
    freePushHis (state, order) {
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
    },
    freeUpdateOne (state, order) {
      let newOrder = freeOrderOne(order)
      let index = state.listOrder.findIndex(item => item.orderId === newOrder.id)
      if (index > -1) {
        state.listOrder.splice(index, 1, newOrder)
      }
    },
    freeRemoveById (state, orderId) {
      let index = state.printOrders.findIndex(item => item.id === orderId)
      if (index > -1) {
        state.printOrders.splice(index, 1)
      }
    },
    freeRemoveOrder (state, order) {
      let index = state.printOrders.findIndex(item => item.id === order.id)
      if (state.hisOrderIds.indexOf(order.id) === -1) {
        state.hisOrderIds.push(order.id)
      }
      if (index > -1) {
        state.printOrders.splice(index, 1)
      }
    }
  },
  actions: {
    addPrintObj ({state}, {printList}) {
      // console.log('aaa')
      if (state.printService) {
        // 创建普通打印对象
        let obj = {
          isOnlyTpl: true,
          printList
        }
        state.printService.add(obj)
      } else {
        console.error('printService没有初始化赶快检查问题')
      }
    },
    isExsitPrintOrderMap ({state}, {order}) {
      return state.printOrdersMap.has(order.id)
    },
    isExsitPirntOrder ({state}, {order}) {
      let index = state.printOrders.findIndex(item => item.id === order.id)
      return index > -1
    },
    // 免单操作
    orderFee ({state, commit}, {order}) {
      let newOrder = orderSignOne(order)
      commit('removeActiveOrderMap')
      console.log('免单：是否打印过这个订单', newOrder.isPrint)
      return newOrder
    },
    orderBack ({state, commit}, {order}) {
      order.isBack = true
      let newOrder = orderSignOne(order)
      // commit('removeActiveOrder')
      commit('removeActiveOrderMap')
      console.log('退单退菜：是否打印过这个订单', newOrder.isPrint)
      return newOrder
    },
    orderCancel ({state, commit}, {order}) {
      order.isBack = true
      order.isCancel = true
      let newOrder = orderSignOne(order)
      // commit('removeActiveOrder')
      commit('removeActiveOrderMap')
      console.log('取消订单~ 订单是否打印过：', newOrder.isPrint)
      return newOrder
    },
    // 结账后从新订单界面移除
    cashDownRomreOrderInNew ({state, commit}, {order}) {
      let newOrder = orderSignOne(order)
      commit('removeActiveOrderMap') // 从选中订单中移除
      commit('removeInPrintOrderMap', newOrder) // 从支付完成的订单中移除
      return newOrder
    },
    setAndRemoreActive ({state, commit}, {order}) {
      console.log('------setAndRemoreActive', JSON.stringify(order))
      let newOrder = orderSignOne(order)
      // commit('removeActiveOrder', newOrder)
      commit('removeActiveOrderMap') // 从待打印列表中找出activeOrder 并移除
      // commit('updatePrintOrder', newOrder)
      commit('updatePrintOrderMap', newOrder) // 更新待打印列表的值
      return newOrder
    },
    //  查看订单是否在打印列表
    vaildOrderInHIs ({state}, {obj}) {
      return state.hisOrderIds.indexOf(obj.id) > -1
    },
    pushActionMap ({getters, state, commit}, {list}) {
      orderSign(list)
      let newData = []
      list.forEach(item => {
        // 存在在历史记录中
        if (state.printHistoryMap.has(item.id)) {
          if (state.printHistoryMap.get(item.id) !== `${item.printMore},${item.printMoreSeq}`) {
            // 需要去打印的对象
            if (state.printing.indexOf(item.id) === -1 && item.printMore) { // 不存在与打印中时
              console.log('不存在打印中且pirntMore有值')
              state.printing.push(item.id)
              newData.push(item)
            }
          }
        } else { // 不存在历史记录中
          // 存在界面中的
          if (state.printOrdersMap.has(item.id)) {
            let oldOne = state.printOrdersMap.get(item.id)
            state.printOrdersMap.set(item.id, item)
            if (`${oldOne.printMore},${oldOne.printMoreSeq}` !== `${item.printMore},${item.printMoreSeq}`) {
              // state.printService.add(item)
              if (item.printMore) {
                console.log('printMore和printerMoreSeq变更，添加去打印')
                newData.push(item)
              }
            } else {
              //  检查界面中满足条件的进行移除
              if ([1, 7, 8].indexOf(item.status) > -1) { // 满足移除条件
                console.log('满足移除条件', item.id)
                state.printOrdersMap.delete(item.id)
                state.printHistoryMap.set(item.id, `${item.printMore},${item.printMoreSeq}`)  //  加入打印历史
                if (state.activeOrder && state.activeOrder.id === item.id) {
                  console.log('移除activeOrder')
                  state.activeOrder = null
                }
              }
            }
          } else { // 不在界面中的
            state.printOrdersMap.set(item.id, item) // 加入界面
            if (item.printMore) {
              if ([1, 88].indexOf(item.status) > -1 || (item.status === 9 && item.assistantOp === 1)) {
                console.log('不在界面中添加去打印')
                newData.push(item)
              }
            }
          }
        }
      })
      state.printOrders = Array.from(state.printOrdersMap.values()).sort((a, b) => b.vOrderNo - a.vOrderNo) // 更新显示界面
      return newData
    },
    pushAction ({getters, state, commit}, {list}) {
      orderSign(list)
      let inViewArr = [] // 在新订单列表中存在的
      let inHisArr = [] // 不在新订单列表且printMore不为空
      let newData = list.filter(item => {
        // state.printOrders.forEach(sub => {
        //   // 存在新订单界面中展示，更新订单详情
        //   if (item.id === sub.id && item.printMore) {
        //     if (sub.printMore && sub.printMore === item.printMore) {
        //       sub.printMore = ''
        //     }
        //     sub.status = item.status
        //     sub.payType = item.payType
        //     sub.bankPayAmt = item.backPayAmt
        //     sub.offlinePayAmt = item.offlinePayAmt
        //     Vue.set(sub, 'chgRemark', item.chgRemark)
        //     Vue.set(sub, 'acctPayAmt', item.acctPayAmt)
        //     item.printMore && Vue.set(sub, 'printMore', item.printMore)
        //     Vue.set(sub, 'isAutoChange', true)
        //     if (state.activeOrder && state.activeOrder.id === sub.id) {
        //       state.activeOrder = sub
        //     }
        //   }
        // })
        if (state.printOrders.some(sdata => sdata.id === item.id)) {
          if (item.printMore) {
            inViewArr.push(item)
          }
          return false
        }
        if (item.printMore) {
          inHisArr.push(item)
        }
        if (state.hisOrderIds.indexOf(item.id) > -1) {
          return false
        }
        return true
      })
      // 新订单页面展示
      inHisArr = inHisArr.filter(item => !newData.some(sub => sub.id === item.id)) // 过滤掉去展示的订单
      //  commit('orderPush', newData)
      commit('orderPushMap', {newData, inViewArr, inHisArr})
      // 筛选出用户现金下单的
      let printData = newData.filter(item => {
        // assistantOp === 0 顾客  暂不出单
        // assistantOp === 1 点单员  立即出单
        // assistantOp === 2 收银员  暂不出单
        if (item.assistantOp === 1 && item.status === 9) { // 点单员点单且申请线下付款 返回true 立即打单
          return true
        } else {
          return false
        }
        // if (item.assistantOp === 0 && item.status === 9) {
        //   return false
        // } else {
        //   return true
        // }
      })
      // let others = state.printOrders.filter(item => item.isAutoChange)
      return printData
    },
    // // 零售打印相关action
    freePushAction ({getters, state, commit}, {list}) {
      let newList = freeOrderSign(list)  // 获得新订单
      // 剔除已在历史记录中的订单
      let newData = newList.filter(item => {
        return state.hisOrderIds.indexOf(item.id) === -1
      })
      // 添加到打印待打印
      commit('orderPush', newData)
      return newData
    },
    freeOrderBack ({state, commit}, {order}) {
      order.isBack = true
      let newOrder = freeOrderOne(order)
      // commit('removeActiveOrder')
      commit('freeRemoveById', newOrder.orderId)
      console.log('退单退菜：是否打印过这个订单', newOrder.vOrderNo, newOrder.orderId)
      return newOrder
    },
    // 添加到已打印
    freeAddHisAction ({getters, state, commit}, {order}) {
      commit('freePushHis', order)
      return 'success'
    }
  }
}
