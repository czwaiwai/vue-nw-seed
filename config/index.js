// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

function resolve() {
  return path.resolve.apply(path, [__dirname, '..'].concat(...arguments))
}

// `./package.json`
var tmpJson = require(resolve('./package.json'))

// var curReleasesPath = resolve('./releases', tmpJson.name + '-v' + tmpJson.version)
var curReleasesPath = resolve('./releases', tmpJson.version)

module.exports = {
  build: {
    env: require('./prod.env'),
    index: resolve('./dist/index.html'),
    assetsRoot: resolve('./dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // only build nw
    onlyNW: process.env.npm_config_onlyNW,
    // only build nw
    noSetup: process.env.npm_config_noSetup,
    nw: {
      // manifest for nw
      // the fileds will merge with `./package.json` and build to `./dist/package.json` for NW.js
      // Manifest Format: http://docs.nwjs.io/en/latest/References/Manifest%20Format/
      manifest: ['name', 'appName', 'version', 'description', 'author', { main: './index.html' }, 'manifestUrl', 'window', 'nodejs', 'js-flags', 'node-remote'],

      manifestModules: ['chn-escpos','printer'],
      // see document: https://github.com/nwjs/nw-builder
      builder: {
        files: [resolve('./dist/**')],
        // platforms: ['win32', 'win64', 'osx64'],
        platforms: ['win32', 'win64'],
        version: '0.14.7',
        flavor: 'sdk',
        cacheDir: resolve('./node_modules/_nw-builder-cache/'),
        buildDir: resolve('./releases'),
        winIco: resolve('./build/setup_resources/logo.ico'),
        macIcns: resolve('./build/setup_resources/logo.icns'),
        buildType: function () {
          return this.appVersion
        }
      },
      setup: {
        issPath: resolve('./config/setup.iss'),
        // only one version path
        files: curReleasesPath,
        resourcesPath: resolve('./build/setup_resources'),
        appPublisher: 'vue-nw-seed, Inc.',
        appURL: 'https://github.com/anchengjian/vue-nw-seed',
        appId: '{{A448363D-3A2F-4800-B62D-8A1C4D8F1115}}',
        // data: { name, version, platform }
        outputFileName: function (data) {
          return data.name + '-' + data.version
        }
      },
      upgrade: {
        outputFile: resolve('./releases/upgrade.json'),
        publicPath: 'http://localhost:8080/releases/',
        files: [curReleasesPath]
      }
    }
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api':{
        target:'http://www.fcz360.com',//官网
        // target:'http://192.168.2.106:88',//钟老师电脑
        //target:'http://192.168.2.107:8080',//小婷电脑
        //target:'http://192.168.2.113:88/',//
        changeOrigin:true,
        pathRewrite:{
          '^/api':'/'
        },
        onProxyReq(proxyReq, req, res) {
          if (req.method == 'POST' && req.body && req.headers['content-type']) {
            if (!req.headers['content-type'].startsWith('multipart/form-data')) {
              var body = req.body
              body = Object.keys(body).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
              }).join('&')
              proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
              proxyReq.setHeader('content-length', body.length)
              proxyReq.setHeader('Accept', 'application/json')
              proxyReq.write(body)
              proxyReq.end()
            }
          }
        },
        onProxyRes(proxyRes, req, res) {
          if (proxyRes.headers['set-cookie'] instanceof Array && proxyRes.headers['set-cookie'].length > 0) {
            // 取出 JAVA SESSION 更改 PATH
            // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/admin/; HttpOnly' ]
            // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/; HttpOnly' ]
            var [ session, value ] = proxyRes.headers['set-cookie'][0].split(';')[0].split('=')
            proxyRes.headers['set-cookie'] = [`${session}=${value}; Path=/; HttpOnly`]
          }
        }

      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    upgrade: {
      publicPath: '/releases',
      directory: 'releases'
    }
  }
}
