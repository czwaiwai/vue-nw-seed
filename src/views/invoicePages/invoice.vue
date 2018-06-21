<template>
  <el-container class="main">
  <div class="grid-x" style="width:100%;">
    <div class="small-offset-3 small-5">
      <el-form  :rules="rules"  ref="ruleForm" :model="ruleForm" label-width="80px">
        <el-form-item label="开票金额" prop="proAmount">
          <el-input v-model="ruleForm.proAmount"></el-input>
        </el-form-item>
        <el-form-item label="商品类型"  prop="proId" >
          <el-select v-model="ruleForm.proId" placeholder="--- 请选择 ---" style="width:100%;">
            <el-option v-for="item in selectList" :key="item.id"  :label="item.proName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div v-show="ruleForm.list.length === 0 " >
          <el-button @click="addFormArea" type="text">+添加多行</el-button>
        </div>
        <div v-for="(item,index) in ruleForm.list" :key="index" >
          <div class="row">
            <el-button @click="addFormArea" type="text">+添加多行</el-button>
            <el-button class="float-right" @click="removeFormArea(item,index)" type="text">删除当前行</el-button>
          </div>
          <el-form-item label="开票金额" :prop="'list.'+index+'.proAmount'"
              :rules="[{
                required: true, message: '开票金额不能为空', trigger: 'blur',
              },{ validator: amount, trigger: 'blur' }]" >
            <el-input v-model="item.proAmount" ></el-input>
          </el-form-item>
          <el-form-item label="商品类型" :prop="'list.'+index+'.proId'"
              :rules="[{ required: true, message: '请输入活动名称', trigger: 'change' }]" >
            <el-select v-model="item.proId" placeholder="--- 请选择 ---" style="width:100%;">
              <el-option v-for="item in selectList" :key="item.id" :label="item.proName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="text-center">
          <el-button type="primary" :loading="btnLoading" @click="onSubmit('ruleForm')">打印二维码小票</el-button>
          <p class="text-center fs14">发票开具错误? 请点击<el-button type="text" @click="routeTo">红冲发票</el-button></p>
          <p class="text-center fs14">点击查询<el-button type="text" @click="routeList">已开发票</el-button></p>
        </el-form-item>
      </el-form>

    </div>
  </div>
  </el-container>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import {amount} from '../../utils/elemFormRules'
  export default{
    data () {
      return {
        btnLoading: false,
        ruleForm: {
          list: [],
          proAmount: '',
          proId: ''
        },
        amount: amount,
        rules: {
          proAmount: [
            { required: true, message: '开票金额不能为空', trigger: 'blur' },
            { validator: amount, trigger: 'blur' }
          ],
          proId: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
        },
        defaultSelect: '',
        selectList: []
      }
    },
    components: {
    },
    methods: {
      addFormArea () {
        this.ruleForm.list.push({
          proId: this.defaultSelect,
          proAmount: ''
        })
      },
      removeFormArea (item, index) {
        this.ruleForm.list.splice(index, 1)
      },
      routeTo () {
        console.log(this.$route.path)
        this.$router.push('/index/invoiceWrap/redInvoice')
//        if (this.$route.path.indexOf('/mainBook') > -1) {
//          return this.$router.replace('/mainBook/redInvoice')
//        }
//        if (this.$route.path.indexOf('/mainMall') > -1) {
//          return this.$router.replace('/mainMall/redInvoice')
//        }
//        if (this.$route.path.indexOf('/mainCus') > -1) {
//          return this.$router.replace('/mainCus/redInvoice')
//        }
//        return this.$router.replace('/main/redInvoice')
      },
      routeList () {
        this.$router.push('/index/invoiceWrap/invoiceList')
//        if (this.$route.path.indexOf('/mainBook') > -1) {
//          return this.$router.replace('/mainBook/invoiceList')
//        }
//        if (this.$route.path.indexOf('/mainMall') > -1) {
//          return this.$router.replace('/mainMall/invoiceList')
//        }
//        if (this.$route.path.indexOf('/mainCus') > -1) {
//          return this.$router.replace('/mainCus/invoiceList')
//        }
//        return this.$router.replace('/main/invoiceList')
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let list = [{
              proAmount: this.ruleForm.proAmount,
              proId: this.ruleForm.proId
            }, ...this.ruleForm.list]
            this.sendHttp(list)
          } else {
            console.log('验证失败!!')
            return false
          }
        })
      },
      async sendHttp (list) {
        this.btnLoading = true
        try {
          let res = await this.$http.post('/eleInvoice/shopAssistSaveFpMsg', {eleProList: JSON.stringify(list)})
          let resData = res.data
          let {printList} = resData.data
          if (printList) {
            this.$message.success('操作成功，内容已发往打印机')
            this.ruleForm = {
              list: [],
              proAmount: '',
              proId: this.defaultSelect
            }
          }
          console.log(printList, '操作成功，内容已发往打印机=----')
        } catch (e) {
          console.error(e)
        } finally {
          this.btnLoading = false
        }
      },
      async getPageData () {
        let res = await this.$http.post('/eleInvoice/getProList')
        let resData = res.data
        let {eleProductList} = resData.data
        this.selectList = eleProductList
        if (this.selectList.length === 1) {
          this.defaultSelect = this.selectList[0].id
          this.ruleForm.proId = this.defaultSelect
        }
//        console.log(eleProductList)
      }
    },
    activated () {

    },
    created () {
      this.getPageData()
    }
  }
</script>
