<script setup lang="ts">
import { Switch } from '@element-plus/icons-vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import SettingCard from '@/components/SettingCard.vue';
import Editor from '@/components/Editor.vue';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-escape">
    <SettingCard :title="t('Convert')">
      <template #icon>
        <Switch />
      </template>
      {{ page.escape.escape ? t('Escape') : t('UnEscape') }}
      <el-switch
        size="small"
        v-model="page.escape.escape"
        @change="page.escapeSwitch" />
    </SettingCard>
    <Editor
      class="devtoys-escape-item"
      v-model:value="page.escape.text"
      @delay-input="page.escapeChange">
      <template #title> {{ t('Input') }} </template>
    </Editor>
    <Editor
      class="devtoys-escape-item devtoys-escape-item-output"
      v-model:value="page.escape.result"
      :readonly="true">
      <template #title> {{ t('Output') }} </template>
    </Editor>
  </div>
</template>

<style lang="less" scoped>
.devtoys-escape {
  width: 100%;
  height: 100%;
  &-item {
    height: calc(50% - 40px);
    &-output {
      margin-top: 12px;
    }
  }
}
</style>
