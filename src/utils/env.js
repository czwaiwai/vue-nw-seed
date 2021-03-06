/**
 * Created by waiwai on 17-12-7.
 */
let baseUrl
let webUrl
let imgUrl
let wsUrl
let http = 'http:'
let host = ''
const domainServer = 'www.fcz360.com'
const imgDomainServer = 'http://www.fcz360.com'

if (process.env.NODE_ENV === 'development') {
  // 测试环境地址
  baseUrl = ''
  host = window.location.host
  webUrl = '/api'
  imgUrl = '/api'
  wsUrl = 'ws://' + host
} else {
  // http = location.protocol
  baseUrl = http + '//' + domainServer
  webUrl = http + '//' + domainServer
  imgUrl = imgDomainServer
  wsUrl = 'wss://' + domainServer
}
export {
  baseUrl,
  webUrl,
  imgUrl,
  wsUrl,
  imgDomainServer
}
