<template>
  <div>
    <!--<el-checkbox v-model="isAutoCheck" @change="changeHandle" label="自动打印" border></el-checkbox>-->
    <div class="grid-x  small-up-2  medium-up-3 large-up-8">
      <div v-for="item in printOrders" :key="item.id" class="cell order_block">
        <!--<i v-if="item.status!=9" @click="removeOnNewList(item)" class="el-icon-close"></i>-->
        <a class="order_item" :class="{'no_pay':item.printCount === 0}" @click="activeClickHandler(item)" href="javascript:void(0)">
          <!--<p class="text-center">{{item.orderType==='pay'?'支付凭证':item.tableNum}}</p>-->
          <p class="fs14">流水号：{{item.vOrderNo && item.vOrderNo.substr(-4)}}</p>
          <p class="fs12"><span class="fs12" >{{item.assistantOp===1?'店员':'客户'}}</span><span style="padding-left:15px">￥{{item.totalAmt | currency}} <span v-if="item.adjType===1"  class="fs12 " >[免]</span></span></p>
          <p class="fs14 text-center">
            <span  class="label success">待打印</span>
            <!--<span class="label alert">{{itemStatus(item.status)}}</span>-->
          </p>
        </a>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .order_block{
    position:relative;
    padding:5px;
  }
  i.el-icon-close {
    position:absolute;
    top:5px;
    right:5px;
    padding:5px;
    cursor:pointer;
    color:#FFF;
    border:1px dashed transparent;
  }
  i.el-icon-close:hover{
    border:1px dashed #FFF;
  }
  .cell.order_block{
    min-width: 135px !important;
    max-width: 135px;
  }
  .order_item{
    display:block;
    background: #DA6213;
    padding:5px;
    color:#FFF;
    border:2px solid #DA6213;
    border-radius:5px;
    box-shadow:0 3px 6px rgba(0, 0, 0, 0.53);
  }

  .order_item:hover{
    color:#FFF;
    border:2px solid #349612;
  }
  .order_item:focus,.order_item:visited{
    color:#FFF;
    border:2px solid #349612;
  }
  .order_item p{
    margin:0;
  }
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        msg: 'hello vue'
      }
    },
    computed: {
      ...mapGetters({
        'isAuto': 'isAuto',
        'printOrders': 'printOrders'
      })
    },
    methods: {
      activeClickHandler (item) {
        this.$store.commit('setActiveOrder', item)
      }
    },
    components: {
    }
  }
</script>
