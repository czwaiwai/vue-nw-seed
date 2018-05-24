<template>
  <el-container class="main">
    <el-container>
      <el-aside class="el-container  is-vertical" width="340px" style="max-width:340px;">
        <div class="food_mode_quick flex_item" style="width:340px;">
          <div class="padding">
            <!--<h5>快餐模式</h5>-->
            <div class="grid-x ">
              <div class="cell small-6 bold fs14">订单：{{activeOrd.vOrderNo}}</div>
              <div class="cell small-6 bold fs14">桌号：{{activeOrd.tableNum}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6 fs14">人数：{{activeOrd.restPerson?activeOrd.restPerson+'位':'1位'}}</div>

              <div v-if="activeOrd.isNew" class="cell small-6 fs14">下单人：店员</div>
              <div v-else class="cell small-6 fs14">下单人：{{activeOrd.assistantOp===1?'店员':'客户'}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6 fs14">状态：{{ orderStatus[activeOrd.status]}}</div>
              <div class="cell small-6 fs14">支付方式：<span class="fs14">{{payType[activeOrd.payType]}}</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6 fs14">下单时间：<span class="fs14">{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</span>
              </div>
              <div class="cell small-6 bold">合计：{{activeOrd.fnActPayAmount | currency}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12 fs14">发票状态：<span class="fs14">{{invoiceStatus[activeOrd.invoiceStatus] }}</span>
              </div>

            </div>
            <div class="grid-x " v-if="activeOrd.adjRemark">
              <div class="cell small-12 fs14">订单备注：<span class="fs14">{{activeOrd.adjRemark}}</span>
              </div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12 fs14">用户备注：<span class="fs14">{{activeOrd.userRemark }}</span>
              </div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                    @current-change="handleCurrentChange" style="width:340px;">
            <el-table-column  label="菜品名称" >
              <template slot-scope="scope">
                <span class="">{{scope.row.restProName}} <span v-if="scope.row.attr" >[{{scope.row.attr}}]</span></span>
              </template>
            </el-table-column>
            <el-table-column property="buyCount" label="数量" width="45"></el-table-column>
            <el-table-column property="perCash" label="单价" width="70"></el-table-column>
            <el-table-column property="amount" label="小计" width="70"></el-table-column>
            <el-table-column  v-if="activeOrd.isNew" label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="danger" size="mini">-</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="aside-footer ">
          <div  class="flex_box">
            <div class="row ">
              <div>
                <button :disabled="changeAmtDisabled"  @click="changeAmtClickHandler" type="button" class="button  light">改价</button>
                <button :disabled="cancelOrderDisabled" @click="cancelOrderPwd" type="button" class="button light">取消</button>
                <button :disabled="rePrintClickDisabled" @click="rePrintClickHandler" type="button" class="button light">补打</button>
                <!--<button :disabled="printClickDisabled"  @click="printClickHandler" type="button"  class="button light">打印</button>-->
              </div>
              <div>
                <!--<button type="button" class="button light">下行</button>-->
                <button :disabled="backAmtDisabled"  @click="backAmtClickHandler" type="button" class="button light">退单</button>
                <button :disabled="backCaiDisabled"  @click="backCaiClickHandler" type="button" class="button light">退菜</button>
                <button :disabled="clearActiveDisable"  @click="clearActiveOrder" type="button" class="button light">清空</button>
              </div>
            </div>
            <button @click="createOrderHandle" :disabled="createOrderDisabled" class="button  margin5 flex_item fs20 warn " style="max-width:128px;color:#FFF;">下单</button>
          </div>
        </div>
      </el-aside>
      <el-container>
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}}</div>

        <el-main>
          <!--<div class="scroll_content">-->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <!--</div>-->
        </el-main>
        <el-footer style="height:auto;padding:3px;">
          <div class="grid-container full">
            <div class="grid-x food_buttons">
              <div class="cell small-3">
                <button @click="printedOrderHandler"  type="button" class="button  light expanded  margin5   ">{{isBuffet?'已点订单':'点菜'}}</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="workClickHandler" class="button light   expanded  margin5   ">打卡</button>
              </div>
              <div class="cell small-3">
                <button @click="orderCashHandle" type="button"  class="button orange  expanded   margin5   ">结账</button>
              </div>
              <!--<div class="cell small-2">-->
              <!--<button type="button" class="button  warning expanded  margin5   ">结账</button>-->
              <!--</div>-->
            </div>
            <div class="grid-x food_buttons">
              <div class="cell small-3">
                <button type="button" @click="moreFnClickHandler" class="button  light expanded  margin5   ">其他功能</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="histOrderHandler" class="button  light  expanded  margin5  ">历史订单</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showDayClickHandler" class="button  light expanded  margin5   ">日报</button>
              </div>
              <!--<div class="cell small-3">-->
              <!--<button type="button" @click="workClickRecordHandler" class="button light  expanded  margin5   ">打卡记录</button>-->
              <!--</div>-->
              <div class="cell small-3">
                <button type="button" @click="logoutClickHandle" class="button light  expanded  margin5   ">安全退出</button>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>
    <el-dialog title="结账" @open="cashOrderOpen"  :close-on-click-modal="false"  :visible.sync="cashOrderVisible" width="700px">
      <div style="margin-top:-15px;" v-loading="payLoading" class="grid-x food_buttons">
        <div v-if="activeOrder" class="cell small-5">
          <p ><span class="inline-block text-right padding-right5"  style="width:70px;">消费额：</span>{{activeOrder.fnActPayAmount | currency}}</p>
          <p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-整单折：</span>{{ activeOrder.cashMoney | currency}} <span class="padding-left">折扣率：{{ activeOrder.cashDisc }}%</span></p>
          <!--<p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-折让额：</span>0.75 </p>-->
          <p class="alert" ><span class="inline-block  text-right padding-right5" style="width:70px;">舍入额：</span>{{activeOrder.cashRound | currency}}</p>
          <hr />
          <p>=应收：<span class="bold" style="color:#333;">{{activeOrder.cashNeedPay | currency}}元</span></p>
          <hr />
          <P>找零： <span class="bold" style="">{{activeOrder.cashMoneyBack | currency}}</span></P>
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
                <li><el-button  @click="feePayHandle">免单</el-button></li>
                <!--<li><el-button  @click="computeIntHandle">取整</el-button></li>-->
                <!--<li><el-button  @click="quanHandle" >礼券</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">折让</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">礼券</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">删除</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">退款</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">会员</el-button></li>-->
                <li><el-button type="info" @click="cashOrderVisible=false" >取消</el-button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
  .pay_sure_mask{
    position: absolute;
    height: 200px;
    left: 0;
    right: 0;
    top: 40px;
    z-index: 10000;
    text-align: center;
  }
  .discount_wrap{
    .title {
      text-align:left;
      font-weight:bold;
    }
    .small-4 + .small-4 {
      padding-left:5px;
    }
    .small-4> button {
      margin:0 0 5px 0;
    }
  }
  .form-inline .no-margin {
    margin-right:0 !important;
  }
  .form-inline .el-input__inner{
    text-align:right;
  }
  .jie_btn_list{
    list-style:none;
    li {
      margin-bottom:5px;
    }
  }
  .el-dialog .el-input{
    width:200px;
  }
  .unit_header{
    height:34px;
    line-height:34px;
    background:#f0f0f0;
    border:1px solid #e3e3e3;
  }
  .handover {
    font-size: 14px;
    & .handover_label {
      font-weight: bold;
    }
    & .cell {
      padding: 5px;
    }
    & .handover_all_amount {
      border-top: 1px solid #e3e3e3;
      background: #f0f0f0;
      padding: 10px;
    }
  }

  .day_paper {
    padding: 10px;
    border: 1px solid #e3e3e3;
    & hr {
      margin: 10px auto;
    }
    & p {
      margin-bottom: 5px;
    }
  }

  .main {
    height: 100%;

  }

  .logo {
    font-size: 20px;
    color: #FFF;
  }

  .logo_time {
    color: #FFF;
  }

  .food_buttons .cell {
    padding: 0px 3px;
  }

  @media (max-width: 1010px) {
    .food_buttons .button {
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .aside-footer {
    padding: 5px;
    background: #f0f0f0;
    & .button {
      margin-bottom: 5px;
    }
  }

  .el-header {
    background-color: #252728;
    color: #333;
    line-height: 44px;
  }

  .el-footer {
    background-color: #f0f0f0;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;

    & .aside-main {
      padding: 0;
    }
  }

  .el-table__header {
    margin-bottom: 0;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .order_item.no_pay{
    background:#0E72BF;
    border:2px solid #0E72BF;
  }
  .scroll_content {
    height: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import { App } from 'nw.gui'
  import { mapGetters } from 'vuex'
  import scanner from '../utils/scanner'
  import { amount as amountRule, mobile, passWd } from '../utils/elemFormRules'
  import {clearLogs} from '../utils/clearLogs'
  import {currency} from '../utils/utils'
  let now = moment(new Date()).format('YYYY-MM-DD')
  import loginModal from '@/components/loginModal/'
  import backAmtModal from '../components/backAmtModal/'
  import changeAmtModal from '../components/changeAmtModal/'
  import backVegetablesModal from '../components/backVegetablesModal/'
  import scanPayModal from '../components/scanPayModal/'
  import scanInputPayModal from '../components/scanInputPayModal/'
  import workModal from '../components/workModal/'
  import dayModal from '../components/dayModal/'
  import handoverModal from '../components/handoverModal/'
  import rePrintModal from '../components/rePrintModal/'
  import discPercentModal from '../components/discPercentModal'
  export default{
    data () {
      return {
        test: '123423423',
        appVersion: '',
        btnLoading: false,
        dateRange: [],
        backCaiList: [],  //  退菜List
        isNewPrintState: true, // 正在打印和已打印切换
        dayPaperData: {},
        handoverData: {},
        //  打卡
        hitCard: 0,
        rePrintVisible: false, // 补打显示
        backCaiVisible: false,  //  退菜visible
        hitRcodeVisible: false, //  打卡记录
        workDialogVisible: false,
        handoverDialogVisible: false,
        dayDialogVisible: false, // 日报对话框
        cashOrderVisible: false, // 结账对话框
        wxPayVisible: false, // 微信支付
        cashPayVisible: false, // 现金支付
        discountVisible: false, // 折扣显示

        wxPayLoading: false,
        payLoading: false,
        xiaoDisBtn: false,
        jieDisBtn: false,
        chuDisBtn: false,
        zhiDisBtn: false,
        invoiceBtn: false,

        hitDate: now,
        hitRecordTable: [], // 打卡记录
        currentTime: '',
        now: now,
        payMoney: '',
        input: null, // 虚拟键盘使用
        discPercentModel: '100', //  折扣率默认值
        payStyleTitle: '微信支付', // 标题栏
        payAuthNo: '', // 支付授权框
        //  用户验证
        loginVisible: false, // 登录认证
        loginForm: {
          mobile: '',
          pwd: ''
        },
        loginFormRules: {
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: mobile, trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {validator: passWd, trigger: 'blur'}
          ]
        },
        //  改价form
        changeAmtVisible: false,
        changeAmtForm: {
          adjAmt: '',
          adjRemark: ''
        },
        changeAmtRules: {
          adjAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          adjRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        //  退菜
        backCaiForm: {
          remark: ''
        },
        backCaiRules: {
          remark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        //   退单form
        backAmtVisible: false,
        backAmtForm: {
          id: '',
          refundAmt: '',
          refundRemark: ''
        },
        backAmtRules: {
          refundAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          refundRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        currentRow: null,
        isMoreFn: false,
        payType: {
          acc: '飞常赞账户支付',
          wx: '微信支付',
          ali: '支付宝支付',
          qq: 'QQ支付',
          offl: '现金支付'
        },
        orderStatus: {
          '-1': '订单已取消',
          '0': '待支付',
          '1': '支付成功',
          '2': '发起支付',
          '3': '支付失败',
          '4': '申请退款',
          '5': '退款成功',
          '7': '已完成',
          '8': '已完成',
          '9': '申请线下支付'
        },
        invoiceStatus: {
          '1': '开票成功',
          '2': '开票失败',
          '3': '开票失败',
          '4': '正在红冲',
          '5': '红冲失败',
          '-1': '红冲成功'
        },
        isCusMode: true,
        isBuffet: true,
        tmpOrder: null,
        tmpData: null
      }
    },
    watch: {
      'printOrders' (newVal, oldVal) {
        if (!newVal || !oldVal) return
        if (newVal.length !== oldVal.length) {
          console.log(newVal, oldVal, '数组变化')
        }
      },
      '$route' (to, from) {
        console.log(to, from, '路由变化')
        if (this.activeOrder) {
          this.$store.commit('clearActiveOrder')
        }
        this.$store.commit('clearOrderList')
      },
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
    computed: {
      ...mapGetters({
        'isLogin': 'isLogin',
        'user': 'user',
        'isAuto': 'isAuto',
        'printTpl': 'printTpl',
        'shop': 'shop',
        'shopUser': 'shopUser',
        'shopPrint': 'shopPrint',
        'printOrders': 'printOrders',
        'activeOrder': 'activeOrder',
        'loopTime': 'loopTime'
      }),
      //  ----------------cus页面 start
//      payMoney: {
//        get () {
//          if (this.activeOrder) {
//            return '' + this.activeOrder.fnActPayAmount
//          }
//          return '' + 0
//        },
//        set (val) {
//          return val + ''
//        }
//      },
      //  ----------------cus页面 end
      badgePrint () {
        if (this.printOrders) {
          return this.printOrders.length
        }
        return 0
      },
      isNewPage () {
        return this.$route.name === 'NewOrder'
      },
      isPrintedPage () {
        return this.$route.name === 'PrintedOrder'
      },
      isHistoryPage () {
        return this.$route.name === 'HistoryOrder'
      },
      // 判断是否是点菜页面
      isPointPage () {
        return this.$route.name === 'CusPrintedOrder'
      },
      changeAmtDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      cancelOrderDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      createOrderDisabled () {
        if (!this.activeOrder) {
          return true
        } else {
          if (this.activeOrder.isNew) {
            return false
          } else {
            return true
          }
        }
      },
      rePrintClickDisabled () {
        if (this.activeOrder && !this.activeOrder.isNew) {
          return false
        }
        return true
      },
      printClickDisabled () {
        if (this.activeOrder) {
          if (!this.activeOrder.isPrint) {
            return false
          }
        }
        return true
      },
      backAmtDisabled () {
        if (this.activeOrder && this.activeOrder.status === 5) {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      backCaiDisabled () {
        if (this.activeOrder && this.activeOrder.orderType === 'pay') {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      clearActiveDisable () {
        if (this.activeOrder) {
          return false
        }
        return true
      },
      confirmBtnDisable () {
        return this.disableBtnBy(['confirmOrder'])
      },
      activeOrderData () {
        if (this.activeOrder) {
          return this.activeOrder.fnAttach
        }
        return []
      },
      activeOrd () {
        if (this.activeOrder) {
          return this.activeOrder
        }
        return {fnAttach: []}
      }
    },
    methods: {
      // 计算取整
      computeIntHandle () {
        let money = parseFloat(this.activeOrder.cashMoneyBack)
        let tmp = currency(money)
        let arr = tmp.match(/\.(\d+)$/)
        if (arr) {
          let mulVal = 10
          if (parseInt(arr[1]) % 10 === 0) {
            mulVal = 1
          }
          this.$store.commit('changeActiveBackMoney', currency(Math.floor(money * mulVal) / mulVal))
        }
      },
      // 剔除添加的商品
      deleteRow (index, item) {
        this.$store.commit('reFoodActiveOrder', item)
      },
      // 计算提交的值
      getCartInfos () {
        let tmp = []
        this.activeOrder.fnAttach.forEach((item) => {
          tmp.push(`${item.id};${item.buyCount};0;0;0;;;`)
        })
        return tmp.join('|')
      },
      createCartInfos () {
        if (!this.activeOrder) return
        let tmp = []
        this.activeOrder.fnAttach.forEach(item => {
          tmp.push(`${item.id};${item.buyCount};0;0;0;;`)
        })
        return tmp.join('|')
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
      },
      // 线下支付结账 确定线下付款
      async cashDoneHandle (userObj) {
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
              actPayAmt: this.activeOrder.cashNeedPay, // 实付金额
              cashDisc: this.activeOrder.cashDisc // 折扣率
            }
            if (userObj.isFree && userObj.isFree === 1) {
              params = Object.assign({}, params, userObj)
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
      // 结账
      orderCashHandle () {
        console.log('结账---------')
        if (this.isActiveOrder()) {
          // 新订单
          if (this.activeOrder.isNew || [0, 9].indexOf(this.activeOrder.status) > -1) {
            if (this.activeOrder.fnAttach && this.activeOrder.fnAttach.length === 0) {
              return this.$message.warning('你还没有添加菜品')
            }
            this.$store.commit('setActiveOrderInfo', {
              cashDisc: 100,
              cashMoney: 0,
              cashRound: 0,
              cashMoneyBack: 0,
              cashNeedPay: this.activeOrder.fnActPayAmount
            })
            this.payMoney = currency(this.activeOrder.fnActPayAmount)
            this.cashOrderVisible = true
          } else {
            this.$message.warning('该订单已支付完成了！')
          }
        }
      },
      cashOrderOpen () {
        setTimeout(() => {
          let el = this.$refs.cashInput && this.$refs.cashInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
      },
      async discountHandle () {
        let percent = await discPercentModal()
        console.log(percent)
        this.$store.commit('setActiveDiscount', percent)
      },
      async wxPayClickHandle (title) {
        let self = this
        if (this.activeOrder && this.payMoney) {
          this.payStyleTitle = '扫码收款'
          if (typeof title === 'string') {
            this.payStyleTitle = title
          }
          let order = await scanPayModal({
            shopId: this.shop.id,
            payStyleTitle: this.payStyleTitle,
            payAmt: this.activeOrder.cashNeedPay,
            order: this.activeOrder,
            cartInfos: this.getCartInfos(),
            onClose: function (isChange) {
              if (isChange) {
                self.scanInputPay(title)
              }
            }
          })
          console.log(order)
          this.cashOrderVisible = false
          this.$message.success('下单成功')
          this.$store.commit('clearActiveOrder')
          if (this.isPointPage) {
            this.$store.commit('updateOne', order)
          }
        } else {
          this.$message.warning('支付金额不能为空')
        }
      },
      async scanInputPay (title) {
        this.payStyleTitle = '扫码收款'
        if (typeof title === 'string') {
          this.payStyleTitle = title
        }
        if (this.activeOrder && this.payMoney) {
          let order = await scanInputPayModal({
            shopId: this.shop.id,
            payStyleTitle: this.payStyleTitle,
            payAmt: this.activeOrder.cashNeedPay,
            activeOrder: this.activeOrder,
            cartInfos: this.getCartInfos()
          })
          this.cashOrderVisible = false
          this.$message.success('下单成功')
          this.$store.commit('clearActiveOrder')
          if (this.isPointPage) {
            this.$store.commit('updateOne', order)
          }
        } else {
          this.$message.warning('支付金额不能为空')
        }
      },
      async feePayHandle () {
        let action = await this.$confirm('免单操作需要更高的操作权限', '提示')
        if (action === 'confirm') {
          let user = await loginModal()
          if (user) {
            user.isFree = 1
            this.cashDoneHandle(user)
//            this.$message.success('免单成功~')
          }
        }
      },
      // 下单
      createOrderHandle () {
        console.log('下单')
        if (this.isActiveOrder()) {
          let params = {
            payType: 'offl',
            userRemark: '',
            restShopId: this.shop.id,
            payAmt: this.activeOrder.fnActPayAmount,
            restPerson: '',
            isOfflinePay: 0,
            address: '',
            tableId: 86,
            cartInfos: this.createCartInfos(),
            couponId: '',
            fczPrzAmt: '',
            fczPrzRemark: ''
//            doOrderWay: 0 // 代表仅仅下单
          }
          this.$http.post('/ycRest/doOrder', params).then(res => {
            let resData = res.data
            let {order} = resData.data
            this.$message.success(resData.retMsg)
            this.$store.commit('clearActiveOrder', order)
          })
        }
      },
      disableBtnBy (arr) {
        if (this.activeOrder) {
          if (arr.indexOf(this.activeOrder.btnStatus) > -1) {
            return false
          }
        }
        return true
      },
      exitClickHandler () {
        this.$confirm('你确定要退出系统么', '提示').then(() => {
          App.quit()
        })
      },
      // 已打印订单
      printedOrderHandler () {
        if (this.isBuffet) {
          this.$router.replace({name: 'CusPrintedOrder'})
          this.isBuffet = false
        } else {
          this.$router.replace({name: 'CusBuffetMode'})
          this.isBuffet = true
        }
      },
      // 历史订单
      histOrderHandler () {
        this.$router.replace({name: 'CusHistoryOrder'})
      },
      isActiveOrder () {
        if (!this.activeOrder) {
          this.$message({
            message: '请选择订单',
            type: 'warning'
          })
          return false
        }
        return true
      },
      //  手动打印
      printClickHandler () {
        console.log('手动打印', this.activeOrder)
        if (this.isActiveOrder()) {
          this.activeOrder.params = {
            isHand: true
          }
          this.printService.add(this.activeOrder)
        }
      },
      //  显示补打
      async rePrintClickHandler () {
        console.log('-----------------------显示补打')
        if (this.isActiveOrder()) {
          let self = this
          console.log('补打，当前店信息', this.shop)
          await rePrintModal({
            shop: this.shop,
            activeOrder: Object.assign({}, this.activeOrder),
            printFn: function (order) {
              self.printService.add(order)
            }
          })
        }
      },
//      rePrintConfirmHandler () {
//        this.rePrintVisible = false
//      },
      //  确认订单完成
      confirmOrderFinishHandler () {
        console.log('-----------------------确认订单完成')
        if (this.isActiveOrder()) {
          if (!this.activeOrder.isPrint) {
            return this.$message({message: '当前订单还未打印', type: 'warn'})
          }
          let params = {
            id: this.activeOrder.id
          }
          this.$confirm('确认订单已处理完成', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            return this.$http.post('/ycRest/checkDishes', params).then(res => {
              let resData = res.data
              console.log(resData)
              this.$store.commit('removeActiveOrderMap')
              if (!this.isNewPage) {
                this.$store.commit('removeOneById', params.id)
              }
              this.$message({
                message: '订单确认成功',
                type: 'success'
              })
            })
          }).catch((res) => {})
        }
      },
      //  确定线下收款
      confirmPayCashHandler () {
        console.log('-----------------------确定线下收款')
        if (this.isActiveOrder()) {
          this.$confirm('确认线下收款' + this.activeOrder.fnActPayAmount + '元', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            let params = {
              id: this.activeOrder.id,
              adjOpuser: this.shopUser.saleId,
              offlinePayAmt: this.activeOrder.fnActPayAmount
            }
            this.$http.post('/ycRest/newConfirmOfflinePay', params).then(res => {
              let resData = res.data
              let {restOrder} = resData.data
              this.$store.dispatch('setAndRemoreActive', {order: restOrder}).then((newOrder) => {
                if (!newOrder.isPrint) {
//                  this.printService.add(newOrder)
                } else {
                  this.$store.commit('clearActiveOrder')
                }
                if (!this.isNewPage) {
                  this.$store.commit('updateOne', newOrder)
                }
                this.$message({
                  message: '线下收款成功',
                  type: 'success'
                })
              })
            })
          }).catch(() => {})
        }
      },
      // 验证版取消订单
      async cancelOrderPwd () {
        if (this.isActiveOrder()) {
          let id = this.activeOrder.id
          await this.$confirm('你确定要取消订单吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          let action = {}
          if (this.shop.refundNeedRight) {
            action = await loginModal()
          }
          try {
            let res = await this.$http.post('/ycRest/cancelRestOrder', Object.assign({id: id}, action))
            let resData = res.data
            let {restOrder} = resData.data
            this.$store.commit('removeActiveOrderMap')
            if (!this.isNewPage) {
              this.$store.commit('removeOneById', id)
            }
            this.$message({
              message: '取消订单成功',
              type: 'success'
            })
            this.$store.dispatch('orderCancel', {order: restOrder})
          } catch (e) {
            console.error('取消订单操作报错', e)
          }
        }
      },
      //  取消订单
      cancelOrder () {
        console.log('-----------------------取消订单')
        if (this.isActiveOrder()) {
          let id = this.activeOrder.id
          this.$confirm('你确定要取消订单吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/ycRest/cancelRestOrder', {id: id}).then(res => {
              let resData = res.data
              let {restOrder} = resData.data
//              this.$store.commit('removeActiveOrder')
              this.$store.commit('removeActiveOrderMap')
              if (!this.isNewPage) {
                this.$store.commit('removeOneById', id)
              }
              this.$message({
                message: '取消订单成功',
                type: 'success'
              })
              this.$store.dispatch('orderCancel', {order: restOrder}).then(newOrder => {})
            }).catch(err => {
              console.error('取消订单操作报错', err)
            })
          }).catch(() => {})
        }
      },
      //  清空activeOrder
      clearActiveOrder () {
        this.$store.commit('clearActiveOrder')
      },
      setCurrent (row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      //   上班打卡
      workClickHandler () {
        console.log('上班打卡显示')
        workModal()
      },
      handleCurrentChange (val) {
        console.log('选中', val)
        this.currentRow = val
      },
      // 改价显示
      changeAmtClickHandler () {
        console.log('-----------------------改价显示')
        if (this.isActiveOrder()) {
          changeAmtModal({
            shopAuth: this.shop.refundNeedRight,
            form: {
              id: this.activeOrder.id,
              adjOpuser: this.shopUser.saleId,
              adjAmt: this.activeOrder.fnActPayAmount,
              adjRemark: ''
            }
          }).then(restOrder => {
            this.$message.success('改价成功')
            this.$store.commit('setActiveOrder', restOrder)
            this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
              console.log(bool, '哈哈哈')
              if (bool) {
                this.$store.commit('updatePrintOrderMap', restOrder)
              }
              if (!this.isNewPage) {
                console.log('不是当前newOrder页面更新订单状态')
                this.$store.commit('updateOne', restOrder)
              }
            })
          })
        }
      },
      // 退单显示
      backAmtClickHandler () {
        console.log('-----------------------退单显示')
        if (this.isActiveOrder()) {
          backAmtModal({
            shopAuth: this.shop.refundNeedRight,
            form: {
              id: this.activeOrder.id,
              refundAmt: currency(this.activeOrder.fnActPayAmount)
            }
          }).then(restOrder => {
            this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
              if (this.isPrintedPage || this.isPointPage) {
                this.$store.commit('removeOne', newOrder)
              }
              if (this.isHistoryPage) {
                this.$store.commit('updateOne', newOrder)
              }
            })
          })
        }
      },
      //  退菜显示
      async backCaiClickHandler () {
        console.log('-----------------------退菜')
        if (this.isActiveOrder()) {
          this.backCaiForm = {
            detailInfos: '',
            remark: ''
          }
          this.btnLoading = false
          let res = await this.$http.post('/ycRest/getRestOrderRefundData', {orderId: this.activeOrder.id})
          let resData = res.data
          let {detailList} = resData.data
          detailList.forEach(item => {
            item.tuiNum = 0
            if (item.buyCount === 0) {
              item.btnDisabled = true
            } else {
              item.btnDisabled = false
            }
          })
          console.log('---------await-------------------')
          let {restOrder, isAllRefund} = await backVegetablesModal({
            form: {
              detailInfos: '',
              remark: ''
            },
            list: detailList,
            shopAuth: this.shop.refundNeedRight
          })
          this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
            this.$message({
              message: '退菜成功',
              type: 'success'
            })
            if ((this.isPrintedPage && isAllRefund) || (this.isPointPage && isAllRefund)) {
              this.$store.commit('removeOne', newOrder)
            } else {
              this.$store.commit('updateOne', newOrder)
            }
          })
        }
      },
      //  日报显示
      async showDayClickHandler () {
        console.log('-----------------------日报显示')
        let res = await this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1, exchangeType: 3})
        let resData = res.data
        let {data, saleBeginTime, saleEndTime, printList} = resData.data
        let newPrintList = await dayModal({
          exchangeType: 3,
          shopId: this.shop.id,
          shopName: this.shop.restName,
          dayData: data,
          list: printList,
          dateStart: saleBeginTime,
          dateEnd: saleEndTime
        })
        this.$message.success('操作成功，日报已往打印机')
        this.$store.dispatch('addPrintObj', {printList: newPrintList})
      },
      //  交办单显示
      async showHandoverClickHandler () {
        console.log('-----------------------交办单显示')
        let res = await this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id})
        let resData = res.data
        let printList = await handoverModal({
          exchangeType: 3,
          shopId: this.shop.id,
          handoverData: resData.data
        })
        this.$message.success('操作成功，交办单已往打印机')
        this.$store.dispatch('addPrintObj', {printList})
        console.log('打印交班单')
      },
      moreFnClickHandler () {
        if (this.$route.path === '/mainCus/otherFn') {
          this.isMoreFn = false
          this.$router.back()
        } else {
          this.isMoreFn = true
          this.$router.push({name: 'CusOtherFn'})
        }
      },
      logoutClickHandle () {
        console.log('-----------------------退出登录')
        this.$confirm('你确定要切换账号么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clearLogs()
          this.$http.post('/doLogout').then((res) => {
            if (res.data.retCode === 0) {
              this.$store.dispatch('logoutAction').then(() => {
                this.$router.replace({name: 'Login'})
              })
            }
          })
        }).catch(() => {})
      }
    },
    created () {
      this.scan = scanner(this.scanerRes)
    },
    destroyed () {
      if (this.scn) {
        this.scan.stop()
        this.scan = null
      }
      this.$store.commit('clearActiveOrder')
    }
  }
</script>
