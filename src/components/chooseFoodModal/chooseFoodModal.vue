<template>
  <el-dialog title="数据列表"  @open="open" @close="close" :visible.sync="visible" max-height="300px" width="800px">
    <div style="margin-top:-20px;margin-bottom:-20px;">
      <div style="border:1px solid #e3e3e3;margin-bottom: -1px;">
        <div class="grid-x choose_order_card">
          <div class="small-7 bold">商品名称</div>
          <div class="small-1 bold">价格</div>
          <div class="small-1 bold">数量</div>
          <div class="small-3 bold">操作</div>
        </div>
      </div>
      <div v-loading="loading" style="height:350px;overflow-y:auto">
        <ul class="choose_order_wrap">
          <li v-for="item in list" :key="item.id" class="grid-x choose_order_card">
            <div class="small-7">{{item.name}}</div>
            <div class="small-1">{{item.cashAmt}}</div>
            <div class="small-1">{{item.num}}</div>
            <div class="small-3">
              <el-button @click="itemAddHandle(item)" icon="el-icon-plus" round type="success" size="mini" ></el-button>
              <el-button @click="itemMulHandle(item)" icon="el-icon-minus" round type="danger" size="mini" ></el-button>
              <el-button @click="itemCancelHandle(item)"  icon="el-icon-refresh" round  type="primary" size="mini"  ></el-button>
            </div>
          </li>
        </ul>
      </div>
      <div class="text-right padding-top padding-right">
        <span>商品数量：<span class="bold">{{allCount}}</span></span> <span>商品总价：￥<span class="bold">{{allPrice}}</span></span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmChoose">确定</el-button>
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
  var defaultList = []
  export default{
    props: {
      updateList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        visible: false,
        timer: null,
        loading: false,
        btnLoading: false,
        list: [],
        orderForm: {
          saleId: '',
          psd: ''
        },
        orderFormRules: {
        }
      }
    },
    components: {},
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
      }
    },
    methods: {
      open (e) {
        this.btnLoading = false
        if (defaultList.length === 0) {
          this.loading = true
          this.$http.post('/ycRest/getProOfCurShop').then(res => {
            this.loading = false
            let resData = res.data
            let {proList} = resData.data
            defaultList = proList.map(item => {
              item.num = 0
              return item
            })
            this.list = [...defaultList.map(item => {
              if (this.updateList.length === 0) {
                item.num = 0
              } else {
                let tmp = this.updateList.find(upItem => item.id === upItem.id)
                item.num = tmp.num
              }
              return item
            })]
          }).catch(e => {
            this.loading = false
          })
        } else {
          this.list = [...defaultList.map(item => {
            if (this.updateList.length === 0) {
              item.num = 0
            } else {
              let tmp = this.updateList.find(upItem => item.id === upItem.id)
              item.num = tmp.num
            }
            return item
          })]
        }
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.btnLoading = false
        this.loading = false
        this.callback(false)
      },
      itemAddHandle (item) {
        item.num++
      },
      itemMulHandle (item) {
        item.num--
      },
      itemCancelHandle (item) {
        item.num = 0
      },
      confirmChoose () {
        this.callback(this.chooseList)
        this.visible = false
      }
    }
  }
</script>
