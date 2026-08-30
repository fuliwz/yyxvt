<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link class="brand" to="/" aria-label="首页">海角AV</router-link>
      <nav class="nav" aria-label="主导航">
        <router-link to="/">首页</router-link>
        <router-link to="/latest">最新</router-link>
        <router-link to="/popular">热门</router-link>
        <router-link to="/categories">分类</router-link>
        <router-link to="/history">历史</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header{position:sticky;top:0;z-index:20;background:#090c0f;border-bottom:1px solid #1b2025;backdrop-filter:blur(12px)}
.header-inner{width:min(1180px,100%);margin:0 auto;padding:12px 16px;display:flex;align-items:center;gap:24px}
.brand{color:#fff;text-decoration:none;font-size:20px;font-weight:800;letter-spacing:.3px}.nav{display:flex;gap:16px;flex-wrap:wrap}.nav a{color:#9aa3aa;text-decoration:none;font-size:13px}.nav a.router-link-active{color:#ef4149}.nav a:hover{color:#fff}
@media(max-width:640px){.header-inner{gap:14px}.brand{font-size:18px}.nav{gap:10px}.nav a{font-size:12px}}
</style>
