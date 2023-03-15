import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import HomeView from "../views/home.vue"
import { menus } from "../stores/menu"
const routers: RouteRecordRaw[] = []
menus.map(m => {
    if (Array.isArray(m.children)) {
        m.children.map(mc => {
            routers.push({
                path: "/" + mc.key,
                name: mc.name,
                meta: { key: mc.key },
                component: () => import(`../views/${mc.key}.vue`),
            })
        })
    } else {
        routers.push({
            path: "/",
            name: m.name,
            meta: { key: '' },
            component: HomeView,
        })
    }
})
routers.push({ path: "/catchAll(.*)", redirect: "/" })
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routers,
})

export default router
