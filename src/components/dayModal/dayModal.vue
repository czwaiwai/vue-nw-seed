<template>
  <el-dialog title="日报预览" @open="open" @close="close" :visible.sync="visible" width="600px">
    <div  v-if="dateShow"  class="block padding-bottom15">
      <span class="demonstration">日期</span>
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        time-arrow-control
        @change="dayPaperChange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        :default-time="['00:00:00', '23:59:59']"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="day_paper">
      <h5>日报</h5>
      <p>店铺：{{shopRestName}}</p>
      <div v-if="dateRange">
        <p>统计开始日期：{{dateRange[0]}}</p>
        <p>统计结束日期：{{dateRange[1]}}</p>
      </div>
      <hr/>
      <p>已支付：{{dayPaperData.count}}笔 <span style="float:right">实收金额：{{dayPaperData.actualAmt}}</span></p>
      <hr/>
      <p>现金支付：{{dayPaperData.actOfflpayAmt}}</p>
      <p>线上支付：{{dayPaperData.actBankpayAmt}}</p>
      <p>飞常赞支付：{{dayPaperData.actAcctpayAmt}}</p>
      <hr/>
      <p>此小票为日报，请妥善保管</p>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="printDayPaper">打印</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  export default{
    prop: {
      exchangeType: {
        type: Number,
        default: 0
      },
      shopId: Number,
      shopName: String,
      dayData: Object,
      list: Array,
      dateStart: String,
      dateEnd: String
    },
    data () {
      return {
        shopRestName: '',
        visible: false,
        dateShow: true,
        dateRange: [],
        dayPaperData: {},
        printList: []
      }
    },
    methods: {
      open (e) {
        console.log('显示shop-----------------------')
        console.log(this.dateStart, this.dateEnd)
        this.dateShow = !this.exchangeType
        this.shopRestName = this.shopName
        this.dateRange = [this.dateStart, this.dateEnd]
        this.printList = this.list
        this.dayPaperData = this.dayData
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      dayPaperChange (e) {
        console.log('-----------------------日报修改日期')
        if (this.dateRange) {
          let saleBeginTime = this.dateRange[0]
          let saleEndTime = this.dateRange[1]
          let params = {saleBeginTime, saleEndTime, returnType: 1, restShopId: this.shopId}
          if (this.exchangeType) {
            params.exchangeType = this.exchangeType
          }
          this.$http.post('/ycRest/countProSaleData', params).then(res => {
            let resData = res.data
            let {data, saleBeginTime, saleEndTime, printList} = resData.data
            this.dateRange = [saleBeginTime, saleEndTime]
            data.saleBeginTime = saleBeginTime
            data.saleEndTime = saleEndTime
            this.printList = printList
            this.dayPaperData = data
          })
        }
      },
      printDayPaper () {
        console.log('-----------------------打印日报')
        if (!this.dateRange) {
          return this.$message.warning('请选择日期')
        }
        this.visible = false
        this.callback(this.printList)
      }
    }
  }
</script>
