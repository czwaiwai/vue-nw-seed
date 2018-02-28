/**
 * Created by Administrator on 2018/1/16 0016.
 */
var printer = require('printer')
module.exports.getLocalPrinters = function () {
  let list = printer.getPrinters()
  return list.map(item => {
    if (item.jobs && item.jobs.length > 0) {
      item.myPrintType = item.jobs[0].status[0]
      item.waitjobs = item.jobs.length
    } else {
      item.myPrintType = 'STANDBY'
      item.waitjobs = 0
    }
    return item
  })
}
