<template>
  <section v-if="items.length" class="ad-container" aria-label="广告">
    <a
      v-for="item in items"
      :key="item.id || item.url || item.title"
      class="ad-card"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer sponsored"
      :aria-label="item.title || '广告'"
    >
      <img v-if="item.image" :src="item.image" :alt="item.title || '广告'" loading="lazy" decoding="async" />
      <div class="ad-copy">
        <span class="ad-label">广告</span>
        <strong>{{ item.title || '推广内容' }}</strong>
        <small v-if="item.description">{{ item.description }}</small>
      </div>
      <span class="ad-arrow">›</span>
    </a>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  slot: { type: String, default: 'top' }
})

const config = ref({ enabled: false, slots: {} })

const items = computed(() => {
  if (!config.value.enabled) return []
  const list = config.value.slots?.[props.slot]
  if (!Array.isArray(list)) return []
  return list.filter(item => item && item.url && (item.title || item.image))
})

onMounted(async () => {
  try {
    const response = await fetch('/ads.json', { cache: 'no-cache' })
    if (response.ok) config.value = await response.json()
  } catch (error) {
    console.warn('[AdContainer] 广告配置加载失败', error)
  }
})
</script>

<style scoped>
.ad-container{display:grid;gap:10px;margin:0 auto 18px;width:min(1660px,calc(100% - 36px))}
.ad-card{min-height:64px;display:flex;align-items:center;gap:12px;padding:9px 13px;border:1px solid #20272d;border-radius:9px;background:#0d1216;color:#e8ebed;text-decoration:none;overflow:hidden;transition:border-color .2s,background .2s}
.ad-card:hover{border-color:#38434c;background:#11171b}
.ad-card img{width:112px;height:48px;object-fit:cover;border-radius:6px;flex:0 0 auto;background:#151a1f}
.ad-copy{min-width:0;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.ad-label{padding:2px 5px;border:1px solid #3a4248;border-radius:4px;color:#aeb5ba;font-size:9px;line-height:1}
.ad-copy strong{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ad-copy small{width:100%;color:#747d84;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ad-arrow{margin-left:auto;color:#7f878d;font-size:22px;line-height:1}
@media(max-width:640px){.ad-container{width:calc(100% - 24px);margin-bottom:12px}.ad-card{padding:8px 10px}.ad-card img{width:82px;height:40px}.ad-copy strong{max-width:calc(100vw - 180px)}}
</style>
