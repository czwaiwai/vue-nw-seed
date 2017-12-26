/**
 * Created by Administrator on 2017/12/24 0024.
 */
const rules = {
  amount: /^(0|[1-9]\d{0,11})(\.\d{0,2})?$/
}
export function amount (rule, value, callback) {
  if (rules.amount.test(value)) {
    return callback()
  } else {
    return callback(new Error('请输入有效的金额'))
  }
}

