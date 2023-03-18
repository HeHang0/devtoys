<script setup lang="ts">
import {
  RouterView,
  useRouter,
  type RouteLocationNormalized,
} from "vue-router";
import SideMenu from "./components/SideMenu.vue";
import Header from "./components/Header.vue";
import { useLanguageStore } from "@/stores/language";
import { ref } from "vue";
const { currentRoute, beforeEach, beforeResolve } = useRouter();
const language = useLanguageStore();
const loading = ref(false);
beforeEach(() => {
  loading.value = true;
});
beforeResolve(() => {
  loading.value = false;
});
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
