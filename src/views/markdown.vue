<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { marked } from 'marked';
import Editor from '@/components/Editor.vue';
import { usePageStore } from '../stores/page';
import { highlightCode } from '@/utils/formatter';
const page = usePageStore();

function markdownChange(text: string) {
  page.markdown.previewHtmlContent = marked(text, {
    highlight: highlightCode
  });
}

onMounted(() => {
  fetch('https://raw.githubusercontent.com/HeHang0/devtoys/master/README.md')
    .then(r => r.text())
    .then(r => {
      if (!page.markdown.text) {
        page.markdown.text = r;
        markdownChange(r);
      }
    });
});
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
    <div
      class="devtoys-markdown-preview"
      v-html="page.markdown.previewHtmlContent"></div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-markdown {
  width: 100%;
  height: 100%;
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
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  @media (max-width: 850px) {
    flex-direction: column;
    &-preview,
    &-editor {
      width: 100%;
      height: 456px;
      margin-bottom: 10px;
    }
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
pre code.hljs {
  padding: 1em;
}
html.dark {
  .devtoys-markdown-preview {
    .hljs {
      background: #282c34;
    }
  }
}
html.light {
  .devtoys-markdown-preview {
    .hljs {
      background: #fafafa;
    }
  }
}
</style>
