<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { menus } from '../stores/menu';
import { useSettingsStore } from '../stores/settings';
import { useSearchStore } from '../stores/search';
import { useLanguageStore } from '../stores/language';
import { elementScrollClick } from '@/utils/utils';
const menuActive = menus.map(m => '/' + m.key);
const { currentRoute, replace } = useRouter();
const settings = useSettingsStore();
const search = useSearchStore();
const { t } = useLanguageStore();
const menuCollapse = ref(!settings.showAside);
const menuRef = ref();
const searchInputRef = ref();
function onSearchKeyChange() {
  search.onSearchKeyChange(route, replace, t);
}
function menuOpen(index: string) {
  menuActive.indexOf(index) < 0 && menuActive.push(index);
}
function menuClose(index: string) {
  if (!settings.showAside) return;
  const i = menuActive.indexOf(index);
  menuActive.indexOf(index) >= 0 && menuActive.splice(i, 1);
}

function expandAside() {
  settings.showAside = true;
  searchInputRef.value.focus();
}

const route = useRoute();

onMounted(() => {
  elementScrollClick(route.meta.key as any);
});

watch(
  () => settings.showAside,
  newValue => {
    if (!menuRef) return;
    if (newValue) {
      menuCollapse.value = false;
      nextTick(() => {
        menuActive.map(m => menuRef.value.open(m));
      });
    } else {
      menuActive.map(m => menuRef.value.close(m));
      setTimeout(() => {
        menuCollapse.value = true;
      }, 500);
    }
  }
);
</script>

<template>
  <el-aside
    class="devtoys-aside"
    :class="settings.showAside ? '' : 'devtoys-aside-hide'"
    :width="settings.showAside ? '200px' : '40px'">
    <el-scrollbar>
      <span class="devtoys-aside-search">
        <el-input
          ref="searchInputRef"
          v-model="search.searchKey"
          clearable
          @input="onSearchKeyChange"
          size="small"
          :placeholder="t('tool.all.description')"
          :prefix-icon="Search" />
        <div
          class="devtoys-aside-search-helper"
          :title="t('Search')"
          @click="expandAside">
          <el-icon>
            <Search />
          </el-icon>
        </div>
      </span>
      <el-menu
        ref="menuRef"
        :collapse="menuCollapse"
        :collapse-transition="false"
        class="devtoys-aside-menu"
        :default-openeds="settings.showAside ? menuActive : []"
        router
        @open="menuOpen"
        @close="menuClose"
        :default-active="route.path">
        <template v-for="menu in menus" :key="menu.key">
          <el-sub-menu
            popper-class="devtoys-aside-menu-popper"
            v-if="menu.children"
            :index="'/' + menu.key"
            :title="t(menu.name)">
            <template #title>
              <i v-if="menu.icon" class="devtoys-icon">{{ menu.icon }}</i>
              <span :title="t(menu.name)">{{ t(menu.name) }}</span>
            </template>
            <el-menu-item
              v-for="item in menu.children"
              :key="item.key"
              :index="'/' + item.key"
              :title="t(item.name)">
              <i v-if="item.icon" class="devtoys-icon">{{ item.icon }}</i>
              <span :id="item.key" :title="t(item.name)">
                {{ t(item.name) }}
              </span>
            </el-menu-item>
          </el-sub-menu>
          <template v-else>
            <el-menu-item :index="'/' + menu.key" :title="t(menu.name)">
              <i v-if="menu.icon" class="devtoys-icon">{{ menu.icon }}</i
              ><span :id="menu.key">{{ t(menu.name) }}</span>
            </el-menu-item>
            <template v-if="!menu.key">
              <el-menu-item
                v-for="favItem in settings.favoriteRouters"
                :key="favItem.key"
                :index="'/' + favItem.key">
                <i v-if="favItem.icon" class="devtoys-icon">{{
                  favItem.icon
                }}</i
                ><span :id="favItem.key">{{ t(favItem.name) }}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
<style lang="less" scoped>
.devtoys-aside {
  transition: width var(--transition-second);
  height: 100vh;
  position: fixed;
  z-index: 1;
  left: 0;

  & > .el-scrollbar {
    margin-top: 40px;
    height: calc(100% - 40px);
  }

  &-search {
    position: relative;
    display: inline-block;
    width: 100%;

    &-helper {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 4px;
      cursor: pointer;
      padding: 5px 5px 5px 13px !important;
      margin: 2px 0;
      overflow: hidden;
      width: 0;
      height: 0;
      opacity: 0;
      transition: width var(--transition-second),
        height var(--transition-second), opacity var(--transition-second);
    }

    &-helper:hover {
      background-color: var(--el-menu-hover-bg-color);
    }
  }
  &-hide {
    .devtoys-aside-search-helper {
      width: 40px;
      height: 30px;
      opacity: 1;
    }
  }

  .el-input {
    margin: 5px 0;
    width: 100%;
  }

  .el-menu-item {
    & > * {
      height: 100%;
      line-height: 30px;
    }
    & > i {
      height: 30px;
    }
    & > span {
      overflow: hidden; /* 让文本超出时隐藏 */
      text-overflow: ellipsis;
    }

    background-color: unset;
    background: linear-gradient(
        to right,
        var(--el-menu-hover-bg-color),
        var(--el-menu-hover-bg-color)
      )
      no-repeat right bottom;
    background-size: 0 100%;

    &:hover {
      background-position-x: left;
      background-size: 100% 100%;
    }
  }
}

.devtoys-aside-menu,
.devtoys-aside-menu-popper {
  width: 100%;
  border: 0;

  i {
    margin-right: 10px;
  }

  .el-menu-item {
    height: 30px;
    border-radius: 4px;
    margin: 2px 0;

    &.is-active {
      background-color: var(--el-menu-hover-bg-color);
    }
  }
}
</style>
<style lang="less">
.devtoys-aside-menu,
.devtoys-aside-menu-popper {
  background-color: transparent;

  .el-menu {
    background-color: transparent;
  }

  .el-sub-menu__title {
    padding: 7px 0 7px var(--el-menu-base-level-padding);
    line-height: normal;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    height: 28px;
    border-radius: 4px;
  }

  a {
    width: 100%;
    height: 100%;
    color: var(--el-text-color-primary) !important;
    text-decoration: unset;
    display: inline-flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
  }
}

.devtoys-aside {
  margin-left: 5px;

  .el-menu-item {
    transition: background-size var(--transition-second),
      padding var(--transition-second);
    display: flex;

    a {
      i {
        transition: margin var(--transition-second);
      }
    }

    span {
      transition: opacity var(--transition-second);
    }
  }

  .el-sub-menu {
    i.el-sub-menu__icon-arrow {
      transition: opacity var(--transition-second);
    }

    .el-sub-menu__title {
      transition: padding var(--transition-second);
    }

    span {
      transition: opacity var(--transition-second);
    }
  }

  .el-input {
    transition: opacity var(--transition-second);
  }

  &-hide {
    .el-menu-item {
      padding: 5px;
      padding-left: 13px !important;

      a {
        i {
          margin-right: 0;
        }
      }

      span {
        opacity: 0;
      }
    }

    .el-sub-menu {
      i.el-sub-menu__icon-arrow {
        opacity: 0;
      }

      .el-sub-menu__title {
        padding: 5px 5px 5px 14px !important;
        height: 24px;
        margin: 2px 0;
      }

      span {
        opacity: 0;
      }

      &.is-active {
        .el-sub-menu__title {
          background-color: var(--el-menu-hover-bg-color);
        }
      }
    }

    .el-input {
      opacity: 0;
    }
  }
}
</style>
