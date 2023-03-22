<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import SideMenu from "./components/SideMenu.vue";
import Header from "./components/Header.vue";
import { useLanguageStore } from "@/stores/language";
import { useSettingsStore } from "./stores/settings";
import { allMenus } from "./stores/menu";
import { elementScrollClick } from "./utils/utils";
const { currentRoute, afterEach, beforeEach, replace } = useRouter();
const language = useLanguageStore();
const settings = useSettingsStore();
let onceRouter = false;
beforeEach((to, from, next) => {
  if (
    !onceRouter &&
    settings.rememberRouter &&
    settings.lastRouter && settings.lastRouter != "/" &&
    to.path == "/" &&
    allMenus.find(m => "/" + m.key == settings.lastRouter)
  ) {
    replace(settings.lastRouter);
    onceRouter = true;
    return
  }
  next()
})
afterEach(() => {
  settings.setLastRouter(currentRoute.value.path);
  elementScrollClick(currentRoute.value.meta.key as any)
});
</script>

<template>
  <el-config-provider :locale="language.elementLocale">
    <el-container class="devtoys-layout">
      <title>{{ currentRoute.name ? language.t(String(currentRoute.name))+" - " : "" }}DevToys</title>
      <SideMenu />

      <el-container direction="vertical">
        <Header />
        <el-main class="devtoys-main">
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style lang="less" scoped>
.devtoys-layout {
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
.devtoys-main > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view {
  position: relative;
  min-height: 100%;
}
</style>
