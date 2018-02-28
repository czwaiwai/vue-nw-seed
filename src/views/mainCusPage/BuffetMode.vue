<template>
  <div class="buffet_mode">
    <div style="margin:-15px;padding-bottom:15px;border-bottom:1px solid #e3e3e3">
      <div class="grid-x  small-up-2  medium-up-3 large-up-6">
        <div v-for="item in sortList" :key="item.id" class="cell btn_block">
          <button  type="button" @click="typeClickHandle(item)" class="button expanded">{{item.sortName}}</button>
        </div>
      </div>
    </div>
    <div v-if="currFoods" class="grid-x  small-up-2  medium-up-3 large-up-8" style="padding-top:20px;">
      <div v-for="cItem in currFoods.fnAttach" :key="cItem.id" class="cell order_block">
        <a class="order_item"  @click="addInOrder(cItem)" href="javascript:void(0)">
          <p class="text-center" style="height:44px;line-height:1.3">{{cItem.name}}</p>
          <p class="fs16 text-center" >￥{{cItem.cashAmt}}</p>
        </a>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .buffet_mode {
    & .cell.order_block{
      min-width: 155px !important;
      max-width: 155px;
    }
  }
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default{
    data () {
      return {
        sortList: [],
        currFoods: null
      }
    },
    computed: {
      ...mapGetters({
        'user': 'user',
        'shop': 'shop',
        'shopUser': 'shopUser',
        'activeOrder': 'activeOrder'
      })
    },
    components: {},
    methods: {
      createNewOrder () {
        this.$store.commit('createActiveOrder')
      },
//      addInOrder (cItem) {
//        console.log(cItem)
//        this.$store.commit('setActiveOrderFood', cItem)
//      },
      addInOrder (cItem) {
        if (!this.activeOrder) {
          this.$confirm('点击‘确定’创建新订单', '创建新订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$store.commit('createActiveOrder')
            this.$store.commit('setActiveOrderFood', cItem)
          }).catch(() => {})
        } else {
          if (this.activeOrder.isNew) {
            this.$store.commit('setActiveOrderFood', cItem)
          } else {
            this.$message.warning('当前订单已下单，不能追加添加菜品')
          }
        }
      },
      typeClickHandle (item) {
        this.currFoods = item
      },
      async getFoodData () {
        let data = await this.$http.get('/rest/showProductBySortList', {params: {shopId: '3647981257999360'}})
        let resData = data.data
        let {sortList} = resData.data
        sortList.forEach(item => {
          item.fnAttach.forEach(sub => {
            sub.restProName = sub.name
            sub.buyCount = 1
            sub.perCash = sub.cashAmt
            sub.amount = sub.cashAmt
          })
        })
        this.sortList = sortList
      }
    },
    activated () {},
    created () {
      this.getFoodData()
    }
  }
</script>
