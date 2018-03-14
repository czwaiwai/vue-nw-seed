<template>
  <el-dialog title="打卡" :visible.sync="workDialogVisible" width="600px">
    <div>
      <el-radio v-model="hitCard" label="1" border>上班打卡</el-radio>
      <el-radio v-model="hitCard" label="2" border>下班打卡</el-radio>
      <el-radio v-model="hitCard" label="3" border>交班打卡</el-radio>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="workDialogVisible = false">取 消</el-button>
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
        msg: 'hello vue'
      }
    },
    components: {
    }
  }
</script>
