/**
 * Created by Administrator on 2017/12/13 0013.
 */
function roundTime (cb, time, isfirstRun) {
  var timer
  var second = time || '15000'
  var first = true
  var initNext = function (bool) {
    if (bool === false) {
      clearTimeout(timer)
    }
  }
  var isStop = false
  var loop = function () {}
  var firstNext = initNext
  function next (bool) {
    firstNext = loop
    if (bool !== false || isStop !== true) {
      this._round()
    }
  }
  return {
    start: function () {
      var that = this
      isStop = false
      if (first && isfirstRun) {
        cb(firstNext.bind(that))
        first = false
      }
      this._round()
      return this
    },
    _round: function () {
      var that = this
      timer = setTimeout(function () {
        cb(next.bind(that))
      }, second)
    },
    setTime: function (time) {
      second = time
    },
    stop: function () {
      isStop = true
      firstNext = initNext
      clearTimeout(timer)
      return this
    }
  }
}
export default roundTime
