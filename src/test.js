/**
 * Created by czwaiwai on 17/12/17.
 */
var _ = require('lodash')
let jiezhangTpl = `<% setAlign:c %><% setSize:2 %>乐稻港式餐厅（结账单）【重打】\\n
<% setSize:1 %>================================================\\n
<% setAlign:l %>账单：201712140031
台号：<% setSize:2 %><% setStyle:BU %>14号桌\\n
<% setSize:1 %><% setStyle:NORMAL %>收银员：曹正\\n
支付方式：<% setSize:2 %><% setStyle:BU %>线上支付\\n
<% setSize:1 %><% setStyle:NORMAL %>
________________________________________________\\n
------------------------------------------------\\n
行      菜品/数量         单价           金额\\n
<# _.each(value,function (item,index) { #>
<% setAlign:l %><#=index #>  茄子肉末饭\\n
          X<#= item #>              45             45\\n
<# }) #>          
________________________________________________\\n
------------------------------------------------\\n
<% setAlign:l %>原价合计：161元\\n
实际支付金额：151元\\n
已优惠：10元\\n
线上支付：151元\\n
<% setSize:2 %><% setStyle:BU %>交易单号：105570043895201712142110716802\\n
<% setSize:1 %><% setStyle:NORMAL %>________________________________________________\\n
来源：飞常赞\\n
下单时间：12-14 12:34:35\\n
打印时间：12-14 13:35:37\\n
地址：广州市花都区白云国际机场候机楼一楼C8111店\\n
电话：020-36067837\\n
`

_.templateSettings.escape = /<#-([\s\S]+?)#>/g
_.templateSettings.evaluate = /<#([\s\S]+?)#>/g
_.templateSettings.interpolate = /<#=([\s\S]+?)#>/g
let compile = _.template(jiezhangTpl)

console.log(compile({value: [1, 2, 3, 4, 5]}))

