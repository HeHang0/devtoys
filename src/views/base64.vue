<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function encodedChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.base64EncodedChange.bind(page, value), 200);
}
function decodedChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.base64DecodedChange.bind(page, value), 200);
}
</script>

<template>
  <div class="dev-toys-base64">
    <div class="dev-toys-base64-editor">
      <MonacoEditor
        :value="page.base64.decoded"
        language="text"
        @changeValue="decodedChange">
        <template #title> {{t('Decoded')}} </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-base64-editor">
      <MonacoEditor
        :value="page.base64.encoded"
        language="text"
        @changeValue="encodedChange">
        <template #title> {{t('Encoded')}} </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-base64 {
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
