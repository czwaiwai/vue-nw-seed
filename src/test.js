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
// var chnPos = require('chn-escpos')
// new chnPos('小票机net',function(){
//
//   this.setSize(2).text('中国菜').line()
//     .setSize(3).text('中国菜').line()
//     .setSize(4).text('中国菜').line()
//     .setSize(5).text('中国菜').line()
//     .print(function(){
//       console.log('打印完成')
//     })
// })

let abc = '================================================'

function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var length = val.charCodeAt(i);
    if(length>=0&&length<=128)
    {
      len += 1;
    }
    else
    {
      len += 2;
    }
  }
  return len;
}
function getLineText(val,callback){
  var len = 0
  for (var i = 0; i< val.length ; i++ ){
    var length = val.charCodeAt(i)
    if(length>=0 && length <=128){
      len +=1
      callback(1,len,i)

    }else {
      len +=2
      callback(2,len,i)

    }
  }
}


function center(val,long){
  var valLen= val.length
  var sp = parseInt((long-valLen)/2)
  var tmp = ''
  for(var i= 0;i<sp;i++) {
    tmp+='_'
  }
  var newStr= tmp+val+tmp
  if(newStr.length<long){
    newStr='_'+newStr
  }
  return  newStr
}
function right(val,long) {
  var valLen= (val+'').length
  var sp=long-valLen
  var newStr='';
  for(var i=0 ;i<sp;i++){
    newStr+='_'
  }
  return (newStr+=val)
}

function chineseLine(val,maxLen){
  var newStr = '';
  var beforeLen =0;
  var getLen = 0
  getLineText(val,function(num,len,i){
    var lineLen = len - beforeLen
    if ((lineLen) > maxLen ) {
      newStr+=','
      newStr+=val[i]
      beforeLen =len
    } else if ((lineLen) === maxLen ){
      newStr+=val[i]+','
      beforeLen =len
    } else {
      newStr+=val[i]
    }
    getLen = len
  })
  if(getLen < maxLen) {
    for(var i =0 ; i< maxLen-getLen ;i++){
      newStr +=' '
    }
  }
  return newStr.replace(/,$/,"").split(',')
}

function simgleTextLine(leftTxt,centerTxt,rightTxt){
  var arr = chineseLine(leftTxt,24)
  arr[0]= arr[0] + right(centerTxt,12)+right(rightTxt,12)
  // return arr
  var resLine=''
  arr.forEach(item => {
    resLine += item +'\n'
  })
  return resLine
}
// console.log(simgleTextLine('适得府君书可怜的付家连锁店分时间段飞','X12345','￥12132'))
var tpl= `================================================
<% users.forEach(function(item){ %><%= line(item.left,item.center,item.right) %><% }) %>================================================
`
var line={
  simgleTextLine:simgleTextLine,
  text:function(item){
    return item.left
  },
}

var compiled = _.template(tpl,{'imports':{'line':simgleTextLine}})
let resTPL=compiled({users:[
  {
  left: '早餐系列-套餐',
  center: 'x20',
  right:0
  },
  {
  left: '适得府君书可怜的付家连锁店分时间段飞',
  center: 'x20',
  right:'12200'
  },
  {
  left: '适得府君书可怜的付家连锁店分时间段飞店分时间段飞',
  center: 'x20',
  right:'12200'
  },
]
})
console.log(resTPL)


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
