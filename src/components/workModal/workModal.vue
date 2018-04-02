<template>
  <el-dialog title="打卡"   @open="open" @close="close"  :visible.sync="visible" width="600px">
    <div>
      <el-radio v-model="hitCard" label="1" border>上班打卡</el-radio>
      <el-radio v-model="hitCard" label="2" border>下班打卡</el-radio>
      <el-radio v-model="hitCard" label="3" border>交班打卡</el-radio>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="hitCardClickHandler">确定</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        hitCard: 0,
        visible: false,
        btnLoading: false
      }
    },
    components: {
    },
    methods: {
      open (e) {
        this.btnLoading = false
        this.hitCard = 0
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      hitCardClickHandler () {
        console.log('-----------------------打卡')
        if (!this.hitCard) {
          return this.$message.warning('请选择你要打的卡')
        }
        this.btnLoading = true
        this.$http.post('/ycRest/assistantSign', {signType: this.hitCard}).then((res) => {
          this.$message({
            message: '你已打卡成功',
            type: 'success'
          })
          this.btnLoading = false
          this.visible = false
        }).catch(() => {
          this.btnLoading = false
        })
      }
    }
  }
</script>
