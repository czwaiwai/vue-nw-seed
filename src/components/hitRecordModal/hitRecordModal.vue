<template>
  <el-dialog title="打卡记录"  @open="open" @close="close"  :visible.sync="visible" width="600px">
    <div class="block">
      <span class="demonstration">日期选择</span>
      <el-date-picker
        v-model="hitDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期" @change="hitDateChange">
      </el-date-picker>
    </div>
    <div class="hit_record">
      <el-table   height="250" :data="hitRecordTable">
        <el-table-column type="index"  label="序号" width="50"></el-table-column>
        <el-table-column property="saleName" label="姓名" width="100"></el-table-column>
        <el-table-column property="buildTime" label="打卡时间"></el-table-column>
        <el-table-column property="remark" label="打卡类型"></el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  let now = moment(new Date()).format('YYYY-MM-DD')
  export default{
    data () {
      return {
        visible: false,
        hitDate: '',
        hitRecordTable: []
      }
    },
    methods: {
      open (e) {
        this.hitRecordTable = []
        this.workClickRecordHandler()
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      //  上班打卡记录
      workClickRecordHandler (e) {
        //  /ycRest/assistantSignRecord
        console.log('-----------------------上班打卡记录')
        this.hitDate = now
        if (typeof e === 'string') {
          this.hitDate = e
        }
        this.$http.post('/ycRest/assistantSignRecord', {buildTime: this.hitDate}).then(res => {
          let resData = res.data
          this.hitRecordTable = resData.data
        })
      },
      hitDateChange (val) {
        this.workClickRecordHandler(val)
      }
    }
  }
</script>
