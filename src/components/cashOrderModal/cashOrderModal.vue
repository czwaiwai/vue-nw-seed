<template>
  <el-dialog title="结账" @open="open"  :close-on-click-modal="false"  :visible.sync="visible" width="700px">
    <div style="margin-top:-15px;" v-loading="payLoading" class="grid-x food_buttons">
      <div v-if="activeOrder" class="cell small-5">
        <p ><span class="inline-block text-right padding-right5"  style="width:70px;">消费额：</span>{{activeOrder.fnActPayAmount | currency}}</p>
        <p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-整单折：</span>{{ activeOrder.cashMoney | currency}} <span class="padding-left">折扣率：{{ activeOrder.cashDisc }}%</span></p>
        <!--<p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-折让额：</span>0.75 </p>-->
        <p class="alert" ><span class="inline-block  text-right padding-right5" style="width:70px;">舍入额：</span>{{activeOrder.cashRound | currency}}</p>
        <hr />
        <p>=应收：<span class="bold" style="color:#333;">{{activeOrder.cashNeedPay | currency}}元</span></p>
        <hr />
        <P>找零： <span class="bold" style=""></span></P>
      </div>
      <div class="cell small-7" style="padding-left: 15px;">
        <div class="grid-x">
          <div class="small-9">
            <el-form :inline="true"  class="form-inline">
              <el-form-item label="支付金额" class="no-margin">
                <el-input  ref="cashInput"  v-model="payMoney" placeholder="支付金额" style="text-align:right;width:206px;"></el-input>
              </el-form-item>
              <vir-keyboard  mode="bind" v-model="payMoney" :input="$refs.cashInput && $refs.cashInput.$el.querySelector('input')" style="width:280px;"></vir-keyboard>
            </el-form>
            <div style="border-top:1px solid #e3e3e3;margin-top:20px;">
              <div class="text-center" style="margin: 20px 0">
                <el-button plain @click="$message.info('直接点击结账即为现金收款哦~')">现金</el-button>
                <el-button @click="wxPayClickHandle" type="success" plain>扫码收款</el-button>
                <!--<el-button @click="aliPayClickHandle" type="primary" plain>支付宝</el-button>-->
              </div>
            </div>
          </div>
          <div class="small-3">
            <ul class="jie_btn_list" >
              <li><el-button  @click="cashDoneHandle" type="primary">结账</el-button></li>
              <li><el-button  @click="discountHandle">折扣</el-button></li>
              <!--<li><el-button  @click="computeIntHandle">取整</el-button></li>-->
              <!--<li><el-button  @click="quanHandle" >礼券</el-button></li>-->
              <!--<li><el-button  @click="discountVisible=true">折让</el-button></li>-->
              <!--<li><el-button  @click="discountVisible=true">礼券</el-button></li>-->
              <!--<li><el-button  @click="discountVisible=true">删除</el-button></li>-->
              <!--<li><el-button  @click="discountVisible=true">退款</el-button></li>-->
              <!--<li><el-button  @click="discountVisible=true">会员</el-button></li>-->
              <li><el-button type="info" @click="visible=false" >取消</el-button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import {currency} from '../utils/utils'
  export default {
    props: {
      activeOrder: Object,
      toPayMoney: '',
      getCartInfos: String
    },
    data () {
      return {
        visible: false,
        payLoading: false,
        payMoney: ''
      }
    },
    watch: {
      'activeOrder.cashNeedPay' (newVal, oldVal) {
        if (newVal) {
          this.payMoney = newVal + ''
        }
      },
      'payMoney' (newVal) {
        if (newVal && !isNaN(newVal)) {
          this.$store.commit('changeActiveMoney', newVal)
        }
      }
    },
    components: {
    },
    methods: {
      open (e) {
        setTimeout(() => {
          let el = this.$refs.cashInput && this.$refs.cashInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      // 计算取整
      computeIntHandle () {
        let money = parseFloat(this.payMoney)
        let tmp = currency(money)
        let arr = tmp.match(/\.(\d+)$/)
        if (arr) {
          let mulVal = 10
          if (parseInt(arr[1]) % 10 === 0) {
            mulVal = 1
          }
          this.payMoney = currency(Math.ceil(money * mulVal) / mulVal)
          this.$store.commit('changeActiveMoney', this.payMoney)
        }
      },
      // 线下支付结账 确定线下付款
      async cashDoneHandle () {
        console.log('确定线下付款')
        if (this.isActiveOrder()) {
          if (this.activeOrder.fnAttach && this.activeOrder.fnAttach === 0) {
            return this.$message.warning('当前订单中没有商品')
          }
          if (!this.payMoney) {
            return this.$message.warning('支付金额不能为空')
          }
          let action = await this.$confirm('确定已收到现金款', '提示')
          if (action === 'confirm') {
            let params = {
              payType: 'offl',
              restShopId: this.shop.id,
              payAmt: this.activeOrder.fnActPayAmount,
              restPerson: '',
              isOfflinePay: 1,
              cartInfos: this.getCartInfos(),
              address: '',
              couponId: '',
              userRemark: '',
              fczPrzAmt: '',
              fczPrzRemark: '',
              dicountAmt: this.activeOrder.cashMoney, // 减免金额
              derateAmt: this.activeOrder.cashRound, // 优惠券金额
              actPayAmt: this.activeOrder.cashNeedPay, // 应付金额
              cashDisc: this.activeOrder.cashDisc // 折扣率
            }
            this.payLoading = true
            if (this.activeOrder.isNew) {
              try {
                let order = await this.orderDown(params)
                await this.orderOfflPay(params, order)
                this.payLoading = false
              } catch (e) {
                this.payLoading = false
              }
            } else {
              try {
                await this.orderOfflPay(params, this.activeOrder)
                this.payLoading = false
              } catch (e) {
                this.payLoading = false
              }
            }
          }
        }
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
      // 线下付款
      async orderOfflPay (params, order) {
        let res = await this.$http.post('/ycRest/doOfflPay', Object.assign({}, params, {orderId: order.id}))
        let resData = res.data.data
        this.$message.success('下单成功')
        this.cashOrderVisible = false
        this.$store.commit('clearActiveOrder')
        if (this.isPointPage) {
          this.$store.commit('updateOne', resData.order)
        }
      }
    }
  }
</script>
