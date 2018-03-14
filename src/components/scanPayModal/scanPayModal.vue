<template>
  <el-dialog width="600px"  @open="open"   @close="close" :close-on-click-modal="false"  :title="title" :visible.sync="visible" append-to-body>
    <div v-loading="wxPayLoading">
      <el-form  label-width="80px" >
        <div class="grid-x">
          <div class="small-6">
            <el-form-item label="支付金额">
              <el-input readonly v-model="payMoney" ></el-input>
            </el-form-item>
            <div style="font-size: 20px;padding: 10px;">使用扫码枪扫描用户付款码</div>
            <div style="padding:10px;">
              <el-button type="info" @click="changeHandMode" plain>切换手动模式</el-button>
            </div>
          </div>
          <div class="small-6 text-right scanner"></div>
        </div>
      </el-form>
    </div>
    <div v-show="wxPayLoading" class="pay_sure_mask"><el-button type="primary"  @click="userClickRes">确认收到款项</el-button></div>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">
.scanner {
  background: url('../../assets/img/scanPay/sanner.png')
}
</style>
<script type="text/ecmascript-6">
  import scanner from '../../utils/scanner'
  import roundTime from '../../utils/roundTime'
  export default{
    props: {
      shopId: Number,
      payAmt: String,
      payStyleTitle: String,
      activeOrder: Object,
      cartInfos: String
    },
    data () {
      return {
        visible: false,
        wxPayLoading: false,
        changeMode: false,
        scanner: null,
        title: '',
        payAuthNo: '',
        payMoney: ''
      }
    },
    methods: {
      open (e) {
        this.payMoney = this.payAmt
        this.payAuthNo = ''
        this.title = this.payStyleTitle
        this.wxPayLoading = false
        this.changeMode = false
        console.log(this.scanner, '-------------------------')
        this.scanner.start()
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.scanner.stop()
        console.log('我执行了么-----------------changeMode', this.changeMode)
        this.onClose && this.onClose(this.changeMode)
        this.callback(false)
      },
      // 在线支付
      async orderOnlinePay (params, order) {
        let res = await this.$http.post('/pay/scanPay', params)
        console.log('线上支付成功')
        let resData = res.data
        let {payStatus} = resData.data
        this.tmpData = resData.data
        switch (payStatus) {
          case 1: this.normalSucc(resData.data.restOrder); break
          case 2: this.waitRes(order, resData.data); break
          case 3:
          default: this.errorRes(order, resData.data)
        }
      },
      // 正常成功状态
      normalSucc (order) {
        this.wxPayLoading = false
        this.visible = false
        this.callback(order)
      },
      // 等待支付结果
      waitRes (order, data) {
        data.count = 0
        this.round = roundTime(next => {
          this.$http.post(`/pay/doQueryScanPay`, {id: data.id}).then(res => {
            let resData = res.data
            let {payStatus, payMsg, maxQryCount} = resData.data
            switch (payStatus) {
              case 1:
                next(false)
                this.normalSucc(resData.data.restOrder)
                break
              case 2:
                if (data.count > maxQryCount) {
                  this.wxPayLoading = false
                  this.$message.error('支付超时，重新尝试~')
                  next(false)
                } else {
                  this.$message.warning(payMsg)
                  data.count++
                  next(true)
                }
                break
              default:
                this.errorRes(order, resData.data)
                next(false)
                break
            }
          }).catch(err => {
            console.log(err)
            next(false)
            this.$message.error('网络超时，请重新尝试~')
          })
        }, 3000)
        this.round.start()
      },
      userClickRes () {
        this.$http.post(`/pay/doQueryScanPay`, {id: this.tmpData.id}).then(res => {
          let resData = res.data
          let {payStatus} = resData.data
          if (payStatus === 1) {
            this.round.stop()
            this.round = null
            this.normalSucc(resData.data.restOrder)
          } else if (payStatus === 2) {
            this.$message.warning('还没检测到支付数据，稍等重试')
          } else {
            this.wxPayLoading = false
            this.$message.error('网络超时，请重新尝试~')
            this.round.stop()
            this.round = null
          }
        })
      },
      changeHandMode () {
        this.changeMode = true
        this.visible = false
      },
      // 错误支付状态
      errorRes (order, msgObj) {
        this.wxPayLoading = false
        this.$message.error(msgObj.payMsg)
      },
      // 仅订单下单
      async orderDown (params) {
        let res = await this.$http.post('/ycRest/doOrder', params)
        console.log('仅订单下单')
        let resData = res.data
        let {order} = resData.data
        this.$store.commit('setActiveOrder', Object.assign({}, this.activeOrder, order, {isNew: false}))
        return order
      },
      // 线上支付
      async onlinePayConfirm () {
        if (this.activeOrder) {
          let params = {
            payType: '',
            restShopId: this.shopId,
            payAmt: this.activeOrder.fnActPayAmount,
            restPerson: '',
            isOfflinePay: 1,
            cartInfos: this.cartInfos,
            address: '',
            couponId: '',
            userRemark: '',
            fczPrzAmt: '',
            fczPrzRemark: '',
            dicountAmt: this.activeOrder.cashMoney, // 减免金额
            derateAmt: this.activeOrder.cashRound, // 优惠券金额
            actPayAmt: this.payMoney, // 实付金额
            cashDisc: this.activeOrder.cashDisc, // 折扣率
            doOrderWay: 1,  // 直接付款
            authCode: this.payAuthNo
          }
          this.wxPayLoading = true
          if (this.activeOrder.isNew) {
            try {
              let order = await this.orderDown(params)
              params.orderId = params.refOrderId = order.id
              await this.orderOnlinePay(params, order)
            } catch (e) {
              this.wxPayLoading = false
            }
          } else {
            try {
              params.orderId = params.refOrderId = this.activeOrder.id
              await this.orderOnlinePay(params, this.activeOrder)
            } catch (e) {
              this.wxPayLoading = false
            }
          }
        }
      }
    },
    created () {
      let self = this
      this.scanner = scanner(function (str, done) {
        console.log('hahaha', str)
        self.payAuthNo = str
        self.onlinePayConfirm()
        done()
      })
    }
  }
</script>
