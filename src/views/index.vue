<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v{{appVersion}} ({{shop.restName || shop.name}})</div>
        <div class="cell small-6 text-right" style="line-height:44px;">
          <span class="logo_time">{{currentTime}}</span>
          <span class="light fs12 label" style="">{{shopUser.saleName}}[{{shopUser.mobile}}]</span>
          <a @click="exitClickHandler" style="margin:0" class="button small alert" href="javascript:void(0)" >退出系统</a></div>
      </div>
    </el-header>
    <el-container style="height: 100%;margin-bottom: -44px;padding-bottom: 44px;">
      <el-aside class="nav_aside flex_box flex_direction_column" style="background:#545C64"  >
        <div class="flex_item"  :style="!isShowMenu?'width:200px;':'width:auto'">
          <el-menu
            :default-active="activeUrl"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="isShowMenu"
            :collapse-transition="false"
            router
            active-text-color="#ffd04b">
            <el-menu-item   index="/index/main/neworder" v-if="shop.belongShopType < 20" >
              <i class="iconfont icon-shouji"></i>
              <span slot="title">订餐模式</span>
            </el-menu-item>
            <el-menu-item   index="/index/mainCus/buffetMode" v-if="shop.belongShopType < 20" >
              <i class="iconfont icon-diancan"></i>
              <span slot="title">点餐模式</span>
            </el-menu-item>
            <el-menu-item v-if="shop.autoBuy===1" index="/index/freeGo/freeNewOrder" >
              <i class="iconfont icon-gouwu"></i>
              <span slot="title">自助购</span>
            </el-menu-item>
            <el-submenu index="/index/mainBook" v-if="shop.belongShopType === 21" >
              <template slot="title">
                <i class="iconfont icon-dianpu"></i>
                <span>书店管理</span>
              </template>
              <el-menu-item index="/index/mainBook/bookAssistantOpLogType1" >借书记录</el-menu-item>
              <el-menu-item index="/index/mainBook/bookAssistantOpLogType2"  >还书记录</el-menu-item>
              <el-menu-item index="/index/mainBook/buyBookOrder"  >租书订单</el-menu-item>
              <el-menu-item index="/index/mainBook/bookStockList"  >图书库存</el-menu-item>
              <el-menu-item index="/index/mainBook/bookPosition"  >图书跟踪</el-menu-item>
              <el-menu-item index="/index/mainBook/assBorrowCount"  >店员租书情况</el-menu-item>
              <el-menu-item index="/index/mainBook/bookShopBorrowCount"  >书店租书情况</el-menu-item>
              <!--<el-menu-item index="/mainBook/invoice"  >电子发票</el-menu-item>-->
              <!--<el-menu-item index="/index/mainBook/scanClerk"  >飞常赞用户收款</el-menu-item>-->
            </el-submenu>
            <el-submenu index="mall_shop"  v-if="shop.belongShopType === 31">
              <template slot="title">
                <i class="iconfont icon-retail"></i>
                <span>零售管理</span>
              </template>
                <el-menu-item index="/index/mainMall/assistantOpLog" >支付核消</el-menu-item>
                <el-menu-item index="/index/mainMall/ycFczOrder"  >订单记录</el-menu-item>
                <el-menu-item index="/index/mainMall/countShoppingBag"  >购物袋统计</el-menu-item>
                <!--<el-menu-item index="/index/mainMall/scanClerk"  >飞常赞用户收款</el-menu-item>-->
            </el-submenu>
            <el-menu-item index="/index/invoiceWrap/invoice" >
              <i class="iconfont icon-fapiao"></i>
              <span slot="title">电子发票</span>
            </el-menu-item>
            <el-menu-item v-if="shop.airUpload===1 || user.userId === 100023" index="/index/planeSync" >
              <i class="iconfont icon-tongbu"></i>
              <span slot="title">机场数据同步</span>
            </el-menu-item>
            <el-menu-item index="/index/scanClerk" >
              <i class="iconfont icon-shoukuan"></i>
              <span slot="title">飞常赞用户收款</span>
            </el-menu-item>

          </el-menu>
        </div>
        <div class="aside-footer " style="padding:0;background:#545C64"  >
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="isShowMenu"
            :collapse-transition="false"
            active-text-color="#FFF">
            <el-menu-item index="1" @click="isShowMenu=!isShowMenu" >
              <i class="iconfont icon-zhankai"></i>
              <span slot="title">缩放侧边栏</span>
            </el-menu-item>
            <el-menu-item index="2" @click="logoutClickHandle" >
              <i class="iconfont icon-qiehuanjiaose"></i>
              <span slot="title">切换账号</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <router-view></router-view>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import roundTime from '../utils/roundTime'
  import { getLocalPrinters } from '../utils/getLocalPrinters'
  import uploadLogs from '../utils/uploadLogs'
  import {wsUrl} from '../utils/env'
  import WsHelper from '../utils/wsHelper'
  import singleton from '../utils/singleton'
  import SysMethods from '../utils/sysMenthod'
  export default{
    mixins: [SysMethods],
    data () {
      return {
        isShowMenu: false,
        activeUrl: ''
      }
    },
    computed: {
      ...mapGetters({
        'isLogin': 'isLogin', // 是否登录
        'user': 'user', // 登录用户
        'isAuto': 'isAuto', // 是否自动
        'printTpl': 'printTpl',
        'shop': 'shop', // 店铺信息
        'shopUser': 'shopUser', // 店员信息
        'shopPrint': 'shopPrint', // 店铺打印机信息
        'printOrders': 'printOrders',
        'activeOrder': 'activeOrder', // 显示状态下的订单
        'loopTime': 'loopTime'
      })
    },
    components: {
    },
    methods: {
      listenService () {
        let self = this
        this.printService = this.$store.getters.printService
        this.printService.setUser(this.user)
        this.printService.listen({
          start () {
            console.log('----------打印已经开始了---------------')
          },
          before (obj) {
            console.log(obj)
            if (obj.isOrder) {
              console.log('--------正在开始打印的订单Obj:', obj.id, '------------')
              console.log('--------', obj && obj.vOrderNo, '--------------')
            } else {
              console.log('--------普通打印')
            }
          },
          after (obj) {
            if (obj.isOrder) {
              try {
                if (obj.isAutoChange) {
                  self.$store.commit('clearActiveOrder')
                }
                self.$store.commit('setFinshPrintOrder', obj)
                if (obj.isFreeOrder) { //  添加到历史记录 同时移除订单
                  self.$store.commit('freeRemoveOrder', obj)
                } else {
                  self.$store.commit('removeOrderMap', obj)
                }
              } catch (e) {
                console.log(e)
              }
              console.log('---------------------结束打印的订单Obj:', obj.id)
              console.log('---------------------', obj && obj.vOrderNo)
            } else {
              console.log('正在进行普通打印')
            }
          },
          error (err, obj, next) {
            console.error(err, '错误：打印机的时候报错了赶紧来看看')
            console.log(obj)
            let vNo = ''
            if (obj.isOrder) {
              vNo = '订单：' + obj.vOrderNo
            }
            self.$confirm(vNo + '打印出错是否继续', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              console.log('店员点击了true' + vNo)
              next(true) // 为轮询是否就继续
            }).catch(() => {
              console.log('店员点击了false' + vNo)
              next(false)
            })
            self.$http.post('/feeback/save', {
              title: '打印回调内错误',
              content: '出现的错误：' + JSON.stringify(err) + '错误对象' + JSON.stringify(obj)
            })
          },
          //  这个对象放弃打印
          giveup (obj) {
            console.log('错误：----------这个订单被放弃了:', obj.id)
          },
          done () {
            console.log('-----------打印已经完成--------------')
          }
        })
      },
      upLogs (date) {
        console.log('-----------------------拉取日志')
        if (date) {
          uploadLogs(this, this.shop.id, date)
        }
      },
      upStatus (content, title) {
        this.$http.post('/feeback/save', {
          title: title || '查看内容',
          content: content
        })
      },
      socketData (cb) {
        let self = this
        console.log(wsUrl)
        let url = `${wsUrl}/fczIM/orderMgr?type=2&shopId=${self.shop.id}`
        console.log(url, 'websock url')
        // let url = `${wsUrl}${location.host}/fczIM/custClientWs`
        // let url = `wss://www.fcz360.com/fczIM/orderMgr?type=2&shopId=${self.shop.id}`
        return (singleton(function () {
          return new WsHelper(url, cb)
        }))()
      },
      socketRun () { // 开启websocket
        // websocket
        console.log('----------------------------------websocket已开启--------------------------------------------')
        this.socketData((event, ws) => {
          if (event.data === 'pong') return
          console.log(event, 'socket event')
          let resData = null
          try {
            resData = JSON.parse(event.data)
          } catch (e) {
            return console.error(e)
          }
          let {triggerEvent, reConnect} = resData
          let {logId, shopOrderList} = resData.data
          let ids = ''
          if (triggerEvent === 'printNewOrder') {
            if (shopOrderList && shopOrderList.length > 0) {
              let tmpIds = []
              shopOrderList.forEach(item => {
                tmpIds.push(item.orderId + ',' + (item.printMore || '') + ',' + (item.printMoreSeq || '') + ',' + logId)
              })
              ids = tmpIds.join(';')
              ws.send(ids)
              this.$store.dispatch('freePushAction', {list: shopOrderList}).then((newData) => {
                console.log('我不是空数组', JSON.stringify(newData))
                if (newData.length > 0) {
                  this.printService.add(newData)
                }
              })
            }
          }
          if (reConnect) {
            ws.close()
          }
        })
      },
      // 轮询检查数据
      roundFn () {
        console.log('----------------------------------轮询已开启--------------------------------------------')
        let netFix = (function () {
          let times = 0
          return {
            isOk (cb) {
              if (times > 0) {
                cb && cb()
              }
              times = 0
            },
            clear () {
              times = 0
            },
            toTry (cb) {
              if (times < 30) {
                times++
                setTimeout(() => cb(true, times), 3000)
              } else {
                cb(false, times)
              }
            }
          }
        })()
        let ids = ''
        let lastPrintIds = ''
        this.round = roundTime((next) => {
          var paramObj = {
            id: '',
            page: 1,
            status: 1,
            pageSize: 50,
            tableNum: '',
            orderIdOrName: '',
            userMobile: '',
            qryType: 0,
            restShopId: this.shop.id,
            startDate: this.now,
            endDate: this.now,
            lastIds: ids,
            lastPrintIds: lastPrintIds
          }
          this.$http.post('/ycRest/restOrderList', paramObj).then(res => {
            netFix.isOk(() => {
              console.info('网络重连成功')
              this.$message.success('网络重连成功!')
            })
            let data = res.data.data
            if (!data) {
              this.upStatus('轮询中/ycRest/restOrderList返回了空的对象' + JSON.stringify(res), 'pc轮询错误')
              return next()
            }
            try {
              if (data.noticeMsg) {
                this.$notify.warning({
                  title: '消息提示',
                  message: data.noticeMsg,
                  duration: 0
                })
              }
              lastPrintIds = ''
              if (data.printList) {
                console.log('添加额外的打印内容')
                let tmpArr = data.printList.map(item => item.pkey)
                lastPrintIds = tmpArr.join(';')
                this.$store.dispatch('addPrintObj', {printList: data.printList})
              }
              if (data.updPrinterStatus) {
                console.log('拉取打印信息')
                let content = '打印机状态：' + this.printService.getPrintState()
                content += '打印机中的队列：' + JSON.stringify(this.printService.showList())
                content += '本地打印机信息：' + JSON.stringify(getLocalPrinters())
                this.upStatus(content, '查看当前店打印机队列状态')
              }
              if (data.updLog) {
                console.info('正在拉取日志')
                this.upLogs(data.updLog)
              }
              if (data.orderLoopSecond) {
                console.log('重新设置轮询间隔', data.orderLoopSecond)
                this.round.setTime(data.orderLoopSecond)
                this.$store.commit('setLoopTime', data.orderLoopSecond)
              }
            } catch (e) {
              console.error(e)
            }

            let {restOrderList} = data
            ids = ''
            if (restOrderList && restOrderList.length > 0) {
              let tmpIds = []
              restOrderList.forEach(item => {
                tmpIds.push(item.id + ',' + item.printMore + ',' + item.printMoreSeq)
              })
              ids = tmpIds.join(';')
              this.$store.dispatch('pushActionMap', {list: restOrderList}).then((newData) => {
                console.log('我不是空数组', JSON.stringify(newData))
                console.log('当前是自动打印状态为：', this.isAuto)
                if (this.isAuto && newData.length > 0) {
                  this.printService.add(newData)
                }
              })
            }
            next()
          }, err => {
            console.error('错误：', err)
            if (err === '请先登录') {
              next(false)
            } else {
              netFix.toTry((bool, times) => {
                if (!bool) {
                  this.$confirm('尝试连接失败，是否继续检测', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '重新登录',
                    type: 'warning'
                  }).then(() => {
                    next(true) // 为轮询是否就继续
                  }).catch(() => {
                    next(false)
                    netFix.clear()
                    this.$router.replace({name: 'Login'})
                  })
                } else {
                  next(bool)
                  this.$message.error('网络断开正在重连中' + times)
                  console.error('错误：' + '网络断开正在重连中' + times)
                }
              })
            }
          }).catch(err => {
            console.log('怎么回事')
            console.error('错误：轮询catch', err)
          })
        }, this.loopTime || 10000, false)
        this.round.start()
        console.log('轮询已正常启动')
      }
    },
    created () {
      // 当前店的字段
      console.log(JSON.stringify(this.shop), 'shop -----')
      if (this.shop.belongShopType < 20) {
        console.log('-------11111111--------')
        this.isShowMenu = true
      }
      this.activeUrl = this.$route.path
      // 初始化打印数据
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
      this.listenService()
      if (!this.$isXP) {
        console.log('getLocalPrinters()', getLocalPrinters())
      }
      console.log(this.shop.pushType, 'pushType-----------------------')
      switch (this.shop.pushType) {
        case 1: this.roundFn(); break  // 1轮询
        case 2: this.socketRun(); break // 2 websocket
        case 3: this.roundFn()
          this.socketRun(); break // 两者皆启用
        default: break
      }
      console.log(this.printService, 'printService')
    }
  }
</script>
