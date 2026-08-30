<template>
  <Header />
  <AdContainer />
  <router-view />
  <Footer />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import AdContainer from './components/AdContainer.vue'

const route = useRoute()
const router = useRouter()
let readyHandler = null
let statsScript = null
let removeAfterEach = null

function currentUrl() {
  return window.location.pathname + window.location.search + window.location.hash
}

function trackPage(url = currentUrl()) {
  if (typeof window.__yyxvtTrackPage !== 'function') return false
  return window.__yyxvtTrackPage(url)
}

function loadStatistics() {
  if (window.__yyxvtHistatsReadyState) {
    nextTick(() => trackPage())
    return
  }

  if (window.__yyxvtHistatsLoaderStarted) return

  const existing = document.querySelector('script[data-site-tj="1"]')
  if (existing) return

  statsScript = document.createElement('script')
  statsScript.src = '/tj.js'
  statsScript.async = true
  statsScript.dataset.siteTj = '1'
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
  window.addEventListener('histats-ready', readyHandler, { once: true })
  loadStatistics()

  removeAfterEach = router.afterEach((to, from) => {
    if (to.fullPath === from.fullPath) return
    nextTick(() => trackPage(to.fullPath))
  })
})

onBeforeUnmount(() => {
  if (readyHandler) window.removeEventListener('histats-ready', readyHandler)
  if (removeAfterEach) removeAfterEach()
  statsScript = null
})
</script>
