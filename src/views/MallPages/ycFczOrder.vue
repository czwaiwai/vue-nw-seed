<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="订单ID" prop="orderIdOrName">
          <el-input v-model="orderForm.orderIdOrName" placeholder="订单ID"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="orderForm.status" placeholder="订单状态">
            <el-option label="取消支付" value="-1"></el-option>
            <el-option label="支付成功" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" prop="date">
          <el-date-picker
            v-model="orderForm.date"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店" prop="xcode">
          <el-select v-model="orderForm.xcode" placeholder="门店">
            <el-option v-for="item in xcodeList" :label="item.name" :key="item.xcode" :value="item.xcode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="rcode渠道" prop="rcode">
          <el-input v-model="orderForm.rcode" placeholder="rcode渠道"></el-input>
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
          <el-button @click="exportExcel('/ycShop/expFczOrderExecl', {exportToExcel: 'YES'}, 'GET')"  :loading="exportLoading"  type="primary" plain size="small">数据导出</el-button>
        </div>
      </div>
      <div  v-loading="isLoading" class='grid-x  small-up-2  medium-up-3 large-up-8'>
        <el-table :data="list"  >
          <el-table-column   prop="orderId" label="订单ID" width="110">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <div style="width:500px;">
                  <div class="flex_box padding-bottom5" >
                    <div class="flex_item" ><strong>商品名称</strong></div>
                    <div class="flex_item text-center" style="max-width:20%"><strong>商品总价</strong></div>
                    <div class="flex_item text-center" style="max-width:20%"><strong>购买数量</strong></div>
                  </div>
                  <div class="flex_box padding-bottom5" v-for="item in scope.row.fnAttach">
                    <div class="flex_item" >{{item.proName}} {{item.specName}}</div>
                    <div class="flex_item text-center"  style="max-width:20%">{{item.amount}}元</div>
                    <div class="flex_item text-center"  style="max-width:20%">{{item.buyCount}}</div>
                  </div>
                </div>
                <div slot="reference" class="name-wrapper">
                  <span >{{scope.row.orderId}}</span>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="buildTime" label="创建时间" width="110"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="80">
            <template slot-scope="scope">
              <el-tag  type="warning" v-if="[-1,0,2,3].indexOf(scope.row.status)>-1">未支付</el-tag>
              <el-tag  type="success"  v-else-if="[1,6,7,8].indexOf(scope.row.status)>-1">已支付</el-tag>
              <el-tag  type="danger"  v-else-if="scope.row.status===5">已退款</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="xcode" label="合作渠道" width="120"></el-table-column>
          <el-table-column prop="userId" label="用户id" width="120"></el-table-column>
          <el-table-column prop="rcode" label="推荐人"></el-table-column>
          <el-table-column prop="totalAmt" label="总金额" width="80"></el-table-column>
          <el-table-column prop="couponAmt" label="优惠券" width="120"></el-table-column>
          <el-table-column prop="expsFee" label="快递费" width="80"></el-table-column>
          <el-table-column prop="bankPayAmt" label="用户支付" width="80"></el-table-column>
          <el-table-column prop="totalAmt" label="商品总价" width="80"></el-table-column>
          <el-table-column prop="proNum" label="购买数量" width="80"></el-table-column>
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
          orderIdOrName: '',
          status: '',
          date: '',
          xcode: '',
          rcode: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        'xcodeList': 'xcodeList',
        'shopInfoList': 'shopInfoList'
      })
    },
    methods: {
      onClear (form) {
        this.onClearForm(form)
      },
      async printClick (item) {
        try {
          let res = await this.$http.post('/ycShop/shopOrderPrintData', {id: item.orderId})
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
        let {orderList} = res
        this.list = orderList
      },
      activatedBefore () {
        if (this.xcodeList && this.xcodeList.length > 0) {
          this.orderForm.xcode = this.xcodeList[0].xcode
        }
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycShop/ycFczOrder'
    }

  }
</script>
