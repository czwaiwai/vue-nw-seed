/**
 * Created by czwaiwai on 17/12/16.
 */
//  const printer = require('printer')
var ChnPrinter = require('chn-escpos')
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
    if (this.priArr.every(item => item.chnPrinter)) {
      cb(null, this.priArr)
    } else {
      this.priArr.forEach(priOne => {
        new ChnPrinter(priOne.name, function (err, msg) {
          if (err) {
            return cb(new Error('打印机初始化出错'))
          }
          i++
          priOne.chnPrinter = this
          if (i === this.priArr.length) {
            cb(null, this.priArr)
          }
        })
      })
    }
  },
  //  单个小票选择对应的打印机
  tickPrint (ticket, priArr, cb) {
    let arr = priArr.filter(item => ticket.printName === item.name)
    let printTmp = arr[0]
    let chnObject = printTmp.chnPrinter
    chnObject.compile(ticket.tpl).print(function (err, msg) {
      if (err) {
        return cb(err)
      } else {
        return cb(err, msg)
      }
    })
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
  //  获取有效的打印机
  getRunPrinters (webPrint) {
    let prints = [...webPrint]
    let valids = []
    prints.forEach(item => {
      if (item.name) {
        if (!valids.some(sdata => sdata.name === item.name)) {
          return valids.push({
            name: item.name,
            nameMd5: md5(item.name)
          })
        }
      }
      if (item.btn) {
        if (Array.isArray(item.print)) {
          item.print.forEach(pitem => {
            if (!valids.some(sdata => sdata.name === pitem.name)) {
              return valids.push({
                name: pitem.name,
                nameMd5: md5(pitem.name)
              })
            }
          })
        } else {
          if (!valids.some(sdata => sdata.name === item.name)) {
            return valids.push({
              name: item.name,
              nameMd5: md5(item.name)
            })
          }
        }
      }
    })
    return valids
  }
}
// printFactory.init(test2)
export default printFactory
