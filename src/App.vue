<template>
  <Header />
  <div class="layout">
    <Sidebar />
    <main class="content">
      <FriendlyLinks />
      <AdContainer />
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
import FriendlyLinks from './components/FriendlyLinks.vue'
import AdContainer from './components/AdContainer.vue'

const router = useRouter()
let readyHandler = null
let statsScript = null
let removeAfterEach = null

function currentUrl() { return window.location.pathname + window.location.search + window.location.hash }
function trackPage(url = currentUrl()) {
  if (typeof window.__yyxvtTrackPage !== 'function') return false
  return window.__yyxvtTrackPage(url)
}
function loadStatistics() {
  if (window.__yyxvtHistatsReadyState) { nextTick(() => trackPage()); return }
  if (window.__yyxvtHistatsLoaderStarted) return
  if (document.querySelector('script[data-site-tj="1"]')) return
  statsScript = document.createElement('script')
  statsScript.src = '/tj.js'
  statsScript.async = true
  statsScript.dataset.siteTj = '1'
  statsScript.onerror = () => { window.__yyxvtHistatsLoaderStarted = false; console.warn('[Statistics] tj.js 加载失败') }
  window.__yyxvtHistatsLoaderStarted = true
  document.head.appendChild(statsScript)
}
function onHistatsReady() { nextTick(() => trackPage()) }

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

<style scoped>
.layout{display:flex;min-height:calc(100vh - 62px)}
.content{flex:1;min-width:0;padding:26px 18px 54px;max-width:1660px;margin:0 auto}
@media(max-width:900px){.content{padding:20px 12px 38px}}
</style>
