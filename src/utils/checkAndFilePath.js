/**
 * Created by Administrator on 2018/3/30 0030.
 */
var fs = require('fs')
var os = require('os')
var path = require('path')
var homePath = os.homedir()
var tmpPath = path.join(homePath, '/tmp')

const getDir = function (tmp) {
  var url = tmp || tmpPath
  var exists = fs.existsSync(url)
  if (!exists) {
    fs.mkdirSync(url)
  }
  return true
}
const getFileFullName = function (version) {
  if (getDir(tmpPath)) {
    return path.resolve(tmpPath, version)
  }
}
const getVersion = function (version) {
  let nameArr = version.match(/fcz_application-([\d|.]+).exe$/)
  if (nameArr) {
    let fileVersion = parseInt(nameArr[1].replace(/\./g, ''))
    return fileVersion
  }
  return null
}
const clearApplicationFile = function (version) {
  var currVersion = getVersion(version)
  if (currVersion) {
    fs.readdir(tmpPath, function (err, files) {
      if (err) {
        return console.log('错误:读取目录出错', err)
      }
      let isDelFile = false
      files.forEach(fileName => {
        var fileVersion = getVersion(fileName)
        if (fileVersion < currVersion) {
          fs.unlinkSync(path.resolve(tmpPath, fileName))
        }
      })
      if (!isDelFile) {
        console.log('没有可删除的安装包文件------')
      }
    })
  } else {
    console.error('当前版本没有抓取成功')
  }
}
module.exports.getDir = getDir
module.exports.getFileFullName = getFileFullName
module.exports.clearApplicationFile = clearApplicationFile
