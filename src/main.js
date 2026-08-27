import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Category from './views/Category.vue'
import Search from './views/Search.vue'
import Detail from './views/Detail.vue'
import './styles.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/category/:id', component: Category },
    { path: '/search', component: Search },
    { path: '/detail/:id', component: Detail },
    { path: '/latest', component: Category, props: { latest: true } },
    { path: '/popular', component: Category, props: { popular: true } },
    { path: '/trending', component: Category, props: { popular: true } },
    { path: '/:pathMatch(.*)*', component: Home }
  ],
  scrollBehavior: () => ({ top: 0 })
})

createApp(App).use(router).mount('#app')
