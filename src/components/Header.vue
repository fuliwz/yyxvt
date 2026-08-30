<template>
  <>
    <header class="topbar">
      <button class="icon-btn menu-btn" type="button" aria-label="切换侧边栏" @click="sidebarOpen = !sidebarOpen">☰</button>
      <router-link class="brand" to="/" aria-label="首页">海角<span class="brand-x">AV</span></router-link>
      <div class="search-wrap">
        <input v-model="keyword" type="search" placeholder="搜索视频" aria-label="搜索视频" @keyup.enter="search" />
        <button class="search-btn" type="button" aria-label="搜索" @click="search">⌕</button>
      </div>
      <div class="top-actions"><router-link class="action" to="/history">历史</router-link></div>
    </header>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <nav aria-label="侧边导航">
        <router-link class="nav-item" to="/" @click="closeMobile"><span class="nav-icon">⌂</span><span class="nav-label">首页</span></router-link>
        <router-link class="nav-item" to="/latest" @click="closeMobile"><span class="nav-icon">◷</span><span class="nav-label">最新</span></router-link>
        <router-link class="nav-item" to="/popular" @click="closeMobile"><span class="nav-icon">★</span><span class="nav-label">热门</span></router-link>
        <router-link class="nav-item" to="/trending" @click="closeMobile"><span class="nav-icon">↗</span><span class="nav-label">趋势</span></router-link>
        <router-link class="nav-item" to="/categories" @click="closeMobile"><span class="nav-icon">▦</span><span class="nav-label">分类</span></router-link>
        <router-link class="nav-item" to="/history" @click="closeMobile"><span class="nav-icon">▤</span><span class="nav-label">观看记录</span></router-link>
      </nav>
    </aside>
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false"></div>
  </>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')
const sidebarOpen = ref(false)

function closeMobile() {
  sidebarOpen.value = false
}

function search() {
  const wd = keyword.value.trim().slice(0, 100)
  if (!wd) return
  router.push({ path: '/search', query: { wd } })
  closeMobile()
}
</script>

<style scoped>
.topbar{height:62px;position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:14px;padding:0 20px;border-bottom:1px solid #1b2025;background:rgba(8,11,14,.96);backdrop-filter:blur(14px)}
.icon-btn{border:0;background:transparent;color:#eef0f1;width:32px;height:34px;cursor:pointer;font-size:20px}.brand{color:#f5f6f7;text-decoration:none;font-size:24px;font-weight:900;letter-spacing:-1.4px;min-width:114px}.brand-x{color:#f0444b}
.search-wrap{height:40px;max-width:760px;flex:1;display:flex;align-items:center;background:#151a1f;border:1px solid #20272e;border-radius:10px;overflow:hidden}.search-wrap input{width:100%;height:100%;padding:0 15px;color:#e8ebed;background:transparent;border:0;outline:0;font-size:13px}.search-btn{width:46px;height:100%;border:0;background:transparent;color:#f5f6f7;font-size:25px;cursor:pointer}.top-actions{display:flex;gap:10px;margin-left:auto}.action{border:1px solid #242b31;border-radius:7px;background:#101419;color:#e8e9ea;height:36px;padding:0 14px;display:flex;align-items:center;text-decoration:none;font-size:12px}
.sidebar{width:156px;flex:0 0 156px;border-right:1px solid #171c20;background:#0a0e11;position:fixed;left:0;top:62px;z-index:40;height:calc(100vh - 62px);padding:16px 10px;overflow:hidden}.nav-item{height:43px;display:flex;align-items:center;gap:13px;padding:0 12px;color:#b6bcc1;text-decoration:none;border-radius:8px;font-size:13px;margin:2px 0}.nav-item:hover,.nav-item.router-link-active{background:#11161a;color:#f0454b}.nav-icon{width:19px;text-align:center;font-size:17px}.nav-label{white-space:nowrap}
.sidebar-backdrop{display:none}
@media(min-width:901px){.menu-btn{display:none}}
@media(max-width:900px){.sidebar{transform:translateX(-100%);transition:transform .2s ease}.sidebar.open{transform:translateX(0)}.sidebar-backdrop{display:block;position:fixed;inset:62px 0 0;z-index:35;background:rgba(0,0,0,.55)}.topbar{padding:0 12px}.brand{min-width:auto;font-size:20px}.top-actions{display:none}}
@media(max-width:640px){.search-wrap{max-width:none}.search-wrap input{font-size:12px}.search-btn{width:40px}}
</style>
