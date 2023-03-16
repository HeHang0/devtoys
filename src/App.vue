<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import SideMenu from "./components/SideMenu.vue";
import Header from "./components/Header.vue";
const { currentRoute } = useRouter();
</script>

<template>
  <el-container class="dev-toys-layout">
    <title>{{ currentRoute.name }} - DevToys</title>
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
</template>

<style scoped>
.dev-toys-layout {
  width: 100vw;
  height: 100vh;
}
</style>
