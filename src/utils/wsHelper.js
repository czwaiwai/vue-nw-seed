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
  start: function (ws, guid) {
    var self = this
    this.timeoutObj = setTimeout(function () {
      console.log('发送ping命令')
      console.log(ws)
      try {
        ws.send('ping' + '_' + guid)
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
const wsHelper = function (url, cb, guid) {
  console.log(wsUrl)
  this.fn = cb
  this.url = url
  this.lockReconnect = false
  this.justExit = false
  this.guid = guid
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
    // console.log(self.ws)
    heartCheck.reset().start(self.ws, self.guid)
    console.log('ws onopen')
  }
  this.ws.onclose = function (e) {
    if (!self.justExit) {
      self.reconnect()
    } else {
      console.log('仅仅关闭连接不需要重连')
      self.justExit = false
    }
    console.log('ws onclose', e)
  }
  this.ws.onerror = function (e) {
    self.reconnect()
    console.error('ws onerror', e)
  }
  this.ws.onmessage = function (event) {
    heartCheck.reset().start(self.ws, self.guid)
    console.log('ws onmessage', event)
    cb(event, self.ws)
  }
}
wsHelper.prototype.send = function (msg) {
  this.ws.send(msg)
}
wsHelper.prototype.close = function (msg) {
  console.log('主动调用ws关闭')
  this.justExit = true
  this.ws.close()
}
wsHelper.prototype.reconnect = function () {
  var self = this
  console.log('reconnect', '已经执行 -- - -- lockReconnect' + this.lockReconnect)
  if (this.lockReconnect) return
  this.lockReconnect = true
  console.log('执行到了没有')
  setTimeout(() => {
    self.ws = new WebSocket(self.url)
    self.bind(self.fn)
    self.lockReconnect = false
  }, 10000)
}

export default wsHelper

