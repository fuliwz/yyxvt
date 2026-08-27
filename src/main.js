import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Category from './views/Category.vue'
import Search from './views/Search.vue'
import Detail from './views/Detail.vue'
import Play from './views/Play.vue'
import History from './views/History.vue'
import './styles.css'
import './xtv-pages.css'
import './video-grid.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/categories', component: Category },
    { path: '/category/:id', component: Category },
    { path: '/search', component: Search },
    { path: '/detail/:id', component: Detail },
    { path: '/play/:id', component: Play },
    { path: '/history', component: History },
    { path: '/latest', component: Category, props: { latest: true } },
    { path: '/popular', component: Category, props: { popular: true } },
    { path: '/trending', component: Category, props: { popular: true } },
    { path: '/:pathMatch(.*)*', component: Home }
  ],
  scrollBehavior: () => ({ top: 0 })
})

createApp(App).use(router).mount('#app')
