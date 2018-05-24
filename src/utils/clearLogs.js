/**
 * Created by Administrator on 2017/12/29 0029.
 */
const fs = require('fs')
const path = require('path')
// const os = require('os')
const moment = require('moment')
// let tmpPath = path.resolve(os.homedir(), 'tmp')
let tmpPath = process.cwd()
export function clearLogs (beforeDays = 7) {
  fs.readdir(tmpPath, function (err, files) {
    if (err) {
      return console.log('错误:读取目录出错', err)
    }
    let delInt = parseInt(moment().subtract(beforeDays, 'days').format('YYYYMMDD'))
    let isDelFile = false
    files.forEach(fileName => {
      let nameArr = fileName.match(/fcz.log_(\d+)[.gz]?/)
      if (nameArr) {
        let dateInt = parseInt(nameArr[1])
        if (delInt > dateInt) {
          isDelFile = true
          console.log('删除日志文件' + fileName)
          fs.unlinkSync(path.resolve(tmpPath, fileName))
        }
      }
    })
    if (!isDelFile) {
      console.log('没有可删除的日志文件------')
    }
  })
}
