<template>
    <div>
      <button class="button" >测试</button>
      <button class="button" @click="printTest" >测试nwjs 打印</button>
      <button @click="openPay" class="button" >结账</button>
      <el-dialog title="结账" :before-close="closePay" :visible.sync="workDialogVisible" width="600px">
        测试结账
        <div v-show="payLoading">
          正在支付中....
        </div>
      </el-dialog>
      <el-button @click="login" >测试登录框</el-button>
      <button @click="iframeCreate">创建iframe</button>
      <div ref="iframeBl"></div>
      <button @click="showScan">点击弹起扫码框</button>
      <button @click="$router.push('/update')">跳转到更新页</button>

      <input v-model="url">
      <button @click="openFolder">打开目录</button>
      <button @click="openPathFolder">打开path目录</button>
      <button @click="openDefault">打开默认程序</button>
      <button @click="openPathDefault">打开path默认程序</button>
      <button @click="openEXE">打开程序</button>
      <button @click="openPathEXE">打开path程序</button>
      <button @click="testSql">sql数据库测试</button>

      <button @click="testPrint">test Print</button>
    </div>
</template>
<style rel="stylesheet/scss"  lang="scss">

</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import scanner from '../utils/scanner'
  import loginModal from '../components/loginModal/'
  import scanModal from '../components/scanModal/'
  import { Shell } from 'nw.gui'
  import path from 'path'
  var gui = require('nw.gui')
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
        url: '',
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
      testPrint () {
        let arr = [{ printName: '账单',
          printTime: '06-19 13:49:39',
          content: '<% setAlign:c %><% setSize:2 %>乐稻港式餐厅（电子发票）\r\n<% setSize:1 %>============================\r\n<% setAlign:l %><% setSize:1 %><% setStyle:NORMAL %>开票商家：广州逸臣贸易有限公司\r\n发票总金额：￥155.0\r\n日期：2018-06-19\r\n<% setSize:1 %><% setStyle:NORMAL %>------------------------------------\r\n<% setAlign:c %>微信扫一扫开电子发票 \n<% qrimage:http://weixin.qq.com/q/02VTmDJbpPdLk1iTzgNrcu %> \n<% setAlign:c %>失效日期：2018-07-19 \n\r\n<% setAlign:c %>打印时间：2018-06-19\r\n地址：广州市花都区白云国际机场候机楼一楼C8111店\r\n电话：020-36067837\r\n<% setAlign:c %>请保存好本小票',
          // orderId: 3921400321082368,
          pkey: '39214003210823680',
          printMore: '',
          printMoreSeq: 0,
          printerName: '账单',
          shopType: 0,
          title: '电子发票',
          orderId: 0 }]
        console.log(arr)
        this.$store.dispatch('addPrintObj', {printList: arr})
      },
      testSql () {
        console.log(process.arch)
        var sqlite3 = require('sqlite3').verbose()
        console.log(sqlite3)
        var db = new sqlite3.Database('data.db')
        db.serialize(function () {
          db.run('CREATE TABLE lorem (info TEXT)')
          var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
          for (var i = 0; i < 10; i++) {
            stmt.run('Ipsum ' + i)
          }
          stmt.finalize()
          db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
            if (err) {
              console.log(err)
            }
            console.log(row.id + ':' + row.info)
          })
        })
      },
      openFolder () {
        Shell.showItemInFolder(this.url)
      },
      openPathFolder () {
        Shell.showItemInFolder(path.resolve(this.url))
      },
      openDefault () {
        Shell.openItem(this.url)
      },
      openPathDefault () {
        Shell.openItem(path.resolve(this.url))
      },
      openEXE () {
        Shell.openExternal(this.url)
      },
      openPathEXE () {
        Shell.openExternal(path.resolve(this.url))
      },
      async showScan () {
        let res = await scanModal({onlyScan: true})
        console.log(res)
      },
      printTest () {
        var div = document.createElement('div')
        div.setAttribute('id', 'printView')
        div.innerHTML = `
          <div style="margin:0;padding:0;">
          <h5 class="center">东一三逸臣商场（A9109）</h5>
          <p class="center">电子发票</p>
          <p>====================</p>
          <p>开票商家：广州逸臣贸易有限公司</p>
          <p>发票总金额：￥100.0</p>
          <p  class="center">微信扫一扫开电子发票</p>
          <div id="printViewImg"></div>
          <p  class="center">失效日期：2018-04-13 13:25:24</p>
          <p  class="center">打印时间：2018-04-13 13:25:24</p>
          <p>地址：广州白云国际机场东一三层（A9109）</p>
          <p>电话：020-36068983</p>
          <p class="center">请保存好本小票</p>
          </div>
`
        document.body.appendChild(div)
        var imgDiv = div.querySelector('#printViewImg')
        var img = new Image()
        img.src = 'http://www.fcz360.com/upload/wx/expQrcode/201803/invoice_3792946370659328.jpg'
        imgDiv.appendChild(img)
        img.onload = function () {
          img.onload = null
          var win = gui.Window.get()
          win.print({
            printer: '小票机net',
            autoprint: true,
            shouldPrintBackgrounds: false,
            marginsType: 1,
            headerFooterEnabled: false,
            marginsCustom: {marginBottom: 1, marginLeft: 1, marginRight: 1, marginTop: 1},
            mediaSize: {'name': 'CUSTOM', 'width_microns': 58000, 'height_microns': 215000, 'custom_display_name': 'Letter', 'is_default': true}
          })
        }
      },
      iframeCreate () {
//        gui.Window.open('http://www.baidu.com', {}, function (newWin) {
//          // do something with the newly created window
//          console.log(newWin)
//          newWin.print({autoprint: true})
//        })
        var iframe = document.createElement('iframe')
        this.$refs.iframeBl.appendChild(iframe)
        var iframedocument = iframe.contentDocument // contentWindow.document;
        iframedocument.open()
        iframedocument.write('<html><head><title></title></head><body>1234235</body></html>')
        iframedocument.close()
        var iframeWindow = iframe.contentWindow
        console.log(iframeWindow)
//        var win = gui.Window.get()
        var iframeWin = gui.Window.get(iframeWindow)
        iframeWin.print({autoprint: true, preview: false})
        console.log(iframeWin)
      },
      printerNw () {
        var nw = global.nw
        var win = nw.Window.get()
        console.log(win.getPrinters())
        console.log('bac')
      },
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
