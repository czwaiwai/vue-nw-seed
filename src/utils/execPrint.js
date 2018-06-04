/**
 * Created by Administrator on 2018/5/18 0018.
 */
var exec = require('child_process').exec
module.exports = function (html, printName, callback) {
  // console.log(__dirname)
  // console.log(process.cwd())
  let path = process.cwd()
  var cmd = `"${path}\\printhtml.exe" printername="${printName}" header="" footer="" topmargin=0 bottommargin=0 leftmargin=0 rightmargin=0 html="${html}" `
  exec(cmd, function (error, stdout, stderr) {
    if (error) return callback(error)
    if (stdout.indexOf('HTML was sent to the printer') > -1) {
      callback(null, stdout)
    } else {
      callback(new Error(stdout))
    }
  })
}

