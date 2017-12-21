<template>
  <div>
    <el-form :inline="true" :model="orderForm" class="demo-form-inline">
      <div>
        <el-form-item label="订单号">
          <el-input v-model="orderForm.vOrderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="orderForm.userMobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="桌台号">
          <el-input v-model="orderForm.tableNum" placeholder="桌台号"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="orderForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div>
      <button @click="upBtnHandler" class="button">上一页</button> <button @click="downBtnHandler" class="button">下一页</button>
    </div>
    <div class='grid-x  small-up-2  medium-up-3 large-up-8'>
      <div v-for='item in list' :key='item.id' class='cell order_block'>
        <a class="order_item" :class="{'no_pay':item.status==9}"  @click="activeClickHandler(item)"  href="javascript:void(0)" >
          <p class="text-center">{{item.tableNum}}</p>
          <p class="fs14">流水号：{{item.vOrderNo}}</p>
          <p class="fs14"></p>
          <p class="fs12">人数 {{item.restPerson?item.restPerson:'1'}}位</p>
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
        rangeDate: [],
        options: [{
          value: '-1',
          label: '未支付'
        }, {
          value: '5',
          label: '已退单',
          disabled: true
        }, {
          value: '7',
          label: '已完成'
        }],
        orderForm: {
          page: 1,
          status: '7',
          pageSize: 10,
          tableNum: '',
          orderIdOrName: '',
          userMobile: '',
          restShopId: '',
          startDate: '',
          endDate: ''
        },
        list: []
      }
    },
    computed: {
      ...mapGetters({
        'shop': 'shop'
      })
    },
    methods: {
      itemClass (item) {
        return {
          no_pay: item.status === 9,
          is_print: (item.accountPrintCount + item.consumePrintCount + item.kitchenPrintCount) > 0
        }
      },
      activeClickHandler (item) {
        this.$store.commit('setActiveOrder', item)
      },
      upBtnHandler () {
        if (this.upBtn) return
        this.upBtn = true
        let page = this.orderForm.page
        page--
        this.orderForm.page = page < 1 ? 1 : page
        this.getPageData().then(() => {
          this.upBtn = false
        })
      },
      downBtnHandler () {
        if (this.downBtn) return
        this.downBtn = true
        let page = this.orderForm.page
        page++
        this.orderForm.page = page > this.totalPage ? this.totalPage : page
        this.getPageData().then(() => {
          this.downBtn = false
        })
      },
      onSubmit () {
        this.pageInit()
        this.getPageData()
      },
      pageInit () {
        this.orderForm.page = 1
        this.orderForm.startDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.orderForm.endDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
        this.orderForm.restShopId = this.shop.id
      },
      getPageData () {
        return this.$http.post('/ycRest/restOrderList', this.orderForm).then(res => {
          console.log(res)
          let resData = res.data
          let {totalPage, restOrderList} = resData.data
          this.totalPage = totalPage
          this.list = restOrderList
          return restOrderList
        })
      }
    },
    activated () {
      this.now = moment(new Date()).format('YYYY-MM-DD')
      this.rangeDate = [this.now, this.now]
      this.pageInit()
      this.getPageData()
    }
  }
</script>
