<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import SideMenu from './components/SideMenu.vue';
import Header from './components/Header.vue';
import AutoUpdate from './components/AutoUpdate.vue';
import { useLanguageStore } from '@/stores/language';
import { useSettingsStore } from './stores/settings';
import { elementScrollClick } from './utils/utils';
const { currentRoute, afterEach } = useRouter();
const language = useLanguageStore();
const settings = useSettingsStore();
const pure = location.search.includes('pure=');
afterEach(() => {
  elementScrollClick(currentRoute.value.meta.key as any);
});
</script>

<template>
  <el-config-provider :locale="language.elementLocale">
    <div
      class="devtoys-layout"
      :style="
        settings.pure
          ? ''
          : settings.showAside
          ? 'padding-left: 210px'
          : 'padding-left: 50px'
      ">
      <title>
        {{
          currentRoute.meta.longName
            ? language.t(String(currentRoute.meta.longName)) + ' - '
            : ''
        }}DevToys
      </title>
      <SideMenu v-if="!pure" />

      <el-container
        direction="vertical"
        :style="
          pure
            ? 'width: 100vw'
            : settings.showAside
            ? 'width: calc(100vw - 210px)'
            : 'width: calc(100vw - 50px)'
        ">
        <Header v-if="!pure" />
        <el-main
          class="devtoys-main"
          :style="
            (pure ? '' : 'margin-left:5px;') +
            (settings.mobile ? '' : 'height: calc(100vh - 40px)')
          ">
          <RouterView />
        </el-main>
      </el-container>
    </div>
    <AutoUpdate />
  </el-config-provider>
</template>

<style lang="less" scoped>
.devtoys-layout {
  // width: 100vw;
  // height: 100vh;
  display: flex;
  transition: padding var(--transition-second);

  & > .el-container.is-vertical {
    min-height: 100vh;
    flex: none;
  }

  .el-main {
    border-radius: 4px 0 0 0;
    background-color: var(--el-fill-color-extra-light);
  }
}
</style>

<style lang="less">
.devtoys-main {
  min-height: calc(100% - 40px);

  & > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view {
    position: relative;
    min-height: 100%;
  }
}
</style>
