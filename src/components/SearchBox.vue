<template>
  <div class="search-box">
    <input 
      type="text" 
      v-model="query" 
      placeholder="搜索诗词..."
      @keyup.enter="search"
    >
    <button @click="search">搜索</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data() {
    return {
      query: ''
    }
  },
  methods: {
    search() {
      this.$emit('search', this.query)
    }
  }
}
</script>

<style scoped>
.search-box {
  margin: 20px 0;
}
input {
  padding: 8px;
  width: 300px;
}
button {
  padding: 8px 15px;
  margin-left: 10px;
}
</style>