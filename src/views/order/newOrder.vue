<template>
    <div>
      <el-checkbox v-model="isAutoCheck" @change="changeHandle" label="自动打印" border></el-checkbox>
      <div class="grid-x  small-up-2  medium-up-3 large-up-8">
        <div v-for="item in printOrders" :key="item.id" class="cell order_block">
          <a class="order_item" :class="{'no_pay':item.status==9}" @click="activeClickHandler(item)" href="javascript:void(0)">
            <p class="text-center">{{item.tableNum}}</p>
            <p class="fs14">流水号：{{item.vOrderNo}}</p>
            <p class="fs14"></p>
            <p class="fs12">人数 {{item.restPerson?item.restPerson:'1'}}位</p>
          </a>
        </div>
      </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .order_block{
    padding:5px;
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
  .order_item.no_pay{
    background:#0E72BF;
    border:2px solid #0E72BF;
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
  export default{
    data () {
      return {
        isAutoCheck: false,
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
      changeHandle () {
        this.$store.commit('setAuto', this.isAutoCheck)
      },
      activeClickHandler (item) {
        this.$store.commit('setActiveOrder', item)
      }
    },
    components: {
    },
    created () {
      this.isAutoCheck = this.isAuto
    }
  }
</script>
