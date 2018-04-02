/**
 * Created by Administrator on 2018/2/7 0007.
 */
// var spawn = require('child_process').spawn
// // var list = spawn('cmd')
var os = require('os')
var fs = require('fs')
var path = require('path')
var homePath = os.homedir()
var tmpPath = path.join(homePath, '/tmp')
console.log(tmpPath, '-----')
console.log(path.resolve(tmpPath, 'fcz_application.0.2.6.exe'))
console.log('-----------')
// getDiskName().then(res => {
//   console.log(res)
//   console.log(path.join(res[1], '/tmp'), '---')
//
//   var exists = fs.existsSync(path.join(res[1], '/tmp'))
//   if (!exists) {
//     console.log(fs.mkdirSync(path.join(res[1], '/tmp')), '-------')
//   }
// })
// // 获取windows 电脑磁盘盘符
// function getDiskName () {
//   return new Promise(function (resolve, reject) {
//     let tmp = ''
//     list.stdout.on('data', function (data) {
//       if (data.toString().indexOf('Name') > -1) {
//         tmp = data.toString()
//       }
//     })
//     list.stderr.on('data', function (data) {
//       reject('获取失败')
//     })
//     list.on('exit', function (code) {
//       resolve(tmp.match(/[A-Z]:/g))
//     })
//     list.stdin.write('wmic logicaldisk get name\n')
//     list.stdin.end()
//   })
// }
