<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-text-diff">
    <div class="devtoys-text-diff-editor">
      <Editor v-model:value="page.textdiff.originalValue">
        <template #title> {{ t('Old Text') }} </template>
      </Editor>
    </div>
    <div class="devtoys-text-diff-editor">
      <Editor v-model:value="page.textdiff.modifiedValue">
        <template #title> {{ t('New Text') }} </template>
      </Editor>
    </div>

    <div class="devtoys-text-diff-body">
      <Editor
        :difference="true"
        :value="page.textdiff.originalValue"
        :diff-value="page.textdiff.modifiedValue">
        <template #title> {{ t('Difference') }} </template>
        <template #operate> </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-text-diff {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;

  &-editor {
    width: calc(50% - 5px);
    height: calc(50% - 5px);
  }
  &-body {
    width: 100%;
    height: calc(50% - 5px);
  }

  @media (max-width: 850px) {
    &-editor {
      width: 100%;
      height: 233px;
    }
    &-body {
      width: 100%;
      height: 369px;
    }
  }
}
</style>
