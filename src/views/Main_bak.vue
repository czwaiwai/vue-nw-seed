<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v{{appVersion}} ({{shop.restName}})</div>
        <div class="cell small-6 text-right" style="line-height:44px;">
          <span class="logo_time">{{currentTime}}</span>
          <span class="light fs12 label" style="">{{shopUser.saleName}}[{{shopUser.mobile}}]</span>
          <a @click="exitClickHandler" style="margin:0" class="button small alert" href="javascript:void(0)" >退出系统</a></div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="el-container  is-vertical" width="400px" style="max-width:400px;">
        <div class="food_mode_quick flex_item" style="width:400px;">
          <div class="padding">
            <!--<h5>快餐模式</h5>-->
            <div class="grid-x ">
              <div class="cell small-6 bold">订单：{{activeOrd.vOrderNo}}</div>
              <div class="cell small-6 bold">桌号：{{activeOrd.tableNum}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">人数：{{activeOrd.restPerson?activeOrd.restPerson+'位':'1位'}}</div>
              <div class="cell small-6">下单人：{{activeOrd.assistantOp===1?'店员':'客户'}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">状态：{{ orderStatus[activeOrd.status]}}</div>
              <div class="cell small-6">支付方式：<span class="fs13">{{payType[activeOrd.payType]}}</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">下单时间：<span class="fs14">{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</span>
              </div>
              <div class="cell small-6 bold">合计：{{activeOrd.fnActPayAmount | currency}}<span v-if="activeOrd.adjType===1"  class="fs12 text-alert" style="color:#f56c6c">[免单]</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12">发票状态：<span class="fs14">{{invoiceStatus[activeOrd.invoiceStatus] }}</span>
              </div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12">用户备注：<span class="fs14">{{activeOrd.userRemark }}</span>
              </div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                    @current-change="handleCurrentChange" style="width:400px;">
            <!--<el-table-column property="status" label="状态"></el-table-column>-->
            <el-table-column property="restProName" label="菜品名称" ></el-table-column>
            <el-table-column property="buyCount" label="数量" width="60"></el-table-column>
            <el-table-column property="perCash" label="单价" width="80"></el-table-column>
            <el-table-column property="amount" label="小计" width="80"></el-table-column>
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
              <button v-show="activeOrd.btnStatus === 'payByCash'" @click="confirmPayCashHandler" class="button fcz margin5 flex_item fs20 alert " style="max-width:128px;color:#FFF;">确认线下付款</button>
              <button v-show="['confirmOrder','orderDone'].indexOf(activeOrd.btnStatus) > -1" :disabled="confirmBtnDisable" @click="confirmOrderFinishHandler" class="button info margin5 flex_item fs20 alert " style="max-width:128px;color:#FFF;">确认订单完成</button>
            <!--</template>-->
          </div>
        </div>
      </el-aside>
      <el-container>
        <div class="unit_header padding15-h">{{$route.meta.title}}</div>
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
                <button @click="newOrderHandler" type="button"  class="button light  expanded   margin5   ">新订单<el-badge v-show="badgePrint" :value="badgePrint" style="height:12px;" ></el-badge></button>
              </div>
              <div class="cell small-3">
                <button @click="printedOrderHandler"  type="button" class="button  light expanded  margin5   ">已打印单</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="workClickHandler" class="button light   expanded  margin5   ">打卡</button>
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


    <el-dialog title="打卡" :visible.sync="workDialogVisible" width="600px">
      <div>
        <el-radio v-model="hitCard" label="1" border>上班打卡</el-radio>
        <el-radio v-model="hitCard" label="2" border>下班打卡</el-radio>
        <el-radio v-model="hitCard" label="3" border>交班打卡</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="hitCardClickHandler">确定</el-button>
      </span>
    </el-dialog>

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

    <el-dialog title="日报预览" :visible.sync="dayDialogVisible" width="600px">
      <div class="day_paper">
        <h5>日报</h5>
        <p>店铺：{{shop.restName}}</p>
        <p>统计日期：{{dateRange[1] | mydate('-') }}</p>
        <!--<p>统计结束日期：{{dateRange[1]}}</p>-->
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
        <el-button @click="dayDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="printDayPaper">打印</el-button>
      </span>
    </el-dialog>


    <el-dialog title="交班单" :visible.sync="handoverDialogVisible" width="600px">
      <div>日期：<label style="display:inline-block">{{ dateRange[1] | mydate('-') }}</label></div>
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
        <el-button @click="handoverDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="printHandover">打印</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打卡记录" :visible.sync="hitRcodeVisible" width="600px">
      <div class="block">
        <span class="demonstration">日期选择</span>
        <el-date-picker
          v-model="hitDate"
          type="date"
          placeholder="选择日期" @change="hitDateChange">
        </el-date-picker>
      </div>
      <div class="hit_record">
        <el-table   height="250" :data="hitRecordTable">
          <el-table-column type="index"  label="序号" width="50"></el-table-column>
          <el-table-column property="saleName" label="姓名" width="100"></el-table-column>
          <el-table-column property="buildTime" label="打卡时间"></el-table-column>
          <el-table-column property="remark" label="打卡类型"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hitRcodeVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
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
  import { getLocalPrinters } from '../utils/getLocalPrinters'
  import roundTime from '../utils/roundTime'
  import { mapGetters } from 'vuex'
  import bus from '../utils/bus'
  import uploadLogs from '../utils/uploadLogs'
  import getConfig from '../utils/getConfig'
  import { amount as amountRule, mobile, passWd } from '../utils/elemFormRules'
  import {clearLogs} from '../utils/clearLogs'
  import {currency} from '../utils/utils'
  import loginModal from '../components/loginModal/'
  import backAmtModal from '../components/backAmtModal/'
  import changeAmtModal from '../components/changeAmtModal/'
  import backVegetablesModal from '../components/backVegetablesModal'
  import rePrintModal from '../components/rePrintModal/'
  import {wsUrl} from '../utils/env'
  import WsHelper from '../utils/wsHelper'
  import singleton from '../utils/singleton'
  let timer
  let now = moment(new Date()).format('YYYY-MM-DD')
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
        rePrintVisible: false, // 补打显示
        backCaiVisible: false,  //  退菜visible
        hitRcodeVisible: false, //  打卡记录
        workDialogVisible: false,
        handoverDialogVisible: false,
        dayDialogVisible: false, // 日报对话框

        xiaoDisBtn: false,
        jieDisBtn: false,
        chuDisBtn: false,
        zhiDisBtn: false,
        invoiceBtn: false,

        hitDate: now,
        hitRecordTable: [], // 打卡记录
        currentTime: '',
        now: now,
        input: null, // 虚拟键盘使用
        //  用户验证
        loginVisible: false, // 登录认证
        loginAuthList: [],
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
        }
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
      isNewPage () {
        return this.$route.name === 'NewOrder'
      },
      isPrintedPage () {
        return this.$route.name === 'PrintedOrder'
      },
      isHistoryPage () {
        return this.$route.name === 'HistoryOrder'
      },
      changeAmtDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      cancelOrderDisabled () {
        return this.disableBtnBy(['payByCash'])
      },
      rePrintClickDisabled () {
        if (this.activeOrder) {
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
      freeOrderDisable () {
        if (this.activeOrder) {
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
      newOrderHandler () {
        this.$router.push({name: 'NewOrder'})
      },
      // 已打印订单
      printedOrderHandler () {
        this.$router.push({name: 'PrintedOrder'})
      },
      // 历史订单
      histOrderHandler () {
        this.$router.replace({name: 'HistoryOrder'})
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
              console.log('我被调用了')
              self.printService.add(order)
            }
          })
        }
      },
      // 手动补打
      toSinglePrint (type, btnName, newType) {
        if (this.isActiveOrder()) {
          this[btnName] = true
          let order = Object.assign({}, this.tmpOrder, {printSingleType: newType})
          console.log('手动补打', btnName)
          this.printService.add(order)
          setTimeout(() => {
            this[btnName] = false
          }, 1500)
        }
      },
      // 手动打印开发票单
      // 手动红冲发票
      sendCancelInvoice () {
        if (this.isActiveOrder()) {
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
      },
      rePrintConfirmHandler () {
        this.rePrintVisible = false
      },
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
//              this.$store.commit('removeActiveOrder')
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
      //  取消订单 [已弃用]
      async cancelOrder () {
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
      //  改价备注建议
      suggestChangeAmt (queryStr, cb) {
        cb([
          {'value': '员工打折'},
          {'value': '活动优惠'},
          {'value': '产品质量问题'},
          {'value': '系统测试'}
        ])
      },
      suggestBackAmt (queryStr, cb) {
        cb([
          {'value': '员工折让'},
          {'value': '产品质量'},
          {'value': '顾客更换产品'},
          {'value': '产品售完'},
          {'value': '顾客赶时间退餐品'},
          {'value': '测试订单'}
        ])
      },
      setCurrent (row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      //   上班打卡
      workClickHandler () {
        this.hitCard = 0
        this.workDialogVisible = true
        this.btnLoading = false
      },
      hitCardClickHandler () {
        console.log('-----------------------打卡')
        if (!this.hitCard) {
          return this.$message.warning('请选择你要打的卡')
        }
        this.btnLoading = true
        this.$http.post('/ycRest/assistantSign', {signType: this.hitCard}).then((res) => {
          this.btnLoading = false
          this.$message({
            message: '你已打卡成功',
            type: 'success'
          })
          this.workDialogVisible = false
        }).catch(() => {
          this.btnLoading = false
        })
      },
      //  上班打卡记录
      workClickRecordHandler (e) {
        //  /ycRest/assistantSignRecord
        console.log('-----------------------上班打卡记录')
        this.hitDate = now
        if (typeof e === 'string') {
          this.hitDate = e
        }
        this.$http.post('/ycRest/assistantSignRecord', {buildTime: this.hitDate}).then(res => {
          this.hitRcodeVisible = true
          let resData = res.data
          this.hitRecordTable = resData.data
        })
      },

      hitDateChange (val) {
        let curr = moment(val).format('YYYY-MM-DD')
        this.workClickRecordHandler(curr)
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
//      /ycRest/correctAmout
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
            if (this.isPrintedPage && isAllRefund) {
              this.$store.commit('removeOne', newOrder)
            } else {
              this.$store.commit('updateOne', newOrder)
            }
          })
        }
      },
      //  日报显示
      showDayClickHandler () {
        console.log('-----------------------日报显示')
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1, exchangeType: 3}).then(res => {
          this.dayDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          this.tmpPrintList = printList
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          console.log(resData, '日报--------', data)
        })
      },
      dayPaperChange (e) {
        console.log('-----------------------日报修改日期')
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, returnType: 1, restShopId: this.shop.id}).then(res => {
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.tmpPrintList = printList
          this.dayPaperData = data
        })
      },
      printDayPaper () {
        console.log('-----------------------打印日报')
        console.log(bus)
//        let dayPaperData = Object.assign({tplName: 'dayPaper', restName: this.shop.restName}, {isOnlyTpl: true, printList: this.tmpPrintList})
//        this.printService.add(dayPaperData)
        this.$store.dispatch('addPrintObj', {printList: this.tmpPrintList})
        this.dayDialogVisible = false
      },
      //  交办单日期变更
      handoverChange () {
        console.log('-----------------------交办单日期变更')
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, restShopId: this.shop.id}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.tmpPrintList = printList
          this.handoverData = resData.data
        })
      },
      //  交办单显示
      showHandoverClickHandler () {
        console.log('-----------------------交办单显示')
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, exchangeType: 3}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.tmpPrintList = printList
          this.handoverData = resData.data
        })
      },
      printHandover () {
        console.log('-----------------------打印交班单')
//        let handoverData = Object.assign({tplName: 'handover', restName: this.shop.restName}, this.handoverData)
//        this.printService.add(handoverData)
        this.$store.dispatch('addPrintObj', {printList: this.tmpPrintList})
        this.handoverDialogVisible = false
        this.btnLoading = false
        console.log('打印交班单')
      },
      moreFnClickHandler () {
        if (this.$route.path === '/main/otherFn') {
          this.isMoreFn = false
          this.$router.back()
        } else {
          this.isMoreFn = true
          this.$router.push({name: 'OtherFn'})
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
      },
      upLogs (date) {
        console.log('-----------------------拉取日志')
        if (date) {
          uploadLogs(this, this.shop.id, date)
        }
      },
      upStatus (content, title) {
        this.$http.post('/feeback/save', {
          title: title || '查看内容',
          content: content
        })
      },
      socketData (cb) {
        let self = this
        let url = `${wsUrl}${location.host}/fczIM/orderMgr?type=2&shopId=${self.shop.id}`
        return (singleton(function () {
          return new WsHelper(url, cb)
        }))()
      },
      // 轮询检查数据
      roundFn () {
        let netFix = (function () {
          let times = 0
          return {
            isOk (cb) {
              if (times > 0) {
                cb && cb()
              }
              times = 0
            },
            clear () {
              times = 0
            },
            toTry (cb) {
              if (times < 30) {
                times++
                setTimeout(() => cb(true, times), 3000)
              } else {
                cb(false, times)
              }
            }
          }
        })()
        let ids = ''
        let lastPrintIds = ''
        this.round = roundTime((next) => {
          var paramObj = {
            id: '',
            page: 1,
            status: 1,
            pageSize: 50,
            tableNum: '',
            orderIdOrName: '',
            userMobile: '',
            qryType: 0,
            restShopId: this.shop.id,
            startDate: this.now,
            endDate: this.now,
            lastIds: ids,
            lastPrintIds: lastPrintIds
          }
          this.$http.post('/ycRest/restOrderList', paramObj).then(res => {
            netFix.isOk(() => {
              console.info('网络重连成功')
              this.$message.success('网络重连成功!')
            })
            let data = res.data.data
            if (!data) {
              this.upStatus('轮询中/ycRest/restOrderList返回了空的对象' + JSON.stringify(res), 'pc轮询错误')
              return next()
            }
            try {
              if (data.noticeMsg) {
                this.$notify.warning({
                  title: '消息提示',
                  message: data.noticeMsg,
                  duration: 0
                })
              }
              lastPrintIds = ''
              if (data.printList) {
                console.log('添加额外的打印内容')
                let tmpArr = data.printList.map(item => item.pkey)
                lastPrintIds = tmpArr.join(';')
                this.$store.dispatch('addPrintObj', {printList: data.printList})
              }
              if (data.updPrinterStatus) {
                console.log('拉取打印信息')
                let content = '打印机状态：' + this.printService.getPrintState()
                content += '打印机中的队列：' + JSON.stringify(this.printService.showList())
                content += '本地打印机信息：' + JSON.stringify(getLocalPrinters())
                this.upStatus(content, '查看当前店打印机队列状态')
              }
              if (data.updLog) {
                console.info('正在拉取日志')
                this.upLogs(data.updLog)
              }
              if (data.orderLoopSecond) {
                console.log('重新设置轮询间隔', data.orderLoopSecond)
                this.round.setTime(data.orderLoopSecond)
                this.$store.commit('setLoopTime', data.orderLoopSecond)
              }
            } catch (e) {
              console.error(e)
            }

            let {restOrderList} = data
            ids = ''
            if (restOrderList && restOrderList.length > 0) {
              let tmpIds = []
              restOrderList.forEach(item => {
                tmpIds.push(item.id + ',' + item.printMore + ',' + item.printMoreSeq)
              })
              ids = tmpIds.join(';')
              this.$store.dispatch('pushActionMap', {list: restOrderList}).then((newData) => {
                console.log('我不是空数组', JSON.stringify(newData))
                console.log('当前是自动打印状态为：', this.isAuto)
                if (this.isAuto && newData.length > 0) {
                  this.printService.add(newData)
                }
              })
            }
            next()
          }, err => {
            console.error('错误：', err)
            if (err === '请先登录') {
              next(false)
            } else {
              netFix.toTry((bool, times) => {
                if (!bool) {
                  this.$confirm('尝试连接失败，是否继续检测', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '重新登录',
                    type: 'warning'
                  }).then(() => {
                    next(true) // 为轮询是否就继续
                  }).catch(() => {
                    next(false)
                    netFix.clear()
                    this.$router.replace({name: 'Login'})
                  })
                } else {
                  next(bool)
                  this.$message.error('网络断开正在重连中' + times)
                  console.error('错误：' + '网络断开正在重连中' + times)
                }
              })
            }
          }).catch(err => {
            console.log('怎么回事')
            console.error('错误：轮询catch', err)
          })
        }, this.loopTime || 10000, false)
        this.round.start()
        console.log('轮询已正常启动')
      },
      listenService () {
        let self = this
        this.printService = this.$store.getters.printService
        this.printService.setUser(this.user)
        this.printService.listen({
          start () {
            console.log('----------打印已经开始了---------------')
          },
          before (obj) {
            console.log(obj)
            if (obj.isOrder) {
              console.log('--------正在开始打印的订单Obj:', obj.id, '------------')
              console.log('--------', obj && obj.vOrderNo, '--------------')
            } else {
              console.log('--------普通打印')
            }
          },
          after (obj) {
            if (obj.isOrder) {
              try {
                if (obj.isAutoChange) {
                  self.$store.commit('clearActiveOrder')
                }
                self.$store.commit('setFinshPrintOrder', obj)
//              self.$store.commit('removeOrder', obj)
                self.$store.commit('removeOrderMap', obj)
              } catch (e) {
                console.log(e)
              }
              console.log('---------------------结束打印的订单Obj:', obj.id)
              console.log('---------------------', obj && obj.vOrderNo)
            } else {
              console.log('正在进行普通打印')
            }
          },
          error (err, obj, next) {
            console.error(err, '错误：打印机的时候报错了赶紧来看看')
            console.log(obj)
            let vNo = ''
            if (obj.isOrder) {
              vNo = '订单：' + obj.vOrderNo
            }
            self.$confirm(vNo + '打印出错是否继续', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              console.log('店员点击了true' + vNo)
              next(true) // 为轮询是否就继续
            }).catch(() => {
              console.log('店员点击了false' + vNo)
              next(false)
            })
            self.$http.post('/feeback/save', {
              title: '打印回调内错误',
              content: '出现的错误：' + JSON.stringify(err) + '错误对象' + JSON.stringify(obj)
            })
          },
          //  这个对象放弃打印
          giveup (obj) {
            console.log('错误：----------这个订单被放弃了:', obj.id)
          },
          done () {
            console.log('-----------打印已经完成--------------')
          }
        })
      }
    },
    components: {},
    created () {
      // 获取当前PC端版本
      getConfig.then((json) => {
        this.appVersion = json.version
      })
      // 初始化打印数据
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
      this.listenService()
      console.log(this.printService, 'printService')
      if (!this.$isXP) {
        console.log('getLocalPrinters()', getLocalPrinters())
      }
      //  轮询
      if (this.shop.restType !== 2) {
        this.roundFn()
      }
      // websocket
//      this.socketData((event, ws) => {
//        if (event.data === 'pong') return
//        console.log(event, 'socket event')
//        console.log('-------------------------------------------------------------------------')
//        let resData = null
//        try {
//          resData = JSON.parse(event.data)
//        } catch (e) {
//
//        }
//        let {restOrderList} = resData.data
//        let ids = ''
//        if (restOrderList && restOrderList.length > 0) {
//          let tmpIds = []
//          restOrderList.forEach(item => {
//            tmpIds.push(item.id + ',' + (item.printMore || '') + ',' + (item.printMoreSeq || ''))
//          })
//          ids = tmpIds.join(';')
//          ws.send(ids)
//          this.$store.dispatch('pushActionMap', {list: restOrderList}).then((newData) => {
//            console.log('我不是空数组', JSON.stringify(newData))
//            console.log('当前是自动打印状态为：', this.isAuto)
//            if (this.isAuto && newData.length > 0) {
//              this.printService.add(newData)
//            }
//          })
//        }
//      })

      timer = setInterval(() => {
        this.currentTime = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    },
    destroyed () {
      if (this.round) {
        console.log(this.round, 'stop---执行')
        this.round.stop()
      }
      clearInterval(timer)
    }
  }
</script>
