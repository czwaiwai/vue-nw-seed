/**
 * Created by Administrator on 2017/12/20 0020.
 */
var fs = require('fs')
var path = require('path')
var filePath = 'c://tmp//fcz-2017-12-20_15.log.gz'
export default function uploadLogs (vue, shopId, date) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), function (err, data) {
      if (err) {
        reject(err)
        return console.log('读取文件失败', err.mesage)
      }
      let formData = new FormData()
      formData.append('shopId', shopId)
      formData.append('logDate', date)
      console.log(formData)
      // let blob = new Blob(data, {type: 'application/gzip'})
      let byteArray = new Uint8Array(data)
      formData.append('file', new Blob([byteArray], {type: 'application/gzip'}), 'file.gz')
      vue.$http.post('/uploadClientLog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        transformRequest: [function (data) {
          return data
        }]
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  })
}
