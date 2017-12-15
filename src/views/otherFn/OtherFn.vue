<template>
  <div class="grid-x  small-up-2  medium-up-3 large-up-6">
    <div class="cell btn_block">
      <button type="button" class="button expanded">更改市别</button>
    </div>
    <div class="cell btn_block">
      <button type="button"class="button expanded">切换分区</button>
    </div>
    <div class="cell btn_block">
      <button type="button"class="button expanded">菜品参数</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">主界面按钮颜色</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">更换台卡</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">撤销估清</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">前台报表</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">开钱箱</button>
    </div>
    <div class="cell btn_block">
      <button  type="button" class="button expanded">暂存</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">取暂存单</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">撤销结账</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">估清设置</button>
    </div>

    <div class="cell btn_block">
      <button type="button" class="button expanded">重打分单</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">重打划菜</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">交班</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">并单结账</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">退出系统</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">修改密码</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">重打交班单</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">修改人数</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">会员充值</button>
    </div>
    <div class="cell btn_block">
      <button type="button" class="button expanded">呼叫取餐</button>
    </div>
    <div class="cell btn_block">
      <button @click="showPrintersHandle" type="button" class="button expanded">查看打印机</button>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .cell.btn_block{
      padding:5px;
    & .button{
      margin:0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }

  @media (max-width:1010px){
    .cell.btn_block .button{
      font-size:13px;
      margin:0;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        msg: 'hello vue'
      }
    },
    components: {
    },
    methods: {
      showPrintersHandle () {
        this.$router.push('/main/printers')
      }
    }
  }
</script>
