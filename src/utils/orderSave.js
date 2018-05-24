/**
 * Created by czwaiwai on 17/12/16.
 */
import order2tickets from './order2tickets'
import printFactory from './printFactory'
function orderSave (vue, restShop, webPrint, user) {
  this.$vue = vue
  let printTpl = this.$vue.$store.getters.printTpl
  this.orderList = []
  this.status = 'start'
  this.shop = restShop
  console.log(restShop, 'orderSave ------')
  this.myEvent = {
    start: this.loop,
    before: this.loop,
    after: this.loop,
    change: this.loop,
    giveup: this.loop,
    error: this.loop,
    sysError: function (error) {
      console.error(error)
      vue.$alert('打印机配置出现错误无法正常操作，请尽快管理员联系', {
        confirmButtonText: '确定',
        callback: action => {
          vue.$store.dispatch('logoutAction').then(() => {
            vue.$router.replace({name: 'Login'})
          })
        }
      })
    },
    done: this.loop
  }
  if (!Array.isArray(webPrint)) {
    this.myEvent.sysError(new Error('没有获取到配置打印机的信息'))
    return
  }
  order2tickets.init(webPrint, restShop, user, printTpl)
  printFactory.init(webPrint, this.$vue)
}
orderSave.prototype = {
  listen: function (orderStateObj) {
    Object.assign(this.myEvent, orderStateObj)
  },
  setUser: function (user) {
    order2tickets.setUser(user)
  },
  loop: function () {},
  add: function (obj2list) {
    if (Array.isArray(obj2list)) {
      obj2list.forEach(item => {
        console.log('添加去打印的对象', item.id || '普通对象')
      })
      this.addOrder(obj2list)
    } else {
      console.log('添加去打印的对象', obj2list && obj2list.id)
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
  getPrintState () {
    return this.status
  },
  setPrintState (state) {
    if (['start', 'waiting'].indexOf(state) > -1) {
      this.status = state
    }
  },
  showList () {
    return this.orderList
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
      }
      console.error('错误：出错订单详情--', Object.assign({}, obj))
      self.finish2Continue()
    }
  },
  send: function () {
    console.log('当前打印机状态:', this.status)
    console.log('待打印对象长度', this.orderList.length)
    if (this.status === 'start') {
      this.myEvent.start(this.status)
      this.sendProcess()
    }
  },
  sendProcess () {
    let self = this
    console.log(this.shop, '---------------order Save shop---------------')
    this.status = 'waiting'
    let obj = this.orderList.shift()
    if (!obj) {
      console.error('错误：出现了空的打印对象，请检查代码逻辑！')
      if (this.isEmptyList()) {
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
      if (tickets && tickets.length > 0) {
        console.log(self.shop, '---------------order Save shop-111-------------')
        printFactory.send(tickets, function (err, msg) {
          if (err) {
            return self.myEvent.error(err, obj, self.errNext(obj))
          }
          self.myEvent.after(obj)
          self.finish2Continue()
        }, self.shop)
      } else {
        console.error('空对象去打印无法打印')
        self.myEvent.after(obj)
        self.finish2Continue()
      }
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
