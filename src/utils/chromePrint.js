/**
 * Created by Administrator on 2018/3/22 0022.
 */
 var gui = require('nw.gui')
 import eachSeries from 'async/eachSeries'
 function createPrint (tpl) {
   console.log(tpl, '----')
   var div = document.getElementById('printView')
   if (!div) {
     div = document.createElement('div')
     div.setAttribute('id', 'printView')
     div.setAttribute('class', 'print')
     div.innerHTML = tpl
     document.body.appendChild(div)
   } else {
     div.innerHTML = tpl
   }
   return div
 }
 function _print (printerName, pageWidth, pageHeight) {
   var win = gui.Window.get()
   console.log('我准备执行了')
   win.print({
     printer: printerName,
     autoprint: true,
     shouldPrintBackgrounds: false,
     marginsType: 1,
     headerFooterEnabled: false,
     marginsCustom: {marginBottom: 1, marginLeft: 1, marginRight: 1, marginTop: 1},
     mediaSize: {'name': 'CUSTOM', 'width_microns': pageWidth, 'height_microns': pageHeight, 'custom_display_name': 'Letter', 'is_default': true}
   })
 }
 export default function chromePrint (list, callback) {
   eachSeries(list, function (item, next) {
     var div = createPrint(item.content)
     console.log(div, '----------------')
     var subDiv = div.firstChild
     if (!subDiv) {
       return next(new Error('html打印内容未设置'))
     }
     var pageWidth = subDiv.getAttribute('width_microns')
     var pageHeight = subDiv.getAttribute('height_microns')
     var imgClass = subDiv.getAttribute('img_class')
     var imgDiv = subDiv.querySelector('#printViewImg')
     if (imgDiv) {
       var imgUrl = imgDiv.getAttribute('img')
       var img = new Image()
       img.src = imgUrl
       if (imgClass) {
         img.classList.add(imgClass)
       }
       imgDiv.appendChild(img)
       img.onload = function () {
         img.onload = null
         _print(item.printerName, pageWidth, pageHeight)
         setTimeout(function () {
           next()
         }, 1000)
       }
     } else {
       console.log('怎么回事')
       _print(item.printerName, pageWidth, pageHeight)
       console.log('怎么回事2')
       setTimeout(next, 1000)
       console.log('怎么回事3')
     }
   }, callback)
 }
