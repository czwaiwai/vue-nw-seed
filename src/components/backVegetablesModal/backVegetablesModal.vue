<template>
  <el-dialog title="退菜" @open="open" @close="close" :visible.sync="visible" width="600px">
    <el-table :data="backCaiList" border height="300" style="width: 100%">
      <el-table-column prop="restProName" label="菜名"></el-table-column>
      <el-table-column label="数量" width="120">
        <template slot-scope="scope">
          <span class="padding-right">{{scope.row.buyCount}}</span>  <span v-show="scope.row.tuiNum" class="alert label">退菜 -{{scope.row.tuiNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.btnDisabled" @click="tuiCaiBtnHandle(scope.$index, scope.row)">退菜</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="backCaiForm" :rules="backCaiRules" ref="backCaiForm" label-width="120px">
      <el-form-item label="备注" prop="remark" style="margin-bottom:0;padding-top:15px;">
        <el-autocomplete class="inline-input" v-model="backCaiForm.remark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backCaiConfirm('backCaiForm')">确定</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import loginModal from '../loginModal/'
  export default{
    props: {
      shopAuth: Number,
      form: Object,
      list: []
    },
    data () {
      return {
        //  退菜
        visible: false,
        btnLoading: false,
        backCaiList: [],
        backCaiForm: {
          detailInfos: '',
          remark: ''
        },
        backCaiRules: {
          remark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      suggestBackAmt (queryStr, cb) {
        cb([
          {'value': '员工折让'},
          {'value': '产品质量'},
          {'value': '顾客更换产品'},
          {'value': '产品售完'},
          {'value': '顾客赶时间退餐品'},
          {'value': '测试订单'}
        ])
      },
      open (e) {
        this.backCaiList = [...this.list]
        this.backCaiForm = this.form
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      tuiCaiBtnHandle (index, item) {
        item.tuiNum ++
        if (item.tuiNum === item.buyCount) {
          item.btnDisabled = true
        }
      },
      backCaiConfirm (formName) {
        console.log('-----------------------退菜确定')
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let tuiArr = this.backCaiList.map(item => {
              if (item.tuiNum) {
                return item.id + ';' + item.tuiNum
              }
            })
            this.backCaiForm.detailInfos = tuiArr.join('|')
            if (!this.backCaiForm.detailInfos) {
              return this.$message.error('请选择要退的菜品')
            }
            this.btnLoading = true
            try {
              let action = {}
              if (this.shopAuth) {
                action = await loginModal()
              }
              this.$http.post('/ycRest/retreatFood', Object.assign(this.backCaiForm, action)).then(res => {
                this.btnLoading = false
                this.visible = false
                let resData = res.data
                this.callback(resData.data)
//              let {restOrder, isAllRefund} = resData.data
//              this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
//                this.backCaiVisible = false
//                this.$message({
//                  message: '退菜成功',
//                  type: 'success'
//                })
//                if (this.isPrintedPage && isAllRefund) {
//                  this.$store.commit('removeOne', newOrder)
//                } else {
//                  this.$store.commit('updateOne', newOrder)
//                }
//              })
              }).catch(() => {
                this.btnLoading = false
              })
            } catch (e) {
              this.btnLoading = false
            }
          }
        })
      }
    }
  }
</script>
