import { defineStore } from "pinia"
import type { Ref } from "vue"
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from "vue-router"
import { allMenus } from "./menu"
let timeout: number = 0
let routerPath: RouteLocationRaw | null = null
export const useSearchStore = defineStore("search", {
    state: () => {
        return {
            searchKey: "",
            menus: allMenus,
        }
    },
    actions: {
        onSearchKeyChange(currentRoute: Ref<RouteLocationNormalizedLoaded>, replace: any, t: any) {
            const currentPath = currentRoute.value.path
            if (currentPath != "/") {
                routerPath = currentRoute.value
                replace("/")
            }
            clearTimeout(timeout)
            if (this.searchKey) {
                timeout = setTimeout(() => {
                    this.menus = allMenus.filter(
                        m => `${t(m.name)}${t(m.longName)}${t(m.desc)}`.includes(this.searchKey)
                    );
                }, 100)
            } else {
                this.menus = allMenus;
                if (routerPath) {
                    replace(routerPath)
                }
            }
        },
    },
})
