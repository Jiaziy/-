<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center space-x-2">
        <i class="fas fa-book text-2xl text-gray-700"></i>
        <h1 class="text-xl font-bold tracking-wider">古韵诗语</h1>
      </div>
      <nav class="hidden md:flex space-x-6">
        <a href="#" class="font-medium hover:text-gray-500 transition-colors">首页</a>
        <a href="#" class="font-medium hover:text-gray-500 transition-colors">朝代</a>
        <a href="#" class="font-medium hover:text-gray-500 transition-colors">诗人</a>
        <a href="#" class="font-medium hover:text-gray-500 transition-colors">赏析</a>
        <a href="#" class="font-medium hover:text-gray-500 transition-colors">收藏</a>
      </nav>
      <div class="relative w-64">
        <input
          type="text"
          placeholder="搜索诗词或作者..."
          class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative h-[500px] overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-90"
        style="background-image: url('https://ai-public.mastergo.com/ai/img_res/bd892487d6637c55cdcc21429374b7ec.jpg')"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      <div class="relative container mx-auto px-8 py-24 flex flex-col justify-center h-full text-white max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          探索千年诗意<br />感受翰墨风华
        </h1>
        <p class="text-lg mb-8 max-w-2xl">
          在这里，您可以品读唐诗宋词的绝世风华，领略古代文人的情怀与智慧。每一首诗词都是历史的回响，每一段文字都承载着深厚的文化底蕴。
        </p>
        <div class="flex space-x-4">
          <button class="!rounded-button whitespace-nowrap bg-white text-gray-800 px-6 py-3 font-semibold hover:bg-gray-100 transition-colors">
            开始探索
          </button>
          <button class="!rounded-button whitespace-nowrap border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors">
            了解我们
          </button>
        </div>
      </div>
    </section>

    <!-- Dynasty Navigation -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-8">
        <h2 class="text-3xl font-bold text-center mb-12">按朝代浏览</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          <div
            v-for="(dynasty, index) in dynasties"
            :key="index"
            class="group cursor-pointer"
            @click="navigateToDynasty(dynasty.name)"
          >
            <div class="aspect-square overflow-hidden rounded-lg mb-3">
              <img
                :src="dynasty.image"
                alt=""
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="text-center font-medium group-hover:text-blue-600 transition-colors">{{ dynasty.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Author Navigation -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-8">
        <h2 class="text-3xl font-bold text-center mb-12">名家风采</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          <div
            v-for="(author, index) in authors"
            :key="index"
            class="group cursor-pointer text-center"
            @click="navigateToAuthor(author.name)"
          >
            <div class="mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                :src="author.avatar"
                alt=""
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="font-medium group-hover:text-blue-600 transition-colors">{{ author.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ author.dynasty }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Poems -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-8">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold">精选诗词</h2>
          <button class="!rounded-button whitespace-nowrap text-blue-600 border border-blue-600 px-4 py-2 hover:bg-blue-50 transition-colors">
            查看更多
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(poem, index) in featuredPoems"
            :key="index"
            class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold">{{ poem.title }}</h3>
                <button class="text-gray-400 hover:text-red-500">
                  <i class="far fa-heart"></i>
                </button>
              </div>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ poem.excerpt }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img :src="poem.authorAvatar" alt="" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm">{{ poem.author }}</span>
                </div>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ poem.dynasty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white pt-16 pb-8">
      <div class="container mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 class="text-xl font-bold mb-4">古韵诗语</h3>
            <p class="text-gray-400">
              致力于传承中华古典诗词文化，为诗词爱好者提供高质量的鉴赏与学习平台。
            </p>
          </div>
          <div>
            <h4 class="font-bold mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">首页</a></li>
              <li><a href="#" class="hover:text-white transition-colors">朝代大全</a></li>
              <li><a href="#" class="hover:text-white transition-colors">诗人名录</a></li>
              <li><a href="#" class="hover:text-white transition-colors">诗词分类</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">关于我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">项目介绍</a></li>
              <li><a href="#" class="hover:text-white transition-colors">团队成员</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
              <li><a href="#" class="hover:text-white transition-colors">版权声明</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">关注我们</h4>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <i class="fab fa-weibo"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <i class="fab fa-weixin"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
            <p class="text-gray-400 text-sm">扫码关注公众号获取最新资讯</p>
          </div>
        </div>
        <div class="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2023 古韵诗语 版权所有 | 京ICP备12345678号 | 文网文[2023]12345678号
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dynasties = ref([
  {
    name: "先秦",
    image: "https://ai-public.mastergo.com/ai/img_res/6732a6b4fb7285204c7878fc5364fcd0.jpg"
  },
  {
    name: "汉朝",
    image: "https://ai-public.mastergo.com/ai/img_res/d3f63381c12e915b075d4306a0181919.jpg"
  },
  {
    name: "魏晋",
    image: "https://ai-public.mastergo.com/ai/img_res/0bb057c4874e0e9b93f4139d3010aa8a.jpg"
  },
  {
    name: "唐朝",
    image: "https://ai-public.mastergo.com/ai/img_res/506b44a57f5da0231b608cdc06bfe185.jpg"
  },
  {
    name: "宋朝",
    image: "https://ai-public.mastergo.com/ai/img_res/285fcc5c354ee0c7425a1060cca68472.jpg"
  },
  {
    name: "明清",
    image: "https://ai-public.mastergo.com/ai/img_res/fcaa347ad7358791844eeb91ab6de56f.jpg"
  }
]);

const authors = ref([
  {
    name: "李白",
    dynasty: "唐朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/8739879f2b60076c21e6c956d7ae7c12.jpg"
  },
  {
    name: "杜甫",
    dynasty: "唐朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/e045225d07d3433b81e1fde47bfa88c5.jpg"
  },
  {
    name: "苏轼",
    dynasty: "宋朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/de5ad59e1b164fd15ccca039b7f5f55f.jpg"
  },
  {
    name: "辛弃疾",
    dynasty: "宋朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/44cc889134c891765cc9bd2b63f69608.jpg"
  },
  {
    name: "李清照",
    dynasty: "宋朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/53a824c485a461639165d9962127ea10.jpg"
  },
  {
    name: "纳兰性德",
    dynasty: "清朝",
    avatar: "https://ai-public.mastergo.com/ai/img_res/dfa183d21ca2fa336e646fdbace95267.jpg"
  }
]);

const featuredPoems = ref([
  {
    title: "静夜思",
    author: "李白",
    dynasty: "唐朝",
    excerpt: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/8739879f2b60076c21e6c956d7ae7c12.jpg"
  },
  {
    title: "春望",
    author: "杜甫",
    dynasty: "唐朝",
    excerpt: "国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/e045225d07d3433b81e1fde47bfa88c5.jpg"
  },
  {
    title: "水调歌头",
    author: "苏轼",
    dynasty: "宋朝",
    excerpt: "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/de5ad59e1b164fd15ccca039b7f5f55f.jpg"
  },
  {
    title: "青玉案·元夕",
    author: "辛弃疾",
    dynasty: "宋朝",
    excerpt: "东风夜放花千树，更吹落、星如雨。宝马雕车香满路。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/44cc889134c891765cc9bd2b63f69608.jpg"
  },
  {
    title: "声声慢",
    author: "李清照",
    dynasty: "宋朝",
    excerpt: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/53a824c485a461639165d9962127ea10.jpg"
  },
  {
    title: "木兰词",
    author: "纳兰性德",
    dynasty: "清朝",
    excerpt: "人生若只如初见，何事秋风悲画扇。等闲变却故人心，却道故人心易变。",
    authorAvatar: "https://ai-public.mastergo.com/ai/img_res/dfa183d21ca2fa336e646fdbace95267.jpg"
  }
]);

const navigateToDynasty = (name) => {
  console.log(`Navigating to dynasty: ${name}`);
};

const navigateToAuthor = (name) => {
  console.log(`Navigating to author: ${name}`);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap');

body {
  font-family: 'Noto Serif SC', serif;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

