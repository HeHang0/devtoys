<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
import { ref } from "vue";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function urlChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.urlChange.bind(page, value), 200);
}
function textChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.urlTextChange.bind(page, value), 200);
}
</script>

<template>
  <div class="dev-toys-url">
    <div class="dev-toys-url-editor">
      <MonacoEditor
        :value="page.url.url"
        language="url"
        @changeValue="urlChange">
        <template #title> {{t('Decoded')}} </template>
        <template #more-operate>
          <span class="dev-toys-url-switch">参数：<el-switch size="small" v-model="page.url.encodeComponent" @change="page.urlChange(page.url.url)"/></span>
        </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-url-editor">
      <MonacoEditor
        :value="page.url.text"
        language="text"
        @changeValue="textChange">
        <template #title> {{t('Encoded')}} </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-url {
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
  &-switch {
    margin-right: 12px;
    display: inline-flex;
  }
}
</style>
