// 单例函数
const singleton = function (fn) {
  let self
  return function () {
    return self || (self = fn.apply(this, arguments))
  }
}
export default singleton
