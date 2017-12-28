<template>
  <section class="body-container">
    <section class="update-container" v-if="!info && !jsonIsLoading">
      <h2>程序员小哥正在疯狂的加班</h2>
      <p>暂无新版本</p>
    </section>
    <section class="update-container text-center" style="padding:40px;" v-if="info">
      <h2>新版本 <small>版本号: {{info.version}}</small></h2>
      <button type="button" class="update-btn" v-if="progress < 100" :disabled="progress >= 0 || !saveAsName" @click="showFileDialog">点我更新</button>
      <input type="file" class="hidden" ref="fileInput" :nwsaveas="saveAsName" @change="startDownload">
    </section>
    <p v-if="progress === -2">下载错误 error</p>
    <p v-if="progress >= 0">下载进度: {{progress}} %</p>
  </section>
</template>

<script>
  import { getUpdateJson, parseName, downloadHandle } from '@/utils/update'
  import { Shell } from 'nw.gui'

  export default {
    name: 'update',
    data () {
      return {
        info: null,
        jsonIsLoading: true,
        progress: -1  // init: -1, error: -2
      }
    },
    computed: {
      saveAsName () {
        console.log(parseName(this.info))
        return parseName(this.info)
      }
    },
    methods: {
      showFileDialog (ev) {
        this.$refs.fileInput.click()
      },
      startDownload (ev) {
        const targetPath = ev.target.value

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
          setTimeout(() => Shell.openExternal(filePath), 100)
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
