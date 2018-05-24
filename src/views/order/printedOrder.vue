<template>
    <div>
      <el-form :inline="true" :model="orderForm" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="orderForm.vOrderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="orderForm.userMobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="桌台号">
          <el-input v-model="orderForm.tableNum" placeholder="桌台号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-pagination background @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination>
      <div  v-loading="isLoading" class='grid-x  small-up-2  medium-up-3 large-up-8'>
        <div v-for='item in listOrder' :key='item.id' class='cell order_block'>
          <a class="order_item" :class="{'no_pay':item.status==9}"  @click="activeClickHandler(item)"  href="javascript:void(0)" >
            <p class="text-center">{{item.orderType==='pay'?'支付凭证':item.tableNum}}</p>
            <p class="fs14">流水号：{{item.vOrderNo && item.vOrderNo.substr(-4)}}</p>
            <p class="fs12"><span class="fs12" >{{item.assistantOp===1?'店员':'客户'}}</span>  <span style="padding-left:15px">￥{{item.fnActPayAmount | currency}}</span> <span v-if="item.adjType===1"  class="fs12 " >[免]</span></p>
            <p class="fs14 text-center"><span class="label alert">{{itemStatus(item.status)}}</span></p>
          </a>
        </div>
      </div>
    </div>
</template>
<style rel='stylesheet/scss' lang='scss'>

</style>
<script type='text/ecmascript-6'>
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  export default{
    data () {
      return {
        msg: 'hello vue',
        cardStatus: {

        },
        orderForm: {
          page: 1,
          status: 10,
          pageSize: 30,
          spQry: 1,
          tableNum: '',
          orderIdOrName: '',
          userMobile: '',
          restShopId: '',
          startDate: '',
          endDate: ''
        },
        totalPage: 0,
        isLoading: false,
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
      itemClass (item) {
        return {
          no_pay: item.status === 9,
          is_print: (item.accountPrintCount + item.consumePrintCount + item.kitchenPrintCount) > 0
        }
      },
      itemStatus (status) {
        if ([7, 8].indexOf(status) > -1) {
          return '已完成'
        }
        if (parseInt(status) === 1) {
          return '已支付'
        }
        if ([0, 2].indexOf(status) > -1) {
          return '未支付'
        }
        if ([9].indexOf(status) > -1) {
          return '待收款'
        }
        if ([4, 5].indexOf(status) > -1) {
          return '退单/退菜'
        }
        if ([-1].indexOf(status) > -1) {
          return '订单已取消'
        }
      },
      activeClickHandler (item) {
        this.$store.commit('setActiveOrder', item)
      },
      currentChangeHandler (val) {
        this.orderForm.page = val
        this.getPageData()
      },
      onSubmit () {
        this.pageInit()
        this.getPageData()
      },
      pageInit () {
        this.isLoading = false
        this.orderForm.page = 1
      },
      getPageData () {
        this.orderForm.startDate = this.now
        this.orderForm.endDate = this.now
        console.log('shop', this.shop)
        this.orderForm.restShopId = this.shop.id
        let params = Object.assign({qryType: 1}, this.orderForm)
        this.isLoading = true
        return this.$http.post('/ycRest/restOrderList', params).then(res => {
          console.log(res)
          this.isLoading = false
          let resData = res.data
          let {totalPage, restOrderList, totalRecord} = resData.data
          this.totalPage = totalPage
          this.totalRecord = totalRecord
          console.log('当前总页数', this.totalPage)
          this.$store.commit('setListOrder', restOrderList)
          return restOrderList
        })
      }
    },
    activated () {
      this.now = moment(new Date()).format('YYYY-MM-DD')
      this.pageInit()
      this.getPageData()
    }
  }
</script>
