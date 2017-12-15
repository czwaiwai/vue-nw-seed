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
        let printerName = 'GP-L80250 Series'
        let myPrint = new Printer(printerName, function (err, msg) {
          //  调用this方法进行打印
          if (err) {
            throw new Error(err)
          }
          this.compile(`<% setAlign:c %><% setSize:2 %><% setStyle:B %>宝山茶楼\n
<% setSize:1 %>================================================\n
<% setAlign:l %>营业时间：2017-12-14 13:19\n
结束时间：2017-12-14 15:53\n
收银员：歪歪\n
<% setSize:2 %><% setStyle:B %>账单汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
账单总数：12\n
用餐人数：4\n
账单总额：1109.00\n
实收总额：1049.00\n
优惠券总额:0.00\n
折扣（改价）优惠总额:0.00\n
活动优惠总额：70.00\n
退款总额：-10.00\n
<% setSize:2 %><% setStyle:B %>营业收款明细\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
现金支付总额：953.00\n
飞常赞支付总额：0.00\n
线上支付总额：96.00\n
------------------------------------------------\n
合计：（12笔）1049.00\n
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售汇总\n
<% setSize:1 %><% setStyle:NORMARL %>
________________________________________________\n
刀叉套餐送8款点心             x4           0
------------------------------------------------\n
小计：                        x42         1109
\n\t
<% setSize:2 %><% setStyle:B %>菜品销售明细\n
<% setSize:1 %><% setStyle:NORMARL %>
================================================\n
<% setStyle:B %>道茶套餐送8款点心\n
<% setStyle:NORMARL %>________________________________________________\n
叉烧小笼包（送）               x1          0\n
------------------------------------------------\n
小计：                        x42         1109\n
`)
            .print(function (err, msg) {
              if (err) {
                console.log(err)
              }
            })
          /*  打印日报
          this.compile(`<% setAlign:c %><% setSize:2 %>日报\n
<% setAlign:l %><% setSize:1 %>店铺：宝山茶楼\n
统计开始日期：2017-12-14 13:19\n
统计结束日期：2017-12-14 15:47\n
------------------------------------------------\n
已支付：12笔      实收金额：1049.00\n
------------------------------------------------\n
现金支付：953.00\n
线上支付：96\n
飞常赞支付：0.00\n
________________________________________________\n
此小票为日报，请妥善保管\n
`)
            .print(function (err, msg) {
              if (err) {
                console.log(err)
              }
            })
           */
          /* 出打单
          this.compile(`<% setAlign:l %><% setSize:1 %>乐稻港式餐厅（后厨）\n
<% setSize:3 %><% setStyle:B %>台：26号桌\n
<% setAlign:l %>  烧鸭饭   x1\n
<% setAlign:l %>[怎么回事|适得府君书]\n
<% setSize:1 %><% setStyle:NORMAL %>________________________________________________\n
<% setSize:5 %><% setStyle:B %>用户备注：加辣\n
<% setSize:1 %><% setStyle:NORMAL %>账单：201712140034\n
收银员：曹正\n
来源：飞常赞\n
下单：12-14 12:35:52\n
打印：12-14 14:00:38\n
`)
            .print(function (err, msg) {
              if (err) {
                console.log(err)
              }
            })
            */
          /*
          this.compile(`<% setAlign:c %><% setSize:2 %>乐稻港式餐厅（结账单）【重打】\n
<% setSize:1 %>================================================\n
<% setAlign:l %>账单：201712140031
台号：<% setSize:2 %><% setStyle:BU %>14号桌\n
<% setSize:1 %><% setStyle:NORMAL %>收银员：曹正\n
支付方式：<% setSize:2 %><% setStyle:BU %>线上支付\n
<% setSize:1 %><% setStyle:NORMAL %>
________________________________________________\n
------------------------------------------------\n
行      菜品/数量         单价           金额
<% setAlign:l %>1  茄子肉末饭\n
          X1              45             45\n
<% setAlign:l %>2  茄子肉末饭\n
          X1              45             45\n
<% setAlign:l %>3  茄子肉末饭\n
          X1             100             45\n

________________________________________________\n
------------------------------------------------\n
<% setAlign:l %>原价合计：161元\n
实际支付金额：151元\n
已优惠：10元\n
线上支付：151元\n
<% setSize:2 %><% setStyle:BU %>交易单号：105570043895201712142110716802\n
<% setSize:1 %><% setStyle:NORMAL %>________________________________________________\n
来源：飞常赞\n
下单时间：12-14 12:34:35\n
打印时间：12-14 13:35:37\n
地址：广州市花都区白云国际机场候机楼一楼C8111店\n
电话：020-36067837\n
`)
            .print(function (err, msg) {
              if (err) {
                console.log(err)
              }
            })
            */
/*
          this.compile(`<% setAlign:c %><% setSize:2 %>乐稻港式餐厅（消费单）\n
<% setSize:1 %>================================================\n
<% setAlign:l %>桌号：<% setSize:2 %><% setStyle:BU %>14号桌\n
<% setSize:1 %><% setStyle:NORMAL %>账单：201712120005\n
收款员：曹正\n
日期：12-12 11:50:48 \n
来源：非常赞 \n
支付方式：<% setStyle:B %><% setSize:2 %>非常赞账户支付 \n
<% setAlign:l %><% setStyle:NORMAL %><% setSize:1 %>
_______________________________________________\n
风味奶茶\n
25           x1                            25
------------------------------------------------\n
风味奶茶\n
25           x1                            25
------------------------------------------------\n
牛肉烧饼\n
25           x4                            168
------------------------------------------------\n
风味奶茶\n
189          x1                            1189
------------------------------------------------\n
原价合计：200元\n
实际支付金额：180元\n
已优惠：20元 \n
非常赞余额支付：180元 \n
------------------------------------------------\n
地址：广州市花都区白云国际机场候机楼一楼CB111店\n
电话：020-36067837\n
<% setAlign:c %>请保存好本小票，作为退换货依据\n
 `)
            .print(function (err, msg) {
              if (err) {
                console.log('打印出错,回传信息:')
              }
              console.log(msg)
            })
        })
        */
//        let newOne = new Printer('HP LaserJet Pro MFP M225-M226 PCL 6', function (err, msg) {
//          if (err) {
//            throw new Error(err)
//          }
//          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
//            if (err) {
//              console.log('打印出错,回传信息:')
//            }
//            console.log(msg)
//          })
//          this.setAlign('c').text('这个是居中文字').print(function (err, msg) {
//            if (err) {
//              console.log('打印出错,回传信息:')
//            }
//            console.log(msg)
//          })
        })
//        console.log(newOne)
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
