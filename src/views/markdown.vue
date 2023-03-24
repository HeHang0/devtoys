<script setup lang="ts">
import { ref } from "vue";
import { marked } from "marked";
import Editor from "@/components/Editor.vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
import { highlightCode } from "@/utils/formatter";
const page = usePageStore();
const { t } = useLanguageStore();
const previewHtmlContent = ref('');

function markdownChange(text: string) {
  previewHtmlContent.value = marked(text, {
    highlight: highlightCode
  });
}
</script>

<template>
  <div class="devtoys-markdown">
    <div class="devtoys-markdown-editor">
      <Editor
        :value="page.markdown.text"
        language="markdown"
        @delayInput="markdownChange">
        <template #title> MarkDown </template>
      </Editor>
    </div>
    <div class="devtoys-markdown-preview" v-html="previewHtmlContent">
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-markdown {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;

  &-preview,
  &-editor {
    width: calc(50% - 5px);
    height: 100%;
  }
  &-preview {
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color);
    padding: 8px;
    overflow: auto;
    background: var(--el-bg-color);
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
}
</style>
<style lang="less">
.devtoys-markdown {
  &-preview {
    h1 {
      display: block;
      font-size: 2em;
      margin-block-start: 0.67em;
      margin-block-end: 0.67em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-weight: bold;
    }
  }
}
html.dark {
  .devtoys-markdown-preview {
    pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px;font-family: Courier}.hljs{color:#abb2bf;background:#282c34;border-radius: 4px}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}
  }
}
html.light {
  .devtoys-markdown-preview {
    pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px;font-family: Courier}.hljs{color:#383a42;background:#fafafa;border-radius: 4px}.hljs-comment,.hljs-quote{color:#a0a1a7;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#a626a4}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e45649}.hljs-literal{color:#0184bb}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#50a14f}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#986801}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#4078f2}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#c18401}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}  }
}
</style>