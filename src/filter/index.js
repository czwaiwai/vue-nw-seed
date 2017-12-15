/**
 * Created by waiwai on 17-5-5.
 */


export default function(Vue){
  Vue.filter('wxImg',function(value){
    if(value.indexOf('wx.qlogo')){
      return value.replace(/\/0$/,"/96");
    }
    return value;
  });
  Vue.filter('numberHidden',function(value){
    if(!value) return;
      let len=value.length,yu=len%2,tou=4-yu,wei=4,num=len-tou-wei;
      let reg= new RegExp("^(\\d{"+tou+"})\\d{"+num+"}(\\d{"+wei+"})$");
      let str=''
      for(let i=0;i<num;i++){
        str+='*';
      }
      return value.replace(reg,"$1"+str+"$2");
  });
  Vue.filter('typeTxt',function(value){
    let typeTxt=["未知","在线充值","提现","商城消费","平台赠送","线下消费","租书服务"];
    return typeTxt[value];
  });
  Vue.filter('mydate',function(input,param="",param1) {
    if(!input) return "";
    if(param1=='noYear'){
      return input.substring(5,10).replace(/-/ig,param);
    }
    return  input.substring(0,10).replace(/-/ig,param);
  })
  Vue.filter('getText',function(input){
    if(!input) return "";
    return input.replace(/<[^>]+>/g,"");
  })
  Vue.filter('currency',function(num){
    if(num==undefined){
      return "--"
    }
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
  })
}
