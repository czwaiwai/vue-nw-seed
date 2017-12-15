/**
 * Created by Administrator on 2017/12/14 0014.
 */
const printer = require('printer')
var ChnPrinter = require('chn-escpos')
import bus from './bus'

export default myPrinter
function myPrinter (printers) {
  console.log(printers, 'printers')
  this.defaultPrinter = null
  this.webPrinters = this.getArrWebPrinters(printers)
  this.pcPrinters = printer.getPrinters()
}
myPrinter.prototype.getArrWebPrinters = function (printers) {
  let tmp = []
  this.defaultPrinter = printers[0]
  printers.forEach(item => {
    if (item.name) {
      tmp = item
    }
    if (item.print) {
      tmp.push(...item.print)
    }
  })
  return tmp
}
myPrinter.prototype.getByWebName = function () {
  return this.webPrinters.map(item => {
    return item.name
  })
}
myPrinter.prototype.getVaildPrinters = function () {
  let nameArr = this.getByWebName()
  return this.pcPrinters.filter(item => {
    return nameArr.indexOf(item) > -1
  })
}
myPrinter.prototype.testStart = function () {
  console.log('我是testStart')
  return new ChnPrinter('GP-L80250 Series', function () {
    let that = this
    bus.$on('print', function (ticket) {
      that.compile(`<% setAlign:c %><% setSize:2 %>日报\n
<% setAlign:l %><% setSize:1 %>店铺：宝山茶楼\n
统计开始日期：2017-12-14 13:19\n
统计结束日期：2017-12-14 15:47\n
------------------------------------------------\n
已支付：12笔      实收金额：1049.00\n
------------------------------------------------\n
现金支付：953.00\n
线上支付：96\n
飞常赞支付：0.00\n
________________________________________________\n
此小票为日报，请妥善保管\n
`)
      .print(function (err, msg) {
        if (err) {
          console.log(err)
        }
      })
    })
  })
}
myPrinter.prototype.start = function (vue, cb) {
  let printers = this.getVaildPrinters()
  let isErr = false
  return printers.map(item => {
    return new ChnPrinter(item.name, function (err, msg) {
      if (err) {
        isErr = true
        return cb(err, msg)
      }
      if (isErr) {
        return false
      }
      let that = this
      bus.$on('print', function (ticket) {
        that.print(function (err, msg) {
          if (err) {
            console.log(err)
          }
        })
      })
    })
  })
}
myPrinter.prototype.print = function (ticket) {}
myPrinter.prototype.stop = function () {}
