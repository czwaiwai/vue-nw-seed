<template>
  <el-dialog title="创建订单" @open="open" @close="close" :visible.sync="visible" width="600px">

    <el-select v-model="deskNo" placeholder="请选择桌号">
      <el-option
        v-for="item in deskNoArr"
        :key="item.id"
        :label="item.tableNum"
        :value="item.id">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  export default{
    props: {
      deskNoArr: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        shopRestName: '',
        visible: false,
        deskNo: ''
      }
    },
    methods: {
      open (e) {
        this.deskNo = ''
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      confirm () {
        if (!this.deskNo) {
          return this.$message.warning('桌号不能为空~')
        }
        this.visible = false
        this.callback(this.deskNoArr.find(item => item.id === this.deskNo))
      }
    }
  }
</script>
