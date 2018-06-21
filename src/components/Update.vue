<template>
  <section class="body-container">
    <section class="update-container" v-if="!info && !jsonIsLoading">
      <h2>程序员小哥正在疯狂的加班</h2>
      <p>暂无新版本</p>
    </section>
    <section class="update-container text-center" style="padding:40px;" v-if="info">
      <h2>新版本 <small>版本号: {{info.version}}</small></h2>
      <button type="button"  class="button" v-if="!info.isHot && progress < 100" :disabled="progress >= 0 || !saveAsName" @click="autoDownload">自动更新</button>
      <button type="button"  class="button" v-if="info.isHot && progress < 100" :disabled="progress >= 0 || !saveAsName" @click="hotUpdate">立即更新</button>
      <!--<button type="button" class="button" v-if="progress < 100" :disabled="progress >= 0 || !saveAsName" @click="showFileDialog">立即更新</button>-->
      <button type="button  " v-if="progress < 0 && info.canWait" class="button secondary" @click="updateLate">稍后再更</button>
      <input type="file" class="hidden" ref="fileInput" :nwsaveas="saveAsName" @change="startDownload">
      <div class="text-center">
        <p v-if="progress === -2">下载错误 error</p>
        <div v-if="progress >= 0" style="width:600px;margin:0 auto">
          <p class="fs12">当前安装包下载路径为：{{downloadUrl}}</p>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
        </div>
        <p v-if="progress >= 0">下载进度: {{progress}} %</p>
      </div>
      <hr>
      <div class="grid-x">
        <div class="small-6 text-left">
          <h5 >更新内容</h5>
          <div >
            <p v-html="updateInfo"></p>
          </div>
        </div>
        <div class="small-6 text-left">
          <h5>更新说明<small class="padding-left5 " style="color:#656565;">【如果工作正忙，可以选择点击“稍后更新”】</small></h5>
          <div >
            <ol>
              <li class="fs14">点击“立即更新”按钮</li>
              <li class="fs14">等待进度条跑到100%，然后会弹出安装提示框</li>
              <li class="fs14">如果提示框显示解压成功，点击确定按钮并关闭应用重新打开及更新完毕</li>
              <li class="fs14">如果提示框显示解压失败，则关闭应用重新从第一步开始执行</li>
            </ol>
          </div>
          <h5>其他更新方式</h5>
          <div>
            <ul>
              <li class="fs14">您还可以复制以下链接到浏览器进行下载来飞常赞程序<br />
                <span class="fs12 success-text">{{info.packages.win32.url}}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </section>
</template>
<script>
  import { getUpdateJson, parseName, downloadHandle, hotDownload } from '@/utils/update'
  import { Shell, App } from 'nw.gui'
  import Zip from 'node-7z'
  import path from 'path'
  import {getFileFullName} from '../utils/checkAndFilePath'
  export default {
    name: 'update',
    data () {
      return {
        info: null,
        downloadUrl: '',
        jsonIsLoading: true,
        test: '',
        progress: -1  // init: -1, error: -2
      }
    },
    computed: {
      saveAsName () {
        console.log(this.info)
        return parseName(this.info)
      },
      updateInfo () {
        return this.parseUpdateInfo(this.info)
      }
    },
    methods: {
      updateLate () {
        this.$router.replace('/login')
      },
      parseUpdateInfo (info) {
        return info.versionInfo || ''
      },
      showFileDialog (ev) {
        this.$refs.fileInput.click()
      },
      hotUpdate () {
        var execPath = path.dirname(process.execPath)
        var cwdPath = process.cwd()
        console.log(execPath)
        console.log(cwdPath)
        var info = Object.assign({}, this.info)
        var unzipPath = path.join(process.cwd(), '/')
        var fileName = path.join(unzipPath, '/update_' + this.info.version + '.7z')
        this.downloadUrl = fileName
        this.progress = 0
        const file = hotDownload(fileName, info)
        file.on('data', num => { this.progress = Math.ceil(num * 100) })
        file.on('error', () => { this.progress = -2 })
        file.on('end', filePath => {
          this.progress = this.progress < 0 ? this.progress : 100
          console.log(this.progress)
          var task = new Zip()
          console.log(task)
          const loading = this.$loading({
            lock: true,
            text: '正在解压安装新版本，请耐心等待',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          task.extractFull(fileName, unzipPath)
            .then(() => {
              loading.close()
              console.log('解压完成')
              this.$alert('更新成功，关闭软件重新打开即可', '更新提示', {
                confirmButtonText: '关闭软件',
                callback: action => {
                  App.quit()
//                  App.ClearCache()
//                  global.chrome.runtime.reload()
                }
              })
            // 提示让用户重新启动应用
            }).catch(err => {
              loading.close()
              this.$alert('解压出错，请联系管理员').then(action => {
                App.quit()
              })
              console.log('解压错误', err)
            })
        })
      },
      autoDownload () {
        var targetPath = getFileFullName(this.info.name + '-' + this.info.version + '.exe')
        this.downloadUrl = targetPath
        this.progress = 0
        const file = downloadHandle(targetPath, this.info)

        file.on('data', num => { this.progress = Math.ceil(num * 100) })
        file.on('error', () => { this.progress = -2 })

        file.on('end', filePath => {
          this.progress = this.progress < 0 ? this.progress : 100

          // open install file
          setTimeout(() => Shell.openItem(filePath), 300)
//          setTimeout(() => Shell.openExternal(filePath), 500)
        })
      },
      startDownload (ev) {
        const targetPath = ev.target.value
        this.downloadUrl = targetPath
        // reset
        ev.target.value = ''
        if (!targetPath.trim()) return

        this.progress = 0
        const file = downloadHandle(targetPath, this.info)

        file.on('data', num => { this.progress = Math.ceil(num * 100) })
        file.on('error', () => { this.progress = -2 })

        file.on('end', filePath => {
          this.progress = this.progress < 0 ? this.progress : 100

          // open install file
          console.log('更新完成路径', filePath)
          setTimeout(() => Shell.openItem(filePath), 300)
//          setTimeout(() => Shell.openExternal(filePath), 500)
        })
      }
    },
    created () {
      getUpdateJson().catch(err => { console.log(err) }).then(json => {
        this.jsonIsLoading = false
        this.info = json
      })
    }
  }
</script>
<style scoped>
  .hidden {
    display: none;
  }

  .update-btn {
    margin-bottom: 3em;
    padding: 8px 15px;
    outline: none;
    border: 1px solid #2196F3;
    background: transparent;
    cursor: pointer;
    opacity: .5;
    transition: opacity .5s;
  }

  .update-btn:hover {
    opacity: 1;
  }

  .download-progress {
    margin-bottom: 3em;
  }
</style>
