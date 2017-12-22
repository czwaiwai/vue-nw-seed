/**
 * Created by czwaiwai on 17/12/16.
 */
import order2tickets from './order2tickets'
import printFactory from './printFactory'
function orderSave (vue, restShop, webPrint, user) {
  this.$vue = vue
  let printTpl = this.$vue.$store.getters.printTpl
  console.log(this.printTpl, '----printTpl--------')
  this.orderList = []
  this.status = 'start'
  this.myEvent = {
    start: this.loop,
    before: this.loop,
    after: this.loop,
    change: this.loop,
    giveup: this.loop,
    error: this.loop,
    done: this.loop
  }
  if (!Array.isArray(webPrint)) {
    throw new Error('没有获取到配置打印机的信息')
  }
  order2tickets.init(webPrint, restShop, user, printTpl)
  printFactory.init(webPrint)
}
orderSave.prototype = {
  listen: function (orderStateObj) {
    Object.assign(this.myEvent, orderStateObj)
  },
  loop: function () {},
  add: function (obj2list) {
    if (Array.isArray(obj2list)) {
      this.addOrder(obj2list)
    } else {
      this.addOther(obj2list)
    }
    this.send()
  },
  addOther: function (object) {
    this.orderList.push(object)
  },
  addOrder: function (list) {
    this.orderList.push(...list)
  },
  errTimes: function (obj) {
    if (!obj.tryNum) {
      obj.tryNum = 1
    } else {
      obj.tryNum ++
    }
  },
  errNext (obj) {
    let self = this
    return function (isContinue = true, times = 5) {
      self.errTimes(obj)
      if (isContinue) {
        if (obj.tryNum > times) {
          // 放弃这个打印对象
          self.myEvent.giveup(obj)
        } else {
          //  网络错误将这个对象重新加入到队列中
          self.orderList.push(obj)
        }
        self.finish2Continue()
      }
    }
  },
  send: function () {
    if (this.status === 'start') {
      this.myEvent.start(this.status)
      this.sendProcess()
    }
  },
  sendProcess () {
    let self = this
    this.status = 'waiting'
    let obj = this.orderList.shift()
    if (!obj) {
      console.err('出现了空的打印对象，请检查代码逻辑！')
      if (this.orderList.length === 0) {
        this.status = 'start'
        return
      } else {
        return this.sendProcess()
      }
    }
    this.myEvent.before(obj)
    //   取出一个order对象或打印对象
    order2tickets.toList(obj, function (err, tickets) {
      if (err) {
        return self.myEvent.error(err, obj, self.errNext(obj))
      }
      // 发送到打印机
      printFactory.send(tickets, function (err, msg) {
        if (err) {
          return self.myEvent.error(err, obj, self.errNext(obj))
        }
        self.myEvent.after(obj)
        self.finish2Continue()
      })
    })
  },
  finish2Continue () {
    if (!this.isEmptyList()) {
      this.sendProcess()
    } else {
      this.status = 'start'
      this.myEvent.done(this.status)
    }
  },
  isEmptyList () {
    return this.orderList.length === 0
  }
}
export default orderSave
