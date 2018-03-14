<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top"  ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="图书ID" prop="bookId">
          <el-input v-model="orderForm.bookId" placeholder="流水号ID"></el-input>
        </el-form-item>
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="orderForm.bookName" placeholder="书名"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="orderForm.author" placeholder="书名"></el-input>
        </el-form-item>
        <el-form-item label="门店" prop="xcode">
          <el-select v-model="orderForm.xcode" placeholder="门店">
            <el-option v-for="item in bookList" :label="item.name" :key="item.xcode"  :value="item.xcode"></el-option>
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
        <div class="cell small-4 text-right">
          <el-button @click="exportExcel('/ycBook/bookStockListExp')"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
          <el-button @click="exportExcel('/ycBook/bookAllStockListExp')" :loading="exportLoading" type="primary" plain size="small">统计导出</el-button>
        </div>
      </div>
      <div  v-loading="isLoading" >
        <el-table :data="list" style="width: 100%" >
          <el-table-column type="index" :index="increaseIndex" label="序号" width="60" ></el-table-column>
          <el-table-column prop="id" label="图书ID" width="110"></el-table-column>
          <el-table-column prop="bookName" label="书名" min-width="160"></el-table-column>
          <el-table-column prop="bookShopName" label="书店" width="82"></el-table-column>
          <el-table-column prop="author" label="作者" min-width="80" ></el-table-column>
          <el-table-column prop="sellingPrice" label="售价" width="80"></el-table-column>
          <el-table-column prop="cashPledge" label="押金" width="80"></el-table-column>
          <el-table-column prop="sortName" label="类别名" width="120"></el-table-column>
          <el-table-column prop="borrowCount" label="借阅次数" width="60"></el-table-column>
          <el-table-column prop="borrowTime" label="租借小时数" width="70"></el-table-column>
          <el-table-column prop="stock" label="库存" width="60"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === 1">有效</el-tag>
              <el-tag type="info" v-else>无效</el-tag>
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
          bookId: '',
          bookName: '',
          author: '',
          xcode: ''
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
        let {bookList} = res
        this.list = bookList
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycBook/bookStockList'
    }
  }
</script>
