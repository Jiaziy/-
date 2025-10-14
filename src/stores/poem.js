import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePoemStore = defineStore('poem', () => {
  const collectedPoems = ref([])

  const addToCollection = (poem) => {
    if (!collectedPoems.value.some(p => p.id === poem.id)) {
      collectedPoems.value.push(poem)
    }
  }

  const removeFromCollection = (id) => {
    collectedPoems.value = collectedPoems.value.filter(p => p.id !== id)
  }

  const clearCollection = () => {
    collectedPoems.value = []
  }

  const isPoemCollected = (id) => {
    return collectedPoems.value.some(poem => poem.id === id)
  }

  const collectionCount = () => {
    return collectedPoems.value.length
  }

  const collectionByDynasty = () => {
    const grouped = {}
    collectedPoems.value.forEach(poem => {
      const dynasty = poem.dynasty || '未知朝代'
      if (!grouped[dynasty]) {
        grouped[dynasty] = []
      }
      grouped[dynasty].push(poem)
    })
    return grouped
  }

  return {
    collectedPoems,
    addToCollection,
    removeFromCollection,
    clearCollection,
    isPoemCollected,
    collectionCount,
    collectionByDynasty
  }
})