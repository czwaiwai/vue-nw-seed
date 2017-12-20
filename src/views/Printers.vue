<template>
    <div class="page">
        <el-table :data="printers" :border="true" style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="date" label="打印机模式" ></el-table-column>
          <el-table-column prop="name" label="打印机名称" ></el-table-column>
          <el-table-column prop="address" label="打印机状态"></el-table-column>
          <el-table-column prop="portName" label="打印机端口"></el-table-column>
          <el-table-column prop="address" label="IP"></el-table-column>
        </el-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  var printer = require('printer')
  import {mapGetters} from 'vuex'
  export default{
    data () {
      return {
        msg: 'hello vue',
        printers: null
      }
    },
    computed: {
      ...mapGetters({
        'printOrders': 'printOrders'
      })
    },
    watch: {
      'printOrder' (newVal, oldVal) {
        console.log(newVal, oldVal, '数组变化')
      }
    },
    activated () {
      let printers = printer.getPrinters()
      console.log(JSON.stringify(printers))
    },
    created () {
      let printers = printer.getPrinters()
      console.log(printers)
      this.printers = printers
      console.log(this.printers)
    }
  }
</script>
