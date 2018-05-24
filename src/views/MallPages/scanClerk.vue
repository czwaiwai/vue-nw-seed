<template>
  <el-container class="main">
    <el-container>
      <el-container class="is-vertical">
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}} </div>
        <el-main>
  <div >
    <div class="text-center padding-bottom15">
      <el-button @click="showScanHandle">获取用户信息</el-button>
    </div>
    <div v-if="payUser" class="grid-x">
      <div class="small-6">
        <div class="row scan_userinfo " >
          <div >
            <div class="grid-x ">
              <div class="text_label text-right">用户号码：</div>
              <div class="auto">{{payUser.mobile | numberHidden}}</div>
            </div>
            <div class="grid-x">
              <div class="text_label text-right">用户ID：</div>
              <div class="auto">8888 8888 {{payUser.userId}}</div>
            </div>
            <div class="grid-x">
              <div class="text_label text-right">账户余额：</div>
              <div class="auto" v-if="payUser && payUser.acctAmount">￥{{payUser.acctAmount | currency}}</div>
            </div>
          </div>
        </div>
        <el-form  :rules="rules"  ref="formObj" :model="formObj" label-width="80px">
          <el-form-item label="消费总额" prop="consumeAmt">
            <el-input class="text-right"  v-model="formObj.consumeAmt">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item  label="账户支付"  prop="acctPayAmt" >
            <el-input   v-model="formObj.acctPayAmt">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注说明"  prop="remark" >
            <el-input v-model="formObj.remark" placeholder="备注说明"></el-input>
          </el-form-item>
          <el-form-item label="优惠券"  class="text_line">
            <span class="fs12 vip_red" v-if="payQuan && payQuan.minEftAmt"  >【使用条件：满{{payQuan.minEftAmt}}减】</span> <span class="orange_a9 padding-right5" v-text="payQuan && payQuan.name"></span>
          </el-form-item>
          <el-form-item label="线下还需支付金额" class="text_line">
            {{needCashPayAmt |currency}}
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" :loading="btnLoading" @click="onSubmit('formObj')">确认收款
              <span v-show="payAmount">{{payAmount}}元</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="small-6">
        <ul v-if="quanList && quanList.length>0">
          <li @click="noUseQuanHandle" style="cursor:pointer;line-height:40px;text-align:center;list-style:none;background:#FFF;height:40px;margin-bottom:10px;" >
            不使用优惠券
          </li>
          <li class="quan_card" @click="chooseHandle(item)" v-for="item in quanList" :key="item.id" :class="{'no-use':item.validType!==1,'active':payQuan && payQuan.id == item.id}" >
            <div class="flex_box">
              <div class="flex_item">
                <h5>{{item.name}}</h5>
                <p class="fs14" style="font-size:14px;">{{item.quanTxt}}{{item.amount}}</p>
                <p>{{item.src}}</p>
                <p>过期：{{item.eftEndDate}}</p>
                <p>{{item.validTxt}}</p>
              </div>
            </div>
          </li>
        </ul>
        <!--优惠券信息-->
      </div>
    </div>
    <el-dialog width="400px" title="操作确认" :visible.sync="visible" append-to-body>
      <div class="flex_box">
        <div style="width:115px;">消费总金额：</div>
        <div class="flex_item text-right  orange_a9">{{formObj.consumeAmt}}元</div>
      </div>
      <div class="flex_box">
        <div style="width:115px;">账户消费金额：</div>
        <div class="flex_item text-right dark_65">{{formObj.acctPayAmt}}元</div></div>
      <div class="flex_box">
        <div style="width:115px;">优惠券减免：</div>
        <div class="flex_item text-right green_17">{{quanAmount}}元</div></div>
      <div class="flex_box border-top-half ">
        <div style="width:115px;">线下还需支付：</div>
        <div class="flex_item text-right vip_red">{{needCashPayAmt}}元</div></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onScanPay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">
  .quan_card {
    background:#FFF;
    float:left;
    margin-left:10px;
    margin-bottom:10px;
    list-style:none;
    padding: 10px;
    width:250px;
    cursor:pointer;
    & p {
     margin-bottom:0;
     font-size:12px;
     color:#989898;
    }
    &.no-use {
     background:#f0f0f0;
     cursor:not-allowed;
    }
  }
  .scan_userinfo {
    background:#FFF;
    border-radius:5px;
    padding:10px;
    margin-bottom: 15px;
    .grid-x {
      padding-bottom:5px;
    }
    .text_label {
      width:100px ;
    }
  }
  .el-form-item.text_line .el-form-item__label {
    width:145px !important;
    text-align:left;
    padding-left:15px;
  }
  .el-form-item.text_line .el-form-item__content {
    text-align:right;
  }
  .el-form-item.btn .el-form-item__content {
    margin-left:40px !important;
  }
</style>
<script type="text/ecmascript-6">
  import {amount} from '../../utils/elemFormRules'
  import {amountFix, getQuanAmt, formatShopType, formatQuan} from '../../utils/utils'
  import scanModal from '../../components/scanModal'
  export default{
    data () {
      return {
        btnLoading: false,
        payUser: null,
        shopUser: null,
        visible: false,
        formObj: {
          saleId: '',
          couponId: '',
          custUserId: '',
          consumeAmt: '', // 本次账单
          acctPayAmt: '', // 账户支付
          offlinePayAmt: '', // 线下支付
          remark: ''
        },
        quanList: [],
        payQuan: null,
        rules: {
          consumeAmt: [
            { required: true, message: '金额不能为空', trigger: 'blur' },
            { validator: amount, trigger: 'blur' }
          ],
          acctPayAmt: [
            { required: true, message: '金额不能为空', trigger: 'blur' },
            { validator: amount, trigger: 'blur' }
          ]
        },
        shopTypeArr: ['餐饮', '书店', '线下商场', '飞常赞商城']
      }
    },
    watch: {
      'accountAmt' (val) {
        this.formObj.acctPayAmt = val
      },
      'formObj.consumeAmt' (val) {
        if (val) {
          this.setQuanList(val)
          if (this.payQuan && val < this.payQuan.minEftAmt) {
            this.payQuan = null
          }
        }
      }
    },
    computed: {
      isCashQuan () {
        if (this.payQuan && this.payQuan.refOrderId) {
          this.formObj.acctPayAmt = 0
          return true
        } else {
          return false
        }
      },
      // 账户支付余额
      accountAmt () {
        let val = this.formObj.consumeAmt
        let tmp = 0
        if (this.isCashQuan) {
          return 0
        }
        if (val) {
          if (val <= this.payUser.acctAmount) {
            if (val - this.quanAmount >= 0) {
              tmp = val - this.quanAmount
            } else {
              tmp = 0
            }
          } else {
            tmp = this.payUser.acctAmount
          }
        }
        return tmp
      },
      // 计算券的金额
      quanAmount () {
        return getQuanAmt(this.payQuan, this.formObj.consumeAmt)
      },
      // 线下还需支付
      needCashPayAmt () {
        let tmp = amountFix(this.formObj.consumeAmt - this.payAmount)
        return tmp >= 0 ? tmp : 0
      },
      // 线上已经收到款项
      payAmount () {
        let amount = amountFix(this.formObj.acctPayAmt)
        if (this.payQuan) {
          amount = amountFix(this.formObj.acctPayAmt) + amountFix(this.quanAmount)
        }
        if (isNaN(amount) || amount < 0) {
          return 0
        }
        return amountFix(amount)
      }
    },
    methods: {
      noUseQuanHandle () {
        this.payQuan = null
      },
      // 选择优惠券
      chooseHandle (item) {
        if (!this.formObj.consumeAmt || isNaN(this.formObj.consumeAmt)) {
          return this.$message.warning('请先输入消费总金额')
        }
        console.log(item.validType, '-------------')
        if (item.validType === 1) {
          this.activeQuanId = item.id
          this.payQuan = item
        }
      },
      quanListBuild (couponList, fn) {
        couponList.forEach(fn)
        couponList.sort((a, b) => b.validType - a.validType)
        this.quanList = [...couponList]
      },
      setQuanList (amount) {
        this.quanListBuild(this.list, context => {
          formatQuan(context, amount, 2)
          formatShopType(context, this.shopUser.shopType)
        })
      },
      async showScanHandle () {
        let action = await scanModal({
          url: '/erWeiMa/scan'
        })
        let {custUserInfo, shopAssistant, custCoupon, custCouponList} = action
        this.shopUser = shopAssistant
        if (custCoupon) {
          this.payQuan = custCoupon
          if (this.shopUser.shopType !== this.payQuan.cpType) {
            console.log(this.payQuan.cpType, 'cpType')
            console.log(this.shopUser.shopType, 'shopType')
            return this.$message.error('此店员无权核销这张优惠券\n这张优惠券属于[' + this.shopTypeArr[this.payQuan.cpType - 1] + '类]')
          }
        }
        this.payUser = custUserInfo
        if (custCouponList) {
          this.list = custCouponList
          this.setQuanList(0)
        }
      },
      // 设置消费总金额的值
//      filterConsume (e) {
//        let val = e.target.value
//        if (isNaN(val)) {
//          e.target.value = ''
//          this.$set(this.formObj, 'consumeAmt', '')
//          return
//        }
//        this.$set(this.formObj, 'consumeAmt', val)
//      },
//      // 设置账户支付金额的值
//      filterAmt (e) {
//        let val = e.target.value
//        if (isNaN(val)) {
//          e.target.value = '0'
//          this.$set(this.formObj, 'acctPayAmt', '0')
//          return
//        }
//        if (this.payUser.acctAmount && val > this.payUser.acctAmount) {
//          val = this.payUser.acctAmount
//          this.$set(this.formObj, 'acctPayAmt', val)
//        } else {
//          this.$set(this.formObj, 'acctPayAmt', val)
//        }
//      },
      onScanPay () {
        this.formObj.saleId = this.shopUser.saleId
        this.formObj.custUserId = this.payUser.userId
        this.formObj.offlinePayAmt = this.needCashPayAmt
        if (this.payQuan) {
          if (this.payQuan.minEftAmt && this.payQuan.minEftAmt > this.formObj.consumeAmt) {
            return this.$message.error('消费总金额不足，不能使用此优惠券')
          }
          this.formObj.couponId = this.payQuan.id
        }
        let params = Object.assign({scanType: 'barCode'}, this.formObj)
        this.$http.post('/erWeiMa/doScanPay', params).then(res => {
          this.$message.success('操作成功，打印小票已发送致打印机')
          this.visible = false
          this.payUser = null
          this.formObj.consumeAmt = ''
        })
      },
      onSubmit (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.visible = true
          }
        })
      }
    },
    activated () {
      this.formObj = {
        saleId: '',
        couponId: '',
        custUserId: '',
        consumeAmt: '', // 本次账单
        acctPayAmt: '', // 账户支付
        offlinePayAmt: '', // 线下支付
        remark: ''
      }
      this.quanList = []
      this.payQuan = null
      this.shopUser = null
      this.payUser = null
    }
  }
</script>
