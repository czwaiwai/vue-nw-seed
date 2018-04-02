<template>
  <el-dialog width="600px"  @open="open"   @close="close" :close-on-click-modal="false"  title="扫码" :visible.sync="visible" append-to-body>
    <div v-loading="wxPayLoading">
      <el-form  label-width="80px" >
        <div class="grid-x">
          <div class="small-6 text-right scanner"></div>
          <div class="small-6" style="height:150px">
            <div style="font-size: 20px;padding: 10px;line-height: 130px;">使用扫码枪扫描飞常赞用户码</div>
          </div>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">
  .scanner {
    background: url('../../assets/img/scanPay/sanner.png') center no-repeat;
  }
</style>
<script type="text/ecmascript-6">
  import scanner from '../../utils/scanner'
  export default {
    props: {
      url: String,
      params: Object
//      onlyScan: Boolean
    },
    data () {
      return {
        wxPayLoading: false,
        visible: false,
        isSucc: false
      }
    },
    methods: {
      open (e) {
        this.isSucc = false
        this.scanner.start()
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.scanner.stop()
        this.onClose && this.onClose()
        if (!this.isSucc) {
          this.callback(false)
        }
      }
    },
    created () {
      let self = this
      this.scanner = scanner(function (str, done) {
        self.wxPayLoading = true
        console.log('扫描结果', str)
//        if (self.onlyScan) {
//          return setTimeout(function () {
//            self.wxPayLoading = false
//            self.visible = false
//            return done()
//          }, 2000)
//        }
        self.$http.post(self.url, Object.assign({barCode: str}, self.params)).then(res => {
          let resData = res.data
          self.visible = false
          self.wxPayLoading = false
          done()
          self.isSucc = true
          self.callback(resData.data)
        }).catch(() => {
          self.wxPayLoading = false
          done()
        })
      })
    }
  }
</script>
