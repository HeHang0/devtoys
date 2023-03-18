<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSearchStore } from "@/stores/search";
import { useLanguageStore } from "@/stores/language";
const search = useSearchStore();
const language = useLanguageStore();
</script>

<template>
  <div class="dev-toys-home">
    <el-card v-for="menu in search.menus" :key="menu.key" body-style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
      <div class="dev-toys-home-icon">
        <i v-if="menu.icon" class="dev-toys-icon">{{ menu.icon }}</i>
      </div>
      <div class="dev-toys-home-title">
        <span>{{ language.t(menu.longName || menu.name) }}</span>
      </div>
      <div class="dev-toys-home-desc">
        <span>{{ language.t(menu.desc || '') }}</span>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-home {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 10px;
  justify-content: space-between;
  .el-card {
    width: 150px;
    margin: 0 10px 10px 0;
    border: 1px solid var(--el-border-color);
    height: 220px;
    background-color: var(--el-bg-color);
    box-shadow: none;
    .dev-toys-home-icon {
      width: 80px;
      height: 80px;
      background-color: var(--el-color-info-light-7);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 30px;
      }
    }
    &:hover {
      --el-card-bg-color: var(--el-color-info-light-9);
    }
    .dev-toys-home-title {
      margin-top: 10px;
      font-size: var(--el-font-size-small);
      color: var(--el-text-color-primary);
    }
    .dev-toys-home-desc {
      margin-top: 5px;
      font-size: var(--el-font-size-extra-small);
      color: var(--el-text-color-regular);
    }
  }
}
</style>
