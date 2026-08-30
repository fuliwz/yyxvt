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

let generation = 0
let lastRoute = ''
let timer = null
let observer = null
let adScript = null
let adNodes = []

function stopObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function startObserver(currentGeneration) {
  if (typeof MutationObserver === 'undefined') return
  stopObserver()
  observer = new MutationObserver((mutations) => {
    if (currentGeneration !== generation) return
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return
        if (adMount.value && adMount.value.contains(node)) return
        node.setAttribute('data-yyxvt-ad-node', '1')
        adNodes.push(node)
      })
    })
  })
  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
}

function clearAd() {
  if (adScript && adScript.parentNode) adScript.parentNode.removeChild(adScript)
  adScript = null

  adNodes.forEach((node) => {
    if (node && node.parentNode) node.parentNode.removeChild(node)
  })
  adNodes = []

  document.querySelectorAll('[data-yyxvt-ad-node="1"]').forEach((node) => node.remove())
  if (adMount.value) adMount.value.replaceChildren()
}

async function loadAd(force = false) {
  await nextTick()

  const target = adMount.value
  if (!target) return

  const routeKey = route.fullPath || '/'
  if (!force && lastRoute === routeKey) return

  lastRoute = routeKey
  const currentGeneration = ++generation

  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  stopObserver()
  clearAd()
  startObserver(currentGeneration)

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = false
  script.dataset.yyxvtAd = '1'
  script.src = `${AD_URL}?_route=${encodeURIComponent(routeKey)}`

  script.onerror = () => {
    if (currentGeneration === generation) {
      console.warn('[AdContainer] advertisement failed to load')
    }
  }

  adScript = script
  target.appendChild(script)
}

onMounted(() => {
  loadAd()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === oldPath || newPath === lastRoute) return

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      loadAd()
    }, 0)
  }
)

onBeforeUnmount(() => {
  ++generation
  if (timer) clearTimeout(timer)
  timer = null
  stopObserver()
  clearAd()
  lastRoute = ''
})
</script>

<style scoped>
.ad-container { width: 100%; min-height: 0; overflow: hidden; }
.mobile-ad { width: 100%; min-height: 0; overflow: hidden; }
@media (min-width: 641px) {
  .ad-container { display: none; }
}
</style>
