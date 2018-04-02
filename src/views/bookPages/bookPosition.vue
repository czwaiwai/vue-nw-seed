<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="记录ID" prop="id">
          <el-input v-model="orderForm.id" placeholder="记录ID"></el-input>
        </el-form-item>
        <el-form-item label="书名" prop="bookName" >
          <el-input v-model="orderForm.bookName" placeholder="书名"></el-input>
        </el-form-item>
        <el-form-item label="书店" prop="bookShopId">
          <el-select v-model="orderForm.bookShopId" placeholder="书店">
            <el-option v-for="item in bookList" :label="item.name" :key="item.id"  :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"  prop="status">
          <el-select v-model="orderForm.status" placeholder="状态">
            <el-option label="在库" value="1"></el-option>
            <el-option label="已卖出" value="2"></el-option>
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
      <el-pagination background :current-page.sync="orderForm.page" @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination>
      <div  v-loading="isLoading" >
        <el-table :data="list" style="width: 100%" >
          <el-table-column type="index" :index="increaseIndex" label="序号" width="60" ></el-table-column>
          <el-table-column prop="id" label="ID" width="110"></el-table-column>
          <el-table-column prop="bookName" label="书名" min-width="160"></el-table-column>
          <el-table-column prop="qrcodeBookShopName" label="二维码上所属书店" width="82"></el-table-column>
          <el-table-column prop="bookSeqNo" label="书籍编号" width="60" ></el-table-column>
          <el-table-column prop="nowBookShopName" label="现在所属书店" width="82"></el-table-column>
          <el-table-column prop="updateDate" label="更新时间" width="110"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 2">已卖出</span>
              <span v-else>在库</span>
            </template>
          </el-table-column>
          <el-table-column   label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="delClick(scope.row)" type="danger" plain size="small">删除</el-button>
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
          bookName: '',
          bookShopId: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        'bookList': 'bookList',
        'shopInfoList': 'shopInfoList'
      })
    },
    methods: {
      async delClick (item) {
        try {
          let action = await this.$confirm('你确定要删除这条信息么')
          if (action === 'confirm') {
            let res = await this.$http.post('/ycBook/deleteBookPosition', {id: item.id})
            let resData = res.data
            this.$message.success(resData.data)
            let index = this.list.indexOf(item)
            this.list.splice(index, 1)
          }
        } catch (e) {}
      },
      onClear (form) {
        this.onClearForm(form)
      },
      pageProcess (res) {
        let {list} = res
        this.list = list
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycBook/bookPosition'
    }
  }
</script>
