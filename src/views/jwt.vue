<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="dev-toys-jwt">
    <div class="dev-toys-jwt-editor">
      <Editor
        :value="page.jwt.jwt"
        language="text"
        @delayInput="page.jwtChange">
        <template #title> {{t('JWT Key')}} </template>
      </Editor>
    </div>
    <div class="dev-toys-jwt-editor">
      <Editor
        :value="page.jwt.header"
        language="json">
        <template #title> {{t('Header')}} </template>
      </Editor>
    </div>
    <div class="dev-toys-jwt-editor">
      <Editor
        :value="page.jwt.payload"
        language="json">
        <template #title> {{t('Payload')}} </template>
      </Editor>
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
