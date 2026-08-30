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

// The ad is a page-level resource, not a route-level resource. Keep one
// loader state on window so remounts/HMR cannot create another dh.php request.
let observer = null

function startObserver() {
  if (typeof MutationObserver === 'undefined' || observer) return
  observer = new MutationObserver(() => {})
  // Intentionally observe nothing outside the ad mount. The old implementation
  // watched the whole document but never removed anything, adding overhead and
  // making third-party DOM changes look like ad activity.
  observer.observe(adMount.value, { childList: true })
}

function stopObserver() {
  observer?.disconnect()
  observer = null
}

function loadAdOnce() {
  const target = adMount.value
  if (!target) return

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

  target.appendChild(script)
}

onMounted(() => {
  startObserver()
  loadAdOnce()
})

// No route watcher: navigating inside the SPA must never reload dh.php.
onBeforeUnmount(() => {
  stopObserver()
})
</script>

<style scoped>
.ad-container { width: 100%; min-height: 0; overflow: hidden; }
.mobile-ad { width: 100%; min-height: 0; overflow: hidden; }
@media (min-width: 641px) {
  .ad-container { display: none; }
}
</style>
