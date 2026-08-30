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
let routeWatchStop = null

function currentUrl() {
  return window.location.pathname + window.location.search + window.location.hash
}

function trackPage() {
  if (typeof window.__yyxvtTrackPage !== 'function') return false
  return window.__yyxvtTrackPage(currentUrl())
}

function loadStatistics() {
  const existing = document.querySelector('script[data-site-tj="1"]')
  if (existing || window.__yyxvtHistatsReadyState || window.__yyxvtHistatsLoaderStarted) return

  statsScript = document.createElement('script')
  statsScript.src = '/tj.js'
  statsScript.async = true
  statsScript.dataset.siteTj = '1'
  statsScript.onload = () => {
    if (window.__yyxvtHistatsReadyState) trackPage()
  }
  statsScript.onerror = () => {
    window.__yyxvtHistatsLoaderStarted = false
    console.warn('[Statistics] tj.js 加载失败')
  }
  window.__yyxvtHistatsLoaderStarted = true
  document.head.appendChild(statsScript)
}

function onHistatsReady() {
  nextTick(() => trackPage())
}

onMounted(() => {
  readyHandler = onHistatsReady
  window.addEventListener('histats-ready', readyHandler)
  loadStatistics()

  if (window.__yyxvtHistatsReadyState) {
    nextTick(() => trackPage())
  }

  routeWatchStop = watch(
    () => route.fullPath,
    async (newPath, oldPath) => {
      if (newPath === oldPath) return
      window.scrollTo({ top: 0, behavior: 'smooth' })
      await nextTick()
      trackPage()
    }
  )
})

onBeforeUnmount(() => {
  if (readyHandler) window.removeEventListener('histats-ready', readyHandler)
  if (routeWatchStop) routeWatchStop()
  statsScript = null
})
</script>
