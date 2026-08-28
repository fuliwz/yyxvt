<template>
  <section class="page-view">
    <div class="page-title-row"><div><h1>观看记录</h1><p>{{items.length?`最近 ${items.length} 条`:'记录保存在当前浏览器'}}</p></div><button v-if="items.length" class="secondary-btn history-clear" @click="clear">清空记录</button></div>
    <div v-if="items.length" class="video-grid"><article v-for="item in items" :key="item.id" class="video-card" @click="open(item)"><div class="thumb"><img :src="item.poster || fallback" :alt="item.title" loading="lazy" @error="fallbackImage"><span v-if="item.episode" class="badge">{{item.episode}}</span><span class="history-time">{{formatTime(item.updatedAt)}}</span><button class="play" aria-label="继续观看">▶</button></div><h3>{{item.title}}</h3><div class="stats"><span>{{item.typeName||'视频'}}</span><button class="remove" @click.stop="remove(item.id)">移除</button></div></article></div>
    <div v-else class="empty">暂无观看记录</div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearHistory, getHistory, removeHistory } from '../utils/history'
const router=useRouter();const items=ref(getHistory());const fallback='/fallback.svg'
function formatTime(value){const timestamp=Number(value);if(!Number.isFinite(timestamp)||timestamp<=0)return'刚刚';const diff=Math.max(0,Date.now()-timestamp);if(diff<60000)return'刚刚';if(diff<3600000)return`${Math.floor(diff/60000)}分钟前`;if(diff<86400000)return`${Math.floor(diff/3600000)}小时前`;return`${Math.floor(diff/86400000)}天前`}
function open(item){if(item?.id)router.push(`/play/${item.id}`)}function remove(id){removeHistory(id);items.value=getHistory()}function clear(){clearHistory();items.value=[]}function fallbackImage(event){event.target.src=fallback}
</script>
