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
  var loop = function () {}
  var firstNext = initNext
  function next (bool) {
    firstNext = loop
    if (bool !== false) {
      this.start()
    }
  }
  return {
    start: function () {
      var that = this
      if (first && isfirstRun) {
        cb(firstNext.bind(that))
        first = false
      }
      timer = setTimeout(function () {
        cb(next.bind(that))
      }, second)
      return this
    },
    fresh: function (myfn) {
      cb(myfn)
      return this
    },
    stop: function () {
      firstNext = initNext
      clearTimeout(timer)
      return this
    }
  }
}
export default roundTime
