<script setup lang="ts">
import { Cellphone, Star } from '@element-plus/icons-vue';
import { useSearchStore } from '@/stores/search';
import { useLanguageStore } from '@/stores/language';
import { useSettingsStore } from '@/stores/settings';
import { elementScrollClick } from '@/utils/utils';
const search = useSearchStore();
const language = useLanguageStore();
const settings = useSettingsStore();
function openNewTab(key: string, event: Event) {
  settings.setLastRouter('/' + key);
  window.open(location.pathname);
}
</script>

<template>
  <div class="devtoys-home">
    <router-link
      v-for="menu in search.menus"
      :key="menu.key"
      :to="'/' + menu.key">
      <el-card>
        <div class="devtoys-home-icon">
          <i v-if="menu.icon" class="devtoys-icon">{{ menu.icon }}</i>
        </div>
        <div
          class="devtoys-home-title"
          :title="language.t(menu.longName || menu.name)">
          {{ language.t(menu.longName || menu.name) }}
        </div>
        <div class="devtoys-home-desc" :title="language.t(menu.desc || '')">
          {{ language.t(menu.desc || '') }}
        </div>
        <div class="devtoys-home-operate">
          <el-button
            plain
            size="small"
            :title="language.t('Open in new tab')"
            @click.prevent="openNewTab(menu.key, $event)">
            <el-icon><Cellphone /></el-icon>
          </el-button>
          <el-button
            v-if="settings.favExists(menu.key)"
            plain
            size="small"
            :title="language.t('Remove from favorites')"
            @click.prevent="settings.removeFavoriteRouter(menu.key)">
            <el-icon class="cancel"><Star /></el-icon>
          </el-button>
          <el-button
            v-else
            plain
            size="small"
            :title="language.t('Add to favorites')"
            @click.prevent="settings.addFavoriteRouter(menu.key)">
            <el-icon><Star /></el-icon>
          </el-button>
        </div>
      </el-card>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
.devtoys-home {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  padding-right: 5px;
  grid-column-gap: 5px;
  grid-row-gap: 10px;

  a {
    color: var(--el-text-color-primary);
    text-decoration: unset;
  }
  .el-card {
    width: 160px;
    border: 1px solid var(--el-border-color);
    height: 260px;
    background-color: var(--el-bg-color);
    box-shadow: none;

    /deep/.el-card__body {
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      position: relative;
    }
    .devtoys-home-icon {
      width: 80px;
      height: 80px;
      background-color: var(--el-color-info-light-7);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
      i {
        font-size: 30px;
      }
    }
    &:hover {
      --el-card-bg-color: var(--el-color-info-light-9);
    }
    .devtoys-home-title {
      margin-top: 10px;
      font-size: var(--el-font-size-small);
      color: var(--el-text-color-primary);
    }
    .devtoys-home-desc {
      margin-top: 5px;
      font-size: 8px;
      color: var(--el-text-color-regular);
      line-height: 12px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .devtoys-home-operate {
      position: absolute;
      bottom: 10px;
      opacity: 0;
      button {
        width: 24px;
        i {
          position: relative;
        }
        i.cancel::after {
          content: ' ';
          position: absolute;
          left: 2px;
          top: 2px;
          height: 1px;
          width: 100%;
          border-bottom: 1px solid;
          transform-origin: left top;
          transform: rotate(45deg);
        }
      }
    }
    &:hover {
      .devtoys-home-operate {
        opacity: 1;
      }
    }
  }
}
</style>
