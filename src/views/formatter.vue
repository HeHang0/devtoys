<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import Title from '@/components/Title.vue';
import { CopyDocument, List, Document } from '@element-plus/icons-vue';
import { usePageStore } from '../stores/page';
import { useLanguageStore } from '../stores/language';
import { readTextFile } from '@/utils/utils';
import { useRouter } from 'vue-router';
const page = usePageStore();
const { t } = useLanguageStore();
const { currentRoute } = useRouter();
</script>

<template>
  <div class="devtoys-formatter">
    <div class="devtoys-formatter-editor">
      <Editor
        v-model:value="page.formatter.text"
        :uglify="currentRoute.meta.key != 'sql'"
        :language="`${currentRoute.meta.key}` || 'json'" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.devtoys-formatter {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;

  &-editor {
    width: 100%;
    height: 100%;
  }
}
</style>
