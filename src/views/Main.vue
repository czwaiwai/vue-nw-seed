<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v{{appVersion}} ({{shop.restName}})</div>
        <div class="cell small-6 text-right"><span class="logo_time">{{currentTime}}</span>
          <a @click="exitClickHandler" class="button small alert" href="javascript:void(0)" >退出系统</a></div>
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
              <div class="cell small-6 bold">合计：{{activeOrd.fnActPayAmount | currency}}</div>
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
                <button :disabled="cancelOrderDisabled" @click="cancelOrder" type="button" class="button light">取消</button>
                <button :disabled="rePrintClickDisabled" @click="rePrintClickHandler" type="button" class="button light">补打</button>
                <button :disabled="printClickDisabled"  @click="printClickHandler" type="button"  class="button light">打印</button>
              </div>
              <div>
                <!--<button type="button" class="button light">下行</button>-->
                <button :disabled="backAmtDisabled"  @click="backAmtClickHandler" type="button" class="button light">退单</button>
                <button :disabled="backCaiDisabled"  @click="backCaiClickHandler" type="button" class="button light">退菜</button>
                <button :disabled="clearActiveDisable"  @click="clearActiveOrder" type="button" class="button light">清空</button>
              </div>
            </div>
            <a v-show="activeOrd.btnStatus === 'payByCash'" @click="confirmPayCashHandler" class="button fcz margin5 flex_item fs20 alert " style="max-width:128px;color:#FFF;">确认线下付款</a>
            <a v-show="['confirmOrder','orderDone'].indexOf(activeOrd.btnStatus) > -1" :disabled="confirmBtnDisable" @click="confirmOrderFinishHandler" class="button info margin5 flex_item fs20 alert " style="max-width:128px;color:#FFF;">确认订单完成</a>
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
                <button @click="newOrderHandler" type="button"  class="button light  expanded   margin5   ">新订单<el-badge :value="badgePrint" style="height:12px;" ></el-badge></button>
              </div>
              <div class="cell small-3">
                <button @click="printedOrderHandler"  type="button" class="button  light expanded  margin5   ">已打印单</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="workClickRecordHandler" class="button light  expanded  margin5   ">打卡记录</button>
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
                <button @click="histOrderHandler" type="button" class="button  light  expanded  margin5  ">历史订单</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showDayClickHandler" class="button  light expanded  margin5   ">日报
                </button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班
                </button>
              </div>
              <!--<div class="cell small-2">-->
                <!--<button type="button" @click="logoutClickHandle" class="button light  expanded  margin5   ">注销</button>-->
              <!--</div>-->
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>

    <el-dialog title="退菜" :visible.sync="backCaiVisible" width="600px">
      <el-table :data="backCaiList" border style="width: 100%">
        <el-table-column prop="restProName" label="菜名"></el-table-column>
        <el-table-column label="数量" width="120">
          <template slot-scope="scope">
            <span class="padding-right">{{scope.row.buyCount}}</span>  <span v-show="scope.row.tuiNum" class="alert label">退菜 -{{scope.row.tuiNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.btnDisabled" @click="tuiCaiBtnHandle(scope.$index, scope.row)">退菜</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="backCaiForm" :rules="backCaiRules" ref="backCaiForm" label-width="120px">
        <el-form-item label="备注" prop="remark" style="margin-bottom:0;padding-top:15px;">
          <el-autocomplete class="inline-input" v-model="backCaiForm.remark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backCaiVisible = false">取 消</el-button>
        <el-button type="primary" @click="backCaiConfirm('backCaiForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="改价" :visible.sync="changeAmtVisible" width="600px">
      <el-form :model="changeAmtForm" :rules="changeAmtRules" ref="changeAmt" label-width="120px">
        <el-form-item label="实际支付金额" prop="adjAmt" placeholder="请填写金额">
          <el-input v-model="changeAmtForm.adjAmt"></el-input>
        </el-form-item>
        <el-form-item label="改价备注" prop="adjRemark" >
          <el-autocomplete class="inline-input" v-model="changeAmtForm.adjRemark" :fetch-suggestions="suggestChangeAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeAmtVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeAmtConfirm('changeAmt')">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="退单" :visible.sync="backAmtVisible" width="600px" >
      <el-form :model="backAmtForm" :rules="backAmtRules" ref="backAmtForm" label-width="120px">
        <el-form-item label="退款金额" prop="refundAmt">
          <el-input v-model="backAmtForm.refundAmt" placeholder="请填写金额"></el-input>
        </el-form-item>
        <el-form-item label="退款备注" prop="refundRemark">
          <el-autocomplete class="inline-input" v-model="backAmtForm.refundRemark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backAmtVisible = false">取 消</el-button>
        <el-button type="primary" @click="backAmtConfirm('backAmtForm')">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="打卡" :visible.sync="workDialogVisible" width="600px">
      <div>
        <el-radio v-model="hitCard" label="1" border>上班打卡</el-radio>
        <el-radio v-model="hitCard" label="2" border>下班打卡</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="hitCardClickHandler">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="补打" :visible.sync="rePrintVisible" width="600px">
      <div class="text-center">
        <el-button @click="toSinglePrint(1,'xiaoDisBtn')" :loading = 'xiaoDisBtn' >消费单</el-button>
        <el-button @click="toSinglePrint(2,'jieDisBtn')" :loading = 'jieDisBtn' >结账单</el-button>
        <el-button @click="toSinglePrint(3,'chuDisBtn')" :loading = 'chuDisBtn' >厨打单</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rePrintVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="日报预览" :visible.sync="dayDialogVisible" width="600px">
      <div class="block padding-bottom15">
        <span class="demonstration">日期</span>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          time-arrow-control
          @change="dayPaperChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="day_paper">
        <h5>日报</h5>
        <p>店铺：{{shop.restName}}</p>
        <p>统计开始日期：{{dateRange[0]}}</p>
        <p>统计结束日期：{{dateRange[1]}}</p>
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
        <el-button type="primary" @click="printDayPaper">打印</el-button>
      </span>
    </el-dialog>


    <el-dialog title="交班单" :visible.sync="handoverDialogVisible" width="600px">
      <div class="block padding-bottom15">
        <span class="demonstration">日期</span>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          @change="handoverChange"
          time-arrow-control
          range-separator="至"
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
        <el-button @click="handoverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printHandover">打印</el-button>
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
  import roundTime from '../utils/roundTime'
  import { mapGetters } from 'vuex'

  import bus from '../utils/bus'
  import uploadLogs from '../utils/uploadLogs'
  import getConfig from '../utils/getConfig'
  import { amount as amountRule } from '../utils/elemFormRules'
  let timer
  let now = moment(new Date()).format('YYYY-MM-DD')
  export default{
    data () {
      return {
        appVersion: '',
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

        hitDate: now,
        hitRecordTable: [], // 打卡记录
        currentTime: '',
        now: now,

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
        }
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
          this.printService.add(this.activeOrder)
        }
      },
      //  显示补打
      rePrintClickHandler () {
        if (this.isActiveOrder()) {
          this.rePrintVisible = true
        }
      },
      // 手动补打
      toSinglePrint (type, btnName) {
        this[btnName] = true
        let order = Object.assign({}, this.activeOrder, {printSingleType: type})
        this.printService.add(order)
        setTimeout(() => {
          this[btnName] = false
        }, 1500)
      },
      rePrintConfirmHandler () {
        this.rePrintVisible = false
      },
      //  确认订单完成
      confirmOrderFinishHandler () {
        if (this.isActiveOrder()) {
          if (!this.isPrint) {
            return this.$message({message: '当前订单还未打印', type: 'warn'})
          }
          this.$confirm('确认订单已处理完成', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            let params = {
              id: this.activeOrder.id
            }
            return this.$http.post('/ycRest/checkDishes', params).then(res => {
              let resData = res.data
              console.log(resData)
              this.$store.commit('removeActiveOrder')
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
            this.$http.post('/ycRest/confirmOfflinePay', params).then(res => {
              let resData = res.data
              let restOrder = resData.data
              this.$store.dispatch('setAndRemoreActive', {order: restOrder}).then((newOrder) => {
                if (!newOrder.isPrint) {
                  this.printService.add(newOrder)
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
      //  取消订单
      cancelOrder () {
        if (this.isActiveOrder()) {
          if (this.activeOrder.status !== 9) {
            return this.$message({
              message: '只有未收款订单可以取消订单',
              type: 'warning'
            })
          }
          this.$confirm('你确定要取消订单吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/ycRest/cancelRestOrder', {id: this.activeOrder.id}).then(res => {
              let resData = res.data
              console.log('取消订单', resData)
              let id = this.activeOrder.id
              this.$store.commit('removeActiveOrder')
              if (!this.isNewPage) {
                this.$store.commit('removeOneById', id)
              }
              this.$message({
                message: '取消订单成功',
                type: 'success'
              })
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
      },
      hitCardClickHandler () {
        this.$http.post('/ycRest/assistantSign', {signType: this.hitCard}).then((res) => {
          this.$message({
            message: '你已打卡成功',
            type: 'success'
          })
          this.workDialogVisible = false
        })
      },
      //  上班打卡记录
      workClickRecordHandler (e) {
        //  /ycRest/assistantSignRecord
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
        if (this.isActiveOrder()) {
          this.changeAmtForm.adjAmt = this.activeOrder.fnActPayAmount
          this.changeAmtForm.adjRemark = ''
          this.changeAmtVisible = true
        }
//      /ycRest/correctAmout
      },
      changeAmtConfirm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = Object.assign({id: this.activeOrder.id, adjOpuser: this.shopUser.saleId}, this.changeAmtForm)
            this.$http.post('/ycRest/correctAmout', params).then((res) => {
              let resData = res.data
              let {restOrder} = resData.data
              this.$message.success('改价成功')
              this.$store.commit('setActiveOrder', restOrder)
              this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
                console.log(bool, '哈哈哈')
                if (bool) {
                  this.$store.commit('updatePrintOrder', restOrder)
                }
                if (!this.isNewPage) {
                  console.log('不是当前newOrder页面更新订单状态')
                  this.$store.commit('updateOne', restOrder)
                }
              })
              this.changeAmtVisible = false
            })
          }
        })
      },
      // 退单显示
      backAmtClickHandler () {
        if (this.isActiveOrder()) {
          this.backAmtForm.id = this.activeOrder.id
          this.backAmtForm.refundAmt = this.activeOrder.fnActPayAmount
          this.backAmtVisible = true
        }
      },
      backAmtConfirm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post('/ycRest/refundRestOrder', this.backAmtForm).then((res) => {
              let resData = res.data
              let {restOrder, refundDetailIds} = resData.data
              this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
                this.backAmtVisible = false
                if (newOrder) {
                  newOrder.refundDetailIds = refundDetailIds
                  this.printService.add(newOrder)
                }
                if (this.isPrintedPage) {
                  this.$store.commit('removeOne', newOrder)
                }
                if (this.isHistoryPage) {
                  this.$store.commit('updateOne', newOrder)
                }
              })
            }, err => {
              console.log(err)
            })
          }
        })
      },
      //  退菜
      backCaiClickHandler () {
        if (this.isActiveOrder()) {
          this.backCaiForm = {
            detailInfos: '',
            remark: ''
          }
          this.$http.post('/ycRest/getRestOrderRefundData', {orderId: this.activeOrder.id}).then(res => {
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
            this.backCaiList = detailList
            this.backCaiVisible = true
          })
        }
      },
      tuiCaiBtnHandle (index, item) {
        item.tuiNum ++
        if (item.tuiNum === item.buyCount) {
          item.btnDisabled = true
        }
      },
      backCaiConfirm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let tuiArr = this.backCaiList.map(item => {
              if (item.tuiNum) {
                return item.id + ';' + item.tuiNum
              }
            })
            this.backCaiForm.detailInfos = tuiArr.join('|')
            if (!this.backCaiForm.detailInfos) {
              return this.$message.error('请选择要退的菜品')
            }
            this.$http.post('/ycRest/retreatFood', this.backCaiForm).then(res => {
              let resData = res.data
              let {restOrder, refundDetailIds, isAllRefund} = resData.data
              this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
                this.backCaiVisible = false
                this.$message({
                  message: '退菜成功',
                  type: 'success'
                })
                if (newOrder) {
                  newOrder.refundDetailIds = refundDetailIds
                  this.printService.add(newOrder)
                }
                if (this.isPrintedPage && isAllRefund) {
                  this.$store.commit('removeOne', newOrder)
                } else {
                  this.$store.commit('updateOne', newOrder)
                }
              })
            })
          }
        })
      },
      //  日报显示
      showDayClickHandler () {
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1}).then(res => {
          this.dayDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          console.log(resData, '日报--------', data)
        })
      },
      dayPaperChange (e) {
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, restShopId: this.shop.id}).then(res => {
          let resData = res.data
          let {data, saleBeginTime, saleEndTime} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
        })
      },
      printDayPaper () {
        console.log(bus)
        let dayPaperData = Object.assign({tplName: 'dayPaper', restName: this.shop.restName}, this.dayPaperData)
        this.printService.add(dayPaperData)
        this.dayDialogVisible = false
      },
      //  交办单日期变更
      handoverChange () {
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, restShopId: this.shop.id}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.handoverData = resData.data
        })
      },
      //  交办单显示
      showHandoverClickHandler () {
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.handoverData = resData.data
        })
      },
      printHandover () {
        let handoverData = Object.assign({tplName: 'handover', restName: this.shop.restName}, this.handoverData)
        this.printService.add(handoverData)
        this.handoverDialogVisible = false
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
        this.$http.post('/doLogout').then((res) => {
          if (res.data.retCode === 0) {
            this.$store.commit('logout')
            this.$router.replace({name: 'Login'})
          }
        })
      },
      upLogs (date) {
        if (date) {
          uploadLogs(this, this.shop.id, date)
        }
      }
    },
    components: {},
    created () {
      getConfig.then((json) => {
        this.appVersion = json.version
      })
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
      this.printService = this.$store.getters.printService
//      this.printService = new OrderSave(this, this.shop, this.shopPrint, this.user)
      let self = this
      this.printService.listen({
        start () {
          console.log('----------打印已经开始了---------------')
        },
        before (obj) {
          console.log(obj)
          if (obj.isOrder) {
            console.log('--------正在开始打印的订单Obj:', obj.id, '------------')
          } else {
            console.log('--------普通打印')
          }
        },
        after (obj) {
          if (obj.isOrder) {
            try {
              self.$store.commit('setFinshPrintOrder', obj)
              self.$store.commit('removeOrder', obj)
            } catch (e) {
              console.log(e)
            }
            console.log('---------------------结束打印的订单Obj:', obj.id)
          } else {
            console.log('正在进行普通打印')
          }
        },
        error (err, obj, next) {
          console.log(err, '-------------')
          self.$http.post('/feeback/save', {
            title: '打印回调内错误',
            content: '出现的错误：' + JSON.stringify(err) + '错误对象' + JSON.stringify(obj)
          })
          self.$confirm('打印出错是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            next(true) // 为轮询是否就继续
          }).catch(() => {})
        },
        //  这个对象放弃打印
        giveup (obj) {
          console.log('----------这个订单被放弃了:', obj.id)
        },
        done () {
          console.log('-----------打印已经完成--------------')
        }
      })
      let netFix = (function () {
        let times = 0
        return {
          isOk (cb) {
            if (times > 0) {
              cb && cb()
            }
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
      console.log(this.printService, 'printService')
      this.round = roundTime((next) => {
        var paramObj = {
          id: '',
          page: 1,
          status: 1,
          pageSize: 50,
          tableNum: '',
          orderIdOrName: '',
          userMobile: '',
          restShopId: this.shop.id,
          startDate: this.now,
          endDate: this.now
        }
        this.$http.post('/ycRest/restOrderList', paramObj).then(res => {
          netFix.isOk(() => {
            console.info('网络重连成功')
          })
          let data = res.data.data
          if (data.updLog) {
            this.upLogs(data.updLog)
          }
          console.log('返回的结果', data)
          let {restOrderList} = data
          console.log(restOrderList, '-------------')
          if (restOrderList && restOrderList.length > 0) {
            this.$store.dispatch('pushAction', {list: restOrderList}).then((newData) => {
              console.log('我不是空数组', newData)
              if (this.isAuto && newData.length > 0) {
                this.printService.add(newData)
              }
            })
          }
          next()
        }, err => {
          console.log(err)
          if (err === '请先登录') {
            next(false)
          } else {
            netFix.toTry((bool, times) => {
              if (!bool) {
              } else {
                console.error('网络断开正在重连中' + times)
              }
              next(bool)
            })
          }
        })
      }, this.loopTime || 10000, false)
      this.round.start()
      console.log('roundTime isChange')
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
