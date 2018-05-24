<template>
  <el-container class="main">
    <el-container>
      <el-container class="is-vertical">
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}} </div>
          <div class="flex_wrap flex_item">
            <div class="flex_item flex_wrap flex_direction_column" style="background-color: #D3DCE6;max-width: 260px;">
              <div class="flex_item">
                <div class="padding-left padding-top fs14">
                  <p class="margin-bottom5"><span class="text-label">日期：</span>{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</p>
                  <p class="margin-bottom5"><span class="text-label">收银员：</span>{{activeOrd.userName}}</p>
                  <p class="margin-bottom5"><span class="text-label">单号：</span>{{activeOrd.vOrderNo}}</p>
                  <p class="margin-bottom5"><span class="text-label">收款方式：</span>{{activeOrd.payType==='wx'?'微信支付':''}}</p>
                  <p class="margin-bottom5"><span class="text-label">总数量：</span>{{activeOrd.proNum}}</p>
                  <p class="margin-bottom5"><span class="text-label">总金额：</span>￥{{activeOrd.totalAmt | currency}}</p>
                </div>
                <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                          @current-change="handleCurrentChange" style="width:260px;">
                  <!--<el-table-column property="status" label="状态"></el-table-column>-->
                  <el-table-column property="proName"  label="菜品名称" ></el-table-column>
                  <el-table-column property="buyCount" class="text-right" label="数量" width="60"></el-table-column>
                  <el-table-column property="perCash" class="text-right" label="单价" width="60"></el-table-column>
                  <el-table-column property="amount" class="text-right" label="小计" width="60"></el-table-column>
                </el-table>
              </div>
              <div class="row" style="height:54px;background:#f0f0f0;padding-left:4px;padding-top:5px;">
                <div>
                  <button  @click="clearHandle" type="button" class="button light" style="width:48%;margin-bottom:5px;">清空</button>
                  <button  @click="printHandle" type="button" class="button light" style="width:48%;margin-bottom:5px;">打印</button>
                </div>
              </div>
            </div>
            <div class="flex_item flex_wrap flex_direction_column" >
              <div class="flex_item padding " style="background-color: #E9EEF3;overflow: auto;height: 100%;">
                <keep-alive>
                  <router-view ></router-view>
                </keep-alive>
              </div>
              <div>
                <el-footer style="height:auto;padding:3px;">
                  <div class="grid-container full">
                    <div class="grid-x food_buttons">
                      <div class="cell small-4">
                        <button @click="newOrderHandler" type="button"  class="button light  expanded   margin5   ">新订单<el-badge v-show="badgePrint" :value="badgePrint" style="height:12px;" ></el-badge></button>
                      </div>
                      <div class="cell small-4">
                        <button @click="dayOrderHandler"  type="button" class="button  light expanded  margin5   ">已打印单</button>
                      </div>
                      <div class="cell small-4">
                        <button @click="histOrderHandler" type="button"  class="button  light  expanded  margin5  ">历史订单</button>
                      </div>
                    </div>
                  </div>
                </el-footer>
              </div>
            </div>
          </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">
  .flex_wrap {
    display: flex;
  }
  .flex_direction_column {
    flex-direction:column;
  }
  .flex_item {
    flex:1
  }
  .text-label {
    width:80px;
    display:inline-block;
  }
</style>
<script type="text/ecmascript-6">
  import loginModal from '../../components/loginModal/'
  import { mapGetters } from 'vuex'
//  var execPrint = require('../../utils/execPrint')
  let {htmlValidPrint} = require('../../utils/htmlPrinter')
//  import htmlPrint from '../../utils/htmlPrinter'
  export default{
    data () {
      return {
        msg: '123',
        badgePrint: 0
      }
    },
    computed: {
      ...mapGetters({
        'isLogin': 'isLogin',
        'user': 'user',
        'isAuto': 'isAuto',
        'printTpl': 'printTpl',
        'shop': 'shop',
        'shopUser': 'shopUser',
        'shopPrint': 'shopPrint',
        'printOrders': 'printOrders',
        'activeOrder': 'activeOrder',
        'loopTime': 'loopTime'
      }),
      activeOrderData () {
        if (this.activeOrder) {
          return this.activeOrder.fnAttach
        }
        return []
      },
      activeOrd () {
        if (this.activeOrder) {
          return this.activeOrder
        }
        return {fnAttach: []}
      }
    },
    components: {

    },
    methods: {
      newOrderHandler () {
//        this.$router.push('/index/freeGo/freeNewOrder')
        this.$router.push({name: 'freeNewOrder'})
      },
      dayOrderHandler () {
        this.$router.push({name: 'freeDayOrder'})
//        this.$router.push('/index/freeGo/freeDayOrder')
      },
      histOrderHandler () {
        this.$router.push({name: 'freeHistoryOrder'})
//        this.$router.push('/index/freeGo/freeHistoryOrder')
      },
      handleCurrentChange () {
      },
      clearHandle () {
        this.$store.commit('clearActiveOrder')
      },
      async printHandle () {
        if (this.activeOrder) {
          let orderId = this.activeOrder.orderId
          let res = await this.$http.post('/ycRetail/printShopOrder', {orderId: orderId})
          this.$message.success('已发送打印机')
          let resData = res.data
          let data = resData.data
          if (data.printList instanceof Array && data.printList.length > 0) {
            htmlValidPrint(data.printList, (err, str) => {
              if (err) {
                return console.log(err)
              }
              console.log(err, '--------errr')
              console.log(str, '-------------')
            })
          }
        }
      },
      async backAmtHandle () {
        if (this.activeOrder) {
          let orderId = this.activeOrder.orderId
          await this.$prompt('你确定要退掉这笔订单么', {placeholder: '请输入退款原因'})
          let user = await loginModal()
          console.log(user)
          let res = this.$http.post('/ycRetail/refundOrder', Object.assign({orderId: orderId}, user))
          let resData = res.data
          this.$message.success('操作成功')
          console.log(resData)
        }
      }
    },
    destroyed () {
      this.$store.commit('clearActiveOrder')
    }
  }
</script>
