<template>
  <section class="play-page">
    <div v-if="loading" class="player-shell skeleton"></div>
    <template v-else-if="item">
      <div class="player-shell"><div class="player-placeholder"><span>▶</span><small>播放源已加载</small></div></div>
      <div class="play-head"><div><h1>{{ item.title }}</h1><p>{{ item.typeName }} <span v-if="item.year">· {{ item.year }}</span></p></div><button class="secondary-btn" @click="$router.push(`/detail/${item.id}`)">详情</button></div>
      <div class="source-panel"><h2>播放线路</h2><div class="source-list"><button class="source active">默认线路</button></div></div>
      <div class="episode-panel"><h2>选集</h2><div class="episodes"><button v-for="(ep,n) in episodes" :key="ep" :class="{active:n===0}">{{ ep }}</button></div></div>
    </template>
    <div v-else class="empty">播放器内容暂不可用</div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail } from '../api/vod'
const route=useRoute(); const item=ref(null); const loading=ref(true)
const episodes=computed(()=>{const raw=item.value?.playUrl||'';const first=raw.split('$$$')[0]||raw;const list=first.split('#').map(x=>x.split('$')[0]).filter(Boolean);return list.length?list:Array.from({length:12},(_,i)=>`第${String(i+1).padStart(2,'0')}集`)})
onMounted(async()=>{try{item.value=await getDetail(route.params.id)}finally{loading.value=false}})
</script>
