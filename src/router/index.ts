import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import HomeView from "../views/home.vue"
import { menus } from "../stores/menu"
import { storage, StorageKey } from "../utils/storage"
const routers: RouteRecordRaw[] = []
menus.map(m => {
    if (Array.isArray(m.children)) {
        m.children.map(mc => {
            routers.push({
                path: "/" + mc.key,
                name: mc.name,
                meta: { key: mc.key, longName: mc.longName },
                component: () => import(`../views/${mc.page || mc.key}.vue`),
            })
        })
    } else {
        routers.push({
            path: "/" + m.key,
            name: m.name,
            meta: { key: m.key, longName: m.longName },
            component: m.key ? () => import(`../views/${m.page || m.key}.vue`) : HomeView,
        })
    }
})
routers.push({ path: "/catchAll(.*)", redirect: "/" })
const router = createRouter({
    history: createWebHistory(storage.getValue(StorageKey.RouterHistory, "", "string")),
    routes: routers,
})

export default router
