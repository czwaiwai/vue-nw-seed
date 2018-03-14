<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="图书订单ID" prop="bookOrderId">
          <el-input v-model="orderForm.bookOrderId" placeholder="图书订单ID"></el-input>
        </el-form-item>
        <el-form-item label="图书书名"  prop="bookName">
          <el-input v-model="orderForm.bookName" placeholder="图书书名"></el-input>
        </el-form-item>
        <el-form-item label="订单支付时间范围"  prop="date">
          <el-date-picker
            v-model="orderForm.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态"  prop="status">
          <el-select v-model="orderForm.status" placeholder="订单状态">
            <el-option label="店员未扫码确认" value="0"></el-option>
            <el-option label="借阅中" value="1"></el-option>
            <el-option label="已还书" value="2"></el-option>
            <el-option label="已购买" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机号"  prop="userMobile">
          <el-input v-model="orderForm.userMobile" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="下单门店"  prop="xcode">
          <el-select v-model="orderForm.xcode" placeholder="下单门店">
            <el-option v-for="item in bookList" :label="item.name" :key="item.xcode" :value="item.xcode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书购买时间范围"  prop="date1">
          <el-date-picker v-model="orderForm.date1"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扫码店员"  prop="saleName">
          <el-input v-model="orderForm.saleName" placeholder="扫码店员"></el-input>
        </el-form-item>
        <el-form-item label=" " style="margin-top:6px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item label=" " style="margin-top:6px;">
          <el-button  @click="onClear('orderForm')">清空</el-button>
        </el-form-item>
      </el-form>
      <hr />
      <div class="grid-x">
        <div class="cell auto"><el-pagination background :current-page.sync="orderForm.page" @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination></div>
        <div class="cell small-2 text-right">
          <el-button @click="exportExcel('/ycBook/orderExport')"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
        </div>
      </div>
      <div  v-loading="isLoading" >
        <el-table :data="list" style="width: 100%" >
          <el-table-column type="index" :index="increaseIndex" label="序号" width="60" ></el-table-column>
          <el-table-column prop="id" label="图书订单ID" width="110"></el-table-column>
          <el-table-column prop="userMobile" label="用户手机号" width="120"></el-table-column>
          <el-table-column prop="bookName" label="书名" min-width="120"></el-table-column>
          <el-table-column prop="bookShopName" label="租书店名" width="82"></el-table-column>
          <el-table-column prop="qrcodeBookShop" label="书本二维码上书店" width="82"></el-table-column>
          <el-table-column prop="bookSeqNo" label="书本二维码上编号" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.bookSeqNo === 0">商城下单</span>
              <span v-else>{{scope.row.bookSeqNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashPledge" label="金额" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag type="info"  v-if="scope.row.status === 0">未使用</el-tag>
              <el-tag type="warning" v-if="scope.row.status === 1">借阅中</el-tag>
              <el-tag  v-if="scope.row.status === 2">已还书</el-tag>
              <el-tag type="success" v-if="scope.row.status === 3">已购买</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="borrowDate" label="借阅时间" width="110"></el-table-column>
          <el-table-column prop="buyDate" label="购买时间" width="110"></el-table-column>
          <el-table-column prop="returnDate" label="还书时间" width="110"></el-table-column>
          <el-table-column prop="returnShopXcode" label="还书书店xcode" width="80"></el-table-column>
          <el-table-column prop="borrowSaleName" label="扫码店员" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120">
            <template slot-scope="scope">
              <div class="dot-two">{{scope.row.remark}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
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
  import SearchTable from '../../utils/searchTable'
  import {mapGetters} from 'vuex'
  export default{
    mixins: [SearchTable],
    data () {
      return {
        orderForm: {
          page: 1,
          pageSize: 10,
          bookOrderId: '',
          bookName: '',
          date: '',
          date1: '',
          status: '',
          userMobile: '',
          xcode: '',
          saleName: '',
          startBuyDate: '',
          endBuyDate: '',
          buildStartDate: '',
          buildEndDate: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        'bookList': 'bookList'
      })
    },
    methods: {
      onClear (form) {
        this.onClearForm(form)
      },
      pageProcess (res) {
        let {orderList} = res
        this.list = orderList
      },
      setParams (formObj) {
        if (formObj.date1 && formObj.date1.length > 0) {
          formObj.startBuyDate = formObj.date1[0]
          formObj.endBuyDate = formObj.date1[1]
        } else {
          formObj.startBuyDate = ''
          formObj.endBuyDate = ''
        }
        console.log(formObj, '-------formObj----------')
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycBook/buyBookOrder'
    }
  }
</script>
