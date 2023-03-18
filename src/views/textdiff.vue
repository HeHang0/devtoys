<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
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
</script>

<template>
  <div class="dev-toys-text-diff">
    <div class="dev-toys-text-diff-editor">
      <MonacoEditor
        :value="page.textdiff.originalValue"
        @changeValue="originalValueChange">
        <template #title> {{ t("Old Text") }} </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-text-diff-editor">
      <MonacoEditor
        :value="page.textdiff.modifiedValue"
        @changeValue="modifiedValueChange">
        <template #title> {{ t("New Text") }} </template>
      </MonacoEditor>
    </div>

    <div class="dev-toys-text-diff-body">
      <MonacoEditor
        :difference="true"
        :value="page.textdiff.originalValue"
        :diff-value="page.textdiff.modifiedValue">
        <template #title> {{ t("Difference") }} </template>
        <template #operate> </template>
      </MonacoEditor>
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
    height: calc(50% - 5px);
  }
  &-body {
    width: 100%;
    height: calc(50% - 5px);
  }
}
</style>
