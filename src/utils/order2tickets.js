/**
 * Created by czwaiwai on 17/12/16.
 */
import Vue from 'vue'
import {webTplFn} from './printTpl'
import moment from 'moment'
let order2tickets = {
  init: function (webPrint, restShop, user, printTpl) {
    console.log(webPrint, restShop)
    this.TplFn = webTplFn(printTpl)
    this.user = user
    this.webPrint = webPrint
    this.restShop = restShop
  },
  //  获取默认打印机
  getDefaultPrintName () {
    return this.webPrint[0].name
  },
  //  打印前获取数据
  getPrintData (obj, cb) {
    let paramObj = {
      orderId: obj.id,
      printNum: 1
    }
    if (obj.isBack) {
      // 当为取消订单时不再去取对象
      if (obj.isCancel) {
        console.log('当前为取消订单操作，不需要去打印的订单信息')
        return cb(null, obj)
      } else {
        paramObj.refundDetailIds = obj.refundDetailIds
      }
    }
    if (obj.printSingleType) {
      paramObj.isSingle = obj.printSingleType
    }
    Vue.http.post('/ycRest/printRestOrder', paramObj).then(res => {
      let resData = res.data
      if (resData.retCode === 0) {
        cb(null, res.data.data)
      } else {
        console.error('拉取打印数据报错')
        cb(new Error('请求返回的数据不正确'))
      }
    }, err => {
      cb(err)
    })
  },
  // 转换成打印对象
  toList: function (order, cb) {
    if (this.isOrder(order)) {
      this.getPrintData(order, (err, orderData) => {
        if (err) {
          console.error('请求打印对象出错')
          cb(err)
        }
        let tmpOrder = Object.assign({}, order, orderData)
        console.log('tmpOrder', tmpOrder)
        this.orderChangeList(tmpOrder, cb)
      })
    } else {
      this.normalList(order, cb)
    }
  },
  orderChangeList (order, cb) {
    try {
      let newOrder = order
      let consumptionOrder = this.createConsumptionOrder(newOrder)
      let billingOrder = this.createBilling(newOrder)
      let kitchenOrders = this.createKitchen(newOrder)
      if (order.printSingleType) {
        switch (order.printSingleType) {
          case 1: cb(null, [consumptionOrder])
            break
          case 2: cb(null, [billingOrder])
            break
          case 3: cb(null, [...kitchenOrders])
            break
        }
      } else {
        cb(null, [consumptionOrder, billingOrder, ...kitchenOrders])
      }
    } catch (e) {
      cb(new Error('模板编译出错'))
    }
  },
  //  普通对象打印处理
  normalList (obj, cb) {
    if (!obj.tplName) {
      cb(new Error('普通打印，没有设定打印模板'))
    }
    let objNew = Object.assign({}, obj)
    objNew.tpl = this.TplFn(objNew)
    console.log(objNew, '普通打印模板')
    objNew.printName = obj.printName || this.getDefaultPrintName()
    cb(null, [objNew])
  },
  isOrder (order) {
    if (order.isOrder) {
      return true
    }
    return false
  },
  payFormat (order) {
    if (order.adjAmt) {
      return `实际支付总额:${order.adjAmt}元`
    } else {
      if (order.status === 9) {
        return `线下支付${order.bankPayAmt}元`
      } else {
        if (order.acctPayAmt) {
          return `飞常赞余额支付：${order.acctPayAmt}元`
        }
        if (order.offlinePayAmt) {
          return `线下支付：${order.offlinePayAmt}元`
        }
        if (order.bankPayAmt) {
          return `线上支付：${order.bankPayAmt}元\n<% setSize:2 %><% setStyle:BU %>交易单号：${order.bankTranNo}\n<% setSize:1 %><% setStyle:NORMAL %>`
        }
      }
    }
  },
  payText (payType) {
    let payTypeTxt = {
      acc: '飞常赞账户支付',
      wx: '微信支付',
      ali: '支付宝支付',
      qq: 'QQ支付',
      offl: '现金支付'
    }
    return payTypeTxt[payType]
  },
  //  创建消费单对象
  createConsumptionOrder (order) {
    let newOrder = Object.assign({}, order)
    newOrder.printName = this.getDefaultPrintName()
    newOrder.typeName = '消费单'
    newOrder.userName = this.user.userName
    newOrder.tplName = 'consumption'
    newOrder.restShop = this.restShop
    newOrder.payFormat = this.payFormat(newOrder)
    newOrder.printTime = moment().format('MM-DD HH:mm:ss')
    newOrder.payText = this.payText(order.payType)
    newOrder.tpl = this.TplFn(newOrder)
    return newOrder
  },
  //  创建结账单
  createBilling (order) {
    let newOrder = Object.assign({}, order)
    newOrder.printName = this.getDefaultPrintName()
    newOrder.printTime = moment().format('MM-DD HH:mm:ss')
    newOrder.typeName = '结账单'
    newOrder.userName = this.user.userName
    newOrder.tplName = 'billing'
    newOrder.restShop = this.restShop
    newOrder.payFormat = this.payFormat(newOrder)
    newOrder.payText = this.payText(order.payType)
    newOrder.tpl = this.TplFn(newOrder)
    return newOrder
  },
  // 创建后厨单
  createKitchen (order) {
    let newOrder = Object.assign({}, order)
    newOrder.printName = this.getDefaultPrintName()
    newOrder.printTime = moment().format('MM-DD HH:mm:ss')
    newOrder.typeName = '厨打单'
    newOrder.tplName = 'kitchen'
    // return newOrder
    let list = this.bingKitchen(newOrder)
    list = this.normalKitchen(newOrder, list)
    list = this.isBackKitchen(newOrder, list)
    console.log('厨打list', list)
    return list
    //  console.log(order)
  },
  isJSON (str) {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str)
        console.log(obj)
        if (str.indexOf('{') > -1) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
    return false
  },
  bingKitchen (order) {
    if (order.isBing) {
      return this.getAllkitchen(order.fnChuPrintDetailList, order)
    }
    return false
  },
  normalKitchen (order, isProcess) {
    if (isProcess === false && !order.isBack) {
      return this.getAllkitchen(order.fnAttach, order)
    }
    return isProcess
  },
  isBackKitchen (order, isProcess) {
    if (isProcess === false && order.isBack) {
      return this.getAllkitchen(order.fnRetreatFoodList, order)
    }
    return isProcess
  },
  //  套餐处理
  packageProcess (item) {
    if (item.isMeal && this.isJSON(item.mealDetail)) {
      var arr = JSON.parse(item.mealDetail)
      return arr.map((sml) => {
        if (sml.isMain) {
          sml.attr = item.attr
        } else {
          sml.attr = ''
        }
        sml.userName = item.userName
        sml.restShopName = item.restShopName
        sml.isBack = item.isBack || false
        sml.tableNum = item.tableNum
        sml.buildTime = item.buildTime
        sml.printTime = item.printTime
        sml.tplName = item.tplName
        sml.userRemark = item.userRemark
        sml.vOrderNo = item.vOrderNo
        sml.printName = this.getKitchenPrintName(sml.type)
        sml.restProName = sml.name
        sml.restPrintTag = sml.type
        sml.typeName = sml.type
        sml.buyCount = sml.buyCount || 1
        if (item.buyCount > 1) {
          sml.buyCount = sml.buyCount * item.buyCount
        }
        sml.tpl = this.TplFn(sml)
        return sml
      })
    }
    item.tpl = this.TplFn(item)
    return [item]
  },
  getKitchenPrintName (type) {
    let tmpArr = this.webPrint.filter(item => item.btn === 'houchu')
    let kitPrint = tmpArr[0].print
    if (Array.isArray(kitPrint)) {
      let arr = kitPrint.filter(item => item.type === type)
      if (arr.length > 0) {
        return arr[0].name
      }
      return ''
    } else {
      return kitPrint
    }
  },
  getAllkitchen (list, order) {
    let tmp = []
    if (!list) {
      console.error(list, '获取后厨退菜为空值，快去看看呀')
      return tmp
    }
    list.forEach(item => {
      if (order.isBack) {
        if (item.buyCount > 0 || !item.fnPrintTag) {
          return
        }
      } else {
        if (item.buyCount < 0) {
          return
        }
      }
      item.userName = this.user.userName
      item.isBack = order.isBack || false
      item.printName = this.getKitchenPrintName(item.restPrintTag)
      item.buildTime = order.buildTime
      item.tableNum = order.tableNum
      item.printTime = order.printTime
      item.vOrderNo = order.vOrderNo
      item.userRemark = order.userRemark
      item.tplName = 'kitchen'
      item.typeName = item.restPrintTag
      tmp.push(...this.packageProcess(item))
    })
    return tmp
  }
}

export default order2tickets
