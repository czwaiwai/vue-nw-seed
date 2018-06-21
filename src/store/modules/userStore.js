/**
 * Created by waiwai on 17-12-7.
 */
export default {
  state: {
    user: {},
    shopUser: {},
    shop: {},
    shopPrint: {},
    isLogin: false
  },
  getters: {
    user: state => state.user,
    isLogin: state => state.isLogin,
    shopUser: state => state.shopUser,
    shop: state => state.shop,
    shopPrint: state => state.shopPrint
  },
  mutations: {
    setShop (state, shop) {
      state.shop = shop
      console.log(shop.printerName, 'printerName')
      if (shop.printerName) {
        let tmp = []
        try {
          tmp = JSON.parse(shop.printerName)
        } catch (e) {
          tmp = []
        }
        state.shopPrint = tmp
      }
    },
    setUser (state, user) {
      state.user = user
      state.isLogin = true
    },
    setShopUser (state, shopUser) {
      state.shopUser = shopUser
    },
    logout (state, user = {}) {
      state.user = user
      state.shopUser = {}
      state.isLogin = false
    }
  },
  actions: {
    logoutAction ({state, commit}) {
      commit('logout')
      // commit('printClose')
    }
  }
}
