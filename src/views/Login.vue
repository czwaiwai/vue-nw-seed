<template>
  <div class="page ">
    <div class="login_bg_01"></div>
    <div class="row ">
      <div class="login_bg_02" style="width: 855px;height: 470px;margin: 0px auto;">
        <div class="login_block column align-self-middle">
          <h4 class="text-center padding-bottom">商家登录</h4>
          <form novalidate @submit.prevent="submitHandler">
            <div class="grid-x">
              <div class="cell small-6">
                <div class="input-group login_input">
                  <span class="input-group-label login_user_icon"></span>
                  <input @focus="inputFocus" v-model="formObj.mobile" name="mobile" type="text" id="userName" placeholder="请输入用户名/手机号">
                </div>
                <div class="input-group login_input">
                  <span class="input-group-label login_lock_icon"></span>
                  <input @focus="inputFocus"  v-model="formObj.passWd" name="passWd" id="password" type="password" placeholder="请输入登录密码">
                </div>
                <div class="text-center submit_btn_group padding">
                  <button class="login_btn button primary expanded fcz " :disabled="isLoading" style="color:#FFF"  type="submit">
                    <span v-show="isLoading">正在</span>登录<span class="dotting" v-show="isLoading"></span>
                  </button>
                </div>
              </div>
              <div class="cell small-6 text-right">
                <vir-keyboard :input="input" style="width:250px;margin-top:-5px;display:inline-block" ></vir-keyboard>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" type="text/scss" >
  .page{
    height:100%;
  }
  .login_bg_01{
    height:287px;
    padding-top:110px;
    background:#FC862F url('../assets/img/login/bg_01.png') no-repeat top center;
    background-size:982px 287px;
  }
  .login_bg_02{
    background:url('../assets/img/login/bg_02.png') no-repeat  ;
    background-position: 125px 0px;
  }
  .login_block {
    /*max-width:400px;*/
    box-shadow: 0px 3px 10px rgba(51, 51, 51, 0.14);
    width:610px;
    height:340px;
    margin:-170px auto 0 auto;
    padding:43px 45px;
    border-radius:5px;
    border:1px solid #e3e3e3;
    background:#FFF;
    & .submit_btn_group{
      padding:10px 40px;
    }
    & .login_btn{
      height:56px;
      border-radius:5px;
      font-size:20px;
    }
  }
  .login_input{
    border:2px solid #989898;
    height: 50px;
    border-radius:5px;
    & .input-group-label {
      width:50px;
      border:0;
    }
    & .login_user_icon{
      background:url(../assets/img/login/user_icon.png) no-repeat center
    }
    & .login_lock_icon{
      background:url(../assets/img/login/lock_icon.png) no-repeat center
    }
    & input,input:hover,input:focus{
      border:none;
      box-shadow: none;
      height:45px;
    }
  }

</style>
<script>
//  import virKeyboard from '@/components/virKeyboard'
  import getConfig from '../utils/getConfig'
  import {clearLogs} from '../utils/clearLogs'
  import {clearApplicationFile} from '../utils/checkAndFilePath'
  import {setConf} from '../utils/storeConfig'
  var {htmlSet} = require('../utils/htmlPrinter')
  export default {
    data () {
      return {
        isLoading: false,
        appVersion: '',
        input: null,
        appJson: {},
        formObj: {
          mobile: '',
          passWd: ''
        }
      }
    },
    computed: {
    },
    methods: {
      inputFocus (e) {
        this.input = e.target
      },
      submitValider () {
        var valids = {
          mobile: /^1\d{10}$/,
          passWd: /\w{4,}/
        }
        var validsRule = {
          mobile: '请输入正确的手机号',
          passWd: '请输入有效的密码'
        }
        for (let key in valids) {
          if (!valids[key].test(this.formObj[key])) {
            return validsRule[key]
          }
          continue
        }
      },
      submitHandler () {
        let validErr = this.submitValider()
        if (validErr) {
          return this.$message({message: validErr, type: 'error'})
        }

        this.isLoading = true
        this.$http.post('/ycLogin/doPCLogin', Object.assign({remark: '版本号：' + this.appVersion}, this.formObj)).then(res => {
          let data = res.data
          let {UserInfo, restShop, retailShop, bookShop, fczTn, belongShopType} = data.data
          //  console.log(UserInfo, '-----')
          this.$store.commit('setToken', fczTn)
          if (!UserInfo.fnShopAssist) {
            return this.$message.error('你不是店员不能登录飞常赞')
          } else {
            this.$http.post('/ycRest/getPrintTpl').then(res => {
              this.isLoading = false
              let resData = res.data
              let {printTpl, orderLoopSecond, bookList, xcodeList, shopInfo, htmlPrint, shopInfoList} = resData.data
              this.$store.commit('setLoopTime', orderLoopSecond)
              this.$store.commit('setTpl', printTpl)
              this.$store.commit('setShopUser', UserInfo.fnShopAssist)
              if (shopInfo) {
                if (shopInfo.restName) {
                  shopInfo.name = shopInfo.restName
                  this.$set(shopInfo, 'deskNoArr', restShop.fnAttach)
                  // shopInfo.deskNoArr = restShop.fnAttach
                }
                // shopInfo.printType = 2 // 测试用
                shopInfo.belongShopType = belongShopType
                console.log('当前店铺的打印模式: ', shopInfo.printType)
                this.$store.commit('setShop', shopInfo)
                clearLogs(shopInfo.clientLogDays)
                if (this.appJson.version) {
                  clearApplicationFile(this.appJson.name + '-' + this.appJson.version + '.exe')
                }
                setConf('shopId', shopInfo.id)
              } else {
                if (restShop) {
                  this.$store.commit('setShop', restShop)
                }
                if (retailShop) {
                  this.$store.commit('setShop', retailShop)
                }
                if (bookShop) {
                  this.$store.commit('setShop', bookShop)
                }
              }
              if (htmlPrint) {
                console.log('设置html打印模板', 'htmlSet')
                htmlSet.set(htmlPrint)
              }
              this.$store.commit('setShopInfoList', shopInfoList)
              if (bookList) {
                this.$store.commit('setBookList', bookList)
              }
              if (xcodeList) {
                this.$store.commit('setXcodeList', xcodeList)
              }
              console.log('---------------用户登录成功--------------------')
              if (process.env.NODE_ENV === 'development') {
//                this.$router.push('/mainCus/buffetMode')
//                this.$router.push('/mainMall/assistantOpLog')
//                this.$router.push('/mainBook/bookAssistantOpLogType1')
//                this.$router.push('/Main/newOrder')
//                this.$router.push('/index/main/newOrder')
                console.log(belongShopType, '--belongShopType---')

                switch (belongShopType) {
                  case 11: this.$router.push('/index/main/newOrder'); break
                  case 12: this.$router.push('/index/mainCus/buffetMode'); break
                  case 21: this.$router.push('/index/mainBook/bookAssistantOpLogType1'); break
                  case 31: if (this.$store.getters.shop.autoBuy === 1) {
                    this.$router.push('/index/freeGo/freeNewOrder')
                  } else {
                    this.$router.push('/index/mainMall/assistantOpLog')
                  };break
                  default: this.$message.error('没有分配权限登录')
                }
              } else {
                console.log('店铺进入的类别', belongShopType)
                switch (belongShopType) {
                  case 11: this.$router.push('/index/main/newOrder'); break
                  case 12: this.$router.push('/index/mainCus/buffetMode'); break
                  case 21: this.$router.push('/index/mainBook/bookAssistantOpLogType1'); break
                  case 31: if (this.$store.getters.shop.autoBuy === 1) {
                    this.$router.push('/index/freeGo/freeNewOrder')
                  } else {
                    this.$router.push('/index/mainMall/assistantOpLog')
                  };break
                  default: this.$message.error('没有分配权限登录')
                }
                // switch (belongShopType) {
                //   case 11: this.$router.push('/Main/newOrder'); break // 餐饮店
                //   case 12: this.$router.push('/mainCus/buffetMode'); break  // 自选店
                //   case 21: this.$router.push('/mainBook/bookAssistantOpLogType1'); break // 书店
                //   case 31: this.$router.push('/mainMall/assistantOpLog'); break // 线下商店
                //   default: this.$message.error('没有分配权限登录')
                // }
              }
            }).catch((e) => {
              console.error(e)
              this.isLoading = false
            })
          }
        }).catch((e) => {
          console.error(e)
          this.isLoading = false
        })
      }
    },
    created () {
      getConfig.then((json) => {
        this.appJson = json
        this.appVersion = json.version
        console.log('获取的软件信息', JSON.stringify(json))
        console.log('当前版本号：' + json.version)
      })
    }
  }
</script>
