<template>
  <el-dialog title="补打" :visible.sync="rePrintVisible" width="600px">
    <div class="text-center">
      <template v-if="activeOrder && activeOrder.orderType === 'pay'">
        <el-button @click="toSinglePrint(1,'zhiDisBtn','XF')" :loading = 'zhiDisBtn' >支付凭证</el-button>
      </template>
      <template v-else>
        <el-button @click="toSinglePrint(1,'xiaoDisBtn','XF')" :loading = 'xiaoDisBtn' >消费单</el-button>
        <el-button @click="toSinglePrint(2,'jieDisBtn','JZ')" :loading = 'jieDisBtn' >结账单</el-button>
        <el-button @click="toSinglePrint(3,'chuDisBtn','CD')" :loading = 'chuDisBtn' >厨打单</el-button>

        <el-button v-if="activeOrder && [0,-1,3].indexOf(activeOrder.invoiceStatus) > -1" @click="toSinglePrint(4,'invoiceBtn','INV')" :loading = 'invoiceBtn' >开发票单</el-button>
        <el-button v-if="activeOrder && [2,4].indexOf(activeOrder.invoiceStatus) > -1" disabled >操作中..</el-button>
        <el-button v-if="activeOrder && [1,5].indexOf(activeOrder.invoiceStatus) > -1" @click="sendCancelInvoice()" :loading = 'invoiceBtn' >发票红冲</el-button>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="rePrintVisible = false">关闭</el-button>
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
