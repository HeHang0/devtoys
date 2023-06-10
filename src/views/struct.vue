<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-struct">
    <div class="devtoys-struct-editor">
      <Editor
        v-model:value="page.struct.json"
        language="json"
        @delayInput="page.structJsonChange">
        <template #title> Json </template>
      </Editor>
    </div>
    <div class="devtoys-struct-editor">
      <Editor
        :value="page.struct.sql"
        language="sql"
        @delayInput="page.structSqlChange">
        <template #title> SQL </template>
      </Editor>
    </div>
    <div class="devtoys-struct-editor">
      <Editor :value="page.struct.golang" language="go">
        <template #title> Golang </template>
      </Editor>
    </div>
    <div class="devtoys-struct-editor">
      <Editor :value="page.struct.java" language="java">
        <template #title> Java </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-struct {
  // height: 100%;
  width: 100%;
  // display: flex;
  // justify-content: space-between;
  // flex-direction: column;

  &-editor {
    height: 300px;
    width: 100%;
    overflow: hidden;
    resize: vertical;
    min-height: 100px;
  }
}
</style>
