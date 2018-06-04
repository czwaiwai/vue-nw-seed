<template>
  <div >
    <el-form :inline="true" :model="orderForm" class="demo-form-inline">

        <el-form-item label="订单号">
          <el-input v-model="orderForm.vOrderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <!--<el-form-item label="手机号">-->
          <!--<el-input v-model="orderForm.userMobile" placeholder="手机号"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="桌台号">-->
          <!--<el-input v-model="orderForm.tableNum" placeholder="桌台号"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="日期选择">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            time-arrow-control
            @change="dateRangeChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="orderForm.status" placeholder="请选择">
            <el-option label="支付成功" :value="1"></el-option>
            <el-option label="退单" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <el-pagination background @current-change="currentChangeHandler" :current-page="orderForm.page" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord" ></el-pagination>
    <!--<div>-->
      <!--<button @click="upBtnHandler" type="button" class="button">上一页</button> <button @click="downBtnHandler" type="button" class="button">下一页</button> 第{{orderForm.page}}页-->
    <!--</div>-->
    <div v-loading="isLoading" class='grid-x  small-up-2  medium-up-3 large-up-8'>
      <div v-for='item in listOrder' :key='item.id' class='cell order_block'>
        <a class="order_item" :class="itemClass(item)"  @click="activeClickHandler(item)"  href="javascript:void(0)" >
          <!--<p class="text-center">{{item.orderType==='pay'?'支付凭证':item.tableNum}}</p>-->
          <p class="fs14">流水号：{{item.vOrderNo && item.vOrderNo.substr(-4)}}</p>
          <p class="fs12"><span class="fs12" >{{item.assistantOp===1?'店员':'客户'}}</span>  <span style="padding-left:15px">￥{{item.totalAmt | currency}}</span> <span v-if="item.adjType===1"  class="fs12 " >[免]</span></p>
          <p class="fs14 text-center"><span class="label" :class="statusClass(item.status)" >{{itemStatus(item.status)}}</span></p>
        </a>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  export default{
    data () {
      return {
        dateRange: [],
        isLoading: false,
        orderForm: {
          page: 1,
          pageSize: 30,
          qryType: 1,
          status: 1,
          beginTime: '',
          endTime: ''
        },
        totalPage: 0,
        totalRecord: 0
      }
    },
    computed: {
      ...mapGetters({
        'shop': 'shop',
        'listOrder': 'listOrder'
      })
    },
    methods: {
      itemStatus (status) {
        if ([7].indexOf(status) > -1) {
          return '已完成'
        }
        if ([5].indexOf(status) > -1) {
          return '退单'
        }
        if ([1].indexOf(status) > -1) {
          return '已支付'
        }
      },
      statusClass (status) {
        if ([4, 5].indexOf(status) > -1) {
          return ''
        }
        if ([7, 8, 1].indexOf(status) > -1) {
          return 'success'
        }
        return 'alert'
      },
      itemClass (item) {
        return {
          no_pay: [0, 2, -1, 9].indexOf(item.status) > -1,
          is_print: (item.accountPrintCount + item.consumePrintCount + item.kitchenPrintCount) > 0
        }
      },
      activeClickHandler (item) {
        this.$store.commit('setActiveOrder', item)
      },
      onSubmit () {
        this.pageInit()
        this.getPageData()
      },
      currentChangeHandler (val) {
        this.orderForm.page = val
        this.getPageData()
      },
      dateRangeChange () {
        this.orderForm.beginTime = this.dateRange[0]
        this.orderForm.endTime = this.dateRange[1]
      },
      pageInit () {
        this.isLoading = false
        this.orderForm.page = 1
        this.orderForm.beginTime = this.dateRange[0]
        this.orderForm.endTime = this.dateRange[1]
      },
      getPageData () {
        this.orderForm.restShopId = this.shop.id
        this.isLoading = true
        return this.$http.post('/ycRetail/getAutoOrderList', this.orderForm).then(res => {
          let resData = res.data
          this.isLoading = false
          let {totalPage, orderList, totalRecord} = resData.data
          this.totalPage = totalPage
          this.totalRecord = totalRecord
          this.$store.commit('setListOrder', orderList)
          return orderList
        })
      }
    },
    activated () {
      this.nowStart = moment(new Date()).format('YYYY-MM-DD 00:00:00')
      this.nowEnd = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.dateRange = [this.nowStart, this.nowEnd]
      this.orderForm.vOrderNo = ''
      this.orderForm.status = 1
      this.pageInit()
      this.getPageData()
    }
  }
</script>
