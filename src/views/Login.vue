<template>
  <div class="page ">
    <div class="login_bg_01"></div>
    <div class="row login_bg_02">
      <div class="login_block column align-self-middle">
        <h4 class="text-center padding-bottom">商家登录</h4>
        <form novalidate @submit.prevent="submitHandler">
            <div class="input-group login_input">
              <span class="input-group-label login_user_icon"></span>
              <input v-model="formObj.mobile" name="mobile" type="text" id="userName" placeholder="请输入用户名/手机号">
            </div>
            <div class="input-group login_input">
              <span class="input-group-label login_lock_icon"></span>
              <input v-model="formObj.passWd" name="passWd" id="password" type="password" placeholder="请输入登录密码">
            </div>
          <div class="text-center submit_btn_group padding">
            <button class=" login_btn button primary expanded fcz " style="color:#FFF"  type="submit">登录</button>
          </div>
        </form>
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
  /*.login_bg_02{*/
    /*background:url('../assets/img/login/bg_02.png') no-repeat  70% center;*/
  /*}*/
  .login_block {
    /*max-width:400px;*/
    width:458px;
    height:340px;
    margin:-170px auto 0 auto;
    padding:43px 65px;
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
  export default {
    data () {
      return {
        formObj: {
          mobile: '',
          passWd: ''
        }
      }
    },
    methods: {
      submitHandler () {
        this.$http.post('/ycLogin/doPCLogin', this.formObj).then(res => {
          let data = res.data
          let {UserInfo, restShop} = data.data
          //  console.log(UserInfo, '-----')
          if (!UserInfo.fnShopAssist) {
            return this.$message.error('你不是店员不能登录飞常赞')
          } else {
            this.$http.post('/ycRest/getPrintTpl').then(res => {
              let resData = res.data
              let {printTpl, orderLoopSecond} = resData.data
              this.$store.commit('setLoopTime', orderLoopSecond)
              this.$store.commit('setTpl', printTpl)
              this.$store.commit('setShopUser', UserInfo.fnShopAssist)
              this.$store.commit('setShop', restShop)
              this.$router.push('/Main/newOrder')
            })
          }
        })
      }
    },
    created () {

    }
  }
</script>
