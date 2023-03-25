<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-base64">
    <div class="devtoys-base64-editor">
      <Editor
        :value="page.base64.decoded"
        language="text"
        @delayInput="page.base64DecodedChange">
        <template #title> {{ t('Decoded') }} </template>
      </Editor>
    </div>
    <div class="devtoys-base64-editor">
      <Editor
        :value="page.base64.encoded"
        language="text"
        @delayInput="page.base64EncodedChange">
        <template #title> {{ t('Encoded') }} </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-base64 {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: calc(50% - 5px);
    width: 100%;
  }
}
</style>
