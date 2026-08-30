<template>
  <section class="ad-container" aria-label="广告">
    <div ref="adMount" class="mobile-ad" aria-label="移动端广告"></div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const adMount = ref(null)
const AD_URL = 'https://cmp-2020.ios81x.top/dh.php'

let loadToken = 0
let lastLoadedRoute = null
let observer = null
let adScript = null
let timer = null

function stopObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function startObserver(token) {
  if (typeof MutationObserver === 'undefined') return

  stopObserver()
  observer = new MutationObserver((mutations) => {
    if (token !== loadToken) return
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && !adMount.value?.contains(node)) {
          node.setAttribute('data-yyxvt-ad-node', '1')
        }
      }
    }
  })

  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
}

function clearPreviousAd() {
  if (adScript?.parentNode) adScript.parentNode.removeChild(adScript)
  adScript = null

  document.querySelectorAll('[data-yyxvt-ad-node="1"]').forEach((node) => node.remove())
  adMount.value?.replaceChildren()
}

async function loadAd(force = false) {
  await nextTick()

  const target = adMount.value
  if (!target) return

  const routeKey = route.fullPath
  if (!force && lastLoadedRoute === routeKey) return

  // Invalidate any previous asynchronous load before replacing the ad.
  const token = ++loadToken
  lastLoadedRoute = routeKey

  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  stopObserver()
  clearPreviousAd()
  startObserver(token)

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = false
  script.dataset.yyxvtAd = '1'
  // Do not append a cache-busting timestamp: it caused every navigation to
  // create a different URL and made duplicate requests harder to diagnose.
  script.src = `${AD_URL}?_route=${encodeURIComponent(routeKey)}`

  script.onload = () => {
    if (token !== loadToken) return
  }
  script.onerror = () => {
    if (token === loadToken) {
      console.warn('[AdContainer] advertisement failed to load')
    }
  }

  adScript = script
  target.appendChild(script)
}

onMounted(() => {
  // Initial page load is explicit. This avoids the old immediate watcher
  // competing with component/router initialization.
  loadAd()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === oldPath || newPath === lastLoadedRoute) return

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      loadAd()
    }, 0)
  }
)

onBeforeUnmount(() => {
  ++loadToken
  if (timer) clearTimeout(timer)
  timer = null
  stopObserver()
  clearPreviousAd()
  lastLoadedRoute = null
})
</script>

<style scoped>
.ad-container { width: 100%; min-height: 0; overflow: hidden; }
.mobile-ad { width: 100%; min-height: 0; overflow: hidden; }
@media (min-width: 641px) {
  .ad-container { display: none; }
}
</style>
