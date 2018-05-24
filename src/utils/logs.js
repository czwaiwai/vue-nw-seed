/**
 * Created by Administrator on 2017/12/20 0020.
 */
var log4js = require('log4js')
// var os = require('os')
var fs = require('fs')
var path = require('path')
// var homePath = os.homedir()
// var tmpPath = path.join(homePath, '/tmp')
var tmpPath = process.cwd()
// var exists = fs.existsSync(tmpPath)
// if (!exists) {
//   fs.mkdir(tmpPath, function (err) {
//     if (err) {
//       console.log(err)
//     }
//   })
// }

function getDir (tmp) {
  var url = tmp || tmpPath
  var exists = fs.existsSync(url)
  if (!exists) {
    fs.mkdirSync(url)
  }
  return true
}
var logConfig = {
  appenders: {
    console: {
      type: 'console'
    },
    dateFile: {
      type: 'dateFile',
      filename: path.resolve(tmpPath, 'fcz.log'),
      pattern: '_yyyyMMdd',
      alwaysIncludePattern: true,
      level: 'info',
      compress: true
    }
  },
  categories: {
    default: { appenders: ['console', 'dateFile'], level: 'debug' }
  }
}
function getLogger (disk) {
  let logger = null
  let newUrl
  if (disk) {
    newUrl = path.join(disk, '/tmp')
    logConfig.appenders.dateFile.filename = path.resolve(newUrl, 'fcz.log')
  }
  if (getDir(newUrl)) {
    log4js.configure(logConfig)
    const logger = log4js.getLogger('thing')
    logger.level = 'info'
    if (process.env.NODE_ENV !== 'development') {
      console.log = logger.info.bind(logger)
      console.warn = logger.warn.bind(logger)
      console.error = logger.error.bind(logger)
    }
    logger.info('测试日志是否输出')
  }
  return logger
}
export default getLogger
