/**
 * Created by waiwai on 17-12-7.
 */
export default {
  state: {
    config: null
  },
  getters: {
    getConfig: state => state.config
  },
  actions: {},
  mutations: {
    setConfig (state, config) {
      state.config = config
    }
  }
}
