<template>
  <div class="page">
    这里是内容页面
    <div class="page_bd">
      <button class="button" @click="clickHandler">测试</button>
      <button v-on:click="init" class="print_init" >初始化打印机</button>
      <button v-on:click="print" class="print_button">打印测试</button>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script>
 // var escpos = require('escpos')
  import bus from '@/utils/bus'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        user: 'user',
        isLogin: 'isLogin'
      })
    },
    methods: {
      init () {
        this.deviceIp = '192.168.2.126'
       // this.device = new escpos.Network(this.deviceIp)
       // this.printer = new escpos.Printer(this.device)
        console.log(this.device, this.printer)
        var that = this
        this.device.open((err, device) => {
          console.log('没有执行么')
          if (err) {
            console.log(err)
          }
          bus.$on('print', function () {
            console.log('print')
            that.printer
              .font('a')
              .align('ct')
              .style('bu')
              .size(1, 1)
              .text('The quick brown fox jumps over the lazy dog')
              .text('敏捷的棕色狐狸跳过懒狗')
              .barcode('1234567', 'EAN8')
              .qrimage('https://github.com/song940/node-escpos', function (err) {
                this.cut()
                console.log(err)
                // this.close();
              })
          })
        })
      },
      print () {
        console.log('点击打印按钮')
        bus.$emit('print')
      },
      clickHandler () {
        console.log(this.user)
        console.log(this.isLogin)
      }
    },
    created () {

    }
  }
</script>
