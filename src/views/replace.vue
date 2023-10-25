<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import { CopyDocument, Close } from '@element-plus/icons-vue';
import { usePageStore, TextReplaceType } from '../stores/page';
import { useLanguageStore } from '../stores/language';
const page = usePageStore();
const { t } = useLanguageStore();
</script>

<template>
  <div class="devtoys-replace">
    <div class="devtoys-replace-generate">
      <el-radio-group v-model="page.replace.replaceType">
        <el-radio-button :label="TextReplaceType.BeginningOfLine">{{
          t('Start of Line')
        }}</el-radio-button>
        <el-radio-button :label="TextReplaceType.EndOfLine">{{
          t('End of Line')
        }}</el-radio-button>
        <el-radio-button :label="TextReplaceType.Text">{{
          t('Text')
        }}</el-radio-button>
        <el-radio-button :label="TextReplaceType.Regex">{{
          t('Regex')
        }}</el-radio-button>
      </el-radio-group>
      <el-input
        v-model="page.replace.find"
        :placeholder="t('Find')"
        v-if="
          page.replace.replaceType == TextReplaceType.Text ||
          page.replace.replaceType == TextReplaceType.Regex
        " />
      <el-input v-model="page.replace.replace" :placeholder="t('Replace')" />
      <el-button plain type="primary" @click="page.textReplace">
        {{ t('Replace') }}
      </el-button>
    </div>
    <div class="devtoys-replace-editor">
      <Editor v-model:value="page.replace.text" language="text">
        <template #title>{{ t('Text') }}</template>
      </Editor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-replace {
  height: 100%;
  width: 100%;
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
    @media (max-width: 850px) {
      flex-direction: column;
      align-items: unset;
    }
    .el-input {
      width: 200px;
      margin-left: 10px;
      @media (max-width: 850px) {
        width: 100%;
        margin-left: 0;
        margin-top: 10px;
      }
    }
    button {
      margin-left: 20px;
      width: 84px;
      @media (max-width: 850px) {
        width: 100%;
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
