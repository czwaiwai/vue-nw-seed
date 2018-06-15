/**
 * Created by czwaiwai on 17/12/17.
 */
var os = require('os')
var fs = require('fs')
var path = require('path')

var qs = require('qs')
var _ =  require('lodash')
// console.log(qs.stringify({a:1,b:2}))
//
var chnPos = require('chn-escpos')
var printHelper = require('./utils/printHelper')
printHelper(chnPos)
// chnPos.prototype.setFontSize = function (size) {
//   if (parseInt(size) < 5) {
//     return this.setSize(size)
//   } else {
//     this._writeCmd('TXT_NORMAL')
//     this._writeCmd('LINE_HEIGHT')
//     switch (parseInt(size)) {
//       case 5:
//         this._queue.concat(new Buffer('\x1d\x21\x1b'))
//         this._queue.concat(new Buffer('\x1d\x21\x21'))
//         break
//     }
//   }
//   return this
// }
var tpl = '<% setAlign:c %><% setSize:2 %>星妈妈（南宁火车东站）（消费单）'
// var tpl = '<% setAlign:c %><% setSize:2 %>星妈妈（南宁火车东站）（消费单）\n<% setSize:1 %>================================================<% setAlign:l %>桌号：<% setSize:2 %><% setStyle:BU %>B1号桌\n<% setAlign:l %><% setSize:1 %><% setStyle:NORMAL %>账单：201806060007\n<% setAlign:l %><% setSize:1 %><% setStyle:NORMAL %>用餐人数：2\n<% setAlign:l %><% setSize:1 %><% setStyle:NORMAL %>收款员：南宁星妈妈晚班\n日期：2018-06-06 17:37:05\n来源：飞常赞 \n支付方式：<% setStyle:B %><% setSize:2 %>线下支付\n<% setAlign:l %><% setStyle:NORMAL %><% setSize:1 %>\n_______________________________________________\n咖喱鸡腿饭（套餐）\n36.0           X2                  72.0\n原价合计：72.0元\n用户备注：艳\\\n线下支付：72.0元\n实际支付金额：72.0元 \n<% setSize:1 %><% setStyle:NORMAL %>------------------------------------------------\n<% setAlign:l %>打印时间：2018-06-06 17:37:28\n地址：\n电话：0771-2298350\n<% setAlign:c %>请保存好本小票，作为退换货依据'
new chnPos('小票机net',function() {
  var self = this
  self.myCompile(tpl, function (err) {
    if (err) {
      return cb(err)
    }
    self.beep('\x02')
    self.print(function (err, msg) {
      console.log(msg)
      self.empty()
      if (msg === 'Print successed') {
        console.log(err, msg)
      } else {
        console.error('错误：打印机调用出错,打印的时候失败了')
      }
    })
  })
})
// new chnPos('小票机net',function(){
//   this.setFont('a').text('中国菜').line()
//     .setFont('b').text('中国菜').line()
//     .setFont('c').text('中国菜').line()
//     .setFont('d').text('中国菜').line()
//     .setFont('e').text('中国菜').line()
//     .setFont('f').text('中国菜').line()
//     .print(function(){
//       console.log('打印完成')
//     })
//   // this.setSize(2).text('中国菜').line()
//   //   .setSize(3).text('中国菜').line()
//   //   .setSize(4).text('中国菜').line()
//   //   .setSize(5).text('中国菜').line()
//   //   .print(function(){
//   //     console.log('打印完成')
//   //   })
// })


// function simgleTextLine(left,center,right){
//   var text =left.text
//   getLineText(text,function(len,i){
//     var lineLen = len - beforeLen
//     if ((lineLen) > maxLen ) {
//       newStr+=','
//       newStr+=text[i]
//       beforeLen =len
//     } else if ((lineLen) === maxLen ){
//       newStr+=text[i]+','
//       beforeLen =len
//     } else {
//       newStr+=text[i]
//     }
//   })
// }

// path()
// console.log(os.homedir())
// var tmpPath = path.join(os.homedir(), '/tmp')
// var exists = fs.existsSync(tmpPath)
// console.log('是否存在此路径', exists)
// if (!exists) {
//   console.log('路径不存在')
//   fs.mkdir(tmpPath, function () {
//     console.log('创建路径成功')
//   })
// }
// var Zip = require('node-native-zip')
// var archive = new Zip()
// //  archive.add('hello.txt', new Buffer('Hello world', 'utf8'))
// //  var buffer = archive.toBuffer()
// // fs.writeFile('./test1.zip', buffer, function () {
// //   console.log('finished')
// // })
// console.log(path.resolve('/Users/czwaiwai/DownLoads/example'))
// archive.addFiles([
//   {name: 'Hello.txt', path: path.resolve('/Users/czwaiwai/DownLoads/example/Hello.txt')},
//   {name: 'smile.gif', path: path.resolve('/Users/czwaiwai/DownLoads/example/images/smile.gif')}
// ], function (err) {
//   if (err) {
//     return console.log(err)
//   }
//   var buffer = archive.toBuffer()
//   fs.writeFile('./test2.zip', buffer, function () {
//     console.log('finished')
//   })
// })
