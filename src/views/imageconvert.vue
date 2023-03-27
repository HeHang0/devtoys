<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { UploadFilled, Download, List } from '@element-plus/icons-vue';
import ClipboardPaste from '@/components/ClipboardPaste.vue';
import { FileReaderType, usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import { convertImage, ImageType } from '@/utils/utils';
const page = usePageStore();
const imageUrl = ref('');
const imageRef = ref();
const downloading = ref(false);
let fileName = '';
const { t } = useLanguageStore();
function readFile(file: File | null) {
  if (!file || !file.type.includes('image')) return false;
  fileName = file.name.replace(/\.[a-zA-Z]+$/, '');
  imageUrl.value = URL.createObjectURL(file);
  return false;
}

function imageLoad() {
  imageUrl.value && URL.revokeObjectURL(imageUrl.value);
}

function downloadImage() {
  if (!imageUrl.value || !imageRef.value || downloading.value) return;
  downloading.value = true;
  convertImage(imageRef.value, page.image.convertType, page.image.quality)
    .then(r => {
      const a = document.createElement('a');
      a.href = r;
      a.download = `${fileName}.${page.image.convertType}`;
      a.click();
      URL.revokeObjectURL(r);
    })
    .finally(() => {
      downloading.value = false;
    });
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

const imageQualities = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
const imageTypes = Object.keys(ImageType).map(m => ({
  key: m,
  value: Object(ImageType)[m]
}));

onMounted(() => {
  if (page.fileReaderType === FileReaderType.Camera)
    page.fileReaderType = FileReaderType.File;
});
</script>

<template>
  <div class="devtoys-image">
    <SettingCard :title="t('Image Type')">
      <template #icon>
        <span class="devtoys-icon"> &#x127; </span>
      </template>
      <el-select v-model="page.image.convertType" size="small">
        <el-option
          v-for="it in imageTypes"
          :key="it.key"
          :label="it.key"
          :value="it.value" />
      </el-select>
    </SettingCard>
    <SettingCard :title="t('Quality')">
      <template #icon>
        <span class="devtoys-icon"> &#x116; </span>
      </template>
      <el-select v-model="page.image.quality" size="small">
        <el-option
          v-for="quality in imageQualities"
          :key="quality"
          :label="quality * 10"
          :value="quality" />
      </el-select>
    </SettingCard>
    <Title>
      <template #title>
        {{ t('Image') }}
      </template>
      <el-radio-group
        v-model="page.fileReaderType"
        size="small"
        @change="page.fileReaderType">
        <el-radio-button :label="FileReaderType.File">{{
          t('File')
        }}</el-radio-button>
        <el-radio-button :label="FileReaderType.Clipboard">{{
          t('Clipboard')
        }}</el-radio-button>
      </el-radio-group>
    </Title>
    <div class="devtoys-image-reader">
      <div class="devtoys-image-reader-type">
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
      <div
        class="devtoys-image-reader-download el-upload-dragger"
        :class="imageUrl ? '' : 'disable'"
        v-loading="downloading"
        @click="downloadImage">
        <el-icon class="el-icon--upload">
          <Download />
        </el-icon>
        <div class="el-upload__text">
          <em>{{ t('Download') }}</em>
        </div>
      </div>
    </div>
    <div v-if="imageUrl" class="devtoys-image-output">
      <img ref="imageRef" :src="imageUrl" @load="imageLoad" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-image {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    flex: 1;
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

      video {
        width: 100%;
        height: 100%;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
      }
    }

    &-download {
      width: 200px;
      height: 100%;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &.disable {
        border-color: var(--el-border-color);
        cursor: not-allowed;
      }
    }
    @media (max-width: 850px) {
      height: 150px;
      &-download {
        width: 125px;
      }
      :deep(.el-upload) {
        height: 100%;
        .el-upload-dragger {
          padding: 10px;
          height: 100%;
        }
      }
    }
  }
  &-output {
    width: 100%;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
