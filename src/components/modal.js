/**
 * Created by Administrator on 2018/3/12 0012.
 */
/**
 * Created by Administrator on 2018/3/10 0010.
 */
import store from '../store/'
import Vue from 'vue'
export default function modalFactory (component) {
  var instance = null
  var getInstance = function () {
    if (!instance) {
      var Constructor = Vue.extend(component)
      instance = new Constructor({
        el: document.createElement('div'),
        store
      })
      document.body.appendChild(instance.$el)
    }
    return instance
  }
  var modal = function (options, callback) {
    let instance = getInstance()
    if (options) {
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }
    }
    if (callback) {
      instance.callback = callback
    }
    Vue.nextTick(() => {
      instance.visible = true
    })
  }
  return function (options, checkBefore) {
    // checkBefore && checkBefore()
    return new Promise((resolve, reject) => {
      modal(options, (res) => {
        if (res) {
          resolve(res)
        } else {
          reject(false)
        }
      })
    })
  }
}
