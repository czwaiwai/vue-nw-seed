<template>
  <div class="page">

    <div class="page_bd">
      {{user.nickName}}
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">

</style>
<script>
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
    created () {

    }
  }
</script>
