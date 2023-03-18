<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import Title from "@/components/Title.vue";
import { CopyDocument, List, Document } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
import { readTextFile } from "@/utils/utils";
import MonacoEditorDiff from "@/components/MonacoEditorDiff.vue";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function originalValueChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.originalValueChange.bind(page, value), 200);
}
function modifiedValueChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.modifiedValueChange.bind(page, value), 200);
}
const copyOriginalValue = () =>
  navigator.clipboard.writeText(page.textdiff.originalValue);
const copyModifiedValue = () =>
  navigator.clipboard.writeText(page.textdiff.modifiedValue);
const pasteOriginalValue = () =>
  navigator.clipboard
    .readText()
    .then((r) => page.originalValueChange(r))
    .catch(() => {});
const pasteModifiedValue = () =>
  navigator.clipboard
    .readText()
    .then((r) => page.modifiedValueChange(r))
    .catch(() => {});

function readOriginalFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => page.originalValueChange(r))
    .catch(ElMessage.warning);
  return false;
}

function readModifiedFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => page.modifiedValueChange(r))
    .catch(ElMessage.warning);
  return false;
}
</script>

<template>
  <div class="dev-toys-text-diff">
    <div class="dev-toys-text-diff-editor">
      <Title>
        <template #title> {{ t("Old Text") }} </template>
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readOriginalFile"
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
          @click="copyOriginalValue"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteOriginalValue"
          size="small"
          :title="t('Paste')"
        />
      </Title>
      <MonacoEditor
        :value="page.textdiff.originalValue"
        @changeValue="originalValueChange"
      />
    </div>
    <div class="dev-toys-text-diff-editor">
      <Title>
        <template #title> {{ t("New Text") }} </template>
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readModifiedFile"
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
          @click="copyModifiedValue"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteModifiedValue"
          size="small"
          :title="t('Paste')"
        />
      </Title>
      <MonacoEditor
        :value="page.textdiff.modifiedValue"
        @changeValue="modifiedValueChange"
      />
    </div>

    <div class="dev-toys-text-diff-body">
      <Title>
        <template #title> {{ t("Difference") }} </template>
      </Title>
      <MonacoEditorDiff
        :original-value="page.textdiff.originalValue"
        :modified-value="page.textdiff.modifiedValue"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-text-diff {
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
    height: calc(50% - 30px);
  }
  &-body {
    width: 100%;
    height: calc(50% - 30px);
  }
}
</style>
