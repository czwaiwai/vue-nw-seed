/**
 * Created by Administrator on 2018/2/24 0024.
 */
export function currency (num) {
  if (num === undefined) {
    return '--'
  }
  if (isNaN(num)) {
    num = '0'
  }
  let sign = (num == (num = Math.abs(num)))
  num = Math.floor(num * 100 + 0.50000000001)
  let cents = num % 100
  num = Math.floor(num / 100).toString()
  if (cents < 10) {
    cents = '0' + cents
  }
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3))
  }
  return (((sign) ? '' : '-') + num + '.' + cents)
}

export function amountFix(amount){
  return  Math.round(amount*100)/100;
}
 //计算券的金额
export function getQuanAmt(quan,amt){
  let tmp=0;
  if(!amt) return tmp;
  if(!quan) return tmp;
  //现金券
  if(quan.amount){
    tmp = amountFix(quan.amount);
  }
  if(quan.cpDisct){
    tmp= amountFix(amt*(1-quan.cpDisct));
    if(quan.maxDisctAmt && tmp>quan.maxDisctAmt){
      tmp=amountFix(quan.maxDisctAmt);
    }
  }
  return tmp
}
let modObj={
  all:"全场",
  shop:"商城",
  rest:"餐饮",
  book:"书店",
}
export function moduleQuan(ctx,currMod){
  if(!ctx.availApkind || ctx.availApkind==="all" || ctx.availApkind===currMod){
    return true;
  }else{
    setQuanTxt(ctx);
    ctx.validType=-2;
    ctx.validTxt="仅"+modObj[ctx.availApkind]+"可用";
    return false;
  }
}
function timeThan(before,after){
  let beforeStamp=before &&  new Date(before.replace(/\-/g,"/")).valueOf();
  let afterStamp=after && new Date(after.replace(/\-/g,"/")).valueOf();
  let nowStamp =new Date().valueOf();
  if(beforeStamp && beforeStamp>nowStamp){
    return 0;//未生效
  }
  if(afterStamp && afterStamp<nowStamp){
    return -1;//已过期
  }
  return 1;
}
/* 店员分类 */
export function formatShopType(context,type){
  if(type==99) return;
  if(context.cpType!=type){
    context.validType=-2;
    context.validTxt="条件不足";
  }
}
/*
 *@param ctx 优惠券
 *@param currMod 当前的模块是否匹配
 * all 通用模块
 * shop  商城
 * rest 餐饮
 * book 书店
 *
 */
function setQuanTxt(ctx){
  ctx.quanTxt=ctx.amount>0?"优惠券":"";
  ctx.quanTxt=ctx.refOrderId?"现金券":ctx.quanTxt;
  ctx.quanTxt=ctx.cpDisct>0?"打折券":ctx.quanTxt;
  ctx.quanTxt=ctx.minEftAmt>0?"满"+ctx.minEftAmt+"元减":ctx.quanTxt;
}
/*
 *@param ctx 优惠券
 *@param amount  价格
 *@param type    1为线上  2为线下
 *@param  优惠券模块  all shop rest book
 */

let staArr=["已失效","","已使用","返现中","已返现"];
export function formatQuan(ctx,amount,type){
  setQuanTxt(ctx);
  ctx.validTxt=staArr[ctx.status];
  ctx.validType=0;
  if(ctx.status!=1) return ;
  ctx.validType=timeThan(ctx.eftStartDate,ctx.eftEndDate);
  if(ctx.validType==0){
    ctx.validTxt="未生效";
  }
  if(ctx.validType==-1){
    ctx.validTxt="已过期";
  }
  if(ctx.validType==1){
    //当存在金额时
    if(!isNaN(amount) && ctx.minEftAmt && ctx.minEftAmt>parseFloat(amount)){
      ctx.validType=-2;//金额不足不能使用
      ctx.validTxt="条件不足";
      return ;
    }
    //指明使用为线上还是线下时
    if(ctx.online!=3 && type && ctx.online!=type){
      ctx.validType=-2;
      ctx.validTxt="条件不足";
      return ;
    }
    ctx.validTxt="";
    if(ctx.online==2){
      ctx.validTxt="去使用"
    }
  }
}
