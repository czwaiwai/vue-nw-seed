/**
 * Created by Administrator on 2018/3/7 0007.
 */
export default {
  state: {
    bookList: [],
    xcodeList: [],
    shopInfoList: []
  },
  getters: {
    bookList: state => state.bookList,
    xcodeList: state => state.xcodeList,
    shopInfoList: state => state.shopInfoList
  },
  mutations: {
    setShopInfoList (state, list) {
      state.shopInfoList = list
    },
    setBookList (state, list) {
      state.bookList = list
    },
    setXcodeList (state, list) {
      state.xcodeList = list
    }
  }
}
