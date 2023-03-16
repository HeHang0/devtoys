<script setup lang="ts">
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { menus } from "../stores/menu";
import { useSettingsStore } from "../stores/settings";
import { useSearchStore } from "../stores/search";
const menuActive = menus.map((m) => m.key);
const { currentRoute, replace } = useRouter();
const settings = useSettingsStore();
const search = useSearchStore();
function onSearchKeyChange() {
  search.onSearchKeyChange(currentRoute, replace)
}
</script>

<template>
  <el-aside class="dev-toys-aside" :class="settings.showAside ? '' : 'dev-toys-aside-hide'">
    <el-scrollbar>
      <el-input v-model="search.searchKey" clearable @input="onSearchKeyChange" size="small" placeholder="搜索"
        :prefix-icon="Search" />
      <el-menu :default-openeds="menuActive" :default-active="currentRoute.meta.key">
        <template v-for="menu in menus" :key="menu.key">
          <el-sub-menu v-if="menu.children" :index="menu.key">
            <template #title> {{ menu.name }} </template>
            <el-menu-item v-for="item in menu.children" :key="item.key" :index="item.key">
              <router-link :to="'/' + item.key">{{ item.name }}</router-link>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.key">
            <router-link :to="'/' + menu.key">{{ menu.name }}</router-link>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
<style lang="less" scoped>
.dev-toys-aside {
  width: 200px !important;
  transition: width 0.5s;

  &>.el-scrollbar {
    margin-top: 40px;
    height: calc(100% - 40px);
  }

  &.dev-toys-aside-hide {
    width: 0px !important;
  }

  .el-input {
    margin: 5px 10px;
    width: calc(100% - 20px);
  }

  .el-menu {
    border: 0;
  }

  .el-menu-item {
    height: 34px;
    // color: white;
    border-radius: 4px;
    margin: 0 5px;
  }

  .el-menu-item.is-active {
    background-color: var(--el-menu-hover-bg-color);
  }
}
</style>
<style lang="less">
.dev-toys-aside {
  .el-sub-menu__title {
    padding: 7px 0 7px var(--el-menu-base-level-padding);
    line-height: normal;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    height: 28px;
  }

  a {
    width: 100%;
    color: black !important;
    text-decoration: unset;
  }
}

html.dark {
  .dev-toys-aside {
    a {
      color: white !important;
    }
  }
}
</style>