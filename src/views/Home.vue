<template>
  <div class="page">
    这里是内容页面
    <div class="page_bd">
      <button class="button" @click="showAllPrinters">查看本机打印机</button>
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
  var Printer = require('chn-escpos')
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
      showAllPrinters () {
        this.$router.push('/printers')
      },
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
//      console.log('点击打印按钮')
//      bus.$emit('print')
        let printerName = '小票机net'
        let myPrint = new Printer(printerName, function (err, msg) {
          //  调用this方法进行打印
          if (err) {
            throw new Error(err)
          }
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
        })
        let newOne = new Printer('HP LaserJet Pro MFP M225-M226 PCL 6', function (err, msg) {
          if (err) {
            throw new Error(err)
          }
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
            if (err) {
              console.log('打印出错,回传信息:')
            }
            console.log(msg)
          })
        })
        console.log(newOne)
        console.log(myPrint)
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
