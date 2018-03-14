/**
 * Created by Administrator on 2018/3/8 0008.
 */
import {imgDomainServer} from './env'
export default function cDownload (url, str, method, cb) {
  console.log(chrome && chrome.downloads)
  var self = this
  if(method === 'GET') {
    url = imgDomainServer + url + '?' + str
  } else {
    url = imgDomainServer + url
  }
  if (chrome && chrome.downloads) {
    chrome.downloads.download({
      url:url,
      method: method || 'POST',
      body: str,
      headers:[{
        name:'content-type',
        value:'application/x-www-form-urlencoded'
      }]
    },function(id) {
      cb && cb(id)
      self.$message.success('文件下载成功，请选择保存的位置')
    })
  } else {
    cb && cb()
    self.$message.error('没有找到chrome下载插件')
  }
}
