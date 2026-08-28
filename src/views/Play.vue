<template>
  <main class="play-page">
    <div class="play-layout">
      <section class="player-column">
        <div class="player-card"><div class="player-topbar"><div class="player-status"><span></span>如遇视频加载失败请刷新页面</div><div class="player-format">HD</div></div><div class="player-wrap"><div v-if="loading" class="player-loading">正在加载视频…</div><video v-else ref="videoEl" class="player" playsinline controls preload="metadata"></video></div></div>
        <section v-if="item" class="video-info-card"><div class="info-header"><div class="title-area"><div class="eyebrow"><span></span></div><h1 class="video-title">{{item.title}}</h1></div><button type="button" class="share-btn" @click="sharePage">分享</button></div><div class="video-meta"><span>高清在线播放</span><span v-if="item.views">{{formatViews(item.views)}} 次播放</span><span v-if="item.typeName">{{item.typeName}}</span><span v-if="item.updateTime">{{item.updateTime}}</span></div><div v-if="item.content" class="description"><div class="description-title">视频简介</div><div class="description-text">{{item.content}}</div></div></section>
      </section>
      <aside class="side-panel"><div class="side-card"><div class="side-heading"><div><span class="side-kicker"></span><h2>相关推荐</h2></div><span class="recommend-count">{{recommendations.length}}</span></div><div v-if="recommendations.length" class="side-list"><router-link v-for="video in recommendations.slice(0,6)" :key="video.id" :to="`/play/${video.id}`" class="side-item"><div class="side-thumb"><img :src="video.poster || fallback" :alt="video.title" loading="lazy"><span class="side-play">▶</span></div><div class="side-item-info"><strong>{{video.title}}</strong><span>{{formatViews(video.views)}} 次播放</span></div></router-link></div><div v-else class="side-empty">暂无相关推荐</div></div></aside>
    </div>
    <div class="play-panels"><div v-if="playerError" class="player-error">{{playerError}}</div><div class="source-panel" v-if="sources.length"><h2>播放线路</h2><div class="source-list"><button v-for="(source,index) in sources" :key="source.name+index" class="source" :class="{active:activeSourceIndex===index}" @click="selectSource(index)">{{source.name}}</button></div></div><div class="episode-panel" v-if="activeSource"><h2>选集 <small>{{activeSource.episodes.length}} 集</small></h2><div class="episodes"><button v-for="(ep,index) in activeSource.episodes" :key="ep.label+index" :class="{active:index===activeEpisodeIndex}" @click="selectEpisode(index)">{{ep.label}}</button></div></div></div>
    <section v-if="recommendations.length" class="recommend-section"><div class="section-bar"><div><div class="section-kicker"></div><h2 class="section-heading">猜你喜欢</h2><div class="section-subtitle">更多同类精彩内容</div></div><span class="section-count">{{Math.min(recommendations.length,20)}} 部</span></div><div class="video-grid"><VideoCard v-for="video in recommendations.slice(0,20)" :key="video.id" :item="video" /></div></section>
    <div v-if="!sources.length && item" class="empty play-empty">该内容没有可识别的播放地址</div><div v-if="!item && !loading" class="empty">播放器内容暂不可用</div>
  </main>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail, getRelatedVideos, parsePlaySources } from '../api/vod'
import { saveHistory } from '../utils/history'
import VideoCard from '../components/VideoCard.vue'
import site from '../config/site.js'

const route=useRoute();const item=ref(null);const loading=ref(true);const playerError=ref('');const videoEl=ref(null);const player=ref(null);const hls=ref(null);const recommendations=ref([]);const activeSourceIndex=ref(0);const activeEpisodeIndex=ref(0);const fallback='/fallback.svg';let loadToken=0;let PlyrClass=null;let HlsClass=null;let playerLibrariesPromise=null
const sources=computed(()=>parsePlaySources(item.value));const activeSource=computed(()=>sources.value[activeSourceIndex.value]||null);const activeEpisode=computed(()=>activeSource.value?.episodes[activeEpisodeIndex.value]||null)
function formatViews(v){const n=Number(v)||0;return n>999999?`${(n/1000000).toFixed(1)}M`:n>999?`${(n/1000).toFixed(1)}K`:String(n)}
function saveCurrent(){if(item.value&&activeEpisode.value)saveHistory(item.value,activeEpisode.value)}
function selectSource(i){if(i<0||i>=sources.value.length)return;activeSourceIndex.value=i;activeEpisodeIndex.value=0;playerError.value=''}
function selectEpisode(i){if(!activeSource.value||i<0||i>=activeSource.value.episodes.length)return;activeEpisodeIndex.value=i;playerError.value=''}
function onPlayerError(){playerError.value='当前媒体地址无法播放，请切换线路或选集'}
function destroyHls(){if(hls.value){hls.value.destroy();hls.value=null}}
async function loadPlayerLibraries(){
  if(!playerLibrariesPromise){
    playerLibrariesPromise=Promise.all([import('plyr'),import('hls.js')]).then(([plyrModule,hlsModule])=>{
      PlyrClass=plyrModule.default||plyrModule
      HlsClass=hlsModule.default||hlsModule
      return true
    }).catch(error=>{playerLibrariesPromise=null;throw error})
  }
  return playerLibrariesPromise
}
async function setMedia(){await nextTick();if(!player.value||!videoEl.value||!activeEpisode.value)return;destroyHls();const video=videoEl.value,url=activeEpisode.value.url;playerError.value='';player.value.stop();const isHls=/\.m3u8(?:$|\?)/i.test(url);if(isHls){try{await loadPlayerLibraries()}catch{onPlayerError();return}if(!HlsClass||!PlyrClass)return;if(HlsClass.isSupported()){const instance=new HlsClass({enableWorker:true,lowLatencyMode:false,backBufferLength:60,capLevelToPlayerSize:true,manifestLoadingMaxRetry:2,levelLoadingMaxRetry:2,fragLoadingMaxRetry:3});hls.value=instance;instance.on(HlsClass.Events.MANIFEST_PARSED,()=>{if(hls.value===instance)player.value?.play().catch(()=>{})});instance.on(HlsClass.Events.ERROR,(_e,data)=>{if(hls.value!==instance||!data?.fatal)return;if(data.type===HlsClass.ErrorTypes.NETWORK_ERROR)instance.startLoad();else if(data.type===HlsClass.ErrorTypes.MEDIA_ERROR)instance.recoverMediaError();else onPlayerError()});instance.loadSource(url);instance.attachMedia(video)}else if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=url;video.load();video.play().catch(()=>{})}else onPlayerError()}else{try{await loadPlayerLibraries()}catch{onPlayerError();return}if(!PlyrClass)return;player.value.source={type:'video',sources:[{src:url,type:/\.webm(?:$|\?)/i.test(url)?'video/webm':'video/mp4'}]};player.value.play().catch(()=>{})}}
async function sharePage(){try{if(navigator.share)await navigator.share({title:item.value?.title||document.title,url:location.href});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);alert('播放页链接已复制')}}catch(_){} }
async function loadData(){const token=++loadToken;destroyHls();player.value?.destroy();player.value=null;item.value=null;recommendations.value=[];activeSourceIndex.value=0;activeEpisodeIndex.value=0;playerError.value='';loading.value=true;const id=route.params.id;const nextItem=await getDetail(id).catch(()=>null);if(token!==loadToken)return;if(!nextItem){loading.value=false;return}item.value=nextItem;recommendations.value=await getRelatedVideos(nextItem,20).catch(()=>[]);if(token!==loadToken)return;loading.value=false;await nextTick();if(token!==loadToken||!videoEl.value)return;try{await loadPlayerLibraries()}catch{playerError.value='播放器组件加载失败';return}if(token!==loadToken||!videoEl.value||!PlyrClass)return;player.value=new PlyrClass(videoEl.value,{controls:['play-large','play','progress','current-time','mute','volume','settings','pip','fullscreen'],settings:['speed'],seekTime:10,tooltips:{controls:true,seek:true},keyboard:{focused:true,global:true},ratio:'16:9'});if(activeEpisode.value)await setMedia();document.title=`${nextItem.title||'播放'} - ${site.name}`}
watch(()=>route.params.id,loadData,{immediate:true});watch(activeEpisode,async()=>{saveCurrent();await setMedia()});onBeforeUnmount(()=>{loadToken++;destroyHls();player.value?.destroy();player.value=null})
</script>
