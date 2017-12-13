/**
 * Created by Administrator on 2017/12/13 0013.
 */
function roundTime (cb, time, isfirstRun) {
  var timer
  var second = time || '15000'
  var first = true
  function next (bool) {
    if (bool !== false) {
      this.start()
    }
  }
  function fn () {}
  return {
    start: function () {
      var that = this
      if (first && isfirstRun) {
        first = false
        cb(fn)
      }
      console.log('运行中')
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
      clearTimeout(timer)
      return this
    }
  }
}
export default roundTime
