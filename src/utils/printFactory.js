/**
 * Created by czwaiwai on 17/12/16.
 */
//  const printer = require('printer')
var ChnPrinter = require('chn-escpos')
var printHelper = require('./printHelper')
var {htmlValidPrint} = require('./htmlPrinter')
// var chromePrint = require('./chromePrint')
import chromePrint from './chromePrint'

printHelper(ChnPrinter)
var crypto = require('crypto')
var md5 = function (str) {
  var cryptoMd5 = crypto.createHash('md5')
  cryptoMd5.update(str, 'utf8') // 加入编码
  return cryptoMd5.digest('hex')
}

let printFactory = {
  init (webPrint, vue) {
    console.log(webPrint)
    this.$vue = vue
    this.webPrint = webPrint
    this.priArr = this.getRunPrinters(webPrint)
    this.web = this.coverWebPrint(webPrint)
    console.log(this.priArr)
   // let that = this
    this.printers = []
  },
  //  创建打印机对象，如果存在返回打印对象
  createPrinter (cb) {
    let i = 0
    let self = this
    if (!Array.isArray(this.priArr)) {
      return cb(new Error('this.priArr不是数组对象，请检查代码逻辑'))
    }
    if (this.priArr.every(item => item.chnPrinter)) {
      cb(null, this.priArr)
    } else {
      this.priArr.forEach(priOne => {
        console.log(priOne, i, 'priOne')
        new ChnPrinter(priOne.name, function (err, msg) {
          if (err) {
            console.error('错误：打印机初始化出错')
            return cb(new Error('错误：打印机初始化出错'))
          }
          i++
          priOne.chnPrinter = this
          if (i === self.priArr.length) {
            cb(null, self.priArr)
          }
        })
      })
    }
  },
  //  单个小票选择对应的打印机
  tickPrint (ticket, priArr, cb) {
    if (!priArr) {
      return cb('打印机对象不存在')
    }
    let arr = priArr.filter(item => ticket.printName === item.name)
    let printTmp = arr[0]
    if (printTmp) {
      let chnObject = printTmp.chnPrinter
      console.log(chnObject, 'printFactory --- chnPrinter')
      chnObject.myCompile(ticket.tpl, function (err) {
        if (err) {
          return cb(err)
        }
        chnObject.beep('\x02')
        chnObject.print(function (err, msg) {
          console.log(msg)
          chnObject.empty()
          if (msg === 'Print successed') {
            return cb(err, msg)
          } else {
            console.error('错误：打印机调用出错,打印的时候失败了')
            return cb(new Error('错误：调用打印机报错'))
          }
        })
      })
      // try {
      //   console.log('编译打印模板')
      //   chnObject.compile(ticket.tpl)
      //   chnObject.beep('\x02')
      // } catch (e) {
      //   console.error('打印机编译compile错误', e)
      //   return cb(new Error(e))
      // }
      // console.log('调用print')
      // chnObject.print(function (err, msg) {
      //   console.log(msg)
      //   chnObject.empty()
      //   if (msg === 'Print successed') {
      //     return cb(err, msg)
      //   } else {
      //     console.error('错误：打印机调用出错')
      //     return cb(new Error('错误：调用打印机报错'))
      //   }
      // })
    } else {
      if (ticket) {
        this.$vue.$notify.error({
          title: '消息提示',
          message: `当前订单${ticket.orderId}的[${ticket.title}]没有找到的${ticket.printerName}打印机`,
          duration: 0
        })
        this.$vue.$http.post('/feeback/save', {
          title: '查看内容',
          content: `当前订单${ticket.orderId}的[${ticket.title}]没有找到的${ticket.printerName}打印机` + JSON.stringify(ticket)
        })
      }
      console.error('当前订单没有找到指定打印机')
      cb(null, '当前订单没有找到指定打印机')
    }
  },
  //  更具小票块循环输出进行打印
  printProcess (tickets, priArr, cb) {
    let self = this
    let ticket = tickets.shift()
    console.log('取出一个ticket', ticket)
    if (ticket) {
      this.tickPrint(ticket, priArr, function (err, msg) {
        if (err) {
          return cb(err)
        }
        self.printProcess(tickets, priArr, cb)
      })
    } else {
      console.log('订单打印完成')
      cb(null, '订单打印完成')
    }
  },
  //  发送由订单拆分出来的小票
  send (tickets, cb, shop) {
    let self = this
    this.createPrinter(function (err, priArr) {
      if (err) {
        return cb(err)
      }
      console.log(priArr)
      console.log('tickets', tickets)
      if (shop && shop.printType === 2) { // 调用printhtml.exe命令进行打印
        console.log('调用printhtml.exe命令进行打印-------')
        self.printExec(tickets, cb)
      } else if (shop && shop.printType === 1) { // 浏览器打印
        console.log('使用chrome浏览器进行打印------------')
        self.printBrower(tickets, cb)
      } else { // 使用原生c模块node-printer 进行打印
        console.log('使用node-printer进行打印------------')
        self.printProcess(tickets, priArr, cb)
      }
    })
  },
  printExec (tickets, cb) {
    htmlValidPrint(tickets, function (err) {
      if (err) return cb(err)
      return cb(null, 'Print successed')
    })
  },
  printBrower (tickets, cb) {
    tickets.forEach(item => {
      item.content = item.tpl
    })
    chromePrint(tickets, function () {
      console.log('Print Successed')
      cb(null, 'Print successed')
    })
  },
  //  转换称列表形式
  coverWebPrint () {
    let arr = []
    this.webPrint.forEach(item => {
      if (item.name) {
        arr.push({name: item.name})
      }
      if (item.btn) {
        if (Array.isArray(item.print)) {
          arr.push(...item.print)
        } else {
          arr.push({name: item.name})
        }
      }
    })
    return arr
  },
  //  去除重复项
  validName (valids, item) {
    if (!valids.some(sdata => sdata.name === item.name)) {
      return {name: item.name, nameMd5: md5(item.name)}
    }
    return null
  },
  //  获取有效的打印机
  getRunPrinters (webPrint) {
    let prints = [...webPrint]
    let valids = []
    prints.forEach(item => {
      if (item.name) {
        let valid = this.validName(valids, item)
        if (valid) {
          valids.push(valid)
        }
      }
      if (item.btn) {
        if (Array.isArray(item.print)) {
          item.print.forEach(pitem => {
            let valid = this.validName(valids, pitem)
            if (valid) {
              valids.push(valid)
            }
          })
        } else {
          let valid = this.validName(valids, {name: item.print})
          if (valid) {
            valids.push(valid)
          }
        }
      }
    })
    return valids
  }
}
// printFactory.init(test2)
export default printFactory
