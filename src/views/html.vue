<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="dev-toys-html">
    <div class="dev-toys-html-editor">
      <Editor
        :value="page.html.html"
        language="html"
        @delayInput="page.htmlChange">
        <template #title> {{t('Decoded')}} </template>
      </Editor>
    </div>
    <div class="dev-toys-html-editor">
      <Editor
        :value="page.html.text"
        language="text"
        @delayInput="page.textChange">
        <template #title> {{t('Encoded')}} </template>
      </Editor>
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
