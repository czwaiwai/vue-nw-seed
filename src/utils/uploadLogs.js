/**
 * Created by Administrator on 2017/12/20 0020.
 */
var fs = require('fs')
// var os = require('os')
var path = require('path')
var blobStream = require('blob-stream')
const zlib = require('zlib')
const gzip = zlib.createGzip()
// var moment = require('moment')
// var Zip = require('node-native-zip')
// var tmpPath = path.join(os.homedir(), '/tmp')
var tmpPath = process.cwd()
export default function uploadLogs (vue, shopId, date) {
  return new Promise((resolve, reject) => {
    // let nowDate = moment(new Date()).format('YYYYMMDD')
    let fileName
    let filePath
    fileName = 'fcz.log_' + date
    let isExits = fs.existsSync(tmpPath + '/' + fileName)
    if (isExits) {
      filePath = path.resolve(tmpPath, fileName)
    } else {
      fileName = 'fcz.log_' + date + '.gz'
      if (fs.existsSync(path.resolve(tmpPath, fileName))) {
        filePath = path.resolve(tmpPath, fileName)
      } else {
        reject('日志文件不存在' + date)
      }
    }
    const inp = fs.createReadStream(filePath)
    const write = blobStream()
    let read = inp
    if (fileName.indexOf('.gz') === -1) {
      read = inp.pipe(gzip)
    }
    read.pipe(write).on('finish', function () {
      let blob = this.toBlob('application/gzip')
      let formData = new FormData()
      formData.append('shopId', shopId)
      formData.append('logDate', date)
      formData.append('file', blob, 'file.gz')
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
