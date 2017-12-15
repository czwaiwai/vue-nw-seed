/**
 * Created by waiwai on 17-12-7.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import userStore from './modules/userStore'
import configStore from './modules/configStore'
import orderStore from './modules/orderStore'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    userStore,
    configStore,
    orderStore
  }
})
