require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var path = require('path')
var express = require('express')
var webpack = require('webpack')
var bodyParser = require('body-parser')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
  // automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)
app.use(bodyParser.urlencoded({ extended: false }))
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
  })
  // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// for upgrade server
var upgrade = config.dev.upgrade
if (upgrade && upgrade.publicPath && upgrade.directory) {
  app.use(upgrade.publicPath, [function(req, res, next) {
    console.log(req.url, JSON.stringify(req.headers))
    next()
  }, express.static(upgrade.directory)])
}
app.post('/pay',function(req,res){
  console.log('/pay', req.params)
  console.log('/pay', req.body)
  console.log('/pay', req.query)
  if (req.body.str === 'VE01022123') {
    setTimeout(function(){
      res.json({
        data:{
        },
        retCode:-1,
        retMsg:'支付失败'
      })
    }, 3000)
  } else {
    setTimeout(function(){
      res.json({
        data:{
        },
        retCode:0,
        retMsg:'支付成功'
      })
    },3000)
  }
})
app.post('/rest/doOrder',function(req,res){
  res.json({"data":{"order":{"accountPrintCount":0,"acctPayAmt":0,"address":"","adjAmt":0,"adjOpuser":"","adjRecipAddr":"","adjRemark":"","assistantIds":"","assistantOp":1,"bankPayAmt":657,"bankTranNo":"","bankType":"","buildTime":"2018-01-24 15:05:33","cancelOpuser":"","cancelReason":"","cancelTime":null,"chgRemark":"","clientType":"m","consumePrintCount":0,"couponAmt":0,"couponDisct":0,"couponId":0,"deliveryFee":0,"deliveryRemark":"","dicMap":{},"fczPrzAmt":0,"fczPrzRemark":"","finishTime":null,"fnActPayAmount":0,"fnAttach":null,"fnChuPrintDetailList":null,"fnRetreatFoodList":null,"id":3734610876400640,"kitchenPrintCount":0,"latePrintCount":0,"occurLocale":"","offPayOpid":0,"offPayRemark":"","offlinePayAmt":0,"orderType":"order","outTradeNo":"","payProxy":"","payRemark":"","payTime":null,"payType":"","posDeviceId":"","printMore":"","printMoreSeq":0,"printMsg":null,"printSaleId":0,"proAmt":657,"proImgs":"/upload/2017/11/22/14/39767dd00e1e4827b9c55c026a39e6a3_$bw640_$bh520_$sma_$w148_$h120.jpg|/upload/2017/11/22/14/5193149435b14b4bb8129f8b005100ca_$bw640_$bh520_$sma_$w148_$h120.jpg|/upload/2017/11/22/14/c2f4afbc324444d69840b57d2540f8b8_$bw640_$bh520_$sma_$w148_$h120.jpg|/upload/2017/11/22/14/2b912282594440c48b90181348d0ff59_$bw640_$bh520_$sma_$w148_$h120.jpg|/upload/2017/11/22/14/090711fee6954604abc5801c68ac49d7_$bw640_$bh520_$sma_$w148_$h120.jpg","proNames":"百香果金桔柠檬水|香橙奶昔|港式丝袜奶茶|芒果奶昔|水果茶","proNum":19,"rcode":"","recipId":0,"refundAmt":0,"refundRemark":"","refundResult":"","refundSaleId":0,"refundSaleMobile":"","refundTime":null,"remark":"","reqIp":"","restPerson":0,"restShop":null,"restShopId":3647981257999360,"restShopName":"非常赞自选店","scanLogId":0,"sellerRemark":"","serveTime":null,"status":0,"tableId":86,"tableNum":"01号桌","totalAmt":657,"userId":100023,"userMobile":"13728905705","userName":"曹正","userRemark":"","vOrderNo":"201801240002","wxUid":"o2bNv1GrrYR4A0BMyZDlI0b6PWGw"}},"msg":"下单成功","oper":"success","retCode":0,"retMsg":"下单成功","status":"y"})
})
app.post('/ycRest/countProSaleData', function(req,res){
  res.json({"data":{"data":{"actAcctpayAmt":"0.24","actBankpayAmt":"0.00","actOfflpayAmt":"0.00","actualAmt":"0.24","count":5,"couponAmt":"0.00","przAmt":"0.00","przCount":0,"refundAmt":"0.00","restPerson":0,"saveAmt":"0.00","scanPayAmt":"0.00","totalAmt":"0.24"},"printList":[{"content":"<% setAlign:c %><% setSize:2 %>日报\n<% setAlign:l %><% setSize:1 %>店铺：非常赞自选店\n统计开始日期：2018-01-31 00:00:00\n统计结束日期：2018-01-31 18:56:12\n------------------------------------------------\n已支付：5笔      实收金额：0.24\n------------------------------------------------\n现金支付：0.00\n线上支付：0.00\n飞常赞支付：0.24\n________________________________________________\n此小票为日报，请妥善保管\n","orderId":0,"pkey":"null","printMore":"","printMoreSeq":0,"printerName":"小票机net","title":"日报"}],"saleBeginTime":"2018-01-31 00:00:00","saleEndTime":"2018-01-31 18:56:12"},"msg":"操作成功！","oper":"success","retCode":0,"retMsg":"操作成功！","status":"y"})
})

function setData(data){
  let tmpJson = {"data":data,
    "msg":"操作成功！",
    "oper":"success",
    "retCode":0,
    "retMsg":"操作成功！",
    "status":"y"}
    return tmpJson;
}
app.post('/rest/doLogin',function(req,res){
  res.json(setData({
    islogin:true
  }))
})

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function() {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    require('./dev-nw')(uri)
  }
})
