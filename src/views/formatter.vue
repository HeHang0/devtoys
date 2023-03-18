<script setup lang="ts">
import MonacoEditor from "@/components/MonacoEditor.vue";
import Title from "@/components/Title.vue";
import { CopyDocument, List, Document } from "@element-plus/icons-vue";
import { usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
import { readTextFile } from "@/utils/utils";
import { useRouter } from "vue-router";
const page = usePageStore();
const { t } = useLanguageStore();
const copyText = () => navigator.clipboard.writeText(page.formatter.text);
const pasteText = () =>
  navigator.clipboard
    .readText()
    .then((r) => page.formatterTextChange(r, currentRoute.value.meta.key as string))
    .catch(() => {});

function readFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => page.formatterTextChange(r, currentRoute.value.meta.key as string))
    .catch(ElMessage.warning);
  return false;
}
const { currentRoute } = useRouter()
const language = 'json'
</script>

<template>
  <div class="dev-toys-formatter">
    <div class="dev-toys-formatter-editor">
      <Title>
        <!-- <template #title>  </template> -->
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readFile"
        >
          <el-button
            plain
            :icon="Document"
            size="small"
            :title="t('Read from file')"
          />
        </el-upload>
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteText"
          size="small"
          :title="t('Paste')"
        />
      </Title>
      <MonacoEditor
        :value="page.formatter.text"
        :language="`${currentRoute.meta.key}` || 'json'"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-formatter {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;

  &-editor {
    width: 100%;
    height: calc(100% - 30px);
  }
}
</style>
