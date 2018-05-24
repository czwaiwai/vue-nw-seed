<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞商城系统 v{{appVersion}} ({{shop.name}})</div>
        <div class="cell small-6 text-right" style="line-height:44px;">
          <span class="logo_time">{{currentTime}}</span>
          <span class="light fs12 label" style="">{{shopUser.saleName}}[{{shopUser.mobile}}]</span>
          <a @click="exitClickHandler" style="margin:0" class="button small alert" href="javascript:void(0)" >退出系统</a></div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="nav_aside flex_box flex_direction_column" style="background:#545C64"  >
        <div class="flex_item"  :style="!isShowMenu?'width:200px;':'width:auto'">
          <el-menu
            default-active="/mainMall/assistantOpLog"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="isShowMenu"
            router
            active-text-color="#ffd04b">
            <el-menu-item index="/mainMall/assistantOpLog" >
              <i class="el-icon-tickets"></i>
              <span slot="title">支付核消</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/ycFczOrder"  >
              <i class="el-icon-document"></i>
              <span slot="title">订单记录</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/countShoppingBag"  >
              <i class="el-icon-sold-out"></i>
              <span slot="title">购物袋统计</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/invoice"  >
              <i class="el-icon-news"></i>
              <span slot="title">电子发票</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/freeGo/freeNewOrder"  >
              <i class="el-icon-news"></i>
              <span slot="title">自助购</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/scanClerk"  >
              <i class="el-icon-news"></i>
              <span slot="title">飞常赞用户收款</span>
            </el-menu-item>
            <el-menu-item index="/mainMall/planeSync" v-if="shop.airUpload===1 || user.userId === 100023"  >
              <i class="el-icon-news"></i>
              <span slot="title">机场数据同步</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="aside-footer " style="padding:0;background:#545C64"  >
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="isShowMenu"
            active-text-color="#FFF">
            <el-menu-item index="1" @click="isShowMenu=!isShowMenu" >
              <i class="el-icon-rank"></i>
              <span slot="title">缩放侧边栏</span>
            </el-menu-item>
            <el-menu-item  index="2" @click="logoutClickHandle" >
              <i class="el-icon-back"></i>
              <span slot="title">切换账号</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container class="is-vertical">
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}} </div>
        <el-main v-if="$route.path.indexOf('freeGo')===-1" >
          <!--<div class="scroll_content">-->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <!--</div>-->
        </el-main>
        <el-main style="display:flex;padding:0;flex-direction:column;"  v-if="$route.path.indexOf('freeGo')>-1">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">
  .el-aside .el-menu {
    border-right:0;
  }
  .unit_header{
    height:34px;
    line-height:34px;
    background:#f0f0f0;
    border:1px solid #e3e3e3;
  }
</style>
<script type="text/ecmascript-6">

  import { mapGetters } from 'vuex'
  import SysMethods from '../utils/sysMenthod'
  import {wsUrl} from '../utils/env'
  import WsHelper from '../utils/wsHelper'
  import singleton from '../utils/singleton'
  export default {
    mixins: [SysMethods],
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
      })
    },
    methods: {
      socketData (cb) {
        let self = this
        let url = `${wsUrl}${location.host}/fczIM/orderMgr?type=2&shopId=${self.shop.id}`
//        let url = `${wsUrl}${location.host}/fczIM/orderMgr?type=2&shopId=3802568355447808`
        return (singleton(function () {
          return new WsHelper(url, cb)
        }))()
      },
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
            console.log('after----------------', obj)
            if (obj.isOrder) {
              try {
                if (obj.isAutoChange) {
                  self.$store.commit('clearActiveOrder')
                }
                self.$store.commit('setFinshPrintOrder', obj)
                self.$store.commit('freeRemoveOrder', obj)
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
      }
    },
    created () {
      // 初始化打印数据
      console.log(this.shop, '--------shop---------')
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
      this.listenService()
      // websocket
      this.socketData((event, ws) => {
        if (event.data === 'pong') return
        console.log(event, 'socket event')
        let resData = null
        try {
          resData = JSON.parse(event.data)
        } catch (e) {
          return console.error(e)
        }
        let {triggerEvent} = resData
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
      })
    }
  }
</script>
