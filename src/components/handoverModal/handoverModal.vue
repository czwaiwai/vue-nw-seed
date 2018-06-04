<template>
  <el-dialog title="交班单"  @open="open" @close="close" :visible.sync="visible" width="600px">
    <div v-if="dateShow" class="block padding-bottom15">
      <span class="demonstration">日期</span>
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        @change="handoverChange"
        time-arrow-control
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        :default-time="['00:00:00', '23:59:59']"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="handover">
      <div class="grid-container full">
        <div class="grid-x grid-margin-x">
          <div class="cell small-4"><span class="handover_label">账单数：</span><span class="ho_text">{{dayPaperData.count}}</span></div>
          <div class="cell small-4"><span class="handover_label">消费额：</span><span class="ho_text">{{dayPaperData.totalAmt}}</span></div>
          <div class="cell small-4"><span class="handover_label">优惠券：</span><span class="ho_text">{{dayPaperData.couponAmt}}</span></div>
        </div>
        <div class="grid-x grid-margin-x">
          <div class="cell small-4"><span class="handover_label">改价折扣金额：</span><span class="ho_text">{{dayPaperData.saveAmt}}</span></div>
          <div class="cell small-4"><span class="handover_label">退款金额：</span><span class="ho_text">{{dayPaperData.refundAmt}}</span></div>
          <div class="cell small-4"><span class="handover_label">实收金额：</span><span class="ho_text">{{dayPaperData.actualAmt}}</span>
          </div>
        </div>
        <div class="grid-x grid-margin-x">
          <div class="cell small-4"><span class="handover_label">用餐人数：</span><span class="ho_text">{{dayPaperData.restPerson}}</span></div>
        </div>
      </div>
      <div class="handover_all_amount">
        <span class="handover_label">收款明细（{{dayPaperData.count}}笔)：</span><span class="alert  ho_text" style="color:red;">{{dayPaperData.actualAmt}}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="printHandover">打印</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  export default{
    props: {
      exchangeType: {
        type: Number,
        default: 0
      },
      handoverData: Object,
      shopId: Number
    },
    data () {
      return {
        visible: false,
        dateShow: true,
        dateRange: [],
        dayPaperData: {},
        printList: []
      }
    },
    methods: {
      open (e) {
        this.dateShow = !this.exchangeType
        this.setHandData(this.handoverData)
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      setHandData (getData) {
        let {data, saleBeginTime, saleEndTime, printList} = getData
        this.dateRange = [saleBeginTime, saleEndTime]
        data.saleBeginTime = saleBeginTime
        data.saleEndTime = saleEndTime
        this.printList = printList
        this.dayPaperData = data
      },
      //  交办单日期变更
      handoverChange () {
        console.log('-----------------------交办单日期变更')
        if (this.dateRange && this.dateRange.length > 0) {
          let saleBeginTime = this.dateRange[0]
          let saleEndTime = this.dateRange[1]
          let params = {
            saleBeginTime,
            saleEndTime,
            restShopId: this.shopId
          }
          if (this.exchangeType) {
            this.params.exchangeType = this.exchangeType
          }
          this.$http.post('/ycRest/countProSaleData', params).then(res => {
            let resData = res.data
            this.setHandData(resData.data)
          })
        }
      },
      printHandover () {
        console.log('-----------------------打印交班单')
        if (!this.dateRange) {
          return this.$message.warning('请选择日期')
        }
        this.visible = false
        console.log('打印交班单')
        this.callback(this.printList)
//        this.$store.dispatch('addPrintObj', {printList: this.tmpPrintList})
      }
    }
  }
</script>
