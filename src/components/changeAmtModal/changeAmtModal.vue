<template>
  <el-dialog title="改价" @open="open" @close="close" :visible.sync="visible" width="600px">
    <el-form :model="changeAmtForm" :rules="changeAmtRules" ref="changeAmt" label-width="120px">
      <el-form-item label="实际支付金额" prop="adjAmt" placeholder="请填写金额">
        <el-input v-model="changeAmtForm.adjAmt"></el-input>
      </el-form-item>
      <el-form-item label="改价备注" prop="adjRemark" >
        <el-autocomplete class="inline-input" v-model="changeAmtForm.adjRemark" :fetch-suggestions="suggestChangeAmt" placeholder="请填写备注"></el-autocomplete>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="changeAmtConfirm('changeAmt')">确定</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import { amount as amountRule } from '../../utils/elemFormRules'
  import loginModal from '../loginModal/'
  export default{
    prop: {
      shopAuth: Number,
      form: Object
    },
    data () {
      return {
        visible: false,
        btnLoading: false,
        changeAmtForm: {
          adjAmt: '',
          adjRemark: ''
        },
        changeAmtRules: {
          adjAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          adjRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      open (e) {
        this.changeAmtForm = this.form
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      suggestChangeAmt (queryStr, cb) {
        cb([
          {'value': '员工打折'},
          {'value': '活动优惠'},
          {'value': '产品质量问题'},
          {'value': '系统测试'}
        ])
      },
      changeAmtConfirm (formName) {
        console.log('-----------------------确认改价')
        this.$refs[formName].validate(async valid => {
          if (valid) {
            this.btnLoading = true
            try {
              let res = {}
              if (this.shopAuth) {
                res = await loginModal()
              }
              let params = Object.assign(this.changeAmtForm, res)
              this.$http.post('/ycRest/correctAmout', params).then((res) => {
                this.btnLoading = false
                let resData = res.data
                let {restOrder} = resData.data
                this.callback(restOrder)
//                this.$message.success('改价成功')
//                this.$store.commit('setActiveOrder', restOrder)
//                this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
//                  console.log(bool, '哈哈哈')
//                  if (bool) {
//                    this.$store.commit('updatePrintOrderMap', restOrder)
//                  }
//                  if (!this.isNewPage) {
//                    console.log('不是当前newOrder页面更新订单状态')
//                    this.$store.commit('updateOne', restOrder)
//                  }
//                })
                this.visible = false
              }).catch(() => {
                this.btnLoading = false
              })
            } catch (e) {
              console.error(e)
              this.btnLoading = false
            }
          }
        })
      }
    },
    components: {
    }
  }
</script>
