/**
 * Created by Administrator on 2017/12/21 0021.
 */
export function orderSign (list) {
  list.forEach(item => {
    orderSignOne(item)
  })
}
export function orderSignOne (order) {
  order.isOrder = true
  order.isPrinting = false
  if ((order.accountPrintCount + order.consumePrintCount + order.kitchenPrintCount)) {
    order.isPrint = true
  } else {
    order.isPrint = false
  }
  return order
}
