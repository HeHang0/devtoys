<script setup lang="ts">
import { useSearchStore } from "../stores/search";
const search = useSearchStore()
</script>

<template>
  <div class="dev-toys-home">
    <el-card v-for="menu in search.menus" :key="menu.key" body-style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
      <div class="dev-toys-home-icon"></div>
      <div style="padding: 14px">
        <span>{{ menu.name }}</span>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-home {
  display: flex;
  flex-wrap: wrap;
  .el-card {
    width: 150px;
    margin: 0 10px 10px 0;
    border: 0;
    .dev-toys-home-icon {
      width: 80px;
      height: 80px;
      background-color: var(--el-color-info-light-7);
      border-radius: 4px;
    }
    &:hover {
      --el-card-bg-color: var(--el-color-info-light-9);
    }
  }
}
</style>
