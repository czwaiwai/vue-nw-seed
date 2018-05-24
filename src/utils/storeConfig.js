/**
 * Created by Administrator on 2018/4/18 0018.
 */
var fs = require('fs')
var path = require('path')
var tmpPath = process.cwd()
console.log(tmpPath)
tmpPath = path.join(tmpPath, '/conf.json')

export function setConf (name, value, cb) {
  getConf(function (json) {
    var tmpJson = {}
    var ws = fs.createWriteStream(tmpPath)
    if (json) {
      json[name] = value
      tmpJson = json
      ws.write(JSON.stringify(json))
    } else {
      var jsonObj = {}
      jsonObj[name] = value
      tmpJson = jsonObj
      ws.write(JSON.stringify(jsonObj))
    }
    ws.end('', 'utf8', function () {
      cb(tmpJson)
    })
  })
}
export function getConf (cb) {
  if (fs.existsSync(tmpPath)) {
    var rs = fs.createReadStream(tmpPath)
    rs.setEncoding('utf8')
    var text = ''
    rs.on('data', (chunk) => {
      text += chunk
    })
    rs.on('error', (err) => {
      console.log(err)
    })
    rs.on('end', () => {
      console.log(text)
      var json = JSON.parse(text)
      cb(json)
    })
  } else {
    cb()
  }
}
// export.setConf = setConf
// module.exports.getConf = getConf
