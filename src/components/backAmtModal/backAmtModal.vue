<template>
  <el-dialog title="退单" @open="open" @close="close" :visible.sync="visible" width="600px" >
    <el-form :model="backAmtForm" :rules="backAmtRules" ref="backAmtForm" label-width="120px">
      <el-form-item label="退款金额" prop="refundAmt">
        <el-input v-model="backAmtForm.refundAmt" placeholder="请填写金额"></el-input>
      </el-form-item>
      <el-form-item label="退款备注" prop="refundRemark">
        <el-autocomplete class="inline-input" v-model="backAmtForm.refundRemark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backAmtConfirm('backAmtForm')">确定</el-button>
      </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import { amount as amountRule } from '../../utils/elemFormRules'
  import loginModal from '../loginModal/'
  export default {
    props: {
      shopAuth: Number,
      form: Object
    },
    data () {
      return {
        //   退单form
        visible: false,
        btnLoading: false,
        backAmtForm: {
          id: '',
          refundAmt: '',
          refundRemark: ''
        },
        backAmtRules: {
          refundAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          refundRemark: [
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
        this.backAmtForm = this.form
        this.onOpen && this.onOpen()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      backAmtConfirm (formName) {
        console.log('-----------------------退单确认')
        this.$refs[formName].validate(async valid => {
          if (valid) {
            this.btnLoading = true
            try {
              let res = {}
              if (this.shopAuth) {
                res = await loginModal()
              }
              this.$http.post('/ycRest/refundRestOrder', Object.assign(this.backAmtForm, res)).then((res) => {
                this.btnLoading = false
                this.visible = false
                let resData = res.data
                let {restOrder} = resData.data
                this.callback(restOrder)
              }, err => {
                console.log(err)
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
