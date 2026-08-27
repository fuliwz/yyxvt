<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <header class="topbar">
      <button class="icon-btn menu-btn" aria-label="菜单" @click="toggleSidebar">☰</button>
      <router-link to="/" class="brand"><span class="brand-x">X</span>TV</router-link>
      <form class="search-wrap" @submit.prevent="search">
        <input v-model="keyword" autocomplete="off" placeholder="搜索视频、类别、标签..." />
        <button class="search-btn" aria-label="搜索">⌕</button>
      </form>
      <div class="top-actions">
        <button class="action upload" type="button">上传</button>
        <button class="action" type="button">中文⌄</button>
        <button class="action muted" type="button">登录</button>
        <button class="action register" type="button">注册</button>
      </div>
    </header>
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeMobileSidebar"></div>
    <div class="layout">
      <aside :class="['sidebar',{open:sidebarOpen}]">
        <nav>
          <router-link v-for="item in navItems" :key="item.label" :to="item.to" class="nav-item" active-class="active" @click="closeMobileSidebar"><span class="nav-icon">{{item.icon}}</span><span class="nav-label">{{item.label}}</span></router-link>
        </nav>
      </aside>
      <main class="content"><router-view /></main>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const sidebarOpen=ref(false); const sidebarCollapsed=ref(false); const keyword=ref(''); const router=useRouter()
const navItems=[{icon:'⌂',label:'首页',to:'/'},{icon:'◷',label:'最新',to:'/latest'},{icon:'♡',label:'最受欢迎',to:'/popular'},{icon:'⌁',label:'流行',to:'/trending'},{icon:'▦',label:'类别',to:'/categories'},{icon:'◉',label:'模型',to:'/models'},{icon:'◎',label:'网站',to:'/sites'},{icon:'▧',label:'相册',to:'/albums'},{icon:'☷',label:'观看记录',to:'/history'},{icon:'♙',label:'账户',to:'/account'}]
function isMobile(){return window.innerWidth<=900}
function toggleSidebar(){if(isMobile()){sidebarOpen.value=!sidebarOpen.value}else{sidebarCollapsed.value=!sidebarCollapsed.value}}
function closeMobileSidebar(){if(isMobile())sidebarOpen.value=false}
function search(){const q=keyword.value.trim();if(q)router.push({path:'/search',query:{wd:q}})}
function onResize(){if(!isMobile())sidebarOpen.value=false}
onMounted(()=>window.addEventListener('resize',onResize)); onBeforeUnmount(()=>window.removeEventListener('resize',onResize))
</script>
