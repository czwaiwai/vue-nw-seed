/**
 * Created by Administrator on 2017/12/24 0024.
 */
const rules = {
  mobileTel: /^1\d{10}$/,
  nickName: /^[\w\u4e00-\u9fa5\uf900-\ufa2d()（）-]*$/,
  amount: /^(0|[1-9]\d{0,11})(\.\d{0,2})?$/
}
export function passWd (rule, value, callback) {
  if (value && value.length >= 6 && value.length <= 20) {
    callback()
  } else {
    callback(new Error('请输入大于等于6位的密码'))
  }
}
export function mobile (rule, value, callback) {
  if (rules.mobileTel.test(value)) {
    return callback()
  } else {
    return callback(new Error('请输入正确的手机号'))
  }
}
export function amount (rule, value, callback) {
  if (rules.amount.test(value)) {
    return callback()
  } else {
    return callback(new Error('请输入有效的金额'))
  }
}

