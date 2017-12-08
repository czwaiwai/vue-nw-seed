<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button v-on:click="init" class="print_init" >初始化打印机</button>
    <button v-on:click="print" class="print_button">打印测试</button>
  </div>
</template>

<script>

import Vue from 'vue'
const bus = new Vue()
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    init () {
      var escpos = require('escpos')
      this.deviceIp = '192.168.2.126'
      this.device = new escpos.Network(this.deviceIp)
      this.printer = new escpos.Printer(this.device)
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
    }
  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
