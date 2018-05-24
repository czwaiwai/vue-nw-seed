/**
 * Created by Administrator on 2018/4/20 0020.
 */
import { wsUrl } from './env'
var heartCheck = {
  timeout: 60000, // 60秒
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function (ws) {
    var self = this
    this.timeoutObj = setTimeout(function () {
      console.log('发送ping命令')
      console.log(ws)
      try {
        ws.send('ping')
        self.serverTimeoutObj = setTimeout(function () {
          console.log('关闭了ws')
          ws.close()
        }, self.timeout)
      } catch (e) {
        ws.close()
      }
    }, this.timeout)
  }
}
const wsHelper = function (url, cb) {
  console.log(wsUrl)
  this.fn = cb
  this.url = url
  this.lockReconnect = false
  console.log('-----------------------')
  try {
    this.ws = new WebSocket(this.url)
    console.log(this.ws, 'ws')
  } catch (e) {
    this.reconnect()
  }
  this.bind(cb)
}
wsHelper.prototype.bind = function (cb) {
  var self = this
  this.ws.onopen = function () {
    console.log(self.ws)
    heartCheck.reset().start(self.ws)
    console.log('ws onopen')
  }
  this.ws.onclose = function () {
    self.reconnect()
    console.log('ws onclose')
  }
  this.ws.onerror = function () {
    self.reconnect()
    console.log('ws onerror')
  }
  this.ws.onmessage = function (event) {
    heartCheck.reset().start(self.ws)
    console.log('ws onmessage', event)
    cb(event, self.ws)
  }
}
wsHelper.prototype.send = function (msg) {
  this.ws.send(msg)
}
wsHelper.prototype.reconnect = function () {
  var self = this
  console.log('reconnect', '已经执行 -- - -- ')
  if (this.lockReconnect) return
  this.lockReconnect = true
  setTimeout(() => {
    self.ws = new WebSocket(self.url)
    self.bind(self.fn)
    self.lockReconnect = false
  }, 3000)
}

export default wsHelper

