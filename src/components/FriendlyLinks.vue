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
import { ref } from 'vue'
import { getFriendlyLinks } from '../data/links'

const links = ref(getFriendlyLinks())
</script>

<style scoped>
.friendly-links{border:1px solid #1b2025;background:#0a0e11;border-radius:8px;margin:0 0 18px}
.links-inner{width:100%;margin:0 auto;padding:15px 16px;display:flex;align-items:flex-start;gap:18px;box-sizing:border-box}
.links-title{flex:0 0 auto;color:#899198;font-size:11px;font-weight:700;line-height:26px}.links-title span{margin-right:5px;color:#ef4149}
.links-list{display:flex;flex-wrap:wrap;gap:6px 14px}.link-item{color:#8f989f;text-decoration:none;font-size:11px;line-height:26px;white-space:nowrap}.link-item:hover{color:#ef4149}
@media(max-width:640px){.links-inner{display:block;padding:12px}.links-title{margin-bottom:4px}.links-list{gap:3px 12px}}
</style>
