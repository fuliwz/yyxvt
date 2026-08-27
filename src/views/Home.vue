<template>
  <section class="home">
    <section class="section popular-section">
      <div class="section-head"><h2>流行于</h2><div class="carousel-arrows"><button @click="scrollRow(popularRow, -1)">‹</button><button @click="scrollRow(popularRow, 1)">›</button></div></div>
      <div ref="popularRow" class="video-row">
        <article v-for="item in popular" :key="item.id" class="mini-card">
          <div class="thumb"><img :src="item.poster" :alt="item.title" loading="lazy" @error="onImageError"><span class="badge">HD</span><div class="thumb-meta"><span>◉ {{ item.views }}</span><span>{{ item.duration }}</span></div></div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head tabs-head"><h2>新的视频</h2><div class="tabs"><button v-for="tab in tabs" :key="tab" :class="{ selected: activeTab === tab }" @click="changeTab(tab)">{{ tab }}</button></div><button class="see-all">查看全部</button></div>
      <div class="video-grid">
        <article v-for="item in currentVideos" :key="item.id" class="video-card">
          <div class="thumb"><img :src="item.poster" :alt="item.title" loading="lazy" @error="onImageError"><span class="badge">HD</span><span class="duration">{{ item.duration }}</span><button class="play" aria-label="播放">▶</button></div>
          <h3>{{ item.title }}</h3>
          <div class="stats"><span>◉ {{ item.views }}</span><span class="score">★ {{ item.score }}</span></div>
        </article>
      </div>
      <div class="pagination"><button class="current">1</button><button>2</button><button>3</button><button>4</button><button>5</button><span>…</span><button>100</button><button class="next">下一页 ›</button></div>
    </section>

    <section class="intro-panel"><h2>示例视频门户</h2><p>高密度、响应式的视频门户首页。前端数据层预留 Apple CMS Provide API 接口，通过同源代理请求，便于缓存、去重与后续扩展。</p></section>

    <section class="section"><div class="section-head"><h2>热门内容</h2><button class="see-all">查看全部</button></div><div ref="modelRow" class="model-row"><div v-for="model in models" :key="model.name" class="model"><div class="avatar"><img :src="model.image" :alt="model.name" loading="lazy" @error="onImageError"></div><strong>{{ model.name }}</strong><span>{{ model.count }} 个视频</span></div></div></section>

    <section class="section"><div class="section-head"><h2>类别</h2><button class="see-all">查看全部</button></div><div class="category-grid"><div v-for="cat in categories" :key="cat.name" class="category"><span>{{ cat.icon }}</span><div><strong>{{ cat.name }}</strong><small>{{ cat.count }} 个视频</small></div></div></div></section>

    <section class="section"><div class="section-head"><h2>热门标签</h2><button class="see-all">查看全部</button></div><div class="tags"><span v-for="tag in tags" :key="tag.name" class="tag">{{ tag.name }} <em>{{ tag.count }}</em></span></div></section>

    <section class="section"><div class="section-head"><h2>网站</h2><button class="see-all">查看全部</button></div><div class="sites"><div v-for="site in sites" :key="site.name" class="site"><div class="site-logo" :class="site.class">{{ site.logo }}</div><strong>{{ site.name }}</strong><span>1,234 个视频</span></div></div></section>

    <footer class="footer"><div>关于我们　条款　隐私　DMCA　帮助　联系我们</div><div>© 2026 XTV · 示例视频网站</div></footer>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getLatestVideos, getHotVideos } from '../api/vod'

const tabs = ['最新', '热门', '最受欢迎', '长的', '评论的', '在标签']
const activeTab = ref('最新')
const latest = ref([])
const hot = ref([])
const popularRow = ref(null)
const modelRow = ref(null)

const posterFallbacks = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=78'
]
const sample = Array.from({ length: 18 }, (_, i) => ({ id: `sample-${i + 1}`, title: `示例视频标题 ${String(i + 1).padStart(3, '0')}`, poster: posterFallbacks[i % posterFallbacks.length], views: `${(9.3 - i * .31).toFixed(1)}K`, duration: `${12 + (i % 7)}:${String(12 + i).padStart(2, '0')}`, score: `${98 - (i % 7)}%` }))
const popular = sample.slice(0, 5)
const models = sample.slice(0, 10).map((x, i) => ({ name: `示例内容${i + 1}`, count: 1234 - i * 101, image: posterFallbacks[(i + 2) % posterFallbacks.length] }))
const categories = [['⌁', '动作', 1234], ['☻', '喜剧', 987], ['♥', '爱情', 856], ['🚀', '科幻', 743], ['☠', '恐怖', 632], ['▣', '剧情', 521], ['▤', '纪录片', 422], ['♧', '动画', 221]].map(([icon, name, count]) => ({ icon, name, count }))
const tags = Array.from({ length: 20 }, (_, i) => ({ name: `示例标签${i + 1}`, count: (12345 - i * 654).toLocaleString() }))
const sites = ['XTV', 'ABC', '123', '▶', '★', 'HD', 'VIP', 'HOT', 'NEW'].map((logo, i) => ({ logo, name: `示例网站名称${i + 1}`, class: i === 0 ? 'primary' : '' }))

const currentVideos = computed(() => activeTab.value === '热门' || activeTab.value === '最受欢迎' ? (hot.value.length ? hot.value : sample) : (latest.value.length ? latest.value : sample))

function scrollRow (el, dir) { el?.scrollBy({ left: dir * 520, behavior: 'smooth' }) }
function changeTab (tab) { activeTab.value = tab }
function onImageError (event) { event.target.src = posterFallbacks[Math.floor(Math.random() * posterFallbacks.length)] }
function normalize (list = []) { return list.map((v, i) => ({ ...sample[i % sample.length], id: v.vod_id || `vod-${i}`, title: v.vod_name || sample[i % sample.length].title, poster: v.vod_pic || sample[i % sample.length].poster })) }

onMounted(async () => {
  const tasks = [
    getLatestVideos(1, 18).then(res => { const list = res?.data?.list || res?.data?.data?.list || []; latest.value = normalize(Array.isArray(list) ? list : []) }).catch(() => {}),
    getHotVideos(1, 18).then(res => { const list = res?.data?.list || res?.data?.data?.list || []; hot.value = normalize(Array.isArray(list) ? list : []) }).catch(() => {})
  ]
  await Promise.all(tasks)
})
</script>
