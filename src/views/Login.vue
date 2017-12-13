<template>
  <div class="page">
    <div class="row">
      <div class="login_block column align-self-middle">
        <form novalidate @submit.prevent="submitHandler">
          <div class="grid-x grid-padding-x">
            <div class="small-3 cell">
              <label for="userName" class="text-right middle">用户名</label>
            </div>
            <div class="small-9 cell">
              <input v-model="formObj.mobile" name="mobile" type="text" id="userName" placeholder="请输入用户名/手机号">
            </div>
          </div>
          <div class="grid-x grid-padding-x">
            <div class="small-3 cell">
              <label for="password" class="text-right middle"> 密码</label>
            </div>
            <div class="small-9 cell">
              <input v-model="formObj.passWd" name="passWd" id="password" type="password" placeholder="请输入登录密码">
            </div>
          </div>
          <div class="text-center submit_btn_group padding">
            <button class="button primary expanded" type="submit">登录</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" >
  .login_block {
    max-width:400px;
    margin:0 auto;
    padding:20px;
    border:1px solid #e3e3e3;
    background:#FFF;
    & .submit_btn_group{
      padding:10px 40px;
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
        this.$http.post('/doLogin', this.formObj).then(res => {
          let data = res.data
          console.log(data)
          this.$router.push('/Main')
          console.log(res)
        })
      }
    },
    created () {

    }
  }
</script>
