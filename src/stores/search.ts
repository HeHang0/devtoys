import { defineStore } from "pinia"
import type { Ref } from "vue"
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from "vue-router"
import { allMenus } from "./menu"
let timeout: any
let routerPath: RouteLocationRaw | null = null
export const useSearchStore = defineStore("search", {
    state: () => {
        return {
            searchKey: "",
            menus: allMenus,
        }
    },
    actions: {
        onSearchKeyChange(currentRoute: RouteLocationNormalizedLoaded, replace: any, t: any) {
            const currentPath = currentRoute.path
            if (currentPath != "/") {
                routerPath = currentRoute
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
