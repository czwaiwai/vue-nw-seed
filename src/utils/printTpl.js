/**
 * Created by Administrator on 2017/12/15 0015.
 */
import bus from './bus'
import Vue from 'vue'
function PrintTpl (name, tpl) {
  this.name = name
  this.tpl = tpl
}

function printTplFactory () {
  this.tplCache = {}
}
printTplFactory.prototype.setTicket = function (tickets) {}
printTplFactory.prototype.addTpl = function (printTplObj) {
  this.tplCache[printTplObj.name] = printTplObj
}

let handoverTpl = `<% setAlign:c %><% setSize:2 %><% setStyle:B %>宝山茶楼\n
<% setSize:1 %>================================================\n
<% setAlign:l %>营业时间：2017-12-14 13:19\n
结束时间：2017-12-14 15:53\n
收银员：歪歪\n
<% setSize:2 %><% setStyle:B %>账单汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
账单总数：12\n
用餐人数：4\n
账单总额：1109.00\n
实收总额：1049.00\n
优惠券总额:0.00\n
折扣（改价）优惠总额:0.00\n
活动优惠总额：70.00\n
退款总额：-10.00\n
<% setSize:2 %><% setStyle:B %>营业收款明细\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
现金支付总额：953.00\n
飞常赞支付总额：0.00\n
线上支付总额：96.00\n
------------------------------------------------\n
合计：（12笔）1049.00\n
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
刀叉套餐送8款点心             x4           0
------------------------------------------------\n
小计：                        x42         1109
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售明细\n
<% setSize:1 %><% setStyle:NORMARL %>
================================================\n
<% setStyle:B %>道茶套餐送8款点心\n
<% setStyle:NORMARL %>________________________________________________\n
叉烧小笼包（送）               x1          0\n
------------------------------------------------\n
小计：                        x42         1109\n
`
new PrintTpl('handover',handoverTpl,)


/*
printTplFactory
 */
