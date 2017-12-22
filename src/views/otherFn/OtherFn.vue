<template>
  <div class="grid-x  small-up-2  medium-up-3 large-up-6">
    <div class="cell btn_block">
      <button @click="allOrderFinishHandler" type="button" class="button expanded">批量订单完成</button>
    </div>
    <div class="cell btn_block">
      <button @click="showPrintersHandler" type="button" class="button expanded">查看打印机</button>
    </div>
    <div class="cell btn_block">
      <button @click="safeExitHandler" type="button" class="button expanded">安全退出</button>
    </div>
    <!--<div class="cell btn_block">-->
      <!--<button type="button"class="button expanded">切换分区</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button"class="button expanded">菜品参数</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">主界面按钮颜色</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">更换台卡</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">撤销估清</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">前台报表</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">开钱箱</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button  type="button" class="button expanded">暂存</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">取暂存单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">撤销结账</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">估清设置</button>-->
    <!--</div>-->

    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打分单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打划菜</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">交班</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">并单结账</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">退出系统</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">修改密码</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">重打交班单</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">修改人数</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">会员充值</button>-->
    <!--</div>-->
    <!--<div class="cell btn_block">-->
      <!--<button type="button" class="button expanded">呼叫取餐</button>-->
    <!--</div>-->
    <el-dialog title="打印机状态" :visible.sync="printerStateVisible" width="600px">
      <el-table :data="printerList" :border="true" style="width: 100%">
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column prop="name" label="打印机名称" ></el-table-column>
        <el-table-column label="打印机状态" width="100">
          <template slot-scope="scope">
            {{printTypeTxt[scope.row.myPrintType]}}
          </template>
        </el-table-column>
        <el-table-column prop="portName" label="打印机端口"></el-table-column>
        <el-table-column prop="waitjobs" label="待打印" width="80"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printerStateVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
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
  var printer = require('printer')
  export default{
    data () {
      return {
        msg: 'hello vue',
        printerList: [],
        printTypeTxt: {
          'standBy': '空闲',
          'PRINTING': '打印中',
          'ERROR': '错误'
        },
        printerStateVisible: false
      }
    },
    components: {
    },
    methods: {
      allOrderFinishHandler () {
        this.$confirm('你确定将所有支付完成并打印的订单设置为订单完成状态吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/ycRest/batchOrderOver').then(res => {
            let resData = res.data
            if (resData.status === 'y') {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {})
      },
      safeExitHandler () {
        this.$http.post('/doLogout').then((res) => {
          if (res.data.retCode === 0) {
            this.$store.commit('logout')
            this.$router.replace({name: 'Login'})
          }
        })
      },
      showPrintersHandler () {
        let list = printer.getPrinters()
        this.printerList = list.map(item => {
          if (item.jobs && item.jobs.length > 0) {
            console.log(item.jobs.status)
            item.myPrintType = item.status[0]
            item.waitjobs = item.jobs.length
          } else {
            item.myPrintType = 'standBy'
            item.waitjobs = 0
          }
          return item
        })
        console.log(this.printerList)
        this.printerStateVisible = true
      }
    }
  }
</script>
