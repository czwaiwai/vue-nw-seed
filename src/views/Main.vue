<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v0.1.0</div>
        <div class="cell small-6 text-right"><span class="logo_time" >{{currentTime}}</span></div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="el-container  is-vertical" width="400px" style="max-width:400px;">
        <div class="food_mode_quick flex_item" style="width:400px;">
          <div class="padding" >
            <h5>快餐模式</h5>
            <div class="grid-x ">
              <div class="cell small-6 bold">账单：</div>
              <div class="cell small-6 bold">台卡：</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">市别：</div>
              <div class="cell small-6">类型：</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">下单：</div>
              <div class="cell small-6 bold">总计：</div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="tableData" highlight-current-row  @current-change="handleCurrentChange" style="width:400px;">
            <el-table-column property="status" label="状态"></el-table-column>
            <el-table-column property="name" label="菜品名称"  ></el-table-column>
            <el-table-column property="num" label="数量"></el-table-column>
            <el-table-column property="amount" label="单价"></el-table-column>
            <el-table-column property="allAmount" label="小计"></el-table-column>
          </el-table>
          <!--<div style="margin-top: 20px">-->
            <!--<el-button @click="setCurrent(tableData[1])">选中第二行</el-button>-->
            <!--<el-button @click="setCurrent()">取消选择</el-button>-->
          <!--</div>-->
        </div>
        <div class="aside-footer flex_box">
          <div class="row ">
            <div >
              <button class="button">上行</button>
              <button class="button">数量</button>
              <button class="button">改价</button>
              <button class="button">做法</button>
            </div>
            <div>
              <button class="button">下行</button>
              <button class="button">口味</button>
              <button class="button">退菜</button>
              <button class="button">清空</button>
            </div>
          </div>
          <a class="button warning margin5 flex_item fs25 ">
            下单
          </a>
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
        <el-footer  style="height:auto;">
          <div class="grid-container full">
            <div class="grid-x grid-margin-x">
              <div class="cell small-2">
                <button type="button" class="button purple  expanded   margin5   ">修改人数</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button   expanded  margin5   ">上一页</button>
              </div>
              <div class="cell small-2">
                <button type="button" class="button   expanded  margin5   ">新单</button>
              </div>
              <div class="cell small-2">
                <button type="button"  class="button   expanded  margin5   ">点菜</button>
              </div>
              <div class="cell small-2">
                <button type="button"  class="button   expanded  margin5   ">交班</button>
              </div>
              <div class="cell small-2">
                <button type="button"  class="button   expanded  margin5   ">结账</button>
              </div>
            </div>
            <div class="grid-x grid-margin-x">
              <div class="cell small-2">
                <button type="button" @click="moreFnClickHandler"  class="button   expanded  margin5   ">{{isMoreFn?'返回':'更多功能'}}</button>
              </div>
              <div class="cell small-2">
                <button  type="button" class="button   expanded  margin5   ">下一页</button>
              </div>
              <div class="cell small-2">
                <button  type="button"  class="button   expanded  margin5   ">打包</button>
              </div>
              <div class="cell small-2">
                <button  type="button"  class="button   expanded  margin5   ">撤销结账</button>
              </div>
              <div class="cell small-2">
                <button  type="button"  class="button   expanded  margin5   ">并单结账</button>
              </div>
              <div class="cell small-2">
                <button   type="button" class="button   expanded  margin5   ">注销</button>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">
  .main{
    height:100%;
  }
  .logo{
    font-size:20px;
    color:#FFF;
  }
  .logo_time{
    color:#FFF;
  }
  .aside-footer{
    padding:5px;
    background:#f0f0f0;
    & .button{
      margin-bottom:5px;
    }
  }
  .el-header{
    background-color:#252728;
    color: #333;
    line-height: 44px;
  }
   .el-footer {
     background-color: #f0f0f0;
     color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;

    & .aside-main{
          padding:0;
    }
  }
  .el-table__header{
    margin-bottom:0;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }



</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import roundTime from '../utils/roundTime'
  let timer
  export default{
    data () {
      return {
        currentTime: '',
        now:moment(new Date()).format("YYYY-MM-DD"),
        tableData: [{
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }, {
          status: '分单',
          name: '牛肉烧饼',
          num: 1,
          amount: 12,
          allAmount: 12
        }],
        currentRow: null,
        msg: 'hello vue',
        isMoreFn: false
      }
    },
    methods: {
      setCurrent (row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      moreFnClickHandler () {
        if (this.$route.path === '/main/otherFn') {
          this.isMoreFn = false
          this.$router.back()
        } else {
          this.isMoreFn = true
          this.$router.push({name: 'OtherFn'})
        }
      }
    },
    components: {
    },
    created () {
      this.round = roundTime(() => {
          console.log("haha")
      }, 10000, false)
      this.round.start()

      timer = setInterval(() => {
        this.currentTime = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    },
    destroyed () {
      clearInterval(timer)
    }
  }
</script>
