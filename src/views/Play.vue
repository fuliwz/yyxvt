<template>
  <section class="play-page">
    <div v-if="loading" class="player-shell skeleton"></div>
    <template v-else-if="item">
      <div class="player-shell">
        <video v-if="isDirectMedia" class="media-player" :src="activeEpisode?.url" controls playsinline preload="metadata" @error="playerError = '当前地址不是浏览器可直接播放的媒体文件'" />
        <iframe v-else-if="activeEpisode" class="media-player" :src="activeEpisode.url" title="播放器" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="no-referrer" />
        <div v-else class="player-placeholder"><span>▶</span><small>请选择播放线路和选集</small></div>
      </div>

      <div v-if="playerError" class="player-error">{{ playerError }}</div>

      <div class="play-head">
        <div><h1>{{ item.title }}</h1><p>{{ item.typeName || '视频内容' }} <span v-if="item.year">· {{ item.year }}</span></p></div>
        <button class="secondary-btn" @click="$router.push(`/detail/${item.id}`)">详情</button>
      </div>

      <div class="source-panel" v-if="sources.length">
        <h2>播放线路</h2>
        <div class="source-list">
          <button v-for="(source, index) in sources" :key="source.name + index" class="source" :class="{active: activeSourceIndex === index}" @click="selectSource(index)">{{ source.name }}</button>
        </div>
      </div>

      <div class="episode-panel" v-if="activeSource">
        <h2>选集 <small>{{ activeSource.episodes.length }} 集</small></h2>
        <div class="episodes">
          <button v-for="(ep, index) in activeSource.episodes" :key="ep.label + index" :class="{active:index === activeEpisodeIndex}" @click="selectEpisode(index)">{{ ep.label }}</button>
        </div>
      </div>

      <div v-if="!sources.length" class="empty play-empty">该内容没有可识别的播放地址</div>
    </template>
    <div v-else class="empty">播放器内容暂不可用</div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail, parsePlaySources } from '../api/vod'
import { saveHistory } from '../utils/history'

const route = useRoute()
const item = ref(null)
const loading = ref(true)
const activeSourceIndex = ref(0)
const activeEpisodeIndex = ref(0)
const playerError = ref('')

const sources = computed(() => parsePlaySources(item.value))
const activeSource = computed(() => sources.value[activeSourceIndex.value] || null)
const activeEpisode = computed(() => activeSource.value?.episodes[activeEpisodeIndex.value] || null)
const isDirectMedia = computed(() => /\.(mp4|webm|ogg|m3u8)(?:\?|$)/i.test(activeEpisode.value?.url || ''))

function saveCurrent() {
  if (item.value && activeEpisode.value) saveHistory(item.value, activeEpisode.value)
}
function selectSource(index) {
  activeSourceIndex.value = index
  activeEpisodeIndex.value = 0
  playerError.value = ''
  saveCurrent()
}
function selectEpisode(index) {
  activeEpisodeIndex.value = index
  playerError.value = ''
  saveCurrent()
}

watch(activeEpisode, saveCurrent)

onMounted(async () => {
  try { item.value = await getDetail(route.params.id) } finally { loading.value = false }
})
</script>
