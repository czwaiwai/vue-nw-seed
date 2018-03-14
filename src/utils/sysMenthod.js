/**
 * Created by Administrator on 2018/3/6 0006.
 */
import {App} from 'nw.gui'
import getConfig from '../utils/getConfig'
import moment from 'moment'
import {clearLogs} from '../utils/clearLogs'
let timer
export default {
  data () {
    return {
      isShowMenu: false,
      appVersion: '',
      currentTime: ''
    }
  },
  methods: {
    exitClickHandler () {
      this.$confirm('你确定要退出系统么', '提示').then(() => {
        App.quit()
      })
    },
    logoutClickHandle () {
      console.log('-----------------------退出登录')
      this.$confirm('你确定要切换账号么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearLogs()
        this.$http.post('/doLogout').then((res) => {
          if (res.data.retCode === 0) {
            this.$store.dispatch('logoutAction').then(() => {
              this.$router.replace({name: 'Login'})
            })
          }
        })
      }).catch(() => {})
    },
    listenService () {
      let self = this
      this.printService = this.$store.getters.printService
      this.printService.setUser(this.user)
      this.printService.listen({
        start () {
          console.log('----------打印已经开始了---------------')
        },
        before (obj) {
          console.log(obj)
          if (obj.isOrder) {
            console.log('--------正在开始打印的订单Obj:', obj.id, '------------')
            console.log('--------', obj && obj.vOrderNo, '--------------')
          } else {
            console.log('--------普通打印')
          }
        },
        after (obj) {
          if (obj.isOrder) {
            try {
              if (obj.isAutoChange) {
                self.$store.commit('clearActiveOrder')
              }
              self.$store.commit('setFinshPrintOrder', obj)
//              self.$store.commit('removeOrder', obj)
              self.$store.commit('removeOrderMap', obj)
            } catch (e) {
              console.log(e)
            }
            console.log('---------------------结束打印的订单Obj:', obj.id)
            console.log('---------------------', obj && obj.vOrderNo)
          } else {
            console.log('正在进行普通打印')
          }
        },
        error (err, obj, next) {
          console.error(err, '错误：打印机的时候报错了赶紧来看看')
          console.log(obj)
          let vNo = ''
          if (obj.isOrder) {
            vNo = '订单：' + obj.vOrderNo
          }
          self.$confirm(vNo + '打印出错是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            console.log('店员点击了true' + vNo)
            next(true) // 为轮询是否就继续
          }).catch(() => {
            console.log('店员点击了false' + vNo)
            next(false)
          })
          self.$http.post('/feeback/save', {
            title: '打印回调内错误',
            content: '出现的错误：' + JSON.stringify(err) + '错误对象' + JSON.stringify(obj)
          })
        },
        //  这个对象放弃打印
        giveup (obj) {
          console.log('错误：----------这个订单被放弃了:', obj.id)
        },
        done () {
          console.log('-----------打印已经完成--------------')
        }
      })
    }
  },
  created () {
    getConfig.then((json) => {
      this.appVersion = json.version
    })
    timer = setInterval(() => {
      this.currentTime = moment().format('YYYY年MM月DD日 HH:mm:ss')
    }, 1000)
  },
  destroyed () {
    timer && clearInterval(timer)
  }
}
