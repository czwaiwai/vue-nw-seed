/**
 * Created by Administrator on 2018/3/5 0005.
 */
import qs from 'qs'
import cDownload from './chromeDownload'
export default {
  data () {
    return {
      orderForm: {
        page: 1,
        pageSize: 10
      },
      url: '',
      exportLoading: false,
      list: [],
      totalPage: 0,
      isLoading: false,
      totalRecord: 0
    }
  },
  components: {
  },
  methods: {
    // 递增排序
    increaseIndex (index) {
      return (index + 1) + (this.orderForm.page - 1) * 10
    },
    exportExcel (url, obj, method) {
      let params = this.orderForm
      if (typeof obj === 'object') {
        params = Object.assign({}, this.orderForm, obj)
      }
      this.exportLoading = true
      cDownload.call(this, url, qs.stringify(params), method, () => {
        this.exportLoading = false
      })
    },
    pageInit () {
      this.list = []
      this.totalPage = 0
      this.isLoading = false
      this.orderForm.page = 1
    },
    setFormAttr (obj) {
      this.orderForm = Object.assign({}, obj)
      console.log(this.orderForm, 'setFormAttr')
    },
    onClearForm (formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
      this.pageInit()
      this.getPageData()
    },
    onSubmit () {
      this.pageInit()
      this.getPageData()
    },
    currentChangeHandler (val) {
      this.orderForm.page = val
      this.getPageData()
    },
    setParams () {},
    getPageData () {
      this.isLoading = true
      let form = this.orderForm
      if (form.date && Array.isArray(form.date)) {
        console.log(form.date, 'date')
        form.buildStartDate = form.date[0]
        form.buildEndDate = form.date[1]
      } else {
        form.buildStartDate ? form.buildStartDate = '' : ''
        form.buildEndDate ? form.buildEndDate = '' : ''
      }
      this.setParams && this.setParams(this.orderForm)
      return this.$http.post(this.url, this.orderForm).then(res => {
        this.isLoading = false
        let resData = res.data
        let {totalPage, totalRecord} = resData.data
        this.totalPage = totalPage
        this.totalRecord = totalRecord
        this.pageProcess && this.pageProcess(resData.data)
      })
    },
    pageProcess () {},
    activatedBefore () {}
  },
  activated () {
    this.activatedBefore()
    if (this.url) {
      this.pageInit()
      this.getPageData()
    }
  }
}
