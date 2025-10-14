import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collectedPoems: [] // 收藏的诗词
  },
  mutations: {
    addToCollection(state, poem) {
      // 避免重复添加
      if (!state.collectedPoems.some(p => p.id === poem.id)) {
        state.collectedPoems.push(poem)
      }
    },
    removeFromCollection(state, id) {
      state.collectedPoems = state.collectedPoems.filter(p => p.id !== id)
    },
    clearCollection(state) {
      state.collectedPoems = []
    }
  },
  actions: {
    addPoemToCollection({ commit }, poem) {
      commit('addToCollection', poem)
    },
    removePoemFromCollection({ commit }, id) {
      commit('removeFromCollection', id)
    },
    clearAllCollections({ commit }) {
      commit('clearCollection')
    }
  },
  getters: {
    isPoemCollected: (state) => (id) => {
      return state.collectedPoems.some(poem => poem.id === id)
    },
    collectionCount: (state) => {
      return state.collectedPoems.length
    },
    collectionByDynasty: (state) => {
      const grouped = {}
      state.collectedPoems.forEach(poem => {
        const dynasty = poem.dynasty || '未知朝代'
        if (!grouped[dynasty]) {
          grouped[dynasty] = []
        }
        grouped[dynasty].push(poem)
      })
      return grouped
    }
  },
  modules: {
  }
})