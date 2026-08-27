<template>
  <main class="play-page">
    <div class="play-layout">
      <section class="player-column">
        <div class="player-card">
          <div class="player-topbar">
            <div class="player-status"><span></span>正在播放</div>
            <div class="player-format">HD · HLS · 10秒快进</div>
          </div>
          <div class="player-wrap">
            <div v-if="loading" class="player-loading">正在加载视频…</div>
            <video v-else ref="videoEl" class="player" playsinline controls preload="metadata"></video>
          </div>
        </div>

        <section v-if="item" class="video-info-card">
          <div class="info-header">
            <div class="title-area"><div class="eyebrow"><span></span>NOW PLAYING</div><h1 class="video-title">{{ item.title }}</h1></div>
            <button type="button" class="share-btn" @click="sharePage">分享</button>
          </div>
          <div class="video-meta">
            <span>高清在线播放</span><span v-if="item.views">{{ formatViews(item.views) }} 次播放</span><span v-if="item.typeName">{{ item.typeName }}</span><span v-if="item.updateTime">{{ item.updateTime }}</span>
          </div>
          <div v-if="item.content" class="description"><div class="description-title">视频简介</div><div class="description-text">{{ item.content }}</div></div>
        </section>
      </section>

      <aside class="side-panel">
        <div class="side-card">
          <div class="side-heading"><div><span class="side-kicker">EXPLORE</span><h2>相关推荐</h2></div><span class="recommend-count">{{ recommendations.length }}</span></div>
          <div v-if="recommendations.length" class="side-list">
            <router-link v-for="video in recommendations.slice(0,6)" :key="video.id" :to="`/play/${video.id}`" class="side-item">
              <div class="side-thumb"><img :src="video.poster || fallback" :alt="video.title" loading="lazy"><span class="side-play">▶</span></div>
              <div class="side-item-info"><strong>{{ video.title }}</strong><span>{{ formatViews(video.views) }} 次播放</span></div>
            </router-link>
          </div>
          <div v-else class="side-empty">暂无相关推荐</div>
        </div>
      </aside>
    </div>

    <section v-if="recommendations.length" class="recommend-section">
      <div class="section-bar"><div><div class="section-kicker">MORE FOR YOU</div><h2 class="section-heading">猜你喜欢</h2><div class="section-subtitle">更多同类精彩内容</div></div><span class="section-count">{{ Math.min(recommendations.length,20) }} 部</span></div>
      <div class="video-grid"><article v-for="video in recommendations.slice(0,20)" :key="video.id" class="video-card" @click="router.push(`/play/${video.id}`)"><div class="thumb"><img :src="video.poster || fallback" :alt="video.title" loading="lazy" @error="fallbackImage"><span class="badge">{{ video.updateTime || '' }}</span><span class="duration">{{ video.duration || 'HD' }}</span><div class="thumb-meta"><span>◉ {{formatViews(video.views)}}</span><span>{{video.year || ''}}</span></div></div><h3>{{video.title}}</h3><div class="stats"><span>◉ {{formatViews(video.views)}}</span><span class="score">★ {{video.score || '—'}}</span></div></article></div>
    </section>

    <div v-if="playerError" class="player-error">{{ playerError }}</div>
    <div class="source-panel" v-if="sources.length"><h2>播放线路</h2><div class="source-list"><button v-for="(source,index) in sources" :key="source.name+index" class="source" :class="{active:activeSourceIndex===index}" @click="selectSource(index)">{{source.name}}</button></div></div>
    <div class="episode-panel" v-if="activeSource"><h2>选集 <small>{{activeSource.episodes.length}} 集</small></h2><div class="episodes"><button v-for="(ep,index) in activeSource.episodes" :key="ep.label+index" :class="{active:index===activeEpisodeIndex}" @click="selectEpisode(index)">{{ep.label}}</button></div></div>
  </main>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Plyr from 'plyr'
import Hls from 'hls.js'
import 'plyr/dist/plyr.css'
import { getDetail, getRelatedVideos, parsePlaySources } from '../api/vod'
import { saveHistory } from '../utils/history'

const route=useRoute();const router=useRouter();const item=ref(null);const loading=ref(true);const playerError=ref('');const videoEl=ref(null);const player=ref(null);const hls=ref(null);const recommendations=ref([]);const activeSourceIndex=ref(0);const activeEpisodeIndex=ref(0);const fallback='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'
const sources=computed(()=>parsePlaySources(item.value));const activeSource=computed(()=>sources.value[activeSourceIndex.value]||null);const activeEpisode=computed(()=>activeSource.value?.episodes[activeEpisodeIndex.value]||null)
function formatViews(v){const n=Number(v)||0;return n>999999?`${(n/1000000).toFixed(1)}M`:n>999?`${(n/1000).toFixed(1)}K`:String(n)}
function fallbackImage(e){e.target.src=fallback}
function saveCurrent(){if(item.value&&activeEpisode.value)saveHistory(item.value,activeEpisode.value)}
function selectSource(index){activeSourceIndex.value=index;activeEpisodeIndex.value=0;playerError.value='';saveCurrent()}
function selectEpisode(index){activeEpisodeIndex.value=index;playerError.value='';saveCurrent()}
function onPlayerError(){playerError.value='当前媒体地址无法播放，请切换线路或选集'}
function destroyHls(){if(hls.value){hls.value.destroy();hls.value=null}}
async function setMedia(){await nextTick();if(!player.value||!videoEl.value||!activeEpisode.value)return;playerError.value='';destroyHls();const video=videoEl.value;const url=activeEpisode.value.url;player.value.stop();const isHls=/\.m3u8(?:$|\?)/i.test(url);if(isHls&&Hls.isSupported()){hls.value=new Hls({enableWorker:true,lowLatencyMode:false,backBufferLength:90,capLevelToPlayerSize:true,manifestLoadingMaxRetry:2,levelLoadingMaxRetry:2,fragLoadingMaxRetry:3});hls.value.on(Hls.Events.MANIFEST_PARSED,()=>player.value?.play().catch(()=>{}));hls.value.on(Hls.Events.ERROR,(_e,data)=>{if(!data?.fatal)return;if(data.type===Hls.ErrorTypes.NETWORK_ERROR)hls.value?.startLoad();else if(data.type===Hls.ErrorTypes.MEDIA_ERROR)hls.value?.recoverMediaError();else onPlayerError()});hls.value.loadSource(url);hls.value.attachMedia(video)}else if(isHls&&video.canPlayType('application/vnd.apple.mpegurl')){video.src=url;video.load();video.play().catch(()=>{})}else{player.value.source={type:'video',sources:[{src:url,type:'video/mp4'}]};player.value.play().catch(()=>{})}}
async function sharePage(){try{if(navigator.share)await navigator.share({title:item.value?.title||document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);alert('播放页链接已复制')}}catch(_){} }
async function loadData(){destroyHls();player?.value?.destroy();player.value=null;item.value=await getDetail(route.params.id).catch(()=>null);recommendations.value=item.value?await getRelatedVideos(item.value,20).catch(()=>[]):[];loading.value=false;await nextTick();if(videoEl.value){player.value=new Plyr(videoEl.value,{controls:['play-large','play','progress','current-time','mute','volume','settings','pip','fullscreen'],settings:['speed'],seekTime:10,tooltips:{controls:true,seek:true},keyboard:{focused:true,global:true},ratio:'16:9'});if(activeEpisode.value)await setMedia()}}
watch(()=>route.params.id,loadData,{immediate:true});watch(activeEpisode,async()=>{saveCurrent();await setMedia()});onMounted(()=>document.title=item.value?.title?`${item.value.title} - 在线播放`:document.title);onBeforeUnmount(()=>{destroyHls();player.value?.destroy();player.value=null})
</script>
