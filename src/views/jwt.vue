<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
let changeTimeOut: any = null;
function jwtChange(value: string) {
  clearTimeout(changeTimeOut);
  changeTimeOut = setTimeout(page.jwtChange.bind(page, value), 200);
}
</script>

<template>
  <div class="dev-toys-jwt">
    <div class="dev-toys-jwt-editor">
      <MonacoEditor
        :value="page.jwt.jwt"
        language="text"
        @changeValue="jwtChange">
        <template #title> {{t('JWT Key')}} </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-jwt-editor">
      <MonacoEditor
        :value="page.jwt.header"
        language="json"
        :readonly="true">
        <template #title> {{t('Header')}} </template>
      </MonacoEditor>
    </div>
    <div class="dev-toys-jwt-editor">
      <MonacoEditor
        :value="page.jwt.payload"
        language="json"
        :readonly="true">
        <template #title> {{t('Payload')}} </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-jwt {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: calc(33.33% - 5px);
    width: 100%;
  }
}
</style>
