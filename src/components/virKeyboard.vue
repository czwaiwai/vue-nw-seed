<template>
    <div class="vir_keyboard" >
      <div class="grid-x ">
        <div class="cell small-4">
          <button @click="keyClickHandler(1)" type="button" class="button light  expanded  margin5 ">1</button>
        </div>
        <div class="cell small-4" >
          <button @click="keyClickHandler(2)" type="button" class="button light  expanded  margin5 ">2</button>
        </div>
        <div class="cell small-4" >
          <button @click="keyClickHandler(3)" type="button" class="button light  expanded  margin5 ">3</button>
        </div>
      </div>
      <div class="grid-x ">
        <div class="cell small-4" >
          <button @click="keyClickHandler(4)" type="button" class="button light  expanded  margin5 ">4</button>
        </div>
        <div class="cell small-4">
          <button @click="keyClickHandler(5)" type="button" class="button light  expanded  margin5 ">5</button>
        </div>
        <div class="cell small-4">
          <button @click="keyClickHandler(6)" type="button" class="button light  expanded  margin5 ">6</button>
        </div>
      </div>
      <div class="grid-x ">
        <div class="cell small-4" >
          <button @click="keyClickHandler(7)" type="button" class="button light  expanded  margin5 ">7</button>
        </div>
        <div class="cell small-4" >
          <button @click="keyClickHandler(8)" type="button" class="button light  expanded  margin5 ">8</button>
        </div>
        <div class="cell small-4">
          <button @click="keyClickHandler(9)" type="button" class="button light  expanded  margin5 ">9</button>
        </div>
      </div>
      <div class="grid-x ">
        <div class="cell small-4" >
          <button @click="keyClickHandler('.')" type="button" class="button light  expanded  margin5 ">.</button>
        </div>
        <div class="cell small-4"  >
          <button @click="keyClickHandler(0)" type="button" class="button light  expanded  margin5 ">0</button>
        </div>
        <div class="cell small-4" >
          <button @click="keyClickHandler('back')" type="button" class="button light  expanded  margin5 ">退格</button>
        </div>
      </div>
      <div class=""></div>
    </div>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
.vir_keyboard{
  max-width:300px;
  background:#F0f0f0;
  & .cell{
    padding:5px;
    text-align:center;
    & .button {
      margin: 0;
      font-size:16px;
    }
  }
}
</style>
<script type="text/ecmascript-6">

  export default{
    props: {
      value: String
    },
    data () {
      return {
        msg: 'hello vue'
      }
    },
    methods: {
      keyClickHandler (val) {
        if (val === 'back') {
          this.$emit('input', this.value.slice(0, -1))
        } else {
          this.$emit('input', this.value + val)
        }
      }
    }
  }
</script>
