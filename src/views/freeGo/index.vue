<template>
  <el-container class="main">
    <el-container>
      <el-container class="is-vertical">
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}} </div>
          <div class="flex_wrap flex_item">
            <div class="flex_item flex_wrap flex_direction_column" style="background-color: #D3DCE6;max-width: 260px;">
              <div class="flex_item" style="overflow-y:auto;overflow-x:hidden;">
                <div class="padding-left padding-top fs14">
                  <p style="margin-bottom:0;"><span class="text-label">日期：</span>{{activeOrd.buildTime  && (activeOrd.buildTime+'').substr(5) }}</p>
                  <p style="margin-bottom:0;"><span class="text-label">收银员：</span>{{activeOrd.userName}}</p>
                  <p style="margin-bottom:0;"><span class="text-label">单号：</span>{{activeOrd.vOrderNo}}</p>
                  <p style="margin-bottom:0;"><span class="text-label">收款方式：</span>{{activeOrd.payType==='wx'?'微信支付':''}}</p>
                  <p style="margin-bottom:0;"><span class="text-label">总数量：</span>{{activeOrd.proNum}}</p>
                  <p style="margin-bottom:0;"><span class="text-label">总金额：</span>￥{{activeOrd.totalAmt | currency}}</p>
                  <p style="margin-bottom:0;"><span class="text-label">订单状态：</span>{{activeOrderStatus }}</p>
                  <!--<p>{{activeOrd.orderId}}</p>-->
                </div>
                <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                          @current-change="handleCurrentChange" style="width:260px;">
                  <!--<el-table-column property="status" label="状态"></el-table-column>-->
                  <el-table-column property="proName"  label="菜品名称" ></el-table-column>
                  <el-table-column property="buyCount" class="text-right" label="数量" width="60"></el-table-column>
                  <el-table-column property="perCash" class="text-right" label="单价" width="60"></el-table-column>
                  <el-table-column property="amount" class="text-right" label="小计" width="60"></el-table-column>
                </el-table>
                <!--<button @click="test" > 测试打印机收到结果</button>-->
              </div>
              <div  style="background:#f0f0f0;">
                <div class="row" style="padding-left:4px;padding-top:5px;">
                  <button  @click="clearHandle" type="button" class="button light" style="width:48%;margin-bottom:0px;">清空</button>
                  <button :disabled="disabledPrint" @click="printHandle" type="button" class="button light" style="width:48%;margin-bottom:0px;">打印</button>
                  <!--<button  @click="test" type="button" class="button light" style="width:48%;margin-bottom:0px;">test</button>-->
                </div>
                <div class="row" style="padding-left:4px;padding-top:5px;padding-bottom:5px;">
                  <button :disabled="disabledBackAmt" @click="backAmtHandle" type="button" class="button light" style="width:48%;margin-bottom:0px;">退单</button>
                  <button :disabled="disabledBackCai" @click="backCaiHandle" type="button" class="button light" style="width:48%;margin-bottom:0px;">退货</button>
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
  import backVegetablesModal from '../../components/backVegetablesModal/'
  // import backGoodsModal from '../../components/backGoodsModal/'
  import { mapGetters } from 'vuex'
//  var execPrint = require('../../utils/execPrint')
  let {htmlValidPrint} = require('../../utils/htmlPrinter')
  import chromePrint from '../../utils/chromePrint'
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
        'printService': 'printService',
        'loopTime': 'loopTime'
      }),
      isNewPage () {
        return this.$route.name === 'FreeNewOrder'
      },
      isPrintedPage () {
        return this.$route.name === 'FreeDayOrder'
      },
      activeOrderStatus () {
        if (this.activeOrder) {
          let status = this.activeOrder.status
          if ([9].indexOf(status) > -1) {
            return '部分退货'
          }
          if ([7].indexOf(status) > -1) {
            return '已完成'
          }
          if ([5].indexOf(status) > -1) {
            return '退单'
          }
          if ([1].indexOf(status) > -1) {
            return '已支付'
          }
        }
        return ''
      },
      disabledPrint () {
        if (this.activeOrder) {
          return false
        }
        return true
      },
      disabledBackAmt () {
        if (this.activeOrder && ([1, 6, 7, 8].indexOf(this.activeOrder.status) > -1)) {
          return false
        }
        return true
      },
      disabledBackCai () {
        if (this.activeOrder && ([1, 6, 7, 9].indexOf(this.activeOrder.status) > -1)) {
          return false
        }
        return true
      },
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
      // test () {
      //   let str = `{"data":{"logId":3914319553053696,"shopOrderList":[{"buildTime":1527746070000,"fnAttach":[{"adjOpuser":"","adjRecipAddr":"","adjRemark":"","amount":2,"buyCount":1,"dicMap":{},"expsNo":"","expsOrg":"","expsRemark":"","id":3914319388918785,"mobile":"","perCash":2,"proName":"逸臣干纸巾","rcode":"","refOrderId":3914319388918784,"remark":"","specName":"","thumbImg":"","xcode":""},{"adjOpuser":"","adjRecipAddr":"","adjRemark":"","amount":0.3,"buyCount":1,"dicMap":{},"expsNo":"","expsOrg":"","expsRemark":"","id":3914319388918786,"mobile":"","perCash":0.3,"proName":"逸臣中袋子","rcode":"","refOrderId":3914319388918784,"remark":"","specName":"","thumbImg":"","xcode":""}],"orderId":"3914319388918784","payType":"wx","proName":"","proNum":2,"shopId":"3802568355447808","shopName":"西二三层逸臣商场(B9205)","totalAmt":2.3}]},"msg":"你有新的订单！","oper":"success","retCode":0,"retMsg":"付款成功！","status":"y","triggerEvent":"printNewOrder"}`
      //   let resData = JSON.parse(str)
      //   let {shopOrderList} = resData.data
      //   this.$store.dispatch('freePushAction', {list: shopOrderList}).then((newData) => {
      //     console.log('我不是空数组', JSON.stringify(newData))
      //     if (newData.length > 0) {
      //       this.printService.add(newData)
      //     }
      //   })
      // },
      newOrderHandler () {
//        this.$router.push('/index/freeGo/freeNewOrder')
        console.log('自助购--切换到新订单页 freeNewOrder')
        this.$router.push({name: 'FreeNewOrder'})
      },
      dayOrderHandler () {
        console.log('自助购--切换到dayOrder')
        this.$router.push({name: 'FreeDayOrder'})
//        this.$router.push('/index/freeGo/freeDayOrder')
      },
      histOrderHandler () {
        console.log('自助购--切换到历史historyOrder')
        this.$router.push({name: 'FreeHistoryOrder'})
//        this.$router.push('/index/freeGo/freeHistoryOrder')
      },
      handleCurrentChange () {
      },
      clearHandle () {
        console.log('清空active')
        this.$store.commit('clearActiveOrder')
      },
      async printHandle () {
        if (this.activeOrder) {
          console.log('手动打印')
          let orderId = this.activeOrder.orderId
          let res = await this.$http.post('/ycRetail/printShopOrder', {orderId: orderId})
          this.$message.success('已发送打印机')
          let resData = res.data
          let data = resData.data
          if (data.printList instanceof Array && data.printList.length > 0) {
            console.log('返回的printList ------', JSON.stringify(data.printList))
            if (this.shop && this.shop.printType === 2) { // 调用printhtml.exe命令进行打印
              console.log('main.js 调用printhtml.exe命令进行打印-------')
              htmlValidPrint(data.printList, (err, str) => {
                if (err) {
                  console.error(err)
                  return this.$message.error('打印出错~')
                }
                if (data.printList.length > 0 && data.printList[0].orderId) {
                  this.$store.commit('freeRemoveById', data.printList[0].orderId)
                  // this.$store.commit('freeRemoveOrder', )
                }
                // this.$store.commit('freeRemoveOrder', obj)
                console.log('html打印完成------')
              })
            } else if (this.shop && this.shop.printType === 1) { // 浏览器打印
              console.log('main.js 使用chrome浏览器进行打印------------')
              chromePrint(data.printList, function () {
                console.log('打印完成------')
              })
            } else { // 使用原生c模块node-printer 进行打印
              console.log('main.js 使用node-printer进行打印------------')
              if (this.shop.printType !== 1 && data.printList && data.printList.length > 0) {
                this.$store.dispatch('addPrintObj', {printList: data.printList})
              }
            }
            // htmlValidPrint(data.printList, (err, str) => {
            //   if (err) {
            //     return console.log(err)
            //   }
            //   console.log(err, '--------errr')
            //   console.log(str, '-------------')
            // })
          }
        }
      },
      // backCaiHandle () {
      //
      // },
      //  退菜按钮功能显示
      async backCaiHandle () {
        console.log('----------自助购-------------退菜')
        if (this.activeOrder) {
          let orderId = this.activeOrder.orderId
          this.backCaiForm = {
            detailInfos: '',
            remark: ''
          }
          let res = await this.$http.post('/ycRetail/getRefundProDetailList', {orderId: this.activeOrder.orderId})
          this.btnLoading = false
          let resData = res.data
          let {groupDetailList} = resData.data
          groupDetailList.forEach(item => {
            // item.tuiNum = 0
            item.restProName = item.proName
            this.$set(item, 'tuiNum', 0)
            if (item.buyCount === 0) {
              item.btnDisabled = true
            } else {
              item.btnDisabled = false
            }
          })
          // detailList = detailList.filter(item => item.buyCount >= 0)
          console.log(groupDetailList)
          console.log('---------await-------------------')
          console.log(this.shop.refundNeedRight, this.shop, '-------------------------')
          let {shopOrder} = await backVegetablesModal({
            title: '退商品',
            trName: '商品名',
            isFood: false,
            form: {
              orderId: orderId,
              detailInfos: '',
              remark: ''
            },
            list: groupDetailList,
            shopAuth: this.shop.refundNeedRight
          })
          let newOrder = await this.$store.dispatch('freeOrderBack', {order: shopOrder})
          this.$store.commit('freeUpdateOne', newOrder)
          this.$message({
            message: '退货成功',
            type: 'success'
          })
          // if (this.isPrintedPage && isAllRefund) {
          //   this.$store.commit('removeOne', newOrder)
          // } else {

          // }
        }
      },
      async backAmtHandle () {
        if (this.activeOrder) {
          let orderId = this.activeOrder.orderId
          // let res = await backGoodsModal({})
          let remark = await this.$prompt('你确定要退掉这笔订单么', {placeholder: '请输入退款原因'})
          console.log(remark, '-------------------------')
          let user = await loginModal()
          console.log(user)
          let res = await this.$http.post('/ycRetail/refundOrder', Object.assign({orderId: orderId}, user))
          let resData = res.data
          let {shopOrder} = resData.data
          console.log(resData.data, ' ------------1-----------')
          let newOrder = await this.$store.dispatch('freeOrderBack', {order: shopOrder})
          console.log(newOrder, ' -------------2----------')
          this.$store.commit('freeUpdateOne', newOrder)
          this.$message({
            message: '退单成功',
            type: 'success'
          })
          console.log(resData)
        }
      }
//       test () {
//         var orderStr = `{
//         "acctPayAmt": 19.8,
//       "acctRefundAmt": 19.8,
//       "adjAmt": 0,
//       "adjOpuser": "",
//       "adjRecipAddr": "",
//       "adjRemark": "",
//       "bankPayAmt": 0,
//       "bankRefundAmt": 0,
//       "bankTranNo": "",
//       "bankType": "",
//       "buildTime": "2018-06-08 19:15:18",
//       "cancelOpuser": "",
//       "cancelReason": "",
//       "cancelTime": null,
//       "clientType": "m",
//       "couponAmt": 0,
//       "couponDisct": 0,
//       "couponId": 0,
//       "couponRemark": "",
//       "dicMap": {},
//       "discountAmt": 0,
//       "discountRatio": 0,
//       "discountRemark": "",
//       "expsCode": "",
//       "expsFee": 0,
//       "expsNo": "",
//       "expsOrg": "",
//       "expsRemark": "",
//       "expsTime": null,
//       "expsType": 1,
//       "expsTypeName": "自提",
//       "fnAttach": [{
//         "adjAmount": 0,
//         "adjOpuser": "",
//         "adjRecipAddr": "",
//         "adjRecipAddr1": "",
//         "adjRemark": "",
//         "amount": 19.8,
//         "bankTranNo": "",
//         "bankType": "",
//         "barCode": "6943325200462",
//         "buildTime": "2018-06-08 19:15:18",
//         "buyCount": 2,
//         "dicMap": {},
//         "discountAmt": 0,
//         "discountRatio": 0,
//         "discountRemark": "",
//         "disctRatio": 0,
//         "expsCode": "",
//         "expsFee": 0,
//         "expsNo": "",
//         "expsOrg": "",
//         "expsRemark": "",
//         "expsTime": null,
//         "expsType": 2,
//         "expsTypeName": "",
//         "id": 3925959372243968,
//         "mobile": "13728905705",
//         "payProxy": "",
//         "payTime": "2018-06-08 19:15:21",
//         "payType": "acc",
//         "perCash": 9.9,
//         "perScore": 0,
//         "proBatchCode": "",
//         "proId": "211",
//         "proInvalidDate": null,
//         "proName": "108g 老肥彭卤味鸭脖",
//         "proProduceDate": null,
//         "proUnitId": "",
//         "proUnitName": "",
//         "rcode": "xyz12sd_p",
//         "recipCity": "",
//         "recipId": 0,
//         "recipMobile": "",
//         "recipName": "",
//         "recipProv": "",
//         "refOrderId": 3925959371817984,
//         "refPrice": 64,
//         "remark": "",
//         "score": 0,
//         "seller": "",
//         "shopOrder": null,
//         "specId": 3400260919362821,
//         "specName": "108g 会员特价",
//         "status": 7,
//         "thumbImg": "/upload/2017/12/05/18/229bab6489644953a73d941c14fc8af9_$bw750_$bh674.jpg",
//         "totalAmt": 0,
//         "userId": 100023,
//         "userName": "曹正",
//         "warnSucc": 0,
//         "writeExpDate": null,
//         "xcode": "gouwudai_B9306"
//       }, {
//         "adjAmount": 0,
//         "adjOpuser": "",
//         "adjRecipAddr": "",
//         "adjRecipAddr1": "",
//         "adjRemark": "",
//         "amount": 9.9,
//         "bankTranNo": "",
//         "bankType": "",
//         "barCode": "6943325200462",
//         "buildTime": "2018-06-08 19:15:18",
//         "buyCount": -1,
//         "dicMap": {},
//         "discountAmt": 0,
//         "discountRatio": 0,
//         "discountRemark": "",
//         "disctRatio": 0,
//         "expsCode": "",
//         "expsFee": 0,
//         "expsNo": "",
//         "expsOrg": "",
//         "expsRemark": "",
//         "expsTime": null,
//         "expsType": 2,
//         "expsTypeName": "",
//         "id": 3925960680489984,
//         "mobile": "13728905705",
//         "payProxy": "",
//         "payTime": "2018-06-08 19:15:21",
//         "payType": "acc",
//         "perCash": 9.9,
//         "perScore": 0,
//         "proBatchCode": "",
//         "proId": "211",
//         "proInvalidDate": null,
//         "proName": "108g 老肥彭卤味鸭脖",
//         "proProduceDate": null,
//         "proUnitId": "",
//         "proUnitName": "",
//         "rcode": "xyz12sd_p",
//         "recipCity": "",
//         "recipId": 0,
//         "recipMobile": "",
//         "recipName": "",
//         "recipProv": "",
//         "refOrderId": 3925959371817984,
//         "refPrice": 64,
//         "remark": "",
//         "score": 0,
//         "seller": "",
//         "shopOrder": null,
//         "specId": 3400260919362821,
//         "specName": "108g 会员特价",
//         "status": 7,
//         "thumbImg": "/upload/2017/12/05/18/229bab6489644953a73d941c14fc8af9_$bw750_$bh674.jpg",
//         "totalAmt": 0,
//         "userId": 100023,
//         "userName": "曹正",
//         "warnSucc": 0,
//         "writeExpDate": null,
//         "xcode": "gouwudai_B9306"
//       }, {
//         "adjAmount": 0,
//         "adjOpuser": "",
//         "adjRecipAddr": "",
//         "adjRecipAddr1": "",
//         "adjRemark": "",
//         "amount": 9.9,
//         "bankTranNo": "",
//         "bankType": "",
//         "barCode": "6943325200462",
//         "buildTime": "2018-06-08 19:15:18",
//         "buyCount": -1,
//         "dicMap": {},
//         "discountAmt": 0,
//         "discountRatio": 0,
//         "discountRemark": "",
//         "disctRatio": 0,
//         "expsCode": "",
//         "expsFee": 0,
//         "expsNo": "",
//         "expsOrg": "",
//         "expsRemark": "",
//         "expsTime": null,
//         "expsType": 2,
//         "expsTypeName": "",
//         "id": 3925961189262336,
//         "mobile": "13728905705",
//         "payProxy": "",
//         "payTime": "2018-06-08 19:15:21",
//         "payType": "acc",
//         "perCash": 9.9,
//         "perScore": 0,
//         "proBatchCode": "",
//         "proId": "211",
//         "proInvalidDate": null,
//         "proName": "108g 老肥彭卤味鸭脖",
//         "proProduceDate": null,
//         "proUnitId": "",
//         "proUnitName": "",
//         "rcode": "xyz12sd_p",
//         "recipCity": "",
//         "recipId": 0,
//         "recipMobile": "",
//         "recipName": "",
//         "recipProv": "",
//         "refOrderId": 3925959371817984,
//         "refPrice": 64,
//         "remark": "",
//         "score": 0,
//         "seller": "",
//         "shopOrder": null,
//         "specId": 3400260919362821,
//         "specName": "108g 会员特价",
//         "status": 7,
//         "thumbImg": "/upload/2017/12/05/18/229bab6489644953a73d941c14fc8af9_$bw750_$bh674.jpg",
//         "totalAmt": 0,
//         "userId": 100023,
//         "userName": "曹正",
//         "warnSucc": 0,
//         "writeExpDate": null,
//         "xcode": "gouwudai_B9306"
//       }],
//       "fnWarmMsg": "",
//       "gotackOpuser": "",
//       "gotackTime": null,
//       "mobile": "13728905705",
//       "ncBranchCode": "1000010007",
//       "ncStoreCode": "GZ007003",
//       "ncStoreId": "1807AB96D8E8",
//       "occurLocale": "",
//       "orderId": 3925959371817984,
//       "orderType": 2,
//       "outTradeNo": "",
//       "payProxy": "",
//       "payTime": "2018-06-08 19:15:21",
//       "payType": "acc",
//       "printCount": 1,
//       "proAmt": 19.8,
//       "proImgs": "/upload/2017/12/05/18/229bab6489644953a73d941c14fc8af9_$bw750_$bh674.jpg",
//       "proNames": "108g 老肥彭卤味鸭脖",
//       "proNum": 2,
//       "rcode": "xyz12sd_p",
//       "recipAddr": "",
//       "recipCity": "",
//       "recipId": 0,
//       "recipMobile": "",
//       "recipName": "",
//       "recipPostNo": "",
//       "recipProv": "",
//       "refNcOrderId": "",
//       "refundAmt": 0,
//       "refundOpid": "27",
//       "refundRemark": "测试订单",
//       "refundResult": "",
//       "refundTime": "2018-06-08 19:17:09",
//       "remark": "",
//       "reqIp": "192.168.56.1",
//       "sellerRemark": "",
//       "shopId": 3802568355447808,
//       "shopName": "西二三层逸臣商场(B9205)",
//       "status": 1,
//       "totalAmt": 19.8,
//       "type": 1,
//       "userId": 100023,
//       "userName": "曹正",
//       "userRemark": "",
//       "uxcode": "",
//       "vOrderNo": "201806080019",
//       "warnSucc": 0,
//       "writeExpDate": null,
//       "wxUid": "o2bNv1Plx4NM3nDZn9mNrOsS4mHw",
//       "xcode": "gouwudai_B9306"
// }`
//         let order = JSON.parse(orderStr)
//         console.log(order)
//         this.$store.commit('freeUpdateOne', order)
//       }
    },
    destroyed () {
      this.$store.commit('clearActiveOrder')
    }
  }
</script>
