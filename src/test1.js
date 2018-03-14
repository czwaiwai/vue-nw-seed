/**
 * Created by Administrator on 2017/12/28 0028.
 */
// const zlib = require('zlib')
const fs = require('fs')
const path = require('path')
const os = require('os')
// var blobStream = require('blob-stream')
// const gzip = zlib.createGzip()
// const inp = fs.createReadStream(os.homedir() + '/fcz.log_20171228')
// // const out = fs.createWriteStream('fcz.log_20171228.gz')
// inp.pipe(gzip).pipe(blobStream()).on('finish', function () {
//   var blob = this.toBlob()
//   console.log(blob)
//   // var url = this.toBlobURL()
//   // window.open(url)
// })
// const moment = require('moment')
// let tmpPath = path.resolve(os.homedir(), 'tmp')
// fs.readdir(tmpPath, function (err, files) {
//   if (err) {
//     console.log(err)
//   }
//   let delInt = parseInt(moment().subtract(1, 'days').format('YYYYMMDD'))
//   files.forEach(fileName => {
//     let nameArr = fileName.match(/fcz.log_(\d+)[.gz]?/)
//     if (nameArr) {
//       let dateInt = parseInt(nameArr[1])
//       if (delInt > dateInt) {
//         console.log('删除日志文件' + fileName)
//         fs.unlinkSync(path.resolve(tmpPath, fileName))
//       }
//     }
//   })
// })
function payFormat (order) {
  if (order.adjAmt) {
    return `实际支付总额:${order.adjAmt}元`
  } else {
    if (order.status === 9) {
      return `线下支付:${order.bankPayAmt}元`
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
}
console.log(payFormat({}))
