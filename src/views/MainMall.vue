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
        <el-main>
          <!--<div class="scroll_content">-->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <!--</div>-->
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
    created () {
      // 初始化打印数据
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
    }
  }
</script>
