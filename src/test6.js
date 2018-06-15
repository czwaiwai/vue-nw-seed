var {htmlListPrint, htmlSet, htmlParallelPrint} = require('./utils/htmlPrinter')
var html = `<!DOCTYPE html>
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
__CONTENT__
</div>
</body>
</html>`
// htmlSet.set(html)
var list = [{"content":"<div style=\"margin:0;padding:0;\" width_microns=\"58000\" height_microns=\"215000\"><p class=\"center\">西二三层逸臣商场(B9205)</p><p>日期：2018-06-11 17:18:08</p><p>单号：3930090911351808</p> <p>营业员：歪歪</p><p>_______________________</p><table><tr><th class=\"fs12\">商品数量</th><th class=\"fs12\">售价</th><th class=\"fs12\">小计</th></tr><tr><td colspan=\"3\" class=\"fs12\">108g 老肥彭卤味鸭脖[108g 会员特价]</td></tr><tr><td class=\"fs12\">2</td><td class=\"fs12\">￥9.9</td><td class=\"fs12\">￥19.8</td></tr></table><p>总数量：2</p><p>总金额：￥19.8</p><p>实收：￥19.8</p><p>收款方式：线上支付</p><p>________________________</p><p class=\"center\">谢谢惠顾，欢迎下次光临</p><p class=\"center\">请保存好本小票，作为退换货依据</p></div>","orderId":3930090911351808,"pkey":"3930090911351808","printMore":"","printMoreSeq":0,"printerName":"POS58","shopType":2,"title":"线下商城小票"},{"content":"<div style=\"margin:0;padding:0;\" width_microns=58000 height_microns=215000><p class=\"center\">西二三层逸臣商场(B9205)</p><p>日期：2018-06-11 17:18:08</p><p>单号：3930090911351808</p> <p>营业员：歪歪</p><p>_______________________</p><table><tr><th class='fs12'>商品数量</th><th class='fs12'>售价</th><th class='fs12'>小计</th></tr><tr><td colspan='3' class='fs12'>108g 老肥彭卤味鸭脖[108g 会员特价]</td></tr><tr><td class='fs12'>2</td><td class='fs12'>￥9.9</td><td class='fs12'>￥19.8</td></tr></table><p>总数量：2</p><p>总金额：￥19.8</p><p>实收：￥19.8</p><p>收款方式：线上支付</p><p>________________________</p><p class=\"center\">谢谢惠顾，欢迎下次光临</p><p class=\"center\">请保存好本小票，作为退换货依据</p></div>","orderId":3930090911351808,"pkey":"3930090911351808","printMore":"","printMoreSeq":0,"printerName":"POS58","shopType":2,"title":"线下商城小票"}]
htmlParallelPrint(list, function(err) {
  console.log(err, '-------------')
})
