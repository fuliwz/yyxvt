<template>
  <section class="ad-container" aria-label="广告">
    <div ref="adMount" class="mobile-ad" aria-label="移动端广告"></div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const adMount = ref(null)
const AD_URL = 'https://cmp-2020.ios81x.top/dh.php'
let generation = 0
let timer = null
let observer = null
let adNodes = new Set()

function rememberNode(node) {
  if (!(node instanceof Node)) return
  if (adMount.value?.contains(node)) return
  adNodes.add(node)
  if (node.nodeType === Node.ELEMENT_NODE) node.setAttribute('data-yyxvt-ad-node', '1')
}

function startObserver() {
  if (typeof MutationObserver === 'undefined') return
  observer?.disconnect()
  observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(rememberNode))
  })
  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
}

function stopObserver() {
  observer?.disconnect()
  observer = null
}

function clearAd() {
  generation += 1
  if (timer) clearTimeout(timer)
  timer = null
  stopObserver()
  adMount.value?.replaceChildren()
  document.querySelectorAll('script[data-yyxvt-ad="1"]').forEach(el => el.remove())
  document.querySelectorAll('[data-yyxvt-ad-node="1"]').forEach(el => el.remove())
  adNodes.forEach(node => node?.parentNode?.removeChild(node))
  adNodes.clear()
}

async function loadAd() {
  await nextTick()
  const target = adMount.value
  if (!target) return
  clearAd()
  const currentGeneration = generation
  startObserver()
  const script = document.createElement('script')
  script.dataset.yyxvtAd = '1'
  script.async = false
  script.src = `${AD_URL}?_route=${encodeURIComponent(route.fullPath)}&_=${Date.now()}`
  target.appendChild(script)
  script.onerror = () => {
    if (currentGeneration === generation) console.warn('[AdContainer] advertisement failed to load')
  }
}

function reloadPageResources() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    loadAd()
  }, 0)
}

watch(() => route.fullPath, reloadPageResources, { immediate: true })
onBeforeUnmount(() => {
  clearAd()
})
</script>

<style scoped>
.ad-container { width: 100%; min-height: 0; overflow: hidden; }
.mobile-ad { width: 100%; min-height: 0; overflow: hidden; }
@media (min-width: 641px) {
  .ad-container { display: none; }
}
</style>
