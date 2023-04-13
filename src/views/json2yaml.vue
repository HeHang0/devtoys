<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-json2yaml">
    <div class="devtoys-json2yaml-editor">
      <Editor
        :value="page.json2yaml.json"
        language="json"
        @delay-input="page.jsonChange">
        <template #title> JSON </template>
      </Editor>
    </div>
    <div class="devtoys-json2yaml-editor">
      <Editor
        :value="page.json2yaml.yaml"
        language="yaml"
        @delayInput="page.yamlChange">
        <template #title> YAML </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-json2yaml {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;

  &-editor {
    width: calc(50% - 5px);
    height: 100%;
  }

  @media (max-width: 850px) {
    flex-direction: column;
    &-editor {
      width: 100%;
    }
  }
}
</style>
