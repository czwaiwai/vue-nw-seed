<template>
    <div>
      <button class="button" >测试</button>
      <button class="button" >测试nwjs 打印</button>
      <button @click="openPay" class="button" >结账</button>
      <el-dialog title="结账" :before-close="closePay" :visible.sync="workDialogVisible" width="600px">
        测试结账
        <div v-show="payLoading">
          正在支付中....
        </div>
      </el-dialog>
      <el-button @click="login" >测试登录框</el-button>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import scanner from '../utils/scanner'
  import loginModal from '../components/loginModal/'
  Vue.component('mycontent', {
    props: ['content'],
    data () {
      return {
        workDialogVisible: false,
        coms: []
      }
    },
    render: function (h) {
      this.coms = []
      for (var i = 0; i < this.content.length; i++) {
        this.coms.push(h(this.content[i], {}))
      }
      return h('div', {},
        this.coms)
    }
  })
  export default{
    data () {
      return {
        payLoading: false,
        workDialogVisible: false,
        msg: 'hello vue',
        testName: 'tplTest01',
        content: [],
        foo: `<div>这是组件二1111</div>`
      }
    },
    created () {
      this.scan = scanner(this.scanerRes)
    },
    components: {},
    methods: {
      login () {
        loginModal(this, {
          closeOnClickModal: false,
          test: '这是我传递的值' + Math.random(),
          onOpen: function () {
            console.log('我被打开了')
          }}).then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
      },
      // 开启对话框监听键盘事件
      openPay () {
        this.workDialogVisible = true
        this.scan.start()
      },
      // 关闭对话框取消键盘事件
      closePay (done) {
        console.log('注销对话框----------')
        this.scan.stop()
        done && done()
      },
      // 获取扫描结果及处理
      scanerRes (str, done) {
        console.log('扫描结果:', str)
        console.log(str, '支付码通常为18位可以在这里开启验证')
        if (/^\d{18}$/.test(str)) { // console.log('数字18位')
          this.payLoading = true
          this.$http.post('http://localhost:8081/pay', {str: str}).then(res => {
            console.log(res)
            this.payLoading = false
            this.workDialogVisible = false
            this.closePay()
            this.$message.success('支付成功')
            done()
          }).catch(() => {
            this.payLoading = false
            done()
          })
        }
      },
      test1 () {
        console.log(this)
        this.$forceUpdate()
      },
      test2 () {
        this.testName = 'tplTest02'
      }
    }
  }
</script>
