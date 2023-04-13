<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-jwt">
    <div class="devtoys-jwt-editor">
      <Editor
        :value="page.jwt.jwt"
        language="text"
        @delayInput="page.jwtChange">
        <template #title> {{ t('JWT Key') }} </template>
      </Editor>
    </div>
    <div class="devtoys-jwt-editor">
      <Editor :value="page.jwt.header" language="json">
        <template #title> {{ t('Header') }} </template>
      </Editor>
    </div>
    <div class="devtoys-jwt-editor">
      <Editor :value="page.jwt.payload" language="json">
        <template #title> {{ t('Payload') }} </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-jwt {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: calc(33.33% - 5px);
    width: 100%;
  }
}
</style>
