<template>
  <Header />
  <AdContainer />
  <router-view />
  <Footer />
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import AdContainer from './components/AdContainer.vue'

const route = useRoute()
let readyHandler = null
let statsScript = null

function currentUrl() {
  return window.location.pathname + window.location.search + window.location.hash
}

function trackPage() {
  if (typeof window.__yyxvtTrackPage !== 'function') return false
  return window.__yyxvtTrackPage(currentUrl())
}

function loadStatistics() {
  if (window.__yyxvtHistatsLoaderStarted || window.__yyxvtHistatsReadyState) {
    return
  }

  window.__yyxvtHistatsLoaderStarted = true

  statsScript = document.createElement('script')
  statsScript.src = '/tj.js'
  statsScript.async = true
  statsScript.dataset.siteTj = '1'
  statsScript.onerror = () => {
    console.warn('[Statistics] tj.js 加载失败')
    window.__yyxvtHistatsLoaderStarted = false
  }
  document.head.appendChild(statsScript)
}

function onHistatsReady() {
  nextTick(() => trackPage())
}

onMounted(() => {
  readyHandler = onHistatsReady
  window.addEventListener('histats-ready', readyHandler, { once: true })
  loadStatistics()

  if (window.__yyxvtHistatsReadyState) {
    nextTick(() => trackPage())
  }
})

watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    if (newPath === oldPath) return

    window.scrollTo({ top: 0, behavior: 'smooth' })
    await nextTick()

    if (window.__yyxvtHistatsReadyState) {
      trackPage()
    }
  }
)

onBeforeUnmount(() => {
  if (readyHandler) {
    window.removeEventListener('histats-ready', readyHandler)
  }
  statsScript = null
})
</script>
