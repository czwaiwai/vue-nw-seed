<template>
  <div class="grid-x  small-up-2  medium-up-3 large-up-6">
    <div class="cell btn_block">
      <button @click="allOrderFinishHandler" type="button" class="button expanded">批量订单完成</button>
    </div>
    <div class="cell btn_block">
      <button @click="showPrintersHandler" type="button" class="button expanded">查看打印机</button>
    </div>
    <div class="cell btn_block">
      <button @click="workClickRecordHandler" type="button" class="button   expanded     ">打卡记录</button>
    </div>
    <div class="cell btn_block">
      <button  @click="showHandoverClickHandler" type="button" class="button expanded">切换账号</button>
    </div>
    <div class="cell btn_block">
      <button  @click="showDayClickHandler" type="button" class="button expanded">今日备注</button>
    </div>
    <div class="cell btn_block">
      <button @click="safeExitHandler" type="button" class="button expanded">安全退出</button>
    </div>
    <!--<div class="cell btn_block">-->
      <!--<button type="button"class="button expanded">切换分区</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button"class="button expanded">菜品参数</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">主界面按钮颜色</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">更换台卡</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">撤销估清</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">前台报表</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">开钱箱</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button  type="button" class="button expanded">暂存</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">取暂存单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">撤销结账</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">估清设置</button>-->
    <!--</div>-->

    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打分单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打划菜</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">交班</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">并单结账</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">退出系统</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">修改密码</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打交班单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">修改人数</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">会员充值</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">呼叫取餐</button>-->
    <!--</div>-->

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

    <el-dialog title="打印机状态" :visible.sync="printerStateVisible" width="600px">
      <el-table :data="printerList" :border="true" style="width: 100%">
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column prop="name" label="打印机名称" ></el-table-column>
        <el-table-column label="打印机状态" width="100">
          <template slot-scope="scope">
            {{printTypeTxt[scope.row.myPrintType]}}
          </template>
        </el-table-column>
        <el-table-column prop="portName" label="打印机端口"></el-table-column>
        <el-table-column prop="waitjobs" label="待打印" width="80"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printerStateVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .cell.btn_block{
    padding:5px;
    & .button{
      margin:0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }

  @media (max-width:1010px){
    .cell.btn_block .button{
      font-size:13px;
      margin:0;
    }
  }
</style>
<script type="text/ecmascript-6">
  var printer = require('printer')
  import {clearLogs} from '../../utils/clearLogs'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  let now = moment(new Date()).format('YYYY-MM-DD')
  export default{
    data () {
      return {
        msg: 'hello vue',
        printerList: [],
        dateRange: [],
        dayPaperData: {},
        printTypeTxt: {
          'standBy': '空闲',
          'PRINTING': '打印中',
          'ERROR': '错误'
        },
        hitDate: now,
        hitRecordTable: [], // 打卡记录
        currentTime: '',
        now: now,
        hitRcodeVisible: false,
        dayDialogVisible: false,
        printerStateVisible: false,
        handoverDialogVisible: false
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
        'loopTime': 'loopTime',
        'printService': 'printService'
      })
    },
    components: {
    },
    methods: {
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
      //  交办单显示
      showHandoverClickHandler () {
        console.log('-----------------------交办单显示')
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
      //  交办单日期变更
      handoverChange () {
        console.log('-----------------------交办单日期变更')
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
      //  日报显示
      showDayClickHandler () {
        console.log('-----------------------日报显示')
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
        console.log('-----------------------日报修改日期')
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
        console.log('-----------------------打印日报')
        let dayPaperData = Object.assign({tplName: 'dayPaper', restName: this.shop.restName}, this.dayPaperData)
        this.printService.add(dayPaperData)
        this.dayDialogVisible = false
      },
      printHandover () {
        console.log('-----------------------打印交班单')
        let handoverData = Object.assign({tplName: 'handover', restName: this.shop.restName}, this.handoverData)
        this.printService.add(handoverData)
        this.handoverDialogVisible = false
        console.log('打印交班单')
      },
      allOrderFinishHandler () {
        this.$confirm('你确定将所有支付完成并打印的订单设置为订单完成状态吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/ycRest/batchOrderOver').then(res => {
            let resData = res.data
            if (resData.status === 'y') {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {})
      },
      safeExitHandler () {
        this.$confirm('你确定要切换账号么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clearLogs()
          this.$http.post('/doLogout').then((res) => {
            if (res.data.retCode === 0) {
              this.$store.commit('logout')
              this.$router.replace({name: 'Login'})
            }
          })
        }).catch(() => {})
      },
      showPrintersHandler () {
        let list = printer.getPrinters()
        this.printerList = list.map(item => {
          if (item.jobs && item.jobs.length > 0) {
            console.log(item.jobs.status)
            item.myPrintType = item.status[0]
            item.waitjobs = item.jobs.length
          } else {
            item.myPrintType = 'standBy'
            item.waitjobs = 0
          }
          return item
        })
        console.log(this.printerList)
        this.printerStateVisible = true
      }
    },
    activated () {
      now = moment(new Date()).format('YYYY-MM-DD')
    }
  }
</script>
