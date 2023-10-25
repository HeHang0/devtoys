<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Operation, Sunny, Moon } from '@element-plus/icons-vue';
import { useSettingsStore } from '@/stores/settings';
import { Language, useLanguageStore } from '@/stores/language';
import IconGithub from '@/components/icons/IconGithub.vue';
import IconDocumentation from '@/components/icons/IconDocumentation.vue';
const settings = useSettingsStore();
const language = useLanguageStore();
const { currentRoute } = useRouter();
function setAsideShow() {
  settings.setAsideShow(!settings.showAside);
}
function requestFullscreen(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
  return false;
}
</script>
<template>
  <el-header class="devtoys-header">
    <div
      class="devtoys-header-logo"
      :class="settings.showAside ? '' : 'devtoys-header-collapse'">
      <img
        src="/logo.png"
        @click="setAsideShow"
        @dblclick="requestFullscreen"
        @contextmenu="requestFullscreen" />
      <span>DevToys</span>
    </div>
    <span>
      {{
        language.t(`${currentRoute.meta.longName || currentRoute.name || ''}`)
      }}
    </span>
    <span>
      <a
        :href="
          'https://github.com/HeHang0/devtoys/tree/master/src/views/' +
          (currentRoute.meta.page || currentRoute.meta.key || 'home') +
          '.vue'
        "
        target="_blank"
        title="code">
        <i class="github-icon devtoys-icon">
          <IconDocumentation />
        </i>
      </a>
      <a
        href="https://github.com/hehang0/devtoys"
        target="_blank"
        title="github">
        <i class="github-icon">
          <IconGithub />
        </i>
      </a>
    </span>
  </el-header>
</template>
<style lang="less" scoped>
.devtoys-header {
  transition: padding var(--transition-second);
  --el-header-height: 40px;
  --el-header-padding: 0 5px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    a {
      color: inherit;
      display: inherit;
      margin-right: 15px;
      .github-icon {
        display: inherit;
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .devtoys-header-logo {
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
      transition: opacity var(--transition-second);
      opacity: 1;
    }
  }
  .devtoys-header-logo.devtoys-header-collapse {
    span {
      opacity: 0;
    }
  }
}
</style>
