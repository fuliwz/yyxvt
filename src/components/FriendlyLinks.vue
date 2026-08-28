<template>
  <section v-if="links.length" class="friendly-links" aria-label="友情链接">
    <div class="links-inner">
      <div class="links-title"><span>↗</span> 友情链接</div>
      <div class="links-list">
        <a v-for="item in links" :key="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="link-item">
          {{ item.name }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const links = ref([])

onMounted(async () => {
  try {
    const response = await fetch('/links.json', { cache: 'no-cache' })
    if (!response.ok) return
    const config = await response.json()
    if (config.enabled !== false && Array.isArray(config.links)) {
      links.value = config.links.filter(item => item && item.name && /^https?:\/\//i.test(item.url || ''))
    }
  } catch (error) {
    console.warn('[FriendlyLinks] 友情链接配置加载失败', error)
  }
})
</script>

<style scoped>
.friendly-links{border-top:1px solid #1b2025;background:#0a0e11}
.links-inner{width:min(1660px,calc(100% - 36px));margin:0 auto;padding:15px 0;display:flex;align-items:flex-start;gap:18px}
.links-title{flex:0 0 auto;color:#899198;font-size:11px;font-weight:700;line-height:26px}.links-title span{margin-right:5px;color:#ef4149}
.links-list{display:flex;flex-wrap:wrap;gap:6px 14px}.link-item{color:#8f989f;text-decoration:none;font-size:11px;line-height:26px;white-space:nowrap}.link-item:hover{color:#ef4149}
@media(max-width:640px){.links-inner{width:calc(100% - 24px);display:block;padding:12px 0}.links-title{margin-bottom:4px}.links-list{gap:3px 12px}}
</style>
