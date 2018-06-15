<template>
  <el-container class="main">
    <el-container>
      <el-aside class="el-container  is-vertical" width="340px" style="max-width:340px;">
        <div class="food_mode_quick flex_item" style="width:340px;">
          <div class="padding">
            <!--<h5>快餐模式</h5>-->
            <div class="grid-x ">
              <div class="cell small-6 bold fs14">订单：{{activeOrd.vOrderNo}}</div>
              <div class="cell small-6 bold  fs14">桌号：{{activeOrd.tableNum}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6  fs14">人数：{{activeOrd.restPerson?activeOrd.restPerson+'位':'1位'}}</div>
              <div class="cell small-6  fs14">下单人：{{[1,2].indexOf(activeOrd.assistantOp)>-1?'店员':'客户'}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6  fs14">状态：{{ orderStatus[activeOrd.status]}}</div>
              <div class="cell small-6  fs14">支付方式：<span class="fs13">{{payType[activeOrd.payType]}}</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6  fs14">下单时间：<span class="fs14">{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</span>
              </div>
              <div class="cell small-6  fs14 bold">合计：{{activeOrd.fnActPayAmount | currency}}<span v-if="activeOrd.adjType===1"  class="fs12 text-alert" style="color:#f56c6c">[免单]</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12  fs14">发票状态：<span class="fs14">{{invoiceStatus[activeOrd.invoiceStatus] }}</span>
              </div>
            </div>
            <div class="grid-x " v-if="activeOrd.adjRemark">
              <div class="cell small-12 fs14">订单备注：<span class="fs14">{{activeOrd.adjRemark}}</span>
              </div>
            </div>
            <div class="grid-x " v-if="activeOrd.userRemark">
              <div class="cell small-12 fs14">用户备注：<span class="fs14">{{activeOrd.userRemark }}</span>
              </div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                    @current-change="handleCurrentChange" style="width:340px;">
            <!--<el-table-column property="status" label="状态"></el-table-column>-->
            <el-table-column  label="菜品名称" >
              <template slot-scope="scope">
                <span class="">{{scope.row.restProName}} <span v-if="scope.row.attr" >[{{scope.row.attr}}]</span></span>
                <div v-if="scope.row.subItems">
                  <p class="fs12" style="line-height: 1;transform: scale(0.85);margin-bottom:0;margin-left: -10px;color:#989898;" v-for="item in scope.row.subItems">{{item.name}}x{{item.num}}</p>
                </div>
              </template>
            </el-table-column>
            <!--<el-table-column property="restProName" label="菜品名称" ></el-table-column>-->
            <el-table-column property="buyCount" label="数量" width="45"></el-table-column>
            <el-table-column property="perCash" label="单价" width="65"></el-table-column>
            <el-table-column property="amount" label="小计" width="65"></el-table-column>
            <el-table-column  v-if="activeOrd.isNew" label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="danger" size="mini">-</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<div style="margin-top: 20px">-->
          <!--<el-button @click="setCurrent(tableData[1])">选中第二行</el-button>-->
          <!--<el-button @click="setCurrent()">取消选择</el-button>-->
          <!--</div>-->
        </div>
        <div class="aside-footer ">
          <div  class="flex_box">
            <div class="row ">
              <div>
                <button :disabled="changeAmtDisabled"  @click="changeAmtClickHandler" type="button" class="button  light">改价</button>
                <button :disabled="cancelOrderDisabled" @click="cancelOrderPwd" type="button" class="button light">取消</button>
                <button :disabled="rePrintClickDisabled" @click="rePrintClickHandler" type="button" class="button light">补打</button>
                <button :disabled="printClickDisabled"  @click="printClickHandler" type="button"  class="button light">打印</button>
              </div>
              <div>
                <!--<button type="button" class="button light">下行</button>-->
                <button :disabled="backAmtDisabled"  @click="backAmtClickHandler" type="button" class="button light">退单</button>
                <button :disabled="backCaiDisabled"  @click="backCaiClickHandler" type="button" class="button light">退菜</button>
                <button :disabled="clearActiveDisable"  @click="clearActiveOrder" type="button" class="button light">清空</button>
                <button :disabled="freeOrderDisable"  @click="freeOrderHandler"  type="button" class="button light">免单</button>
              </div>
            </div>
            <!--<template v-if="shop.restType===2">-->
            <!--<button @click="createOrderHandle" :disabled="createOrderDisabled" class="button  margin5 flex_item fs20 warn " style="max-width:128px;color:#FFF;">下单</button>-->
            <!--</template>-->
            <!--<template v-else >-->
            <button v-show="!isCreatePage && activeOrd.btnStatus === 'payByCash'" @click="confirmPayCashHandler" class="button fcz margin5 flex_item fs16 alert " style="max-width:128px;color:#FFF;">确认线下付款</button>
            <button v-show="isCreatePage" @click="createOrderHandle" :disabled="createOrderDisabled" class="button  margin5 flex_item fs20 warn " style="max-width:128px;color:#FFF;">下单</button>
            <button v-show="!isCreatePage && ['confirmOrder','orderDone'].indexOf(activeOrd.btnStatus) > -1" :disabled="confirmBtnDisable" @click="confirmOrderFinishHandler" class="button info margin5 flex_item fs16 alert " style="max-width:128px;color:#FFF;">确认订单完成</button>
            <!--</template>-->
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
              <div class="cell small-3" style="width:20%;">
                <button @click="newOrderHandler" type="button"  class="button light  expanded   margin5   ">新订单<el-badge v-show="badgePrint" :value="badgePrint" style="height:12px;" ></el-badge></button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button @click="printedOrderHandler"  type="button" class="button  light expanded  margin5   ">已打印单</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button type="button" @click="histOrderHandler" class="button  light  expanded  margin5  ">历史订单</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button type="button"  @click="routeCreatePoint" class="button light  expanded  margin5   ">点菜</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button @click="orderCashHandle" type="button"  class="button orange  expanded   margin5   ">结账</button>
              </div>
            </div>
            <div class="grid-x food_buttons">
              <div class="cell small-3" style="width:20%;">
                <button type="button" @click="moreFnClickHandler" class="button  light expanded  margin5   ">其他功能</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button type="button" @click="workClickHandler" class="button light   expanded  margin5   ">打卡</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button type="button" @click="showDayClickHandler" class="button  light expanded  margin5   ">日报</button>
              </div>
              <div class="cell small-3" style="width:20%;">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班</button>
              </div>
              <div class="cell small-3" style="width:20%;">
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
          <!--{{cashOrderVisible}}-->
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
    .buffet_mode .item_name {
      font-size:14px;
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
  // import { amount as amountRule, mobile, passWd } from '../utils/elemFormRules'
  import {clearLogs} from '../utils/clearLogs'
  import {currency} from '../utils/utils'
  import scanner from '../utils/scanner'
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
  //  let timer
  //   let now = moment(new Date()).format('YYYY-MM-DD')
  export default{
    data () {
      return {
        appVersion: '',
        btnLoading: false,
        dateRange: [],
        backCaiList: [],  //  退菜List
        isNewPrintState: true, // 正在打印和已打印切换
        dayPaperData: {},
        handoverData: {},
        //  打卡
        hitCard: 0,
        cashOrderVisible: false,  // 结账
        // wxPayVisible: false, // 微信支付
        // cashPayVisible: false, // 现金支付
        // discountVisible: false, // 折扣显示

        wxPayLoading: false,
        payLoading: false,
        // xiaoDisBtn: false,
        // jieDisBtn: false,
        // chuDisBtn: false,
        // zhiDisBtn: false,
        // invoiceBtn: false,

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
        // loginVisible: false, // 登录认证
        // loginAuthList: [],
        // loginForm: {
        //   mobile: '',
        //   pwd: ''
        // },
        // loginFormRules: {
        //   mobile: [
        //     {required: true, message: '手机号不能为空', trigger: 'blur'},
        //     {validator: mobile, trigger: 'blur'}
        //   ],
        //   pwd: [
        //     {required: true, message: '密码不能为空', trigger: 'blur'},
        //     {validator: passWd, trigger: 'blur'}
        //   ]
        // },
        //  改价form
        // changeAmtVisible: false,
        // changeAmtForm: {
        //   adjAmt: '',
        //   adjRemark: ''
        // },
        // changeAmtRules: {
        //   adjAmt: [
        //     {required: true, message: '金额不能为空', trigger: 'blur'},
        //     {validator: amountRule, trigger: 'blur'}
        //   ],
        //   adjRemark: [
        //     {required: true, message: '备注不能为空', trigger: 'blur'}
        //   ]
        // },
        //  退菜
        // backCaiForm: {
        //   remark: ''
        // },
        // backCaiRules: {
        //   remark: [
        //     {required: true, message: '备注不能为空', trigger: 'blur'}
        //   ]
        // },
        //   退单form
        // backAmtVisible: false,
        // backAmtForm: {
        //   id: '',
        //   refundAmt: '',
        //   refundRemark: ''
        // },
        // backAmtRules: {
        //   refundAmt: [
        //     {required: true, message: '金额不能为空', trigger: 'blur'},
        //     {validator: amountRule, trigger: 'blur'}
        //   ],
        //   refundRemark: [
        //     {required: true, message: '备注不能为空', trigger: 'blur'}
        //   ]
        // },
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
//      'printOrders' (newVal, oldVal) {
//        if (!newVal || !oldVal) return
//        if (newVal.length !== oldVal.length) {
//          console.log(newVal, oldVal, '数组变化')
//        }
//      },
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
      badgePrint () {
        if (this.printOrders) {
          return this.printOrders.length
        }
        return 0
      },
      // 是否是新订单页
      isNewPage () {
        return this.$route.name === 'NewOrder'
      },
      // 是否是已打印页
      isPrintedPage () {
        return this.$route.name === 'PrintedOrder'
      },
      // 是否是历史记录页
      isHistoryPage () {
        return this.$route.name === 'HistoryOrder'
      },
      // 是否在记录展示页
      isShowPage () {
        return this.$route.name === 'PrintedOrder' || this.$route.name === 'HistoryOrder'
      },
      // 是否在点餐模式页
      isCreatePage () {
        return this.$route.name === 'BuffetMode'
      },
      // 判断是否是点菜页面
      // isPointPage () {
      //   return this.$route.name === 'CusPrintedOrder'
      // },
      // 改价按钮是否禁用
      changeAmtDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      //  cancelOrderDisabled () {
      //    return this.disableBtnBy(['payByCash'])
//      },
      // 取消按钮是否禁用
      cancelOrderDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      // 下单按钮是否禁用
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
      // 补打按钮是否禁用
      rePrintClickDisabled () {
        if (this.activeOrder && !this.activeOrder.isNew) {
          return false
        }
        return true
      },
      // 打印按钮是否禁用
      printClickDisabled () {
        if (this.activeOrder) {
          if (!this.activeOrder.isPrint && !this.activeOrder.isNew) {
            return false
          }
        }
        return true
      },
      // 退单按钮是否禁用
      backAmtDisabled () {
        if (this.activeOrder && this.activeOrder.status === 5) {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      // 退菜按钮是否禁用
      backCaiDisabled () {
        if (this.activeOrder && this.activeOrder.orderType === 'pay') {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      // 清空按钮是否禁用
      clearActiveDisable () {
        if (this.activeOrder) {
          return false
        }
        return true
      },
      // 确认订单完成是否禁用
      confirmBtnDisable () {
        return this.disableBtnBy(['confirmOrder'])
      },
      // 免单按钮是否禁用
      freeOrderDisable () {
        if (this.activeOrder) {
          if (this.activeOrder.isNew) {
            return true
          }
//          console.log(this.activeOrder, 'activeOrder')
          if (this.activeOrder.adjType && this.activeOrder.adjType === 1) {
            return true
          }
          let buildTime = moment(this.activeOrder.buildTime).format('YYYY-MM-DD')
          if (buildTime === now) {
            return false
          } else {
            return true
          }
        }
        return true
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
      // 切换到点餐页面
      routeCreatePoint () {
        this.$router.replace({name: 'BuffetMode'})
      },
      // 计算唯一id
      guid () {
        function S4 () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return ('' + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
      },
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
          if (item.subItems) {
            let guid = this.guid()
            tmp.push(`${item.id};${item.buyCount};${guid};0;0;${item.attr || ''};;`)  // 父商品
            item.subItems.forEach(sub => {
              // 设置提交的数据格式 item.id;数量;   item.guid;关联父产品id;关联父产品guid;attr口味备注;subPrintTag是否更随主商品;remark
              tmp.push(`${sub.id};${sub.num};0;${item.id};${guid};${sub.attr || ''};${sub.fnSubPrintTag || ''};`)
            })
          } else {
            tmp.push(`${item.id};${item.buyCount};0;0;0;${item.attr || ''};;`)
          }
        })
        return tmp.join('|')
      },
      // 仅订单下单
      async orderDown (params) {
        console.log('下单中')
        let res = await this.$http.post('/ycRest/doOrder', params)
        let resData = res.data
        let {order} = resData.data
        this.$store.commit('setActiveOrder', Object.assign({}, this.activeOrder, order, {isNew: false}))
        return order
      },
      // 线下付款
      async orderOfflPay (params, order) {
        let res = await this.$http.post('/ycRest/doOfflPay', Object.assign({}, params, {orderId: order.id}))
        let resData = res.data.data
        // this.$message.success('下单成功')
        this.cashOrderVisible = false
        this.$store.dispatch('cashDownRomreOrderInNew', {order: resData.order}).then((newOrder) => {
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
        // this.$store.commit('clearActiveOrder')
        // if (this.isShowPage) {
        //   this.$store.commit('updateOne', resData.order)
        // }
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
              tableId: this.activeOrder.tableId,
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
              } catch (e) {
                console.error(e)
              } finally {
                this.payLoading = false
              }
            } else {
              try {
                await this.orderOfflPay(params, this.activeOrder)
              } catch (e) {
                console.error(e)
              } finally {
                this.payLoading = false
              }
            }
          }
        }
      },
      inputFocus (e) {
        this.input = e.target
      },
      // 免单
      async freeOrderHandler () {
        console.log('免单')
        if (this.activeOrder) {
          let id = this.activeOrder.id
          let payStatus = this.activeOrder.status
          let action = await this.$confirm('免单操作需要更高的操作权限', '提示')
          if (action === 'confirm') {
            let user = await loginModal()
            if (user) {
              user.isFree = 1
//            参数：saleId（授权人Id）、psd（授权人密码）、id（订单id）、adjOpuser（店员Id）。
              let res = await this.$http.post('/ycRest/freeSingle', Object.assign(user, {id: id, adjOpuser: this.shopUser.saleId}))
              console.log(res)
              console.log(user, 'user')
              let resData = res.data
              let {restOrder} = resData.data
              if (payStatus === 9) {
                this.$store.commit('setActiveOrder', restOrder)
                this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
                  this.$message({
                    message: '免单成功,点击确认线下付款完成订单',
                    type: 'success'
                  })
                  if (bool) {
                    this.$store.commit('updatePrintOrderMap', restOrder)
                  }
                  if (!this.isNewPage) {
                    console.log('不是当前newOrder页面更新订单状态')
                    this.$store.commit('updateOne', restOrder)
                  }
                })
              } else {
                this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
                  this.$message({
                    message: '免单成功',
                    type: 'success'
                  })
                  if (this.isNewPage) {
                    this.$store.commit('removeOne', newOrder)
                  } else {
                    this.$store.commit('updateOne', newOrder)
                  }
                })
              }
            }
          }
        }
      },
      // 禁用按钮帮助方法
      disableBtnBy (arr) {
        if (this.activeOrder) {
          if (arr.indexOf(this.activeOrder.btnStatus) > -1) {
            return false
          }
        }
        return true
      },
      // 退出按钮
      exitClickHandler () {
        console.log('点击了退出按钮')
        this.$confirm('你确定要退出系统么', '提示').then(() => {
          console.log('成功退出')
          App.quit()
        })
      },
      // 新订单按钮
      newOrderHandler () {
        this.$router.push({name: 'NewOrder'})
      },
      // 已打印订单按钮
      printedOrderHandler () {
        this.$router.push({name: 'PrintedOrder'})
      },
      // 历史订单按钮
      histOrderHandler () {
        this.$router.replace({name: 'HistoryOrder'})
      },
      // 判断是否选中订单
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
      //  打印按钮功能 ----------手动打印
      printClickHandler () {
        console.log('手动打印', this.activeOrder)
        if (this.isActiveOrder()) {
          this.activeOrder.params = {
            isHand: true
          }
          this.printService.add(this.activeOrder)
        }
      },
      //  补打按钮功能 --------- 显示补打
      async rePrintClickHandler () {
        console.log('-----------------------显示补打')
        if (this.isActiveOrder()) {
          let self = this
          console.log('补打，当前店信息', this.shop)
          await rePrintModal({
            shop: this.shop,
            activeOrder: Object.assign({}, this.activeOrder),
            printFn: function (order) {
              console.log('我被调用了')
              self.printService.add(order)
            }
          })
        }
      },
      // 手动补打 【应该废弃了】
      // toSinglePrint (type, btnName, newType) {
      //   if (this.isActiveOrder()) {
      //     this[btnName] = true
      //     let order = Object.assign({}, this.tmpOrder, {printSingleType: newType})
      //     console.log('手动补打', btnName)
      //     this.printService.add(order)
      //     setTimeout(() => {
      //       this[btnName] = false
      //     }, 1500)
      //   }
      // },
      // 手动打印开发票单
      // 手动红冲发票 【应该也废弃了，抽象成组件了 rePrintModal中了】
      // sendCancelInvoice () {
      //   if (this.isActiveOrder()) {
      //     console.log('手动红冲发票')
      //     let id = this.activeOrder.id
      //     this.$prompt('请填写红冲原因', '发票红冲', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       inputPattern: /.+/,
      //       inputErrorMessage: '红冲原因不能为空',
      //       beforeClose: (action, instance, done) => {
      //         if (action === 'confirm') {
      //           instance.confirmButtonLoading = true
      //           this.$http.post('/eleInvoice/nullifyFpBySa', {
      //             orderId: id,
      //             shopType: 1,
      //             redReason: instance.inputValue
      //           }).then(res => {
      //             let resData = res.data
      //             let {result} = resData.data
      //             if (result && parseInt(result.code) === 1) {
      //               done()
      //               instance.confirmButtonLoading = false
      //             }
      //           }).catch(() => {
      //             instance.confirmButtonLoading = false
      //           })
      //         } else {
      //           done()
      //         }
      //       }
      //     }).then(({action, value}) => {
      //       if (action === 'confirm') {
      //         this.$message.success('红冲成功')
      //       }
      //     }).catch(() => {})
      //   }
      // },
      // rePrintConfirmHandler () {
      //   this.rePrintVisible = false
      // },
      //  确认订单完成按钮功能  确认订单完成
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
      //  确定线下收款功能
      confirmPayCashHandler () {
        console.log('-----------------------确定线下收款,confirmPayCashHandler')
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
      // 取消订单按钮
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
      //  清空按钮功能 activeOrder
      clearActiveOrder () {
        this.$store.commit('clearActiveOrder')
      },
      // 【好像没什么用】
      setCurrent (row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      // 【没有什么实际作用】
      handleCurrentChange (val) {
        console.log('选中', val)
        this.currentRow = val
      },
      //  打卡按钮功能 上班打卡
      workClickHandler () {
        console.log('上班打卡显示')
        workModal()
      },

      // 改价按钮功能  显示
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
//      /ycRest/correctAmout
      },
      // 退单按钮功能  显示
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
              if (this.isPrintedPage) {
                this.$store.commit('removeOne', newOrder)
              }
              if (this.isHistoryPage) {
                this.$store.commit('updateOne', newOrder)
              }
            })
          })
        }
      },
      //  退菜按钮功能显示
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
            if (this.isPrintedPage && isAllRefund) {
              this.$store.commit('removeOne', newOrder)
            } else {
              this.$store.commit('updateOne', newOrder)
            }
          })
        }
      },
      //  日报按钮功能显示
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
      // 结账按钮功能
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
      // 结账页面打开触发open回调
      cashOrderOpen () {
        setTimeout(() => {
          let el = this.$refs.cashInput && this.$refs.cashInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
      },
      // 折扣按钮功能
      async discountHandle () {
        console.log('-------------------点击了折扣按钮')
        let percent = await discPercentModal()
        console.log(percent)
        this.$store.commit('setActiveDiscount', percent)
      },
      // 扫码支付功能
      async wxPayClickHandle (title) {
        console.log('--------------------扫码收款按钮')
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
          this.$store.dispatch('cashDownRomreOrderInNew', {order: order}).then((newOrder) => {
            if (!newOrder.isPrint) {
//                  this.printService.add(newOrder)
            } else {
              this.$store.commit('clearActiveOrder')
            }
            if (!this.isNewPage) {
              this.$store.commit('updateOne', newOrder)
            }
            this.$message({
              message: '订单支付成功',
              type: 'success'
            })
          })
          // this.$store.commit('clearActiveOrder')
          // if (this.isPointPage) {
          //   this.$store.commit('updateOne', order)
          // }
        } else {
          this.$message.warning('支付金额不能为空')
        }
      },
      // 手动输入微信支付
      async scanInputPay (title) {
        console.log('--------------手动输入收款')
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
          // this.$message.success('下单成功')
          this.$store.dispatch('cashDownRomreOrderInNew', {order: order}).then((newOrder) => {
            if (!newOrder.isPrint) {
//                  this.printService.add(newOrder)
            } else {
              this.$store.commit('clearActiveOrder')
            }
            if (!this.isNewPage) {
              this.$store.commit('updateOne', newOrder)
            }
            this.$message({
              message: '订单支付成功',
              type: 'success'
            })
          })
          // this.$store.commit('clearActiveOrder')
          // if (this.isShowPage) {
          //   this.$store.commit('updateOne', order)
          // }
        } else {
          this.$message.warning('支付金额不能为空')
        }
      },
      // 收款页面免单操作
      async feePayHandle () {
        console.log('--------------点击了收款页面的免单操作')
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
      // 下单按钮功能呢
      createOrderHandle () {
        console.log('------------------点击了下单')
        if (this.isActiveOrder()) {
          let params = {
            payType: 'offl',
            userRemark: '',
            restShopId: this.shop.id,
            payAmt: this.activeOrder.fnActPayAmount,
            restPerson: '',
            isOfflinePay: 0,
            address: '',
            tableId: this.activeOrder.tableId,
            cartInfos: this.getCartInfos(),
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
      //  交办单显示
      async showHandoverClickHandler () {
        console.log('-----------------------点击了交办单显示')
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
      // 其他功能按钮功能
      moreFnClickHandler () {
        console.log('---------------------点击了其他功能')
        if (this.$route.path === '/main/otherFn') {
          this.isMoreFn = false
          this.$router.back()
        } else {
          this.isMoreFn = true
          this.$router.push({name: 'OtherFn'})
        }
      },
      // 安全退出按钮功能
      logoutClickHandle () {
        console.log('-----------------------点击退出登录')
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
    components: {},
    created () {
      this.printService = this.$store.getters.printService
      // 保存桌号
      this.deskNoArr = this.shop.deskNoArr
      console.log(this.deskNoArr)
      // 初始扫码控件
      this.scan = scanner(this.scanerRes)
      // console.log(JSON.stringify(this.printService), 'printService')
    },
    destroyed () {
      if (this.scan) {
        this.scan.stop()
        this.scan = null
      }
      this.$store.commit('clearActiveOrder')
    }
  }
</script>
