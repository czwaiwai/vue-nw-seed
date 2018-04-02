/**
 * Created by Administrator on 2017/12/13 0013.
 */
function roundTime (cb, time, instant) {
  var timer
  var second = time || '15000'
  return {
    next: function (bool) {
      if (bool !== false) {
        this._round()
      } else {
        clearTimeout(timer)
      }
    },
    start: function () {
      var that = this
      this.bindNext = that.next.bind(this)
      this.bindNext.isValid = true
      if (instant) {
        console.log('我立即执行了')
        cb(this.bindNext)
      } else {
        this._round()
      }
      return this
    },
    _round: function () {
      var that = this
      timer = setTimeout(function () {
        cb(that.bindNext)
      }, second)
    },
    setTime: function (time) {
      second = time
    },
    stop: function () {
      if (this.bindNext) {
        this.bindNext.isValid = false
      } else {
        console.warn('警告：roundTime 没有start还没有就stop了')
      }
      clearTimeout(timer)
      return this
    }
  }
}
export default roundTime
