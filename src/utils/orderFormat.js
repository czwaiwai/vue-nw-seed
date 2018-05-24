/**
 * Created by Administrator on 2017/12/21 0021.
 */
export function orderSign (list) {
  list.forEach(item => {
    orderSignOne(item)
  })
}
const btnStatus = ['onlyChangeAmt', 'payByCash', 'confirmOrder', 'orderDone']
export function orderSignOne (order) {
  order.isOrder = true
  order.isPrinting = false
  if (order.status === -1 || order.status === 0 || order.status === 2 || order.status === 3) {
    order.btnStatus = btnStatus[0]
  } else if (order.status === 9) {
    order.btnStatus = btnStatus[1]
  } else if (order.status === 1) {
    order.btnStatus = btnStatus[2]
  } else if (order.status === 7 || order.status === 8) {
    order.btnStatus = btnStatus[3]
  }
  if ((order.accountPrintCount + order.consumePrintCount + order.kitchenPrintCount) > 0) {
    order.isPrint = true
  } else if (order.latePrintCount > 0) {
    order.isPrint = true
  } else {
    order.isPrint = false
  }
  return order
}
// 零售订单转化
export function freeOrderSign (list) {
  return list.map(item => {
    item.id = item.id || item.orderId
    item.isPrint = false
    item.isOrder = true
    item.isFreeOrder = true
    return item
  })
}

