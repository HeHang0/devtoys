<script setup lang="ts">
import { Cellphone, Star } from "@element-plus/icons-vue";
import { useSearchStore } from "@/stores/search";
import { useLanguageStore } from "@/stores/language";
import { useSettingsStore } from "@/stores/settings";
const search = useSearchStore();
const language = useLanguageStore();
const settings = useSettingsStore();
function openNewTab(key: string, event: Event) {
  event.preventDefault()
  settings.setLastRouter("/"+key);
  window.open(location.pathname);
}
</script>

<template>
  <div class="dev-toys-home">
    <router-link
      v-for="menu in search.menus"
      :key="menu.key"
      :to="'/' + menu.key"
    >
      <el-card
        body-style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100%"
      >
        <div class="dev-toys-home-icon">
          <i v-if="menu.icon" class="dev-toys-icon">{{ menu.icon }}</i>
        </div>
        <div class="dev-toys-home-title">
          <span>{{ language.t(menu.longName || menu.name) }}</span>
        </div>
        <div class="dev-toys-home-desc">
          <span>{{ language.t(menu.desc || "") }}</span>
        </div>
        <div class="dev-toys-home-operate">
          <el-button
            plain
            size="small"
            :title="language.t('Open in new tab')"
            @click="openNewTab(menu.key, $event)"
          >
            <el-icon><Cellphone /></el-icon>
          </el-button>
          <el-button
            v-if="settings.favExists(menu.key)"
            plain
            size="small"
            :title="language.t('Remove from favorites')"
            @click="settings.removeFavoriteRouter(menu.key)"
          >
            <el-icon class="cancel"><Star /></el-icon>
          </el-button>
          <el-button
            v-else
            plain
            size="small"
            :title="language.t('Add to favorites')"
            @click="settings.addFavoriteRouter(menu.key)"
          >
            <el-icon><Star /></el-icon>
          </el-button>
        </div>
      </el-card>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-home {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 10px;
  justify-content: space-between;

a {
    color: var(--el-text-color-primary);
    text-decoration: unset;
}
  .el-card {
    width: 150px;
    margin: 0 10px 10px 0;
    border: 1px solid var(--el-border-color);
    height: 250px;
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
      flex: 1;
    }
    .dev-toys-home-operate {
      margin-top: 10px;
      opacity: 0;
      button {
        width: 24px;
        i {
          position: relative;
        }
        i.cancel::after {
          content: " ";
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
      .dev-toys-home-operate {
        opacity: 1;
      }
    }
  }
}
</style>
