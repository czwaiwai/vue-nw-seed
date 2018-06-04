<template>
  <el-dialog title="规格选择" @open="open" @close="close" :visible.sync="visible" width="600px">
    <div style="margin-top:-15px;">
        <ul class="attr_ul">
          <li v-if="item  && item.attr" class="attr_class">
            <div class="title">{{attr.name}}<span v-if="attr.remark">【{{attr.remark}}】</span><span class="text-danger padding-left fs12">已选{{formAttr.length}}个</span></div>
            <!--<template v-for="(sub,index) in attr.attrList" :v-key="index"  >-->
              <!--<el-radio v-show="!sub.isHide"  :disabled="!sub.isUse" v-model="attrChoose" :label="sub" border>{{sub}}</el-radio>-->
            <!--</template>-->
              <div>
                <label v-for="(item,index) in attr.attrList" :key="index"
                       :class="{disabled:!item.isUse,'attr_hide':item.isHide}" class="check_group">
                  <input type="checkbox" @change="checkAttrHandle(item)" :disabled="!item.isUse" v-model="formAttr"
                         name="check_toast" :value="item.name">
                  <div class="check_content">{{item.name}}</div>
                </label>
              </div>
          </li>
          <li v-for="item in list">
            <div class="title">{{item.name}}<span v-if="item.remark">【{{item.remark}}】</span></div>
            <ul class="attach_item_ul clearfix">
              <li v-for="subItem in item.subProList">
                <select-num v-model.number="subItem.num" :id="subItem.id" :isMulti="item.muti"
                            :singleFn="singleFn" :parent="item" :addBefore="subChange">{{subItem.name}}
                  <span v-if="subItem.cashAmt > 0" class="fs12">￥{{subItem.cashAmt}}</span>
                </select-num>
              </li>
            </ul>
          </li>
        </ul>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>
<style rel="stylesheet/scss" lang="scss">
.attr_ul {
  padding:0;
  margin:0;
  list-style: none;
  & .check_group {
    display: inline-block;
    cursor: pointer;
    & input {
      position: absolute;
      left: -9999px;
      visibility: hidden;
      &:checked + .check_content {
        background: #FFF0E8;
        color: #f96a1c;
      }
    }
    &.attr_hide {
      display: none;
    }
    &.disabled .check_content {
      opacity: 0.6;
    }
  }

  & .radio_content, .check_content {
    width:250px;
    height:40px;
    text-align: center;
    line-height:40px;
    background: #f0f0f0;
    color: #656565;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    overflow: hidden;
  }
}
.attr_ul .title {
  padding-bottom:10px;
}
.attach_item_ul {
  padding:0;
  margin:0;
  list-style:none;
}
.attach_item_ul li {
  float:left;
}

</style>
<script type="text/ecmascript-6">
  import selectNum from '../selectNum'
  import {amountFix} from '../../utils/utils'
  export default{
    props: {
      item: Object,
      attachList: Array,
      attachPro: String,
      shop: Object
    },
    data () {
      return {
        visible: false,
        list: [],
        attrChoose: '',
        formAttr: []
      }
    },
    components: {
      selectNum
    },
    computed: {
      attr () {
        if (!this.item) return {}
        console.log(this.item, 'this.item')
        let tmp
        let attrTmp
        try {
          tmp = JSON.parse(this.item.attr)
        } catch (e) {
          tmp = {}
          return tmp
        }
        if (this.shop && this.shop.proAttr) {
          try {
            attrTmp = JSON.parse(this.shop.proAttr)
          } catch (e) {
            attrTmp = []
          }
        }
        console.log('tmp', tmp, this.item.attr, this.shop.proAttr)
        let newAttr = tmp.attrList.map((name) => {
          if (attrTmp && attrTmp.length > 0) {
            let tmpItem
            for (let i = 0; i < attrTmp.length; i++) {
              if (attrTmp[i].name === name) {
                tmpItem = attrTmp[i]
                break
              }
            }
            if (tmpItem) {
              return tmpItem
            } else {
              return {name: name, isUse: true}
            }
          } else {
            return {name: name, isUse: true}
          }
        })
        tmp.attrList = newAttr
        return tmp
      }
    },
    methods: {
      singleFn (id, parent) {
        parent.subProList.forEach(item => {
          if (item.id !== id) {
            item.num = 0
          }
        })
      },
      checkAttrHandle (item) {
        if (this.attr.muti) {
          if (this.attr.maxCount && this.formAttr.length > this.attr.maxCount) {
            this.$message.warning(`${this.attr.name}最多可选择${this.attr.maxCount}个`)
            setTimeout(() => {
              let tmp = this.formAttr
              tmp.pop()
              this.formAttr = [...tmp]
            })
          }
        } else {
          if (this.formAttr.length > 1) {
            setTimeout(() => {
              this.formAttr = [item.name]
            })
          }
        }
      },
      subChooseLen (parent) {
        let tmp = 0
        parent.forEach(item => {
          tmp += item.num
        })
        console.log('统计的数量:', tmp)
        return tmp
      },
      subChange (parent) {
        if (parent.muti) {
          if (parent.maxCount && this.subChooseLen(parent.subProList) >= parent.maxCount) {
            this.$message.warning(`${parent.name}最多可选择${parent.maxCount}个`)
            return false
          }
        }
        return true
      },
      proList () {
        this.list = []
        this.attachList.forEach(ctx => {
          ctx.subProList.forEach(sub => {
            this.$set(sub, 'num', 0)
          })
          this.list.push(ctx)
        })
        return this.list
      },
      // 获取所有要提交的商品并
      justList () {
        let tmp = []
        if (this.list) {
          this.list.forEach(item => {
            Array.prototype.push.apply(tmp, item.subProList.filter(item => item.num > 0))
          })
        }
        // console.log(tmp, '----------------------------------------')
        return tmp
      },
      // 商品总价格
      newAmt (list) {
        let newAmtTotal = 0
        if (list.length > 0) {
          newAmtTotal = list.reduce((before, item) => {
            if (item.num > 0) {
              before += amountFix(item.cashAmt * item.num)
            }
            return before
          }, newAmtTotal)
        }
        console.log('newAmtTotal------------', newAmtTotal)
        return amountFix(this.item.cashAmt + newAmtTotal)
      },
      open (e) {
        this.attrChoose = ''
        this.formAttr = []
        this.list = []
        if (this.attachList && this.attachList.length > 0) {
          // this.list = [...this.attachList]
          this.proList()
        }
        // if(!params.item.attachProList && params.item.attachPro){
        //   promise=Vue.http.get('/rest/addAttachPro',{params:{restProId:options.item.id}})
        // }
        this.onOpen && this.onOpen()
      },
      errMsgFn (obj, len) {
        if (obj.muti) {
          if (obj.required) {
            if (obj.minCount && obj.minCount > len) {
              return `${obj.name}至少选择${obj.minCount}个`
            }
          }
          if (obj.maxCount && obj.maxCount < len) {
            return `${obj.name}最多选择${obj.maxCount}个`
          }
        } else {
          if (obj.required && len !== 1) {
            return `${obj.name}至少选择1个`
          }
        }
        return ''
      },
      // 提交前校验
      submitVaild () {
        let errMessage = ''
        if (this.item.attr) {
          errMessage = this.errMsgFn(this.attr, this.formAttr.length)
        }
        if (this.list && !errMessage) {
          this.list.forEach((item, index) => {
            if (item.subProList && item.subProList.length === 0) return
            if (!errMessage) {
              errMessage = this.errMsgFn(item, this.subChooseLen(item.subProList))
            }
          })
        }
        return errMessage
      },
      close (e) {
        this.onClose && this.onClose()
        this.callback(false)
      },
      confirm () {
        let hasErr = this.submitVaild()
        if (hasErr) {
          return this.$message.warning(hasErr)
        }
        this.visible = false
        console.log(this.formAttr)
        let tmpList = this.justList()
        this.callback({
          newAmt: this.newAmt(tmpList),
          list: tmpList,
          attr: this.formAttr.join(',')
        })
      }
    }
  }
</script>
