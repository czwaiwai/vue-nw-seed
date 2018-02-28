/**
 * Created by Administrator on 2018/1/23 0023.
 */
import debounce from './debounce'
export default function scanner (cb) {
  var keyStr = ''
  var canScan = true
  var finish = debounce(function (str) {
    keyStr = ''
//  isStart = false
//  有回车符说明是 扫码枪 扫描的结果
    if (str.indexOf('#END') > 0) {
      canScan = false
      let tmp = str.replace('#END', '')
      cb(tmp, function () {
        canScan = true
      })
    }
  }, 100)
  return {
    reload: function () {
      canScan = false
      keyStr = ''
      this.stop()
      this.start()
    },
    start: function () {
      document.addEventListener('keyup', this.event)
    },
    stop: function () {
      document.activeElement.blur()
      document.removeEventListener('keyup', this.event)
    },
    event: function (e) {
      if (!canScan) {
        return
      }
//          用于控制按下ctrl键后才能进行扫码操作
//          if (e.keyCode === 17) {
//            isStart = true
//            return
//          }
//          if (!isStart) return
      if (e.keyCode === 13) {
        keyStr += '#END'
      } else if (e.keyCode > 47 && e.keyCode < 106) {
        keyStr += String.fromCharCode(e.keyCode)
      }
      finish(keyStr)
    }
  }
}
