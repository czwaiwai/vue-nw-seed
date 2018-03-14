<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="orderForm.date"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" " style="margin-top:6px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <hr />
      <div class="grid-x">
        <!--<div class="cell auto"><el-pagination background :current-page.sync="orderForm.page" @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination></div>-->
        <div class="cell small-4 text-left">
          <el-button @click="exportExcel('/ycBook/bookShopBorrowCountExp')"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
        </div>
      </div>
      <div  v-loading="isLoading" >
        <el-table :data="list" style="width:500px;">
          <el-table-column type="index"  align="center" label="序号" width="80" ></el-table-column>
          <el-table-column prop="name" align="center" label="书店名" ></el-table-column>
          <el-table-column prop="count" label="借阅数量" width="120"></el-table-column>
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
  export default{
    mixins: [SearchTable],
    data () {
      return {
        orderForm: {
          page: 1,
          pageSize: 10,
          status: 1,
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
    methods: {
      pageProcess (res) {
        let {list} = res
        this.list = list
      },
      activatedBefore () {
        this.setFormAttr({})
      }
    },
    created () {
      this.url = '/ycBook/bookShopBorrowCount'
    }
  }
</script>
