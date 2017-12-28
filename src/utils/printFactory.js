/**
 * Created by czwaiwai on 17/12/16.
 */
//  const printer = require('printer')
var ChnPrinter = require('chn-escpos')
var printHelper = require('./printHelper')
printHelper(ChnPrinter)
var crypto = require('crypto')
var md5 = function (str) {
  var cryptoMd5 = crypto.createHash('md5')
  cryptoMd5.update(str, 'utf8') // 加入编码
  return cryptoMd5.digest('hex')
}

let printFactory = {
  init (webPrint) {
    console.log(webPrint)
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
    if (this.priArr.every(item => item.chnPrinter)) {
      cb(null, this.priArr)
    } else {
      this.priArr.forEach(priOne => {
        console.log(priOne, i, 'priOne')
        new ChnPrinter(priOne.name, function (err, msg) {
          if (err) {
            console.error('打印机初始化出错')
            return cb(new Error('打印机初始化出错'))
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
    let arr = priArr.filter(item => ticket.printName === item.name)
    let printTmp = arr[0]
    if (printTmp) {
      let chnObject = printTmp.chnPrinter
      chnObject.compile(ticket.tpl).beep('\x02').print(function (err, msg) {
        console.log(msg)
        chnObject.empty()
        if (msg === 'Print successed') {
          return cb(err, msg)
        } else {
          console.error('打印机调用出错')
          return cb(new Error('调用打印机报错'))
        }
      })
    } else {
      cb(null, '当前订单没有找到指定打印机')
    }
  },
  //  更具小票块循环输出进行打印
  printProcess (tickets, priArr, cb) {
    let self = this
    let ticket = tickets.shift()
    if (ticket) {
      this.tickPrint(ticket, priArr, function (err, msg) {
        if (err) {
          return cb(err)
        }
        self.printProcess(tickets, priArr, cb)
      })
    } else {
      cb(null, '订单打印完成')
    }
  },
  //  发送由订单拆分出来的小票
  send (tickets, cb) {
    let self = this
    this.createPrinter(function (err, priArr) {
      if (err) {
        cb(err)
      }
      console.log(self)
      console.log('tickets', tickets)
      // cb(null, '测试订单完成')
      self.printProcess(tickets, priArr, cb)
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
