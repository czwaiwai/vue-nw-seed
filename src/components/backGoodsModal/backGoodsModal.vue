<template>
  <el-dialog :title="title" @open="open" @close="close" :visible.sync="visible" width="600px">
    <el-form :model="backCaiForm" :rules="backCaiRules" ref="backCaiForm" label-width="120px">
      <el-form-item label="备注" prop="remark" style="margin-bottom:0;padding-top:15px;">
        <el-autocomplete class="inline-input" v-model="backCaiForm.remark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backProConfirm('backCaiForm')">确定</el-button>
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
      title: {
        type: String,
        default: '退菜'
      },
      trName: {
        type: String,
        default: '菜名'
      },
      isFood: {
        type: Boolean,
        default: true
      },
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
        console.log(item, '-----item------')
        if (item.tuiNum === item.buyCount) {
          item.btnDisabled = true
        }
      },
      backProConfirm (formName) {
        // '/ycRetail/refundPro'
        this.$refs[formName].validate(async valid => {
          if (valid) {
            this.btnLoading = true
            try {
              let action = {}
              if (this.shopAuth) {
                action = await loginModal()
              }
              this.$http.post('/ycRetail/refundPro', Object.assign(this.backCaiForm, action)).then(res => {
                this.btnLoading = false
                this.visible = false
                let resData = res.data
                this.callback(resData.data)
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
