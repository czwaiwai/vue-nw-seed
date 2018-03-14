/**
 * Created by Administrator on 2018/3/7 0007.
 */
export default {
  state: {
    bookList: [],
    xcodeList: []
  },
  getters: {
    bookList: state => state.bookList,
    xcodeList: state => state.xcodeList
  },
  mutations: {
    setBookList (state, list) {
      state.bookList = list
    },
    setXcodeList (state, list) {
      state.xcodeList = list
    }
  }
}
