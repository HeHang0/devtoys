<script setup lang="ts">
import { useRouter } from "vue-router";
import { Operation, Sunny, Moon } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import { useSettingsStore } from "@/stores/settings";
import { Language, useLanguageStore } from "@/stores/language";
import IconLanguage from '@/components/icons/IconLanguage.vue'
const isDark = useDark();
const toggleDark = useToggle(isDark);
const settings = useSettingsStore();
const language = useLanguageStore();
const { currentRoute } = useRouter();
</script>
<template>
  <el-header class="dev-toys-header" :class="settings.showAside ? '' : 'dev-toys-header-padding'">
    <img src="/logo.png" class="dev-toys-header-logo" />
    <el-button size="small" class="dev-toys-header-fold" :icon="Operation"
      @click="settings.showAside = !settings.showAside" />
    <el-button size="small" class="dev-toys-header-fold" style="left: 76px" :icon="isDark ? Sunny : Moon"
      @click="toggleDark()" />
    <el-dropdown>
      <el-button size="small" class="dev-toys-header-fold" style="left: 126px">
        <i>
          <IconLanguage />
        </i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="language.changeLanguage(Language.ZhCN)">简体中文</el-dropdown-item>
          <el-dropdown-item @click="language.changeLanguage(Language.EnUS)">English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
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

  &.dev-toys-header-padding {
    padding-left: 180px;
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

<style>
.dev-toys-header-fold i {
  width: 12px;
  height: 12px;
}
</style>