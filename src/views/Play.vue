<template>
  <section class="play-page">
    <div v-if="loading" class="player-shell skeleton"></div>
    <template v-else-if="item">
      <div class="player-shell plyr-shell"><video ref="videoEl" class="media-player" playsinline controls preload="metadata" @error="onPlayerError"></video></div>
      <div v-if="playerError" class="player-error">{{ playerError }}</div>
      <div class="play-head"><div><h1>{{ item.title }}</h1><p>{{ item.typeName || '视频内容' }} <span v-if="item.year">· {{ item.year }}</span><span v-if="item.updateTime"> · {{ item.updateTime }}</span></p></div><button class="secondary-btn" @click="router.push(`/detail/${item.id}`)">详情</button></div>
      <div class="source-panel" v-if="sources.length"><h2>播放线路</h2><div class="source-list"><button v-for="(source,index) in sources" :key="source.name+index" class="source" :class="{active:activeSourceIndex===index}" @click="selectSource(index)">{{source.name}}</button></div></div>
      <div class="episode-panel" v-if="activeSource"><h2>选集 <small>{{activeSource.episodes.length}} 集</small></h2><div class="episodes"><button v-for="(ep,index) in activeSource.episodes" :key="ep.label+index" :class="{active:index===activeEpisodeIndex}" @click="selectEpisode(index)">{{ep.label}}</button></div></div>
      <section class="related-block"><div class="related-header"><div><h2>相关推荐</h2><p>根据当前内容为你推荐</p></div><router-link v-if="item.typeId" :to="`/category/${item.typeId}`">查看更多 →</router-link></div><div v-if="recommendations.length" class="recommend-grid"><article v-for="video in recommendations" :key="video.id" class="video-card" @click="router.push(`/play/${video.id}`)"><div class="thumb"><img :src="video.poster || fallback" :alt="video.title" loading="lazy" @error="fallbackImage"><span class="badge">{{video.updateTime || ''}}</span><span class="duration">{{video.duration || 'HD'}}</span><div class="thumb-meta"><span>◉ {{formatViews(video.views)}}</span><span>{{video.year || ''}}</span></div><button class="play" aria-label="播放">▶</button></div><h3>{{video.title}}</h3><div class="stats"><span>◉ {{formatViews(video.views)}}</span><span class="score">★ {{video.score || '—'}}</span></div></article></div><div v-else class="related-empty">暂无相关推荐</div></section>
      <div v-if="!sources.length" class="empty play-empty">该内容没有可识别的播放地址</div>
    </template>
    <div v-else class="empty">播放器内容暂不可用</div>
  </section>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Plyr from 'plyr'
import Hls from 'hls.js'
import 'plyr/dist/plyr.css'
import { getDetail, getRelatedVideos, parsePlaySources } from '../api/vod'
import { saveHistory } from '../utils/history'
const route=useRoute();const router=useRouter();const item=ref(null);const loading=ref(true);const activeSourceIndex=ref(0);const activeEpisodeIndex=ref(0);const playerError=ref('');const videoEl=ref(null);const player=ref(null);const hls=ref(null);const recommendations=ref([]);const fallback='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'
const sources=computed(()=>parsePlaySources(item.value));const activeSource=computed(()=>sources.value[activeSourceIndex.value]||null);const activeEpisode=computed(()=>activeSource.value?.episodes[activeEpisodeIndex.value]||null)
function formatViews(v){const n=Number(v)||0;return n>999999?`${(n/1000000).toFixed(1)}M`:n>999?`${(n/1000).toFixed(1)}K`:String(n)}function fallbackImage(e){e.target.src=fallback}function saveCurrent(){if(item.value&&activeEpisode.value)saveHistory(item.value,activeEpisode.value)}
function selectSource(index){activeSourceIndex.value=index;activeEpisodeIndex.value=0;playerError.value='';saveCurrent()}function selectEpisode(index){activeEpisodeIndex.value=index;playerError.value='';saveCurrent()}function onPlayerError(){playerError.value='当前媒体地址无法播放，请切换线路或选集'}
function destroyHls(){if(hls.value){hls.value.destroy();hls.value=null}}
async function setMedia(){await nextTick();if(!player.value||!videoEl.value||!activeEpisode.value)return;playerError.value='';destroyHls();const video=videoEl.value;const url=activeEpisode.value.url;const isHls=/\.m3u8(?:$|\?)/i.test(url);player.value.stop();if(isHls&&Hls.isSupported()){hls.value=new Hls({enableWorker:true,lowLatencyMode:false,backBufferLength:90,capLevelToPlayerSize:true,manifestLoadingMaxRetry:2,levelLoadingMaxRetry:2,fragLoadingMaxRetry:3});hls.value.on(Hls.Events.ERROR,(_event,data)=>{if(data?.fatal){if(data.type===Hls.ErrorTypes.NETWORK_ERROR)hls.value?.startLoad();else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)hls.value?.recoverMediaError();else onPlayerError()}});hls.value.loadSource(url);hls.value.attachMedia(video);hls.value.once(Hls.Events.MANIFEST_PARSED,()=>{player.value?.play().catch(()=>{})})}else if(isHls&&video.canPlayType('application/vnd.apple.mpegurl')){video.src=url;video.load();video.play().catch(()=>{})}else{player.value.source={type:'video',sources:[{src:url,type:'video/mp4'}]};player.value.play().catch(()=>{})}}
watch(activeEpisode,async()=>{saveCurrent();await setMedia()})
async function loadRecommendations(){recommendations.value=await getRelatedVideos(item.value,12).catch(()=>[])}
onMounted(async()=>{try{item.value=await getDetail(route.params.id);await nextTick();if(videoEl.value){player.value=new Plyr(videoEl.value,{controls:['play-large','play','progress','current-time','mute','volume','settings','pip','fullscreen'],settings:['speed'],tooltips:{controls:true},keyboard:{focused:true,global:true},ratio:'16:9'});await loadRecommendations();if(activeEpisode.value)await setMedia()}}finally{loading.value=false}})
onBeforeUnmount(()=>{destroyHls();player.value?.destroy();player.value=null})
</script>
