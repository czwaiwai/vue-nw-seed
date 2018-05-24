/**
 * Created by Administrator on 2018/4/13 0013.
 */
// var os = require('os')
// var fs = require('fs')
// var path = require('path')
// const zlib = require('zlib')
// const gzip = zlib.createGzip()
// var homePath = os.homedir()
// var tmpPath = path.join(homePath, '/tmp')
// console.log(tmpPath, '-----')
// console.log(path.resolve(tmpPath, 'fcz_application.0.2.6.exe'))
// const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
var {getConf, setConf} = require('./utils/storeConfig')

// setConf('haha', '怎么回事323435435643', function (json) {
//   console.log(json)
// })
getConf(function (json) {
  console.log(json)
})

