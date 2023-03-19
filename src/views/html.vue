<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function htmlChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.htmlChange.bind(page, value), 200);
}
function textChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.textChange.bind(page, value), 200);
}
</script>

<template>
  <div class="dev-toys-html">
    <div class="dev-toys-html-editor">
      <MonacoEditor
        :value="page.html.html"
        language="html"
        @changeValue="htmlChange">
        <template #title> {{t('Decoded')}} </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-html-editor">
      <MonacoEditor
        :value="page.html.text"
        language="text"
        @changeValue="textChange">
        <template #title> {{t('Encoded')}} </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-html {
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
