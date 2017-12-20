/**
 * Created by Administrator on 2017/12/20 0020.
 */
const path = require('path')
var rootPath = path.resolve(process.cwd(), './')
console.log(path.resolve(rootPath, './package.json'))
const config = require('../../package.json')
console.log(config)

export default config
