/**
 * Created by Administrator on 2018/3/8 0008.
 */
// var http = require('http')
// var querystring = require('querystring')
//
// const postData = querystring.stringify({
//   id: '3557366836577280'
// })
//
// var options = {
//   hostname: '192.168.2.114',
//   port: 80,
//   path: 'http://192.168.2.114/ycShop/expFczOrderExecl?exportToExcel=YES&orderId=&status=1&date=&xcode=gzdsmsgc&rcode=',
//   method: 'GET',
//   headers: {
//     'Content-type': 'application/x-www-form-urlencoded',
//     'Content-Length': Buffer.byteLength(postData)
//   }
// }
// var req = http.request(options, function (res) {
//   console.log(res)
//   console.log(`响应头：`, JSON.stringify(res.headers))
//   res.on('data', chunk => {
//     console.log(`响应主题：${chunk}`)
//   })
//   res.on('end', function () {
//     console.log('响应中已无数据。')
//   })
// })
// req.on('error', (e) => {
//   console.log(`请求遇到问题：${e.message}`)
// })
// req.end()
// var path = require('path')
// var saveFile = require('./utils/saveExcel')
// saveFile('/ycShop/expFczOrderExecl?exportToExcel=YES&orderId=&status=1&date=&xcode=gzdsmsgc&rcode=', path.resolve('c:/test1.xlsx'))
// var roundTime = require('./utils/roundTime')
// console.log('立即执行----')
// var round = roundTime(function (next) {
//   console.log('-------start---------')
//   console.log(next.isValid, '??')
//   setTimeout(function () {
//     console.log('我进来了')
//     if (next.isValid) {
//       console.log('hahaha')
//       console.log('-------end-------')
//       next()
//     } else {
//       next(false)
//     }
//   }, 3000)
// }, 1000)
// round.start()
// setTimeout(function () {
//   round.stop()
//   round.start()
// }, 6000)

