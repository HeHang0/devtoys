<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
import { readTextFile } from "@/utils/utils";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function jsonChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.jsonChange.bind(page, value), 200);
}
function yamlChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.yamlChange.bind(page, value), 200);
}
const copyJson = () => navigator.clipboard.writeText(page.json2yaml.json);
const copyYaml = () => navigator.clipboard.writeText(page.json2yaml.yaml);
const pasteJson = () =>
  navigator.clipboard
    .readText()
    .then((r) => page.jsonChange(r))
    .catch(() => {});
const pasteYaml = () =>
  navigator.clipboard
    .readText()
    .then((r) => page.yamlChange(r))
    .catch(() => {});

function readJsonFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => page.jsonChange(r))
    .catch(ElMessage.warning);
  return false;
}

function readYamlFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => page.yamlChange(r))
    .catch(ElMessage.warning);
  return false;
}
</script>

<template>
  <div class="dev-toys-json2yaml">
    <div class="dev-toys-json2yaml-editor">
      <MonacoEditor
        :value="page.json2yaml.json"
        language="json"
        @changeValue="jsonChange">
        <template #title> JSON </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-json2yaml-editor">
      <MonacoEditor
        :value="page.json2yaml.yaml"
        language="yaml"
        @changeValue="yamlChange">
        <template #title> YAML </template>
      </MonacoEditor>
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
