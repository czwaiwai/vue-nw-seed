/**
 * Created by Administrator on 2017/12/20 0020.
 */
var fs = require('fs')
var os = require('os')
var path = require('path')
// var moment = require('moment')
var Zip = require('node-native-zip')
var tmpPath = path.join(os.homedir(), '/tmp')
export default function uploadLogs (vue, shopId, date) {
  return new Promise((resolve, reject) => {
    // let nowDate = moment(new Date()).format('YYYYMMDD')
    let fileName
    let filePath
    fileName = 'fcz.log_' + date
    let isExits = fs.existsSync(tmpPath + '/' + fileName)
    if (isExits) {
      filePath = tmpPath + '/' + fileName
    } else {
      fileName = 'fcz.log_' + date + '.gz'
      if (fs.existsSync(path.resolve(tmpPath, '/' + fileName))) {
        filePath = path.resolve(tmpPath, '/' + fileName)
      } else {
        reject('日志文件不存在' + date)
      }
    }
    var archive = new Zip()
    archive.addFiles([
      {name: fileName, path: path.resolve(filePath)}
    ], function (err) {
      if (err) {
        return console.log(err)
      }
      var buffer = archive.toBuffer()
      let byteArray = new Uint8Array(buffer)
      let formData = new FormData()
      formData.append('shopId', shopId)
      formData.append('logDate', date)
      let blob = new Blob([byteArray], {type: 'application/zip'})
      formData.append('file', blob, 'file.zip')
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
    // fs.readFile(path.resolve(filePath), function (err, data) {
    //   if (err) {
    //     reject(err)
    //     return console.log('读取文件失败', err.mesage)
    //   }
    //   let formData = new FormData()
    //   formData.append('shopId', shopId)
    //   formData.append('logDate', date)
    //   console.log(formData)
    //   // let blob = new Blob(data, {type: 'application/gzip'})
    //   let byteArray = new Uint8Array(data)
    //   formData.append('file', new Blob([byteArray], {type: 'application/gzip'}), 'file.gz')
    //   vue.$http.post('/uploadClientLog', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data;'
    //     },
    //     transformRequest: [function (data) {
    //       return data
    //     }]
    //   }).then(res => {
    //     resolve(res)
    //   }, err => {
    //     reject(err)
    //   })
    // })
  })
}
