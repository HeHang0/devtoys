<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { useRouter } from "vue-router";
import { Operation } from "@element-plus/icons-vue";
const settings = useSettingsStore();
const { currentRoute } = useRouter();
</script>
<template>
  <el-header
    class="dev-toys-header"
    :class="settings.showAside ? '' : 'dev-toys-header-padding80'"
  >
    <img src="/logo.png" class="dev-toys-header-logo"/>
    <el-button
      size="small"
      class="dev-toys-header-fold"
      :icon="Operation"
      @click="settings.showAside = !settings.showAside"
    />
    {{ currentRoute.name }}
  </el-header>
</template>
<style lang="less" scoped>
.dev-toys-header {
  transition: padding 0.5s;
  --el-header-height: 40px;
  //   color: white;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  &.dev-toys-header-padding80 {
    padding-left: 100px;
  }
  .dev-toys-header-logo {
    width: 30px;
    height: 30px;
    position: fixed;
    left: 8px;
    top: 8px;
  }
  .dev-toys-header-fold {
    width: 30px;
    height: 22px;
    position: fixed;
    left: 50px;
    top: 11px;
  }
}
</style>