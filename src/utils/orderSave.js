/**
 * Created by czwaiwai on 17/12/16.
 */
import order2tickets from './order2tickets'
import printFactory from './printFactory'
function orderSave () {
  this.orderList = []
  this.status = 'start'
  order2tickets.init()
  printFactory.init()
}
orderSave.prototype = {
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
  send: function () {
    let self = this
    if (this.status === 'start') {
      this.status = 'waiting'
      let obj = this.orderList.shift()
      //   取出一个order对象或打印对象
      order2tickets.toList(obj, function (err, tickets) {
        if (err) {
          console.log(err)
        }
        printFactory.send(tickets, function (err, msg) {
          if (err) {
            console.log(err)
          }
          if (self.isEmptyList()) {
            this.status = 'start'
          } else {
            this.send()
          }
        })
      })
    }
  },
  isEmptyList () {
    return this.orderList.length === 0
  }
}
