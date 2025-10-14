// 模拟数据API
const poemsData = [
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    lines: [
      '床前明月光',
      '疑是地上霜',
      '举头望明月',
      '低头思故乡'
    ],
    translation: '明亮的月光洒在窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。'
  },
  // 可以添加更多诗词数据...
]

// 获取诗词列表
export async function getPoems(page = 1, perPage = 10) {
  const start = (page - 1) * perPage
  const end = start + perPage
  return {
    poems: poemsData.slice(start, end),
    total: poemsData.length
  }
}

// 根据ID获取诗词详情
export async function getPoemById(id) {
  return poemsData.find(poem => poem.id === Number(id))
}

// 搜索诗词
export async function searchPoems(query) {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return poemsData.filter(poem => 
    poem.title.toLowerCase().includes(lowerQuery) ||
    poem.author.toLowerCase().includes(lowerQuery) ||
    poem.content.toLowerCase().includes(lowerQuery)
  )
}