<template>
  <el-dialog title="规格选择" @open="open" @close="close" :visible.sync="visible" width="600px">
    <div>
      <el-radio v-for="sub in item.attrList"  v-model="attr" :label="sub" border>{{sub}}</el-radio>
    </div>
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
    prop: {
      item: Object
    },
    data () {
      return {
        visible: false,
        attr: ''
      }
    },
    methods: {
      open (e) {
        console.log(this.item, '---------------??????????')
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      confirm () {
        if (this.attr) {
          this.visible = false
          this.callback(this.attr)
        }
      }
    }
  }
</script>
