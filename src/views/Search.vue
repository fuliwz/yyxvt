<template>
  <section class="page-view">
    <div class="page-title-row"><div><h1>搜索结果</h1><p v-if="keyword">“{{ keyword }}”</p></div></div>
    <div v-if="loading" class="video-grid"><div v-for="n in 12" :key="n" class="video-card skeleton-card"><div class="thumb skeleton"></div><div class="line skeleton"></div><div class="line short skeleton"></div></div></div>
    <div v-else-if="videos.length" class="video-grid">
      <article v-for="item in videos" :key="item.id" class="video-card" @click="open(item.id)"><div class="thumb"><img :src="item.poster || fallback" :alt="item.title" loading="lazy" @error="e => e.target.src=fallback"><span class="badge">HD</span><span class="duration">{{ item.duration || item.remarks || '' }}</span><button class="play">▶</button></div><h3>{{ item.title }}</h3><div class="stats"><span>◉ {{ item.views || 0 }}</span><span class="score">★ {{ item.score || '—' }}</span></div></article>
    </div>
    <div v-else class="empty">没有找到相关内容</div>
    <div v-if="pageCount > 1" class="pagination"><button :disabled="page<=1" @click="go(page-1)">‹</button><button v-for="n in pages" :key="n" :class="{current:n===page}" @click="go(n)">{{n}}</button><button :disabled="page>=pageCount" @click="go(page+1)">›</button></div>
  </section>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchVideos } from '../api/vod'
const route=useRoute(); const router=useRouter(); const videos=ref([]); const loading=ref(false); const page=ref(Number(route.query.pg)||1); const pageCount=ref(1)
const keyword=computed(()=>String(route.query.wd||'').trim()); const fallback='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'
const pages=computed(()=>{const out=[];const start=Math.max(1,Math.min(page.value-2,pageCount.value-4));for(let i=start;i<=Math.min(pageCount.value,start+4);i++)out.push(i);return out})
async function load(){if(!keyword.value){videos.value=[];return} loading.value=true;try{const r=await searchVideos(keyword.value,page.value,18);videos.value=r.list;pageCount.value=Math.max(1,r.pageCount||1)}catch{videos.value=[]}finally{loading.value=false}}
function go(n){page.value=n;router.push({query:{...route.query,pg:n}});load()}
function open(id){if(id)router.push(`/detail/${id}`)}
watch(()=>route.query.wd,()=>{page.value=1;load()},{immediate:true})
</script>
