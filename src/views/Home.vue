<template>
  <section class="home">
    <section class="section popular-section">
      <div class="section-head"><h2>流行于</h2><div class="carousel-arrows"><button @click="scrollRow(popularRow,-1)">‹</button><button @click="scrollRow(popularRow,1)">›</button></div></div>
      <div ref="popularRow" class="video-row">
        <article v-for="item in popular" :key="item.id" class="mini-card" @click="open(item.id)"><div class="thumb"><img :src="item.poster || fallback" :alt="item.title" loading="lazy" @error="fallbackImage"><span class="badge">HD</span><div class="thumb-meta"><span>◉ {{ formatViews(item.views) }}</span><span>{{ item.duration || item.remarks || '' }}</span></div></div></article>
      </div>
    </section>

    <section class="section">
      <div class="section-head tabs-head"><h2>新的视频</h2><div class="tabs"><button v-for="tab in tabs" :key="tab.key" :class="{selected:activeTab===tab.key}" @click="changeTab(tab.key)">{{tab.label}}</button></div><router-link class="see-all" to="/latest">查看全部</router-link></div>
      <div v-if="loading" class="video-grid"><div v-for="n in 18" :key="n" class="video-card skeleton-card"><div class="thumb skeleton"></div><div class="line skeleton"></div><div class="line short skeleton"></div></div></div>
      <div v-else-if="videos.length" class="video-grid">
        <article v-for="item in videos" :key="item.id" class="video-card" @click="open(item.id)"><div class="thumb"><img :src="item.poster || fallback" :alt="item.title" loading="lazy" @error="fallbackImage"><span class="badge">HD</span><span class="duration">{{item.duration || item.remarks || ''}}</span><button class="play" aria-label="打开">▶</button></div><h3>{{item.title}}</h3><div class="stats"><span>◉ {{formatViews(item.views)}}</span><span class="score">★ {{item.score || '—'}}</span></div></article>
      </div>
      <div v-else class="empty">暂无内容</div>
    </section>

    <section class="intro-panel"><h2>XTV · 示例视频门户</h2><p>采用 Vue 3 与 Cloudflare Pages Functions 构建。内容通过同源 API 代理获取，并使用前端缓存与请求去重减少重复访问。</p></section>

    <section class="section"><div class="section-head"><h2>类别</h2><router-link class="see-all" to="/categories">查看全部</router-link></div><div class="category-grid"><router-link v-for="cat in classes.slice(0,8)" :key="cat.type_id" class="category" :to="`/category/${cat.type_id}`"><span>▦</span><div><strong>{{cat.type_name}}</strong><small>浏览内容</small></div></router-link></div></section>

    <section class="section"><div class="section-head"><h2>热门标签</h2><span class="see-all">内容标签</span></div><div class="tags"><span v-for="tag in tags" :key="tag" class="tag">{{tag}}</span></div></section>

    <footer class="footer"><div>关于我们　条款　隐私　帮助　联系我们</div><div>© 2026 XTV · 示例视频网站</div></footer>
  </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getClasses, getLatestVideos, getHotVideos } from '../api/vod'
import { useRouter } from 'vue-router'
const router=useRouter(); const tabs=[{key:'latest',label:'最新'},{key:'hot',label:'热门'},{key:'popular',label:'最受欢迎'},{key:'long',label:'长的'},{key:'comments',label:'评论的'},{key:'tags',label:'在标签'}]; const activeTab=ref('latest'); const videos=ref([]); const popular=ref([]); const classes=ref([]); const loading=ref(true); const popularRow=ref(null); const fallback='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'; const tags=['最新','热门','高清','电影','电视剧','动漫','综艺','动作','喜剧','科幻','剧情','经典','推荐','高分','年度']
function fallbackImage(e){e.target.src=fallback} function open(id){if(id)router.push(`/detail/${id}`)} function scrollRow(el,d){el?.scrollBy({left:d*520,behavior:'smooth'})} function formatViews(v){const n=Number(v)||0;return n>999999?`${(n/1000000).toFixed(1)}M`:n>999?`${(n/1000).toFixed(1)}K`:String(n)}
async function load(){loading.value=true;try{const r=activeTab.value==='latest'?await getLatestVideos(1,18):await getHotVideos(1,18);videos.value=r.list;popular.value=(await getHotVideos(1,8)).list}catch{videos.value=[]}finally{loading.value=false}}
async function changeTab(key){activeTab.value=key;await load()} onMounted(async()=>{classes.value=await getClasses().catch(()=>[]);await load()})
</script>
