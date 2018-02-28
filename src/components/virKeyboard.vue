<template>
  <div class="vir_keyboard" >
    <div class="grid-x ">
      <div class="cell small-4">
        <button @click="clickHandler(1)" type="button" class="button light  expanded  margin5 ">1</button>
      </div>
      <div class="cell small-4" >
        <button @click="clickHandler(2)" type="button" class="button light  expanded  margin5 ">2</button>
      </div>
      <div class="cell small-4" >
        <button @click="clickHandler(3)" type="button" class="button light  expanded  margin5 ">3</button>
      </div>
    </div>
    <div class="grid-x ">
      <div class="cell small-4" >
        <button @click="clickHandler(4)" type="button" class="button light  expanded  margin5 ">4</button>
      </div>
      <div class="cell small-4">
        <button @click="clickHandler(5)" type="button" class="button light  expanded  margin5 ">5</button>
      </div>
      <div class="cell small-4">
        <button @click="clickHandler(6)" type="button" class="button light  expanded  margin5 ">6</button>
      </div>
    </div>
    <div class="grid-x ">
      <div class="cell small-4" >
        <button @click="clickHandler(7)" type="button" class="button light  expanded  margin5 ">7</button>
      </div>
      <div class="cell small-4" >
        <button @click="clickHandler(8)" type="button" class="button light  expanded  margin5 ">8</button>
      </div>
      <div class="cell small-4">
        <button @click="clickHandler(9)" type="button" class="button light  expanded  margin5 ">9</button>
      </div>
    </div>
    <div class="grid-x ">
      <div class="cell small-4" >
        <button @click="clickHandler('.')" type="button" class="button light  expanded  margin5 ">.</button>
      </div>
      <div class="cell small-4"  >
        <button @click="clickHandler(0)" type="button" class="button light  expanded  margin5 ">0</button>
      </div>
      <div class="cell small-4" >
        <button @click="clickHandler('back')" type="button" class="button light  expanded  margin5 ">退格</button>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
.vir_keyboard{
  max-width:300px;
  /*background:#F0f0f0;*/
  & .cell{
    padding:5px;
    text-align:center;
    & .button {
      margin: 0;
      font-size:16px;
      background:#F0f0f0;
    }
  }
}
</style>
<script type="text/ecmascript-6">
  export default{
    props: {
      input: HTMLInputElement,
      value: String,
      mode: {
        type: String,
        default: 'focus' // focus bind
      }
    },
    methods: {
      clickHandler (val) {
        if (this.mode === 'focus') {
          this.focusKeyClickHandler(val)
        }
        if (this.mode === 'bind') {
          this.bindKeyClickHandler(val)
        }
      },
      focusKeyClickHandler (val) {
        console.log(this.input)
        if (this.input) {
          let value = this.input.value
          if (val === 'back') {
            this.input.value = value.slice(0, -1)
          } else {
            this.input.value = value + val
          }
          this.input.dispatchEvent(new Event('input', { bubbles: true }))
        }
      },
      bindKeyClickHandler (val) {
//        console.dir(this.input, '----')
        if (this.input.selectionStart !== this.input.selectionEnd) {
          if (val === 'back') {
            this.$emit('input', this.value.slice(0, this.input.selectionStart) + this.value.slice(this.input.selectionEnd))
          } else {
            this.$emit('input', this.value.slice(0, this.input.selectionStart) + val + this.value.slice(this.input.selectionEnd))
          }
        } else {
          if (val === 'back') {
            this.$emit('input', this.value.slice(0, -1))
          } else {
            this.$emit('input', this.value + val)
          }
        }
      }
    }
  }
</script>
