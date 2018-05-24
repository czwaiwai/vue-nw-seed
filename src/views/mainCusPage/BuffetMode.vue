<template>
  <div class="buffet_mode">
    <div style="margin:-15px;padding-bottom:15px;border-bottom:1px solid #e3e3e3">
      <div class="grid-x  small-up-6 medium-up-6 large-up-8">
        <div v-for="item in sortList" :key="item.id" class="cell btn_block">
          <button  type="button" @click="typeClickHandle(item)" class="button expanded">{{item.sortName}}</button>
        </div>
      </div>
    </div>
    <div v-if="currFoods" class="grid-x  small-up-3  medium-up-5 large-up-8" style="margin:0 -15px;padding-top:20px;">
      <div v-for="cItem in currFoods.fnAttach" :key="cItem.id" class="cell order_block">
        <a class="order_item"  @click="addInOrder(cItem)" href="javascript:void(0)">
          <p class="item_name text-center" >{{cItem.name}}</p>
          <p class="fs16 text-center" >￥{{cItem.cashAmt}}</p>
        </a>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .buffet_mode {
    & .cell.order_block{
      min-width: 130px !important;
      max-width: 155px;
    }
    & .order_item .item_name{
        height:42px;
        line-height:1.3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
  }
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import chooseAttrModal from '../../components/chooseAttrModal'
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
        let item = Object.assign({}, cItem)
        console.log(item, '----add--------')
        if (!this.activeOrder) {
          this.$confirm('点击‘确定’创建新订单', '创建新订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$store.commit('createActiveOrder')
            this.$store.commit('setActiveOrderFood', item)
          }).catch(() => {})
        } else {
          if (this.activeOrder.isNew) {
            this.chooseAttr(item)
            this.$store.commit('setActiveOrderFood', item)
          } else {
            this.$message.warning('当前订单已下单，不能追加添加菜品')
          }
        }
      },
      chooseAttr (item) {
        let attr
        console.log(item.attr)
        if (item.attr) {
          try {
            attr = JSON.parse(item.attr)
            chooseAttrModal({item: attr}).then(res => {
              console.log(res)
            })
          } catch (e) {}
        }
      },
      typeClickHandle (item) {
        this.currFoods = item
      },
      async getFoodData () {
        let data = await this.$http.get('/rest/showProductBySortList', {params: {shopId: this.shop.id}})
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
