<script setup lang="ts">
import { onMounted } from 'vue';
import { marked } from 'marked';
import { Printer } from '@element-plus/icons-vue';
import Editor from '@/components/Editor.vue';
import Title from '@/components/Title.vue';
import { usePageStore } from '../stores/page';
import { useSettingsStore } from '../stores/settings';
import { useLanguageStore } from '../stores/language';
import { highlightCode } from '@/utils/formatter';
import { downloadTextAsFile, hljsCSS, printHtml } from '@/utils/utils';

const page = usePageStore();
const settings = useSettingsStore();
const { t } = useLanguageStore();

const renderer = new marked.Renderer();
renderer.code;
renderer.image = function (
  href: string | null,
  title: string | null,
  text: string
) {
  let onerror = '';
  if (settings.imageProxy) {
    const proxyHref = settings.imageProxy + encodeURIComponent(href || '');
    onerror = `onerror="this.onerror=null; this.src='${proxyHref}'"`;
  }
  return `<img class="devtoys-markdown-preview-image" ${onerror} src="${href}" alt="${text}" title="${title}" />`;
};
renderer.code = function (
  code: string,
  language: string | undefined,
  isEscaped: boolean
) {
  return highlightCode(code, language || '') as string;
};
renderer.html = function (html: string) {
  console.log('这是html', html);
  return html;
};

function markdownChange(text: string) {
  marked
    .parse(text, {
      mangle: false,
      async: true,
      headerIds: false,
      renderer: renderer
      // highlight: highlightCode as any
    })
    .then(parseResult => {
      page.markdown.previewHtmlContent = parseResult;
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

function htmlContent() {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Markdown</title>
    <style>
      img{max-width: 100%}
    </style>
    ${hljsCSS}
</head>
<body>
  ${page.markdown.previewHtmlContent}
</body>
</html>`;
  return htmlContent;
}

function exportHtml() {
  if (!page.markdown.previewHtmlContent) return;
  downloadTextAsFile(htmlContent(), 'markdown.html');
}

function printMarkdown() {
  if (!page.markdown.previewHtmlContent) return;
  printHtml(htmlContent());
}
</script>

<template>
  <div class="devtoys-markdown">
    <div class="devtoys-markdown-editor">
      <Editor
        v-model:value="page.markdown.text"
        language="markdown"
        @delayInput="markdownChange">
        <template #title> MarkDown </template>
      </Editor>
    </div>
    <div class="devtoys-markdown-preview">
      <Title>
        <el-button
          plain
          size="small"
          :title="t('Export') + ' Html'"
          @click="exportHtml">
          <el-icon>
            <i class="devtoys-icon">&#x107;</i>
          </el-icon>
        </el-button>
        <el-button
          plain
          size="small"
          :icon="Printer"
          :title="t('Print') + ' Html'"
          @click="printMarkdown">
        </el-button>
      </Title>
      <div
        class="devtoys-markdown-preview-body"
        v-html="page.markdown.previewHtmlContent"></div>
    </div>
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
    &-body {
      height: calc(100% - 30px);
      border-radius: var(--el-border-radius-base);
      border: 1px solid var(--el-border-color);
      padding: 8px;
      overflow: auto;
      background: var(--el-bg-color);
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
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
    &-image {
      max-width: 100%;
    }
  }
}
pre code.hljs {
  padding: 1em;
}
html.dark {
  .devtoys-markdown-preview-body {
    .hljs {
      background: #282c34;
    }
  }
}
html.light {
  .devtoys-markdown-preview-body {
    .hljs {
      background: #fafafa;
    }
  }
}
</style>
