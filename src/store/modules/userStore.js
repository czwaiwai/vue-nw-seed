/**
 * Created by waiwai on 17-12-7.
 */
export default {
  state: {
    user: {},
    isLogin: false
  },
  getters: {
    user: state => state.user,
    isLogin: state => state.isLogin
  },
  actions: {},
  mutations: {
    setUser (state, user) {
      state.user = user
      state.isLogin = true
    },
    logout (state, user = {}) {
      state.user = user
      state.isLogin = false
    }
  }
}
