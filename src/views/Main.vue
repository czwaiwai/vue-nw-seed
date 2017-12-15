<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v0.1.0 ({{shop.restName}})</div>
        <div class="cell small-6 text-right"><span class="logo_time">{{currentTime}}</span></div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="el-container  is-vertical" width="400px" style="max-width:400px;">
        <div class="food_mode_quick flex_item" style="width:400px;">
          <div class="padding">
            <h5>快餐模式</h5>
            <div class="grid-x ">
              <div class="cell small-6 bold">订单：{{activeOrd.vOrderNo}}</div>
              <div class="cell small-6 bold">桌号：{{activeOrd.tableNum}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">人数：{{activeOrd.restPerson?activeOrd.restPerson+'位':'1位'}}</div>
              <div class="cell small-6">班次：</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">状态：{{ orderStatus[activeOrd.status]}}</div>
              <div class="cell small-6">支付方式：{{payType[activeOrd.payType]}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">下单时间：<span class="fs14">{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</span>
              </div>
              <div class="cell small-6 bold">合计：{{activeOrd.totalAmt | currency}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12">用户备注：<span class="fs14">{{activeOrd.userRemark }}</span>
              </div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                    @current-change="handleCurrentChange" style="width:400px;">
            <!--<el-table-column property="status" label="状态"></el-table-column>-->
            <el-table-column property="restProName" label="菜品名称" width="150"></el-table-column>
            <el-table-column property="buyCount" label="数量" width="60"></el-table-column>
            <el-table-column property="amount" label="单价"></el-table-column>
            <el-table-column property="allAmount" label="小计"></el-table-column>
          </el-table>
          <!--<div style="margin-top: 20px">-->
          <!--<el-button @click="setCurrent(tableData[1])">选中第二行</el-button>-->
          <!--<el-button @click="setCurrent()">取消选择</el-button>-->
          <!--</div>-->
        </div>
        <div class="aside-footer flex_box">
          <div class="row ">
            <div>
              <button type="button" class="button light">上行</button>
              <button type="button" class="button light">数量</button>
              <button @click="changeAmtClickHandler" type="button" class="button light">改价</button>
              <button @click="printClickHandler" type="button"  class="button light">打印</button>
            </div>
            <div>
              <button type="button" class="button light">下行</button>
              <button @click="backAmtClickHandler" type="button" class="button light">退单</button>
              <button type="button" class="button light">退菜</button>
              <button @click="clearActiveOrder" type="button" class="button light">清空</button>
            </div>
          </div>
          <a class="button fcz margin5 flex_item fs25 " style="color:#FFF;">下单</a>
        </div>
      </el-aside>
      <el-container>
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
              <div class="cell small-2">
                <button type="button" class="button light  expanded   margin5   ">修改人数</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button  light expanded  margin5   ">上一页</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button  light  expanded  margin5   ">新单</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button light  expanded  margin5   ">点菜</button>
              </div>
              <div class="cell small-2">
                <button type="button" @click="workClickHandler" class="button light   expanded  margin5   ">打卡</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button  warning expanded  margin5   ">结账</button>
              </div>
            </div>
            <div class="grid-x food_buttons">
              <div class="cell small-2">
                <button type="button" @click="moreFnClickHandler" class="button  light expanded  margin5   ">
                  {{isMoreFn?'返回':'更多功能'}}
                </button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button light  expanded  margin5   ">下一页</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button light  expanded  margin5   ">打包</button>
              </div>
              <div class="cell small-2">
                <button type="button" @click="showDayClickHandler" class="button  light expanded  margin5   ">日报
                </button>
              </div>
              <div class="cell small-2">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班
                </button>
              </div>
              <div class="cell small-2">
                <button type="button" @click="logoutClickHandle" class="button light  expanded  margin5   ">注销</button>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>


    <el-dialog title="改价" :visible.sync="changeAmtVisible" width="600px">
      <el-form :model="changeAmtForm" label-width="120px">
        <el-form-item label="实际支付金额"  placeholder="请填写金额">
          <el-input v-model="changeAmtForm.adjAmt"></el-input>
        </el-form-item>
        <el-form-item label="改价备注">
          <el-autocomplete
            class="inline-input"
            v-model="changeAmtForm.adjRemark"
            :fetch-suggestions="suggestChangeAmt"
            placeholder="请填写备注"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeAmtVisible = false">取 消</el-button>
        <el-button type="primary" @click="printHandover">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="退单" :visible.sync="backAmtVisible" width="600px">
      <el-form :model="backAmtForm">
        <el-form-item label="退款金额">
          <el-input v-model="backAmtForm.refundAmt" placeholder="请填写金额"></el-input>
        </el-form-item>
        <el-form-item label="退款备注">
          <el-autocomplete
            class="inline-input"
            v-model="backAmtForm.refundRemark"
            :fetch-suggestions="suggestBackAmt"
            placeholder="请填写备注"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backAmtVisible = false">取 消</el-button>
        <el-button type="primary" @click="backAmtClickHandler">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="确认线下收款" :visible.sync="confirmAmtVisible" width="600px">
      <el-form :model="confirmAmtForm">
        <el-form-item label="线下收款金额" placeholder="请填写金额">
          <el-input v-model="confirmAmtForm.offlinePayAmt"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="confirmAmtForm.offlinePayAmt"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmAmtVisible = false">取 消</el-button>
        <el-button type="primary" @click="printHandover">确定</el-button>
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


    <el-dialog title="日报预览" :visible.sync="dayDialogVisible" width="600px">
      <div class="day_paper">
        <h5>日报</h5>
        <p>店铺：乐稻港式餐厅</p>
        <p>统计开始日期：2017-12-15 00:00:00</p>
        <p>统计结束日期：2017-12-15 10:27:16</p>
        <hr/>
        <p>已支付：63笔 <span style="float:right">实收金额：4004.00</span></p>
        <hr/>
        <p>现金支付：2016.00</p>
        <p>线上支付：2024.00</p>
        <p>飞常赞支付：0.00</p>
        <hr/>
        <p>此小票为日报，请妥善保管</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printDayPaper">打印</el-button>
      </span>
    </el-dialog>


    <el-dialog title="交班单" :visible.sync="handoverDialogVisible" width="600px">
      <div class="block">
        <span class="demonstration">选择日期</span>
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="handover">
        <div class="grid-container full">
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">账单数：</span><span class="ho_text">70</span></div>
            <div class="cell small-4"><span class="handover_label">消费额：</span><span class="ho_text">4696.00</span></div>
            <div class="cell small-4"><span class="handover_label">优惠券：</span><span class="ho_text">0.00</span></div>
          </div>
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">改价折扣金额：</span><span class="ho_text">0.00</span></div>
            <div class="cell small-4"><span class="handover_label">退款金额：</span><span class="ho_text">0.00</span></div>
            <div class="cell small-4"><span class="handover_label">实收金额：</span><span class="ho_text">4516.00</span>
            </div>
          </div>
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">用餐人数：</span><span class="ho_text">23</span></div>
          </div>
        </div>
        <div class="handover_all_amount">
          <span class="handover_label">收款明细（70笔)：</span><span class="alert  ho_text">4516.00</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handoverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printHandover">打印</el-button>
      </span>
    </el-dialog>


  </el-container>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
  .el-dialog .el-input{
    width:200px;
  }
  input[type=text]{
    margin:0;
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

  .scroll_content {
    height: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import roundTime from '../utils/roundTime'
  import { mapGetters } from 'vuex'
  import MyPrinter from '../utils/myPrinter'
  import bus from '../utils/bus'
  let timer
  export default{
    data () {
      return {
        value1: '',
        //  打卡
        hitCard: 0,
        workDialogVisible: false,
        handoverDialogVisible: false,
        dayDialogVisible: false, // 日报对话框
        currentTime: '',
        now: moment(new Date()).format('YYYY-MM-DD'),
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        //  改价form
        changeAmtVisible: false,
        changeAmtForm: {
          adjAmt: '',
          adjRemark: ''
        },
        //   退单form
        backAmtVisible: false,
        backAmtForm: {
          refundAmt: '',
          refundRemark: ''
        },
        //  线下收款form
        confirmAmtVisible: false,
        confirmAmtForm: {
          offlinePayAmt: '',
          offPayRemark: ''
        },

        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        tableData: [{
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }],
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
    computed: {
      ...mapGetters({
        'isLogin': 'isLogin',
        'user': 'user',
        'shop': 'shop',
        'shopUser': 'shopUser',
        'shopPrint': 'shopPrint',
        'activeOrder': 'activeOrder'
      }),
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
        if (this.isActiveOrder()) {
          console.log('手动打印')
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
        this.workDialogVisible = true
      },
      hitCardClickHandler () {
        this.workDialogVisible = false
      },

      handleCurrentChange (val) {
        this.currentRow = val
      },
      // 改价显示
      changeAmtClickHandler () {
        if (this.isActiveOrder()) {
          this.changeAmtForm.adjAmt = this.activeOrder.totalAmt
          this.changeAmtVisible = true
        }
      },
      // 退单显示
      backAmtClickHandler () {
        if (this.isActiveOrder()) {
          //  /ycRest/refundRestOrder
          this.backAmtForm.refundAmt = this.activeOrder.totalAmt
          this.backAmtVisible = true
//          this.$http.post()
        }
      },
      backAmtComfirm () {
        this.$http.post('/ycRest/refundRestOrder', this.backAmtForm).then((res) => {
          let data = res.data.data
          console.log(data)
        }, err => {
          console.log(err)
        })
      },
      //  日报显示
      showDayClickHandler () {
        this.dayDialogVisible = true
      },
      //  交办单显示
      showHandoverClickHandler () {
        this.handoverDialogVisible = true
      },
      printDayPaper () {
        bus.$emit('print')
        console.log('打印日报')
        this.dayDialogVisible = false
      },
      printHandover () {
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
      getPageData () {
        this.$http.post('/account/my').then((res) => {
          console.log(res)
        })
      }
    },
    components: {},
    created () {
      this.myPrinter = new MyPrinter([])
      this.myPrinter.testStart(this)
      this.getPageData()
      this.round = roundTime((next) => {
        var paramObj = {
          id: '',
          page: 1,
          status: 1,
          pageSize: 50,
          tableNum: '',
          orderIdOrName: '',
          userMobile: '',
          restShopId: '3594464964428800',
          startDate: this.now,
          endDate: this.now
        }
        this.$http.post('/ycRest/restOrderList', paramObj).then(res => {
          let data = res.data.data
          console.log('返回的结果', data)
          let {restOrderList} = data
          console.log(restOrderList, '-------------')
          if (restOrderList && restOrderList.length > 0) {
            this.$store.commit('orderPush', restOrderList)
          }
        }, err => {
          next(false)
          console.log(err)
        })
        next()
      }, 10000, false)
      this.round.start()

      timer = setInterval(() => {
        this.currentTime = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    },
    destroyed () {
      if (this.round) {
        this.round.stop()
      }
      clearInterval(timer)
    }
  }
</script>
