<template>
  <el-dialog  width="600px" @open="open" @close="close" title="折扣率" :visible.sync="visible" append-to-body>
    <div class="grid-x">
      <div class="discount_wrap small-7 text-center padding-right">
        <div class="title">快速选择</div>
        <div class="grid-x grid-margin">
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="100" style="height:100px;" class="button   expanded  margin5 ">100%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="95"  style="height:100px;" class="button   expanded  margin5 ">95%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="90" style="height:100px;" class="button   expanded  margin5 ">90%</button>
          </div>
        </div>
        <div class="grid-x grid-margin">
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="88" style="height:100px;" class="button   expanded  margin5 ">88%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="85" style="height:100px;" class="button   expanded  margin5 ">85%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="70" style="height:100px;" class="button   expanded  margin5 ">70%</button>
          </div>
        </div>
        <div class="grid-x grid-margin">
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="65" style="height:100px;" class="button   expanded  margin5 ">65%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="60" style="height:100px;" class="button   expanded  margin5 ">60%</button>
          </div>
          <div class="small-4">
            <button type="button" @click="discPercent" data-percent="50"   style="height:100px;" class="button   expanded  margin5 ">50%</button>
          </div>
        </div>
      </div>
      <div class="small-5">
        <el-form :inline="true"  class="form-inline">
          <el-form-item label="折扣率" class="no-margin">
            <el-input v-model="discPercentModel" ref="discPercentInput" placeholder="支付金额" style="text-align:right;width:178px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <div style="margin-top:-5px;" class="padding-bottom15 text-center">
            <vir-keyboard style="display:inline-block;width:240px;" mode="bind" v-model="discPercentModel" :input="$refs.discPercentInput && $refs.discPercentInput.$el.querySelector('input')"></vir-keyboard></div>
          <el-form-item class="padding-left">
            <el-button type="primary" @click="discPercent(discPercentModel)">确认</el-button>
            <el-button type="info" @click="visible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import loginModal from '../loginModal'
  export default {
    data () {
      return {
        visible: false,
        discPercentModel: '100'
      }
    },
    components: {
    },
    methods: {
      open (e) {
        setTimeout(() => {
          let el = this.$refs.discPercentInput && this.$refs.discPercentInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      async discPercent (e) {
        let percent
        if (typeof e === 'string') {
          percent = e
        } else {
          percent = e.target.dataset.percent
        }
        if (percent) {
          percent = parseInt(percent)
          if (percent > 100) {
            return this.$message.error('请输入100以内的数字')
          }
          if (percent < 100) {
            await this.$confirm('当前折扣需要更高权限认证')
            let res = await loginModal()
            try {
              let resVal = await this.$http.post('/ycRest/validateRight', res)
              this.visible = false
              this.callback(percent)
//              this.$store.commit('setActiveDiscount', percent)
              console.log('验证结果', resVal)
            } catch (e) {
              console.log(e)
            }
            return
          }
          this.callback(percent)
//          this.$store.commit('setActiveDiscount', percent)
          this.visible = false
        }
      }
    }
  }
</script>
