/**
 * Created by czwaiwai on 17/12/16.
 */
import Vue from 'vue'
import {dayPaperTplFn} from './printTpl'
let order2tickets = {
  init: function (webPrint, restShop) {
    console.log(webPrint, restShop)
    this.webPrint = webPrint
    this.restShop = restShop
  },
  getPrintData () {
    Vue.http.post('').then(res => {
      console.log(res)
    }, err => {
      console.log(err)
    })
  },
  toList: function (order, cb) {
    if (this.isOrder(order)) {

    } else {
      this.normalList()
    }
    console.log(order, cb)
  },
  normalList (obj) {
    dayPaperTplFn(obj)
  },
  isOrder (order) {
    return false
  }
}
export default order2tickets
