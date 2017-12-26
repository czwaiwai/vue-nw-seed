/**
 * Created by Administrator on 2017/12/24 0024.
 */
module.exports = function printHelper (ChnPrinter) {
  ChnPrinter.prototype.setFontSize = function (size) {
    if (parseInt(size) < 5) {
      return this.setSize(size)
    } else {
      this._writeCmd('TXT_NORMAL')
      this._writeCmd('LINE_HEIGHT')
      switch (parseInt(size)) {
        case 5:
          this._queue.concat(new Buffer('\x1d\x21\x1b'))
          this._queue.concat(new Buffer('\x1d\x21\x21'))
          break
      }
    }
    return this
  }
}
