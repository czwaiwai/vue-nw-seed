/**
 * Created by Administrator on 2018/3/10 0010.
 */
import Vue from 'vue'
import loginComponent from './loginModal'
var instance = null
var getInstance = function () {
  if (!instance) {
    var Constructor = Vue.extend(loginComponent)
    instance = new Constructor({
      el: document.createElement('div')
    })
  }
  document.body.appendChild(instance.$el)
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
    instance.loginVisible = true
  })
}
export default function loginModal (options) {
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
