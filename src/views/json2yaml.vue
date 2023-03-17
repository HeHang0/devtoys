<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import Title from "@/components/Title.vue";
import { CopyDocument, List, Document } from "@element-plus/icons-vue";
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
    .then((r) => (page.json2yaml.json = r))
    .catch(() => {});
const pasteYaml = () =>
  navigator.clipboard
    .readText()
    .then((r) => (page.json2yaml.yaml = r))
    .catch(() => {});

function readJsonFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => (page.json2yaml.json = r))
    .catch(ElMessage.warning);
  return false;
}

function readYamlFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => (page.json2yaml.yaml = r))
    .catch(ElMessage.warning);
  return false;
}
</script>

<template>
  <div class="dev-toys-json2yaml">
    <div class="dev-toys-json2yaml-editor">
      <Title>
        <template #title> JSON </template>
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readJsonFile"
        >
          <el-button
            plain
            :icon="Document"
            size="small"
            :title="t('Read from file')"
          />
        </el-upload>
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyJson"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteJson"
          size="small"
          :title="t('Paste')"
        />
      </Title>
      <MonacoEditor
        :value="page.json2yaml.json"
        language="json"
        @changeValue="jsonChange"
      />
    </div>
    <div class="dev-toys-json2yaml-editor">
      <Title>
        <template #title> YAML </template>
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readYamlFile"
        >
          <el-button
            plain
            :icon="Document"
            size="small"
            :title="t('Read from file')"
          />
        </el-upload>
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyYaml"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteYaml"
          size="small"
          :title="t('Paste')"
        />
      </Title>
      <MonacoEditor
        :value="page.json2yaml.yaml"
        language="yaml"
        @changeValue="yamlChange"
      />
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
    height: calc(100% - 30px);
  }
}
</style>
