<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="租书订单ID" prop="bookOrderId">
          <el-input v-model="orderForm.bookOrderId" placeholder="租书订单ID"></el-input>
        </el-form-item>
        <el-form-item label="店员姓名"  prop="saleName">
          <el-input v-model="orderForm.saleName" placeholder="店员姓名"></el-input>
        </el-form-item>
        <el-form-item label="店员手机号"  prop="saleMobile">
          <el-input v-model="orderForm.saleMobile" placeholder="店员手机号"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号"  prop="userMobile">
          <el-input v-model="orderForm.userMobile" placeholder="客户手机号"></el-input>
        </el-form-item>
        <el-form-item label="时间范围"  prop="date">
          <el-date-picker
            v-model="orderForm.date"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="type==1?'借书门店':'还书门店'"  prop="xcode">
          <el-select v-model="orderForm.xcode" :placeholder="type==1?'借书门店':'还书门店'">
            <el-option v-for="item in bookList" :label="item.name"  :key="item.xcode"  :value="item.xcode"></el-option>
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
          <el-button @click="exportExcel('/ycBook/assistantOpLogExp', {type: type})"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
        </div>
      </div>
      <div  v-loading="isLoading" >
        <el-table :data="list" style="width: 100%" >
          <el-table-column type="index" :index="increaseIndex" label="序号	" width="60" ></el-table-column>
          <el-table-column prop="bookOrderId" label="租书订单ID" width="110"></el-table-column>
          <el-table-column prop="saleName" label="扫码店员	" width="120"></el-table-column>
          <el-table-column prop="saleMobile" label="店员手机号" width="120"></el-table-column>
          <el-table-column prop="userMobile" label="顾客手机号" width="120" ></el-table-column>
          <el-table-column prop="bookName" label="书名" min-width="160"></el-table-column>
          <el-table-column prop="cashPledge" label="押金" width="80"></el-table-column>
          <el-table-column prop="beforeBookShopName" label="借书书店" width="82"></el-table-column>
          <el-table-column prop="afterBookShopName" label="还书书店" width="82"></el-table-column>
          <el-table-column  label="类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1">店员借书确认</span>
              <span v-else>店员还书确认</span>
            </template>
          </el-table-column>
          <el-table-column prop="buildTime" label="操作时间" width="110"></el-table-column>
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
    props: {
      type: Number
    },
    data () {
      return {
        orderForm: {
          page: 1,
          pageSize: 10,
          bookOrderId: '',
          saleName: '',
          saleMobile: '',
          date: '',
          xcode: '',
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
    watch: {
      '$route' (to, form) {
        if (form.path.indexOf('/mainBook/bookAssistantOpLogType') > -1) {
          this.activatedBefore()
          this.pageInit()
          this.getPageData()
        }
      }
    },
    methods: {
      onClear (form) {
        this.onClearForm(form)
      },
      pageProcess (res) {
        let {opLogList} = res
        this.list = opLogList
      },
      activatedBefore () {
        this.orderForm.type = this.type
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycBook/assistantOpLog'
    }
  }
</script>
