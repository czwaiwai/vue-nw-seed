<template>
  <el-dialog title="补打"  @open="open" @close="close" :visible.sync="visible" width="600px">
    <div class="text-center">
      <template v-if="activeOrder && activeOrder.orderType === 'pay'">
        <el-button @click="toSinglePrint(1,'zhiDisBtn','XF')" :loading = 'btnLoading' >支付凭证</el-button>
      </template>
      <template v-else>
        <el-button type="button" @click="toSinglePrint(1,'xiaoDisBtn','XF')" :loading = 'btnLoading' >消费单</el-button>
        <el-button type="button" @click="toSinglePrint(2,'jieDisBtn','JZ')" :loading = 'btnLoading' >结账单</el-button>
        <el-button type="button"  v-if="shop && shop.belongShopType==11" @click="toSinglePrint(3,'chuDisBtn','CD')" :loading = 'btnLoading' >厨打单</el-button>

        <el-button type="button" v-if="activeOrder && [0,-1,3].indexOf(activeOrder.invoiceStatus) > -1" @click="toSinglePrint(4,'invoiceBtn','INV')" :loading = 'btnLoading' >开发票单</el-button>
        <el-button type="button" v-if="activeOrder && [2,4].indexOf(activeOrder.invoiceStatus) > -1" disabled >操作中..</el-button>
        <el-button type="button" v-if="activeOrder && [1,5].indexOf(activeOrder.invoiceStatus) > -1" @click="sendCancelInvoice()" :loading = 'btnLoading' >发票红冲</el-button>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss"></style>
<script type="text/ecmascript-6">
  export default{
    props: {
      shop: Object,
      activeOrder: Object,
      printFn: Function
    },
    data () {
      return {
        visible: false,
        timer: null,
        btnLoading: false
//        zhiDisBtn: false,
//        jieDisBtn: false,
//        xiaoDisBtn: false,
//        chuDisBtn: false,
//        invoiceBtn: false
      }
    },
    components: {
    },
    methods: {
      open (e) {
        this.btnLoading = false
        this.timer = null
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.btnLoading = false
        this.timer && clearTimeout(this.timer)
        this.callback(false)
      },
//      //  显示补打
//      rePrintClickHandler () {
//        console.log('-----------------------显示补打')
//        if (this.isActiveOrder()) {
//          this.tmpOrder = Object.assign({}, this.activeOrder)
//          this.rePrintVisible = true
//        }
//      },
      // 手动补打
      toSinglePrint (type, btnName, newType) {
        if (btnName) {
          console.log('手动补打', btnName)
          this.btnLoading = true
          let order = Object.assign({}, this.activeOrder, {printSingleType: newType})
          this.printFn && this.printFn(order)
          this.timer = setTimeout(() => {
            this.btnLoading = false
          }, 1500)
        }
      },      // 手动红冲发票
      sendCancelInvoice () {
        console.log('手动红冲发票')
        let id = this.activeOrder.id
        this.$prompt('请填写红冲原因', '发票红冲', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '红冲原因不能为空',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.$http.post('/eleInvoice/nullifyFpBySa', {
                orderId: id,
                shopType: 1,
                redReason: instance.inputValue
              }).then(res => {
                let resData = res.data
                let {result} = resData.data
                if (result && parseInt(result.code) === 1) {
                  done()
                  instance.confirmButtonLoading = false
                }
              }).catch(() => {
                instance.confirmButtonLoading = false
              })
            } else {
              done()
            }
          }
        }).then(({action, value}) => {
          if (action === 'confirm') {
            this.$message.success('红冲成功')
          }
        }).catch(() => {})
      }
    }
  }
</script>
