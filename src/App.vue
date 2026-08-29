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

let lastTrackedUrl = ''
let histatsReady = false
let readyHandler = null

function loadStatistics() {
  if (document.querySelector('script[data-site-tj="1"]')) {
    return
  }

  const script = document.createElement('script')
  script.src = '/tj.js'
  script.async = true
  script.dataset.siteTj = '1'

  script.onerror = () => {
    console.warn('[Statistics] tj.js 加载失败')
  }

  document.head.appendChild(script)
}

function trackPage() {
  const currentUrl =
    window.location.pathname +
    window.location.search +
    window.location.hash

  if (currentUrl === lastTrackedUrl) {
    return
  }

  if (!histatsReady) {
    return
  }

  lastTrackedUrl = currentUrl

  window._Hasync = window._Hasync || []
  window._Hasync.push([
    'Histats.track_hits',
    ''
  ])

  console.log('[Histats PV]', currentUrl, document.title)
}

onMounted(() => {
  readyHandler = () => {
    histatsReady = true

    nextTick(() => {
      trackPage()
    })
  }

  window.addEventListener('histats-ready', readyHandler)
  loadStatistics()
})

watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    if (newPath === oldPath) {
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    await nextTick()

    setTimeout(() => {
      trackPage()
    }, 50)
  }
)

onBeforeUnmount(() => {
  if (readyHandler) {
    window.removeEventListener('histats-ready', readyHandler)
  }
})
</script>
