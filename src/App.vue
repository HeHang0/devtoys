<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import SideMenu from "./components/SideMenu.vue";
import Header from "./components/Header.vue";
import { useLanguageStore } from "@/stores/language";
const { currentRoute } = useRouter();
const language = useLanguageStore();
</script>

<template>
  <el-config-provider :locale="language.elementLocale">
    <el-container class="dev-toys-layout">
      <title>{{ language.t(currentRoute.name) }} - DevToys</title>
      <SideMenu />

      <el-container direction="vertical">
        <Header />
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
.dev-toys-layout {
  width: 100vw;
  height: 100vh;
}
</style>
