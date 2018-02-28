//  防抖 高阶函数
const debounce = function (fn, interval) {
  let __self = fn
  let timer
  return function () {
    let __me = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      __self.apply(__me, args)
    }, interval || 250)
  }
}
export default debounce
