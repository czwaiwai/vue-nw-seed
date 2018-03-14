<template>
    <div >
      <div>
        <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
          <el-form-item label="流水号ID" prop="id">
            <el-input v-model="orderForm.id" placeholder="流水号ID"></el-input>
          </el-form-item>
          <el-form-item label="店员手机号" prop="saleMobile">
            <el-input v-model="orderForm.saleMobile" placeholder="店员手机号"></el-input>
          </el-form-item>
          <el-form-item label="时间范围" prop="date">
            <el-date-picker
              v-model="orderForm.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户手机号" prop="userMobile">
            <el-input v-model="orderForm.userMobile" placeholder="客户手机号"></el-input>
          </el-form-item>
          <el-form-item label="门店" prop="xcode">
            <el-select v-model="orderForm.xcode" placeholder="状态">
              <el-option v-for="item in xcodeList" :label="item.name" :key="item.xcode" :value="item.xcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用优惠劵所属订单ID" prop="couponHrefOrderId">
            <el-input v-model="orderForm.couponHrefOrderId" placeholder="使用优惠劵所属订单ID"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="orderForm.status" placeholder="状态">
              <el-option label="有效" value="1">有效</el-option>
              <el-option label="无效" value="2">无效</el-option>
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
        <div class="grid-x">
          <div class="cell auto"><el-pagination background :current-page.sync="orderForm.page" @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination></div>
          <div class="cell small-2 text-right">
            <el-button @click="exportExcel('/ycShop/ExcelExport')"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
          </div>
        </div>
        <div  v-loading="isLoading" >
          <el-table :data="list" style="width: 100%" >
            <el-table-column prop="id" label="流水号" width="110" ></el-table-column>
            <el-table-column prop="saleName" label="店员" width="120"></el-table-column>
            <el-table-column prop="saleMobile" label="店员手机" width="120"></el-table-column>
            <el-table-column prop="userMobile" label="顾客手机" width="120"></el-table-column>
            <el-table-column prop="consumeAmt" label="消费总金额" width="80" ></el-table-column>
            <el-table-column prop="acctPayAmt" label="账户余额支出" width="80"></el-table-column>
            <el-table-column prop="couponAmt" label="优惠券金额" width="80"></el-table-column>
            <el-table-column prop="beforeAcctAmt" label="消费前账户余额" width="80"></el-table-column>
            <el-table-column prop="afterAcctAmt" label="消费后账户余额" width="80"></el-table-column>
            <el-table-column prop="salerRemark" label="店员备注" min-width="120"></el-table-column>
            <el-table-column prop="buildTime" label="创建时间" width="110"></el-table-column>
            <el-table-column prop="offlinePayAmt" label="线下支出金额" width="80"></el-table-column>
            <el-table-column prop="shopName" label="所在店名" width="82"></el-table-column>
            <el-table-column prop="orderId" label="订单ID" width="120"></el-table-column>
            <el-table-column prop="couponHrefOrderId" label="使用优惠劵所属订单ID" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status === 1">有效</el-tag>
                <el-tag type="danger" v-else >无效</el-tag>
              </template>
            </el-table-column>
            <el-table-column   label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="printClick(scope.row)" :type="scope.row.printCount?'info':'primary'" size="small">打印</el-button>
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
          status: '1',
          id: '',
          date: '',
          saleMobile: '',
          userMobile: '',
          couponHrefOrderId: '',
          xcode: '',
          buildStartDate: '',
          buildEndDate: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        'xcodeList': 'xcodeList'
      })
    },
    methods: {
      onClear (form) {
        this.onClearForm(form)
      },
      async printClick (item) {
        try {
          let res = await this.$http.post('/ycShop/getAssistantOpLog', {id: item.id})
          let resData = res.data
          let {printList} = resData.data
          if (!printList) {
            this.$message.error('当前无打印权限')
          } else {
            item.printCount++
            this.$message.success('打印内容已发出!')
          }
        } catch (e) {
          console.error(e)
        }
      },
      pageProcess (res) {
        let {opLogList} = res
        this.list = opLogList
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycShop/assistantOpLog'
    }
  }
</script>
