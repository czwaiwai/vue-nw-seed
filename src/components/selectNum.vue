<template>
  <a href="javascript:void(0)" class="select_num " :class="{active:value>0}">
    <!--<i v-show="value>0" v-if="isMulti" class="weui-badge">{{value}}</i>-->

    <div class="weui-flex">
      <el-badge  v-show="value>0" v-if="isMulti"  :value="value" class="item"></el-badge>
      <div @click="add" class="weui-flex__item">
        <slot></slot>
      </div>
      <div v-if="isMulti" @click="mul" v-show="value>0"  class="mulBtn"> - </div>
    </div>
  </a>
</template>
<style rel="stylesheet/scss" type="text/scss" scope="true" lang="scss">
    .weui-flex {
      display:flex;
    }
    .weui-flex__item {
      flex:1;
    }
    .select_num:hover, .select_num:focus {
      color: #656565;
    }
   .select_num{
     display:inline-block;
     width:250px;
     height:40px;
     position:relative;
     background: #f0f0f0;
     color: #656565;
     border-radius: 5px;
     margin-right: 30px;
     margin-bottom: 15px;
     font-size: 14px;
     cursor: pointer;
     & i.weui-badge{
       position:absolute;
       top:-5px;
       left:-8px;
       font-style:normal;
     }
     & .weui-flex__item {
        height:40px;
       text-align:center;
        line-height:40px;
     }
     & .mulBtn {
       width:40px;
       text-align:center;
       height:40px;
       line-height:40px;
       font-size:25px;
       background:#f0f0f0;
       border-radius:0  5px 5px 0;
     }
     &.active {
       background: #FFF0E8;
       color: #f96a1c;
     }
   }
</style>
<script>
  export default {
    props: {
      value: {
        default: 0,
        type: Number
      },
      addBefore: {
        type: Function,
        default: function () {
          return true
        }
      },
      id: '',
      singleFn: Function,
      isMulti: Boolean,
      parent: Object
    },
    methods: {
      add () {
        if (!this.isMulti) {
          return this.toggle()
        }
        let isAdd = this.addBefore(this.parent)
        if (!isAdd) return
        let num = this.value
        this.$emit('input', ++num)
      },
      toggle () {
        let num = this.value
        if (num) {
          this.$emit('input', 0)
        } else {
          this.$emit('input', 1)
        }
        this.singleFn && this.singleFn(this.id, this.parent)
      },
      mul () {
        let num = this.value
        this.$emit('input', --num)
      }
    }
  }
</script>
