<template>
  <section class="page-view">
    <div class="page-title-row">
      <div><h1>{{ title }}</h1><p>{{ pageCount > 1 ? `共 ${pageCount} 页` : '精选内容' }}</p></div>
    </div>
    <div v-if="classes.length" class="category-tabs">
      <router-link v-for="item in classes" :key="item.type_id" :to="`/category/${item.type_id}`" :class="{ selected: String(item.type_id) === String(route.params.id) }">{{ item.type_name }}</router-link>
    </div>
    <div v-if="loading" class="video-grid"><div v-for="n in 12" :key="n" class="video-card skeleton-card"><div class="thumb skeleton"></div><div class="line skeleton"></div><div class="line short skeleton"></div></div></div>
    <div v-else-if="videos.length" class="video-grid">
      <article v-for="item in videos" :key="item.id" class="video-card" @click="open(item.id)">
        <div class="thumb"><img :src="item.poster || fallback" :alt="item.title" loading="lazy" @error="fallbackImage"><span v-if="item.remarks" class="badge">{{ item.remarks }}</span><span class="duration">{{ item.duration || 'HD' }}</span><button class="play" aria-label="打开">▶</button></div>
        <h3>{{ item.title }}</h3><div class="stats"><span>◉ {{ formatViews(item.views) }}</span><span class="score">★ {{ item.score || '—' }}</span></div>
      </article>
    </div>
    <div v-else class="empty">暂无内容</div>
    <div v-if="pageCount > 1" class="pagination"><button :disabled="page <= 1" @click="go(page - 1)">‹</button><button v-for="n in visiblePages" :key="n" :class="{ current: n === page }" @click="go(n)">{{ n }}</button><button :disabled="page >= pageCount" @click="go(page + 1)">›</button></div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategoryVideos, getClasses, getHotVideos, getLatestVideos } from '../api/vod'

const props = defineProps({ latest: Boolean, popular: Boolean })
const route = useRoute(); const router = useRouter()
const videos = ref([]); const classes = ref([]); const loading = ref(true); const page = ref(Number(route.query.pg) || 1); const pageCount = ref(1)
const fallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=75'
const title = computed(() => props.latest ? '最新' : props.popular ? '最受欢迎' : classes.value.find(x => String(x.type_id) === String(route.params.id))?.type_name || '类别')
const visiblePages = computed(() => { const out=[]; const start=Math.max(1, Math.min(page.value-2, pageCount.value-4)); for(let i=start;i<=Math.min(pageCount.value,start+4);i++) out.push(i); return out })
function formatViews(v){ const n=Number(v)||0; return n>999999 ? `${(n/1000000).toFixed(1)}M` : n>999 ? `${(n/1000).toFixed(1)}K` : String(n) }
function fallbackImage(e){ e.target.src=fallback }
function open(id){ if(id) router.push(`/detail/${id}`) }
async function load(){ loading.value=true; try { if(!classes.value.length) classes.value=await getClasses(); const result = props.latest ? await getLatestVideos(page.value,18) : props.popular ? await getHotVideos(page.value,18) : await getCategoryVideos(route.params.id,page.value,18); videos.value=result.list; pageCount.value=Math.max(1,result.pageCount||1) } finally { loading.value=false } }
function go(n){ page.value=n; router.push({ query:{...route.query,pg:n} }); load() }
onMounted(load); watch(()=>route.params.id,()=>{page.value=1;load()})
</script>
