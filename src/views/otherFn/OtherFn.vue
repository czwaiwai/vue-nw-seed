<template>
  <div class="grid-x  small-up-4  medium-up-5 large-up-7">
    <div class="cell btn_block">
      <button @click="allOrderFinishHandler" type="button" class="button expanded">批量订单完成</button>
    </div>
    <div class="cell btn_block">
      <button @click="showPrintersHandler" type="button" class="button expanded">查看打印机</button>
    </div>
    <div class="cell btn_block">
      <button @click="workClickRecordHandler" type="button" class="button expanded">打卡记录</button>
    </div>
    <div class="cell btn_block">
      <button  @click="showHandoverClickHandler" type="button" class="button expanded">切换账号</button>
    </div>
    <div class="cell btn_block">
      <button  @click="showDayClickHandler" type="button" class="button expanded">今日备注</button>
    </div>
    <div v-if="isTest || user.mobile=='13728905705'" class="cell btn_block">
      <button @click="testHandler" type="button" class="button expanded">测试</button>
    </div>
    <div v-if="isTest " class="cell btn_block">
      <button @click="swicthBuffetHandler" type="button"class="button expanded">切换点餐模式</button>
    </div>
    <div class="cell btn_block">
      <button @click="createInvoice" type="button"class="button expanded">开电子发票</button>
    </div>
    <div class="cell btn_block">
      <button @click="invoiceList" type="button"class="button expanded">开票记录</button>
    </div>
    <div class="cell btn_block">
      <button @click="scanClerk" type="button"class="button expanded">飞常赞用户收款</button>
    </div>
    <div class="cell btn_block" v-if="shop.airUpload===1 || user.userId === 100023">
      <button @click="planeSync" type="button"class="button expanded">机场数据同步</button>
    </div>
    <div class="cell btn_block">
      <button @click="openCashBox" type="button"class="button expanded">开钱箱</button>
    </div>
    <div class="cell btn_block">
      <button @click="safeExitHandler" type="button" class="button expanded">安全退出</button>
    </div>
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
  import dayModal from '../../components/dayModal/'
  import handoverModal from '../../components/handoverModal/'
  import hitRecordModal from '../../components/hitRecordModal/'

  import moment from 'moment'
  let now = moment(new Date()).format('YYYY-MM-DD')
  let isTest = false
  if (process.env.NODE_ENV === 'development') {
    isTest = true
  }
  export default{
    data () {
      return {
        msg: 'hello vue',
        printerList: [],
        dateRange: [],
        dayPaperData: {},
        printTypeTxt: {
          'STANDBY': '空闲',
          'PRINTING': '打印中',
          'DELETING': '删除中',
          'ERROR': '错误'
        },
        isTest,
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
      // 机场数据同步
      planeSync () {
        this.routerTo('planeSync')
      },
      openCashBox () {
        let printName = this.shopPrint[0].name
        let tmp = {
          content: `<% openCashbox:'' %>`,
          orderId: '',
          pkey: '',
          printMore: '',
          printMoreSeq: '',
          printerName: printName,
          title: '开钱箱'
        }
        this.$store.dispatch('addPrintObj', {printList: [tmp]})
      },
      testHandler () {
        this.$router.push({name: 'Test'})
      },
      scanClerk () {
        this.routerTo('scanClerk')
      },
      createInvoice () {
        this.routerTo('invoice')
      },
      invoiceList () {
        this.routerTo('invoiceList')
      },
      routerTo (name) {
        if (this.$route.path.indexOf('/mainCus') > -1) {
          return this.$router.push('/mainCus/' + name)
        }
        return this.$router.push('/main/' + name)
      },
      swicthBuffetHandler () {
        this.$confirm('你确定要切换到点餐模式么，切换到点餐模式将无法监听到新订单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shop.restType = 2
          this.$router.push({name: 'BuffetMode'})
        }).catch(() => {})
      },
      //  上班打卡记录
      workClickRecordHandler (e) {
        //  /ycRest/assistantSignRecord
        console.log('-----------------------上班打卡记录')
        hitRecordModal()
      },
//      hitDateChange (val) {
//        let curr = moment(val).format('YYYY-MM-DD')
//        this.workClickRecordHandler(curr)
//      },
      //  交办单显示
      async showHandoverClickHandler () {
        console.log('-----------------------交办单显示')
        let res = await this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id})
        let resData = res.data
        let printList = await handoverModal({
          exchangeType: 0,
          shopId: this.shop.id,
          handoverData: resData.data
        })
        this.$message.success('操作成功，交办单已往打印机')
        this.$store.dispatch('addPrintObj', {printList})
      },
      //  日报显示
      async showDayClickHandler () {
        console.log('-----------------------日报显示')
        let res = await this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1})
        let resData = res.data
        let {data, saleBeginTime, saleEndTime, printList} = resData.data
        let newPrintList = await dayModal({
          exchangeType: 0,
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
              this.$store.dispatch('logoutAction').then(() => {
                this.$router.replace({name: 'Login'})
              })
            }
          })
        }).catch(() => {})
      },
      showPrintersHandler () {
        if (this.$isXP) {
          this.$message.warning('XP系统无法查看设备打印')
        } else {
          let list = printer.getPrinters()
          console.log([...list])
          this.printerList = list.map(item => {
            if (item.jobs && item.jobs.length > 0) {
              item.myPrintType = item.jobs[0].status[0]
              item.waitjobs = item.jobs.length
            } else {
              item.myPrintType = 'STANDBY'
              item.waitjobs = 0
            }
            return item
          })
          this.printerStateVisible = true
        }
      }
    },
    activated () {
      now = moment(new Date()).format('YYYY-MM-DD')
    }
  }
</script>
