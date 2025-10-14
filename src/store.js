import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collectedPoems: [] // 收藏的诗词
  },
  mutations: {
    addToCollection(state, poem) {
      state.collectedPoems.push(poem)
    },
    removeFromCollection(state, id) {
      state.collectedPoems = state.collectedPoems.filter(p => p.id !== id)
    }
  },
  actions: {
  },
  modules: {
  }
})