/**
 * Created by Administrator on 2017/12/15 0015.
 */
import _ from 'lodash'
_.templateSettings.escape = /<@-([\s\S]+?)@>/g
_.templateSettings.evaluate = /<@([\s\S]+?)@>/g
_.templateSettings.interpolate = /<@=([\s\S]+?)@>/g
var tplObj = {
  handoverTpl: `<% setAlign:c %><% setSize:2 %><% setStyle:B %><@=restName @>（交班单）\n
<% setSize:1 %>================================================\n
<% setAlign:l %>营业时间：<@=saleBeginTime @>\n
结束时间：<@=saleEndTime @>\n
收银员：歪歪\n
<% setSize:2 %><% setStyle:B %>账单汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
账单总数：<@=data.count @>\n
用餐人数：<@=data.restPerson || 0 @>\n
账单总额：<@=data.totalAmt @>\n
实收总额：<@=data.actualAmt @>\n
优惠券总额:<@=data.couponAmt @>\n
折扣（改价）优惠总额:<@=data.saveAmt @>\n
活动优惠总额：<@=data.przAmt @>\n
退款总额：<@=data.refundAmt @>\n
<% setSize:2 %><% setStyle:B %>营业收款明细\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
现金支付总额：(<@=data.offlPayCount @>)笔<@=data.actOfflpayAmt @>\n
飞常赞支付总额：(<@=data.fczPayCount @>)笔<@=data.actAcctpayAmt @>\n
线上支付总额：(<@=data.onlinePayCount @>)笔<@=data.actBankpayAmt @>\n
------------------------------------------------\n
合计：（<@=data.count @>笔）<@=data.actualAmt @>\n
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
<@ sortList.forEach(function(item){ @>
<@=item.sortName @>             X<@=item.fnCount @>           <@=item.fnAmount @>\n
<@ }) @>
------------------------------------------------\n
小计：                        X<@=totalCount @>         <@=totalAmount @>
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售明细\n
<% setSize:1 %><% setStyle:NORMARL %>
================================================\n
<@ sortList.forEach(function(item){ @>
<@ if(item.fnCount){ @>
<% setStyle:B %><@=item.sortName @>\n
<% setStyle:NORMARL %>________________________________________________\n
<@ item.fnAttach.forEach(function(items){ @>
<@=items.restProName @>               x<@=items.buyCount @>          <@=items.amount @>\n
<@ }) @>
------------------------------------------------\n
小计：                        x<@=item.fnCount @>         <@=item.fnAmount @>\n
<@ } @>
<@ }) @>
`,
  dayPaperTpl: `<% setAlign:c %><% setSize:2 %>日报\n
<% setAlign:l %><% setSize:1 %>店铺：<@=restName @>\n
统计开始日期：<@=saleBeginTime @>\n
统计结束日期：<@=saleEndTime @>\n
------------------------------------------------\n
已支付：<@= count @>笔      实收金额：<@=actualAmt @>\n
------------------------------------------------\n
现金支付：<@=actOfflpayAmt @>\n
线上支付：<@=actBankpayAmt @>\n
飞常赞支付：<@=actAcctpayAmt @>\n
________________________________________________\n
此小票为日报，请妥善保管\n
`,
  consumptionTpl: `<% setAlign:c %><% setSize:2 %><@=restShopName @>（消费单）\n
<% setSize:1 %>================================================\n
<% setAlign:l %>桌号：<% setSize:2 %><% setStyle:BU %><@=tableNum @>\n
<% setSize:1 %><% setStyle:NORMAL %>账单：<@=vOrderNo @>\n
收款员：<@=userName @>\n
日期：<@=buildTime @> \n
来源：飞常赞 \n
支付方式：<% setStyle:B %><% setSize:2 %><@=payText  @> \n
<% setAlign:l %><% setStyle:NORMAL %><% setSize:1 %>
_______________________________________________\n
<@ fnAttach.forEach(function(item,index){  @>
<@=item.restProName @><@=item.attr?"["+item.attr+"]":"" @>\n
<@=item.perCash @>           X<@=item.buyCount @>                  <@=item.amount @>\n
<@ }) @>
原价合计：<@=totalAmt @>元\n
实际支付金额：<@=fnActPayAmount @>元 \n
<@ if(userRemark){ @>用户备注：<@=userRemark @>\n<@ } @>
<@ if(couponAmt){ @>优惠券抵扣：<@=couponAmt @>元\n><@ } @>
<@ if(fczPrzAmt){ @>已优惠：<@=fczPrzAmt @>元\n<@ } @>
<@=payFormat @>
<@ if(refundAmt){ @>退款金额：<@= refundAmt @>元<@ } @>
------------------------------------------------\n
地址：<@= restShop.address @>\n
电话：<@= restShop.telephone @>\n
<% setAlign:c %>请保存好本小票，作为退换货依据\n
`,
  billingTpl: `<% setAlign:c %><% setSize:2 %><@= restShopName @><@ if(refundAmt){ @>（撤销单）<@ }else{ @>（结账单）<@ } @>\n
<% setSize:1 %>================================================\n
<% setAlign:l %>账单：<@=vOrderNo @>\n
台号：<% setSize:2 %><% setStyle:BU %><@=tableNum @>\n
<% setSize:1 %><% setStyle:NORMAL %>收银员：<@=userName @>\n
支付方式：<% setSize:2 %><% setStyle:BU %><@=payText  @>\n
<% setSize:1 %><% setStyle:NORMAL %>
________________________________________________\n
------------------------------------------------\n
行      菜品/数量         单价           金额\n
<@ fnAttach.forEach(function(item,index){  @>
<% setAlign:l %><@=index+1 @>  <@=item.restProName @><@=item.attr?"["+item.attr+"]":"" @>\n
          X<@=item.buyCount @>             <@=item.perCash @>             <@=item.amount @>\n
<@ }) @>
________________________________________________\n
------------------------------------------------\n
<@ if(userRemark){ @>用户备注：<@=userRemark @><@ } @>\n
<% setAlign:l %>原价合计：<@=totalAmt @>元\n
实际支付金额：<@=fnActPayAmount @>元\n
<@ if(couponAmt){ @>优惠券抵扣：<@=couponAmt @>元 <@ } @>\n
<@ if(fczPrzAmt){ @>已优惠：<@=fczPrzAmt @>元 <@ } @>\n
<@=payFormat @>
<@ if(refundAmt){ @>退款金额：<@= refundAmt @>元<@ } @>
<% setSize:1 %><% setStyle:NORMAL %>________________________________________________\n
来源：飞常赞\n
下单时间：<@=buildTime @>\n
打印时间：<@=printTime @>\n
地址：<@=restShop.address @>\n
<@ if(restShop.telephone){ @>电话：<@= restShop.telephone @><@ } @>\n
`,
  kitchenTpl: `<% setAlign:l %><% setSize:1 %><@=restShopName @>（<@=typeName @>）\n
<@ if(isBack){ @><% setAlign:r %><% setSize:3 %><% setStyle:B %>  *退菜*\n<@ } @>
<% setAlign:l %><% setSize:3 %><% setStyle:B %>台：<@=tableNum @>\n
<% setAlign:l %> <@=restProName @>\n
<% setAlign:r %>x<@=buyCount || 1 @>\n
<% setAlign:l %> <@= attr?"["+attr+"]":"" @>\n
<% setSize:1 %><% setStyle:NORMAL %>________________________________________________\n
<@ if(userRemark){ @><% setSize:3 %><% setStyle:B %>用户备注：<@=userRemark @>\n<@ } @>
<% setSize:1 %><% setStyle:NORMAL %>账单：<@=vOrderNo @>\n
收银员：<@=userName @>\n
来源：飞常赞\n
下单：<@=buildTime @>\n
打印：<@=printTime @>\n
`
}
//  服务器提供的webTpl
export function webTplFn (tpl) {
  return function (obj) {
    let compile = _.template(tpl[obj.tplName + 'Tpl'])
    return compile(obj)
  }
}
// 本地提供的tpl
export function tplFn (obj) {
  let compile = _.template(tplObj[obj.tplName + 'Tpl'])
  return compile(obj)
}

