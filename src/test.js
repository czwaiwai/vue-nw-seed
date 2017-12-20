/**
 * Created by czwaiwai on 17/12/17.
 */
var fs = require('fs')
var path = require('path')
var Zip = require('node-native-zip')
var archive = new Zip()
//  archive.add('hello.txt', new Buffer('Hello world', 'utf8'))
//  var buffer = archive.toBuffer()
// fs.writeFile('./test1.zip', buffer, function () {
//   console.log('finished')
// })
console.log(path.resolve('/Users/czwaiwai/DownLoads/example'))
archive.addFiles([
  {name: 'Hello.txt', path: path.resolve('/Users/czwaiwai/DownLoads/example/Hello.txt')},
  {name: 'smile.gif', path: path.resolve('/Users/czwaiwai/DownLoads/example/images/smile.gif')}
], function (err) {
  if (err) {
    return console.log(err)
  }
  var buffer = archive.toBuffer()
  fs.writeFile('./test2.zip', buffer, function () {
    console.log('finished')
  })
})
