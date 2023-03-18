<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import SideMenu from "./components/SideMenu.vue";
import Header from "./components/Header.vue";
import { useLanguageStore } from "@/stores/language";
import { ref } from "vue";
import { useSettingsStore } from "./stores/settings";
const { currentRoute, beforeEach, afterEach, replace } = useRouter();
const language = useLanguageStore();
const settings = useSettingsStore();
const loading = ref(false);
beforeEach(() => {
    loading.value = true;
});
afterEach(() => {
    settings.setLastRouter(currentRoute.value.path);
    loading.value = false;
    if (currentRoute.value.meta.key) {
        const ele = document.getElementById(
            currentRoute.value.meta.key as string
        );
        ele && ele.scrollIntoView({block: "nearest"});
    }
})

if(currentRoute.value.path == "/" && settings.rememberRouter && settings.lastRouter) {
  replace(settings.lastRouter);
}
</script>

<template>
    <el-config-provider :locale="language.elementLocale">
        <el-container class="dev-toys-layout">
            <title>{{ language.t(currentRoute.name) }} - DevToys</title>
            <SideMenu />

            <el-container direction="vertical">
                <Header />
                <el-main class="dev-toys-main" v-loading="loading">
                    <el-scrollbar>
                        <RouterView />
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </el-config-provider>
</template>

<style lang="less" scoped>
.dev-toys-layout {
    width: 100vw;
    height: 100vh;
    background-color: var(--el-bg-color-page);
    .el-main {
        border-radius: 4px 0 0 0;
        background-color: var(--el-fill-color-extra-light);
        margin-left: 5px;
    }
}
</style>

<style lang="less">
.dev-toys-main > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view {
    position: relative;
    min-height: 100%;
}
</style>
