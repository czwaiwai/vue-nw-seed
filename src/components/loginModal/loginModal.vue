<template>
    <el-dialog width="600px" @open="open" @close="close" title="登录认证" :visible.sync="loginVisible" append-to-body>
      <el-form  autocomplete="off" label-width="80px" :model="loginForm" :rules="loginFormRules" ref="loginForm" >
        <div class="grid-x">
          <div class="small-6">
            <el-form-item label="账户" prop="saleId">
              <el-select name="saleId" v-model="loginForm.saleId" placeholder="请选择">
                <el-option
                  v-for="item in loginAuthList"
                  :key="item.saleId"
                  :label="item.saleName"
                  :value="item.saleId">
                </el-option>
              </el-select>
              <!--<el-input  @focus="inputFocus" v-model="loginForm.mobile"></el-input>-->
            </el-form-item>
            <el-form-item label="密码" prop="psd">
              <el-input name="psd"    @focus="inputFocus" v-model="loginForm.psd"  type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginConfirm('loginForm')" >确定</el-button>
              <el-button @click="loginVisible=false">取消</el-button>
            </el-form-item>
          </div>
          <div class="small-6 text-right">
            <vir-keyboard mode="focus" :input="input"  style="margin-top:-5px;width:250px;display:inline-block;"></vir-keyboard>
          </div>
        </div>
      </el-form>
    </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import { passWd } from '../../utils/elemFormRules'
  export default{
    props: {
      test: ''
    },
    data () {
      return {
        input: null, // 虚拟键盘使用
        //  用户验证
        loginVisible: false, // 登录认证
        loginAuthList: [],
        loginForm: {
          saleId: '',
          psd: ''
        },
        loginFormRules: {
          saleId: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          psd: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {validator: passWd, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      open (e) {
        this.onOpen && this.onOpen()
        console.log('传递过来的值', this.test)
        this.loginForm = {
          saleId: '',
          psd: ''
        }
        this.getPageData()
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      loginConfirm (formName) {
        console.log('-----------------------登录验证确认')
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(valid)
            this.callback(this.loginForm)
            this.loginVisible = false
          }
        })
      },
      inputFocus (e) {
        this.input = e.target
      },
      async getPageData () {
        try {
          let res = await this.$http.post('/ycRest/listRefundRight')
          let resData = res.data
          let {list} = resData.data
          this.loginAuthList = list
        } catch (e) {
          console.error(e)
        }
      }
    },
    created () {
      this.getPageData()
    }
  }
</script>
