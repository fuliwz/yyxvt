<template>
  <section class="ad-container" aria-label="广告">
    <div v-if="isMobile" ref="adMount" class="mobile-ad" aria-label="移动端广告"></div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const MOBILE_AD_URL = 'https://fyb.pages.dev/tts.js'
const HISTATS_SITE = '1,4671415,4,0,0,0,00010000'
const HISTATS_FASI = '1'

const route = useRoute()
const adMount = ref(null)
const isMobile = ref(false)
let mediaQuery = null
let pageviewTimer = null

function checkMobile() {
  isMobile.value = !!mediaQuery && mediaQuery.matches
}

function removePreviousAdScripts() {
  document.querySelectorAll('script[data-yyxvt-mobile-ad="1"]').forEach((el) => el.remove())
}

async function loadMobileAd() {
  await nextTick()
  if (!isMobile.value || !adMount.value) return

  removePreviousAdScripts()
  adMount.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = MOBILE_AD_URL + (MOBILE_AD_URL.includes('?') ? '&' : '?') + '_pv=' + Date.now()
  script.async = true
  script.setAttribute('data-yyxvt-mobile-ad', '1')
  adMount.value.appendChild(script)
}

function loadHistats() {
  window._Hasync = []
  window._Hasync.push(['Histats.start', HISTATS_SITE])
  window._Hasync.push(['Histats.fasi', HISTATS_FASI])
  window._Hasync.push(['Histats.track_hits', ''])

  const old = document.querySelector('script[data-yyxvt-histats="1"]')
  if (old) old.remove()

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://s10.histats.com/js15_as.js?_pv=' + Date.now()
  script.setAttribute('data-yyxvt-histats', '1')
  ;(document.head || document.body).appendChild(script)
}

function refreshForPage() {
  clearTimeout(pageviewTimer)
  pageviewTimer = window.setTimeout(() => {
    loadMobileAd()
    loadHistats()
  }, 0)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 640px)')
  checkMobile()
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', checkMobile)
  else mediaQuery.addListener(checkMobile)
  refreshForPage()
})

watch(() => route.fullPath, () => {
  refreshForPage()
})

onBeforeUnmount(() => {
  clearTimeout(pageviewTimer)
  if (mediaQuery) {
    if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', checkMobile)
    else mediaQuery.removeListener(checkMobile)
  }
  removePreviousAdScripts()
  const histats = document.querySelector('script[data-yyxvt-histats="1"]')
  if (histats) histats.remove()
})
</script>

<style scoped>
.ad-container{width:100%;display:flex;justify-content:center;margin:0;padding:0}
.mobile-ad{width:100%;min-height:0;display:flex;justify-content:center;align-items:center;overflow:hidden}
@media(min-width:641px){.mobile-ad{display:none}}
</style>
