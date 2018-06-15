<template>
  <el-container class="main">
    <el-container>
      <el-container class="is-vertical">
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}} </div>
        <el-main>
          <div style="margin-top:-15px;">
            <el-tabs v-model="activeTab" >
              <el-tab-pane label="快捷同步" name="first">
                <div class="text-center padding15">
                  <el-button @click="quickSyncHandle" type="primary">一键同步当天数据到机场</el-button>
                </div>
                <div v-if="quickData.length>0" style="display: block;background: #FFF;margin-top: 10px;padding: 10px;">
                  <p  class="grid-x fs13" v-for="item in selectData" style="margin-bottom:5px;" >
                    <span class="small-4 ">{{item.name}}</span><span class="small-6">{{item.value}}</span>
                  </p>
                </div>
              </el-tab-pane>
              <el-tab-pane label="按步骤数据同步" name="second">
                <div>
                  <el-steps :active="active" simple finish-status="success">
                    <el-step title="时间选择"></el-step>
                    <el-step title="数据同步"></el-step>
                    <el-step title="同步完成"></el-step>
                  </el-steps>
                </div>
                <div>
                  <div v-if="active===1" class="text-center" style="padding-top:40px;">
                    <el-form :inline="true" label-position="top" ref="dateForm" :model="dateForm" class="demo-form-top-inline">
                      <el-form-item label="日期选择"  prop="date">
                        <el-date-picker
                          v-model="dateRange"
                          type="datetimerange"
                          time-arrow-control
                          value-format="yyyy-MM-dd HH:mm:ss"
                          range-separator="至"
                          :default-time="['00:00:00', '23:59:59']"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item label=" " style="margin-top:6px;">
                        <el-button type="primary" @click="dateSubmit">开始同步时间</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div v-if="active===2" class="padding-top">
                    <div>
                      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
                        <el-form-item label="订单ID" prop="vOrderNo">
                          <el-input v-model="orderForm.vOrderNo" placeholder="订单ID"></el-input>
                        </el-form-item>
                        <el-form-item label="订单状态"  prop="isUpload">
                          <el-select v-model="orderForm.isUpload" >
                            <el-option label="未上传"  value="0"></el-option>
                            <el-option label="已上传"  value="1"></el-option>
                            <el-option label="已取消"  value="2"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label=" " style="margin-top:6px;">
                          <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                        <el-form-item label=" " style="margin-top:6px;">
                          <el-button  @click="onClear('orderForm')">清空</el-button>
                        </el-form-item>
                      </el-form>
                      <hr />
                      <div class="grid-x padding-v">
                        <div class="cell auto">
                          <el-pagination background :current-page.sync="orderForm.page" @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination>
                        </div>
                        <div class="cell auto text-right">
                          <!--<el-button type="default">返回</el-button> -->
                          <el-button @click="syncDataHandle"  :disabled="list && list.length===0"  :loading="uploadBtn.loading"  type="primary" >{{uploadBtn.text}}</el-button>
                        </div>
                      </div>
                      <div  v-loading="isLoading" >
                        <el-table :data="list" style="width: 100%" >
                          <el-table-column type="index" :index="increaseIndex" label="序号	" width="60" ></el-table-column>
                          <el-table-column prop="vOrderNo" label="订单Id"   min-width="160" ></el-table-column>
                          <el-table-column prop="proNames" label="商品名称"   min-width="160" ></el-table-column>
                          <el-table-column prop="userMobile" label="顾客手机号	" width="120"></el-table-column>
                          <el-table-column prop="proNum" label="商品数量" width="120"></el-table-column>
                          <el-table-column prop="totalAmt" label="订单总金额" width="120" ></el-table-column>
                          <el-table-column prop="bankPayAmt" label="支付金额" width="110"></el-table-column>
                          <el-table-column prop="isUpload" label="订单状态" width="80">
                            <template slot-scope="scope">
                              <span v-if="scope.row.isUpload === 0">未上传</span>
                              <span v-if="scope.row.isUpload === 1">已上传</span>
                              <span v-if="scope.row.isUpload === 2">已取消</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="buildTime" label="下单时间" width="110"></el-table-column>
                          <el-table-column  v-if="modiEnabled" label="操作" width="120">
                            <template slot-scope="scope">
                              <el-button v-if="scope.row.isUpload==0" @click="setNoUpload(scope.row)" type="success" plain size="small">移除上传</el-button>
                              <el-button v-if="scope.row.isUpload==2" @click="cancelUpload(scope.row)" type="danger" plain size="small">撤销移除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </div>
                  <div v-if="active===3" class="text-center">
                    <div style="background:#DEEAD8;border:1px solid #67c23a;margin:60px 80px;padding:15px;">
                      <p><i class="el-icon-success success vertical-middle" style="color:#67c23a;font-size:36px;vertical-align: middle;"></i> <span class="fs20" style="vertical-align: middle;">同步完成</span></p>
                      <p class="fs14 " style="color:#898989;" >同步时间段为：{{dateRange[0]}} 至 {{dateRange[1]}} </p>
                    </div>
                    <el-button @click="active=1">重新选择同步</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="其他功能" name="third">
                <div class="" style="border: 1px solid #898989;padding: 10px;">
                  <p>同步结果查询</p>
                  <el-date-picker
                    v-model="selectRange"
                    type="datetimerange"
                    time-arrow-control
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                  <el-button @click="selectSyncResHandle"  type="primary" >同步时间段查询</el-button>
                  <div v-if="selectData.length>0" style="display: block;background: #FFF;margin-top: 10px;padding: 10px;">
                    <p  class="grid-x fs13" v-for="item in selectData" style="margin-bottom:5px;" >
                      <span class="small-4 ">{{item.name}}</span><span class="small-6">{{item.value}}</span>
                    </p>
                  </div>
                </div>
                <div class="" style="border: 1px solid #898989;padding: 10px;margin-top:20px;">
                  <p>功能按钮</p>
                  <el-button @click="createMulAmtHandle" >补差价</el-button>
                  <el-button @click="createOrderHandle" type="default">补单</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">
  .demo-form-top-inline .el-form-item {
    margin-bottom:5px;
  }
  .demo-form-top-inline  .el-form-item__label{
    line-height:inherit;
    padding: 0 12px 0 0;
  }
</style>
<script type="text/ecmascript-6">
  import planeOrderModal from '../../components/planeOrderModal/'
  import SearchTable from '../../utils/searchTable'
//  import {mapGetters} from 'vuex'
  export default{
    mixins: [SearchTable],
    props: {
      type: Number
    },
    data () {
      return {
        active: 1,
        activeTab: 'first',
        dateRange: [],
        selectRange: [],
        selectData: [],
        quickData: [],
        syncLoading: false,
        dateForm: {},
        orderForm: {
          page: 1,
          pageSize: 10,
          vOrderNo: '',
          isUpload: ''
        },
        uploadBtn: {
          loading: false,
          text: '立即同步'
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

    },
    methods: {
      onClear (form) {
        this.onClearForm(form)
      },
      createOrderHandle () {
        console.log('创建订单')
        planeOrderModal().then(res => {
          console.log(res)
        })
      },
      createMulAmtHandle () {
        console.log('补差价', '----')
        this.$prompt('请输入差价金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^-?(0|[1-9]\d{0,11})(\.\d{0,2})?$/,
          inputErrorMessage: '请输入有效金额'
        }).then(({ value }) => {
          this.$http.post('/ycSale/balanceGrp', {amount: value}).then(res => {
            let resData = res.data
            console.log(resData)
            this.$message({
              type: 'success',
              message: '补差价操作成功'
            })
          })
        }).catch(() => {})
      },
      // 查询同步结果
      selectSyncResHandle () {
        if (this.selectRange && this.selectRange.length > 0 && this.selectRange[0]) {
          this.$http.post('/ycSale/getUploadMsg', {beginTime: this.selectRange[0], endTime: this.selectRange[1]}).then(res => {
            console.log(res, '--------------------')
            let resData = res.data
            let tmp = []
            for (let item in resData.data) {
              console.log(item)
              tmp.push({name: item, value: resData.data[item]})
            }
//            console.log(tmp)
            this.selectData = tmp
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请输入要查询的日期'
          })
        }
      },
      async dateSubmit () {
        this.url = '/ycSale/getRestList'
        if (!this.dateRange[0]) return this.$message.warning('请输入日期')
        this.orderForm.beginTime = this.dateRange[0]
        this.orderForm.endTime = this.dateRange[1]
        this.setFormAttr(this.orderForm)
        this.pageInit()
        await this.getPageData()
        this.active = 2
      },
      pageProcess (res) {
        let {orderList, modiEnabled} = res
        console.log(modiEnabled, 'modiEnabled--------------')
        this.modiEnabled = modiEnabled
        this.list = orderList
      },
      async firstPageData () {
        let res = await this.$http.post('/ycSale/getBeginAndEndTime')
        let resData = res.data
        let {beginTime, endTime} = resData.data
        if (beginTime) {
          this.dateRange = [beginTime, endTime]
        } else {
          this.dateRange = []
        }
      },
      async syncDataHandle () {
        this.uploadBtn.loading = true
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.uploadBtn.text = '正在同步，请稍等'
        try {
          await this.$http.post('/ycSale/saleUpload', this.orderForm, {
            timeout: 0
          })
          this.active = 3
        } finally {
          loading.close()
          this.uploadBtn.loading = false
          this.uploadBtn.text = '立即同步'
        }
      },
      async setNoUpload (item) {
        await this.$http.post('/ycSale/notUpload', {orderId: item.id + ''})
        item.isUpload = 2
      },
      async cancelUpload (item) {
        await this.$http.post('/ycSale/cancelDelUpload', {orderId: item.id + ''})
        item.isUpload = 0
      },
      async quickSyncHandle () {
        await this.$confirm('确定要同步今天的数据么')
        let res = await this.$http.post('/ycSale/oneClickSaleUpload')
        let resData = res.data
        let tmp = []
        for (let item in resData.data) {
          tmp.push({name: item, value: resData.data[item]})
        }
        this.quickData = tmp
      },
      activatedBefore () {
        this.active = 1
        this.activeTab = 'first'
        this.quickData = []
        this.selectData = []
        this.firstPageData()
      }
    },
    created () {

    }
  }
</script>
