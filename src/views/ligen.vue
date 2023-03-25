<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { CopyDocument, Close } from '@element-plus/icons-vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
const copyText = () => navigator.clipboard.writeText(page.ligen.article);
</script>

<template>
  <div class="devtoys-ligen">
    <div class="devtoys-ligen-generate">
      <span>{{ t('Topic') }}</span>
      <el-input v-model="page.ligen.topic" />
      <el-button plain type="primary" @click="page.generateLigen">
        {{ t('Generate article') }}
      </el-button>
    </div>
    <div class="devtoys-ligen-editor">
      <Editor :value="page.ligen.article" language="text">
        <template #title>{{ t('Article') }}</template>
        <template #operate>
          <el-button
            plain
            :icon="CopyDocument"
            @click="copyText"
            :title="t('Copy')"
            size="small"
            style="margin-left: 12px" />
          <el-button
            plain
            :icon="Close"
            @click="page.ligen.article = ''"
            :title="t('Clear')"
            size="small"
            style="margin-left: 12px" />
        </template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-ligen {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  // justify-content: space-between;
  flex-direction: column;

  &-editor {
    flex: 1;
    width: 100%;
    margin-top: 20px;
  }
  &-generate {
    display: flex;
    align-items: center;
    .el-input {
      flex: 1;
    }
    button {
      margin-left: 20px;
      width: 84px;
    }
  }
}
</style>
