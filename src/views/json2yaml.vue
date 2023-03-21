<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="dev-toys-json2yaml">
    <div class="dev-toys-json2yaml-editor">
      <Editor
        :value="page.json2yaml.json"
        language="json"
        @delayInput="page.jsonChange">
        <template #title> JSON </template>
      </Editor>
    </div>
    <div class="dev-toys-json2yaml-editor">
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
.dev-toys-json2yaml {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;

  &-editor {
    width: calc(50% - 5px);
    height: 100%;
  }
}
</style>
