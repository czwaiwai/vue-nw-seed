/**
 * Created by Administrator on 2018/5/21 0021.
 */
var eachSeries = require('async/eachSeries')
var parallel = require('async/parallel')
var execPrint = require('./execPrint')
var htmlSet = (function () {
  var html = ''
  return {
    set (htmlTpl) {
      html = htmlTpl
    },
    get () {
      return html || ''
    }
  }
})()
function getHtml (content) {
  console.log(htmlSet.get(), 'html get')
  var html = htmlSet.get().replace('__CONTENT__', content) || `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
    *,html,body {
      padding:0;
      margin:0;
      font-size:12px;
      font-family: 微软雅黑;
    }
    p {
      margin:0;
    }
    table{
      width:100%;
    }
    img {
      max-width:100%;
    }
  </style>
</head>
<body style="width:400px;">
<div style="page-break-after:always;">
${content}
</div>
</body>
</html>`
  console.log(html.replace(/\r\n/g, '').replace(/\n/g, ''))
  return html.replace(/\r\n/g, '').replace(/\n/g, '')
}

function htmlPrint (item, callback) {
  let html = item.tpl || item.content
  let printer = item.printName || item.printerName
  if (!html) {
    return callback(new Error('没有找到模板内容'))
  }
  if (!printer) {
    return callback(new Error('没有指定打印机'))
  }
  let tpl = getHtml(html)
  execPrint(tpl, printer, callback)
}
// 一个接着一个打印
function htmlListPrint (list, callback) {
  eachSeries(list, htmlPrint, callback)
}
// 并行打印
function htmlParallelPrint (list, callback) {
  let tmpArr = []
  list.forEach((item) => {
    tmpArr.push(function (next) {
      htmlPrint(item, next)
    })
  })
  parallel(tmpArr, callback)
}

function htmlValidPrint (list, callback) {
  if (list && list.length === 0) {
    return callback(new Error('打印列表长度为空'))
  }
  if (list.length === 1) {
    return htmlPrint(list[0], callback)
  } else {
    return htmlListPrint(list, callback)
  }
}

module.exports.htmlSet = htmlSet

module.exports.htmlPrint = htmlPrint

module.exports.htmlListPrint = htmlListPrint

module.exports.htmlParallelPrint = htmlParallelPrint

module.exports.htmlValidPrint = htmlValidPrint

