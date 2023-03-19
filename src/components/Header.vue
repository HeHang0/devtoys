<script setup lang="ts">
import { useRouter } from "vue-router";
import { Operation, Sunny, Moon } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores/settings";
import { Language, useLanguageStore } from "@/stores/language";
import IconLanguage from "@/components/icons/IconLanguage.vue";
const settings = useSettingsStore();
const language = useLanguageStore();
const { currentRoute } = useRouter();
function setAsideShow() {
  settings.setAsideShow(!settings.showAside);
}
</script>
<template>
  <el-header
    class="dev-toys-header"
  >
    <div class="dev-toys-header-logo" :class="settings.showAside ? '' : 'dev-toys-header-collapse'">
      <img src="/logo.png" @click="setAsideShow" />
      <span>DevToys</span>
    </div>
    {{ language.t(currentRoute.name || "") }}
  </el-header>
</template>
<style lang="less" scoped>
.dev-toys-header {
  transition: padding 0.5s;
  --el-header-height: 40px;
  --el-header-padding: 0 5px;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;

  .dev-toys-header-logo {
    // width: 30px;
    display: flex;
    align-items: center;
    height: 40px;
    position: fixed;
    left: 10px;
    top: 0;
    cursor: pointer;
    img {
      width: 30px;
      height: 30px;
    }
    span {
      margin-left: 10px;
      transition: opacity 0.5s;
      opacity: 1;
    }
  }
  .dev-toys-header-logo.dev-toys-header-collapse {
      span {
        opacity: 0;
      }
    }
}
</style>