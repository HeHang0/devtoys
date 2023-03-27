<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled, List } from '@element-plus/icons-vue';
import ClipboardPaste from '@/components/ClipboardPaste.vue';
import { FileReaderType, usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import Editor from '@/components/Editor.vue';
const page = usePageStore();
const imageRef = ref();
const loading = ref(false);
const { t } = useLanguageStore();
let currentFile: File | null;
function readFile(file: File | null) {
  if (!file || !file.type.includes('image')) return false;
  currentFile = file;
  loading.value = true;
  page.base64img.image = URL.createObjectURL(file);
  return false;
}

function imageLoad() {
  if (page.base64img.image && page.base64img.image.startsWith('blob:')) {
    URL.revokeObjectURL(page.base64img.image);
    if (
      imageRef.value &&
      page.base64img.text !== page.base64img.image &&
      currentFile
    ) {
      const reader = new FileReader();
      reader.onload = function () {
        page.base64img.text = reader.result?.toString() || '';
        loading.value = false;
      };
      reader.onerror = function () {
        loading.value = false;
      };
      reader.readAsDataURL(currentFile);
    } else {
      loading.value = false;
    }
  }
}

function onPaste(pasteType: any, result: File | string, fileType?: string) {
  const resultFile = result as File;
  if (
    pasteType == 'file' &&
    fileType &&
    fileType.includes('image') &&
    resultFile.size < 1024 * 1024 * 10
  ) {
    readFile(resultFile);
  }
}

function base64Change() {
  page.base64img.image = page.base64img.text;
}
</script>

<template>
  <div class="devtoys-base64img">
    <Title>
      <template #title>
        {{ t('Image') }}
      </template>
      <el-radio-group
        v-model="page.fileReaderType"
        size="small"
        @change="page.fileReaderTypeChange">
        <el-radio-button :label="FileReaderType.File">{{
          t('File')
        }}</el-radio-button>
        <el-radio-button :label="FileReaderType.Clipboard">{{
          t('Clipboard')
        }}</el-radio-button>
      </el-radio-group>
    </Title>
    <div class="devtoys-base64img-reader">
      <div class="devtoys-base64img-reader-type">
        <ClipboardPaste
          v-if="page.fileReaderType === FileReaderType.Clipboard"
          @change="onPaste">
          <el-icon class="devtoys-icon--paste">
            <List />
          </el-icon>
          <div class="devtoys-paste__text">
            {{ t('Paste Files Here') }}
          </div>
        </ClipboardPaste>
        <el-upload
          v-else
          drag
          :show-file-list="false"
          :before-upload="readFile">
          <el-icon class="el-icon--upload">
            <UploadFilled />
          </el-icon>
          <div class="el-upload__text">
            {{ t('Drop Files Here') }} {{ t('or') }}
            <em>{{ t('Click to Open') }}</em>
          </div>
        </el-upload>
      </div>
      <div class="devtoys-base64img-reader-image el-upload-dragger disable">
        <img
          v-if="page.base64img.image"
          ref="imageRef"
          :src="page.base64img.image"
          @load="imageLoad" />
      </div>
    </div>
    <div class="devtoys-base64img-editor" v-loading="loading">
      <Editor
        v-model:value="page.base64img.text"
        language="text"
        @delayInput="base64Change" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-base64img {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    height: 456px;
    width: 100%;
  }

  &-reader {
    display: flex;
    width: 100%;
    height: 187.4px;
    margin-bottom: 20px;

    &-type {
      flex: 1;

      & > div,
      & > div > .el-upload {
        height: 100%;
      }
    }

    &-image {
      width: 200px;
      height: 100%;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &.disable {
        border-color: var(--el-border-color);
        cursor: default;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
