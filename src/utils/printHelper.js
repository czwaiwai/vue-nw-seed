/**
 * Created by Administrator on 2017/12/24 0024.
 */
const MBuffer = require('mutable-buffer')
const qr = require('qr-image')
const Image = require('./image')
const getPixels = require('get-pixels')
var _ = {
  LF: '\x0a',
  FS: '\x1c',
  FF: '\x0c',
  GS: '\x1d',
  DLE: '\x10',
  EOT: '\x04',
  NUL: '\x00',
  ESC: '\x1b',
  EOL: '\n'
}
_.GSV0_FORMAT = {
  GSV0_NORMAL: '\x1d\x76\x30\x00',
  GSV0_DW: '\x1d\x76\x30\x01',
  GSV0_DH: '\x1d\x76\x30\x02',
  GSV0_DWDH: '\x1d\x76\x30\x03'
}
_.CODE2D_FORMAT = {
  TYPE_PDF417: _.GS + 'Z' + '\x00',
  TYPE_DATAMATRIX: _.GS + 'Z' + '\x01',
  TYPE_QR: _.GS + 'Z' + '\x02',
  CODE2D: _.ESC + 'Z',
  QR_LEVEL_L: 'L', // correct level 7%
  QR_LEVEL_M: 'M', // correct level 15%
  QR_LEVEL_Q: 'Q', // correct level 25%
  QR_LEVEL_H: 'H'  // correct level 30%
}

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
  ChnPrinter.prototype.setQrcode = function (code, version, level, size) {
    var buffer = new MBuffer()
    buffer.write(_.CODE2D_FORMAT.TYPE_QR)
    buffer.write(_.CODE2D_FORMAT.CODE2D)
    buffer.writeUInt8(version || 3)
    buffer.write(_.CODE2D_FORMAT['QR_LEVEL_' + (level || 'L').toUpperCase()])
    buffer.writeUInt8(size || 6)
    buffer.writeUInt16LE(code.length)
    buffer.write(code)
    this._queue.concat(new Buffer(buffer.flush()))
    return this
  }
  ChnPrinter.prototype.raster = function (image, mode) {
    if (!(image instanceof Image)) throw new TypeError('Only escpos.Image supported')
    mode = mode || 'normal'
    if (mode === 'dhdw' ||
      mode === 'dwh' ||
      mode === 'dhw') mode = 'dwdh'
    var raster = image.toRaster()
    var header = _.GSV0_FORMAT['GSV0_' + mode.toUpperCase()]
    var mBuffer = new MBuffer()
    mBuffer.write(header)
    mBuffer.writeUInt16LE(raster.width)
    mBuffer.writeUInt16LE(raster.height)
    mBuffer.write(raster.data)
    this._queue.concat(new Buffer(mBuffer.flush()))
    return this
  }
  ChnPrinter.prototype.qrimage = function (content, options, callback) {
    var self = this
    if (typeof options === 'function') {
      callback = options
      options = null
    }
    options = options || {type: 'png', mode: 'dhdw'}
    var buffer = qr.imageSync(content, options)
    var type = ['image', options.type].join('/')
    getPixels(buffer, type, function (err, pixels) {
      if (err) return callback && callback(err)
      self.raster(new Image(pixels), options.mode)
      callback && callback.call(self, null, self)
    })
    return this
  }
  ChnPrinter.prototype.myCompile = function (string, cb) {
    if (typeof string !== 'string') {
      console.log('必须为字符串')
      return this
    }
    var _this = this
    //  替换换行
    var num = 0
    var tpl = string.replace(/[\n\r]+/g, '/n')
    //  替换函数
      .replace(/<%([\s\S]+?)%>/g, function (match, code) {
        if (code.indexOf('qrimage') > -1) {
          var tmp = _this._renderFunc(code)
          tmp = tmp.replace(');', ',function(){')
          num++
          return '",true);\n' + tmp + '\nobj.text("'
        } else {
          return '",true);\n' + _this._renderFunc(code) + '\nobj.text("'
        }
      })
      //  替换换行
      .replace(/\/n/g, '");\nobj.text("')
    tpl = 'obj.text("' + tpl + '")'
    if (num > 0) {
      tpl += ';\ncb && cb.call(obj);\n'
      for (var i = 0; i < num; i++) {
        tpl += '})\n'
      }
      var newFn
      try {
        newFn = new Function('obj', 'cb', tpl)
      } catch (e) {
        return cb(e)
      }
      newFn.call(this, this, cb)
    } else {
      try {
        new Function('obj', tpl).call(this, this)
      } catch (e) {
        return cb(e)
      }
      cb && cb.call(this, null, this)
    }
  }
}
