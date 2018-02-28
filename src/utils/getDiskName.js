/**
 * Created by Administrator on 2018/2/7 0007.
 */
var spawn = require('child_process').spawn
var list = spawn('cmd')
// 获取windows 电脑磁盘盘符
let diskNamePromise = (function getDiskName () {
  let promise = new Promise(function (resolve, reject) {
    let tmp = ''
    list.stdout.on('data', function (data) {
      if (data.toString().indexOf('Name') > -1) {
        tmp = data.toString()
      }
    })
    list.stderr.on('data', function (data) {
      reject('获取失败')
    })
    list.on('exit', function (code) {
      resolve(tmp.match(/[A-Z]:/g))
    })
    list.stdin.write('wmic logicaldisk get name\n')
    list.stdin.end()
  })
  return promise
})()
export default diskNamePromise
