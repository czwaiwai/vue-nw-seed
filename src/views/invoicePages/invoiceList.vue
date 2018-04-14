<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="用户手机号" prop="custMobile">
          <el-input v-model="orderForm.custMobile" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="发票代码" prop="invoiceCode" >
          <el-input v-model="orderForm.invoiceCode" placeholder="发票代码"></el-input>
        </el-form-item>
        <el-form-item label="发票号码" prop="invoiceNo">
          <el-input v-model="orderForm.invoiceNo" placeholder="发票代码"></el-input>
        </el-form-item>
        <el-form-item label="状态"  prop="status">
          <el-select v-model="orderForm.status" placeholder="状态">
            <el-option label="二维码已作废" value="-2"></el-option>
            <el-option label="发票已红冲" value="-1"></el-option>
            <el-option label="未开发票" value="0"></el-option>
            <el-option label="开票成功" value="1"></el-option>
            <el-option label="正在开票" value="2"></el-option>
            <el-option label="开票失败" value="3"></el-option>
            <el-option label="发票正在红冲" value="4"></el-option>
            <el-option label="发票红冲失败" value="5"></el-option>
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
        <el-table :data="list"  >
          <el-table-column prop="blueInvoiceCode" label="发票代码" width="82"></el-table-column>
          <el-table-column prop="blueInvoiceNo" label="发票号码" width="110"></el-table-column>
          <el-table-column prop="orderAmt" label="开票价税总金额" width="130"></el-table-column>
          <el-table-column  label="开票商品" width="200">
            <template slot-scope="scope">
              <p v-for="item in scope.row.proList">
                {{item.goodsName}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="custMobile" label="用户电话" width="82"></el-table-column>
          <el-table-column prop="buildTime" label="打印二维码时间" width="110"></el-table-column>
          <el-table-column prop="billingTime" label="用户开票时间" width="110"></el-table-column>
          <el-table-column prop="status" label="状态" width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.status === -2">二维码已作废</span>
              <span v-if="scope.row.status === -1">发票已红冲</span>
              <span v-if="scope.row.status === 0">还未开票</span>
              <span v-if="scope.row.status === 1">开票成功</span>
              <span v-if="scope.row.status === 2">正在开票</span>
              <span v-if="scope.row.status === 3">开票失败</span>
              <span v-if="scope.row.status === 4">发票正在红冲</span>
              <span v-if="scope.row.status === 5">发票红冲失败</span>
            </template>
          </el-table-column>
          <el-table-column   label="操作" width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status===1" @click="toRedInvoice(scope.row)" type="danger" plain size="small">发票红冲</el-button>
              <el-button v-if="scope.row.status===0" @click="dropInvoice(scope.row)" type="danger" plain size="small">作废开票二维码</el-button>
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
          status: '0',
          custMobile: '',
          invoiceNo: '',
          invoiceCode: ''
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
      toRedInvoice (item) {
        console.log(item)
        console.log('waht', item.invoiceCode)
        if (this.$route.path.indexOf('/mainBook') > -1) {
          return this.$router.replace({path: '/mainBook/redInvoice', query: {invoiceCode: item.blueInvoiceCode, invoiceNo: item.blueInvoiceNo}})
        }
        if (this.$route.path.indexOf('/mainMall') > -1) {
          return this.$router.replace('/mainMall/redInvoice')
        }
        if (this.$route.path.indexOf('/mainCus') > -1) {
          return this.$router.replace({path: '/mainCus/redInvoice', query: {invoiceCode: item.blueInvoiceCode, invoiceNo: item.blueInvoiceNo}})
        }
        return this.$router.replace('/main/redInvoice')
      },
      async dropInvoice (item) {
        await this.$confirm('你确定要作废当前开票二维码么，作废后用户将无法通过得到的二维码开发票')
        try {
          let action = await this.$http.post('/eleInvoice/invalidFpErWeiMa', {eleId: item.id})
          let resData = action.data
          let index = this.list.indexOf(item)
          this.list.splice(index, 1)
          this.$message.success(resData.retMsg)
          console.log(resData)
        } catch (e) {
          console.err(e)
        }
      },
//      async delClick (item) {
//        try {
//          let action = await this.$confirm('你确定要删除这条信息么')
//          if (action === 'confirm') {
//            let res = await this.$http.post('/ycBook/deleteBookPosition', {id: item.id})
//            let resData = res.data
//            this.$message.success(resData.data)
//            let index = this.list.indexOf(item)
//            this.list.splice(index, 1)
//          }
//        } catch (e) {}
//      },
      onClear (form) {
        this.onClearForm(form)
      },
      pageProcess (res) {
        let {shopInvoiceRecords} = res
        this.list = shopInvoiceRecords.map(item => {
          if (item.proList) {
            item.proList = JSON.parse(item.proList)
          } else {
            item.proList = []
          }
          return item
        })
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/eleInvoice/getShopFpMsgList'
    }
  }
</script>
