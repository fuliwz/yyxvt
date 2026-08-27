<template>
  <section class="detail-page">
    <div v-if="loading" class="detail-loading"><div class="detail-poster skeleton"></div><div class="detail-copy"><div class="line skeleton"></div><div class="line skeleton"></div><div class="line short skeleton"></div></div></div>
    <template v-else-if="item">
      <div class="detail-hero">
        <div class="detail-poster"><img :src="item.poster || fallback" :alt="item.title" @error="e=>e.target.src=fallback"></div>
        <div class="detail-copy"><div class="eyebrow">{{ item.typeName || '视频内容' }}</div><h1>{{ item.title }}</h1><div class="detail-meta"><span v-if="item.year">{{ item.year }}</span><span v-if="item.area">{{ item.area }}</span><span v-if="item.score">★ {{ item.score }}</span><span>◉ {{ item.views || 0 }}</span></div><p>{{ stripHtml(item.content) || '暂无简介' }}</p><div class="detail-tags"><span v-if="item.remarks">{{ item.remarks }}</span><span v-if="item.duration">{{ item.duration }}</span></div><button class="primary-btn" @click="goPlay">▶ 播放</button></div>
      </div>
      <div class="detail-info"><h2>内容信息</h2><p v-if="item.director"><b>导演：</b>{{ stripHtml(item.director) }}</p><p v-if="item.actor"><b>演员：</b>{{ stripHtml(item.actor) }}</p></div>
    </template>
    <div v-else class="empty">内容不存在或暂时无法获取</div>
  </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDetail } from '../api/vod'
const route=useRoute(); const router=useRouter(); const item=ref(null); const loading=ref(true)
const fallback='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'
function stripHtml(v=''){return String(v).replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').trim()}
function goPlay(){router.push(`/play/${route.params.id}`)}
onMounted(async()=>{try{item.value=await getDetail(route.params.id)}finally{loading.value=false}})
</script>
