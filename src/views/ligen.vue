<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import SettingCard from '@/components/SettingCard.vue';
import { CopyDocument, Close } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const { t } = useLanguageStore();
const copyText = () => navigator.clipboard.writeText(page.ligen.article)
</script>

<template>
  <div class="dev-toys-ligen">
    <div class="dev-toys-ligen-generate">
      <span>主题：</span>
      <el-input v-model="page.ligen.topic"/>
      <el-button type="primary"  @click="page.generateLigen">
        {{ t('Generate article') }}
      </el-button>
    </div>
    <div class="dev-toys-ligen-editor">
      <MonacoEditor
        :value="page.ligen.article"
        :readonly="true"
        language="text">
        <template #title>{{ t('Article') }}</template>
        <template #operate>
          <el-button
            plain
            :icon="CopyDocument"
            @click="copyText"
            :title="t('Copy')"
            size="small"
            style="margin-left: 12px"
          />
          <el-button
            plain
            :icon="Close"
            @click="page.ligen.article=''"
            :title="t('Clear')"
            size="small"
            style="margin-left: 12px"
          />
        </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-ligen {
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
      flex: 1
    }
    button {
      margin-left: 20px;
      width: 84px;
    }
  }
}
</style>