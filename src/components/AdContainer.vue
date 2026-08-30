<template>
  <section class="ad-container" aria-label="广告">
    <div ref="adMount" class="mobile-ad" aria-label="移动端广告"></div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const adMount = ref(null)
const AD_URL = 'https://cmp-2020.ios81x.top/dh.php'
const AD_SCRIPT_ID = 'yyxvt-mobile-ad-script'

let adScript = null
let observer = null

function startObserver() {
  if (typeof MutationObserver === 'undefined') return
  if (observer) return

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return
        if (adMount.value && adMount.value.contains(node)) return
        // Do not delete unrelated page nodes; only mark nodes produced by the ad loader.
        if (node.id === AD_SCRIPT_ID || node.closest?.(`#${AD_SCRIPT_ID}`)) return
      })
    })
  })

  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
}

function loadAdOnce() {
  if (!adMount.value) return

  const existing = document.getElementById(AD_SCRIPT_ID)
  if (existing || window.__yyxvtAdLoaded || window.__yyxvtAdLoading) return

  window.__yyxvtAdLoading = true

  const script = document.createElement('script')
  script.id = AD_SCRIPT_ID
  script.type = 'text/javascript'
  script.async = true
  script.dataset.yyxvtAd = '1'
  script.src = AD_URL

  script.onload = () => {
    window.__yyxvtAdLoaded = true
    window.__yyxvtAdLoading = false
  }

  script.onerror = () => {
    window.__yyxvtAdLoading = false
    console.warn('[AdContainer] advertisement failed to load')
  }

  adScript = script
  adMount.value.appendChild(script)
}

onMounted(() => {
  startObserver()
  loadAdOnce()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  // Deliberately keep the ad script alive during SPA route changes.
  adScript = null
})
</script>

<style scoped>
.ad-container { width: 100%; min-height: 0; overflow: hidden; }
.mobile-ad { width: 100%; min-height: 0; overflow: hidden; }
@media (min-width: 641px) {
  .ad-container { display: none; }
}
</style>
