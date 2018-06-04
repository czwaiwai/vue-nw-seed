# vue-nw-seed

> A seed project with Vue.js and Nw.js

[english](/README.md) | [中文](/docs/README_ZH.md)
#### window 运行条件
``` bash
# 安装window C++ 编译环境 [前提需要先安装net framework 4.5.1]
npm install --global --production windows-build-tools

# 配置python环境变量

# 全局安装nw-gyp编译器
npm install -g nw-gyp

# 安装相关的npm 包
npm install

# 单独安装一下node-sass（每次都没一次安装成功） 
npm install --save-dev node-sass@4.7.2

# 运行一下，会自动去下载相关的nwjs运行文件
npm run dev

# nwjs运行环境，需要重新编译一下node-printer模块
# nw-gyp rebuild --msvs_version=2015 --runtime=node-webkit --target=1.4.5 --target_arch=ia32
# nw-gyp rebuild --target=0.14.7 --arch=ia32 --msvs_version=2015 --target_arch=ia32


# 下面模式在开发环境不能加上 --arch=ia32 否则运行报错
nw-gyp rebuild  --target=0.14.7 --msvs_version=2015

# 上线环境加上 --arch=ia32 运行才能正常不然会报错提示不上win32的应用
nw-gyp rebuild  --target=0.14.7 --msvs_version=2015 --arch=ia32  --target_arch=ia32

# 重新编译一下sqlite模块

# nbuilder_default.iss_bak是打包样式的配置文件的备份，位于nbuilder应用根目录
# dist/UI 存放打包样式的图片文件

```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# only build nw
npm run build --onlyNW

# default is build `setup.exe` in windows
npm run build --noSetup
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## FAQ
### Why nw@0.14.7 ？
Not all of NW.js support `XP`, because from the beginning of `Chromium50` does not support the XP, so if your client want to support XP, the best of version is `0.14.7`. See NW.js's blog: [NW.js v0.14.7 (LTS) Released](https://nwjs.io/blog/v0.14.7/)
