<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import { ref } from 'vue';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-url">
    <div class="devtoys-url-editor">
      <Editor
        :value="page.url.url"
        language="url"
        @delay-input="page.urlChange">
        <template #title> {{ t('Decoded') }} </template>
        <template #more-operate>
          <span class="devtoys-url-switch"
            >参数：<el-switch
              size="small"
              v-model="page.url.encodeComponent"
              @change="page.urlChange(page.url.url)"
          /></span>
        </template>
      </Editor>
    </div>
    <div class="devtoys-url-editor">
      <Editor
        :value="page.url.text"
        language="text"
        @delay-input="page.textChange">
        <template #title> {{ t('Encoded') }} </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-url {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: calc(50% - 5px);
    width: 100%;
  }
  &-switch {
    margin-right: 12px;
    display: inline-flex;
  }
}
</style>
