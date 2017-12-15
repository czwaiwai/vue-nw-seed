<template>
    <div>
      <div class="grid-x  small-up-2  medium-up-3 large-up-8">
        <div v-for="item in printOrders" :key="item.id" class="cell order_block">
          <a class="order_item" @click="activeClickHandler(item)" href="javascript:void(0)">
            <p class="text-center">{{item.tableNum}}</p>
            <p class="fs14">线上订单流水号：</p>
            <p class="fs14">{{item.vOrderNo}}</p>
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
    background: #f96a1c;
    padding:5px;
    color:#FFF;
    border:1px solid #f96a1c;
    border-radius:5px;
    box-shadow:0 3px 6px rgba(0, 0, 0, 0.53);
  }
  .order_item:hover{
    color:#FFF;
    border:1px solid red;
  }
  .order_item:focus,.order_item:visited{
    color:#FFF;
    border:1px solid red;
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
        msg: 'hello vue'
      }
    },
    computed: {
      ...mapGetters({
        'printOrders': 'printOrders'
      })
    },
    methods: {
      activeClickHandler (item) {
        console.log(item)
        this.$store.commit('setActiveOrder', item)
      }
    },
    components: {
    }
  }
</script>
