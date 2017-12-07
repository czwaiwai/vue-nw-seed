/**
 * Created by waiwai on 17-12-7.
 */
let baseUrl
let webUrl
let imgUrl
let http = location.protocol
const domainServer = 'www.fcz360.com'
const imgDomainServer = 'http://www.fcz360.com'
if (process.env.NODE_ENV === 'development') {
  // 测试环境地址
  baseUrl = ''
  webUrl = '/api'
  imgUrl = '/api'
} else {
  http = location.protocol
  baseUrl = http + '//' + domainServer
  webUrl = http + '//' + domainServer
  imgUrl = imgDomainServer
}
export {
  baseUrl,
  webUrl,
  imgUrl
}
