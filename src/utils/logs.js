/**
 * Created by Administrator on 2017/12/20 0020.
 */
var log4js = require('log4js')
// var fs = require('fs')
var logConfig = {
  appenders: {
    console: {
      type: 'console'
    },
    dateFile: {
      type: 'dateFile',
      filename: 'c://tmp//fcz',
      pattern: '-yyyy-MM-dd_hh.log',
      alwaysIncludePattern: true,
      level: 'info',
      compress: true
    }
  },
  categories: {
    default: { appenders: ['console', 'dateFile'], level: 'debug' }
  }
}
log4js.configure(logConfig)
const logger = log4js.getLogger('thing')
logger.level = 'info'
// console.log = logger.info.bind(logger)
console.warn = logger.warn.bind(logger)
console.error = logger.error.bind(logger)
export default logger
