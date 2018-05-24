<template>
  <el-dialog title="补单"  @open="open" @close="close" :visible.sync="visible" width="600px">
    <div style="margin-top:-20px;margin-bottom:-20px;">
      <button @click="addHandle" type="button" class="button  small">添加商品</button>
      <div style="border:1px solid #e3e3e3;margin-bottom: -1px;">
        <div class="grid-x choose_order_card">
          <div class="small-8 bold">商品名称</div>
          <div class="small-2 bold">价格</div>
          <div class="small-2 bold">数量</div>
        </div>
      </div>
      <div style="max-height:350px;overflow-y:auto">
        <ul class="choose_order_wrap">
          <li v-if="list.length===0">
            <div class="padding15 text-center fs18" style="color:#898989;">请添加商品</div>
          </li>
          <li v-for="item in list" :key="item.id" class="grid-x choose_order_card">
            <div class="small-8">{{item.name}}</div>
            <div class="small-2">{{item.cashAmt}}</div>
            <div class="small-2">{{item.num}}</div>
          </li>
        </ul>
      </div>
      <div class="text-right padding-top padding-right">
        <span>商品数量：<span class="bold">{{allCount}}</span></span> <span>商品总价：￥<span class="bold">{{allPrice}}</span></span>
      </div>
      <div>
        <label><span class="inline-block" style="width:80px;">订单号：</span><input name="vOrderNo" v-model="orderForm.vOrderNo"   ></label>
        <label><span class="inline-block" style="width:80px;">订单金额：</span><input name="amount"  v-model="orderForm.amount" ></label>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">修改</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" scope lang="scss">
  .choose_order_wrap{
    border:1px solid #e3e3e3;
    margin:0;
  }
  .choose_order_card{
    height: 35px;
    line-height: 35px;
    padding:0 10px;
  }
  .choose_order_card + .choose_order_card{
    border-top:1px solid #e3e3e3;
  }
</style>
<script type="text/ecmascript-6">
  import chooseFoodModal from '../chooseFoodModal/'
  export default{
    props: {
      shop: Object
    },
    data () {
      return {
        visible: false,
        loading: false,
        timer: null,
        btnLoading: false,
        orderForm: {
          vOrderNo: '',
          amount: ''
        },
        orderFormRules: {
        },
        list: []
      }
    },
    computed: {
      allCount () {
        return this.list.reduce((before, item) => {
          before += Math.abs(item.num)
          return before
        }, 0)
      },
      allPrice () {
        return this.list.reduce((before, item) => {
          before += (item.cashAmt * item.num)
          return before
        }, 0)
      },
      chooseList () {
        return this.list.filter(item => item.num !== 0)
      },
      paramsStr () {
        let tmpArr = []
        this.list.forEach(item => {
          tmpArr.push(`${item.id};${item.num};${item.cashAmt}`)
        })
        return tmpArr.join(',')
      }
    },
    components: {
    },
    methods: {
      open (e) {
        this.list = []
        this.loading = false
        this.btnLoading = false
        this.orderForm = {
          vOrderNo: '',
          amount: ''
        }
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.btnLoading = false
        this.callback(false)
      },
      async addHandle () {
        let res = await chooseFoodModal({updateList: this.list})
        this.list = [...res]
      },
      confirm () {
        this.loading = true
        var params = Object.assign({details: this.paramsStr}, this.orderForm)
        this.$http.post('/ycSale/airUploadAddRecord', params, {timeout: (3 * 60 * 1000)}).then(res => {
          this.loading = false
          this.$message.success('操作成功')
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      }
    }
  }
</script>
