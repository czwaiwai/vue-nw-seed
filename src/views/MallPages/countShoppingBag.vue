<template>
  <div >
    <div>
      <el-form :inline="true" label-position="top" ref="orderForm" :model="orderForm" class="demo-form-top-inline">
        <el-form-item label="时间范围" prop="qurDate">
          <el-date-picker
            v-model="orderForm.qurDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店" prop="xcodes">
          <el-select v-model="orderForm.xcodes" placeholder="门店">
            <el-option v-for="item in xcodeList" :label="item.name" :key="item.xcode" :value="item.xcode"></el-option>
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
      <el-pagination background @current-change="currentChangeHandler" layout="total , prev, pager, next" :page-size="orderForm.pageSize" :total="totalRecord"></el-pagination>
      <div  v-loading="isLoading" class='grid-x  small-up-2  medium-up-3 large-up-8'  style="width:500px;">
        <el-table :data="list"  >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="proName" label="商品名" ></el-table-column>
          <el-table-column prop="buyCount" label="售卖数量" width="120"></el-table-column>
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
          qurDate: '',
          xcodes: ''
        },
        count: 0
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
      pageProcess (res) {
        let {saleList, count, orderCount, qurDate} = res
        if (saleList && saleList.length > 0) {
          this.list = [{
            proName: '赠送购物袋',
            buyCount: count
          }, ...saleList]
        } else {
          this.list = saleList
        }
        this.count = count
        console.log(count, orderCount, qurDate)
      },
      activatedBefore () {
        this.setFormAttr(this.orderForm)
      }
    },
    created () {
      this.url = '/ycShop/countShoppingBag'
    }

  }
</script>
