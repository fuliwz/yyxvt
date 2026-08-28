<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <header class="topbar">
      <button class="icon-btn menu-btn" aria-label="菜单" @click="toggleSidebar">☰</button>
      <router-link to="/" class="brand"><span class="brand-x">X</span>TV</router-link>
      <form class="search-wrap" @submit.prevent="search"><input v-model="keyword" autocomplete="off" placeholder="搜索视频、类别、标签..." /><button class="search-btn" aria-label="搜索">⌕</button></form>
      <div class="top-actions"><button class="action upload" type="button">上传</button><button class="action" type="button">中文⌄</button><button class="action muted" type="button">登录</button><button class="action register" type="button">注册</button></div>
    </header>
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeMobileSidebar"></div>
    <div class="layout">
      <aside :class="['sidebar',{open:sidebarOpen}]">
        <nav>
          <router-link v-for="item in primaryNav" :key="item.label" :to="item.to" class="nav-item" active-class="active" @click="closeMobileSidebar"><span class="nav-icon">{{item.icon}}</span><span class="nav-label">{{item.label}}</span></router-link>
          <div class="nav-section-title"><span>视频分类</span></div>
          <router-link v-for="item in categories" :key="item.type_id" :to="`/category/${item.type_id}`" class="nav-item category-item" active-class="active" @click="closeMobileSidebar"><span class="nav-icon">▸</span><span class="nav-label">{{item.type_name}}</span></router-link>
        </nav>
      </aside>
      <main class="content"><router-view /></main>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import categories from './data/categories.json'

const sidebarOpen=ref(false)
const sidebarCollapsed=ref(false)
const keyword=ref('')
const router=useRouter()
const primaryNav=[{icon:'◷',label:'最新',to:'/latest'},{icon:'♡',label:'最受欢迎',to:'/popular'}]
function isMobile(){return window.innerWidth<=900}
function toggleSidebar(){if(isMobile()) sidebarOpen.value=!sidebarOpen.value; else sidebarCollapsed.value=!sidebarCollapsed.value}
function closeMobileSidebar(){if(isMobile()) sidebarOpen.value=false}
function search(){const q=keyword.value.trim();if(q)router.push({path:'/search',query:{wd:q}})}
function onResize(){if(isMobile()){sidebarCollapsed.value=false}else{sidebarOpen.value=false}}
onMounted(()=>window.addEventListener('resize',onResize)); onBeforeUnmount(()=>window.removeEventListener('resize',onResize))
</script>
<style>
.nav-section-title{padding:18px 16px 8px;color:var(--muted,#8b8b8b);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.category-item .nav-icon{font-size:11px;opacity:.7}
@media (min-width:901px){.app-shell.sidebar-collapsed .sidebar{width:0!important;min-width:0!important;flex-basis:0!important;padding-left:0!important;padding-right:0!important;border-right:0!important;overflow:hidden!important}.app-shell.sidebar-collapsed .sidebar .nav-label,.app-shell.sidebar-collapsed .nav-section-title{display:none!important}.app-shell.sidebar-collapsed .content{max-width:none}}
</style>