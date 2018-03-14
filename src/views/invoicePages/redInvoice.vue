<template>
  <div class="grid-x">
    <div class="small-offset-3 small-5">
      <el-form  :rules="rules"  ref="ruleForm" :model="ruleForm" label-width="80px">
        <el-form-item label="发票代码" prop="invoiceCode">
          <el-input v-model="ruleForm.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号码" prop="invoiceNo">
          <el-input v-model="ruleForm.invoiceNo"></el-input>
        </el-form-item>
        <el-form-item label="红冲原因" prop="redReason">
          <el-input v-model="ruleForm.redReason"></el-input>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button type="primary"  :loading="btnLoading"  @click="onSubmit('ruleForm')">发票红冲</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">

  export default{
    data () {
      return {
        btnLoading: false,
        ruleForm: {
          invoiceCode: '',
          invoiceNo: '',
          redReason: ''
        },
        rules: {
          invoiceCode: [
            { required: true, message: '发票代码不能为空', trigger: 'blur' }
          ],
          invoiceNo: [
            { required: true, message: '发票号码不能为空', trigger: 'change' }
          ],
          redReason: [
            { required: true, message: '红冲发票原因不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendHttp()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async sendHttp () {
        this.btnLoading = true
        try {
          let res = await this.$http.post('/eleInvoice/nullifyFpBySa', this.ruleForm)
          console.log(res)
          if (res) {
            this.$message.success('操作成功')
            this.ruleForm = {
              invoiceCode: '',
              invoiceNo: '',
              redReason: ''
            }
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.btnLoading = false
        }
      }
    },
    activated () {
      this.$refs['ruleForm'].resetFields()
    }
  }
</script>
